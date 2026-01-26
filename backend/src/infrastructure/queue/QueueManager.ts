/**
 * Queue Manager - Production-grade job queue with Bull/BullMQ
 * 
 * Features:
 * - Idempotency
 * - Retry with exponential backoff
 * - Dead-letter queue
 * - Priority queues
 * - Rate limiting
 * - Distributed locking
 */

import { Queue, Worker, Job, QueueEvents } from "bullmq";
import Redis from "ioredis";
import { Logger } from "../../shared/logging/Logger";

// ============================================================================
// TYPES
// ============================================================================

export interface JobPayload {
  correlationId: string;
  runId?: string;
  data: Record<string, any>;
}

export interface JobOptions {
  priority?: number; // 1-10 (10 = highest)
  delay?: number; // milliseconds
  attempts?: number;
  backoff?: {
    type: "exponential" | "fixed";
    delay: number;
  };
  idempotencyKey?: string;
}

export type JobHandler<T = any> = (
  job: Job<JobPayload>,
  logger: Logger
) => Promise<T>;

// ============================================================================
// QUEUE MANAGER
// ============================================================================

export class QueueManager {
  private readonly redis: Redis;
  private readonly queues: Map<string, Queue> = new Map();
  private readonly workers: Map<string, Worker> = new Map();
  private readonly events: Map<string, QueueEvents> = new Map();
  private readonly logger: Logger;

  constructor(redisConfig: { host: string; port: number; password?: string }, logger: Logger) {
    this.redis = new Redis(redisConfig);
    this.logger = logger;
  }

  /**
   * Create or get a queue
   */
  getQueue(name: string): Queue {
    if (!this.queues.has(name)) {
      const queue = new Queue(name, {
        connection: this.redis,
        defaultJobOptions: {
          attempts: 3,
          backoff: {
            type: "exponential",
            delay: 2000,
          },
          removeOnComplete: {
            count: 100, // Keep last 100 completed jobs
          },
          removeOnFail: {
            count: 1000, // Keep last 1000 failed jobs
          },
        },
      });

      this.queues.set(name, queue);

      // Set up events
      const events = new QueueEvents(name, {
        connection: this.redis,
      });

      events.on("completed", ({ jobId }) => {
        this.logger.info("Job completed", { queue: name, jobId });
      });

      events.on("failed", ({ jobId, failedReason }) => {
        this.logger.error("Job failed", { queue: name, jobId, failedReason });
      });

      this.events.set(name, events);
    }

    return this.queues.get(name)!;
  }

  /**
   * Add a job to the queue with idempotency
   */
  async addJob(
    queueName: string,
    payload: JobPayload,
    options: JobOptions = {}
  ): Promise<Job> {
    const queue = this.getQueue(queueName);

    // Check idempotency
    if (options.idempotencyKey) {
      const existing = await this.checkIdempotency(options.idempotencyKey);
      if (existing) {
        this.logger.info("Job already exists (idempotency)", {
          queueName,
          idempotencyKey: options.idempotencyKey,
          existingJobId: existing,
        });
        return queue.getJob(existing) as Promise<Job>;
      }
    }

    const job = await queue.add(queueName, payload, {
      priority: options.priority || 5,
      delay: options.delay || 0,
      attempts: options.attempts || 3,
      backoff: options.backoff || {
        type: "exponential",
        delay: 2000,
      },
      jobId: options.idempotencyKey, // Use idempotency key as job ID
    });

    // Store idempotency mapping
    if (options.idempotencyKey) {
      await this.storeIdempotency(options.idempotencyKey, job.id!);
    }

    this.logger.info("Job added to queue", {
      queueName,
      jobId: job.id,
      correlationId: payload.correlationId,
      priority: options.priority,
    });

    return job;
  }

  /**
   * Register a worker to process jobs
   */
  registerWorker(
    queueName: string,
    handler: JobHandler,
    options: {
      concurrency?: number;
      limiter?: {
        max: number;
        duration: number;
      };
    } = {}
  ): Worker {
    if (this.workers.has(queueName)) {
      throw new Error(`Worker already registered for queue: ${queueName}`);
    }

    const worker = new Worker(
      queueName,
      async (job: Job<JobPayload>) => {
        this.logger.info("Processing job", {
          queueName,
          jobId: job.id,
          correlationId: job.data.correlationId,
          attempt: job.attemptsMade + 1,
        });

        try {
          const result = await handler(job, this.logger);

          this.logger.info("Job processed successfully", {
            queueName,
            jobId: job.id,
            correlationId: job.data.correlationId,
          });

          return result;
        } catch (error) {
          this.logger.error("Job processing failed", {
            queueName,
            jobId: job.id,
            correlationId: job.data.correlationId,
            error: error instanceof Error ? error.message : String(error),
            attempt: job.attemptsMade + 1,
          });

          // Check if we should move to dead-letter queue
          if (job.attemptsMade >= (job.opts.attempts || 3) - 1) {
            await this.moveToDeadLetter(queueName, job, error);
          }

          throw error;
        }
      },
      {
        connection: this.redis,
        concurrency: options.concurrency || 5,
        limiter: options.limiter,
      }
    );

    worker.on("completed", (job) => {
      this.logger.info("Worker completed job", {
        queueName,
        jobId: job.id,
      });
    });

    worker.on("failed", (job, error) => {
      this.logger.error("Worker failed to process job", {
        queueName,
        jobId: job?.id,
        error: error.message,
      });
    });

    this.workers.set(queueName, worker);
    return worker;
  }

  /**
   * Check if a job with this idempotency key already exists
   */
  private async checkIdempotency(key: string): Promise<string | null> {
    return await this.redis.get(`idempotency:${key}`);
  }

  /**
   * Store idempotency mapping
   */
  private async storeIdempotency(key: string, jobId: string): Promise<void> {
    // Store for 24 hours
    await this.redis.setex(`idempotency:${key}`, 86400, jobId);
  }

  /**
   * Move failed job to dead-letter queue
   */
  private async moveToDeadLetter(
    queueName: string,
    job: Job,
    error: any
  ): Promise<void> {
    const deadLetterQueue = this.getQueue(`${queueName}:dead-letter`);

    await deadLetterQueue.add(
      "dead-letter",
      {
        originalQueue: queueName,
        originalJobId: job.id,
        payload: job.data,
        error: error instanceof Error ? error.message : String(error),
        errorStack: error instanceof Error ? error.stack : undefined,
        attemptsMade: job.attemptsMade,
        timestamp: new Date().toISOString(),
      },
      {
        priority: 1, // Low priority
      }
    );

    this.logger.warn("Job moved to dead-letter queue", {
      queueName,
      jobId: job.id,
      correlationId: job.data.correlationId,
      error: error instanceof Error ? error.message : String(error),
    });
  }

  /**
   * Get queue metrics
   */
  async getMetrics(queueName: string) {
    const queue = this.getQueue(queueName);

    const [waiting, active, completed, failed, delayed] = await Promise.all([
      queue.getWaitingCount(),
      queue.getActiveCount(),
      queue.getCompletedCount(),
      queue.getFailedCount(),
      queue.getDelayedCount(),
    ]);

    return {
      waiting,
      active,
      completed,
      failed,
      delayed,
      total: waiting + active + completed + failed + delayed,
    };
  }

  /**
   * Pause a queue
   */
  async pauseQueue(queueName: string): Promise<void> {
    const queue = this.getQueue(queueName);
    await queue.pause();
    this.logger.info("Queue paused", { queueName });
  }

  /**
   * Resume a queue
   */
  async resumeQueue(queueName: string): Promise<void> {
    const queue = this.getQueue(queueName);
    await queue.resume();
    this.logger.info("Queue resumed", { queueName });
  }

  /**
   * Clean old jobs
   */
  async cleanQueue(
    queueName: string,
    grace: number = 86400000 // 24 hours
  ): Promise<void> {
    const queue = this.getQueue(queueName);
    await queue.clean(grace, 1000, "completed");
    await queue.clean(grace, 1000, "failed");
    this.logger.info("Queue cleaned", { queueName, grace });
  }

  /**
   * Close all connections
   */
  async close(): Promise<void> {
    await Promise.all([
      ...Array.from(this.queues.values()).map((q) => q.close()),
      ...Array.from(this.workers.values()).map((w) => w.close()),
      ...Array.from(this.events.values()).map((e) => e.close()),
    ]);

    await this.redis.quit();
    this.logger.info("QueueManager closed");
  }
}

// ============================================================================
// QUEUE NAMES (CONSTANTS)
// ============================================================================

export const QUEUE_NAMES = {
  SCOUT: "scout",
  INDEX: "index",
  RANK: "rank",
  READER: "reader",
  ANALYST: "analyst",
  CLAIM_EXTRACTOR: "claim-extractor",
  EVIDENCE_BINDER: "evidence-binder",
  TRUST_SCORER: "trust-scorer",
  CONTRADICTION_DETECTOR: "contradiction-detector",
  EDITOR: "editor",
  PUBLISHER: "publisher",
} as const;

/**
 * Use Case: Create Analysis Run
 */

import { generateCorrelationId } from "../../shared/utils/correlation-id";
import { IClaimRepository } from "../../domain/claim/repositories/IClaimRepository";
import { Logger } from "../../shared/logging/Logger";
import { QueueManager, QUEUE_NAMES } from "../../infrastructure/queue/QueueManager";

export interface CreateAnalysisRunInput {
  question: string;
  mode: "brief" | "council";
  providers?: string[];
  maxSources?: number;
  userId?: string;
}

export interface CreateAnalysisRunOutput {
  runId: string;
  correlationId: string;
  status: string;
  message: string;
}

export class CreateAnalysisRun {
  constructor(
    private readonly queueManager: QueueManager,
    private readonly logger: Logger
  ) {}

  async execute(input: CreateAnalysisRunInput): Promise<CreateAnalysisRunOutput> {
    const correlationId = generateCorrelationId();
    const runId = crypto.randomUUID();

    this.logger.info("Creating analysis run", {
      correlationId,
      runId,
      question: input.question,
      mode: input.mode,
    });

    // Enqueue SCOUT job
    await this.queueManager.addJob(
      QUEUE_NAMES.SCOUT,
      {
        correlationId,
        runId,
        data: {
          question: input.question,
          providers: input.providers || ["openalex", "crossref"],
          maxSources: input.maxSources || 12,
        },
      },
      {
        priority: 8,
        idempotencyKey: `scout-${runId}`,
      }
    );

    return {
      runId,
      correlationId,
      status: "PENDING",
      message: "Analysis run created successfully",
    };
  }
}

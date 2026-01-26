/**
 * Background Worker - Processes jobs from Redis queues
 */

import { createLogger } from "../../shared/logging/Logger";
import { QueueManager, QUEUE_NAMES } from "./QueueManager";
import { getQueueConfig } from "../../config/queue";
import { getPrismaClient } from "../persistence/prisma/client";
import { ClaimRepository } from "../persistence/repositories/ClaimRepository";
import { ClaimExtractor } from "../../domain/claim/services/ClaimExtractor";
import { EvidenceBinder } from "../../domain/evidence/services/EvidenceBinder";
import { TrustScorer } from "../../domain/claim/services/TrustScorer";
import OpenAI from "openai";
import { getAIConfig } from "../../config/ai";

const logger = createLogger({ service: "worker" });

async function bootstrap() {
  logger.info("Starting worker...");

  // Initialize dependencies
  const queueConfig = getQueueConfig();
  const aiConfig = getAIConfig();
  const prisma = getPrismaClient();
  
  const queueManager = new QueueManager(queueConfig.redis, logger);
  const claimRepository = new ClaimRepository(prisma);
  
  const openai = new OpenAI({ apiKey: aiConfig.openai.apiKey });
  const claimExtractor = new ClaimExtractor(openai, logger);
  const evidenceBinder = new EvidenceBinder(openai, logger);
  const trustScorer = new TrustScorer(logger);

  // Register workers
  logger.info("Registering workers...");

  // CLAIM_EXTRACTOR worker
  queueManager.registerWorker(
    QUEUE_NAMES.CLAIM_EXTRACTOR,
    async (job, logger) => {
      const { runId, analysisText, correlationId } = job.data;

      logger.info("Extracting claims", { correlationId, runId });

      const claims = await claimExtractor.extract({
        runId,
        analysisText,
        correlationId,
      });

      // Save claims to database
      await claimRepository.saveMany(claims);

      logger.info("Claims extracted and saved", {
        correlationId,
        runId,
        claimCount: claims.length,
      });

      // Enqueue next step: EVIDENCE_BINDER
      await queueManager.addJob(
        QUEUE_NAMES.EVIDENCE_BINDER,
        {
          correlationId,
          runId,
          data: {
            claimIds: claims.map((c) => c.id),
          },
        },
        { priority: 6 }
      );

      return { claimsExtracted: claims.length };
    },
    { concurrency: 3 }
  );

  // EVIDENCE_BINDER worker
  queueManager.registerWorker(
    QUEUE_NAMES.EVIDENCE_BINDER,
    async (job, logger) => {
      const { runId, correlationId } = job.data;
      const { claimIds } = job.data.data;

      logger.info("Binding evidence", { correlationId, runId, claimIds });

      // TODO: Fetch claims and sources
      // TODO: Bind evidence
      // TODO: Save evidence spans

      logger.info("Evidence bound", { correlationId, runId });

      // Enqueue next step: TRUST_SCORER
      await queueManager.addJob(
        QUEUE_NAMES.TRUST_SCORER,
        {
          correlationId,
          runId,
          data: { claimIds },
        },
        { priority: 5 }
      );

      return { evidenceBound: claimIds.length };
    },
    { concurrency: 3 }
  );

  // TRUST_SCORER worker
  queueManager.registerWorker(
    QUEUE_NAMES.TRUST_SCORER,
    async (job, logger) => {
      const { runId, correlationId } = job.data;

      logger.info("Computing trust scores", { correlationId, runId });

      // TODO: Fetch claims and evidence
      // TODO: Compute trust scores
      // TODO: Update claims with trust scores

      logger.info("Trust scores computed", { correlationId, runId });

      return { trustScoresComputed: true };
    },
    { concurrency: 5 }
  );

  logger.info("Worker started successfully");

  // Graceful shutdown
  process.on("SIGTERM", async () => {
    logger.info("SIGTERM received, shutting down worker");
    await queueManager.close();
    process.exit(0);
  });
}

bootstrap().catch((error) => {
  logger.error("Failed to start worker", { error: error.message });
  process.exit(1);
});

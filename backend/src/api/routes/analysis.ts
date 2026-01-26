/**
 * Analysis API Routes
 */

import { Router } from "express";
import { CreateAnalysisRun } from "../../application/usecases/CreateAnalysisRun";
import { QueueManager } from "../../infrastructure/queue/QueueManager";
import { getQueueConfig } from "../../config/queue";
import { createLogger } from "../../shared/logging/Logger";
import { CreateAnalysisRunRequestSchema } from "../contracts/analysis.contract";

const router = Router();
const logger = createLogger({ service: "analysis-routes" });

// Initialize use cases
const queueConfig = getQueueConfig();
const queueManager = new QueueManager(queueConfig.redis, logger);
const createAnalysisRun = new CreateAnalysisRun(queueManager, logger);

/**
 * POST /api/v1/analysis
 * Create new analysis run
 */
router.post("/", async (req, res, next) => {
  try {
    const input = CreateAnalysisRunRequestSchema.parse(req.body);

    const result = await createAnalysisRun.execute({
      question: input.question,
      mode: input.mode,
      providers: input.providers,
      maxSources: input.maxSources,
    });

    res.status(201).json({
      run: {
        id: result.runId,
        correlationId: result.correlationId,
        status: result.status,
        question: input.question,
        mode: input.mode,
        createdAt: new Date().toISOString(),
      },
      message: result.message,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/v1/analysis/:runId
 * Get analysis run details
 */
router.get("/:runId", async (req, res, next) => {
  try {
    const { runId } = req.params;

    // TODO: Implement get run logic
    res.json({
      run: {
        id: runId,
        status: "PENDING",
        message: "Analysis in progress",
      },
    });
  } catch (error) {
    next(error);
  }
});

export const analysisRouter = router;

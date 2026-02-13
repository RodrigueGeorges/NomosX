/**
 * NomosX API Server
 */

import express from "express";
import helmet from "helmet";
import { createLogger } from "../shared/logging/Logger";
import { getPrismaClient } from "../infrastructure/persistence/prisma/client";
import { QueueManager } from "../infrastructure/queue/QueueManager";
import { getQueueConfig } from "../config/queue";
import { correlationIdMiddleware } from "./middleware/correlationId";
import { errorHandlerMiddleware } from "./middleware/errorHandler";
import { analysisRouter } from "./routes/analysis";

const logger = createLogger({ service: "api-server" });

async function bootstrap() {
  const app = express();
  const port = parseInt(process.env.PORT || "3000");

  // Security middleware
  app.use(helmet());
  app.use(express.json({ limit: "10mb" }));
  app.use(express.urlencoded({ extended: true }));

  // Correlation ID middleware
  app.use(correlationIdMiddleware);

  // Health check
  app.get("/health", (req, res) => {
    res.json({
      status: "healthy",
      timestamp: new Date().toISOString(),
      version: "2.0.0",
    });
  });

  // API routes
  app.use("/api/v1/analysis", analysisRouter);

  // Error handler (must be last)
  app.use(errorHandlerMiddleware);

  // Start server
  app.listen(port, () => {
    logger.info(`API server listening on port ${port}`);
  });

  // Graceful shutdown
  process.on("SIGTERM", async () => {
    logger.info("SIGTERM received, shutting down gracefully");
    process.exit(0);
  });
}

bootstrap().catch((error) => {
  logger.error("Failed to bootstrap server", { error: error.message });
  process.exit(1);
});

/**
 * Error Handler Middleware
 */

import { Request, Response, NextFunction } from "express";
import { DomainError } from "../../shared/errors/DomainError";
import { createLogger } from "../../shared/logging/Logger";

const logger = createLogger({ service: "error-handler" });

export function errorHandlerMiddleware(
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  logger.error("Request error", {
    correlationId: req.correlationId,
    error: error.message,
    stack: error.stack,
    path: req.path,
    method: req.method,
  });

  if (error instanceof DomainError) {
    res.status(error.statusCode).json({
      error: {
        code: error.code,
        message: error.message,
        correlationId: req.correlationId,
        timestamp: new Date().toISOString(),
      },
    });
    return;
  }

  // Generic error
  res.status(500).json({
    error: {
      code: "INTERNAL_SERVER_ERROR",
      message: "An unexpected error occurred",
      correlationId: req.correlationId,
      timestamp: new Date().toISOString(),
    },
  });
}

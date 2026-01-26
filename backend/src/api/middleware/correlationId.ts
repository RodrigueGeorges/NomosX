/**
 * Correlation ID Middleware
 */

import { Request, Response, NextFunction } from "express";
import { generateCorrelationId, extractCorrelationId } from "../../shared/utils/correlation-id";

declare global {
  namespace Express {
    interface Request {
      correlationId: string;
    }
  }
}

export function correlationIdMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const correlationId = extractCorrelationId(req.headers) || generateCorrelationId();
  
  req.correlationId = correlationId;
  res.setHeader("X-Correlation-Id", correlationId);
  
  next();
}

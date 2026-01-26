/**
 * Correlation ID utilities
 */

import crypto from "crypto";

export function generateCorrelationId(): string {
  return `nomosx-${Date.now()}-${crypto.randomBytes(8).toString("hex")}`;
}

export function extractCorrelationId(headers: Record<string, any>): string | undefined {
  return headers["x-correlation-id"] || headers["X-Correlation-Id"];
}

/**
 * Shared Types
 */

// ============================================================================
// COMMON TYPES
// ============================================================================

export type UUID = string;
export type ISODateString = string;
export type CorrelationId = string;

// ============================================================================
// RESULT TYPE (for error handling)
// ============================================================================

export type Result<T, E = Error> =
  | { success: true; value: T }
  | { success: false; error: E };

export function success<T>(value: T): Result<T, never> {
  return { success: true, value };
}

export function failure<E>(error: E): Result<never, E> {
  return { success: false, error };
}

// ============================================================================
// PAGINATION
// ============================================================================

export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface PaginatedResult<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// ============================================================================
// ASYNC OPERATIONS
// ============================================================================

export interface AsyncOperation<T> {
  id: string;
  status: "pending" | "running" | "completed" | "failed";
  result?: T;
  error?: string;
  startedAt?: Date;
  finishedAt?: Date;
  progress?: number;
}

// ============================================================================
// METRICS
// ============================================================================

export interface Metrics {
  duration: number;
  tokensUsed: number;
  costUsd: number;
  timestamp: Date;
}

// ============================================================================
// CONTEXT (for passing through layers)
// ============================================================================

export interface Context {
  correlationId: CorrelationId;
  userId?: string;
  requestId?: string;
  metadata?: Record<string, any>;
}

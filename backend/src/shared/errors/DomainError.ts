/**
 * Domain Errors - Business logic errors
 */

export abstract class DomainError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly statusCode: number = 400
  ) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

// ============================================================================
// CLAIM ERRORS
// ============================================================================

export class ClaimValidationError extends DomainError {
  constructor(message: string) {
    super(message, "CLAIM_VALIDATION_ERROR", 400);
  }
}

export class ClaimNotFoundError extends DomainError {
  constructor(claimId: string) {
    super(`Claim not found: ${claimId}`, "CLAIM_NOT_FOUND", 404);
  }
}

export class InsufficientEvidenceError extends DomainError {
  constructor(claimId: string, required: number, actual: number) {
    super(
      `Claim ${claimId} has insufficient evidence. Required: ${required}, Actual: ${actual}`,
      "INSUFFICIENT_EVIDENCE",
      400
    );
  }
}

// ============================================================================
// EVIDENCE ERRORS
// ============================================================================

export class EvidenceBindingError extends DomainError {
  constructor(message: string) {
    super(message, "EVIDENCE_BINDING_ERROR", 500);
  }
}

export class EvidenceNotFoundError extends DomainError {
  constructor(evidenceId: string) {
    super(`Evidence not found: ${evidenceId}`, "EVIDENCE_NOT_FOUND", 404);
  }
}

// ============================================================================
// TRUST ERRORS
// ============================================================================

export class TrustScoreError extends DomainError {
  constructor(message: string) {
    super(message, "TRUST_SCORE_ERROR", 500);
  }
}

export class LowTrustScoreError extends DomainError {
  constructor(score: number, threshold: number) {
    super(
      `Trust score ${score} is below threshold ${threshold}`,
      "LOW_TRUST_SCORE",
      400
    );
  }
}

// ============================================================================
// RUN ERRORS
// ============================================================================

export class RunNotFoundError extends DomainError {
  constructor(runId: string) {
    super(`Analysis run not found: ${runId}`, "RUN_NOT_FOUND", 404);
  }
}

export class RunAlreadyCompletedError extends DomainError {
  constructor(runId: string) {
    super(`Analysis run already completed: ${runId}`, "RUN_ALREADY_COMPLETED", 400);
  }
}

// ============================================================================
// COST ERRORS
// ============================================================================

export class CostLimitExceededError extends DomainError {
  constructor(cost: number, limit: number) {
    super(
      `Cost ${cost} exceeds limit ${limit}`,
      "COST_LIMIT_EXCEEDED",
      429
    );
  }
}

export class QuotaExceededError extends DomainError {
  constructor(userId: string, quotaType: string) {
    super(
      `User ${userId} exceeded ${quotaType} quota`,
      "QUOTA_EXCEEDED",
      429
    );
  }
}

// ============================================================================
// INFRASTRUCTURE ERRORS
// ============================================================================

export class DatabaseError extends DomainError {
  constructor(message: string, originalError?: Error) {
    super(message, "DATABASE_ERROR", 500);
    if (originalError) {
      this.stack = originalError.stack;
    }
  }
}

export class QueueError extends DomainError {
  constructor(message: string) {
    super(message, "QUEUE_ERROR", 500);
  }
}

export class ExternalAPIError extends DomainError {
  constructor(service: string, message: string) {
    super(`${service} API error: ${message}`, "EXTERNAL_API_ERROR", 502);
  }
}

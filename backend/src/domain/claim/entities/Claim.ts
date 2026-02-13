/**
 * Claim Entity - Core domain object
 * 
 * Represents a factual assertion extracted from analysis,
 * bound to evidence spans for verifiability and traceability.
 */

import { z } from 'zod';

// ============================================================================
// VALUE OBJECTS
// ============================================================================

export const ClaimTypeSchema = z.enum([
  "factual",       // "GDP growth was 2.3% in 2025"
  "causal",        // "Carbon tax led to 15% emissions reduction"
  "evaluative",    // "This policy is effective"
  "normative",     // "Governments should implement X"
]);

export type ClaimType = z.infer<typeof ClaimTypeSchema>;

export const CategorySchema = z.enum([
  "economic",
  "technical",
  "ethical",
  "political",
  "social",
  "environmental",
]);

export type Category = z.infer<typeof CategorySchema>;

// ============================================================================
// TRUST SCORE VALUE OBJECT
// ============================================================================

export class TrustScore {
  private readonly value: number; // 0-1

  constructor(value: number) {
    if (value < 0 || value > 1) {
      throw new Error(`Trust score must be between 0 and 1, got ${value}`);
    }
    this.value = value;
  }

  getValue(): number {
    return this.value;
  }

  getLevel(): "low" | "medium" | "high" {
    if (this.value < 0.4) return "low";
    if (this.value < 0.7) return "medium";
    return "high";
  }

  static fromComponents(components: {
    evidenceStrength: number;
    sourceQuality: number;
    citationCoverage: number;
    hasContradiction: boolean;
  }): TrustScore {
    // Weighted formula
    const baseScore =
      components.evidenceStrength * 0.4 +
      components.sourceQuality * 0.3 +
      components.citationCoverage * 0.3;

    // Penalty for contradictions
    const finalScore = components.hasContradiction
      ? baseScore * 0.6
      : baseScore;

    return new TrustScore(finalScore);
  }

  static zero(): TrustScore {
    return new TrustScore(0);
  }

  static perfect(): TrustScore {
    return new TrustScore(1);
  }
}

// ============================================================================
// CLAIM ENTITY
// ============================================================================

export interface ClaimProps {
  id: string;
  runId: string;
  sourceId?: string;
  text: string;
  claimType: ClaimType;
  category?: Category;
  confidence: number; // From LLM (0-1)
  trustScore?: TrustScore;
  evidenceCount: number;
  isVerified: boolean;
  verifiedBy?: string;
  verifiedAt?: Date;
  hasContradiction: boolean;
  contradictedBy: string[];
  extractedBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export class Claim {
  private constructor(private readonly props: ClaimProps) {}

  // ============================================================================
  // FACTORY METHODS
  // ============================================================================

  static create(data: Omit<ClaimProps, "id" | "createdAt" | "updatedAt">): Claim {
    const now = new Date();
    return new Claim({
      ...data,
      id: crypto.randomUUID(),
      createdAt: now,
      updatedAt: now,
    });
  }

  static fromPersistence(data: ClaimProps): Claim {
    return new Claim(data);
  }

  // ============================================================================
  // GETTERS
  // ============================================================================

  get id(): string {
    return this.props.id;
  }

  get runId(): string {
    return this.props.runId;
  }

  get text(): string {
    return this.props.text;
  }

  get claimType(): ClaimType {
    return this.props.claimType;
  }

  get category(): Category | undefined {
    return this.props.category;
  }

  get confidence(): number {
    return this.props.confidence;
  }

  get trustScore(): TrustScore | undefined {
    return this.props.trustScore;
  }

  get evidenceCount(): number {
    return this.props.evidenceCount;
  }

  get isVerified(): boolean {
    return this.props.isVerified;
  }

  get hasContradiction(): boolean {
    return this.props.hasContradiction;
  }

  get contradictedBy(): string[] {
    return [...this.props.contradictedBy];
  }

  // ============================================================================
  // BUSINESS LOGIC
  // ============================================================================

  /**
   * Verify this claim (by human or system)
   */
  verify(verifiedBy: string): void {
    this.props.isVerified = true;
    this.props.verifiedBy = verifiedBy;
    this.props.verifiedAt = new Date();
    this.props.updatedAt = new Date();
  }

  /**
   * Update trust score based on evidence
   */
  updateTrustScore(trustScore: TrustScore): void {
    this.props.trustScore = trustScore;
    this.props.updatedAt = new Date();
  }

  /**
   * Add evidence (increment count)
   */
  addEvidence(): void {
    this.props.evidenceCount += 1;
    this.props.updatedAt = new Date();
  }

  /**
   * Mark as contradicted by another claim
   */
  addContradiction(claimId: string): void {
    if (!this.props.contradictedBy.includes(claimId)) {
      this.props.contradictedBy.push(claimId);
      this.props.hasContradiction = true;
      this.props.updatedAt = new Date();
    }
  }

  /**
   * Remove contradiction
   */
  removeContradiction(claimId: string): void {
    this.props.contradictedBy = this.props.contradictedBy.filter(
      (id) => id !== claimId
    );
    this.props.hasContradiction = this.props.contradictedBy.length > 0;
    this.props.updatedAt = new Date();
  }

  /**
   * Check if claim needs more evidence
   */
  needsMoreEvidence(): boolean {
    // Factual claims should have at least 2 evidence spans
    // Causal claims should have at least 3
    const threshold = this.claimType === "causal" ? 3 : 2;
    return this.evidenceCount < threshold;
  }

  /**
   * Check if claim is reliable
   */
  isReliable(): boolean {
    if (!this.trustScore) return false;
    return (
      this.trustScore.getValue() >= 0.7 &&
      !this.hasContradiction &&
      this.evidenceCount >= 2
    );
  }

  /**
   * Serialize to persistence format
   */
  toPersistence(): ClaimProps {
    return { ...this.props };
  }

  /**
   * Serialize to API response
   */
  toDTO() {
    return {
      id: this.id,
      runId: this.runId,
      text: this.text,
      claimType: this.claimType,
      category: this.category,
      confidence: this.confidence,
      trustScore: this.trustScore?.getValue(),
      trustLevel: this.trustScore?.getLevel(),
      evidenceCount: this.evidenceCount,
      isVerified: this.isVerified,
      hasContradiction: this.hasContradiction,
      needsMoreEvidence: this.needsMoreEvidence(),
      isReliable: this.isReliable(),
      createdAt: this.props.createdAt.toISOString(),
    };
  }
}

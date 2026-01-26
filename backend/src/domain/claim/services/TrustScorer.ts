/**
 * Trust Scorer Service
 * 
 * Computes trust scores for claims and analysis runs.
 * Evidence-first approach: trust is derived from verifiable evidence quality.
 */

import { Claim, TrustScore } from "../entities/Claim";
import { EvidenceSpan } from "../../evidence/services/EvidenceBinder";
import { Logger } from "../../../shared/logging/Logger";

// ============================================================================
// INTERFACES
// ============================================================================

export interface SourceQualityMetrics {
  citationCount: number;
  yearPublished: number;
  authorHIndex?: number;
  institutionTrustScore?: number;
  openAccessStatus: string;
}

export interface TrustScoreComponents {
  evidenceStrength: number;
  sourceQuality: number;
  citationCoverage: number;
  hasContradiction: boolean;
}

// ============================================================================
// SERVICE
// ============================================================================

export interface TrustScorerConfig {
  minEvidenceSpans: number;
  citationCoverageWeight: number;
  sourceQualityWeight: number;
  evidenceStrengthWeight: number;
  contradictionPenalty: number;
}

export class TrustScorer {
  private readonly logger: Logger;
  private readonly config: TrustScorerConfig;

  constructor(
    logger: Logger,
    config: Partial<TrustScorerConfig> = {}
  ) {
    this.logger = logger;
    this.config = {
      minEvidenceSpans: config.minEvidenceSpans ?? 2,
      citationCoverageWeight: config.citationCoverageWeight ?? 0.3,
      sourceQualityWeight: config.sourceQualityWeight ?? 0.3,
      evidenceStrengthWeight: config.evidenceStrengthWeight ?? 0.4,
      contradictionPenalty: config.contradictionPenalty ?? 0.4,
    };
  }

  /**
   * Compute trust score for a single claim
   */
  computeClaimTrust(params: {
    claim: Claim;
    evidenceSpans: EvidenceSpan[];
    sourceMetrics: Map<string, SourceQualityMetrics>;
    correlationId: string;
  }): TrustScore {
    this.logger.debug("Computing trust score for claim", {
      correlationId: params.correlationId,
      claimId: params.claim.id,
      evidenceSpanCount: params.evidenceSpans.length,
    });

    // Component 1: Evidence Strength
    const evidenceStrength = this.computeEvidenceStrength(params.evidenceSpans);

    // Component 2: Source Quality
    const sourceQuality = this.computeSourceQuality(
      params.evidenceSpans,
      params.sourceMetrics
    );

    // Component 3: Citation Coverage
    const citationCoverage = this.computeCitationCoverage(
      params.claim,
      params.evidenceSpans
    );

    // Component 4: Contradiction penalty
    const hasContradiction = params.claim.hasContradiction;

    const components: TrustScoreComponents = {
      evidenceStrength,
      sourceQuality,
      citationCoverage,
      hasContradiction,
    };

    const trustScore = TrustScore.fromComponents(components);

    this.logger.info("Trust score computed", {
      correlationId: params.correlationId,
      claimId: params.claim.id,
      trustScore: trustScore.getValue(),
      trustLevel: trustScore.getLevel(),
      components,
    });

    return trustScore;
  }

  /**
   * Compute aggregate trust score for an analysis run
   */
  computeRunTrust(params: {
    claims: Claim[];
    evidenceSpans: Map<string, EvidenceSpan[]>;
    sourceMetrics: Map<string, SourceQualityMetrics>;
    correlationId: string;
  }): {
    overallTrust: TrustScore;
    metrics: {
      avgClaimTrust: number;
      citationCoverage: number;
      sourceQuality: number;
      evidenceStrength: number;
      contradictionRate: number;
      claimCount: number;
      evidenceCount: number;
    };
  } {
    this.logger.info("Computing run-level trust score", {
      correlationId: params.correlationId,
      claimCount: params.claims.length,
    });

    if (params.claims.length === 0) {
      return {
        overallTrust: TrustScore.zero(),
        metrics: {
          avgClaimTrust: 0,
          citationCoverage: 0,
          sourceQuality: 0,
          evidenceStrength: 0,
          contradictionRate: 0,
          claimCount: 0,
          evidenceCount: 0,
        },
      };
    }

    // Compute trust for each claim
    const claimTrustScores: number[] = [];
    const allEvidenceSpans: EvidenceSpan[] = [];
    let contradictionCount = 0;

    for (const claim of params.claims) {
      const evidenceSpans = params.evidenceSpans.get(claim.id) || [];
      allEvidenceSpans.push(...evidenceSpans);

      const claimTrust = this.computeClaimTrust({
        claim,
        evidenceSpans,
        sourceMetrics: params.sourceMetrics,
        correlationId: params.correlationId,
      });

      claimTrustScores.push(claimTrust.getValue());

      if (claim.hasContradiction) {
        contradictionCount++;
      }
    }

    // Aggregate metrics
    const avgClaimTrust =
      claimTrustScores.reduce((sum, score) => sum + score, 0) /
      claimTrustScores.length;

    const citationCoverage =
      params.claims.filter((c) => c.evidenceCount > 0).length /
      params.claims.length;

    const evidenceStrength =
      allEvidenceSpans.length > 0
        ? allEvidenceSpans.reduce(
            (sum, span) => sum + span.strengthScore,
            0
          ) / allEvidenceSpans.length
        : 0;

    const sourceQuality = this.computeAggregateSourceQuality(
      allEvidenceSpans,
      params.sourceMetrics
    );

    const contradictionRate = contradictionCount / params.claims.length;

    // Overall trust is weighted average with contradiction penalty
    const baseScore =
      avgClaimTrust * 0.5 +
      citationCoverage * 0.2 +
      evidenceStrength * 0.15 +
      sourceQuality * 0.15;

    const finalScore =
      contradictionRate > 0.1 ? baseScore * (1 - this.config.contradictionPenalty) : baseScore;

    const overallTrust = new TrustScore(Math.max(0, Math.min(1, finalScore)));

    this.logger.info("Run-level trust score computed", {
      correlationId: params.correlationId,
      overallTrust: overallTrust.getValue(),
      trustLevel: overallTrust.getLevel(),
      claimCount: params.claims.length,
      evidenceCount: allEvidenceSpans.length,
    });

    return {
      overallTrust,
      metrics: {
        avgClaimTrust,
        citationCoverage,
        sourceQuality,
        evidenceStrength,
        contradictionRate,
        claimCount: params.claims.length,
        evidenceCount: allEvidenceSpans.length,
      },
    };
  }

  /**
   * Compute evidence strength from spans
   */
  private computeEvidenceStrength(spans: EvidenceSpan[]): number {
    if (spans.length === 0) return 0;

    // Average strength score, with diminishing returns
    const avgStrength =
      spans.reduce((sum, span) => sum + span.strengthScore, 0) / spans.length;

    // Boost for multiple evidence spans
    const countBoost = Math.min(spans.length / this.config.minEvidenceSpans, 1);

    return avgStrength * (0.7 + 0.3 * countBoost);
  }

  /**
   * Compute source quality from metrics
   */
  private computeSourceQuality(
    spans: EvidenceSpan[],
    sourceMetrics: Map<string, SourceQualityMetrics>
  ): number {
    if (spans.length === 0) return 0;

    const sourceScores: number[] = [];

    for (const span of spans) {
      const metrics = sourceMetrics.get(span.sourceId);
      if (!metrics) continue;

      const score = this.scoreSourceMetrics(metrics);
      sourceScores.push(score);
    }

    if (sourceScores.length === 0) return 0.5; // Default

    return sourceScores.reduce((sum, score) => sum + score, 0) / sourceScores.length;
  }

  /**
   * Score individual source metrics
   */
  private scoreSourceMetrics(metrics: SourceQualityMetrics): number {
    // Citation count (log scale, capped at 1000)
    const citationScore = Math.min(
      Math.log10(metrics.citationCount + 1) / Math.log10(1001),
      1
    );

    // Recency (last 5 years = 1.0, older = decay)
    const currentYear = new Date().getFullYear();
    const yearsOld = currentYear - metrics.yearPublished;
    const recencyScore = Math.max(0, 1 - yearsOld / 20); // 5% decay per year

    // Author H-index (optional)
    const authorScore = metrics.authorHIndex
      ? Math.min(metrics.authorHIndex / 50, 1)
      : 0.5;

    // Institution trust (optional)
    const institutionScore = metrics.institutionTrustScore ?? 0.5;

    // Open access (bonus)
    const oaBonus =
      metrics.openAccessStatus === "gold" || metrics.openAccessStatus === "green"
        ? 0.1
        : 0;

    // Weighted average
    const baseScore =
      citationScore * 0.3 +
      recencyScore * 0.3 +
      authorScore * 0.2 +
      institutionScore * 0.2;

    return Math.min(baseScore + oaBonus, 1);
  }

  /**
   * Compute citation coverage
   */
  private computeCitationCoverage(
    claim: Claim,
    evidenceSpans: EvidenceSpan[]
  ): number {
    // How well is this claim supported by evidence?
    const minRequired = this.config.minEvidenceSpans;
    const coverage = Math.min(evidenceSpans.length / minRequired, 1);

    // Bonus for diverse evidence types
    const types = new Set(evidenceSpans.map((s) => s.evidenceType));
    const diversityBonus = types.size > 1 ? 0.1 : 0;

    return Math.min(coverage + diversityBonus, 1);
  }

  /**
   * Compute aggregate source quality across all spans
   */
  private computeAggregateSourceQuality(
    spans: EvidenceSpan[],
    sourceMetrics: Map<string, SourceQualityMetrics>
  ): number {
    if (spans.length === 0) return 0;

    // Get unique sources
    const uniqueSources = new Set(spans.map((s) => s.sourceId));
    const sourceScores: number[] = [];

    for (const sourceId of uniqueSources) {
      const metrics = sourceMetrics.get(sourceId);
      if (metrics) {
        sourceScores.push(this.scoreSourceMetrics(metrics));
      }
    }

    if (sourceScores.length === 0) return 0.5;

    return sourceScores.reduce((sum, score) => sum + score, 0) / sourceScores.length;
  }

  /**
   * Recompute trust scores after feedback or updates
   */
  async recomputeTrust(params: {
    runId: string;
    claims: Claim[];
    evidenceSpans: Map<string, EvidenceSpan[]>;
    sourceMetrics: Map<string, SourceQualityMetrics>;
    correlationId: string;
  }): Promise<Map<string, TrustScore>> {
    this.logger.info("Recomputing trust scores after updates", {
      correlationId: params.correlationId,
      runId: params.runId,
      claimCount: params.claims.length,
    });

    const updatedScores = new Map<string, TrustScore>();

    for (const claim of params.claims) {
      const evidenceSpans = params.evidenceSpans.get(claim.id) || [];
      const trustScore = this.computeClaimTrust({
        claim,
        evidenceSpans,
        sourceMetrics: params.sourceMetrics,
        correlationId: params.correlationId,
      });

      updatedScores.set(claim.id, trustScore);
    }

    return updatedScores;
  }
}

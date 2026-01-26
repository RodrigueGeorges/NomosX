/**
 * TRUST_SCORER Worker
 * 
 * Computes trust scores for claims and analysis runs
 * Uses TrustScorer service
 */

import { Job } from 'bullmq';
import { PrismaClient } from '@prisma/client';
import { TrustScorer } from '../../../domain/claim/services/TrustScorer';
import { logger } from '../../../shared/logging/Logger';
import { DomainError } from '../../../shared/errors/DomainError';

export interface TrustScorerJobPayload {
  runId: string;
  claimIds: string[];
  correlationId: string;
}

export interface TrustScorerJobResult {
  runTrustScore: number;
  avgClaimTrustScore: number;
  duration: number;
}

export class TrustScorerWorker {
  constructor(
    private readonly prisma: PrismaClient,
    private readonly trustScorer: TrustScorer
  ) {}

  async process(job: Job<TrustScorerJobPayload>): Promise<TrustScorerJobResult> {
    const startTime = Date.now();
    const { runId, claimIds, correlationId } = job.data;

    const log = logger.child({ 
      correlationId, 
      runId, 
      jobId: job.id,
      worker: 'TRUST_SCORER'
    });

    log.info({ claimIds }, 'Starting trust scoring');

    try {
      // 1. Fetch claims with evidence and sources
      const claims = await this.prisma.claim.findMany({
        where: { id: { in: claimIds } },
        include: {
          evidenceSpans: {
            include: {
              source: {
                select: {
                  id: true,
                  citationCount: true,
                  year: true,
                  qualityScore: true,
                  authors: {
                    include: {
                      author: {
                        select: {
                          h_index: true,
                          trustScore: true,
                        },
                      },
                    },
                  },
                  institutions: {
                    include: {
                      institution: {
                        select: {
                          trustScore: true,
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          contradictions: true,
        },
      });

      if (claims.length === 0) {
        throw new DomainError('No claims found for scoring', 'TRUST_SCORING_FAILED');
      }

      log.info({ claimCount: claims.length }, 'Fetched claims for scoring');

      // 2. Score each claim
      const claimTrustScores: number[] = [];

      for (const claim of claims) {
        // Compute evidence strength (avg of relevance and strength scores)
        const evidenceStrength = claim.evidenceSpans.length > 0
          ? claim.evidenceSpans.reduce((sum, span) => 
              sum + (span.relevanceScore * 0.5 + span.strengthScore * 0.5), 0
            ) / claim.evidenceSpans.length
          : 0;

        // Compute source quality (avg quality score)
        const sourceQuality = claim.evidenceSpans.length > 0
          ? claim.evidenceSpans.reduce((sum, span) => {
              const source = span.source;
              let score = 0;

              // Citation count (normalized to 0-1, capped at 1000)
              if (source.citationCount) {
                score += Math.min(source.citationCount / 1000, 1) * 0.3;
              }

              // Recency (more recent = higher score)
              if (source.year) {
                const age = 2026 - source.year;
                const recencyScore = Math.max(0, 1 - age / 30); // 30 years = 0 score
                score += recencyScore * 0.2;
              }

              // Author h-index
              const avgHIndex = source.authors.reduce((sum, sa) => 
                sum + (sa.author.h_index || 0), 0
              ) / Math.max(source.authors.length, 1);
              score += Math.min(avgHIndex / 50, 1) * 0.3; // Cap at 50

              // Institution trust
              const avgInstTrust = source.institutions.reduce((sum, si) => 
                sum + (si.institution.trustScore || 0.5), 0
              ) / Math.max(source.institutions.length, 1);
              score += avgInstTrust * 0.2;

              return sum + score;
            }, 0) / claim.evidenceSpans.length
          : 0.5; // Default if no sources

        // Citation coverage (% of text with citations)
        const citationCoverage = claim.evidenceCount > 0 ? 1.0 : 0.0;

        // Has contradiction penalty
        const hasContradiction = claim.contradictions.length > 0;

        // Compute trust score
        const trustScore = this.trustScorer.computeTrustScore({
          evidenceStrength,
          sourceQuality,
          citationCoverage,
          hasContradiction,
        });

        claimTrustScores.push(trustScore);

        // Update claim
        await this.prisma.claim.update({
          where: { id: claim.id },
          data: { trustScore },
        });
      }

      // 3. Compute run-level trust score (average of claim scores)
      const runTrustScore = claimTrustScores.length > 0
        ? claimTrustScores.reduce((sum, score) => sum + score, 0) / claimTrustScores.length
        : 0;

      const avgClaimTrustScore = runTrustScore;

      // 4. Compute quality metrics for run
      const avgEvidenceStrength = claims.reduce((sum, claim) => {
        const avg = claim.evidenceSpans.reduce((s, span) => 
          s + span.strengthScore, 0
        ) / Math.max(claim.evidenceSpans.length, 1);
        return sum + avg;
      }, 0) / claims.length;

      const citationCoverage = claims.filter(c => c.evidenceCount > 0).length / claims.length;

      const contradictionRate = claims.filter(c => c.contradictions.length > 0).length / claims.length;

      // 5. Update run with trust score and metrics
      await this.prisma.analysisRun.update({
        where: { id: runId },
        data: {
          trustScore: runTrustScore,
          qualityScore: runTrustScore, // For now, quality = trust
          evidenceStrength: avgEvidenceStrength,
          citationCoverage,
          contradictionRate,
        },
      });

      const duration = Date.now() - startTime;

      log.info({ 
        runTrustScore,
        avgClaimTrustScore,
        citationCoverage,
        duration 
      }, 'Trust scoring completed');

      return {
        runTrustScore,
        avgClaimTrustScore,
        duration,
      };

    } catch (error) {
      log.error({ error }, 'Trust scoring failed');
      
      await this.prisma.analysisRun.update({
        where: { id: runId },
        data: { 
          lastError: error instanceof Error ? error.message : 'Unknown error',
          retryCount: { increment: 1 },
        },
      }).catch(err => log.error({ err }, 'Failed to update run with error'));

      throw error;
    }
  }
}

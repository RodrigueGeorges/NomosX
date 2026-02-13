/**
 * EVIDENCE_BINDER Worker
 * 
 * Binds claims to specific evidence spans in source documents
 * Uses EvidenceBinder service (deterministic + LLM)
 */

import { Job } from 'bullmq';
import { PrismaClient } from '@prisma/client';
import { EvidenceBinder } from '../../../domain/evidence/services/EvidenceBinder';
import { logger } from '../../../shared/logging/Logger';
import { DomainError } from '../../../shared/errors/DomainError';

export interface EvidenceBinderJobPayload {
  runId: string;
  claimIds: string[];
  correlationId: string;
}

export interface EvidenceBinderJobResult {
  evidenceSpanIds: string[];
  boundCount: number;
  duration: number;
}

export class EvidenceBinderWorker {
  constructor(
    private readonly prisma: PrismaClient,
    private readonly evidenceBinder: EvidenceBinder
  ) {}

  async process(job: Job<EvidenceBinderJobPayload>): Promise<EvidenceBinderJobResult> {
    const startTime = Date.now();
    const { runId, claimIds, correlationId } = job.data;

    const log = logger.child({ 
      correlationId, 
      runId, 
      jobId: job.id,
      worker: 'EVIDENCE_BINDER'
    });

    log.info({ claimIds }, 'Starting evidence binding');

    try {
      // 1. Fetch claims with their run context
      const claims = await this.prisma.claim.findMany({
        where: { id: { in: claimIds } },
        include: {
          run: {
            select: {
              id: true,
              sourcesUsed: true,
            },
          },
        },
      });

      if (claims.length === 0) {
        throw new DomainError('No claims found for binding', 'EVIDENCE_BINDING_FAILED');
      }

      // 2. Fetch sources used in the run
      const sourceIds = claims[0].run.sourcesUsed;
      const sources = await this.prisma.source.findMany({
        where: { id: { in: sourceIds } },
        select: {
          id: true,
          title: true,
          abstract: true,
        },
      });

      log.info({ sourceCount: sources.length }, 'Fetched sources for binding');

      // 3. Bind each claim to evidence
      const evidenceSpanIds: string[] = [];

      for (const claim of claims) {
        // Bind claim to sources
        const evidenceSpans = await this.evidenceBinder.bindClaimToSources(
          claim.text,
          sources.map(s => ({
            sourceId: s.id,
            text: `${s.title}\n\n${s.abstract || ''}`,
          })),
          {
            minRelevance: 0.4,
            minStrength: 0.3,
            maxEvidencePerClaim: 5,
          }
        );

        // Save evidence spans
        for (const span of evidenceSpans) {
          const created = await this.prisma.evidenceSpan.create({
            data: {
              claimId: claim.id,
              sourceId: span.sourceId,
              startPos: span.startPos,
              endPos: span.endPos,
              text: span.text,
              contextBefore: span.contextBefore,
              contextAfter: span.contextAfter,
              relevanceScore: span.relevanceScore,
              strengthScore: span.strengthScore,
              evidenceType: span.evidenceType,
              extractedBy: 'evidence_binder_v1',
            },
          });

          evidenceSpanIds.push(created.id);
        }

        // Update claim with evidence count
        await this.prisma.claim.update({
          where: { id: claim.id },
          data: { evidenceCount: evidenceSpans.length },
        });
      }

      // 4. Update run with evidence count
      await this.prisma.analysisRun.update({
        where: { id: runId },
        data: { evidenceCount: evidenceSpanIds.length },
      });

      const duration = Date.now() - startTime;

      log.info({ 
        evidenceSpanIds: evidenceSpanIds.length,
        duration 
      }, 'Evidence binding completed');

      return {
        evidenceSpanIds,
        boundCount: evidenceSpanIds.length,
        duration,
      };

    } catch (error) {
      log.error({ error }, 'Evidence binding failed');
      
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

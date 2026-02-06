/**
 * CLAIM_EXTRACTOR Worker
 * 
 * Extracts structured claims from analysis output
 * Uses ClaimExtractor service (deterministic + LLM fallback)
 */

import { Job } from 'bullmq';
import { PrismaClient } from '@prisma/client';
import { ClaimExtractor } from '../../../domain/claim/services/ClaimExtractor';
import { logger } from '../../../shared/logging/Logger';
import { DomainError } from '../../../shared/errors/DomainError';

export interface ClaimExtractorJobPayload {
  runId: string;
  analysisText: string;
  correlationId: string;
}

export interface ClaimExtractorJobResult {
  claimIds: string[];
  extractedCount: number;
  duration: number;
}

export class ClaimExtractorWorker {
  constructor(
    private readonly prisma: PrismaClient,
    private readonly claimExtractor: ClaimExtractor
  ) {}

  async process(job: Job<ClaimExtractorJobPayload>): Promise<ClaimExtractorJobResult> {
    const startTime = Date.now();
    const { runId, analysisText, correlationId } = job.data;

    const log = logger.child({ 
      correlationId, 
      runId, 
      jobId: job.id,
      worker: 'CLAIM_EXTRACTOR'
    });

    log.info('Starting claim extraction');

    try {
      // 1. Extract claims using service
      const extractedClaims = await this.claimExtractor.extract(analysisText, {
        maxClaims: 50,
        minConfidence: 0.5,
        useLLMFallback: true,
      });

      log.info({ count: extractedClaims.length }, 'Claims extracted');

      // 2. Fetch run to get context
      const run = await this.prisma.analysisRun.findUnique({
        where: { id: runId },
        select: { id: true, correlationId: true },
      });

      if (!run) {
        throw new DomainError(`AnalysisRun not found: ${runId}`, 'CLAIM_EXTRACTION_FAILED');
      }

      // 3. Save claims to database
      const claimIds: string[] = [];

      for (const claim of extractedClaims) {
        const created = await this.prisma.claim.create({
          data: {
            runId: run.id,
            text: claim.text,
            claimType: claim.type,
            category: claim.category,
            confidence: claim.confidence,
            extractedBy: 'claim_extractor_v1',
          },
        });

        claimIds.push(created.id);
      }

      // 4. Update run with claim count
      await this.prisma.analysisRun.update({
        where: { id: runId },
        data: { claimCount: claimIds.length },
      });

      const duration = Date.now() - startTime;

      log.info({ 
        claimIds, 
        count: claimIds.length, 
        duration 
      }, 'Claim extraction completed');

      return {
        claimIds,
        extractedCount: claimIds.length,
        duration,
      };

    } catch (error) {
      log.error({ error }, 'Claim extraction failed');
      
      // Update run with error
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

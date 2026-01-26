/**
 * Unit Tests for EvidenceBinder Service
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { EvidenceBinder } from '../../../../src/domain/evidence/services/EvidenceBinder';
import type OpenAI from 'openai';
import type { Logger } from '../../../../src/shared/logging/Logger';

describe('EvidenceBinder', () => {
  let evidenceBinder: EvidenceBinder;
  let mockOpenAI: any;
  let mockLogger: any;

  beforeEach(() => {
    // Mock OpenAI
    mockOpenAI = {
      chat: {
        completions: {
          create: vi.fn(),
        },
      },
    } as unknown as OpenAI;

    // Mock Logger
    mockLogger = {
      child: vi.fn(() => mockLogger),
      info: vi.fn(),
      warn: vi.fn(),
      error: vi.fn(),
    } as unknown as Logger;

    evidenceBinder = new EvidenceBinder(mockOpenAI, mockLogger);
  });

  describe('bindClaimToSources', () => {
    it('should bind claim to sources using deterministic matching', async () => {
      const claim = 'Carbon taxes reduce emissions by 10-15%';
      const sources = [
        {
          sourceId: 'source-1',
          text: 'Carbon taxes reduce emissions by 10-15% according to recent studies. This policy tool has proven effective.',
        },
        {
          sourceId: 'source-2',
          text: 'Unrelated text about something else entirely.',
        },
      ];

      const result = await evidenceBinder.bindClaimToSources(claim, sources, {
        minRelevance: 0.3,
        minStrength: 0.3,
        maxEvidencePerClaim: 5,
      });

      expect(result).toHaveLength(1);
      expect(result[0].sourceId).toBe('source-1');
      expect(result[0].text).toContain('Carbon taxes reduce emissions by 10-15%');
      expect(result[0].relevanceScore).toBeGreaterThan(0.5);
    });

    it('should compute relevance scores based on n-gram overlap', async () => {
      const claim = 'AI improves healthcare outcomes';
      const sources = [
        {
          sourceId: 'source-1',
          text: 'AI improves healthcare outcomes by 20% in clinical trials.',
        },
      ];

      const result = await evidenceBinder.bindClaimToSources(claim, sources);

      expect(result[0].relevanceScore).toBeGreaterThan(0.7);
    });

    it('should filter out low-relevance evidence', async () => {
      const claim = 'Specific technical claim about quantum computing';
      const sources = [
        {
          sourceId: 'source-1',
          text: 'Generic text about something completely unrelated.',
        },
      ];

      const result = await evidenceBinder.bindClaimToSources(claim, sources, {
        minRelevance: 0.5,
        minStrength: 0.3,
      });

      expect(result).toHaveLength(0);
    });

    it('should respect maxEvidencePerClaim limit', async () => {
      const claim = 'Common claim';
      const sources = Array.from({ length: 10 }, (_, i) => ({
        sourceId: `source-${i}`,
        text: `Common claim appears here with some variation ${i}.`,
      }));

      const result = await evidenceBinder.bindClaimToSources(claim, sources, {
        maxEvidencePerClaim: 3,
      });

      expect(result.length).toBeLessThanOrEqual(3);
    });

    it('should extract context before and after evidence span', async () => {
      const claim = 'Key finding';
      const sources = [
        {
          sourceId: 'source-1',
          text: 'This is context before. Key finding is here in the middle. This is context after.',
        },
      ];

      const result = await evidenceBinder.bindClaimToSources(claim, sources);

      expect(result[0].contextBefore).toContain('context before');
      expect(result[0].contextAfter).toContain('context after');
    });

    it('should classify evidence types correctly', async () => {
      const claim = 'Statistical finding: 42% increase';
      const sources = [
        {
          sourceId: 'source-1',
          text: 'We found a 42% increase in the measured outcome.',
        },
      ];

      const result = await evidenceBinder.bindClaimToSources(claim, sources);

      expect(result[0].evidenceType).toMatch(/statistical|direct_quote/);
    });
  });

  describe('batch binding', () => {
    it('should bind multiple claims efficiently', async () => {
      const claims = [
        { id: 'claim-1', text: 'Claim one' },
        { id: 'claim-2', text: 'Claim two' },
      ];

      const sources = [
        { sourceId: 'source-1', text: 'Claim one is supported here.' },
        { sourceId: 'source-2', text: 'Claim two is supported here.' },
      ];

      // Process claims in batch
      const results = await Promise.all(
        claims.map(claim => evidenceBinder.bindClaimToSources(claim.text, sources))
      );

      expect(results).toHaveLength(2);
      expect(results[0].length).toBeGreaterThan(0);
      expect(results[1].length).toBeGreaterThan(0);
    });
  });

  describe('error handling', () => {
    it('should handle empty sources gracefully', async () => {
      const claim = 'Some claim';
      const sources: any[] = [];

      const result = await evidenceBinder.bindClaimToSources(claim, sources);

      expect(result).toHaveLength(0);
    });

    it('should handle malformed source text', async () => {
      const claim = 'Valid claim';
      const sources = [
        { sourceId: 'source-1', text: '' },
        { sourceId: 'source-2', text: null as any },
      ];

      const result = await evidenceBinder.bindClaimToSources(claim, sources);

      expect(result).toHaveLength(0);
    });
  });
});

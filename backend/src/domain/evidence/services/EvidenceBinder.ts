/**
 * Evidence Binder Service
 * 
 * Binds claims to evidence spans in source documents.
 * Ensures every claim is traceable to verifiable source text.
 */

import OpenAI from 'openai';
import { z } from 'zod';
import { Claim } from '../../claim/entities/Claim';
import { Logger } from '../../../shared/logging/Logger';

// ============================================================================
// SCHEMAS
// ============================================================================

const EvidenceSpanSchema = z.object({
  sourceId: z.string(),
  chunkId: z.string().optional(),
  startPos: z.number().int().min(0),
  endPos: z.number().int().min(0),
  text: z.string().min(10).max(2000),
  contextBefore: z.string().max(500).optional(),
  contextAfter: z.string().max(500).optional(),
  relevanceScore: z.number().min(0).max(1),
  strengthScore: z.number().min(0).max(1),
  evidenceType: z.enum([
    "direct_quote",
    "paraphrase",
    "statistical",
    "methodological",
  ]),
});

export type EvidenceSpan = z.infer<typeof EvidenceSpanSchema>;

// ============================================================================
// SERVICE
// ============================================================================

export interface EvidenceBinderConfig {
  model: string;
  temperature: number;
  minRelevanceScore: number;
  maxSpansPerClaim: number;
}

export class EvidenceBinder {
  private readonly openai: OpenAI;
  private readonly logger: Logger;
  private readonly config: EvidenceBinderConfig;

  constructor(
    openai: OpenAI,
    logger: Logger,
    config: Partial<EvidenceBinderConfig> = {}
  ) {
    this.openai = openai;
    this.logger = logger;
    this.config = {
      model: config.model || "gpt-4o",
      temperature: config.temperature ?? 0.1,
      minRelevanceScore: config.minRelevanceScore ?? 0.6,
      maxSpansPerClaim: config.maxSpansPerClaim || 5,
    };
  }

  /**
   * Bind evidence spans to a claim
   */
  async bind(params: {
    claim: Claim;
    sources: Array<{
      id: string;
      title: string;
      abstract?: string;
      chunks?: Array<{ id: string; content: string }>;
    }>;
    correlationId: string;
  }): Promise<EvidenceSpan[]> {
    const startTime = Date.now();

    this.logger.info("Binding evidence to claim", {
      correlationId: params.correlationId,
      claimId: params.claim.id,
      claimText: params.claim.text,
      sourcesCount: params.sources.length,
    });

    try {
      // 1. Try deterministic binding first (exact match, citations)
      const deterministicSpans = this.bindDeterministic(params);

      if (deterministicSpans.length > 0) {
        this.logger.info("Deterministic binding successful", {
          correlationId: params.correlationId,
          claimId: params.claim.id,
          spansFound: deterministicSpans.length,
        });

        return deterministicSpans;
      }

      // 2. Fall back to LLM-based binding
      const llmSpans = await this.bindWithLLM(params);

      // 3. Filter by minimum relevance score
      const filteredSpans = llmSpans.filter(
        (span) => span.relevanceScore >= this.config.minRelevanceScore
      );

      const duration = Date.now() - startTime;
      this.logger.info("Evidence binding completed", {
        correlationId: params.correlationId,
        claimId: params.claim.id,
        spansFound: filteredSpans.length,
        durationMs: duration,
      });

      return filteredSpans.slice(0, this.config.maxSpansPerClaim);
    } catch (error) {
      this.logger.error("Evidence binding failed", {
        correlationId: params.correlationId,
        claimId: params.claim.id,
        error: error instanceof Error ? error.message : String(error),
      });
      throw error;
    }
  }

  /**
   * Deterministic binding using string matching
   */
  private bindDeterministic(params: {
    claim: Claim;
    sources: Array<{
      id: string;
      abstract?: string;
      chunks?: Array<{ id: string; content: string }>;
    }>;
  }): EvidenceSpan[] {
    const spans: EvidenceSpan[] = [];
    const claimWords = params.claim.text.toLowerCase().split(/\s+/);

    for (const source of params.sources) {
      // Search in abstract
      if (source.abstract) {
        const abstractSpans = this.findMatchingSpans(
          params.claim.text,
          claimWords,
          source.abstract,
          source.id,
          undefined
        );
        spans.push(...abstractSpans);
      }

      // Search in chunks
      if (source.chunks) {
        for (const chunk of source.chunks) {
          const chunkSpans = this.findMatchingSpans(
            params.claim.text,
            claimWords,
            chunk.content,
            source.id,
            chunk.id
          );
          spans.push(...chunkSpans);
        }
      }
    }

    return spans;
  }

  /**
   * Find matching text spans using n-gram overlap
   */
  private findMatchingSpans(
    claimText: string,
    claimWords: string[],
    sourceText: string,
    sourceId: string,
    chunkId: string | undefined
  ): EvidenceSpan[] {
    const spans: EvidenceSpan[] = [];
    const sentences = sourceText.split(/[.!?]+/).filter((s) => s.trim().length > 0);

    for (let i = 0; i < sentences.length; i++) {
      const sentence = sentences[i].trim();
      const sentenceWords = sentence.toLowerCase().split(/\s+/);

      // Calculate word overlap
      const overlap = this.calculateOverlap(claimWords, sentenceWords);

      if (overlap > 0.3) {
        // At least 30% overlap
        const startPos = sourceText.indexOf(sentence);
        if (startPos === -1) continue;

        const endPos = startPos + sentence.length;
        const contextBefore = sentences[i - 1]?.trim();
        const contextAfter = sentences[i + 1]?.trim();

        spans.push({
          sourceId,
          chunkId,
          startPos,
          endPos,
          text: sentence,
          contextBefore,
          contextAfter,
          relevanceScore: overlap,
          strengthScore: overlap * 0.9, // Slightly lower
          evidenceType: overlap > 0.7 ? "direct_quote" : "paraphrase",
        });
      }
    }

    return spans;
  }

  /**
   * Calculate word overlap between two sets of words
   */
  private calculateOverlap(words1: string[], words2: string[]): number {
    const set1 = new Set(words1);
    const set2 = new Set(words2);

    let intersection = 0;
    for (const word of set1) {
      if (set2.has(word)) intersection++;
    }

    return intersection / Math.max(set1.size, 1);
  }

  /**
   * LLM-based evidence binding
   */
  private async bindWithLLM(params: {
    claim: Claim;
    sources: Array<{
      id: string;
      title: string;
      abstract?: string;
      chunks?: Array<{ id: string; content: string }>;
    }>;
    correlationId: string;
  }): Promise<EvidenceSpan[]> {
    const prompt = this.buildBindingPrompt(params);

    const response = await this.openai.chat.completions.create({
      model: this.config.model,
      temperature: this.config.temperature,
      messages: [
        {
          role: "system",
          content: `You are an evidence binding specialist. Your task is to find text spans in sources that support or refute a given claim.

RULES:
1. Identify exact spans (start/end position in source text)
2. Rate relevance 0-1 (how relevant is this span to the claim)
3. Rate strength 0-1 (how strongly does this span support/refute)
4. Classify evidence type: direct_quote, paraphrase, statistical, methodological
5. Return max ${this.config.maxSpansPerClaim} best evidence spans

Be precise with span boundaries. Include context before/after for clarity.`,
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      response_format: { type: "json_object" },
    });

    const content = response.choices[0].message.content || "{}";
    const parsed = JSON.parse(content);

    // Validate and parse each span
    const spans: EvidenceSpan[] = [];
    if (parsed.evidence_spans && Array.isArray(parsed.evidence_spans)) {
      for (const span of parsed.evidence_spans) {
        try {
          const validatedSpan = EvidenceSpanSchema.parse(span);
          spans.push(validatedSpan);
        } catch (error) {
          this.logger.warn("Invalid evidence span from LLM", {
            correlationId: params.correlationId,
            error: error instanceof Error ? error.message : String(error),
          });
        }
      }
    }

    return spans;
  }

  /**
   * Build LLM prompt for evidence binding
   */
  private buildBindingPrompt(params: {
    claim: Claim;
    sources: Array<{
      id: string;
      title: string;
      abstract?: string;
      chunks?: Array<{ id: string; content: string }>;
    }>;
  }): string {
    const sourcesText = params.sources
      .map((s, idx) => {
        let text = `\n[SOURCE-${idx + 1}] ID: ${s.id}\nTitle: ${s.title}\n`;
        if (s.abstract) {
          text += `Abstract: ${s.abstract}\n`;
        }
        if (s.chunks) {
          text += `Chunks:\n${s.chunks.map((c, i) => `  [CHUNK-${i + 1}] ${c.content}`).join("\n")}`;
        }
        return text;
      })
      .join("\n");

    return `CLAIM: "${params.claim.text}"

SOURCES:
${sourcesText}

Find text spans in these sources that provide evidence for or against this claim.

Return JSON:
{
  "evidence_spans": [
    {
      "sourceId": "source-id",
      "chunkId": "chunk-id-if-applicable",
      "startPos": 123,
      "endPos": 456,
      "text": "The exact text span from the source",
      "contextBefore": "Text before the span for context",
      "contextAfter": "Text after the span for context",
      "relevanceScore": 0.95,
      "strengthScore": 0.85,
      "evidenceType": "direct_quote|paraphrase|statistical|methodological"
    }
  ]
}`;
  }

  /**
   * Batch bind evidence for multiple claims
   */
  async bindBatch(params: {
    claims: Claim[];
    sources: Array<{
      id: string;
      title: string;
      abstract?: string;
      chunks?: Array<{ id: string; content: string }>;
    }>;
    correlationId: string;
  }): Promise<Map<string, EvidenceSpan[]>> {
    this.logger.info("Batch binding evidence", {
      correlationId: params.correlationId,
      claimCount: params.claims.length,
      sourceCount: params.sources.length,
    });

    const results = new Map<string, EvidenceSpan[]>();

    // Process claims in parallel (with concurrency limit)
    const concurrency = 5;
    for (let i = 0; i < params.claims.length; i += concurrency) {
      const batch = params.claims.slice(i, i + concurrency);

      const batchPromises = batch.map((claim) =>
        this.bind({
          claim,
          sources: params.sources,
          correlationId: params.correlationId,
        }).then((spans) => ({ claimId: claim.id, spans }))
      );

      const batchResults = await Promise.allSettled(batchPromises);

      for (const result of batchResults) {
        if (result.status === "fulfilled") {
          results.set(result.value.claimId, result.value.spans);
        }
      }
    }

    return results;
  }
}

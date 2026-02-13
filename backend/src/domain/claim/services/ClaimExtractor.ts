/**
 * Claim Extractor Service
 * 
 * Extracts structured claims from LLM-generated analysis.
 * Uses deterministic parsing + LLM fallback for robustness.
 */

import OpenAI from 'openai';
import { z } from 'zod';
import { Claim,ClaimType,Category } from '../entities/Claim';
import { Logger } from '../../../shared/logging/Logger';

// ============================================================================
// SCHEMAS
// ============================================================================

const ExtractedClaimSchema = z.object({
  text: z.string().min(10).max(1000),
  claimType: z.enum(["factual", "causal", "evaluative", "normative"]),
  category: z
    .enum(["economic", "technical", "ethical", "political", "social", "environmental"])
    .optional(),
  confidence: z.number().min(0).max(1),
  sourceSnippet: z.string().optional(), // Snippet from source text
});

type ExtractedClaim = z.infer<typeof ExtractedClaimSchema>;

const ExtractionResultSchema = z.object({
  claims: z.array(ExtractedClaimSchema),
});

// ============================================================================
// SERVICE
// ============================================================================

export interface ClaimExtractorConfig {
  model: string;
  temperature: number;
  maxClaims: number;
}

export class ClaimExtractor {
  private readonly openai: OpenAI;
  private readonly logger: Logger;
  private readonly config: ClaimExtractorConfig;

  constructor(
    openai: OpenAI,
    logger: Logger,
    config: Partial<ClaimExtractorConfig> = {}
  ) {
    this.openai = openai;
    this.logger = logger;
    this.config = {
      model: config.model || "gpt-4o",
      temperature: config.temperature ?? 0.1,
      maxClaims: config.maxClaims || 50,
    };
  }

  /**
   * Extract claims from analysis text
   */
  async extract(params: {
    runId: string;
    analysisText: string;
    correlationId: string;
  }): Promise<Claim[]> {
    const startTime = Date.now();
    this.logger.info("Extracting claims", {
      correlationId: params.correlationId,
      runId: params.runId,
      textLength: params.analysisText.length,
    });

    try {
      // 1. Try deterministic extraction first (fast, cheap)
      const deterministicClaims = this.extractDeterministic(params.analysisText);

      if (deterministicClaims.length > 0) {
        this.logger.info("Deterministic extraction successful", {
          correlationId: params.correlationId,
          claimsExtracted: deterministicClaims.length,
        });

        return this.createClaimEntities(
          deterministicClaims,
          params.runId,
          "deterministic"
        );
      }

      // 2. Fall back to LLM extraction (slower, more expensive)
      this.logger.info("Falling back to LLM extraction", {
        correlationId: params.correlationId,
      });

      const llmClaims = await this.extractWithLLM(params);

      const claims = this.createClaimEntities(
        llmClaims,
        params.runId,
        "llm-gpt4o"
      );

      const duration = Date.now() - startTime;
      this.logger.info("Claim extraction completed", {
        correlationId: params.correlationId,
        runId: params.runId,
        claimsExtracted: claims.length,
        durationMs: duration,
        method: "llm",
      });

      return claims;
    } catch (error) {
      this.logger.error("Claim extraction failed", {
        correlationId: params.correlationId,
        runId: params.runId,
        error: error instanceof Error ? error.message : String(error),
      });
      throw error;
    }
  }

  /**
   * Deterministic extraction using regex patterns
   * Fast, cheap, but less accurate. Works for well-structured text.
   */
  private extractDeterministic(text: string): ExtractedClaim[] {
    const claims: ExtractedClaim[] = [];

    // Pattern 1: Look for citation-backed statements [SRC-N]
    // "According to research, X happens [SRC-1]"
    const citationPattern = /([^.!?]+\[SRC-\d+\][^.!?]*)[.!?]/g;
    const matches = text.matchAll(citationPattern);

    for (const match of matches) {
      const statement = match[1].trim();
      if (statement.length < 10) continue;

      // Classify claim type based on keywords
      const claimType = this.classifyClaimType(statement);

      claims.push({
        text: statement,
        claimType,
        confidence: 0.7, // Lower confidence for deterministic
        sourceSnippet: statement,
      });
    }

    return claims.slice(0, this.config.maxClaims);
  }

  /**
   * LLM-based extraction using structured output
   */
  private async extractWithLLM(params: {
    runId: string;
    analysisText: string;
    correlationId: string;
  }): Promise<ExtractedClaim[]> {
    const prompt = this.buildExtractionPrompt(params.analysisText);

    const response = await this.openai.chat.completions.create({
      model: this.config.model,
      temperature: this.config.temperature,
      messages: [
        {
          role: "system",
          content: `You are a claim extraction specialist. Extract factual claims from analysis text.

RULES:
1. Each claim must be a standalone assertion
2. Classify claim type: factual, causal, evaluative, or normative
3. Provide confidence 0-1 based on evidence quality
4. Extract max ${this.config.maxClaims} most important claims
5. Include source snippet if available (text near [SRC-N] citation)

OUTPUT: JSON array of claims`,
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
    const result = ExtractionResultSchema.parse(parsed);

    return result.claims;
  }

  /**
   * Build extraction prompt
   */
  private buildExtractionPrompt(text: string): string {
    return `Extract all significant claims from this analysis:

${text}

Return JSON:
{
  "claims": [
    {
      "text": "The claim text",
      "claimType": "factual|causal|evaluative|normative",
      "category": "economic|technical|ethical|political|social|environmental",
      "confidence": 0.85,
      "sourceSnippet": "...surrounding text with [SRC-N]..."
    }
  ]
}`;
  }

  /**
   * Classify claim type based on keywords
   */
  private classifyClaimType(text: string): ClaimType {
    const lower = text.toLowerCase();

    // Causal indicators
    if (
      /\b(causes?|leads? to|results? in|due to|because of|therefore|thus)\b/.test(
        lower
      )
    ) {
      return "causal";
    }

    // Evaluative indicators
    if (
      /\b(effective|successful|better|worse|positive|negative|good|bad|optimal)\b/.test(
        lower
      )
    ) {
      return "evaluative";
    }

    // Normative indicators
    if (/\b(should|must|ought to|need to|recommend|suggest)\b/.test(lower)) {
      return "normative";
    }

    // Default: factual
    return "factual";
  }

  /**
   * Create Claim entities from extracted data
   */
  private createClaimEntities(
    extractedClaims: ExtractedClaim[],
    runId: string,
    extractedBy: string
  ): Claim[] {
    return extractedClaims.map((ec) =>
      Claim.create({
        runId,
        text: ec.text,
        claimType: ec.claimType,
        category: ec.category,
        confidence: ec.confidence,
        evidenceCount: 0,
        isVerified: false,
        hasContradiction: false,
        contradictedBy: [],
        extractedBy,
      })
    );
  }

  /**
   * Re-extract claims if initial extraction was poor quality
   */
  async reExtract(params: {
    runId: string;
    previousClaims: Claim[];
    analysisText: string;
    correlationId: string;
  }): Promise<Claim[]> {
    this.logger.info("Re-extracting claims with stricter criteria", {
      correlationId: params.correlationId,
      runId: params.runId,
      previousClaimCount: params.previousClaims.length,
    });

    // Use higher temperature and different prompt for diversity
    const tempConfig = { ...this.config, temperature: 0.3 };
    const tempExtractor = new ClaimExtractor(this.openai, this.logger, tempConfig);

    return tempExtractor.extract({
      runId: params.runId,
      analysisText: params.analysisText,
      correlationId: params.correlationId,
    });
  }
}

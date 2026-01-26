/**
 * System Thresholds & Limits
 */

import { z } from "zod";

const ThresholdsConfigSchema = z.object({
  trust: z.object({
    minTrustScore: z.number().min(0).max(1).default(0.5),
    minEvidenceSpans: z.number().int().positive().default(2),
    contradictionPenalty: z.number().min(0).max(1).default(0.4),
  }),
  cost: z.object({
    maxCostPerRun: z.number().positive().default(5.0),
    maxTokensPerRun: z.number().int().positive().default(100000),
    alertThreshold: z.number().positive().default(3.0),
  }),
  retrieval: z.object({
    maxSources: z.number().int().positive().default(50),
    minRelevanceScore: z.number().min(0).max(1).default(0.6),
    topK: z.number().int().positive().default(12),
  }),
  claims: z.object({
    maxClaimsPerRun: z.number().int().positive().default(50),
    maxEvidenceSpansPerClaim: z.number().int().positive().default(5),
  }),
});

export type ThresholdsConfig = z.infer<typeof ThresholdsConfigSchema>;

export function getThresholdsConfig(): ThresholdsConfig {
  return ThresholdsConfigSchema.parse({
    trust: {
      minTrustScore: parseFloat(process.env.MIN_TRUST_SCORE || "0.5"),
      minEvidenceSpans: parseInt(process.env.MIN_EVIDENCE_SPANS || "2"),
      contradictionPenalty: parseFloat(process.env.CONTRADICTION_PENALTY || "0.4"),
    },
    cost: {
      maxCostPerRun: parseFloat(process.env.MAX_COST_PER_RUN || "5.0"),
      maxTokensPerRun: parseInt(process.env.MAX_TOKENS_PER_RUN || "100000"),
      alertThreshold: parseFloat(process.env.COST_ALERT_THRESHOLD || "3.0"),
    },
    retrieval: {
      maxSources: parseInt(process.env.MAX_SOURCES || "50"),
      minRelevanceScore: parseFloat(process.env.MIN_RELEVANCE_SCORE || "0.6"),
      topK: parseInt(process.env.TOP_K || "12"),
    },
    claims: {
      maxClaimsPerRun: parseInt(process.env.MAX_CLAIMS_PER_RUN || "50"),
      maxEvidenceSpansPerClaim: parseInt(process.env.MAX_EVIDENCE_SPANS_PER_CLAIM || "5"),
    },
  });
}

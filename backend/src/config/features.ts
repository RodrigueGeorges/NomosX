/**
 * Feature Flags Configuration
 */

import { z } from "zod";

const FeatureFlagsSchema = z.object({
  claimExtraction: z.boolean().default(true),
  evidenceBinding: z.boolean().default(true),
  trustScoring: z.boolean().default(true),
  contradictionDetection: z.boolean().default(true),
  hybridRetrieval: z.boolean().default(true),
  reranking: z.boolean().default(false),
});

export type FeatureFlags = z.infer<typeof FeatureFlagsSchema>;

export function getFeatureFlags(): FeatureFlags {
  return FeatureFlagsSchema.parse({
    claimExtraction: process.env.ENABLE_CLAIM_EXTRACTION === "true",
    evidenceBinding: process.env.ENABLE_EVIDENCE_BINDING === "true",
    trustScoring: process.env.ENABLE_TRUST_SCORING === "true",
    contradictionDetection: process.env.ENABLE_CONTRADICTION_DETECTION === "true",
    hybridRetrieval: process.env.ENABLE_HYBRID_RETRIEVAL === "true",
    reranking: process.env.ENABLE_RERANKING === "true",
  });
}

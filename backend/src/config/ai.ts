/**
 * AI Configuration (OpenAI, Cohere, etc.)
 */

import { z } from "zod";

const AIConfigSchema = z.object({
  openai: z.object({
    apiKey: z.string().min(1),
    model: z.string().default("gpt-4o"),
    temperature: z.number().min(0).max(2).default(0.1),
    maxTokens: z.number().int().positive().default(4096),
  }),
  cohere: z.object({
    apiKey: z.string().optional(),
    rerankerModel: z.string().default("rerank-english-v2.0"),
  }),
  embeddings: z.object({
    model: z.string().default("text-embedding-3-small"),
    dimensions: z.number().int().positive().default(1536),
  }),
});

export type AIConfig = z.infer<typeof AIConfigSchema>;

export function getAIConfig(): AIConfig {
  return AIConfigSchema.parse({
    openai: {
      apiKey: process.env.OPENAI_API_KEY,
      model: process.env.OPENAI_MODEL || "gpt-4o",
      temperature: parseFloat(process.env.OPENAI_TEMPERATURE || "0.1"),
      maxTokens: parseInt(process.env.OPENAI_MAX_TOKENS || "4096"),
    },
    cohere: {
      apiKey: process.env.COHERE_API_KEY,
      rerankerModel: process.env.COHERE_RERANKER_MODEL || "rerank-english-v2.0",
    },
    embeddings: {
      model: process.env.EMBEDDING_MODEL || "text-embedding-3-small",
      dimensions: parseInt(process.env.EMBEDDING_DIMENSIONS || "1536"),
    },
  });
}

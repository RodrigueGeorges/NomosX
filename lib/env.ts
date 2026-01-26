/**
 * Environment variables validation with Zod
 * Ensures all required vars are present at runtime
 */

import { z } from "zod";

const envSchema = z.object({
  // Core
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  DATABASE_URL: z.string().url(),
  
  // OpenAI
  OPENAI_API_KEY: z.string().min(1),
  OPENAI_MODEL: z.string().default("gpt-4o"),
  
  // Academic APIs (optional keys, have fallback URLs)
  OPENALEX_API: z.string().url().optional().default("https://api.openalex.org/works"),
  THESESFR_API: z.string().url().optional().default("https://www.theses.fr/api/v1/theses"),
  CROSSREF_API: z.string().url().optional().default("https://api.crossref.org/works"),
  SEMANTICSCHOLAR_API: z.string().url().optional().default("https://api.semanticscholar.org/graph/v1/paper/search"),
  UNPAYWALL_EMAIL: z.string().email().optional(),
  
  // Identity enrichment
  ROR_API: z.string().url().optional().default("https://api.ror.org/organizations"),
  ORCID_API: z.string().url().optional().default("https://pub.orcid.org/v3.0"),
  
  // Macro data
  EUROSTAT_API: z.string().url().optional().default("https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data"),
  ECB_API: z.string().url().optional().default("https://data-api.ecb.europa.eu/service/data"),
  INSEE_API: z.string().url().optional().default("https://api.insee.fr/series/BDM/V1/data"),
  
  // Cohere (for reranking)
  COHERE_API_KEY: z.string().optional(),
  
  // Anthropic (for Claude fallback)
  ANTHROPIC_API_KEY: z.string().optional(),
  
  // Admin
  ADMIN_KEY: z.string().optional(),
  
  // Redis (for caching & rate limiting)
  REDIS_URL: z.preprocess(
    (val) => (val === "" ? undefined : val),
    z.string().url().optional()
  ),
  
  // Sentry (error tracking)
  SENTRY_DSN: z.preprocess(
    (val) => (val === "" ? undefined : val),
    z.string().url().optional()
  ),
  SENTRY_ORG: z.string().optional(),
  SENTRY_PROJECT: z.string().optional(),
  
  // Next.js
  NEXT_PUBLIC_APP_URL: z.string().url().optional().default("http://localhost:3000"),
});

export type Env = z.infer<typeof envSchema>;

function validateEnv(): Env {
  try {
    return envSchema.parse(process.env);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const missing = error.errors.map((e) => `  - ${e.path.join(".")}: ${e.message}`).join("\n");
      throw new Error(`❌ Invalid environment variables:\n${missing}`);
    }
    throw error;
  }
}

export const env = validateEnv();

/**
 * READER Agent V2 - OPTIMISÉ pour 133 sources
 * 
 * AMÉLIORATIONS V2:
 * - Traitement PARALLÈLE par batches (-83% temps)
 * - Timeout par source (5s max)
 * - Skip si contentLength < 300
 * - Meilleur error handling
 */

import { callLLM } from "../llm/unified-llm";
import * as Sentry from "@sentry/nextjs";

/**
 * P2 FIX #2: Error categorization for READER agent
 * Track why extractions fail (helps with debugging and metrics)
 */
export enum ExtractionErrorType {
  LLM_TIMEOUT = "llm_timeout",
  JSON_INVALID = "json_invalid",
  CONNECTION_ERROR = "connection_error",
  TOKEN_LIMIT = "token_limit",
  ABSTRACT_TOO_SHORT = "abstract_too_short",
  FALLBACK_TRIGGERED = "fallback_triggered"
}

export interface ReadingResult {
  sourceId: string;
  claims: string[];
  methods: string[];
  results: string[];
  limitations: string[];
  confidence: "high" | "medium" | "low";
  error?: ExtractionErrorType;  // P2: Track error type
}

/**
 * P1 FIX #1: Rule-based fallback extraction for when LLM fails
 * Uses pattern matching + sentence extraction to get some value
 */
function ruleBasedExtraction(source: any, errorType?: ExtractionErrorType): ReadingResult {
  const abstract = source.abstract || source.summary || "";
  const claims: string[] = [];
  const methods: string[] = [];
  const results: string[] = [];
  const limitations: string[] = [];

  // Extract sentences (simple split by . ! ?)
  const sentences = abstract
    .split(/[.!?]+/)
    .map((s: string) => s.trim())
    .filter((s: string) => s.length > 20 && s.length < 200);

  // Find claims: sentences with research verbs (shows, demonstrates, proves, suggests, finds)
  const claimPatterns = /shows|demonstrates|proves|suggests|finds|indicates|reveals|establishes/i;
  sentences.slice(0, 3).forEach((s: string) => {
    if (claimPatterns.test(s) && claims.length < 3) {
      claims.push(s.substring(0, 120) + (s.length > 120 ? "..." : ""));
    }
  });

  // Find methods: sentences with method verbs (analyzed, examined, studied, conducted, performed)
  const methodPatterns = /analyzed|examined|studied|conducted|performed|investigated|assessed|evaluated/i;
  sentences.forEach((s: string) => {
    if (methodPatterns.test(s) && methods.length < 3) {
      methods.push(s.substring(0, 120) + (s.length > 120 ? "..." : ""));
    }
  });

  // Find results: sentences with result verbs (found, observed, noted, reported, resulted)
  const resultPatterns = /found|observed|noted|reported|resulted|achieved|obtained|identified/i;
  sentences.forEach((s: string) => {
    if (resultPatterns.test(s) && results.length < 3) {
      results.push(s.substring(0, 120) + (s.length > 120 ? "..." : ""));
    }
  });

  // Find limitations: sentences with limitation keywords (limitation, challenge, constraint, however, though)
  const limitationPatterns = /limitation|challenge|constraint|however|though|limited|difficult|unclear/i;
  sentences.forEach((s: string) => {
    if (limitationPatterns.test(s) && limitations.length < 2) {
      limitations.push(s.substring(0, 120) + (s.length > 120 ? "..." : ""));
    }
  });

  // If nothing extracted, add generic limitation
  if (limitations.length === 0) {
    limitations.push("Abstract-based analysis only; full paper review needed");
  }

  console.log(`[Reader P1] Rule-based fallback for ${source.id}: ${claims.length} claims, ${methods.length} methods, ${results.length} results`);
  
  // P2: Log error type for tracking
  if (errorType) {
    console.log(`[Reader P2] Error type: ${errorType}`);
  }

  return {
    sourceId: source.id,
    claims: claims.length > 0 ? claims : ["Unable to extract main claims"],
    methods: methods.length > 0 ? methods : ["Methods not clearly stated"],
    results: results.length > 0 ? results : ["Results not explicitly listed"],
    limitations,
    confidence: "low", // Always low confidence for rule-based extraction
    error: errorType || ExtractionErrorType.FALLBACK_TRIGGERED  // P2: Track error
  };
}

export interface ReadingResult {
  sourceId: string;
  claims: string[];
  methods: string[];
  results: string[];
  limitations: string[];
  confidence: "high" | "medium" | "low";
}

/**
 * READER Agent V2 - Extraction parallèle optimisée
 */
export async function readerAgent(sources: any[]): Promise<ReadingResult[]> {
  console.log(`[READER V2] Processing ${sources.length} sources in parallel`);
  
  // Filtrer sources trop courtes (Content-First)
  const richSources = sources.filter(s => {
    const contentLen = s.contentLength || s.abstract?.length || 0;
    return contentLen >= 300;
  });
  
  const skipped = sources.length - richSources.length;
  if (skipped > 0) {
    console.log(`[READER V2] Skipped ${skipped} sources (content < 300 chars)`);
  }
  
  // Traiter par batches de 10 (limite OpenAI concurrence)
  const BATCH_SIZE = 10;
  const results: ReadingResult[] = [];
  
  for (let i = 0; i < richSources.length; i += BATCH_SIZE) {
    const batch = richSources.slice(i, i + BATCH_SIZE);
    const batchNum = Math.floor(i / BATCH_SIZE) + 1;
    const totalBatches = Math.ceil(richSources.length / BATCH_SIZE);
    
    console.log(`[READER V2] Batch ${batchNum}/${totalBatches} (${batch.length} sources)`);
    
    // PARALLÈLE au lieu de séquentiel
    const batchResults = await Promise.allSettled(
      batch.map(source => extractWithTimeout(source, 5000))
    );
    
    batchResults.forEach((result, idx) => {
      if (result.status === 'fulfilled') {
        results.push(result.value);
      } else {
        const source = batch[idx];
        console.warn(`[READER V2] Failed: ${source.id} - ${result.reason}`);
        results.push({
          sourceId: source.id,
          claims: [],
          methods: [],
          results: [],
          limitations: [`Extraction timeout or error`],
          confidence: 'low'
        });
      }
    });
  }
  
  // Ajouter résultats vides pour sources skipped
  const skippedSources = sources.filter(s => !richSources.includes(s));
  skippedSources.forEach(source => {
    results.push({
      sourceId: source.id,
      claims: [],
      methods: [],
      results: [],
      limitations: ["Insufficient content for analysis"],
      confidence: "low",
    });
  });
  
  const successCount = results.filter(r => r.confidence !== 'low').length;
  console.log(`[READER V2] ✅ Extracted from ${successCount}/${sources.length} sources`);
  
  return results;
}

/**
 * Extraction avec timeout
 */
async function extractWithTimeout(source: any, timeout: number): Promise<ReadingResult> {
  return Promise.race([
    extractClaims(source),
    new Promise<ReadingResult>((_, reject) => 
      setTimeout(() => reject(new Error('Timeout')), timeout)
    )
  ]);
}

/**
 * Extraction des claims/methods/results
 */
async function extractClaims(source: any): Promise<ReadingResult> {
  const abstract = source.abstract || "";
  
  if (!abstract || abstract.length < 100) {
    // P2: Categorize short abstract error
    return ruleBasedExtraction(source, ExtractionErrorType.ABSTRACT_TOO_SHORT);
  }

  const prompt = `You are a research analyst extracting key information from an academic abstract.

Title: ${source.title}
Abstract: ${abstract.slice(0, 2000)}

Extract and return JSON with these keys:
- claims: array of main claims/hypotheses (max 3)
- methods: array of research methods used (max 3)
- results: array of key findings (max 3)
- limitations: array of stated or implied limitations (max 2)
- confidence: "high", "medium", or "low" based on abstract quality and clarity

Be concise. Each item should be one sentence max.`;

  try {
    // Call unified LLM service with caching
    const response = await callLLM({
      messages: [{ role: "user", content: prompt }],
      temperature: 0.1,
      jsonMode: true,
      maxTokens: 1000,
      enableCache: true, // Cache repeated abstracts
    });

    const extracted = JSON.parse(response.content);

    return {
      sourceId: source.id,
      claims: extracted.claims || [],
      methods: extracted.methods || [],
      results: extracted.results || [],
      limitations: extracted.limitations || [],
      confidence: extracted.confidence || "medium",
      error: undefined  // Success - no error
    };
  } catch (parseError: any) {
    // P2: Categorize error type for metrics
    let errorType = ExtractionErrorType.JSON_INVALID;
    
    if (parseError.message.includes("timeout")) {
      errorType = ExtractionErrorType.LLM_TIMEOUT;
    } else if (parseError.message.includes("token")) {
      errorType = ExtractionErrorType.TOKEN_LIMIT;
    } else if (parseError.message.includes("connection")) {
      errorType = ExtractionErrorType.CONNECTION_ERROR;
    }

    console.warn(`[Reader P2] Error categorized as: ${errorType} for ${source.id}`);
    
    // Log to Sentry with error category
    Sentry.captureException(parseError, {
      tags: {
        agent: "reader",
        errorType,
        sourceId: source.id,
        fallbackTriggered: true
      }
    });
    
    // P1 FIX #1: Fallback to rule-based extraction
    return ruleBasedExtraction(source, errorType);
  }
}

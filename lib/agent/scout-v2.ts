/**
 * SCOUT AGENT V2 — PRODUCTION-GRADE
 * 
 * Major improvements over V1:
 * 1. Query Enhancement: LLM-powered query optimization
 * 2. Multi-Query Search: Parallel searches with variations
 * 3. Relevance Filtering: Only keep sources matching query
 * 4. Cohere Reranking: State-of-the-art relevance sorting
 * 5. Quality Gates: Metrics, logging, error handling
 * 6. Deduplication: Smart merging of duplicate sources
 * 
 * Quality metrics tracked:
 * - Source count (raw vs filtered)
 * - Average relevance score
 * - Provider distribution
 * - Query enhancement time
 * - Reranking time
 */

import { prisma } from "../db";
import { scoreSource, scoreNovelty } from "../score";
import { clamp } from "../text";
import { searchOpenAlex } from "../providers/openalex";
import { searchThesesFr } from "../providers/thesesfr";
import { searchCrossref } from "../providers/crossref";
import { searchSemanticScholar } from "../providers/semanticscholar";
import { unpaywallByDoi } from "../providers/unpaywall";
import { enhanceQuery, generateSearchQueries, type EnhancedQuery } from "./query-enhancer";
import { filterByRelevance, logRelevanceScores } from "./relevance-scorer";
import { rerankSources } from "./cohere-reranker";

export type Providers = Array<"openalex" | "thesesfr" | "crossref" | "semanticscholar">;

export interface ScoutResult {
  found: number;
  upserted: number;
  sourceIds: string[];
  metrics: {
    rawCount: number;
    afterDedup: number;
    afterRelevance: number;
    afterRerank: number;
    avgRelevance: number;
    queryEnhanceTime: number;
    searchTime: number;
    rerankTime: number;
    providerCounts: Record<string, number>;
  };
  enhancedQuery: EnhancedQuery;
}

interface RawSource {
  id: string;
  provider: string;
  type: string;
  title: string;
  abstract?: string | null;
  year?: number | null;
  doi?: string | null;
  url?: string | null;
  pdfUrl?: string | null;
  oaStatus?: string | null;
  topics?: string[];
  jelCodes?: string[];
  citationCount?: number | null;
  authors?: Array<{ name: string; orcid?: string }>;
  institutions?: Array<{ name: string; rorId?: string }>;
  raw?: any;
}

/**
 * SCOUT V2: Enhanced academic search with quality control
 */
export async function scoutV2(
  query: string,
  providers: Providers,
  options: {
    perProvider?: number;
    minRelevance?: number;
    maxSources?: number;
    useReranking?: boolean;
    useQueryEnhancement?: boolean;
  } = {}
): Promise<ScoutResult> {
  const {
    perProvider = 20,
    minRelevance = 0.4,
    maxSources = 30,
    useReranking = true,
    useQueryEnhancement = true,
  } = options;

  const startTime = Date.now();
  const metrics = {
    rawCount: 0,
    afterDedup: 0,
    afterRelevance: 0,
    afterRerank: 0,
    avgRelevance: 0,
    queryEnhanceTime: 0,
    searchTime: 0,
    rerankTime: 0,
    providerCounts: {} as Record<string, number>,
  };

  // ========================================
  // STEP 1: QUERY ENHANCEMENT
  // ========================================
  console.log(`\n[ScoutV2] Original query: "${query}"`);
  
  let enhancedQuery: EnhancedQuery;
  if (useQueryEnhancement) {
    const enhanceStart = Date.now();
    enhancedQuery = await enhanceQuery(query);
    metrics.queryEnhanceTime = Date.now() - enhanceStart;
    
    if (!enhancedQuery || typeof enhancedQuery !== 'object') {
      console.warn('[ScoutV2] Query enhancement returned invalid data, falling back to original');
      enhancedQuery = {
        original: query,
        language: "en",
        translated: query,
        enhanced: query,
        variations: [],
        keywords: [],
        topics: [],
      };
    } else {
      console.log(`[ScoutV2] Enhanced query: "${enhancedQuery.enhanced}"`);
      console.log(`[ScoutV2] Keywords: ${enhancedQuery.keywords.join(", ")}`);
      console.log(`[ScoutV2] Topics: ${enhancedQuery.topics.join(", ")}`);
      console.log(`[ScoutV2] Variations: ${enhancedQuery.variations.length}`);
    }
  } else {
    enhancedQuery = {
      original: query,
      language: "en",
      translated: query,
      enhanced: query,
      variations: [],
      keywords: [],
      topics: [],
    };
  }

  // ========================================
  // STEP 2: MULTI-QUERY SEARCH
  // ========================================
  const searchQueries = useQueryEnhancement 
    ? generateSearchQueries(enhancedQuery)
    : [query];
  
  console.log(`[ScoutV2] Searching with ${searchQueries.length} query variations across ${providers.length} providers...`);
  
  const searchStart = Date.now();
  const pool: RawSource[] = [];

  // Execute searches in parallel for each query variation
  for (const searchQuery of searchQueries) {
    const promises = [];
    if (providers.includes("openalex")) promises.push(searchOpenAlex(searchQuery, perProvider));
    if (providers.includes("thesesfr")) promises.push(searchThesesFr(searchQuery, Math.min(10, perProvider)));
    if (providers.includes("crossref")) promises.push(searchCrossref(searchQuery, Math.min(20, perProvider)));
    if (providers.includes("semanticscholar")) promises.push(searchSemanticScholar(searchQuery, Math.min(20, perProvider)));

    const results = await Promise.allSettled(promises);
    results.forEach((r) => {
      if (r.status === "fulfilled") {
        pool.push(...r.value);
      } else {
        console.error(`[ScoutV2] Provider failed: ${r.reason}`);
      }
    });
  }

  metrics.rawCount = pool.length;
  metrics.searchTime = Date.now() - searchStart;
  
  console.log(`[ScoutV2] Raw results: ${metrics.rawCount} sources`);

  // Count sources per provider
  pool.forEach(s => {
    metrics.providerCounts[s.provider] = (metrics.providerCounts[s.provider] || 0) + 1;
  });

  // ========================================
  // STEP 3: DEDUPLICATION
  // ========================================
  const deduped = deduplicateByDOIAndTitle(pool);
  metrics.afterDedup = deduped.length;
  
  console.log(`[ScoutV2] After deduplication: ${metrics.afterDedup} sources`);

  // ========================================
  // STEP 4: RELEVANCE FILTERING
  // ========================================
  const relevant = filterByRelevance(deduped, enhancedQuery, minRelevance);
  metrics.afterRelevance = relevant.length;
  
  if (relevant.length > 0) {
    metrics.avgRelevance = relevant.reduce((sum, r) => sum + r.score.overall, 0) / relevant.length;
  }
  
  console.log(`[ScoutV2] After relevance filter (>${minRelevance}): ${metrics.afterRelevance} sources`);
  console.log(`[ScoutV2] Average relevance: ${(metrics.avgRelevance * 100).toFixed(1)}%`);

  // Log top sources for debugging
  logRelevanceScores(relevant, 5);

  // ========================================
  // STEP 5: COHERE RERANKING (optional)
  // ========================================
  let reranked = relevant.map(r => ({ source: r.source, relevanceScore: r.score.overall, index: 0 }));
  
  if (useReranking && relevant.length > 0) {
    const rerankStart = Date.now();
    reranked = await rerankSources(
      relevant.map(r => r.source),
      enhancedQuery,
      { topK: Math.min(maxSources, relevant.length), minScore: minRelevance }
    );
    metrics.rerankTime = Date.now() - rerankStart;
    metrics.afterRerank = reranked.length;
    
    console.log(`[ScoutV2] After reranking: ${metrics.afterRerank} sources`);
  } else {
    // Just sort by relevance score and take top N
    reranked = reranked
      .sort((a, b) => b.relevanceScore - a.relevanceScore)
      .slice(0, maxSources);
    metrics.afterRerank = reranked.length;
  }

  // ========================================
  // STEP 6: UPSERT TO DATABASE
  // ========================================
  const sourceIds: string[] = [];
  let upserted = 0;

  for (const { source: s } of reranked) {
    const qualityScore = scoreSource({
      year: s.year ?? null,
      citationCount: s.citationCount ?? null,
      oaStatus: s.oaStatus ?? null,
      institutions: s.institutions?.map((i) => i.name) ?? [],
      provider: s.provider,
      type: s.type,
    });

    let pdfUrl = s.pdfUrl ?? null;
    let oaStatus = s.oaStatus ?? null;

    // Enrich with Unpaywall if DOI available
    if (!pdfUrl && s.doi) {
      try {
        const up = await unpaywallByDoi(s.doi);
        pdfUrl = up.pdfUrl ?? pdfUrl;
        oaStatus = up.oaStatus ?? oaStatus;
      } catch {}
    }

    const created = await prisma.source.upsert({
      where: { id: s.id },
      update: {
        provider: s.provider || "unknown",
        type: s.type || "paper",
        title: s.title || "",
        abstract: s.abstract ? clamp(String(s.abstract), 8000) : null,
        year: s.year ?? null,
        doi: s.doi ?? null,
        url: s.url ?? null,
        pdfUrl,
        oaStatus,
        topics: (s.topics ?? []).map(String).filter(Boolean),
        jelCodes: (s.jelCodes ?? []).map(String).filter(Boolean),
        citationCount: s.citationCount ?? null,
        qualityScore,
      },
      create: {
        id: s.id,
        provider: s.provider || "unknown",
        type: s.type || "paper",
        title: s.title || "",
        abstract: s.abstract ? clamp(String(s.abstract), 8000) : null,
        year: s.year ?? null,
        doi: s.doi ?? null,
        url: s.url ?? null,
        pdfUrl,
        oaStatus,
        topics: (s.topics ?? []).map(String).filter(Boolean),
        jelCodes: (s.jelCodes ?? []).map(String).filter(Boolean),
        citationCount: s.citationCount ?? null,
        qualityScore,
      },
    });

    sourceIds.push(created.id);
    upserted += 1;
  }

  // ========================================
  // STEP 7: QUALITY METRICS
  // ========================================
  const totalTime = Date.now() - startTime;
  console.log(`\n[ScoutV2] ✅ COMPLETED in ${totalTime}ms`);
  console.log(`[ScoutV2] Pipeline: ${metrics.rawCount} → ${metrics.afterDedup} (dedup) → ${metrics.afterRelevance} (relevance) → ${metrics.afterRerank} (rerank) → ${upserted} (saved)`);
  console.log(`[ScoutV2] Quality: Avg relevance ${(metrics.avgRelevance * 100).toFixed(1)}%`);
  console.log(`[ScoutV2] Providers:`, metrics.providerCounts);

  return {
    found: pool.length,
    upserted,
    sourceIds,
    metrics,
    enhancedQuery,
  };
}

/**
 * Deduplicate sources by DOI (primary) and title similarity (fallback)
 */
function deduplicateByDOIAndTitle(sources: RawSource[]): RawSource[] {
  const seen = new Map<string, RawSource>();
  const titleIndex = new Map<string, RawSource>();

  for (const source of sources) {
    // Primary: deduplicate by DOI
    if (source.doi) {
      const doi = source.doi.toLowerCase();
      if (!seen.has(doi)) {
        seen.set(doi, source);
      }
      continue;
    }

    // Fallback: deduplicate by normalized title
    const normalizedTitle = normalizeTitle(source.title);
    if (normalizedTitle) {
      if (!titleIndex.has(normalizedTitle)) {
        titleIndex.set(normalizedTitle, source);
        seen.set(source.id, source);
      }
    } else {
      // No DOI, no title → keep anyway
      seen.set(source.id, source);
    }
  }

  return Array.from(seen.values());
}

/**
 * Normalize title for deduplication
 */
function normalizeTitle(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s]/g, "") // Remove punctuation
    .replace(/\s+/g, " ") // Collapse whitespace
    .trim();
}

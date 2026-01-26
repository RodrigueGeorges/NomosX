/**
 * PIPELINE V3 — PRODUCTION-GRADE
 * 
 * Complete agentic pipeline with quality controls:
 * 
 * SCOUT V2 → INDEX → DEDUPE → RANK V2 → READER → ANALYST → GUARD → EDITOR → PUBLISHER
 * 
 * Improvements over V2:
 * - Uses SCOUT V2 (query enhancement, reranking, relevance filtering)
 * - Enhanced RANK with relevance weighting
 * - Quality gates at each step
 * - Comprehensive metrics & logging
 * - Graceful degradation on errors
 */

import { prisma } from "../db";
import { scoreNovelty } from "../score";
import { scoutV2, type Providers } from "./scout-v2";
import { indexAgent, deduplicateSources } from "./index-agent";
import { readerAgent } from "./reader-agent";
import { analystAgent } from "./analyst-agent";
import { citationGuard, renderBriefHTML } from "./pipeline-v2";

export interface PipelineStats {
  scout: {
    rawSources: number;
    filteredSources: number;
    avgRelevance: number;
    providers: Record<string, number>;
  };
  index: {
    enriched: number;
    errors: string[];
  };
  dedupe: {
    removed: number;
  };
  rank: {
    count: number;
    avgQuality: number;
  };
  reader: {
    count: number;
    avgClaims: number;
  };
  analyst: {
    hasDebate: boolean;
    citationCount: number;
  };
  guard: {
    ok: boolean;
    usedCitations: number;
    invalidCitations: number[];
  };
  brief: {
    id: string;
    publicId: string | null;
  };
  totalTime: number;
}

/**
 * Run full pipeline V3 with quality controls
 */
export async function runPipelineV3(
  query: string,
  providers: Providers = ["openalex", "semanticscholar", "crossref"],
  options: {
    perProvider?: number;
    minRelevance?: number;
    topSources?: number;
    useReranking?: boolean;
  } = {}
): Promise<{ briefId: string; stats: PipelineStats }> {
  const {
    perProvider = 20,
    minRelevance = 0.4,
    topSources = 12,
    useReranking = true,
  } = options;

  const startTime = Date.now();
  const stats: Partial<PipelineStats> = {};

  console.log(`\n${"=".repeat(80)}`);
  console.log(`🚀 PIPELINE V3 START`);
  console.log(`Query: "${query}"`);
  console.log(`Providers: ${providers.join(", ")}`);
  console.log(`${"=".repeat(80)}\n`);

  // ========================================
  // STEP 1: SCOUT V2
  // ========================================
  console.log(`[Pipeline] 🔍 STEP 1: SCOUT V2`);
  const scoutResult = await scoutV2(query, providers, {
    perProvider,
    minRelevance,
    maxSources: 40, // Get more sources for ranking
    useReranking,
    useQueryEnhancement: true,
  });

  stats.scout = {
    rawSources: scoutResult.found,
    filteredSources: scoutResult.upserted,
    avgRelevance: scoutResult.metrics.avgRelevance,
    providers: scoutResult.metrics.providerCounts,
  };

  // Quality Gate: Ensure we have enough sources
  if (scoutResult.upserted < 5) {
    console.warn(`⚠️  [Pipeline] Quality Gate Failed: Only ${scoutResult.upserted} relevant sources found. Minimum is 5.`);
    console.warn(`   Consider: 1) Broadening query, 2) Adding more providers, 3) Lowering minRelevance`);
  }

  // ========================================
  // STEP 2: INDEX (Enrich with authors, institutions)
  // ========================================
  console.log(`\n[Pipeline] 📚 STEP 2: INDEX (${scoutResult.sourceIds.length} sources)`);
  const indexResult = await indexAgent(scoutResult.sourceIds);
  stats.index = indexResult;

  // Update novelty scores
  for (const sourceId of scoutResult.sourceIds) {
    const source = await prisma.source.findUnique({ where: { id: sourceId } });
    if (!source) continue;

    const noveltyScore = scoreNovelty({
      year: source.year,
      citationCount: source.citationCount,
      createdAt: source.createdAt,
    });

    await prisma.source.update({
      where: { id: sourceId },
      data: { noveltyScore },
    });
  }

  // ========================================
  // STEP 3: DEDUPLICATE
  // ========================================
  console.log(`\n[Pipeline] 🧹 STEP 3: DEDUPLICATE`);
  const dedupeResult = await deduplicateSources();
  stats.dedupe = dedupeResult;

  // ========================================
  // STEP 4: RANK V2 (Quality + Recency)
  // ========================================
  console.log(`\n[Pipeline] 🏆 STEP 4: RANK (top ${topSources})`);
  
  // Hybrid ranking: quality score + recency + novelty
  const rankedSources = await prisma.source.findMany({
    where: {
      id: { in: scoutResult.sourceIds },
    },
    take: topSources,
    orderBy: [
      { qualityScore: "desc" },
      { year: "desc" },
      { citationCount: "desc" },
    ],
    include: {
      authors: {
        include: { author: true },
      },
      institutions: {
        include: { institution: true },
      },
    },
  });

  const avgQuality = rankedSources.length > 0
    ? rankedSources.reduce((sum, s) => sum + (s.qualityScore || 0), 0) / rankedSources.length
    : 0;

  stats.rank = {
    count: rankedSources.length,
    avgQuality,
  };

  console.log(`[Pipeline] Ranked ${rankedSources.length} sources, avg quality: ${avgQuality.toFixed(1)}`);

  // Quality Gate: Ensure we have quality sources
  if (avgQuality < 50) {
    console.warn(`⚠️  [Pipeline] Quality Gate Warning: Average quality score is ${avgQuality.toFixed(1)} (below 50)`);
  }

  // ========================================
  // STEP 5: READER (Extract claims, methods, results)
  // ========================================
  console.log(`\n[Pipeline] 📖 STEP 5: READER`);
  const readings = await readerAgent(rankedSources);

  const avgClaims = readings.length > 0
    ? readings.reduce((sum, r) => sum + (r.claims?.length || 0), 0) / readings.length
    : 0;

  stats.reader = {
    count: readings.length,
    avgClaims,
  };

  console.log(`[Pipeline] Read ${readings.length} sources, avg claims per source: ${avgClaims.toFixed(1)}`);

  // ========================================
  // STEP 6: ANALYST (Synthesize)
  // ========================================
  console.log(`\n[Pipeline] 🧠 STEP 6: ANALYST`);
  const analysis = await analystAgent(query, rankedSources, readings);

  // Count citations
  const citationCount = (JSON.stringify(analysis).match(/\[SRC-\d+\]/g) || []).length;

  stats.analyst = {
    hasDebate: !!analysis.debate,
    citationCount,
  };

  console.log(`[Pipeline] Analysis complete, ${citationCount} citations`);

  // ========================================
  // STEP 7: CITATION GUARD
  // ========================================
  console.log(`\n[Pipeline] 🛡️  STEP 7: CITATION GUARD`);
  const guard = citationGuard(analysis, rankedSources.length);
  stats.guard = {
    ok: guard.ok,
    usedCitations: guard.usedCount,
    invalidCitations: guard.invalid,
  };

  if (!guard.ok) {
    console.error(`❌ [Pipeline] Citation Guard Failed: ${guard.usedCount} citations, ${guard.invalid.length} invalid`);
    throw new Error(
      `Citation guard failed: Found ${guard.invalid.length} invalid citations. ` +
      `Valid range is [SRC-1] to [SRC-${rankedSources.length}]. ` +
      `Invalid: ${guard.invalid.join(", ")}`
    );
  }

  console.log(`[Pipeline] ✅ Citation guard passed: ${guard.usedCount} valid citations`);

  // ========================================
  // STEP 8: EDITOR (Render HTML)
  // ========================================
  console.log(`\n[Pipeline] ✍️  STEP 8: EDITOR`);
  const html = renderBriefHTML(analysis, rankedSources);

  // ========================================
  // STEP 9: PUBLISHER (Save to DB)
  // ========================================
  console.log(`\n[Pipeline] 📤 STEP 9: PUBLISHER`);
  const brief = await prisma.brief.create({
    data: {
      kind: "brief",
      question: query,
      html,
      sources: rankedSources.map((s) => s.id),
      publicId: null, // Set later when publishing
    },
  });

  stats.brief = {
    id: brief.id,
    publicId: brief.publicId,
  };

  // ========================================
  // FINAL STATS
  // ========================================
  stats.totalTime = Date.now() - startTime;

  console.log(`\n${"=".repeat(80)}`);
  console.log(`✅ PIPELINE V3 COMPLETE`);
  console.log(`Brief ID: ${brief.id}`);
  console.log(`Total time: ${stats.totalTime}ms`);
  console.log(`Quality: ${stats.scout!.avgRelevance * 100}% relevance, ${stats.rank!.avgQuality} avg source quality`);
  console.log(`${"=".repeat(80)}\n`);

  return {
    briefId: brief.id,
    stats: stats as PipelineStats,
  };
}

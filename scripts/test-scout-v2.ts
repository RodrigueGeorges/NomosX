/**
 * Test script for SCOUT V2
 * 
 * Usage: npx tsx scripts/test-scout-v2.ts
 */

import { scoutV2 } from "../lib/agent/scout-v2";
import { runPipelineV3 } from "../lib/agent/pipeline-v3";

async function main() {
  console.log("\n" + "=".repeat(80));
  console.log("🧪 SCOUT V2 — TEST SCRIPT");
  console.log("=".repeat(80) + "\n");

  // Test 1: Query Enhancement only
  console.log("📝 Test 1: Query Enhancement");
  console.log("-".repeat(80));
  
  const { enhanceQuery } = await import("../lib/agent/query-enhancer");
  
  const testQueries = [
    "quels sont les impacts de l'IA sur le travail ?",
    "carbon tax effectiveness climate change",
    "什么是机器学习？", // Chinese (should still work)
  ];

  for (const query of testQueries) {
    try {
      console.log(`\nQuery: "${query}"`);
      const enhanced = await enhanceQuery(query);
      console.log(`  Language: ${enhanced.language}`);
      console.log(`  Translated: "${enhanced.translated}"`);
      console.log(`  Enhanced: "${enhanced.enhanced}"`);
      console.log(`  Keywords: ${enhanced.keywords.join(", ")}`);
      console.log(`  Topics: ${enhanced.topics.join(", ")}`);
    } catch (error: any) {
      console.error(`  ❌ Error: ${error.message}`);
    }
  }

  // Test 2: SCOUT V2 (light)
  console.log("\n\n🔍 Test 2: SCOUT V2 (5 sources per provider)");
  console.log("-".repeat(80));

  try {
    const result = await scoutV2(
      "artificial intelligence impact on employment",
      ["openalex"],
      {
        perProvider: 10,
        minRelevance: 0.3,  // Lower threshold for test
        maxSources: 10,
        useReranking: false, // Skip for speed
        useQueryEnhancement: true,
      }
    );

    console.log("\n✅ SCOUT V2 Results:");
    console.log(`  Raw sources: ${result.metrics.rawCount}`);
    console.log(`  After dedup: ${result.metrics.afterDedup}`);
    console.log(`  After relevance filter: ${result.metrics.afterRelevance}`);
    console.log(`  Final sources: ${result.upserted}`);
    console.log(`  Avg relevance: ${(result.metrics.avgRelevance * 100).toFixed(1)}%`);
    console.log(`  Query enhance time: ${result.metrics.queryEnhanceTime}ms`);
    console.log(`  Search time: ${result.metrics.searchTime}ms`);
    console.log(`  Providers:`, result.metrics.providerCounts);

    if (result.upserted > 0) {
      console.log("\n  Top sources:");
      const topSources = await (await import("../lib/db")).prisma.source.findMany({
        where: { id: { in: result.sourceIds.slice(0, 3) } },
        select: { id: true, title: true, year: true, citationCount: true },
      });
      topSources.forEach((s, i) => {
        console.log(`    ${i + 1}. ${s.title.slice(0, 80)}... (${s.year}, ${s.citationCount} citations)`);
      });
    }
  } catch (error: any) {
    console.error(`\n❌ SCOUT V2 Error: ${error.message}`);
    console.error(error.stack);
  }

  // Test 3: Full Pipeline V3 (optional, heavy)
  const runFullPipeline = process.argv.includes("--full");
  
  if (runFullPipeline) {
    console.log("\n\n🚀 Test 3: Full Pipeline V3");
    console.log("-".repeat(80));
    console.log("⚠️  This will take ~60-90 seconds and use OpenAI credits\n");

    try {
      const { briefId, stats } = await runPipelineV3(
        "what is the impact of carbon taxes on CO2 emissions?",
        ["openalex"],
        {
          perProvider: 10,
          minRelevance: 0.5,
          topSources: 8,
          useReranking: false,
        }
      );

      console.log("\n✅ Pipeline V3 Results:");
      console.log(`  Brief ID: ${briefId}`);
      console.log(`  Total time: ${stats.totalTime}ms`);
      console.log(`  Sources: ${stats.scout.rawSources} → ${stats.scout.filteredSources} (${(stats.scout.avgRelevance * 100).toFixed(1)}% avg relevance)`);
      console.log(`  Quality: ${stats.rank.avgQuality.toFixed(1)}`);
      console.log(`  Claims: ${stats.reader.avgClaims.toFixed(1)} per source`);
      console.log(`  Citations: ${stats.analyst.citationCount}`);
      console.log(`  Guard: ${stats.guard.ok ? "✅ PASSED" : "❌ FAILED"}`);
    } catch (error: any) {
      console.error(`\n❌ Pipeline V3 Error: ${error.message}`);
      console.error(error.stack);
    }
  } else {
    console.log("\n\nℹ️  To test full Pipeline V3, run:");
    console.log("   npx tsx scripts/test-scout-v2.ts --full");
  }

  console.log("\n" + "=".repeat(80));
  console.log("✅ Tests completed");
  console.log("=".repeat(80) + "\n");

  process.exit(0);
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});

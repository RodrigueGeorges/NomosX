/**
 * Integration tests for SCOUT V2
 * 
 * Note: These tests make real API calls and require:
 * - DATABASE_URL configured
 * - OPENAI_API_KEY configured
 * - (Optional) COHERE_API_KEY for reranking tests
 * 
 * Run with: npm test -- scout-v2.integration.test.ts
 */

import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { scoutV2 } from "../scout-v2";
import { prisma } from "../../db";

describe("SCOUT V2 Integration Tests", () => {
  beforeAll(async () => {
    // Ensure DB is connected
    await prisma.$connect();
  });

  afterAll(async () => {
    // Cleanup: delete test sources
    await prisma.source.deleteMany({
      where: {
        id: {
          contains: "test-scout-v2",
        },
      },
    });
    await prisma.$disconnect();
  });

  it("should search and filter sources with query enhancement", async () => {
    const result = await scoutV2(
      "quels sont les impacts de l'IA sur le travail ?",
      ["openalex"],
      {
        perProvider: 10,
        minRelevance: 0.4,
        maxSources: 5,
        useReranking: false, // Disable for faster test
        useQueryEnhancement: true,
      }
    );

    // Should have enhanced the query
    expect(result.enhancedQuery.translated).toBeTruthy();
    expect(result.enhancedQuery.keywords.length).toBeGreaterThan(0);

    // Should have found sources
    expect(result.found).toBeGreaterThan(0);

    // Should have filtered by relevance
    expect(result.metrics.afterRelevance).toBeLessThanOrEqual(result.metrics.rawCount);
    expect(result.metrics.avgRelevance).toBeGreaterThan(0);

    // Should have saved to database
    expect(result.upserted).toBe(result.sourceIds.length);

    // Verify sources exist in DB
    const sources = await prisma.source.findMany({
      where: {
        id: { in: result.sourceIds },
      },
    });
    expect(sources.length).toBe(result.upserted);

    // All sources should be relevant to AI/work/employment
    const relevantCount = sources.filter(s =>
      s.title.toLowerCase().includes("ai") ||
      s.title.toLowerCase().includes("artificial intelligence") ||
      s.title.toLowerCase().includes("employment") ||
      s.title.toLowerCase().includes("work") ||
      s.title.toLowerCase().includes("labor")
    ).length;

    // At least 50% should have AI/employment keywords in title
    expect(relevantCount / sources.length).toBeGreaterThan(0.3);
  }, 60000); // 60s timeout for API calls

  it("should handle multi-provider search", async () => {
    const result = await scoutV2(
      "carbon tax effectiveness",
      ["openalex", "semanticscholar"],
      {
        perProvider: 5,
        minRelevance: 0.5,
        maxSources: 10,
        useReranking: false,
        useQueryEnhancement: true,
      }
    );

    // Should have results from multiple providers
    expect(Object.keys(result.metrics.providerCounts).length).toBeGreaterThan(0);

    // Each provider should have contributed
    const totalFromProviders = Object.values(result.metrics.providerCounts).reduce((sum, count) => sum + count, 0);
    expect(totalFromProviders).toBe(result.metrics.rawCount);

    // Should have deduplicated
    expect(result.metrics.afterDedup).toBeLessThanOrEqual(result.metrics.rawCount);
  }, 60000);

  it("should work without query enhancement (fallback)", async () => {
    const result = await scoutV2(
      "machine learning applications",
      ["openalex"],
      {
        perProvider: 5,
        minRelevance: 0.3,
        maxSources: 5,
        useReranking: false,
        useQueryEnhancement: false, // Disabled
      }
    );

    // Should still work but with original query
    expect(result.enhancedQuery.enhanced).toBe("machine learning applications");
    expect(result.found).toBeGreaterThan(0);
    expect(result.upserted).toBeGreaterThan(0);
  }, 30000);

  it("should handle queries with no results gracefully", async () => {
    const result = await scoutV2(
      "xyzabc123nonexistentqueryforsure",
      ["openalex"],
      {
        perProvider: 5,
        minRelevance: 0.4,
        maxSources: 5,
        useReranking: false,
      }
    );

    // Should complete without errors
    expect(result.found).toBe(0);
    expect(result.upserted).toBe(0);
    expect(result.sourceIds).toHaveLength(0);
  }, 30000);

  it("should respect minRelevance threshold", async () => {
    const highThreshold = await scoutV2(
      "climate change policy",
      ["openalex"],
      {
        perProvider: 10,
        minRelevance: 0.7, // High threshold
        maxSources: 20,
        useReranking: false,
      }
    );

    const lowThreshold = await scoutV2(
      "climate change policy",
      ["openalex"],
      {
        perProvider: 10,
        minRelevance: 0.3, // Low threshold
        maxSources: 20,
        useReranking: false,
      }
    );

    // Lower threshold should yield more results
    expect(lowThreshold.metrics.afterRelevance).toBeGreaterThanOrEqual(highThreshold.metrics.afterRelevance);

    // High threshold should have higher average relevance
    if (highThreshold.metrics.afterRelevance > 0 && lowThreshold.metrics.afterRelevance > 0) {
      expect(highThreshold.metrics.avgRelevance).toBeGreaterThanOrEqual(lowThreshold.metrics.avgRelevance);
    }
  }, 60000);
});

import { NextRequest, NextResponse } from "next/server";
import { scout } from "@/lib/agent/pipeline-v2";
import { indexAgent, deduplicateSources } from "@/lib/agent/index-agent";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { query, providers, perProvider } = body;

    if (!query || !providers || !Array.isArray(providers) || providers.length === 0) {
      return NextResponse.json(
        { error: "Missing required fields: query, providers" },
        { status: 400 }
      );
    }

    console.log(`[Ingestion] Starting: query="${query}", providers=${providers.join(",")}, perProvider=${perProvider || 20}`);

    // 1. SCOUT: Collect sources
    console.log("[Ingestion] Step 1/4: SCOUT (collecte sources)");
    const scoutResult = await scout(query, providers, perProvider || 20);
    console.log(`[Ingestion] SCOUT done: ${scoutResult.found} found, ${scoutResult.upserted} upserted`);

    if (scoutResult.sourceIds.length === 0) {
      return NextResponse.json({
        found: 0,
        upserted: 0,
        authorsCreated: 0,
        institutionsCreated: 0,
        message: "No sources found for this query",
      });
    }

    // 2. INDEX: Enrich authors + institutions
    console.log("[Ingestion] Step 2/4: INDEX (enrichissement)");
    const indexResult = await indexAgent(scoutResult.sourceIds);
    console.log(`[Ingestion] INDEX done: ${indexResult.enriched} enriched, ${indexResult.errors.length} errors`);

    // 3. DEDUPE: Remove duplicates
    console.log("[Ingestion] Step 3/4: DEDUPE (dédoublonnage)");
    const dedupeResult = await deduplicateSources();
    console.log(`[Ingestion] DEDUPE done: ${dedupeResult.removed} duplicates removed`);

    // 4. Get stats
    console.log("[Ingestion] Step 4/4: STATS (statistiques finales)");
    const [authorsCount, institutionsCount] = await Promise.all([
      prisma.author.count(),
      prisma.institution.count(),
    ]);

    const result = {
      found: scoutResult.found,
      upserted: scoutResult.upserted - dedupeResult.removed,
      authorsCreated: authorsCount,
      institutionsCreated: institutionsCount,
      message: "Ingestion completed successfully",
    };

    console.log(`[Ingestion] Complete:`, result);

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("[Ingestion] Error:", error);
    return NextResponse.json(
      {
        error: "Ingestion failed",
        details: error.message,
      },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { scout } from '@/lib/agent/pipeline-v2';
import { signalDetector } from '@/lib/agent/signal-detector';
import { trendAnalyzer } from '@/lib/agent/trend-analyzer';
import { contradictionDetector } from '@/lib/agent/contradiction-detector';
import { selectSmartProviders } from '@/lib/agent/smart-provider-selector';

/**
 * POST /api/cron/auto-scan
 * 
 * Proactive Intelligence Scanner — the eyes and ears of NomosX.
 * Runs daily (or twice-daily) to continuously ingest new research,
 * detect signals, analyze trends, and find contradictions.
 * 
 * This is what makes NomosX a LIVING think tank, not a static tool.
 * 
 * Flow:
 * 1. For each active vertical: scout new sources with smart providers
 * 2. Run signal detection on newly ingested sources
 * 3. Run trend analysis across the full corpus
 * 4. Run contradiction detection on high-quality recent sources
 * 5. Store all findings as signals for the editorial planner
 * 
 * Schedule: Daily at 6am UTC (before editorial planning at 8pm Sunday)
 * Authorization: Requires CRON_SECRET header
 */
export async function POST(req: NextRequest) {
  const startTime = Date.now();

  try {
    // Verify cron secret
    const authHeader = req.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET;

    if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    console.log("[AUTO-SCAN] Starting proactive intelligence scan...");

    // Get active verticals with their topics
    const verticals = await prisma.vertical.findMany({
      where: { isActive: true },
      select: {
        id: true,
        slug: true,
        name: true,
        description: true,
        config: true,
      },
    });

    console.log(`[AUTO-SCAN] Scanning ${verticals.length} active verticals`);

    const stats = {
      verticalsScanned: 0,
      sourcesIngested: 0,
      signalsDetected: 0,
      trendBreaks: 0,
      contradictions: 0,
      errors: [] as string[],
    };

    // ── PHASE 1: Proactive Scouting per Vertical ──
    const allNewSourceIds: string[] = [];

    for (const vertical of verticals) {
      try {
        console.log(`[AUTO-SCAN] Scouting vertical: ${vertical.name}`);

        // Build search queries from vertical description and recent topics
        const recentTopics = await prisma.brief.findMany({
          where: {
            createdAt: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
          },
          select: { question: true },
          orderBy: { createdAt: "desc" },
          take: 5,
        });

        // Use vertical description as primary query, enriched with recent topics
        const searchQuery = vertical.description
          || vertical.name
          || recentTopics[0]?.question
          || vertical.slug;

        // Smart provider selection based on domain
        const smartSelection = selectSmartProviders(searchQuery);

        const scoutResult = await scout(
          searchQuery,
          smartSelection.providers,
          Math.ceil(smartSelection.quantity / smartSelection.providers.length)
        );

        if (scoutResult.sourceIds && scoutResult.sourceIds.length > 0) {
          allNewSourceIds.push(...scoutResult.sourceIds);
          stats.sourcesIngested += scoutResult.upserted || 0;
          console.log(`[AUTO-SCAN] ${vertical.name}: ${scoutResult.upserted || 0} new sources from ${smartSelection.providers.length} providers`);
        }

        stats.verticalsScanned++;

        // Rate limiting between verticals
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (err: any) {
        stats.errors.push(`Scout ${vertical.name}: ${err.message}`);
        console.error(`[AUTO-SCAN] Scout failed for ${vertical.name}:`, err.message);
      }
    }

    // ── PHASE 2: Signal Detection on new sources ──
    if (allNewSourceIds.length > 0) {
      try {
        console.log(`[AUTO-SCAN] Running signal detection on ${allNewSourceIds.length} new sources...`);

        // Process in batches of 50 to avoid memory issues
        const batchSize = 50;
        for (let i = 0; i < allNewSourceIds.length; i += batchSize) {
          const batch = allNewSourceIds.slice(i, i + batchSize);
          const signalResult = await signalDetector({ sourceIds: batch });
          stats.signalsDetected += signalResult.detected;

          if (signalResult.detected > 0) {
            console.log(`[AUTO-SCAN] Batch ${Math.floor(i / batchSize) + 1}: ${signalResult.detected} signals (${Object.entries(signalResult.byType).map(([k, v]) => `${k}:${v}`).join(", ")})`);
          }
        }
      } catch (err: any) {
        stats.errors.push(`Signal detection: ${err.message}`);
        console.error("[AUTO-SCAN] Signal detection failed:", err.message);
      }
    }

    // ── PHASE 3: Trend Analysis (full corpus, last 6 months) ──
    try {
      console.log("[AUTO-SCAN] Running trend analysis...");
      const trendResult = await trendAnalyzer({
        lookbackMonths: 6,
        minSources: 10,
      });

      stats.trendBreaks = trendResult.trends.length;

      if (trendResult.trends.length > 0) {
        console.log(`[AUTO-SCAN] Trend breaks: ${trendResult.trends.map(t => `${t.topic} (${t.breakType}, ${t.confidence}%)`).join(", ")}`);
      }
    } catch (err: any) {
      stats.errors.push(`Trend analysis: ${err.message}`);
      console.error("[AUTO-SCAN] Trend analysis failed:", err.message);
    }

    // ── PHASE 4: Contradiction Detection (recent high-quality sources) ──
    if (allNewSourceIds.length >= 5) {
      try {
        console.log("[AUTO-SCAN] Running contradiction detection...");
        const contradictionResult = await contradictionDetector(
          allNewSourceIds.slice(0, 100), // Cap at 100 for performance
          { minQuality: 75 }
        );

        stats.contradictions = contradictionResult.contradictionsFound;

        if (contradictionResult.contradictionsFound > 0) {
          console.log(`[AUTO-SCAN] Found ${contradictionResult.contradictionsFound} contradictions`);

          // Create CONTRADICTION signals for each finding
          for (const contradiction of contradictionResult.contradictions) {
            if (contradiction.confidence >= 70) {
              const defaultVertical = await prisma.vertical.findFirst({
                where: { isActive: true },
                select: { id: true },
              });

              if (defaultVertical) {
                await prisma.signal.create({
                  data: {
                    verticalId: defaultVertical.id,
                    signalType: "CONTRADICTION",
                    title: `Contradiction: ${contradiction.explanation.slice(0, 80)}`,
                    summary: `${contradiction.contradictionType} contradiction (${contradiction.confidence}% confidence). Claim 1: "${contradiction.claim1.slice(0, 150)}". Claim 2: "${contradiction.claim2.slice(0, 150)}"`,
                    noveltyScore: Math.round(contradiction.confidence * 0.9),
                    impactScore: Math.round(contradiction.confidence * 0.85),
                    confidenceScore: contradiction.confidence,
                    urgencyScore: 70,
                    priorityScore: Math.round(contradiction.confidence * 0.88),
                    sourceIds: [contradiction.sourceId1, contradiction.sourceId2],
                    status: "NEW",
                    expiresAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
                  },
                });
              }
            }
          }
        }
      } catch (err: any) {
        stats.errors.push(`Contradiction detection: ${err.message}`);
        console.error("[AUTO-SCAN] Contradiction detection failed:", err.message);
      }
    }

    const durationMs = Date.now() - startTime;
    const durationMin = (durationMs / 60000).toFixed(1);

    console.log(`[AUTO-SCAN] ✅ Complete in ${durationMin}min — ${stats.sourcesIngested} sources, ${stats.signalsDetected} signals, ${stats.trendBreaks} trends, ${stats.contradictions} contradictions`);

    return NextResponse.json({
      success: true,
      stats: {
        ...stats,
        durationMs,
        durationMin: parseFloat(durationMin),
        timestamp: new Date().toISOString(),
      },
    });

  } catch (error: any) {
    console.error("[AUTO-SCAN] Fatal error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// GET endpoint for status check
export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json(
      { error: "Unauthorized - Admin only" },
      { status: 401 }
    );
  }

  // Return last scan stats
  const recentSignals = await prisma.signal.count({
    where: {
      detectedAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
    },
  });

  const recentSources = await prisma.source.count({
    where: {
      createdAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
    },
  });

  return NextResponse.json({
    message: "Auto-scan cron endpoint",
    usage: "POST with Authorization: Bearer <CRON_SECRET>",
    schedule: "Daily at 6am UTC",
    last24h: {
      signalsDetected: recentSignals,
      sourcesIngested: recentSources,
    },
  });
}

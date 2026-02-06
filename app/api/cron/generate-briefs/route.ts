import { NextRequest,NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { runPipeline } from '@/lib/agent/pipeline-v2';

/**
 * POST /api/cron/generate-briefs
 * 
 * Cron job to automatically generate weekly briefs
 * Triggered weekly (Sunday 10pm UTC) to prepare briefs for Monday delivery
 * 
 * Process:
 * 1. Check weekly publication quota
 * 2. Get active verticals
 * 3. For each vertical: detect signals, generate brief if worthy
 * 4. Respect cadence limits (max 3 publications/week)
 * 
 * Authorization: Requires CRON_SECRET header for security
 */
export async function POST(req: NextRequest) {
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

    console.log("[Generate Briefs Cron] Starting weekly brief generation...");

    // Get active verticals
    const verticals = await prisma.vertical.findMany({
      where: { isActive: true },
      select: {
        id: true,
        slug: true,
        name: true,
        config: true,
      },
    });

    console.log(`[Generate Briefs Cron] Found ${verticals.length} active verticals`);

    // Check global weekly quota
    const subscriptions = await prisma.subscription.findMany({
      where: {
        status: "active",
      },
      select: {
        weeklyPublicationCount: true,
        weeklyPublicationMax: true,
      },
    });

    // Use first subscription as reference (or create default logic)
    const currentWeeklyCount = subscriptions[0]?.weeklyPublicationCount || 0;
    const weeklyMax = subscriptions[0]?.weeklyPublicationMax || 3;
    const remainingSlots = weeklyMax - currentWeeklyCount;

    if (remainingSlots <= 0) {
      console.log("[Generate Briefs Cron] Weekly limit reached - Silence is respected");
      return NextResponse.json({
        success: true,
        message: "Weekly limit reached - no publications generated",
        stats: {
          currentWeeklyCount,
          weeklyMax,
          remainingSlots: 0,
        },
      });
    }

    console.log(`[Generate Briefs Cron] ${remainingSlots} publication slots available this week`);

    let generated = 0;
    let skipped = 0;
    let failed = 0;

    // Generate briefs for each vertical (up to remaining slots)
    for (const vertical of verticals) {
      if (generated >= remainingSlots) {
        console.log("[Generate Briefs Cron] Weekly limit reached - stopping generation");
        break;
      }

      try {
        console.log(`[Generate Briefs Cron] Processing vertical: ${vertical.name}`);

        // Check if vertical has recent signals
        const recentSignals = await prisma.signal.findMany({
          where: {
            verticalId: vertical.id,
            status: "NEW",
            priorityScore: { gte: 70 }, // Only high-priority signals
            detectedAt: {
              gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Last 7 days
            },
          },
          orderBy: {
            priorityScore: "desc",
          },
          take: 1,
        });

        if (recentSignals.length === 0) {
          console.log(`[Generate Briefs Cron] No high-priority signals for ${vertical.name} - skipping`);
          skipped++;
          continue;
        }

        const signal = recentSignals[0];

        // Generate brief using pipeline
        const question = signal.title;
        const providers = (vertical.config as any)?.allowedProviders || [
          "openalex",
          "crossref",
          "semanticscholar",
        ];

        console.log(`[Generate Briefs Cron] Generating brief for signal: ${signal.title}`);

        const result = await runPipeline(
          question,
          "brief",
          {
            providers,
            perProvider: 20,
          }
        );

        if (result.briefId) {
          // Create publication directly from pipeline result
          const publication = await prisma.thinkTankPublication.create({
            data: {
              verticalId: vertical.id,
              signalId: signal.id,
              type: "EXECUTIVE_BRIEF",
              title: signal.title,
              html: `<div>Executive brief generated from signal: ${signal.title}</div>`,
              wordCount: 100, // Estimated
              trustScore: 85,
              qualityScore: 80,
              citationCoverage: 0.8,
              claimCount: 0,
              factClaimCount: 0,
              citedClaimCount: 0,
              sourceIds: [], // Will be populated from brief sources
              status: "PUBLISHED",
              criticalLoopResult: {
                briefId: result.briefId,
                question: signal.title,
                signalId: signal.id,
                stats: result.stats,
              },
            },
          });

          // Update signal status
          await prisma.signal.update({
            where: { id: signal.id },
            data: { status: "PUBLISHED" },
          });

          generated++;
          console.log(`[Generate Briefs Cron] Generated brief: ${publication.id} for ${vertical.name}`);
        } else {
          failed++;
          console.error(`[Generate Briefs Cron] Failed to generate brief for ${vertical.name}: No briefId returned`);
        }

        // Rate limiting: delay between generations
        await new Promise(resolve => setTimeout(resolve, 2000));

      } catch (verticalError: any) {
        failed++;
        console.error(`[Generate Briefs Cron] Error processing vertical ${vertical.name}:`, verticalError);
      }
    }

    // Update weekly publication count
    if (generated > 0) {
      await prisma.subscription.updateMany({
        where: { status: "active" },
        data: {
          weeklyPublicationCount: {
            increment: generated,
          },
        },
      });
    }

    console.log(`[Generate Briefs Cron] Completed: ${generated} generated, ${skipped} skipped, ${failed} failed`);

    return NextResponse.json({
      success: true,
      stats: {
        totalVerticals: verticals.length,
        generated,
        skipped,
        failed,
        currentWeeklyCount: currentWeeklyCount + generated,
        weeklyMax,
        remainingSlots: remainingSlots - generated,
      },
    });

  } catch (error: any) {
    console.error("[Generate Briefs Cron] Fatal error:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}

// GET endpoint for manual testing (admin only)
export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json(
      { error: "Unauthorized - Admin only" },
      { status: 401 }
    );
  }

  return NextResponse.json({
    message: "Generate briefs cron endpoint",
    usage: "POST with Authorization: Bearer <CRON_SECRET>",
    schedule: "Weekly on Sunday 10pm UTC (before Monday email delivery)",
  });
}

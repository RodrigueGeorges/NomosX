import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { autoPublisher, runAutoPublisher, type AutoPublisherOutput } from '@/lib/agent/auto-publisher';

/**
 * POST /api/cron/orchestrator
 * 
 * NomosX MASTER ORCHESTRATOR — The Brain of the Autonomous System
 * 
 * This is the single entry point that coordinates ALL autonomous operations:
 * 
 *   ┌─────────────────────────────────────────────────────────┐
 *   │                  MASTER ORCHESTRATOR                     │
 *   │                                                         │
 *   │  Monday-Saturday 6am UTC:                               │
 *   │    → Auto-Scan (scout + signals + trends)               │
 *   │                                                         │
 *   │  Sunday 8pm UTC:                                        │
 *   │    → Editorial Planning                                 │
 *   │    → Auto-Publisher (plan → pipeline → validate → pub)  │
 *   │    → Knowledge Graph update                             │
 *   │                                                         │
 *   │  Wednesday 2pm UTC (mid-week):                          │
 *   │    → Emergency signal check                             │
 *   │    → Fast-track critical publications                   │
 *   │                                                         │
 *   │  Monthly (1st of month):                                │
 *   │    → Strategic deep-dive report                         │
 *   │    → Cadence reset                                      │
 *   └─────────────────────────────────────────────────────────┘
 * 
 * Schedule: Called by external cron (Vercel/Railway) at appropriate times
 * The orchestrator determines what to run based on current day/time.
 * 
 * Query params:
 *   ?mode=auto     — Let orchestrator decide (default)
 *   ?mode=scan     — Force scan only
 *   ?mode=publish  — Force publish cycle
 *   ?mode=strategic — Force strategic deep-dive
 *   ?mode=full     — Run everything
 * 
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

    const url = new URL(req.url);
    const mode = url.searchParams.get("mode") || "auto";

    console.log(`\n${"═".repeat(80)}`);
    console.log(`[ORCHESTRATOR] NomosX Master Orchestrator starting (mode: ${mode})`);
    console.log(`[ORCHESTRATOR] Timestamp: ${new Date().toISOString()}`);
    console.log(`${"═".repeat(80)}\n`);

    const now = new Date();
    const dayOfWeek = now.getUTCDay(); // 0=Sun, 1=Mon, ...
    const hour = now.getUTCHours();
    const dayOfMonth = now.getUTCDate();

    let action: OrchestratorAction;

    if (mode === "auto") {
      action = determineAction(dayOfWeek, hour, dayOfMonth);
    } else {
      action = modeToAction(mode);
    }

    console.log(`[ORCHESTRATOR] Action determined: ${action.type} (${action.reason})`);

    let result: OrchestratorResult;

    switch (action.type) {
      case "scan":
        result = await executeScan();
        break;
      case "publish":
        result = await executePublish();
        break;
      case "strategic":
        result = await executeStrategic();
        break;
      case "emergency":
        result = await executeEmergencyCheck();
        break;
      case "full":
        result = await executeFull();
        break;
      case "monthly-reset":
        result = await executeMonthlyReset();
        break;
      case "idle":
        result = { type: "idle", success: true, message: "No action needed at this time", stats: {} };
        break;
      default:
        result = { type: "unknown", success: false, message: `Unknown action: ${action.type}`, stats: {} };
    }

    const durationMs = Date.now() - startTime;
    const durationSec = (durationMs / 1000).toFixed(1);

    // Log orchestrator run
    try {
      await prisma.agentAuditLog.create({
        data: {
          agent: "orchestrator",
          action: action.type,
          resource: `mode:${mode}`,
          metadata: JSON.stringify({
            input: { mode, dayOfWeek, hour },
            result: { success: result.success, message: result.message },
            durationMs,
            costUsd: result.stats?.totalCostUsd || 0,
          }),
        },
      });
    } catch (logErr) {
      console.warn("[ORCHESTRATOR] Could not log run (non-critical):", logErr);
    }

    console.log(`\n${"═".repeat(80)}`);
    console.log(`[ORCHESTRATOR] Complete: ${action.type} — ${result.success ? "✅ SUCCESS" : "❌ FAILED"} (${durationSec}s)`);
    console.log(`${"═".repeat(80)}\n`);

    return NextResponse.json({
      success: result.success,
      action: action.type,
      reason: action.reason,
      result: result.message,
      stats: result.stats,
      durationMs,
      durationSec: parseFloat(durationSec),
      timestamp: now.toISOString(),
    });

  } catch (error: any) {
    console.error("[ORCHESTRATOR] Fatal error:", error);
    return NextResponse.json(
      { error: "Internal server error", details: process.env.NODE_ENV === "development" ? error.message : undefined },
      { status: 500 }
    );
  }
}

// GET endpoint for status/health check
export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json(
      { error: "Unauthorized — Admin only" },
      { status: 401 }
    );
  }

  // Gather system health metrics
  const now = new Date();
  const last24h = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const last7d = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  const [signalsCount, sourcesCount, publicationsCount, briefsCount] = await Promise.all([
    prisma.signal.count({ where: { detectedAt: { gte: last24h } } }).catch(() => 0),
    prisma.source.count({ where: { createdAt: { gte: last24h } } }).catch(() => 0),
    prisma.thinkTankPublication.count({ where: { publishedAt: { gte: last7d } } }).catch(() => 0),
    prisma.brief.count({ where: { createdAt: { gte: last7d } } }).catch(() => 0),
  ]);

  const dayOfWeek = now.getUTCDay();
  const hour = now.getUTCHours();
  const dayOfMonth = now.getUTCDate();
  const nextAction = determineAction(dayOfWeek, hour, dayOfMonth);

  return NextResponse.json({
    status: "operational",
    system: "NomosX Autonomous Orchestrator v1.0",
    health: {
      last24h: { signals: signalsCount, sources: sourcesCount },
      last7d: { publications: publicationsCount, briefs: briefsCount },
    },
    schedule: {
      currentTime: now.toISOString(),
      dayOfWeek: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][dayOfWeek],
      nextAction: nextAction.type,
      nextReason: nextAction.reason,
    },
    modes: ["auto", "scan", "publish", "strategic", "full"],
    usage: "POST with Authorization: Bearer <CRON_SECRET> and optional ?mode=<mode>",
  });
}

// ============================================================================
// ACTION DETERMINATION
// ============================================================================

interface OrchestratorAction {
  type: string;
  reason: string;
}

interface OrchestratorResult {
  type: string;
  success: boolean;
  message: string;
  stats: Record<string, any>;
}

function determineAction(dayOfWeek: number, hour: number, dayOfMonth: number): OrchestratorAction {
  // Monthly reset (1st of month, 3am UTC)
  if (dayOfMonth === 1 && hour >= 2 && hour <= 4) {
    return { type: "monthly-reset", reason: "First of month — cadence reset + strategic report" };
  }

  // Sunday evening: Full publish cycle (8pm-11pm UTC)
  if (dayOfWeek === 0 && hour >= 20 && hour <= 23) {
    return { type: "publish", reason: "Sunday evening — weekly publication cycle" };
  }

  // Wednesday midday: Emergency signal check (1pm-3pm UTC)
  if (dayOfWeek === 3 && hour >= 13 && hour <= 15) {
    return { type: "emergency", reason: "Wednesday mid-week — emergency signal check" };
  }

  // Daily morning scan (5am-7am UTC, Mon-Sat)
  if (dayOfWeek >= 1 && dayOfWeek <= 6 && hour >= 5 && hour <= 7) {
    return { type: "scan", reason: "Daily morning — proactive intelligence scan" };
  }

  // Default: idle
  return { type: "idle", reason: "No scheduled action at this time" };
}

function modeToAction(mode: string): OrchestratorAction {
  switch (mode) {
    case "scan": return { type: "scan", reason: "Manual trigger: scan mode" };
    case "publish": return { type: "publish", reason: "Manual trigger: publish mode" };
    case "strategic": return { type: "strategic", reason: "Manual trigger: strategic deep-dive" };
    case "full": return { type: "full", reason: "Manual trigger: full cycle" };
    default: return { type: mode, reason: `Manual trigger: ${mode}` };
  }
}

// ============================================================================
// ACTION EXECUTORS
// ============================================================================

async function executeScan(): Promise<OrchestratorResult> {
  try {
    console.log("[ORCHESTRATOR] Executing: Proactive Scan");

    const output = await autoPublisher({
      maxPublications: 0, // Scan only, no publishing
      enableProactiveScan: true,
      enableTrendAnalysis: true,
      enableContradictionDetection: true,
      enableKnowledgeGraph: false,
      dryRun: true,
    });

    return {
      type: "scan",
      success: true,
      message: `Scan complete: ${output.scanStats?.sourcesIngested || 0} sources, ${output.scanStats?.signalsDetected || 0} signals, ${output.scanStats?.trendBreaks || 0} trends`,
      stats: {
        ...output.scanStats,
        durationMs: output.totalDurationMs,
      },
    };
  } catch (err: any) {
    return { type: "scan", success: false, message: `Scan failed: ${err.message}`, stats: {} };
  }
}

async function executePublish(): Promise<OrchestratorResult> {
  try {
    console.log("[ORCHESTRATOR] Executing: Full Publish Cycle");

    const output = await runAutoPublisher();

    return {
      type: "publish",
      success: true,
      message: `Published ${output.published}, review ${output.pendingReview}, failed ${output.failed}`,
      stats: {
        published: output.published,
        pendingReview: output.pendingReview,
        failed: output.failed,
        topics: output.results.map(r => r.topic),
        totalCostUsd: output.totalCostUsd,
        durationMs: output.totalDurationMs,
      },
    };
  } catch (err: any) {
    return { type: "publish", success: false, message: `Publish failed: ${err.message}`, stats: {} };
  }
}

async function executeStrategic(): Promise<OrchestratorResult> {
  try {
    console.log("[ORCHESTRATOR] Executing: Strategic Deep-Dive");

    const output = await autoPublisher({
      maxPublications: 1,
      minTrustScore: 75,
      enableHarvardCouncil: true,
      enableProactiveScan: true,
      enableKnowledgeGraph: true,
    });

    return {
      type: "strategic",
      success: true,
      message: `Strategic report: ${output.published} published (trust: ${output.results[0]?.trustScore || "N/A"})`,
      stats: {
        published: output.published,
        totalCostUsd: output.totalCostUsd,
        durationMs: output.totalDurationMs,
        results: output.results,
      },
    };
  } catch (err: any) {
    return { type: "strategic", success: false, message: `Strategic failed: ${err.message}`, stats: {} };
  }
}

async function executeEmergencyCheck(): Promise<OrchestratorResult> {
  try {
    console.log("[ORCHESTRATOR] Executing: Emergency Signal Check");

    // Check for critical signals that need immediate attention
    const criticalSignals = await prisma.signal.findMany({
      where: {
        status: "NEW",
        priorityScore: { gte: 90 },
        detectedAt: { gte: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) },
      },
      orderBy: { priorityScore: "desc" },
      take: 2,
    });

    if (criticalSignals.length === 0) {
      return {
        type: "emergency",
        success: true,
        message: "No critical signals — system nominal",
        stats: { criticalSignals: 0 },
      };
    }

    console.log(`[ORCHESTRATOR] ${criticalSignals.length} critical signals found — fast-tracking publication`);

    const output = await autoPublisher({
      maxPublications: criticalSignals.length,
      minTrustScore: 60, // Lower threshold for emergency
      enableProactiveScan: false, // Skip scan, we already have signals
      enableHarvardCouncil: true,
      enableKnowledgeGraph: true,
    });

    return {
      type: "emergency",
      success: true,
      message: `Emergency: ${criticalSignals.length} critical signals, ${output.published} fast-tracked`,
      stats: {
        criticalSignals: criticalSignals.length,
        published: output.published,
        totalCostUsd: output.totalCostUsd,
      },
    };
  } catch (err: any) {
    return { type: "emergency", success: false, message: `Emergency check failed: ${err.message}`, stats: {} };
  }
}

async function executeFull(): Promise<OrchestratorResult> {
  try {
    console.log("[ORCHESTRATOR] Executing: Full Autonomous Cycle");

    const output = await autoPublisher({
      maxPublications: 3,
      minTrustScore: 65,
      enableProactiveScan: true,
      enableTrendAnalysis: true,
      enableContradictionDetection: true,
      enableHarvardCouncil: true,
      enableKnowledgeGraph: true,
    });

    return {
      type: "full",
      success: true,
      message: `Full cycle: ${output.scanStats?.sourcesIngested || 0} sources → ${output.scanStats?.signalsDetected || 0} signals → ${output.published} published`,
      stats: {
        scan: output.scanStats,
        published: output.published,
        pendingReview: output.pendingReview,
        failed: output.failed,
        topics: output.results.map(r => r.topic),
        totalCostUsd: output.totalCostUsd,
        durationMs: output.totalDurationMs,
        phases: output.lineage.phases,
      },
    };
  } catch (err: any) {
    return { type: "full", success: false, message: `Full cycle failed: ${err.message}`, stats: {} };
  }
}

async function executeMonthlyReset(): Promise<OrchestratorResult> {
  try {
    console.log("[ORCHESTRATOR] Executing: Monthly Reset + Strategic Report");

    // Reset weekly publication counts
    await prisma.subscription.updateMany({
      where: { status: "active" },
      data: { weeklyPublicationCount: 0 },
    });

    console.log("[ORCHESTRATOR] Weekly publication counts reset");

    // Generate a strategic deep-dive for the month
    const output = await autoPublisher({
      maxPublications: 1,
      minTrustScore: 75,
      enableHarvardCouncil: true,
      enableProactiveScan: true,
      enableKnowledgeGraph: true,
    });

    return {
      type: "monthly-reset",
      success: true,
      message: `Monthly reset complete. Cadence reset. Strategic report: ${output.published} published.`,
      stats: {
        cadenceReset: true,
        strategicPublished: output.published,
        totalCostUsd: output.totalCostUsd,
      },
    };
  } catch (err: any) {
    return { type: "monthly-reset", success: false, message: `Monthly reset failed: ${err.message}`, stats: {} };
  }
}

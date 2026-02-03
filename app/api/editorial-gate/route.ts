/**
 * Editorial Gate API - Evaluate signals/drafts for publication
 */

const {NextRequest,NextResponse} = require('next/server');
const {prisma} = require('@/lib/db');
const {getSession} = require('@/lib/auth');
const {editorialGate,evaluatePendingSignals} = require('@/lib/agent/editorial-gate');

// POST /api/editorial-gate - Evaluate a signal or draft
export async function POST(request: NextRequest) {
  try {
    const user = await getSession();
    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { signalId, draftId } = body;

    if (!signalId && !draftId) {
      return NextResponse.json(
        { error: "Must provide signalId or draftId" },
        { status: 400 }
      );
    }

    const result = await editorialGate({ signalId, draftId });

    return NextResponse.json({
      decision: result.decision,
      reasons: result.reasons,
      checks: result.checks,
      humanReviewRequired: result.humanReviewRequired,
      scores: result.scores,
    });
  } catch (error) {
    console.error("[API] POST /api/editorial-gate error:", error);
    return NextResponse.json(
      { error: "Failed to evaluate" },
      { status: 500 }
    );
  }
}

// GET /api/editorial-gate - Get recent editorial decisions
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const verticalId = searchParams.get("verticalId");
    const decision = searchParams.get("decision");
    const limit = parseInt(searchParams.get("limit") || "20");

    const where: any = {};
    if (verticalId) where.verticalId = verticalId;
    if (decision) where.decision = decision;

    const decisions = await prisma.editorialDecision.findMany({
      where,
      include: {
        signal: true,
        draft: true,
        vertical: true,
      },
      orderBy: { createdAt: "desc" },
      take: limit,
    });

    // Get stats
    const stats = await prisma.editorialDecision.groupBy({
      by: ["decision"],
      _count: { decision: true },
      where: {
        createdAt: {
          gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Last 7 days
        },
      },
    });

    return NextResponse.json({
      decisions,
      stats: stats.reduce((acc, s) => {
        acc[s.decision] = s._count.decision;
        return acc;
      }, {} as Record<string, number>),
    });
  } catch (error) {
    console.error("[API] GET /api/editorial-gate error:", error);
    return NextResponse.json(
      { error: "Failed to fetch decisions" },
      { status: 500 }
    );
  }
}

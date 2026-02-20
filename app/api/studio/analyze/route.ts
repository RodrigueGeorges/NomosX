import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { runPipeline } from '@/lib/agent/pipeline-v2';

/**
 * POST /api/studio/analyze
 * 
 * STRATEGY tier only endpoint for custom research
 * Checks studio limits and decrements quota
 */
export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user subscription
    const user = await prisma.user.findUnique({
      where: { email: session.email },
      include: { subscription: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const subscription = user.subscription;

    // Check if STUDIO tier (supports legacy STRATEGY name)
    const hasStudioAccess = subscription?.canAccessStudio ||
      subscription?.plan === 'STUDIO' ||
      subscription?.plan === 'STRATEGY';
    if (!subscription || !hasStudioAccess) {
      return NextResponse.json({ 
        error: "Studio access requires Studio tier",
        currentPlan: subscription?.plan || 'none'
      }, { status: 403 });
    }

    // Check studio limits
    if (subscription.studioQuestionsUsed >= subscription.studioQuestionsPerMonth) {
      return NextResponse.json({ 
        error: "Studio limit reached",
        used: subscription.studioQuestionsUsed,
        limit: subscription.studioQuestionsPerMonth,
        resetDate: subscription.lastStudioReset
      }, { status: 429 });
    }

    // Parse request body
    const body = await req.json();
    const { question, publicationType = 'EXECUTIVE_BRIEF', verticalId } = body;

    if (!question || question.trim().length < 10) {
      return NextResponse.json({ error: "Question must be at least 10 characters" }, { status: 400 });
    }

    // Increment studio usage
    await prisma.subscription.update({
      where: { userId: user.id },
      data: { studioQuestionsUsed: { increment: 1 } },
    });

    // Run the pipeline
    const mode = publicationType === 'STRATEGIC_REPORT' ? 'strategic' : 'brief';
    const result = await runPipeline(question.trim(), mode, { perProvider: mode === 'strategic' ? 25 : 20 });

    // Persist as ThinkTankPublication if pipeline succeeded
    let publicationId: string | null = null;
    if (result.briefId) {
      const brief = await prisma.brief.findUnique({
        where: { id: result.briefId },
        select: { html: true, sources: true, title: true },
      }).catch(() => null);

      const vertical = verticalId
        ? await prisma.vertical.findUnique({ where: { id: verticalId }, select: { id: true } }).catch(() => null)
        : await prisma.vertical.findFirst({ where: { isActive: true }, select: { id: true } }).catch(() => null);

      if (vertical && brief) {
        const pub = await prisma.thinkTankPublication.create({
          data: {
            verticalId: vertical.id,
            type: publicationType === 'STRATEGIC_REPORT' ? 'STRATEGIC_REPORT' : 'EXECUTIVE_BRIEF',
            title: brief.title || question.trim(),
            html: brief.html,
            wordCount: Math.round(brief.html.length / 6),
            trustScore: result.stats?.criticalLoop?.finalScore || 80,
            qualityScore: result.stats?.rank?.avgQuality || 75,
            citationCoverage: 0.85,
            claimCount: 0,
            factClaimCount: 0,
            citedClaimCount: 0,
            sourceIds: brief.sources || [],
            status: 'PUBLISHED',
            publishedAt: new Date(),
            criticalLoopResult: { briefId: result.briefId, question, stats: result.stats },
          },
        }).catch(() => null);
        publicationId = pub?.id ?? null;
      }
    }

    return NextResponse.json({
      success: true,
      message: publicationId ? "Analysis complete" : "Analysis complete (pipeline ran, publication pending)",
      publicationId,
      briefId: result.briefId,
      quota: {
        used: subscription.studioQuestionsUsed + 1,
        limit: subscription.studioQuestionsPerMonth,
        remaining: subscription.studioQuestionsPerMonth - subscription.studioQuestionsUsed - 1,
      },
      stats: result.stats,
    });

  } catch (error) {
    console.error('[API/Studio/Analyze] Error:', error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * GET /api/studio/quota
 * 
 * Returns current studio quota for STRATEGY users
 */
export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.email },
      include: { subscription: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const subscription = user.subscription;

    // Return quota info (even for non-STRATEGY users for UI)
    return NextResponse.json({
      plan: subscription?.plan || 'none',
      canAccessStudio: subscription?.plan === 'STRATEGY',
      studioQuestionsPerMonth: subscription?.studioQuestionsPerMonth || 0,
      studioQuestionsUsed: subscription?.studioQuestionsUsed || 0,
      studioQuestionsRemaining: Math.max(0, (subscription?.studioQuestionsPerMonth || 0) - (subscription?.studioQuestionsUsed || 0)),
      lastStudioReset: subscription?.lastStudioReset,
    });

  } catch (error) {
    console.error('[API/Studio/Quota] Error:', error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

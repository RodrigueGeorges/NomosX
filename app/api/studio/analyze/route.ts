import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/db';

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

    // Check if STRATEGY tier
    if (!subscription || subscription.plan !== 'STRATEGY') {
      return NextResponse.json({ 
        error: "Studio access requires Strategy tier",
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
      data: {
        studioQuestionsUsed: { increment: 1 },
      },
    });

    // TODO: Trigger the actual analysis pipeline
    // For now, return success with quota info
    return NextResponse.json({
      success: true,
      message: "Studio analysis started",
      quota: {
        used: subscription.studioQuestionsUsed + 1,
        limit: subscription.studioQuestionsPerMonth,
        remaining: subscription.studioQuestionsPerMonth - subscription.studioQuestionsUsed - 1,
      },
      analysis: {
        question,
        publicationType,
        verticalId,
        status: "queued"
      }
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

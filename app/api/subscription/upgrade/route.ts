import { NextRequest,NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import prisma from '@/lib/db';
import { trackUpgrade } from '@/lib/analytics';

/**
 * POST /api/subscription/upgrade
 * 
 * Handle subscription upgrades between tiers
 * In production, this would integrate with Stripe
 * For now, allows manual upgrades for testing
 */
export async function POST(req: NextRequest) {
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

    const body = await req.json();
    const { targetPlan } = body;

    // Validate target plan (accept both new and legacy names)
    const validPlans = ['RESEARCHER', 'STUDIO', 'EXECUTIVE', 'STRATEGY'];
    if (!validPlans.includes(targetPlan)) {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
    }

    // Normalize legacy plan names
    const normalizedPlan = targetPlan === 'EXECUTIVE' ? 'RESEARCHER' : 
                          targetPlan === 'STRATEGY' ? 'STUDIO' : targetPlan;

    // Get or create subscription
    let subscription = user.subscription;
    if (!subscription) {
      subscription = await prisma.subscription.create({
        data: {
          userId: user.id,
          plan: normalizedPlan,
          status: "active",
          // Set limits based on plan
          weeklyPublicationMax: -1, // unlimited for paid plans
          studioQuestionsPerMonth: normalizedPlan === 'STUDIO' ? -1 : 0, // unlimited for STUDIO
          canAccessStudio: normalizedPlan === 'STUDIO',
          canCreateVerticals: normalizedPlan === 'STUDIO',
          canExportPdf: true,
          isTrialActive: false, // Paid plans are not trials
        },
      });
    } else {
      // Update existing subscription
      const updates: any = {
        plan: normalizedPlan,
        status: "active",
        isTrialActive: false, // Paid plans are not trials
      };

      // Update limits based on target plan
      if (normalizedPlan === 'RESEARCHER') {
        updates.weeklyPublicationMax = -1; // unlimited
        updates.studioQuestionsPerMonth = 0;
        updates.canAccessStudio = false;
        updates.canCreateVerticals = false;
        updates.canExportPdf = true;
      } else if (normalizedPlan === 'STUDIO') {
        updates.weeklyPublicationMax = -1; // unlimited
        updates.studioQuestionsPerMonth = -1; // unlimited
        updates.canAccessStudio = true;
        updates.canCreateVerticals = true;
        updates.canExportPdf = true;
      }

      subscription = await prisma.subscription.update({
        where: { userId: user.id },
        data: updates,
      });
    }

    // Track upgrade analytics (non-blocking)
    const fromPlan = user.subscription?.plan || 'NONE';
    const revenue = normalizedPlan === 'RESEARCHER' ? 19 : normalizedPlan === 'STUDIO' ? 49 : 0;
    
    trackUpgrade(user.id, fromPlan, normalizedPlan, revenue).catch(err =>
      console.error('[Subscription Upgrade] Analytics tracking failed:', err)
    );

    return NextResponse.json({
      success: true,
      message: `Upgraded to ${normalizedPlan} plan`,
      subscription: {
        plan: subscription.plan,
        status: subscription.status,
        weeklyPublicationMax: subscription.weeklyPublicationMax,
        studioQuestionsPerMonth: subscription.studioQuestionsPerMonth,
        canAccessStudio: subscription.canAccessStudio,
        canCreateVerticals: subscription.canCreateVerticals,
        canExportPdf: subscription.canExportPdf,
      }
    });

  } catch (error) {
    console.error('[API/Subscription/Upgrade] Error:', error);
    return NextResponse.json(
      { error: "Failed to upgrade subscription" },
      { status: 500 }
    );
  }
}

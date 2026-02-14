import { NextRequest,NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import prisma from '@/lib/db';

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

    // Validate target plan
    const validPlans = ['EXECUTIVE', 'STRATEGY'];
    if (!validPlans.includes(targetPlan)) {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
    }

    // Get or create subscription
    let subscription = user.subscription;
    if (!subscription) {
      subscription = await prisma.subscription.create({
        data: {
          userId: user.id,
          plan: targetPlan,
          status: "active",
          // Set limits based on plan
          weeklyPublicationMax: -1, // unlimited for paid plans
          studioQuestionsPerMonth: targetPlan === 'STRATEGY' ? -1 : 0, // unlimited for STRATEGY
          canAccessStudio: targetPlan === 'STRATEGY',
          canCreateVerticals: targetPlan === 'STRATEGY',
          canExportPdf: true,
        },
      });
    } else {
      // Update existing subscription
      const updates: any = {
        plan: targetPlan,
        status: "active",
      };

      // Update limits based on target plan
      if (targetPlan === 'EXECUTIVE') {
        updates.weeklyPublicationMax = -1; // unlimited
        updates.studioQuestionsPerMonth = 0;
        updates.canAccessStudio = false;
        updates.canCreateVerticals = false;
        updates.canExportPdf = true;
      } else if (targetPlan === 'STRATEGY') {
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

    return NextResponse.json({
      success: true,
      message: `Upgraded to ${targetPlan} plan`,
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

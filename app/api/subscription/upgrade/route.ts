import { NextRequest,NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import prisma from '@/lib/db';

/**
 * POST /api/subscription/upgrade
 * Upgrade from trial to NomosX Access
 * In production, this would integrate with Stripe
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

    if (!user || !user.subscription) {
      return NextResponse.json({ error: "Subscription not found" }, { status: 404 });
    }

    // TODO: Integrate with Stripe
    // For now, just upgrade to paid plan
    const updated = await prisma.subscription.update({
      where: { id: user.subscription.id },
      data: {
        plan: "NOMOSX_ACCESS",
        status: "active",
        isTrialActive: false,
        canExportPdf: true,
        canCreateVerticals: true,
        activeVerticalsMax: 5, // Upgrade limit
        weeklyPublicationMax: 10, // Upgrade limit
      },
    });

    return NextResponse.json({
      success: true,
      subscription: updated,
    });
  } catch (error) {
    console.error("Error upgrading subscription:", error);
    return NextResponse.json(
      { error: "Failed to upgrade subscription" },
      { status: 500 }
    );
  }
}

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

    // BLOCKED: Stripe integration required before enabling upgrades
    // This endpoint will be activated once Stripe checkout is implemented
    return NextResponse.json(
      { 
        error: "Upgrade is not yet available. Please contact support.",
        stripeRequired: true 
      },
      { status: 503 }
    );
  } catch (error) {
    console.error("Error upgrading subscription:", error);
    return NextResponse.json(
      { error: "Failed to upgrade subscription" },
      { status: 500 }
    );
  }
}

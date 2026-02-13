import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';

/**
 * POST /api/stripe/webhook
 * 
 * Stripe webhook handler for subscription events.
 * TODO: Uncomment Stripe logic when stripe package is installed.
 * 
 * Required env vars:
 * - STRIPE_SECRET_KEY
 * - STRIPE_WEBHOOK_SECRET
 */
export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json({ error: 'Missing stripe-signature header' }, { status: 400 });
  }

  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    console.error('[Stripe Webhook] STRIPE_WEBHOOK_SECRET not configured');
    return NextResponse.json({ error: 'Webhook not configured' }, { status: 503 });
  }

  try {
    // TODO: Uncomment when stripe is installed
    // import Stripe from 'stripe';
    // const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
    // const event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET);
    //
    // switch (event.type) {
    //   case 'checkout.session.completed': {
    //     const session = event.data.object as Stripe.Checkout.Session;
    //     const userId = session.metadata?.userId;
    //     if (userId) {
    //       await prisma.subscription.update({
    //         where: { userId },
    //         data: {
    //           plan: 'access',
    //           stripeCustomerId: session.customer as string,
    //           stripeSubscriptionId: session.subscription as string,
    //           status: 'active',
    //         },
    //       });
    //       console.log(`[Stripe] User ${userId} upgraded to Access`);
    //     }
    //     break;
    //   }
    //
    //   case 'customer.subscription.deleted': {
    //     const subscription = event.data.object as Stripe.Subscription;
    //     const sub = await prisma.subscription.findFirst({
    //       where: { stripeSubscriptionId: subscription.id },
    //     });
    //     if (sub) {
    //       await prisma.subscription.update({
    //         where: { id: sub.id },
    //         data: { plan: 'trial', status: 'cancelled' },
    //       });
    //       console.log(`[Stripe] Subscription ${subscription.id} cancelled`);
    //     }
    //     break;
    //   }
    //
    //   case 'invoice.payment_failed': {
    //     const invoice = event.data.object as Stripe.Invoice;
    //     console.warn(`[Stripe] Payment failed for invoice ${invoice.id}`);
    //     break;
    //   }
    // }
    //
    // return NextResponse.json({ received: true, type: event.type });

    // Placeholder until Stripe is configured
    console.warn('[Stripe Webhook] Received webhook but Stripe is not yet integrated');
    return NextResponse.json({ received: false, error: 'Stripe not yet integrated' }, { status: 503 });

  } catch (error) {
    console.error('[Stripe Webhook] Error:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 400 });
  }
}

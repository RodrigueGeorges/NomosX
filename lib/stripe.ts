/**
 * Stripe Integration Skeleton
 * 
 * TODO: Install stripe package: npm install stripe
 * TODO: Add STRIPE_SECRET_KEY and STRIPE_WEBHOOK_SECRET to .env
 * TODO: Create Stripe products/prices in Stripe Dashboard
 * 
 * This file provides the structure for Stripe integration.
 * Uncomment and configure when ready to enable paid subscriptions.
 */

// import Stripe from 'stripe';

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
//   apiVersion: '2024-12-18.acacia',
// });

export const STRIPE_PLANS = {
  TRIAL: {
    name: 'Trial',
    priceId: null, // Free tier, no Stripe price
    features: ['5 briefs/month', '3 providers', 'Basic analysis'],
  },
  ACCESS: {
    name: 'NomosX Access',
    priceId: process.env.STRIPE_PRICE_ACCESS || null,
    features: ['Unlimited briefs', 'All providers', 'Strategic reports', 'Think tank'],
  },
  ENTERPRISE: {
    name: 'Enterprise',
    priceId: process.env.STRIPE_PRICE_ENTERPRISE || null,
    features: ['Everything in Access', 'Custom verticals', 'API access', 'Priority support'],
  },
} as const;

/**
 * Create a Stripe Checkout Session for subscription upgrade
 * 
 * Usage (when Stripe is configured):
 *   const session = await createCheckoutSession(userId, 'ACCESS');
 *   // Redirect user to session.url
 */
export async function createCheckoutSession(
  userId: string,
  plan: keyof typeof STRIPE_PLANS
): Promise<{ url: string | null; error?: string }> {
  const planConfig = STRIPE_PLANS[plan];
  
  if (!planConfig.priceId) {
    return { url: null, error: 'Plan not configured in Stripe' };
  }

  // TODO: Uncomment when stripe is installed
  // const session = await stripe.checkout.sessions.create({
  //   mode: 'subscription',
  //   payment_method_types: ['card'],
  //   line_items: [{
  //     price: planConfig.priceId,
  //     quantity: 1,
  //   }],
  //   metadata: { userId, plan },
  //   success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?upgraded=true`,
  //   cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing?cancelled=true`,
  // });
  // return { url: session.url };

  return { url: null, error: 'Stripe not yet configured' };
}

/**
 * Handle Stripe webhook events
 * 
 * Usage: Create /api/stripe/webhook route that calls this
 */
export async function handleWebhookEvent(
  body: string,
  signature: string
): Promise<{ received: boolean; type?: string; error?: string }> {
  // TODO: Uncomment when stripe is installed
  // const event = stripe.webhooks.constructEvent(
  //   body,
  //   signature,
  //   process.env.STRIPE_WEBHOOK_SECRET!
  // );
  //
  // switch (event.type) {
  //   case 'checkout.session.completed':
  //     // Upgrade user subscription in DB
  //     break;
  //   case 'customer.subscription.deleted':
  //     // Downgrade user to trial
  //     break;
  //   case 'invoice.payment_failed':
  //     // Notify user of failed payment
  //     break;
  // }
  //
  // return { received: true, type: event.type };

  return { received: false, error: 'Stripe webhooks not yet configured' };
}

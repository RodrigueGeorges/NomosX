/**
 * Stripe Service - Service de facturation Stripe
 * Suivi des recommandations OpenClaw
 */

import Stripe from 'stripe';

// Configuration Stripe — lazy initialization to avoid crash when STRIPE_SECRET_KEY is not set
let _stripe: Stripe | null = null;

function getStripe(): Stripe {
  if (!_stripe) {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error('STRIPE_SECRET_KEY is not configured');
    }
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2024-06-20',
      typescript: true,
    });
  }
  return _stripe;
}

// Keep backward-compatible default export
const stripe = new Proxy({} as Stripe, {
  get(_, prop) {
    return (getStripe() as any)[prop];
  },
});

export interface CreateCustomerParams {
  email: string
  name: string
  metadata?: Record<string, string>
}

export interface CreateSubscriptionParams {
  customerId: string
  priceId: string
  paymentMethodId?: string
  trialPeriodDays?: number
  metadata?: Record<string, string>
}

export interface UpdateSubscriptionParams {
  subscriptionId: string
  priceId?: string
  metadata?: Record<string, string>
}

export interface CreateCheckoutSessionParams {
  customerId: string
  priceId: string
  successUrl: string
  cancelUrl: string
  metadata?: Record<string, string>
  trialPeriodDays?: number
}

export interface CreatePortalSessionParams {
  customerId: string
  returnUrl: string
}

/**
 * Crée un client Stripe
 */
export async function createCustomer(params: CreateCustomerParams) {
  try {
    const customer = await stripe.customers.create({
      email: params.email,
      name: params.name,
      metadata: {
        source: 'nomosx',
        ...params.metadata,
      },
    })

    return { success: true, customer }
  } catch (error) {
    console.error('Error creating Stripe customer:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }
  }
}

/**
 * Récupère un client Stripe
 */
export async function getCustomer(customerId: string) {
  try {
    const customer = await stripe.customers.retrieve(customerId)
    return { success: true, customer }
  } catch (error) {
    console.error('Error retrieving Stripe customer:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }
  }
}

/**
 * Met à jour un client Stripe
 */
export async function updateCustomer(
  customerId: string, 
  params: Partial<CreateCustomerParams>
) {
  try {
    const customer = await stripe.customers.update(customerId, {
      email: params.email,
      name: params.name,
      metadata: params.metadata,
    })

    return { success: true, customer }
  } catch (error) {
    console.error('Error updating Stripe customer:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }
  }
}

/**
 * Crée une abonnement
 */
export async function createSubscription(params: CreateSubscriptionParams) {
  try {
    const subscription = await stripe.subscriptions.create({
      customer: params.customerId,
      items: [{ price: params.priceId }],
      payment_behavior: 'default_incomplete',
      payment_settings: {
        payment_method_types: ['card'],
        save_default_payment_method: 'on_subscription',
      },
      trial_period_days: params.trialPeriodDays,
      metadata: {
        source: 'nomosx',
        ...params.metadata,
      },
      expand: ['latest_invoice.payment_intent'],
    })

    return { success: true, subscription }
  } catch (error) {
    console.error('Error creating Stripe subscription:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }
  }
}

/**
 * Met à jour un abonnement
 */
export async function updateSubscription(
  subscriptionId: string, 
  params: UpdateSubscriptionParams
) {
  try {
    const subscription = await stripe.subscriptions.update(subscriptionId, {
      items: params.priceId ? [{ price: params.priceId }] : undefined,
      metadata: params.metadata,
    })

    return { success: true, subscription }
  } catch (error) {
    console.error('Error updating Stripe subscription:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }
  }
}

/**
 * Annule un abonnement
 */
export async function cancelSubscription(
  subscriptionId: string, 
  cancelAtPeriodEnd = false
) {
  try {
    const subscription = await stripe.subscriptions.update(subscriptionId, {
      cancel_at_period_end: cancelAtPeriodEnd,
    })

    return { success: true, subscription }
  } catch (error) {
    console.error('Error canceling Stripe subscription:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }
  }

}

/**
 * Crée une session de paiement
 */
export async function createCheckoutSession(params: CreateCheckoutSessionParams) {
  try {
    const session = await stripe.checkout.sessions.create({
      customer: params.customerId,
      payment_method_types: ['card'],
      line_items: [
        {
          price: params.priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: params.successUrl,
      cancel_url: params.cancelUrl,
      metadata: {
        source: 'nomosx',
        ...params.metadata,
      },
      subscription_data: {
        trial_period_days: params.trialPeriodDays,
      },
    })

    return { success: true, session }
  } catch (error) {
    console.error('Error creating Stripe checkout session:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }
  }
}

/**
 * Crée une session portal client
 */
export async function createPortalSession(params: CreatePortalSessionParams) {
  try {
    const session = await stripe.billingPortal.sessions.create({
      customer: params.customerId,
      return_url: params.returnUrl,
    })

    return { success: true, session }
  } catch (error) {
    console.error('Error creating Stripe portal session:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }
  }
}

/**
 * Récupère les prix disponibles
 */
export async function getPrices(activeOnly = true) {
  try {
    const prices = await stripe.prices.list({
      active: activeOnly,
      expand: ['data.product'],
    })

    return { success: true, prices: prices.data }
  } catch (error) {
    console.error('Error retrieving Stripe prices:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }
  }
}

/**
 * Crée un prix
 */
export async function createPrice(params: {
  productId: string
  unitAmount: number
  currency: string
  recurring?: {
    interval: 'day' | 'week' | 'month' | 'year'
    intervalCount?: number
  }
  metadata?: Record<string, string>
}) {
  try {
    const price = await stripe.prices.create({
      product: params.productId,
      unit_amount: params.unitAmount,
      currency: params.currency,
      recurring: params.recurring,
      metadata: {
        source: 'nomosx',
        ...params.metadata,
      },
    })

    return { success: true, price }
  } catch (error) {
    console.error('Error creating Stripe price:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }
  }
}

/**
 * Récupère une facture
 */
export async function getInvoice(invoiceId: string) {
  try {
    const invoice = await stripe.invoices.retrieve(invoiceId, {
      expand: ['customer', 'subscription'],
    })

    return { success: true, invoice }
  } catch (error) {
    console.error('Error retrieving Stripe invoice:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }
  }
}

/**
 * Liste les factures d'un client
 */
export async function listInvoices(customerId: string, limit = 10) {
  try {
    const invoices = await stripe.invoices.list({
      customer: customerId,
      limit,
      expand: ['data.customer', 'data.subscription'],
    })

    return { success: true, invoices: invoices.data }
  } catch (error) {
    console.error('Error listing Stripe invoices:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }
  }
}

/**
 * Gère les webhooks Stripe
 */
export async function handleWebhook(
  payload: string, 
  signature: string, 
  webhookSecret: string
) {
  try {
    const event = stripe.webhooks.constructEvent(
      payload,
      signature,
      webhookSecret
    )

    return { success: true, event }
  } catch (error) {
    console.error('Error handling Stripe webhook:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }
  }
}

/**
 * Types pour les événements webhook
 */
export type StripeWebhookEvent = 
  | 'customer.created'
  | 'customer.updated'
  | 'customer.deleted'
  | 'invoice.created'
  | 'invoice.payment_succeeded'
  | 'invoice.payment_failed'
  | 'invoice.finalized'
  | 'customer.subscription.created'
  | 'customer.subscription.updated'
  | 'customer.subscription.deleted'
  | 'payment_method.attached'
  | 'checkout.session.completed'

export default stripe;
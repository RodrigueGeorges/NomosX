import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/db';

/**
 * Middleware to check if user has access to specific features
 * Based on subscription tier
 */

export type Tier = 'TRIAL' | 'EXECUTIVE' | 'STRATEGY';

export interface SubscriptionCheck {
  tier: Tier;
  canAccessBriefs: boolean;
  canAccessStudio: boolean;
  canCreateVerticals: boolean;
  canExportPdf: boolean;
  weeklyLimit: number;
  studioLimit: number;
  weeklyUsed: number;
  studioUsed: number;
}

/**
 * Check user subscription and return access info
 */
export async function checkSubscription(request: NextRequest): Promise<SubscriptionCheck | null> {
  try {
    const session = await getSession();
    if (!session?.email) {
      return null;
    }

    const user = await prisma.user.findUnique({
      where: { email: session.email },
      include: { subscription: true },
    });

    if (!user) {
      return null;
    }

    const subscription = user.subscription;
    
    // Default values for users without subscription
    const defaultCheck: SubscriptionCheck = {
      tier: 'TRIAL',
      canAccessBriefs: false,
      canAccessStudio: false,
      canCreateVerticals: false,
      canExportPdf: false,
      weeklyLimit: 3,
      studioLimit: 0,
      weeklyUsed: 0,
      studioUsed: 0,
    };

    if (!subscription) {
      return defaultCheck;
    }

    return {
      tier: subscription.plan as Tier,
      canAccessBriefs: subscription.plan !== 'TRIAL',
      canAccessStudio: subscription.plan === 'STRATEGY',
      canCreateVerticals: subscription.plan === 'STRATEGY',
      canExportPdf: subscription.plan !== 'TRIAL',
      weeklyLimit: subscription.weeklyPublicationMax,
      studioLimit: subscription.studioQuestionsPerMonth,
      weeklyUsed: subscription.weeklyPublicationCount,
      studioUsed: subscription.studioQuestionsUsed,
    };

  } catch (error) {
    console.error('[Subscription Check] Error:', error);
    return null;
  }
}

/**
 * Middleware for STRATEGY tier only access
 */
export async function requireStrategyTier(request: NextRequest): Promise<{ allowed: boolean; subscription?: SubscriptionCheck }> {
  const subscription = await checkSubscription(request);
  
  if (!subscription) {
    return { allowed: false };
  }

  if (subscription.tier !== 'STRATEGY') {
    return { allowed: false, subscription };
  }

  return { allowed: true, subscription };
}

/**
 * Middleware for EXECUTIVE+ tier access
 */
export async function requireExecutiveTier(request: NextRequest): Promise<{ allowed: boolean; subscription?: SubscriptionCheck }> {
  const subscription = await checkSubscription(request);
  
  if (!subscription) {
    return { allowed: false };
  }

  if (subscription.tier === 'TRIAL') {
    return { allowed: false, subscription };
  }

  return { allowed: true, subscription };
}

/**
 * Middleware for any authenticated user (including TRIAL)
 */
export async function requireAuth(request: NextRequest): Promise<{ allowed: boolean; subscription?: SubscriptionCheck }> {
  const subscription = await checkSubscription(request);
  
  if (!subscription) {
    return { allowed: false };
  }

  return { allowed: true, subscription };
}

/**
 * Check if user has exceeded weekly publication limit
 */
export function hasExceededWeeklyLimit(subscription: SubscriptionCheck): boolean {
  if (subscription.weeklyLimit === -1) return false; // unlimited
  return subscription.weeklyUsed >= subscription.weeklyLimit;
}

/**
 * Check if user has exceeded studio limit
 */
export function hasExceededStudioLimit(subscription: SubscriptionCheck): boolean {
  if (subscription.studioLimit === -1) return false; // unlimited
  return subscription.studioUsed >= subscription.studioLimit;
}

/**
 * Create standard error response for access denied
 */
export function createAccessDeniedResponse(requiredTier: Tier, currentTier?: Tier): NextResponse {
  const messages = {
    'TRIAL': 'Authentication required',
    'EXECUTIVE': 'Executive tier or higher required',
    'STRATEGY': 'Strategy tier required',
  };

  return NextResponse.json({
    error: messages[requiredTier],
    requiredTier,
    currentTier,
    upgradeUrl: '/pricing'
  }, { status: 403 });
}

/**
 * Create standard error response for limit exceeded
 */
export function createLimitExceededResponse(limitType: 'weekly' | 'studio'): NextResponse {
  const messages = {
    weekly: 'Weekly publication limit exceeded',
    studio: 'Studio question limit exceeded',
  };

  return NextResponse.json({
    error: messages[limitType],
    limitType,
    upgradeUrl: '/pricing'
  }, { status: 429 });
}

import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { sendEmailVerificationEmail } from '@/lib/email';
import { assertRateLimit, RateLimitError } from '@/lib/security/rate-limit';

/**
 * POST /api/auth/send-verification
 * 
 * Send email verification link to user
 */
export async function POST(req: NextRequest) {
  try {
    // Rate limit: 3 emails per hour per user
    const session = await getSession();
    if (!session?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
      assertRateLimit(`email:verify:${session.email}`, 3, 60 * 60_000);
    } catch (err) {
      if (err instanceof RateLimitError) {
        return NextResponse.json(
          { error: 'Too many verification requests. Please try again later.' },
          { status: 429, headers: { 'Retry-After': String(Math.ceil(err.retryAfterMs / 1000)) } }
        );
      }
      throw err;
    }

    const user = await prisma.user.findUnique({
      where: { email: session.email },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Generate verification token using crypto
    const token = Array.from(crypto.getRandomValues(new Uint8Array(32)))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24); // 24 hour expiry

    // Save verification token (using existing schema fields)
    const currentPreferences = user.preferences || {};
    await prisma.user.update({
      where: { id: user.id },
      data: {
        verificationToken: token,
        // Note: emailVerificationExpires will be added via migration
        // For now, we'll use a timestamp in preferences as fallback
        preferences: {
          ...currentPreferences,
          emailVerificationExpires: expiresAt.toISOString(),
        },
      },
    });

    // Send verification email
    const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/verify-email?token=${token}&email=${encodeURIComponent(user.email)}`;
    
    await sendEmailVerificationEmail(user.email, user.name, verificationUrl);

    return NextResponse.json({
      success: true,
      message: 'Verification email sent',
    });

  } catch (error) {
    console.error('[Send Verification] Error:', error);
    return NextResponse.json(
      { error: 'Failed to send verification email' },
      { status: 500 }
    );
  }
}

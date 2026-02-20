import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { createSession } from '@/lib/auth';

/**
 * GET /api/auth/verify-email
 * 
 * Verify email with token and mark as verified
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get('token');
    const email = searchParams.get('email');

    if (!token || !email) {
      return NextResponse.json({ error: 'Invalid verification link' }, { status: 400 });
    }

    const user = await prisma.user.findFirst({
      where: {
        email: decodeURIComponent(email),
        verificationToken: token,
      },
    });

    // Check expiry from preferences as fallback until migration is applied
    if (user && user.preferences?.emailVerificationExpires) {
      const expiryDate = new Date(user.preferences.emailVerificationExpires);
      if (expiryDate <= new Date()) {
        // Token expired
        return null;
      }
    }

    if (!user) {
      return NextResponse.json({ 
        error: 'Invalid or expired verification link',
        code: 'INVALID_TOKEN'
      }, { status: 400 });
    }

    // Mark email as verified
    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified: true,
        verificationToken: null,
        // Clear verification expiry from preferences
        preferences: {
          ...(user.preferences || {}),
          emailVerificationExpires: null,
        },
      },
    });

    // Create session for user if not already logged in
    await createSession({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    });

    // Redirect to dashboard with success message
    const redirectUrl = `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?verified=true`;
    
    return NextResponse.redirect(redirectUrl);

  } catch (error) {
    console.error('[Verify Email] Error:', error);
    return NextResponse.json(
      { error: 'Failed to verify email' },
      { status: 500 }
    );
  }
}

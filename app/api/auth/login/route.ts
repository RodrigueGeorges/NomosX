import { NextRequest,NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { verifyPassword,hashPassword,createSession } from '@/lib/auth';
import { assertRateLimit, RateLimitError } from '@/lib/security/rate-limit';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().email("Email invalide"),
  password: z.string().min(1, "Le mot de passe est requis"),
});

/**
 * POST /api/auth/login
 * Authenticate user and create session
 */
export async function POST(req: NextRequest) {
  try {
    // Rate limit: 5 login attempts per 15 minutes per IP
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || req.headers.get('x-real-ip') || 'unknown';
    try {
      assertRateLimit(`auth:login:${ip}`, 5, 15 * 60_000);
    } catch (err) {
      if (err instanceof RateLimitError) {
        return NextResponse.json(
          { error: "Trop de tentatives. Réessayez dans quelques minutes." },
          { status: 429, headers: { 'Retry-After': String(Math.ceil(err.retryAfterMs / 1000)) } }
        );
      }
      throw err;
    }

    const body = await req.json();
    
    // Validate input
    const validation = loginSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.errors[0].message },
        { status: 400 }
      );
    }

    const { email, password } = validation.data;

    // Find user
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Email ou mot de passe incorrect" },
        { status: 401 }
      );
    }

    // Verify password
    const isValidPassword = await verifyPassword(password, user.password);

    if (!isValidPassword) {
      return NextResponse.json(
        { error: "Email ou mot de passe incorrect" },
        { status: 401 }
      );
    }

    // Seamless migration: if password is legacy-hashed, upgrade to bcrypt on successful login
    if (!String(user.password || "").startsWith("$2")) {
      try {
        const upgraded = await hashPassword(password);
        await prisma.user.update({
          where: { id: user.id },
          data: { password: upgraded },
        });
      } catch (e) {
        console.warn("[Login API] Failed to upgrade password hash:", (e as any)?.message || e);
      }
    }

    // Update last login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    // Create session
    await createSession({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    });

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error: any) {
    console.error("[Login API] Error:", error);
    return NextResponse.json(
      { error: "Erreur lors de la connexion" },
      { status: 500 }
    );
  }
}

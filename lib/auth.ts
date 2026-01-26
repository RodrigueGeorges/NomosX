/**
 * Authentication utilities
 * Handles password hashing, JWT tokens, and session management
 */

import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "nomosx-secret-key-change-in-production"
);

const SESSION_COOKIE_NAME = "nomosx-session";
const SESSION_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days

export type SessionUser = {
  id: string;
  email: string;
  name: string | null;
  role: string;
};

/**
 * Hash password using Web Crypto API
 * For production, use bcrypt: npm install bcryptjs
 */
export async function hashPassword(password: string): Promise<string> {
  // Simple hash for development - REPLACE with bcrypt in production
  const encoder = new TextEncoder();
  const data = encoder.encode(password + process.env.PASSWORD_SALT || "nomosx-salt");
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

/**
 * Verify password
 */
export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  const hash = await hashPassword(password);
  return hash === hashedPassword;
}

/**
 * Create JWT token
 */
export async function createToken(user: SessionUser): Promise<string> {
  const token = await new SignJWT({ user })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(JWT_SECRET);

  return token;
}

/**
 * Verify JWT token
 */
export async function verifyToken(token: string): Promise<SessionUser | null> {
  try {
    const verified = await jwtVerify(token, JWT_SECRET);
    return verified.payload.user as SessionUser;
  } catch (error) {
    return null;
  }
}

/**
 * Create session cookie
 */
export async function createSession(user: SessionUser): Promise<void> {
  const token = await createToken(user);
  const cookieStore = await cookies();
  
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: SESSION_DURATION / 1000,
    path: "/",
  });
}

/**
 * Get current session user
 */
export async function getSession(): Promise<SessionUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!token) return null;

  return await verifyToken(token);
}

/**
 * Delete session
 */
export async function deleteSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}

/**
 * Require authentication (use in Server Components)
 */
export async function requireAuth(): Promise<SessionUser> {
  const user = await getSession();
  
  if (!user) {
    throw new Error("Unauthorized");
  }

  return user;
}

/**
 * Require admin role
 */
export async function requireAdmin(): Promise<SessionUser> {
  const user = await requireAuth();
  
  if (user.role !== "admin") {
    throw new Error("Forbidden: Admin access required");
  }

  return user;
}

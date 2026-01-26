import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "nomosx-secret-key-change-in-production"
);

const SESSION_COOKIE_NAME = "nomosx-session";

// Routes that require authentication
const PROTECTED_ROUTES = [
  "/dashboard",
  "/search",
  "/brief",
  "/briefs",
  "/council",
  "/digests",
  "/radar",
  "/topics",
  "/settings",
];

// Routes accessible only when NOT authenticated
const AUTH_ROUTES = ["/auth/login", "/auth/register"];

// Public routes (accessible by everyone)
const PUBLIC_ROUTES = ["/", "/api/auth/login", "/api/auth/register", "/api/auth/logout"];

/**
 * Middleware to protect routes and handle authentication
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow API routes and public routes
  if (
    pathname.startsWith("/api/") ||
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/public/") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // Get session token
  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  let isAuthenticated = false;

  if (token) {
    try {
      await jwtVerify(token, JWT_SECRET);
      isAuthenticated = true;
    } catch (error) {
      // Token is invalid or expired
      isAuthenticated = false;
    }
  }

  // Check if route is protected
  const isProtectedRoute = PROTECTED_ROUTES.some((route) =>
    pathname.startsWith(route)
  );

  // Check if route is auth route
  const isAuthRoute = AUTH_ROUTES.some((route) => pathname.startsWith(route));

  // Redirect to login if trying to access protected route without auth
  if (isProtectedRoute && !isAuthenticated) {
    const loginUrl = new URL("/auth/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Redirect to dashboard if authenticated user tries to access auth routes
  if (isAuthRoute && isAuthenticated) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (auth API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\..*|public).*)",
  ],
};

/**
 * Simple rate limiting helper for Next.js API routes.
 *
 * - In-memory fixed window (works in long-lived Node processes).
 * - For true serverless correctness, replace with Redis-backed counters.
 */

type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();

export class RateLimitError extends Error {
  constructor(public retryAfterMs: number) {
    super("Rate limit exceeded");
    this.name = "RateLimitError";
  }
}

export function assertRateLimit(key: string, limit: number, windowMs: number): void {
  const now = Date.now();
  const b = buckets.get(key);

  if (!b || now >= b.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return;
  }

  if (b.count >= limit) {
    throw new RateLimitError(b.resetAt - now);
  }

  b.count += 1;
  buckets.set(key, b);
}

// Basic cleanup to prevent unbounded growth
setInterval(() => {
  const now = Date.now();
  for (const [k, b] of buckets.entries()) {
    if (now >= b.resetAt) buckets.delete(k);
  }
}, 60_000).unref?.();

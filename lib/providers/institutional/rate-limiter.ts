/**
 * Rate Limiter pour providers institutionnels
 * Garantit conformité légale et évite bannissements IP
 */

import { INSTITUTIONAL_PROVIDERS } from './index';

interface RateLimitEntry {
  lastRequest: number;
  minInterval: number; // milliseconds
}

const rateLimits = new Map<string, RateLimitEntry>();

/**
 * Attend le délai nécessaire avant de faire une requête
 * DOIT être appelé avant chaque requête HTTP vers un provider institutionnel
 */
export async function waitForRateLimit(provider: keyof typeof INSTITUTIONAL_PROVIDERS): Promise<void> {
  const config = INSTITUTIONAL_PROVIDERS[provider];
  if (!config) {
    console.warn(`[RateLimiter] Unknown provider: ${provider}`);
    return;
  }
  
  const now = Date.now();
  const entry = rateLimits.get(provider);
  
  if (entry) {
    const elapsed = now - entry.lastRequest;
    const remaining = entry.minInterval - elapsed;
    
    if (remaining > 0) {
      console.log(`[RateLimiter] ${provider}: waiting ${remaining}ms`);
      await sleep(remaining);
    }
  }
  
  // Update last request time
  rateLimits.set(provider, {
    lastRequest: Date.now(),
    minInterval: config.rateLimit
  });
}

/**
 * Vérifie si une requête peut être faite immédiatement
 */
export function canMakeRequest(provider: keyof typeof INSTITUTIONAL_PROVIDERS): boolean {
  const config = INSTITUTIONAL_PROVIDERS[provider];
  if (!config) return true;
  
  const entry = rateLimits.get(provider);
  if (!entry) return true;
  
  const elapsed = Date.now() - entry.lastRequest;
  return elapsed >= entry.minInterval;
}

/**
 * Reset rate limit pour un provider (utile pour tests)
 */
export function resetRateLimit(provider: keyof typeof INSTITUTIONAL_PROVIDERS): void {
  rateLimits.delete(provider);
}

/**
 * Reset tous les rate limits
 */
export function resetAllRateLimits(): void {
  rateLimits.clear();
}

/**
 * Sleep helper
 */
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Wrapper pour requêtes HTTP avec rate limiting automatique
 */
export async function rateLimitedFetch(
  provider: keyof typeof INSTITUTIONAL_PROVIDERS,
  url: string,
  options?: RequestInit
): Promise<Response> {
  await waitForRateLimit(provider);
  
  const config = INSTITUTIONAL_PROVIDERS[provider];
  const headers = {
    'User-Agent': 'NomosX Research Bot (+https://nomosx.com | contact@nomosx.com)',
    ...options?.headers
  };
  
  console.log(`[${provider}] Fetching: ${url}`);
  
  try {
    const response = await fetch(url, { ...options, headers });
    
    // Log rate limit headers if present
    const remaining = response.headers.get('X-RateLimit-Remaining');
    if (remaining) {
      console.log(`[${provider}] Rate limit remaining: ${remaining}`);
    }
    
    // Handle rate limit errors
    if (response.status === 429) {
      const retryAfter = response.headers.get('Retry-After');
      const waitTime = retryAfter ? parseInt(retryAfter) * 1000 : 60000; // Default 60s
      console.warn(`[${provider}] Rate limited (429). Waiting ${waitTime}ms`);
      await sleep(waitTime);
      // Retry once
      return rateLimitedFetch(provider, url, options);
    }
    
    return response;
  } catch (error: any) {
    console.error(`[${provider}] Fetch failed: ${error.message}`);
    throw error;
  }
}

/**
 * Stats pour monitoring
 */
export function getRateLimitStats() {
  const stats: Record<string, any> = {};
  
  for (const [provider, entry] of rateLimits.entries()) {
    const config = INSTITUTIONAL_PROVIDERS[provider as keyof typeof INSTITUTIONAL_PROVIDERS];
    const elapsed = Date.now() - entry.lastRequest;
    
    stats[provider] = {
      lastRequest: new Date(entry.lastRequest).toISOString(),
      elapsedMs: elapsed,
      canRequest: elapsed >= entry.minInterval,
      minIntervalMs: config?.rateLimit || 0,
      category: config?.category || 'unknown'
    };
  }
  
  return stats;
}

/**
 * Redis Cache Service
 * Provides caching for embeddings, LLM responses, and API calls
 */

import Redis from 'ioredis';
import { env } from '../env';
import { createHash } from 'crypto';

// Singleton Redis client
let redis: Redis | null = null;
let redisInitialized = false;

function getRedisClient(): Redis | null {
  if (redisInitialized) return redis;
  redisInitialized = true;

  // Try Upstash first (preferred for serverless)
  if (env.UPSTASH_REDIS_REST_URL && env.UPSTASH_REDIS_REST_TOKEN) {
    redis = new Redis(env.UPSTASH_REDIS_REST_URL, {
      password: env.UPSTASH_REDIS_REST_TOKEN,
      maxRetriesPerRequest: 3,
      retryStrategy: (times) => {
        if (times > 3) return null; // Stop retrying
        return Math.min(times * 200, 2000); // Exponential backoff
      },
      lazyConnect: false, // Connect immediately
    });
    
    redis.on("error", (err) => {
      console.error("❌ Upstash Redis error:", err.message);
    });
    
    redis.on("connect", () => {
      console.log("✅ Upstash Redis connected");
    });
    return redis;
  }
  
  // Fallback to traditional Redis URL
  if (env.REDIS_URL) {
    redis = new Redis(env.REDIS_URL, {
      maxRetriesPerRequest: 3,
      retryStrategy: (times) => {
        if (times > 3) return null; // Stop retrying
        return Math.min(times * 200, 2000); // Exponential backoff
      },
      lazyConnect: false, // Connect immediately
    });
    
    redis.on("error", (err) => {
      console.error("❌ Redis error:", err.message);
    });
    
    redis.on("connect", () => {
      console.log("✅ Redis connected");
    });
    return redis;
  }
  
  console.warn("⚠️ Redis not configured. Caching disabled.");
  return null;
}

/**
 * Generate cache key from any object
 */
function generateCacheKey(prefix: string, data: any): string {
  // Simple hash without crypto (Edge Runtime compatible)
  const str = JSON.stringify(data);
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return `${prefix}:${Math.abs(hash).toString(36).slice(0, 16)}`;
}

/**
 * Cache embedding vector
 */
export async function cacheEmbedding(
  text: string,
  model: string,
  embedding: number[]
): Promise<void> {
  const client = getRedisClient();
  if (!client) return;
  
  try {
    const key = generateCacheKey("emb", { text, model });
    // Cache embeddings for 30 days
    await client.setex(key, 30 * 24 * 60 * 60, JSON.stringify(embedding));
  } catch (err) {
    console.error("Failed to cache embedding:", err);
  }
}

/**
 * Get cached embedding
 */
export async function getCachedEmbedding(
  text: string,
  model: string
): Promise<number[] | null> {
  const client = getRedisClient();
  if (!client) return null;
  
  try {
    const key = generateCacheKey("emb", { text, model });
    const cached = await client.get(key);
    if (cached) {
      return JSON.parse(cached);
    }
  } catch (err) {
    console.error("Failed to get cached embedding:", err);
  }
  
  return null;
}

/**
 * Cache LLM response (semantic cache)
 */
export async function cacheLLMResponse(
  prompt: string,
  model: string,
  response: any,
  ttl: number = 7 * 24 * 60 * 60 // 7 days default
): Promise<void> {
  const client = getRedisClient();
  if (!client) return;
  
  try {
    const key = generateCacheKey("llm", { prompt, model });
    await client.setex(key, ttl, JSON.stringify(response));
  } catch (err) {
    console.error("Failed to cache LLM response:", err);
  }
}

/**
 * Get cached LLM response
 */
export async function getCachedLLMResponse(
  prompt: string,
  model: string
): Promise<any | null> {
  const client = getRedisClient();
  if (!client) return null;
  
  try {
    const key = generateCacheKey("llm", { prompt, model });
    const cached = await client.get(key);
    if (cached) {
      console.log("✅ Cache hit for LLM response");
      return JSON.parse(cached);
    }
  } catch (err) {
    console.error("Failed to get cached LLM response:", err);
  }
  
  return null;
}

/**
 * Cache generic API response
 */
export async function cacheAPIResponse(
  cacheKey: string,
  data: any,
  ttl: number = 24 * 60 * 60 // 24 hours default
): Promise<void> {
  const client = getRedisClient();
  if (!client) return;
  
  try {
    await client.setex(cacheKey, ttl, JSON.stringify(data));
  } catch (err) {
    console.error("Failed to cache API response:", err);
  }
}

/**
 * Get cached API response
 */
export async function getCachedAPIResponse(cacheKey: string): Promise<any | null> {
  const client = getRedisClient();
  if (!client) return null;
  
  try {
    const cached = await client.get(cacheKey);
    if (cached) {
      return JSON.parse(cached);
    }
  } catch (err) {
    console.error("Failed to get cached API response:", err);
  }
  
  return null;
}

/**
 * Invalidate cache by pattern
 */
export async function invalidateCacheByPattern(pattern: string): Promise<number> {
  const client = getRedisClient();
  if (!client) return 0;
  
  try {
    // Use SCAN instead of KEYS to avoid O(N) blocking in production
    const allKeys: string[] = [];
    let cursor = '0';
    do {
      const [nextCursor, keys] = await client.scan(cursor, 'MATCH', pattern, 'COUNT', 100);
      cursor = nextCursor;
      allKeys.push(...keys);
    } while (cursor !== '0');

    if (allKeys.length > 0) {
      return await client.del(...allKeys);
    }
  } catch (err) {
    console.error("Failed to invalidate cache:", err);
  }
  
  return 0;
}

/**
 * Get cache statistics
 */
export async function getCacheStats(): Promise<{
  connected: boolean;
  keyCount: number;
  memoryUsage: string;
} | null> {
  const client = getRedisClient();
  if (!client) return null;
  
  try {
    const dbSize = await client.dbsize();
    const info = await client.info("memory");
    const memoryMatch = info.match(/used_memory_human:(.+)/);
    const memoryUsage = memoryMatch ? memoryMatch[1].trim() : "unknown";
    
    return {
      connected: true,
      keyCount: dbSize,
      memoryUsage,
    };
  } catch (err) {
    console.error("Failed to get cache stats:", err);
    return null;
  }
}

/**
 * Close Redis connection (for cleanup)
 */
export async function closeRedisConnection(): Promise<void> {
  if (redis) {
    await redis.quit();
    redis = null;
  }
}

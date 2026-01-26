/**
 * Redis Cache Service
 * Provides caching for embeddings, LLM responses, and API calls
 */

import Redis from "ioredis";
import { env } from "../env";
import { createHash } from "crypto";

// Singleton Redis client
let redis: Redis | null = null;

function getRedisClient(): Redis | null {
  if (!env.REDIS_URL) {
    console.warn("⚠️ Redis not configured. Caching disabled.");
    return null;
  }
  
  if (!redis) {
    redis = new Redis(env.REDIS_URL, {
      maxRetriesPerRequest: 3,
      retryStrategy: (times) => {
        if (times > 3) return null; // Stop retrying
        return Math.min(times * 200, 2000); // Exponential backoff
      },
      lazyConnect: true,
    });
    
    redis.on("error", (err) => {
      console.error("❌ Redis error:", err);
    });
    
    redis.on("connect", () => {
      console.log("✅ Redis connected");
    });
  }
  
  return redis;
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
    await client.connect();
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
    await client.connect();
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
    await client.connect();
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
    await client.connect();
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
    await client.connect();
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
    await client.connect();
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
    await client.connect();
    const keys = await client.keys(pattern);
    if (keys.length > 0) {
      return await client.del(...keys);
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
    await client.connect();
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

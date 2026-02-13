import { NextRequest } from 'next/server';

interface RateLimitStore {
  [key: string]: {
    count: number
    resetTime: number
  }
}

const store: RateLimitStore = {}

export function rateLimit({
  windowMs = 15 * 60 * 1000, // 15 minutes
  maxRequests = 100,
}: {
  windowMs?: number
  maxRequests?: number
} = {}) {
  return (request: NextRequest) => {
    const ip = (request as any).ip || request.headers.get('x-forwarded-for') || 'unknown'
    const now = Date.now()
    const windowStart = now - windowMs

    // Clean old entries
    Object.keys(store).forEach(key => {
      if (store[key].resetTime < windowStart) {
        delete store[key]
      }
    })

    // Check current IP
    const current = store[ip] || { count: 0, resetTime: now + windowMs }
    
    if (current.resetTime < now) {
      current.count = 0
      current.resetTime = now + windowMs
    }

    current.count++
    store[ip] = current

    return {
      success: current.count <= maxRequests,
      remaining: Math.max(0, maxRequests - current.count),
      resetTime: current.resetTime,
    }
  }
}
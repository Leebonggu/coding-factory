/**
 * In-Memory Rate Limiter
 *
 * Suitable for single-instance / serverless deployments where requests are
 * scoped to one process. For multi-instance production deployments, replace
 * the in-memory store with a shared store such as Redis (e.g. Upstash).
 *
 * @example Basic usage in a Next.js Route Handler
 *
 *   import { apiRateLimit } from '@/lib/security/rate-limit'
 *   import { NextResponse } from 'next/server'
 *
 *   export async function GET(request: Request) {
 *     const ip = request.headers.get('x-forwarded-for') ?? 'anonymous'
 *     try {
 *       await apiRateLimit.check(10, ip)   // max 10 req per interval
 *     } catch {
 *       return NextResponse.json({ error: 'Too Many Requests' }, { status: 429 })
 *     }
 *     return NextResponse.json({ ok: true })
 *   }
 *
 * @example Custom limiter
 *
 *   import { rateLimit } from '@/lib/security/rate-limit'
 *
 *   // 5 requests per 60 seconds, track up to 500 unique tokens
 *   const strictLimit = rateLimit({ interval: 60_000, uniqueTokenPerInterval: 500 })
 *   await strictLimit.check(5, userId)
 */

export interface RateLimitOptions {
  /**
   * Time window in milliseconds.
   * The token counter resets after each interval.
   */
  interval: number
  /**
   * Maximum number of unique tokens (e.g. IP addresses) to track per interval.
   * Oldest entries are evicted when this limit is reached.
   */
  uniqueTokenPerInterval: number
}

export interface RateLimiter {
  /**
   * Check whether `token` has exceeded `limit` requests within the current interval.
   *
   * @param limit - Maximum allowed requests for this token per interval.
   * @param token - A unique identifier for the requester (IP, user ID, API key, …).
   * @throws {RateLimitError} When the limit is exceeded.
   */
  check(limit: number, token: string): Promise<void>
}

export class RateLimitError extends Error {
  constructor(message = 'Rate limit exceeded') {
    super(message)
    this.name = 'RateLimitError'
  }
}

/**
 * Create a rate limiter instance.
 *
 * Each call to `rateLimit()` creates an isolated token store — use module-level
 * singletons (like `apiRateLimit` below) so state persists across requests.
 */
export function rateLimit({
  interval,
  uniqueTokenPerInterval,
}: RateLimitOptions): RateLimiter {
  // Map<token, requestCount>
  const tokenCache = new Map<string, number>()

  // Reset all counters at the end of each interval
  const cleanup = setInterval(() => {
    tokenCache.clear()
  }, interval)

  // Allow Node.js to exit even if this timer is still pending
  if (cleanup.unref) cleanup.unref()

  return {
    check(limit: number, token: string): Promise<void> {
      // Evict the oldest entry if we've hit the unique-token cap
      if (tokenCache.size >= uniqueTokenPerInterval && !tokenCache.has(token)) {
        const oldest = tokenCache.keys().next().value
        if (oldest !== undefined) tokenCache.delete(oldest)
      }

      const current = (tokenCache.get(token) ?? 0) + 1
      tokenCache.set(token, current)

      if (current > limit) {
        return Promise.reject(new RateLimitError())
      }

      return Promise.resolve()
    },
  }
}

/**
 * Pre-configured rate limiter for general API routes.
 *
 * Default: 10 requests per 10-second window, tracking up to 500 unique tokens.
 * Increase `uniqueTokenPerInterval` for high-traffic deployments.
 */
export const apiRateLimit = rateLimit({
  interval: 10_000,
  uniqueTokenPerInterval: 500,
})

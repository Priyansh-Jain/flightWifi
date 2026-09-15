// In-memory sliding-window rate limiter. Per-instance only: Vercel
// serverless instances each get their own Map, so this is "best effort"
// and will under-count under heavy concurrent load. For real distributed
// limiting, swap to Vercel KV / Upstash. Kept here so the API routes can
// share one shape rather than each rolling its own.

interface Bucket {
  count: number
  resetAt: number
}

export interface RateLimiter {
  check: (key: string) => boolean
  // Seconds left in the key's current window, so a throttled caller can be told when to come
  // back instead of guessing. Zero when the key has no live bucket.
  retryAfter: (key: string) => number
}

export function createRateLimiter({
  maxRequests,
  windowMs,
}: {
  maxRequests: number
  windowMs: number
}): RateLimiter {
  const buckets = new Map<string, Bucket>()

  return {
    check(key: string): boolean {
      const now = Date.now()
      // Prune stale entries on every call so the map can't grow forever.
      buckets.forEach((val, k) => {
        if (now > val.resetAt) buckets.delete(k)
      })
      const entry = buckets.get(key)
      if (!entry || now > entry.resetAt) {
        buckets.set(key, { count: 1, resetAt: now + windowMs })
        return true
      }
      if (entry.count >= maxRequests) return false
      entry.count += 1
      return true
    },
    retryAfter(key: string): number {
      const entry = buckets.get(key)
      if (!entry) return 0
      return Math.max(0, Math.ceil((entry.resetAt - Date.now()) / 1000))
    },
  }
}

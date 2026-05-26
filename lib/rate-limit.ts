/**
 * Simple in-memory sliding-window rate limiter.
 *
 * For 50-user scale this is sufficient — it catches accidental abuse,
 * runaway scripts, and naive bots. For real production at thousands of
 * users with distributed attacks, swap the storage layer for Upstash
 * Redis (the consume() function signature stays the same).
 *
 * Per-instance limitation: Vercel runs multiple serverless instances, so
 * the counters are local to each instance. A determined attacker hitting
 * the API in parallel could spread requests across instances. This is
 * acceptable for our threat model — Supabase Auth has its own backstop
 * rate limit, and Resend has a per-domain send cap.
 */

type Bucket = number[]; // sliding window of request timestamps (ms)

// Module-level Map persists for the lifetime of the serverless instance.
const buckets = new Map<string, Bucket>();

// Best-effort cleanup so the Map doesn't grow unbounded under sustained traffic.
const MAX_BUCKETS = 10_000;
function pruneIfHuge() {
  if (buckets.size <= MAX_BUCKETS) return;
  // Drop the oldest 25% of buckets when we hit the cap.
  const drop = Math.floor(MAX_BUCKETS / 4);
  const keys = Array.from(buckets.keys()).slice(0, drop);
  for (const k of keys) buckets.delete(k);
}

export type RateLimitResult = {
  ok: boolean;
  remaining: number;
  resetSeconds: number;
};

/**
 * Consume one request from the bucket identified by `key`.
 *
 * Returns ok=false if the caller has exceeded `limit` requests in the past
 * `windowSeconds` seconds. `resetSeconds` is how long until the oldest
 * request in the window falls off.
 */
export function consume(
  key: string,
  limit: number,
  windowSeconds: number
): RateLimitResult {
  const now = Date.now();
  const windowMs = windowSeconds * 1000;
  const cutoff = now - windowMs;

  let bucket = buckets.get(key);
  if (!bucket) {
    bucket = [];
    buckets.set(key, bucket);
    pruneIfHuge();
  }

  // Drop timestamps that have fallen out of the window.
  while (bucket.length && bucket[0] < cutoff) bucket.shift();

  if (bucket.length >= limit) {
    const oldest = bucket[0];
    const resetMs = Math.max(0, oldest + windowMs - now);
    return {
      ok: false,
      remaining: 0,
      resetSeconds: Math.ceil(resetMs / 1000),
    };
  }

  bucket.push(now);
  return {
    ok: true,
    remaining: limit - bucket.length,
    resetSeconds: windowSeconds,
  };
}

/**
 * Pull the caller's IP out of a Next.js request. Prefers x-forwarded-for
 * (Vercel sets this), then x-real-ip, then falls back to a constant so
 * local dev doesn't bypass the limiter.
 */
export function clientIp(req: Request): string {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  const xri = req.headers.get("x-real-ip");
  if (xri) return xri.trim();
  return "unknown";
}

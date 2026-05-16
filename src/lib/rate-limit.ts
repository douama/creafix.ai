/**
 * Rate limiting CreaFix AI — Upstash Redis + fallback in-memory.
 *
 * Si UPSTASH_REDIS_REST_URL et UPSTASH_REDIS_REST_TOKEN sont set, utilise
 * @upstash/ratelimit (sliding window distributed). Sinon, fallback in-memory
 * (suffisant en dev / mono-instance, fragile en prod multi-instance).
 *
 * Buckets pré-configurés :
 *   - audits : 10 req/min par user (audits IA très coûteux)
 *   - admin  : 60 req/min par user
 *   - public : 30 req/min par IP
 *   - login  : 5 req/min par IP (brute force protection)
 *
 * Usage dans une API route :
 *   import { rateLimit } from "@/lib/rate-limit";
 *   const rl = await rateLimit("audits", userId);
 *   if (!rl.success) return new Response("Too many requests", { status: 429 });
 */

import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

export type RateLimitBucket = "audits" | "admin" | "public" | "login";

const LIMITS: Record<RateLimitBucket, { tokens: number; windowSec: number }> = {
  audits: { tokens: 10, windowSec: 60 },
  admin:  { tokens: 60, windowSec: 60 },
  public: { tokens: 30, windowSec: 60 },
  login:  { tokens: 5,  windowSec: 60 },
};

let _redis: Redis | null = null;
const _limiters: Partial<Record<RateLimitBucket, Ratelimit>> = {};

function getRedis(): Redis | null {
  if (_redis) return _redis;
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  _redis = new Redis({ url, token });
  return _redis;
}

function getLimiter(bucket: RateLimitBucket): Ratelimit | null {
  if (_limiters[bucket]) return _limiters[bucket]!;
  const redis = getRedis();
  if (!redis) return null;
  const cfg = LIMITS[bucket];
  _limiters[bucket] = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(cfg.tokens, `${cfg.windowSec} s`),
    analytics: true,
    prefix: `cfx:rl:${bucket}`,
  });
  return _limiters[bucket]!;
}

/* ────────────────────────────────────────────────────────────────────
 * Fallback in-memory (Map<key, timestamps[]>)
 * ──────────────────────────────────────────────────────────────────── */
const _mem: Map<string, number[]> = new Map();

function memCheck(key: string, bucket: RateLimitBucket): RateLimitResult {
  const now = Date.now();
  const cfg = LIMITS[bucket];
  const windowMs = cfg.windowSec * 1000;

  let timestamps = _mem.get(key) ?? [];
  timestamps = timestamps.filter((ts) => ts > now - windowMs);

  if (timestamps.length >= cfg.tokens) {
    const oldest = timestamps[0];
    const resetIn = Math.max(0, oldest + windowMs - now);
    return {
      success: false,
      limit: cfg.tokens,
      remaining: 0,
      reset: now + resetIn,
      bucket,
      backend: "memory",
    };
  }

  timestamps.push(now);
  _mem.set(key, timestamps);

  return {
    success: true,
    limit: cfg.tokens,
    remaining: cfg.tokens - timestamps.length,
    reset: now + windowMs,
    bucket,
    backend: "memory",
  };
}

/* ────────────────────────────────────────────────────────────────────
 * API publique
 * ──────────────────────────────────────────────────────────────────── */
export type RateLimitResult = {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;        // epoch ms
  bucket: RateLimitBucket;
  backend: "upstash" | "memory";
};

export async function rateLimit(
  bucket: RateLimitBucket,
  identifier: string,
): Promise<RateLimitResult> {
  const key = `${bucket}:${identifier}`;
  const limiter = getLimiter(bucket);

  if (!limiter) {
    // Fallback in-memory
    return memCheck(key, bucket);
  }

  try {
    const { success, limit, remaining, reset } = await limiter.limit(key);
    return { success, limit, remaining, reset, bucket, backend: "upstash" };
  } catch (err) {
    console.error("[rate-limit] Upstash failed, falling back to memory:", err);
    return memCheck(key, bucket);
  }
}

/** Extrait l'identifier IP depuis un Request (header preferred order). */
export function getClientIp(request: Request): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    request.headers.get("cf-connecting-ip") ||
    "unknown"
  );
}

/** Helper : retourne une Response 429 propre si le rate limit est dépassé. */
export function rateLimitResponse(rl: RateLimitResult): Response {
  return new Response(
    JSON.stringify({
      error: "Too many requests",
      bucket: rl.bucket,
      limit: rl.limit,
      reset: new Date(rl.reset).toISOString(),
      hint: `Réessaie dans ${Math.ceil((rl.reset - Date.now()) / 1000)}s`,
    }),
    {
      status: 429,
      headers: {
        "content-type": "application/json",
        "x-ratelimit-limit": String(rl.limit),
        "x-ratelimit-remaining": "0",
        "x-ratelimit-reset": String(rl.reset),
        "retry-after": String(Math.ceil((rl.reset - Date.now()) / 1000)),
      },
    },
  );
}

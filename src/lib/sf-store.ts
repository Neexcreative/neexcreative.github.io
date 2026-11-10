/**
 * Server-only storage for Small Forever: an append-only acceptance log and
 * rate limiting, both on Upstash Redis (Vercel Marketplace, EU region).
 * Never import from client components: it reads secret env vars.
 *
 * Env (set by the Vercel Upstash integration, either naming works):
 *   KV_REST_API_URL / KV_REST_API_TOKEN, or UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN
 *
 * Without them:
 *   - appendAcceptance() throws, so callers fail closed (no unrecorded acceptance);
 *   - rateLimit() falls back to an in-memory window per server instance (best effort).
 */
import { createHash } from "node:crypto";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

let redis: Redis | null | undefined;

function getRedis(): Redis | null {
  if (redis !== undefined) return redis;
  const url = process.env.KV_REST_API_URL ?? process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN ?? process.env.UPSTASH_REDIS_REST_TOKEN;
  redis = url && token ? new Redis({ url, token }) : null;
  return redis;
}

export class StoreUnavailableError extends Error {}

/** Redis stream holding every acceptance. Entries are only ever added (XADD), never edited or deleted by the site. */
export const ACCEPTANCE_STREAM = "sf:acceptances";

/**
 * Appends one acceptance record and returns its stream ID (also a UTC
 * millisecond timestamp). Values must be short strings with no free text.
 */
export async function appendAcceptance(record: Record<string, string>): Promise<string> {
  const client = getRedis();
  if (!client) throw new StoreUnavailableError("Acceptance store is not configured");
  const id = await client.xadd(ACCEPTANCE_STREAM, "*", record);
  return String(id);
}

/* ── Rate limiting ───────────────────────────────────────────────────── */

type Rule = { limit: number; windowSeconds: number };

const limiters = new Map<string, Ratelimit>();
const memory = new Map<string, { count: number; resetAt: number }>();

/**
 * The client key is a salted hash of the IP address, used only as a rate-limit
 * counter that expires with the window. The IP itself is never stored.
 */
export function clientKey(request: Request): string {
  const ip =
    request.headers.get("x-real-ip") ?? request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const salt = process.env.RATE_LIMIT_SALT ?? "small-forever";
  return createHash("sha256").update(`${salt}:${ip}`).digest("base64url").slice(0, 22);
}

/** Returns true when the request may proceed. */
export async function rateLimit(bucket: string, key: string, rule: Rule): Promise<boolean> {
  const client = getRedis();
  if (client) {
    const name = `${bucket}:${rule.limit}:${rule.windowSeconds}`;
    let limiter = limiters.get(name);
    if (!limiter) {
      limiter = new Ratelimit({
        redis: client,
        limiter: Ratelimit.slidingWindow(rule.limit, `${rule.windowSeconds} s`),
        prefix: `sf:rl:${bucket}`,
      });
      limiters.set(name, limiter);
    }
    try {
      const { success } = await limiter.limit(key);
      return success;
    } catch (error) {
      // Never block real customers because the limiter is down.
      console.error("[rate-limit] store error, allowing request:", error instanceof Error ? error.message : error);
      return true;
    }
  }

  // Fallback: per-instance memory window. Weaker on serverless, still blunts bursts.
  const now = Date.now();
  const id = `${bucket}:${key}`;
  const entry = memory.get(id);
  if (!entry || entry.resetAt <= now) {
    memory.set(id, { count: 1, resetAt: now + rule.windowSeconds * 1000 });
    if (memory.size > 5000) for (const [k, v] of memory) if (v.resetAt <= now) memory.delete(k);
    return true;
  }
  entry.count += 1;
  return entry.count <= rule.limit;
}

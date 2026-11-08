import { FieldValue, Timestamp } from "firebase-admin/firestore";
import { adminDb } from "@/lib/firebase-admin";
import { checkRateLimit, type RateLimitResult } from "@/lib/api-rate-limit";

/** Firestore collection holding one counter document per key per time window. */
export const RATE_LIMIT_COLLECTION = "rate_limits";

/** Firestore document ids cannot contain "/" and are capped at 1500 bytes. */
export function rateLimitDocId(key: string, windowStart: number): string {
  const safe = key.replace(/[/\s]/g, "_").slice(0, 200);
  return `${safe}__${windowStart}`;
}

/** Start of the fixed window that `now` falls in. */
export function windowStartFor(now: number, windowMs: number): number {
  return Math.floor(now / windowMs) * windowMs;
}

/**
 * Fixed-window rate limit shared by every server instance (Firestore counter).
 * Serverless functions each have their own memory, so in-memory limits reset
 * per instance; this one does not. Falls back to the in-memory limiter if
 * Firestore is unavailable, so a database hiccup never blocks real users.
 *
 * Counter documents carry `expireAt`; enable a Firestore TTL policy on
 * rate_limits.expireAt to have old windows deleted automatically.
 */
export async function checkSharedRateLimit(
  key: string,
  limit: number,
  windowMs: number,
  now = Date.now()
): Promise<RateLimitResult> {
  const windowStart = windowStartFor(now, windowMs);
  const resetAt = windowStart + windowMs;
  try {
    const ref = adminDb.collection(RATE_LIMIT_COLLECTION).doc(rateLimitDocId(key, windowStart));
    const count = await adminDb.runTransaction(async (tx) => {
      const snap = await tx.get(ref);
      const current = Number(snap.get("count") ?? 0);
      if (current >= limit) return current + 1;
      if (snap.exists) {
        tx.update(ref, { count: FieldValue.increment(1) });
      } else {
        tx.set(ref, {
          key,
          count: 1,
          windowStart: Timestamp.fromMillis(windowStart),
          expireAt: Timestamp.fromMillis(resetAt + windowMs),
        });
      }
      return current + 1;
    });
    return {
      allowed: count <= limit,
      limit,
      remaining: Math.max(0, limit - count),
      resetAt,
    };
  } catch (err) {
    console.warn("[rate-limit] Firestore unavailable, using in-memory limit:", err);
    return checkRateLimit(key, limit, windowMs, now);
  }
}

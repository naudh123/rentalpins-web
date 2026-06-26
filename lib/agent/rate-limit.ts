import { agentDailyMessageLimit } from "./env";

const store = new Map<string, { count: number; resetAt: number }>();

export function checkAgentRateLimit(key: string): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const dayMs = 24 * 60 * 60 * 1000;
  const entry = store.get(key);

  if (!entry || now > entry.resetAt) {
    store.set(key, { count: 1, resetAt: now + dayMs });
    return { allowed: true, remaining: agentDailyMessageLimit - 1 };
  }

  if (entry.count >= agentDailyMessageLimit) {
    return { allowed: false, remaining: 0 };
  }

  entry.count += 1;
  store.set(key, entry);
  return { allowed: true, remaining: agentDailyMessageLimit - entry.count };
}

export function getAgentClientKey(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  return forwarded?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "anonymous";
}

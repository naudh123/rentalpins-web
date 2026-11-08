import { agentDailyMessageLimit } from "./env";
import { checkSharedRateLimit } from "@/lib/shared-rate-limit";

const DAY_MS = 24 * 60 * 60 * 1000;

/** Daily AI message cap per client, shared across all server instances. */
export async function checkAgentRateLimit(
  key: string
): Promise<{ allowed: boolean; remaining: number }> {
  const result = await checkSharedRateLimit(`agent:${key}`, agentDailyMessageLimit, DAY_MS);
  return { allowed: result.allowed, remaining: result.remaining };
}

/** Lead form submissions per client per hour — stops spam floods of fake leads. */
export const LEAD_CAPTURE_LIMIT = { limit: 5, windowMs: 60 * 60 * 1000 } as const;

export function getAgentClientKey(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  return forwarded?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "anonymous";
}

import { describe, expect, it, vi } from "vitest";

vi.mock("@/lib/firebase-admin", () => {
  const docs = new Map<string, Record<string, unknown>>();
  const ref = (id: string) => ({ id });
  return {
    adminDb: {
      collection: () => ({ doc: (id: string) => ref(id) }),
      runTransaction: async (fn: (tx: unknown) => Promise<number>) => {
        const tx = {
          get: async (r: { id: string }) => ({
            exists: docs.has(r.id),
            get: (field: string) => docs.get(r.id)?.[field],
          }),
          set: (r: { id: string }, data: Record<string, unknown>) => docs.set(r.id, { ...data }),
          update: (r: { id: string }) => {
            const d = docs.get(r.id)!;
            d.count = Number(d.count) + 1;
          },
        };
        return fn(tx);
      },
    },
  };
});

vi.mock("firebase-admin/firestore", () => ({
  FieldValue: { increment: (n: number) => n },
  Timestamp: { fromMillis: (ms: number) => ms },
}));

import { checkSharedRateLimit, rateLimitDocId, windowStartFor } from "@/lib/shared-rate-limit";

describe("shared rate limit", () => {
  it("allows up to the limit then blocks within one window", async () => {
    const now = 1_800_000_000_000;
    const results = [];
    for (let i = 0; i < 4; i++) results.push(await checkSharedRateLimit("lead:1.2.3.4", 3, 60_000, now));
    expect(results.map((r) => r.allowed)).toEqual([true, true, true, false]);
    expect(results[3].remaining).toBe(0);
  });

  it("starts a fresh count in the next window", async () => {
    const now = 1_800_000_000_000;
    const next = await checkSharedRateLimit("lead:9.9.9.9", 1, 60_000, now);
    const blocked = await checkSharedRateLimit("lead:9.9.9.9", 1, 60_000, now + 1);
    const later = await checkSharedRateLimit("lead:9.9.9.9", 1, 60_000, now + 60_000);
    expect([next.allowed, blocked.allowed, later.allowed]).toEqual([true, false, true]);
  });

  it("builds safe document ids", () => {
    expect(rateLimitDocId("agent:2001:db8::/1", 0)).not.toContain("/");
    expect(windowStartFor(125_000, 60_000)).toBe(120_000);
  });
});

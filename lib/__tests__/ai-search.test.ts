import { describe, expect, it } from "vitest";
import { CallableError } from "@/lib/firebase-callable";
import { aiSearchErrorCode, mapAiSearchError } from "@/lib/ai-search";

describe("aiSearchErrorCode", () => {
  it("maps callable codes to GA4 buckets", () => {
    expect(aiSearchErrorCode(new CallableError("functions/deadline-exceeded", "slow"))).toBe(
      "timeout"
    );
    expect(aiSearchErrorCode(new CallableError("functions/unauthenticated", "auth"))).toBe(
      "unauthenticated"
    );
    expect(aiSearchErrorCode(new CallableError("functions/internal", "fail"))).toBe("internal");
  });

  it("returns unknown for non-callable errors", () => {
    expect(aiSearchErrorCode(new Error("boom"))).toBe("unknown");
  });
});

describe("mapAiSearchError", () => {
  it("returns user-friendly copy for common failures", () => {
    expect(mapAiSearchError(new CallableError("functions/internal", "x"))).toContain(
      "temporarily unavailable"
    );
    expect(mapAiSearchError(new CallableError("functions/deadline-exceeded", "x"))).toContain(
      "too long"
    );
  });
});

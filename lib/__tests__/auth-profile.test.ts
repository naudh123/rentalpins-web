import { describe, expect, it } from "vitest";
import { isUserBlocked } from "@/lib/user-blocked";

describe("isUserBlocked", () => {
  it("treats missing isBlocked as not blocked", () => {
    expect(isUserBlocked({})).toBe(false);
    expect(isUserBlocked(null)).toBe(false);
  });

  it("blocks only when isBlocked is true", () => {
    expect(isUserBlocked({ isBlocked: true })).toBe(true);
    expect(isUserBlocked({ isBlocked: false })).toBe(false);
  });
});

import { describe, expect, it } from "vitest";
import { validateListingsBoundsQuery } from "../listings-api-bounds";
import { checkRateLimit } from "../api-rate-limit";

describe("validateListingsBoundsQuery", () => {
  it("accepts valid bounds", () => {
    const r = validateListingsBoundsQuery("31", "30", "77", "76");
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.bounds).toEqual({ north: 31, south: 30, east: 77, west: 76 });
    }
  });

  it("rejects missing coords", () => {
    const r = validateListingsBoundsQuery("31", "30", null, "76");
    expect(r.ok).toBe(false);
  });

  it("rejects inverted latitude", () => {
    const r = validateListingsBoundsQuery("30", "31", "77", "76");
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error).toBe("Invalid bounds");
  });

  it("rejects whole-globe viewport", () => {
    const r = validateListingsBoundsQuery("86", "-85", "179", "-179");
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error).toBe("Viewport too large");
  });
});

describe("checkRateLimit", () => {
  it("allows requests under limit", () => {
    const key = `test-${Math.random()}`;
    const r1 = checkRateLimit(key, 3, 60_000, 1_000_000);
    const r2 = checkRateLimit(key, 3, 60_000, 1_000_001);
    expect(r1.allowed).toBe(true);
    expect(r2.allowed).toBe(true);
    expect(r2.remaining).toBe(1);
  });

  it("blocks when limit exceeded", () => {
    const key = `test-block-${Math.random()}`;
    checkRateLimit(key, 2, 60_000, 2_000_000);
    checkRateLimit(key, 2, 60_000, 2_000_001);
    const r3 = checkRateLimit(key, 2, 60_000, 2_000_002);
    expect(r3.allowed).toBe(false);
  });
});

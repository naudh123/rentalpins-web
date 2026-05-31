import { describe, expect, it } from "vitest";
import { resolveListingPlansFromDocs, type ListingPlanDocInput } from "@/lib/listing-plans";

function doc(
  id: string,
  data: Record<string, unknown>
): ListingPlanDocInput {
  return { id, data };
}

describe("resolveListingPlansFromDocs", () => {
  const chandigarh = { listingLat: 30.7333, listingLng: 76.7794 };

  it("prefers city plans inside radius over country and global", () => {
    const result = resolveListingPlansFromDocs(
      [
        doc("global", { tier: "global", price: 500, version: 1 }),
        doc("country", {
          tier: "country",
          targetIso: "IN",
          price: 300,
          version: 2,
        }),
        doc("city", {
          tier: "city",
          targetIso: "IN",
          cityCode: "CHD",
          center: { latitude: 30.73, longitude: 76.78 },
          radiusMeters: 5000,
          price: 100,
          version: 3,
        }),
      ],
      { homeIso: "IN", ...chandigarh, isEligibleForFree: false }
    );
    expect(result.resolvedTier).toBe("city");
    expect(result.plans.map((p) => p.id)).toEqual(["city"]);
  });

  it("falls back to country when no city match", () => {
    const result = resolveListingPlansFromDocs(
      [
        doc("global", { tier: "global", price: 500, version: 1 }),
        doc("country-in", {
          tier: "country",
          targetIso: "IN",
          price: 200,
          version: 2,
        }),
        doc("country-us", {
          tier: "country",
          targetIso: "US",
          price: 99,
          version: 9,
        }),
      ],
      { homeIso: "IN", ...chandigarh, isEligibleForFree: false }
    );
    expect(result.resolvedTier).toBe("country");
    expect(result.plans.map((p) => p.id)).toEqual(["country-in"]);
  });

  it("falls back to global when no city or country", () => {
    const result = resolveListingPlansFromDocs(
      [
        doc("country-us", { tier: "country", targetIso: "US", price: 1, version: 1 }),
        doc("global", { tier: "global", price: 400, version: 2 }),
      ],
      { homeIso: "IN", ...chandigarh, isEligibleForFree: false }
    );
    expect(result.resolvedTier).toBe("global");
    expect(result.plans.map((p) => p.id)).toEqual(["global"]);
  });

  it("skips plans before scheduledStartTime", () => {
    const future = Date.now() + 60_000;
    const result = resolveListingPlansFromDocs(
      [
        doc("future", {
          tier: "global",
          price: 1,
          scheduledStartTime: { seconds: Math.floor(future / 1000) },
        }),
        doc("now", { tier: "global", price: 2, version: 1 }),
      ],
      { homeIso: "IN", isEligibleForFree: false, nowMs: Date.now() }
    );
    expect(result.plans.map((p) => p.id)).toEqual(["now"]);
  });

  it("shows free plans only when eligible", () => {
    const result = resolveListingPlansFromDocs(
      [
        doc("free", { tier: "country", targetIso: "IN", price: 0, version: 1 }),
        doc("paid", { tier: "country", targetIso: "IN", price: 299, version: 2 }),
      ],
      { homeIso: "IN", isEligibleForFree: true }
    );
    expect(result.plans.map((p) => p.id)).toEqual(["free"]);
  });

  it("shows paid plans when not eligible for free", () => {
    const result = resolveListingPlansFromDocs(
      [
        doc("free", { tier: "country", targetIso: "IN", price: 0, version: 1 }),
        doc("paid", { tier: "country", targetIso: "IN", price: 299, version: 2 }),
      ],
      { homeIso: "IN", isEligibleForFree: false }
    );
    expect(result.plans.map((p) => p.id)).toEqual(["paid"]);
  });

  it("sorts by version descending", () => {
    const result = resolveListingPlansFromDocs(
      [
        doc("v1", { tier: "global", price: 10, version: 1 }),
        doc("v3", { tier: "global", price: 10, version: 3 }),
        doc("v2", { tier: "global", price: 10, version: 2 }),
      ],
      { homeIso: "IN", isEligibleForFree: false }
    );
    expect(result.plans.map((p) => p.id)).toEqual(["v3", "v2", "v1"]);
  });
});

import { describe, expect, it } from "vitest";
import { computeValuationBand } from "@/lib/sale/listing-comps";

describe("computeValuationBand", () => {
  it("returns quartile band from comp prices", () => {
    const band = computeValuationBand([4_000_000, 5_000_000, 6_000_000, 8_000_000], 1200);
    expect(band).not.toBeNull();
    expect(band!.sampleSize).toBe(4);
    expect(band!.low).toBeLessThanOrEqual(band!.mid);
    expect(band!.mid).toBeLessThanOrEqual(band!.high);
    expect(band!.perSqftMid).toBeGreaterThan(0);
  });

  it("returns null with fewer than 2 prices", () => {
    expect(computeValuationBand([5_000_000])).toBeNull();
    expect(computeValuationBand([])).toBeNull();
  });
});

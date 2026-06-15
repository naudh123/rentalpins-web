import { describe, expect, it } from "vitest";
import { computeValuationBand, saleCompsMapSearchHref } from "@/lib/sale/listing-comps";

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

describe("saleCompsMapSearchHref", () => {
  it("builds sale map URL with comp band filters", () => {
    const href = saleCompsMapSearchHref(30.7, 76.72, {
      priceMin: 4_500_000,
      priceMax: 8_000_000,
      bhk: "2 BHK",
      selectedId: "abc123",
    });
    expect(href).toContain("/buy/search");
    expect(href).not.toContain("transaction=sale");
    expect(href).toContain("category=Property");
    expect(href).toContain("priceMin=4500000");
    expect(href).toContain("priceMax=8000000");
    expect(href).toContain("bhk=2+BHK");
    expect(href).toContain("selected=abc123");
  });
});

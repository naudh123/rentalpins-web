import { describe, expect, it } from "vitest";
import {
  SEO_BRAND_SUFFIX,
  stripBrandSuffix,
  withBrandSuffix,
} from "@/lib/seo/metadata";

describe("seo metadata title helpers", () => {
  it("strips trailing brand suffix", () => {
    expect(stripBrandSuffix("Flats for Rent in India | RentalPins")).toBe(
      "Flats for Rent in India"
    );
    expect(stripBrandSuffix("Flats for Rent in India | rentalpins")).toBe(
      "Flats for Rent in India"
    );
  });

  it("adds brand suffix once", () => {
    expect(withBrandSuffix("Flats for Rent in India")).toBe(
      `Flats for Rent in India${SEO_BRAND_SUFFIX}`
    );
    expect(withBrandSuffix("Flats for Rent in India | RentalPins")).toBe(
      `Flats for Rent in India${SEO_BRAND_SUFFIX}`
    );
  });
});

describe("brand suffix is never doubled", () => {
  it("strips sub-brand segments before the template adds | RentalPins", async () => {
    const { stripBrandSuffix, withBrandSuffix } = await import("@/lib/seo/metadata");
    expect(stripBrandSuffix("Property for sale in Kharar | RentalPins Buy")).toBe("Property for sale in Kharar");
    expect(stripBrandSuffix("PropTech platform showcase | RentalPins for developers | RentalPins")).toBe("PropTech platform showcase");
    expect(stripBrandSuffix("PG near LPU | RentalPins")).toBe("PG near LPU");
    expect(withBrandSuffix("New projects for sale | RentalPins Buy | RentalPins")).toBe("New projects for sale | RentalPins");
    expect(stripBrandSuffix("RentalPins vs NoBroker")).toBe("RentalPins vs NoBroker");
  });
});

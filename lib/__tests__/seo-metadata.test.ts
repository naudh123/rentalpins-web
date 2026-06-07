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

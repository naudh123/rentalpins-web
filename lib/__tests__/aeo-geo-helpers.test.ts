import { describe, expect, it } from "vitest";
import {
  formatListingPrice,
  isSuspiciousPropertyPrice,
  schemaOfferPrice,
} from "@/lib/listing-price";
import { isValidBlogImageUrl, resolveBlogImageUrl } from "@/lib/blog-image";
import {
  getProgrammaticPageIndexability,
  MIN_LISTINGS_FOR_INDEXABLE_AREA_CATEGORY,
} from "@/lib/seo/programmatic-indexability";

describe("listing-price", () => {
  it("formats property rent with full locale, not misleading K suffix", () => {
    const label = formatListingPrice({
      price: 13000,
      priceUnit: "per month",
      category: "Property",
      homeIso: "IN",
    });
    expect(label).toContain("13");
    expect(label).not.toMatch(/1\.3K/i);
  });

  it("flags suspicious low property rent", () => {
    expect(
      isSuspiciousPropertyPrice({
        price: 1200,
        priceUnit: "per month",
        category: "Property",
        homeIso: "IN",
      })
    ).toBe(true);
  });

  it("omits suspicious prices from schema offers", () => {
    expect(
      schemaOfferPrice({
        price: 500,
        priceUnit: "per month",
        category: "Property",
        homeIso: "IN",
      })
    ).toBeUndefined();
  });

  it("does not apply property thresholds to equipment", () => {
    expect(
      isSuspiciousPropertyPrice({
        price: 200,
        priceUnit: "per day",
        category: "Construction Equipment",
        homeIso: "IN",
      })
    ).toBe(false);
  });
});

describe("blog-image", () => {
  it("rejects gemini and chatgpt URLs", () => {
    expect(isValidBlogImageUrl("https://gemini.google.com/share/abc")).toBe(false);
    expect(isValidBlogImageUrl("https://chatgpt.com/")).toBe(false);
  });

  it("falls back for invalid covers", () => {
    expect(resolveBlogImageUrl("")).toBe("/images/blog/rentalpins-default-og.jpg");
  });
});

describe("programmatic-indexability", () => {
  it("indexes city-level pages", () => {
    const policy = getProgrammaticPageIndexability({
      isCityLevel: true,
      listingCount: 0,
      hasUniqueContent: false,
    });
    expect(policy.includeInSitemap).toBe(true);
    expect(policy.robots).toEqual({ index: true, follow: true });
  });

  it("noindexes thin area pages", () => {
    const policy = getProgrammaticPageIndexability({
      listingCount: MIN_LISTINGS_FOR_INDEXABLE_AREA_CATEGORY - 1,
      hasUniqueContent: false,
    });
    expect(policy.includeInSitemap).toBe(false);
    expect(policy.robots).toEqual({ index: false, follow: true });
  });
});

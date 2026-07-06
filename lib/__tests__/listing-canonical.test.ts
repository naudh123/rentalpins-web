import { describe, expect, it } from "vitest";
import {
  buildListingNavigationQuery,
  cleanedListingSearchParams,
  listingCanonicalAbsoluteUrl,
  listingPathNeedsSeoQueryCleanup,
  listingSlugNeedsRedirect,
} from "@/lib/listing-canonical";
import { buildSeoSlugSegment } from "@/lib/seo/listing-seo";

const sampleListing = {
  id: "TL5GclYimIKzQMTO0kzW",
  title: "Fully Furnished 2BHK Apartment for Rent in Sector 70",
  locationName: "Sector 70, Mohali",
  lat: 30.7046,
  lng: 76.7179,
  category: "Property",
  subCategory: "Flat",
};

describe("listing-canonical", () => {
  it("builds absolute canonical URL under segmented property path", () => {
    const slug = buildSeoSlugSegment(sampleListing);
    expect(listingCanonicalAbsoluteUrl(sampleListing)).toBe(
      `https://www.rentalpins.com/rentals/property/${slug}`
    );
  });

  it("routes sale listings to /buy/property canonical", () => {
    const slug = buildSeoSlugSegment({ ...sampleListing, transactionType: "sale" });
    expect(
      listingCanonicalAbsoluteUrl({ ...sampleListing, transactionType: "sale" })
    ).toBe(`https://www.rentalpins.com/buy/property/${slug}`);
  });

  it("buildListingNavigationQuery no longer appends from param", () => {
    expect(
      buildListingNavigationQuery({
        from: "/search",
        utm_source: "google",
      })
    ).toBe("");
  });

  it("strips from and tracking params from listing URLs", () => {
    const params = new URLSearchParams("utm_source=google&from=%2Fsearch");
    expect(listingPathNeedsSeoQueryCleanup(params)).toBe(true);
    expect(cleanedListingSearchParams(params).toString()).toBe("");
  });

  it("treats from-only query as needing cleanup", () => {
    const params = new URLSearchParams("from=%2Fsearch");
    expect(listingPathNeedsSeoQueryCleanup(params)).toBe(true);
    expect(cleanedListingSearchParams(params).toString()).toBe("");
  });

  it("detects wrong slug and ID-only paths needing 308 redirect", () => {
    const slug = buildSeoSlugSegment(sampleListing);
    expect(listingSlugNeedsRedirect(slug, sampleListing)).toBe(false);
    expect(listingSlugNeedsRedirect(sampleListing.id, sampleListing)).toBe(true);
    expect(listingSlugNeedsRedirect(`${slug}-wrong`, sampleListing)).toBe(true);
  });
});

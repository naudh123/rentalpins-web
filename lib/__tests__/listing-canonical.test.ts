import { describe, expect, it } from "vitest";
import {
  buildListingNavigationQuery,
  cleanedListingSearchParams,
  listingCanonicalAbsoluteUrl,
  listingPathNeedsSeoQueryCleanup,
  listingSlugNeedsRedirect,
} from "@/lib/listing-canonical";
import { buildListingSlugSegment } from "@/lib/listing-slug";

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
  it("builds absolute canonical URL with SEO slug", () => {
    const slug = buildListingSlugSegment(sampleListing);
    expect(listingCanonicalAbsoluteUrl(sampleListing)).toBe(
      `https://www.rentalpins.com/listings/${slug}`
    );
  });

  it("routes sale listings to /buy/listings canonical", () => {
    const slug = buildListingSlugSegment({ ...sampleListing, transactionType: "sale" });
    expect(
      listingCanonicalAbsoluteUrl({ ...sampleListing, transactionType: "sale" })
    ).toBe(`https://www.rentalpins.com/buy/listings/${slug}`);
  });

  it("preserves only from in navigation query", () => {
    expect(
      buildListingNavigationQuery({
        from: "/search",
        utm_source: "google",
        gclid: "abc",
      })
    ).toBe("?from=%2Fsearch");
  });

  it("detects tracking params that should be stripped", () => {
    const params = new URLSearchParams("utm_source=google&from=%2Fsearch");
    expect(listingPathNeedsSeoQueryCleanup(params)).toBe(true);
  });

  it("keeps clean from-only query", () => {
    const params = new URLSearchParams("from=%2Fsearch");
    expect(listingPathNeedsSeoQueryCleanup(params)).toBe(false);
    expect(cleanedListingSearchParams(params).toString()).toBe("from=%2Fsearch");
  });

  it("detects wrong slug and ID-only paths needing 308 redirect", () => {
    const slug = buildListingSlugSegment(sampleListing);
    expect(listingSlugNeedsRedirect(slug, sampleListing)).toBe(false);
    expect(listingSlugNeedsRedirect(sampleListing.id, sampleListing)).toBe(true);
    expect(listingSlugNeedsRedirect(`${slug}-wrong`, sampleListing)).toBe(true);
  });
});

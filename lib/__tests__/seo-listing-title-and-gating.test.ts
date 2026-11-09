import { describe, expect, it } from "vitest";
import { listingSearchTitle } from "@/lib/listing-share-meta-copy";
import { listingShareMetadata } from "@/lib/listing-share";
import { joinPlaceLabel } from "@/lib/seo/listing-seo";
import { getProgrammaticPageIndexability } from "@/lib/seo/programmatic-indexability";
import {
  isInventoryGatedCountry,
  robotsForInventoryGatedHub,
} from "@/lib/seo/indexing-policy";
import type { ListingDetail } from "@/lib/types/listing";

const base: ListingDetail = {
  id: "Vf8D1t5jDRoBMWrIhNUV",
  title: "Charming 2BHK House for Rent in Prime Location",
  description: "Discover this charming 2BHK house available for rent near the school.",
  price: 12000,
  priceUnit: "/ month",
  category: "Property",
  subCategory: "House",
  locationName: "Sector 14, Udaipur",
  imageUrl: "",
  lat: 24.58,
  lng: 73.71,
  isPromoted: false,
  viewsCount: 0,
  inquiryCount: 0,
  ownerPhone: "+919999999999",
  createdAt: "",
  updatedAt: "",
  imageUrls: [],
  ownerUid: "u1",
};

describe("listingSearchTitle", () => {
  it("leads with type and place instead of the owner's marketing copy", () => {
    const title = listingSearchTitle(base);
    expect(title).toMatch(/for Rent in Sector 14, Udaipur/);
    expect(title).not.toMatch(/Prime Location/);
  });

  it("keeps the owner's title for social previews", () => {
    const meta = listingShareMetadata(base);
    expect(String(meta.title)).toMatch(/Udaipur/);
    expect(String(meta.openGraph?.title)).toMatch(/Charming 2BHK/);
  });

  it("falls back to the share title when there is no usable place", () => {
    const title = listingSearchTitle({ ...base, locationName: "", lat: 0, lng: 0 });
    expect(title).toMatch(/Charming 2BHK/);
  });
});

describe("joinPlaceLabel", () => {
  it("removes repeated and placeholder place names", () => {
    expect(joinPlaceLabel("Bengaluru Metro", "Bengaluru Metro")).toBe("Bengaluru Metro");
    expect(joinPlaceLabel("Location set", "")).toBe("");
    expect(joinPlaceLabel("Sector 70", "Mohali")).toBe("Sector 70, Mohali");
  });
});

describe("inventory-gated countries", () => {
  it("gates non-India hubs only", () => {
    expect(isInventoryGatedCountry("in")).toBe(false);
    expect(isInventoryGatedCountry("uk")).toBe(true);
    expect(isInventoryGatedCountry("ke")).toBe(true);
  });

  it("noindexes gated hubs until they have 3 listings", () => {
    expect(robotsForInventoryGatedHub(0)).toEqual({ index: false, follow: true });
    expect(robotsForInventoryGatedHub(3)).toEqual({ index: true, follow: true });
  });

  it("ignores template copy for gated areas but not for Indian areas", () => {
    const gated = getProgrammaticPageIndexability({
      countrySlug: "uk",
      listingCount: 0,
      hasUniqueContent: true,
    });
    expect(gated.includeInSitemap).toBe(false);

    const gatedCity = getProgrammaticPageIndexability({
      countrySlug: "uk",
      isCityLevel: true,
      listingCount: 1,
      hasUniqueContent: true,
    });
    expect(gatedCity.robots).toEqual({ index: false, follow: true });

    const indian = getProgrammaticPageIndexability({
      countrySlug: "in",
      listingCount: 0,
      hasUniqueContent: true,
    });
    expect(indian.includeInSitemap).toBe(true);
  });
});

import { composeMetaDescription } from "@/lib/seo";
import { buildSeoDescription, buildSeoTitle, rentFromLabel } from "@/lib/seo/seoData";
import type { SeoEntity } from "@/lib/seo/seoTypes";

describe("composeMetaDescription", () => {
  it("drops repeated sentences and stays under 158 chars", () => {
    const d = composeMetaDescription([
      "Find flats in Bengaluru on one live map. Contact owners directly on RentalPins.",
      "Contact owners directly on RentalPins.",
      "No broker fee.",
    ]);
    expect(d.match(/Contact owners directly/g)).toHaveLength(1);
    expect(d.length).toBeLessThanOrEqual(158);
  });
});

describe("university SEO copy", () => {
  const entity = {
    type: "university_pg",
    slug: "chandigarh-university",
    name: "Chandigarh University",
    rentRange: "₹5,000–₹14,000",
    indexable: true,
  } as unknown as SeoEntity;

  it("puts the starting rent in the title", () => {
    expect(rentFromLabel("₹5,000–₹14,000")).toBe("₹5,000");
    expect(buildSeoTitle(entity)).toBe("PG Near Chandigarh University from ₹5,000 | Boys & Girls");
  });

  it("leads the description with live count and rent", () => {
    const d = buildSeoDescription(entity, 24);
    expect(d.startsWith("24+ live PGs near Chandigarh University")).toBe(true);
    expect(d).toContain("₹5,000–₹14,000");
    expect(d.length).toBeLessThanOrEqual(158);
  });
});

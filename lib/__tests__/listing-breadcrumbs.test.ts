import { describe, expect, it } from "vitest";
import { buildListingBreadcrumbs } from "@/lib/listing-breadcrumbs";
import type { ListingDetail } from "@/lib/types/listing";

function baseListing(overrides: Partial<ListingDetail>): ListingDetail {
  return {
    id: "abc12345",
    title: "2 BHK House in Sector 22 Chandigarh",
    description: "Spacious house available for rent.",
    price: 25000,
    priceUnit: "per month",
    category: "Property",
    subCategory: "House",
    locationName: "Sector 22, Chandigarh",
    imageUrl: "",
    lat: 30.7333,
    lng: 76.7794,
    isPromoted: false,
    viewsCount: 0,
    inquiryCount: 0,
    ownerPhone: "",
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
    imageUrls: [],
    ownerUid: "owner1",
    ...overrides,
  };
}

describe("buildListingBreadcrumbs", () => {
  it("builds city and category crumbs for property listings", () => {
    const { schema, ui } = buildListingBreadcrumbs(
      baseListing({}),
      "https://www.rentalpins.com/listings/test"
    );

    expect(schema.map((item) => item.name)).toEqual([
      "Home",
      "Rentals",
      "Chandigarh Tricity",
      "Mohali",
      "Houses & Villas",
      "2 BHK House in Sector 22 Chandigarh",
    ]);
    expect(ui.some((item) => item.label === "Mohali" && item.href)).toBe(true);
    expect(ui.some((item) => item.label === "Houses & Villas" && item.href)).toBe(true);
  });

  it("includes city and category without area when coords are unavailable", () => {
    const { schema } = buildListingBreadcrumbs(
      baseListing({
        lat: 0,
        lng: 0,
        locationName: "Sector 22, Chandigarh",
      }),
      "https://www.rentalpins.com/listings/test"
    );

    expect(schema.map((item) => item.name)).toEqual([
      "Home",
      "Rentals",
      "Chandigarh Tricity",
      "Houses & Villas",
      "2 BHK House in Sector 22 Chandigarh",
    ]);
  });

  it("falls back to rentals root when location cannot be resolved", () => {
    const { schema } = buildListingBreadcrumbs(
      baseListing({
        lat: 0,
        lng: 0,
        locationName: "",
      }),
      "https://www.rentalpins.com/listings/test"
    );

    expect(schema.map((item) => item.name)).toEqual([
      "Home",
      "Rentals",
      "2 BHK House in Sector 22 Chandigarh",
    ]);
  });
});

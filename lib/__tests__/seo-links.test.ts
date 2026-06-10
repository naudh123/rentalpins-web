import { describe, expect, it } from "vitest";
import {
  getBrowseHref,
  getListPropertyHref,
  intentFromCategorySlug,
  intentFromMarketingSlug,
  slugsFromRentalHubHref,
} from "@/lib/seo-links";

describe("getBrowseHref", () => {
  it("returns map search with geo when lat/lng provided", () => {
    const href = getBrowseHref({ lat: 30.7, lng: 76.7, zoom: 12 });
    expect(href).toContain("/search?");
    expect(href).toContain("lat=");
    expect(href).toContain("lng=");
  });

  it("falls back to place query search", () => {
    const href = getBrowseHref({ placeQuery: "Mohali" });
    expect(href).toContain("/search?");
    expect(href).toContain("place=Mohali");
  });

  it("returns plain search when no options", () => {
    expect(getBrowseHref()).toMatch(/\/search$/);
  });
});

describe("getListPropertyHref", () => {
  it("points to post flow", () => {
    expect(getListPropertyHref({ citySlug: "mohali", intent: "pg" })).toMatch(/\/post$/);
  });
});

describe("intentFromCategorySlug", () => {
  it("maps known category slugs", () => {
    expect(intentFromCategorySlug("pg")).toBe("pg");
    expect(intentFromCategorySlug("shops")).toBe("shop");
    expect(intentFromCategorySlug("offices")).toBe("office");
    expect(intentFromCategorySlug("warehouses")).toBe("warehouse");
    expect(intentFromCategorySlug("flats")).toBe("property");
  });

  it("defaults to property", () => {
    expect(intentFromCategorySlug("unknown")).toBe("property");
  });
});

describe("intentFromMarketingSlug", () => {
  it("detects intent from marketing slug keywords", () => {
    expect(intentFromMarketingSlug("pg-near-chandigarh-university")).toBe("pg");
    expect(intentFromMarketingSlug("hostel-near-cu")).toBe("hostel");
    expect(intentFromMarketingSlug("office-for-rent-delhi")).toBe("office");
    expect(intentFromMarketingSlug("shop-for-rent-mumbai")).toBe("shop");
    expect(intentFromMarketingSlug("warehouse-godown-noida")).toBe("warehouse");
    expect(intentFromMarketingSlug("vehicle-rental-india")).toBe("vehicle");
    expect(intentFromMarketingSlug("equipment-rental")).toBe("equipment");
    expect(intentFromMarketingSlug("flats-for-rent-mohali")).toBe("property");
  });
});

describe("slugsFromRentalHubHref", () => {
  it("parses standalone city hub paths", () => {
    expect(slugsFromRentalHubHref("/rentals/in/ludhiana")).toEqual({
      citySlug: "ludhiana",
      areaSlug: undefined,
    });
  });

  it("parses area-under-parent-city hub paths", () => {
    expect(slugsFromRentalHubHref("/rentals/in/chandigarh/kharar")).toEqual({
      citySlug: "kharar",
      areaSlug: undefined,
    });
  });

  it("parses sub-area hub paths", () => {
    expect(
      slugsFromRentalHubHref("/rentals/in/chandigarh/mohali/sector-70")
    ).toEqual({
      citySlug: "mohali",
      areaSlug: "sector-70",
    });
  });
});

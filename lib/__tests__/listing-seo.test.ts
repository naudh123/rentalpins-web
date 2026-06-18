import { describe, expect, it } from "vitest";
import {
  normalizeListingSeo,
  buildListingCanonicalPath,
  buildListingCanonicalUrl,
} from "@/lib/seo/listing-seo";
import { resolveListingCategorySegment } from "@/lib/seo/listing-category-segments";

const propertyRental = {
  id: "TL5GclYimIKzQMTO0kzW",
  title: "2 BHK SEMI FURNISHED",
  locationName: "Sector 80, Mohali",
  lat: 30.7046,
  lng: 76.7179,
  category: "Property",
  subCategory: "Apartments / Flats",
  attributes: { bhk: "2BHK", furnishing: "Semi-furnished" },
};

const equipmentRental = {
  id: "Eq1palleScaffold12345",
  title: "palle",
  locationName: "Mohali",
  lat: 30.7,
  lng: 76.72,
  category: "Construction Equipment",
  subCategory: "Scaffolding",
};

const propertySale = {
  ...propertyRental,
  id: "SaleProp12345678901",
  title: "3 BHK Villa for Sale",
  locationName: "New Chandigarh, Mohali",
  transactionType: "sale" as const,
  subCategory: "Villas",
  attributes: { bhk: "3BHK" },
};

describe("normalizeListingSeo", () => {
  it("rewrites weak property rental title with locality", () => {
    const seo = normalizeListingSeo(propertyRental);
    expect(seo.seoTitle).toMatch(/2 BHK/i);
    expect(seo.seoTitle).toMatch(/Mohali/i);
    expect(seo.seoTitle).toMatch(/Rent/i);
    expect(seo.seoDescription).toMatch(/Sector 80/i);
    expect(seo.categorySegment).toBe("property");
  });

  it("expands equipment slang like palle", () => {
    const seo = normalizeListingSeo(equipmentRental);
    expect(seo.seoTitle).toMatch(/Scaffolding|Palle/i);
    expect(seo.seoTitle).toMatch(/Mohali/i);
    expect(seo.categorySegment).toBe("equipment");
  });

  it("builds sale property canonical under /buy/property/", () => {
    const path = buildListingCanonicalPath(propertySale);
    expect(path).toMatch(/^\/buy\/property\//);
    expect(buildListingCanonicalUrl(propertySale)).toContain("www.rentalpins.com/buy/property/");
  });

  it("builds rental property canonical under /rentals/property/", () => {
    const path = buildListingCanonicalPath(propertyRental);
    expect(path).toMatch(/^\/rentals\/property\//);
    expect(path).toContain(propertyRental.id);
  });

  it("falls back to /listings/ for uncategorized inventory", () => {
    const misc = {
      id: "MiscItem1234567890",
      title: "misc item",
      locationName: "Mohali",
      lat: 30.7,
      lng: 76.72,
      category: "Others",
      subCategory: "Miscellaneous",
    };
    expect(resolveListingCategorySegment(misc)).toBeNull();
    expect(buildListingCanonicalPath(misc)).toMatch(/^\/listings\//);
  });
});

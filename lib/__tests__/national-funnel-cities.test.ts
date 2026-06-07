import { describe, expect, it } from "vitest";
import {
  getNationalFunnelCities,
  nationalFunnelSectionTitle,
} from "@/lib/seo/national-funnel-cities";

describe("getNationalFunnelCities", () => {
  it("lists priority markets first for flats", () => {
    const cities = getNationalFunnelCities("flats");
    expect(cities.slice(0, 5).map((c) => c.name)).toEqual([
      "Chandigarh Tricity",
      "Mohali",
      "Kharar",
      "Ludhiana",
      "Delhi NCR",
    ]);
  });

  it("links Mohali flats to the area category hub", () => {
    const mohali = getNationalFunnelCities("flats").find((c) => c.name === "Mohali");
    expect(mohali?.primaryHref).toContain("/rentals/in/chandigarh/mohali/flats");
    expect(mohali?.hubHref).toContain("/rentals/in/chandigarh/mohali");
  });

  it("uses broker landing pages for property funnel where available", () => {
    const chandigarh = getNationalFunnelCities("property").find(
      (c) => c.name === "Chandigarh Tricity"
    );
    expect(chandigarh?.primaryHref).toContain("/property-without-broker-chandigarh");
    expect(chandigarh?.hubHref).toContain("/rentals/in/chandigarh");
  });

  it("includes secondary live Indian cities", () => {
    const names = getNationalFunnelCities("houses").map((c) => c.name);
    expect(names.some((name) => name.includes("Jaipur") || name.includes("Mumbai"))).toBe(
      true
    );
  });

  it("exposes section titles per funnel kind", () => {
    expect(nationalFunnelSectionTitle("flats")).toContain("Flats");
    expect(nationalFunnelSectionTitle("property")).toContain("broker");
  });
});

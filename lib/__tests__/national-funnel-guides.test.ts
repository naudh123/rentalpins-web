import { describe, expect, it } from "vitest";
import {
  getNationalFunnelBlogGuides,
  getNationalFunnelCityGuides,
} from "@/lib/seo/national-funnel-guides";
import { getNationalFunnelCities } from "@/lib/seo/national-funnel-cities";

describe("national funnel guides", () => {
  it("links priority cities to money-page SEO guide anchors", () => {
    const mohali = getNationalFunnelCities("flats").find((c) => c.name === "Mohali");
    expect(mohali?.seoGuideHref).toContain("#city-seo-content-heading");
    expect(mohali?.topBlogSlug).toBe("mohali-it-park-rental-guide");
  });

  it("returns five city guides for flats funnel", () => {
    const guides = getNationalFunnelCityGuides("property");
    expect(guides).toHaveLength(5);
    expect(guides.map((g) => g.placeName)).toContain("Delhi NCR");
  });

  it("dedupes blog guides across priority markets", () => {
    const guides = getNationalFunnelBlogGuides();
    const slugs = guides.map((post) => post.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    expect(slugs).toContain("delhi-rentals-without-broker-guide");
    expect(slugs.length).toBeGreaterThanOrEqual(5);
  });
});

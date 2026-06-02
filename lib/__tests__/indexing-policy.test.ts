import { describe, expect, it } from "vitest";
import { getCityBySlug, getLiveCities, getIndexableAreas } from "@/lib/cities-config";
import {
  canonicalForCity,
  robotsForCity,
  robotsForSearchPage,
} from "@/lib/seo/indexing-policy";

describe("indexing-policy", () => {
  it("excludes coming-soon cities from live sitemap helpers", () => {
    const slugs = getLiveCities().map((c) => c.slug);
    expect(slugs).not.toContain("ncr");
    expect(slugs).toContain("delhi");
  });

  it("noindex,nofollow coming-soon city hubs", () => {
    const ncr = getCityBySlug("in", "ncr");
    expect(ncr).toBeDefined();
    expect(robotsForCity(ncr!)).toEqual({ index: false, follow: false });
  });

  it("points NCR canonical to live Delhi hub", () => {
    const ncr = getCityBySlug("in", "ncr")!;
    expect(canonicalForCity(ncr)).toBe("https://www.rentalpins.com/rentals/in/delhi");
  });

  it("noindex map search URLs with viewport query params", () => {
    expect(robotsForSearchPage(true)).toEqual({ index: false, follow: true });
    expect(robotsForSearchPage(false)).toEqual({ index: true, follow: true });
  });

  it("indexable areas only under live cities", () => {
    const jasola = getIndexableAreas().find(
      (a) => a.parentSlug === "delhi" && a.slug === "jasola"
    );
    expect(jasola).toBeDefined();
  });
});

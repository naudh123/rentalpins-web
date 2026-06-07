import { describe, expect, it } from "vitest";
import { getIndexableAreas, getLiveCities } from "@/lib/cities-config";
import { listCitySeoConfigKeys } from "@/lib/seo/city-seo-config";
import {
  PRIORITY_BROKER_LANDING_SLUGS,
  PRIORITY_PG_LANDING_SLUGS,
} from "@/lib/seo/marketing-page-content";
import {
  getCoreMarketingSitemapSlugs,
  getPublicSitemapUrls,
} from "@/lib/seo/sitemap-config";

describe("sitemap coverage", () => {
  it("lists priority broker and PG landings in core sitemap slugs", () => {
    const slugs = new Set(getCoreMarketingSitemapSlugs());
    for (const slug of [
      ...PRIORITY_BROKER_LANDING_SLUGS,
      ...PRIORITY_PG_LANDING_SLUGS,
    ]) {
      expect(slugs.has(slug)).toBe(true);
    }
  });

  it("includes national funnels and money-page cities in child sitemaps", () => {
    const slugs = getCoreMarketingSitemapSlugs();
    expect(slugs).toContain("flats-for-rent");
    expect(slugs).toContain("houses-for-rent");
    expect(slugs).toContain("property-without-broker");

    const liveCitySlugs = new Set(getLiveCities().map((city) => city.slug));
    expect(liveCitySlugs.has("chandigarh")).toBe(true);
    expect(liveCitySlugs.has("ludhiana")).toBe(true);
    expect(liveCitySlugs.has("delhi")).toBe(true);

    const areaPaths = new Set(
      getIndexableAreas().map(
        (area) => `${area.parentSlug}/${area.slug}`
      )
    );
    expect(areaPaths.has("chandigarh/mohali")).toBe(true);
    expect(areaPaths.has("chandigarh/kharar")).toBe(true);
  });

  it("maps priority money-page keys to indexable city or area paths", () => {
    const liveCities = new Set(getLiveCities().map((c) => c.slug));
    const areas = new Set(
      getIndexableAreas().map((a) => `${a.parentSlug}/${a.slug}`)
    );

    for (const key of listCitySeoConfigKeys()) {
      const parts = key.split("/");
      if (parts.length === 2) {
        expect(liveCities.has(parts[1]!)).toBe(true);
      } else {
        expect(areas.has(`${parts[1]}/${parts[2]}`)).toBe(true);
      }
    }
  });

  it("exposes deduped public sitemap URLs for robots", () => {
    const urls = getPublicSitemapUrls();
    expect(new Set(urls).size).toBe(urls.length);
    expect(urls).toHaveLength(6);
    expect(urls.some((url) => url.endsWith("/sitemap.xml"))).toBe(true);
    expect(urls.some((url) => url.endsWith("/sitemap-localities.xml"))).toBe(
      true
    );
    expect(urls.some((url) => url.endsWith("/city-sitemap.xml"))).toBe(false);
  });
});

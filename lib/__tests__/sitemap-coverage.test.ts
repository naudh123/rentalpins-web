import { describe, expect, it } from "vitest";
import { getIndexableAreas, getLiveCities } from "@/lib/cities-config";
import { listCitySeoConfigKeys } from "@/lib/seo/city-seo-config";
import {
  PRIORITY_BROKER_LANDING_SLUGS,
  PRIORITY_PG_LANDING_SLUGS,
} from "@/lib/seo/marketing-page-content";
import {
  getCoreMarketingSitemapSlugs,
  getMandatoryRentalAreaSitemapPaths,
  getPublicSitemapUrls,
  getStaticRentalCityHubSitemapPaths,
} from "@/lib/seo/sitemap-config";
import { getInvestSitemapPaths } from "@/lib/invest/invest-sitemap";
import { getGeoPageSitemapPaths } from "@/lib/seo/geo-pages-config";
import { getDeveloperSitemapPaths } from "@/lib/seo/developers-config";

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

  it("includes protected static hubs and canonical rental areas in sitemap helpers", () => {
    expect(getStaticRentalCityHubSitemapPaths()).toContain("/rentals/chandigarh");
    expect(getMandatoryRentalAreaSitemapPaths()).toContain(
      "/rentals/in/chandigarh/banur"
    );
    expect(getMandatoryRentalAreaSitemapPaths()).toContain(
      "/rentals/in/chandigarh/landran"
    );
  });

  it("includes new campus PG and JLPL landings in core sitemap slugs", () => {
    const slugs = new Set(getCoreMarketingSitemapSlugs());
    for (const slug of [
      "pg-near-chitkara-university",
      "pg-near-isb-mohali",
      "pg-near-iiser-mohali",
      "accommodation-near-jlpl-industrial-area",
    ]) {
      expect(slugs.has(slug)).toBe(true);
    }
  });

  it("includes RentalPins Invest hub and tools in invest sitemap helper", () => {
    const paths = getInvestSitemapPaths();
    expect(paths).toContain("/invest");
    expect(paths).toContain("/invest/calculator");
    expect(paths).toContain("/invest/compare");
    expect(paths).not.toContain("/invest/shortlist");
    expect(paths).not.toContain("/invest/requirements/post");
  });

  it("includes new investment geo guides in geo sitemap paths", () => {
    const paths = getGeoPageSitemapPaths();
    expect(paths).toContain("/buy/zirakpur-investment-guide");
    expect(paths).toContain("/buy/aerocity-investment-guide");
    expect(paths).toContain("/rental-market-insights/mohali");
    expect(paths).toContain("/property-market-insights/chandigarh-tricity");
  });

  it("includes developer profile pages in developer sitemap helper", () => {
    const paths = getDeveloperSitemapPaths();
    expect(paths).toContain("/developers/green-valley-builders");
    expect(paths).toContain("/developers/tricity-builders");
  });

  it("exposes deduped public sitemap URLs for robots", () => {
    const urls = getPublicSitemapUrls();
    expect(new Set(urls).size).toBe(urls.length);
    expect(urls).toHaveLength(7);
    expect(urls.some((url) => url.endsWith("/sitemap.xml"))).toBe(true);
    expect(urls.some((url) => url.endsWith("/sitemap-localities.xml"))).toBe(
      true
    );
    expect(urls.some((url) => url.endsWith("/sitemap-projects.xml"))).toBe(
      true
    );
    expect(urls.some((url) => url.endsWith("/city-sitemap.xml"))).toBe(false);
  });
});

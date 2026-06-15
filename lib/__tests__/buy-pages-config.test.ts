import { describe, expect, it } from "vitest";
import {
  BUY_HUB_SLUGS,
  BUY_SUB_AREA_KEYS,
  getBuyHub,
  getBuyHubSitemapPaths,
  getBuyPageConfig,
  getBuySubAreaParams,
} from "@/lib/sale/buy-pages-config";
import { getSaleMarketingSlugs } from "@/lib/sale/sale-marketing-pages";
import { getListForSaleSitemapPaths } from "@/lib/sale/list-for-sale-config";

describe("buy-pages-config", () => {
  it("covers all Tricity launch hubs", () => {
    expect(BUY_HUB_SLUGS).toEqual(["mohali", "kharar", "zirakpur", "panchkula"]);
    for (const slug of BUY_HUB_SLUGS) {
      expect(getBuyHub(slug)).not.toBeNull();
    }
  });

  it("covers Mohali and Kharar sale sub-areas", () => {
    expect(BUY_SUB_AREA_KEYS).toContain("mohali/phase-7");
    expect(BUY_SUB_AREA_KEYS).toContain("mohali/aerocity");
    expect(BUY_SUB_AREA_KEYS).toContain("kharar/kharar-to-cu");
    expect(BUY_SUB_AREA_KEYS).toContain("kharar/kharar-to-kurali");
    expect(BUY_SUB_AREA_KEYS).toContain("kharar/kurali-to-siswan");
    expect(BUY_SUB_AREA_KEYS).toContain("mohali/new-chandigarh-sector-115");
    expect(getBuyPageConfig("kharar", "kharar-to-cu")?.placeQuery).toContain("University");
    expect(getBuyPageConfig("kharar", "kurali-to-siswan")?.placeQuery).toContain("Siswan");
    expect(BUY_SUB_AREA_KEYS).toContain("kharar/sector-125");
    expect(BUY_SUB_AREA_KEYS).toContain("kharar/sector-119");
    expect(BUY_SUB_AREA_KEYS).toContain("kharar/banur");
    expect(getBuyPageConfig("mohali", "phase-7")?.placeQuery).toBe("Phase 7, Mohali");
    expect(getBuyPageConfig("kharar", "sector-117")?.placeQuery).toContain("Banur");
    expect(getBuySubAreaParams()).toHaveLength(BUY_SUB_AREA_KEYS.length);
  });

  it("generates buy hub and sub-area sitemap paths", () => {
    const paths = getBuyHubSitemapPaths();
    expect(paths).toContain("/buy/mohali");
    expect(paths).toContain("/buy/mohali/phase-7");
    expect(paths).toContain("/buy/mohali/aerocity");
    expect(paths).toContain("/buy/kharar/chandigarh-university");
    expect(paths.length).toBe(BUY_HUB_SLUGS.length + BUY_SUB_AREA_KEYS.length);
  });

  it("includes sale marketing and list-for-sale sitemap paths", () => {
    const marketing = getSaleMarketingSlugs();
    expect(marketing).toContain("flats-for-sale");
    expect(marketing).toContain("property-for-sale-chandigarh");

    const listPaths = getListForSaleSitemapPaths();
    expect(listPaths).toContain("/list-for-sale");
    expect(listPaths).toContain("/list-for-sale/mohali");
  });
});

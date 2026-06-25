/**
 * Buy module core-flow contract tests.
 * Validates the five working verticals + map search data path.
 */
import { describe, expect, it } from "vitest";
import { listingDetailHref } from "@/lib/listing-links";
import { ownerListingEditPath } from "@/lib/listing-path";
import { listingSegmentBasePath } from "@/lib/seo/listing-category-segments";
import { buildListingCanonicalPath } from "@/lib/seo/listing-seo";
import { computeValuationBand, saleCompsMapSearchHref } from "@/lib/sale/listing-comps";
import {
  BUY_POST_PATH,
  BUY_SEARCH_PATH,
  isBuyAppPath,
} from "@/lib/sale/buy-app-paths";
import {
  BUY_HUB_SLUGS,
  getBuyHubSitemapPaths,
  getBuyPageConfig,
} from "@/lib/sale/buy-pages-config";
import { getSaleMarketingSlugs } from "@/lib/sale/sale-marketing-pages";
import { GEO_PAGES } from "@/lib/seo/geo-pages-config";
import { filterPostsByIndex } from "@/lib/blog-vertical";
import { getMdxPosts } from "@/lib/blog";
import {
  applyBuySearchDefaults,
  buildMapSearchUrl,
  clampBuyListingFilters,
  parseSearchUrlState,
} from "@/lib/search-url";
import { DEFAULT_LISTING_FILTERS } from "@/lib/listing-filters";

const sampleSaleListing = {
  id: "abc123xyz",
  title: "3 BHK flat for sale in Sector 70",
  locationName: "Sector 70, Mohali",
  lat: 30.7046,
  lng: 76.7179,
  category: "Property",
  subCategory: "Flat",
  transactionType: "sale" as const,
};

describe("buy core flows", () => {
  describe("1 — Discovery (/buy/search)", () => {
    it("forces sale + Property filters from any URL params", () => {
      const raw = parseSearchUrlState(
        new URLSearchParams({
          transaction: "rent",
          category: "PG",
          tenant: "Girls Only",
        })
      );
      const state = applyBuySearchDefaults(raw);
      expect(state.filters.transactionType).toBe("sale");
      expect(state.filters.category).toBe("Property");
      expect(state.filters.tenantPreference).toBe("");
    });

    it("clamps filter changes on buy map", () => {
      const clamped = clampBuyListingFilters({
        ...DEFAULT_LISTING_FILTERS,
        transactionType: "rent",
        category: "Vehicles",
        tenantPreference: "Family",
      });
      expect(clamped.transactionType).toBe("sale");
      expect(clamped.category).toBe("Property");
      expect(clamped.tenantPreference).toBe("");
    });

    it("builds shareable buy map URLs without transaction query param", () => {
      const href = buildMapSearchUrl({
        filters: { ...DEFAULT_LISTING_FILTERS, transactionType: "sale", category: "Property" },
        centerLat: 30.7333,
        centerLng: 76.7794,
        zoom: 12,
        bounds: null,
        placeQuery: "Mohali",
        keywords: null,
        selectedId: null,
        drawnArea: null,
      });
      expect(href.startsWith(`${BUY_SEARCH_PATH}?`)).toBe(true);
      expect(href).not.toContain("transaction=");
      expect(href).toContain("category=Property");
    });

    it("recognises buy app paths for SaleShell routing", () => {
      expect(isBuyAppPath(BUY_SEARCH_PATH)).toBe(true);
      expect(isBuyAppPath("/flats-for-sale")).toBe(true);
      expect(isBuyAppPath("/search")).toBe(false);
    });
  });

  describe("2 — Listing detail (/buy/property/[slug])", () => {
    it("routes sale property listings to /buy/property canonical", () => {
      expect(listingSegmentBasePath("property", "sale")).toBe("/buy/property");
      const path = buildListingCanonicalPath(sampleSaleListing);
      expect(path.startsWith("/buy/property/")).toBe(true);
    });

    it("builds map card hrefs to buy property detail", () => {
      const href = listingDetailHref(sampleSaleListing, "/buy/search?lat=30.7");
      expect(href).toContain("/buy/property/");
      expect(href).toContain("from=%2Fbuy%2Fsearch");
    });

    it("computes valuation band from comparable prices", () => {
      const band = computeValuationBand(
        [4_500_000, 5_200_000, 5_800_000, 6_500_000],
        1500
      );
      expect(band).not.toBeNull();
      expect(band!.sampleSize).toBe(4);
      expect(band!.perSqftMid).toBeGreaterThan(0);
    });

    it("links comps back to buy map with price band filters", () => {
      const href = saleCompsMapSearchHref(30.7, 76.72, {
        priceMin: 4_000_000,
        priceMax: 7_000_000,
        bhk: "3 BHK",
      });
      expect(href).toContain(BUY_SEARCH_PATH);
      expect(href).toContain("priceMin=4000000");
      expect(href).toContain("bhk=3+BHK");
    });
  });

  describe("3 — Seller flow (/buy/post)", () => {
    it("routes sale listing edits to /buy/post", () => {
      expect(ownerListingEditPath({ id: "abc123", transactionType: "sale" })).toContain(
        BUY_POST_PATH
      );
      expect(ownerListingEditPath({ id: "abc123", transactionType: "sale" })).toContain(
        "listingId=abc123"
      );
    });

    it("keeps rent listing edits on /post", () => {
      expect(ownerListingEditPath({ id: "abc123", transactionType: "rent" })).toContain("/post?");
      expect(ownerListingEditPath({ id: "abc123", transactionType: "rent" })).not.toContain(
        "/buy/post"
      );
    });
  });

  describe("4 — SEO surface (hubs + marketing funnels)", () => {
    it("covers all Tricity launch hubs with page config", () => {
      expect(BUY_HUB_SLUGS).toHaveLength(4);
      for (const hub of BUY_HUB_SLUGS) {
        const config = getBuyPageConfig(hub);
        expect(config).not.toBeNull();
        expect(config!.mapCenter.lat).toBeGreaterThan(0);
        expect(config!.faqs.length).toBeGreaterThan(0);
      }
    });

    it("generates sitemap paths for hubs and sub-areas", () => {
      const paths = getBuyHubSitemapPaths();
      expect(paths.length).toBeGreaterThan(30);
      expect(paths).toContain("/buy/mohali");
      expect(paths).toContain("/buy/mohali/phase-7");
    });

    it("registers sale marketing funnel slugs", () => {
      const slugs = getSaleMarketingSlugs();
      expect(slugs).toContain("flats-for-sale");
      expect(slugs).toContain("property-for-sale");
      expect(slugs).toContain("property-for-sale-chandigarh");
      expect(slugs).toContain("property-for-sale-mohali");
    });
  });

  describe("5 — Content (/blog/buy + investment guides)", () => {
    it("includes buy investment guide geo pages", () => {
      const paths = GEO_PAGES.map((p) => p.path);
      expect(paths).toContain("/buy/mohali-investment-guide");
      expect(paths).toContain("/buy/new-chandigarh-investment-guide");
    });

    it("has buy-vertical blog posts for /blog/buy index", () => {
      const posts = getMdxPosts();
      const buyPosts = filterPostsByIndex(posts, "buy");
      expect(buyPosts.length).toBeGreaterThan(0);
      expect(buyPosts.some((p) => p.slug.includes("buy") || p.slug.includes("sale"))).toBe(true);
    });
  });

  describe("data flow — map search → property detail", () => {
    it("round-trips buy search state through URL defaults", () => {
      const params = new URLSearchParams({
        lat: "30.7333",
        lng: "76.7794",
        zoom: "12",
        category: "All",
        priceMin: "3000000",
        bhk: "2 BHK",
      });
      const state = applyBuySearchDefaults(parseSearchUrlState(params));
      expect(state.filters.transactionType).toBe("sale");
      expect(state.filters.category).toBe("Property");
      expect(state.filters.priceMin).toBe(3_000_000);
      expect(state.filters.bhk).toBe("2 BHK");
      expect(state.centerLat).toBeCloseTo(30.7333);

      const mapUrl = buildMapSearchUrl(state);
      expect(mapUrl).toContain(BUY_SEARCH_PATH);
      expect(mapUrl).toContain("priceMin=3000000");
    });

    it("connects map listing card to buy property detail path", () => {
      const mapReturn = `${BUY_SEARCH_PATH}?lat=30.7333&lng=76.7794&selected=abc123xyz`;
      const detailHref = listingDetailHref(sampleSaleListing, mapReturn);
      expect(detailHref).toMatch(/\/buy\/property\/.+/);
      expect(detailHref).toContain("from=");
    });
  });
});

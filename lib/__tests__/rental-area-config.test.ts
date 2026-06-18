import { describe, expect, it } from "vitest";
import {
  getIndianGscSitemapPaths,
  getIndianRentalPageConfig,
  INDIAN_GSC_HUB_SLUGS,
  INDIAN_GSC_PAGE_KEYS,
  INDIAN_RENTAL_GROWTH_NOTICE,
  indianRentalMapHref,
  indianRentalPagePath,
  indianRentalPostHref,
  isIndianGscRentalPath,
} from "@/lib/rental-area-config";

const FAKE_COUNT_PATTERN =
  /\b\d{1,3}(,\d{3})+\+?\s*(listings|users|downloads|verified)\b/i;

const REQUIRED_ROUTES = [
  "/rentals/mohali",
  "/rentals/mohali/sector-70",
  "/rentals/mohali/sector-67",
  "/rentals/mohali/phase-7",
  "/rentals/kharar",
  "/rentals/kharar/chandigarh-university",
  "/rentals/chandigarh-university",
  "/rentals/zirakpur",
  "/rentals/delhi",
  "/rentals/delhi/mukherjee-nagar",
  "/rentals/delhi/gtb-nagar",
  "/rentals/delhi/dwarka",
  "/rentals/delhi/hudson-lane",
  "/rentals/jaipur",
  "/rentals/jaipur/malviya-nagar",
  "/rentals/jaipur/vaishali-nagar",
  "/rentals/jaipur/mansarovar",
  "/rentals/jaipur/jagatpura",
  "/rentals/jaipur/c-scheme",
  "/rentals/jaipur/raja-park",
  "/rentals/jaipur/sitapura",
  "/rentals/jaipur/tonk-road",
  "/rentals/jaipur/bani-park",
  "/rentals/jaipur/vidhyadhar-nagar",
] as const;

describe("rental area config (India GSC)", () => {
  it("defines all required GSC routes", () => {
    expect(INDIAN_GSC_PAGE_KEYS).toHaveLength(24);
    expect(getIndianGscSitemapPaths().sort()).toEqual(
      [...REQUIRED_ROUTES].sort()
    );
  });

  it("recognises short GSC paths for middleware", () => {
    for (const path of REQUIRED_ROUTES) {
      expect(isIndianGscRentalPath(path)).toBe(true);
    }
    expect(isIndianGscRentalPath("/rentals/in/chandigarh/mohali")).toBe(false);
    expect(isIndianGscRentalPath("/rentals/ludhiana")).toBe(false);
  });

  it("does not redirect delhi hub via legacy matcher when flagged", () => {
    expect(isIndianGscRentalPath("/rentals/delhi")).toBe(true);
    expect(isIndianGscRentalPath("/rentals/delhi/mukherjee-nagar")).toBe(true);
  });

  it("resolves hub and sub-area configs with GSC intent copy", () => {
    const mohali = getIndianRentalPageConfig("mohali")!;
    expect(mohali.h1).toMatch(/Mohali/i);
    expect(mohali.faqs.length).toBeGreaterThanOrEqual(5);

    const cu = getIndianRentalPageConfig("kharar", "chandigarh-university")!;
    expect(cu.h1).toMatch(/Chandigarh University/i);

    const muk = getIndianRentalPageConfig("delhi", "mukherjee-nagar")!;
    expect(muk.h1).toMatch(/Mukherjee Nagar/i);

    const malviya = getIndianRentalPageConfig("jaipur", "malviya-nagar")!;
    expect(malviya.h1).toMatch(/Malviya Nagar/i);
  });

  it("keeps nearby links within GSC registry", () => {
    for (const pageKey of INDIAN_GSC_PAGE_KEYS) {
      const slash = pageKey.indexOf("/");
      const hub = slash === -1 ? pageKey : pageKey.slice(0, slash);
      const area = slash === -1 ? undefined : pageKey.slice(slash + 1);
      const config = getIndianRentalPageConfig(hub, area)!;
      for (const link of config.nearbyAreas) {
        expect(INDIAN_GSC_HUB_SLUGS).toContain(link.hubSlug);
        if (link.areaSlug) {
          expect(
            getIndianRentalPageConfig(link.hubSlug, link.areaSlug)
          ).not.toBeNull();
        } else {
          expect(getIndianRentalPageConfig(link.hubSlug)).not.toBeNull();
        }
      }
    }
  });

  it("avoids fake inventory claims", () => {
    const blobs = [INDIAN_RENTAL_GROWTH_NOTICE];
    for (const pageKey of INDIAN_GSC_PAGE_KEYS) {
      const slash = pageKey.indexOf("/");
      const hub = slash === -1 ? pageKey : pageKey.slice(0, slash);
      const area = slash === -1 ? undefined : pageKey.slice(slash + 1);
      const config = getIndianRentalPageConfig(hub, area)!;
      blobs.push(config.intro, ...config.faqs.map((f) => f.a));
    }
    for (const text of blobs) {
      expect(text).not.toMatch(FAKE_COUNT_PATTERN);
    }
  });

  it("builds map and post CTA hrefs with tracking slugs", () => {
    const config = getIndianRentalPageConfig("mohali", "phase-7")!;
    expect(indianRentalPagePath("mohali", "phase-7")).toBe(
      "/rentals/mohali/phase-7"
    );
    expect(indianRentalMapHref(config)).toContain("/search");
    expect(indianRentalMapHref(config)).toContain("Phase");
    expect(indianRentalPostHref()).toContain("/post");
  });
});

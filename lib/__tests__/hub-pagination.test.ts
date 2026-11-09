import { describe, expect, it, vi } from "vitest";

vi.mock("next/cache", () => ({
  unstable_cache: <T extends (...args: never[]) => unknown>(fn: T) => fn,
}));

import {
  HUB_MAX_PAGES,
  HUB_PAGE_SIZE,
  hubPagePath,
  parseHubPageParam,
  sliceHubPage,
} from "@/lib/seo/hub-pagination";
import { resolveNearestLiveCity } from "@/lib/listing-breadcrumbs";
import type { SeoListingCard } from "@/lib/seo-listings";

const listings = (n: number): SeoListingCard[] =>
  Array.from({ length: n }, (_, i) => ({ id: `id${i}` }) as SeoListingCard);

describe("sliceHubPage", () => {
  it("splits inventory into pages of HUB_PAGE_SIZE", () => {
    const all = listings(HUB_PAGE_SIZE * 2 + 5);
    const p1 = sliceHubPage(all, 1)!;
    expect(p1.totalPages).toBe(3);
    expect(p1.listings).toHaveLength(HUB_PAGE_SIZE);
    expect([p1.from, p1.to]).toEqual([1, HUB_PAGE_SIZE]);

    const p3 = sliceHubPage(all, 3)!;
    expect(p3.listings.map((l) => l.id)).toEqual(["id48", "id49", "id50", "id51", "id52"]);
    expect([p3.from, p3.to, p3.total]).toEqual([49, 53, 53]);
  });

  it("returns null past the last page, so the route 404s", () => {
    expect(sliceHubPage(listings(10), 2)).toBeNull();
    expect(sliceHubPage(listings(10), 0)).toBeNull();
  });

  it("treats an empty hub as a single empty page", () => {
    const p = sliceHubPage([], 1)!;
    expect([p.total, p.totalPages, p.from, p.to]).toEqual([0, 1, 0, 0]);
  });
});

describe("hub page URLs", () => {
  it("keeps page 1 on the hub URL", () => {
    expect(hubPagePath("/rentals/in/gurugram", 1)).toBe("/rentals/in/gurugram");
    expect(hubPagePath("/rentals/in/gurugram/", 3)).toBe("/rentals/in/gurugram/page/3");
  });

  it("accepts only canonical page numbers 2..max", () => {
    expect(parseHubPageParam("2")).toBe(2);
    expect(parseHubPageParam("1")).toBeNull(); // page 1 is the hub itself
    expect(parseHubPageParam("02")).toBeNull();
    expect(parseHubPageParam("abc")).toBeNull();
    expect(parseHubPageParam(String(HUB_MAX_PAGES + 1))).toBeNull();
  });
});

describe("resolveNearestLiveCity", () => {
  it("finds the live city for coordinates near its centre", () => {
    // Chandigarh Sector 17 — inside the Chandigarh Tricity hub.
    expect(resolveNearestLiveCity(30.7398, 76.7827)?.citySlug).toBe("chandigarh");
  });

  it("returns null far from any live city", () => {
    // Middle of the Thar desert.
    expect(resolveNearestLiveCity(27.0, 71.0)).toBeNull();
  });
});

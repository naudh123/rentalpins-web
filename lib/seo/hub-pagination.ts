import { unstable_cache } from "next/cache";
import type { AreaConfig } from "@/lib/area-config";
import { fetchAreaListings, type SeoListingCard } from "@/lib/seo-listings";

/**
 * Crawlable pagination for city / locality hubs.
 *
 * Hubs used to link only the first 20 listings, so most listings were reachable
 * only through the sitemap and rarely got indexed. Paginated pages live at
 * `{hub}/page/{n}` (a static segment, so the hub stays ISR-cached instead of
 * going dynamic on `?page=`), each self-canonical and linked with plain <a href>.
 */

/** Listings per paginated page (page 1 is the hub itself). */
export const HUB_PAGE_SIZE = 24;

/** Upper bound per geohash cell when collecting a hub's full inventory. */
export const HUB_MAX_LISTINGS = 300;

/** Hard cap on page numbers so a bad URL can't fan out. */
export const HUB_MAX_PAGES = Math.ceil(HUB_MAX_LISTINGS / HUB_PAGE_SIZE);

export const HUB_REVALIDATE_SECONDS = 7200;

const cachedHubListings = unstable_cache(
  async (area: AreaConfig): Promise<SeoListingCard[]> =>
    fetchAreaListings(area, HUB_MAX_LISTINGS),
  ["hub-listings-v1"],
  { revalidate: HUB_REVALIDATE_SECONDS, tags: ["hub-listings"] }
);

/** Every live listing for a hub (cached; shared by page 1..N). */
export async function fetchAllHubListings(area: AreaConfig): Promise<SeoListingCard[]> {
  try {
    return await cachedHubListings(area);
  } catch {
    return [];
  }
}

export interface HubPage {
  page: number;
  totalPages: number;
  total: number;
  listings: SeoListingCard[];
  /** 1-based index of the first listing on this page. */
  from: number;
  to: number;
}

/** Slice one page out of a hub's inventory. Returns null for out-of-range pages. */
export function sliceHubPage(all: SeoListingCard[], page: number): HubPage | null {
  if (!Number.isInteger(page) || page < 1) return null;
  const total = all.length;
  const totalPages = Math.max(1, Math.ceil(total / HUB_PAGE_SIZE));
  if (page > totalPages) return null;
  const start = (page - 1) * HUB_PAGE_SIZE;
  const listings = all.slice(start, start + HUB_PAGE_SIZE);
  return {
    page,
    totalPages,
    total,
    listings,
    from: total ? start + 1 : 0,
    to: start + listings.length,
  };
}

/** `/rentals/in/gurugram` + 1 → itself; + 3 → `/rentals/in/gurugram/page/3`. */
export function hubPagePath(basePath: string, page: number): string {
  const base = basePath.replace(/\/+$/, "");
  return page <= 1 ? base : `${base}/page/${page}`;
}

/** Parse the `[page]` route param; only canonical forms ("2", not "02" or "1"). */
export function parseHubPageParam(raw: string): number | null {
  if (!/^[1-9]\d*$/.test(raw)) return null;
  const n = Number(raw);
  if (n < 2 || n > HUB_MAX_PAGES) return null;
  return n;
}

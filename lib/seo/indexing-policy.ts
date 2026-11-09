import type { Metadata } from "next";
import type { CityConfig } from "@/lib/cities-config";
import { canonicalUrl } from "@/lib/seo";
import { rentalCityPath } from "@/lib/cities-config";

/** Robots for city / locality hubs (coming-soon = noindex,nofollow). */
export function robotsForCity(city: CityConfig): NonNullable<Metadata["robots"]> {
  if (city.status === "coming-soon") {
    return { index: false, follow: false };
  }
  return { index: true, follow: true };
}

/**
 * Coming-soon regional hubs (e.g. NCR) overlap live city pages (Delhi).
 * Point canonical to the live hub; keep page reachable but out of index.
 */
export function canonicalForCity(city: CityConfig): string {
  if (city.slug === "ncr" && city.countrySlug === "in") {
    return canonicalUrl(rentalCityPath("in", "delhi"));
  }
  return canonicalUrl(rentalCityPath(city.countrySlug, city.slug));
}

/** Map search with query params should not compete with clean /search canonical. */
export function robotsForSearchPage(
  hasViewportQuery: boolean
): NonNullable<Metadata["robots"]> {
  if (hasViewportQuery) {
    return { index: false, follow: true };
  }
  return { index: true, follow: true };
}

/**
 * Countries where RentalPins has real inventory and editorial authority.
 * Hubs outside these countries are inventory-gated: template copy alone does
 * not make them indexable (GSC Aug–Nov 2026: 62 UK URLs, 27k impressions,
 * 22 clicks at position 20–70 — thin pages that drag site-wide quality).
 */
export const SEO_PRIMARY_COUNTRY_SLUGS: readonly string[] = ["in"];

/** Minimum live listings before an inventory-gated hub is indexable. */
export const MIN_LISTINGS_FOR_GATED_HUB = 3;

export function isInventoryGatedCountry(countrySlug: string): boolean {
  return !SEO_PRIMARY_COUNTRY_SLUGS.includes(countrySlug);
}

/** noindex,follow until a gated hub has enough live listings. */
export function robotsForInventoryGatedHub(
  listingCount: number
): NonNullable<Metadata["robots"]> {
  return listingCount >= MIN_LISTINGS_FOR_GATED_HUB
    ? { index: true, follow: true }
    : { index: false, follow: true };
}

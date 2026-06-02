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

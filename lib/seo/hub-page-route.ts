import type { Metadata } from "next";
import { getAreaConfig, type AreaConfig as GeoAreaConfig } from "@/lib/area-config";
import {
  getAreaBySlug,
  getCityBySlug,
  getSiblingAreas,
  rentalAreaPath,
  rentalCityPath,
  RENTAL_COUNTRY_SLUGS,
  type CityConfig,
} from "@/lib/cities-config";
import { canonicalUrl } from "@/lib/seo";
import {
  fetchAllHubListings,
  parseHubPageParam,
  sliceHubPage,
  type HubPage,
} from "@/lib/seo/hub-pagination";
import {
  isInventoryGatedCountry,
  robotsForCity,
  robotsForInventoryGatedHub,
} from "@/lib/seo/indexing-policy";
import type { HubCrumb } from "@/components/seo/HubListingsPage";

export interface ResolvedHub {
  city: CityConfig;
  placeName: string;
  basePath: string;
  geo: GeoAreaConfig;
  crumbs: HubCrumb[];
  relatedLinks: Array<{ label: string; href: string }>;
}

/** City hub (`area` omitted) or locality hub; undefined when the route doesn't exist. */
export function resolveHub(
  country: string,
  citySlug: string,
  areaSlug?: string
): ResolvedHub | undefined {
  if (!RENTAL_COUNTRY_SLUGS.includes(country as (typeof RENTAL_COUNTRY_SLUGS)[number])) {
    return undefined;
  }
  const city = getCityBySlug(country, citySlug);
  if (!city) return undefined;

  const cityPath = rentalCityPath(city.countrySlug, city.slug);
  const baseCrumbs: HubCrumb[] = [
    { name: "Home", path: "/" },
    { name: "Rentals", path: "/rentals" },
    { name: city.name, path: cityPath },
  ];

  if (!areaSlug) {
    const geo = getAreaConfig(city.slug);
    if (!geo) return undefined;
    return {
      city,
      placeName: city.name,
      basePath: cityPath,
      geo,
      crumbs: baseCrumbs,
      relatedLinks: city.areas.slice(0, 12).map((a) => ({
        label: a.name,
        href: rentalAreaPath(city.countrySlug, city.slug, a.slug),
      })),
    };
  }

  const found = getAreaBySlug(country, citySlug, areaSlug);
  if (!found) return undefined;
  const geo = getAreaConfig(city.slug, areaSlug);
  if (!geo) return undefined;
  const areaPath = rentalAreaPath(city.countrySlug, city.slug, found.area.slug);
  return {
    city,
    placeName: found.area.name,
    basePath: areaPath,
    geo,
    crumbs: [...baseCrumbs, { name: found.area.name, path: areaPath }],
    relatedLinks: getSiblingAreas(country, citySlug, areaSlug).slice(0, 12),
  };
}

/** Load page N (≥2) of a hub; null → 404 (bad number, or past the last page). */
export async function loadHubPage(
  hub: ResolvedHub,
  rawPage: string
): Promise<HubPage | null> {
  const page = parseHubPageParam(rawPage);
  if (page === null) return null;
  return sliceHubPage(await fetchAllHubListings(hub.geo), page);
}

export function hubPageMetadata(hub: ResolvedHub, hubPage: HubPage): Metadata {
  const { page, totalPages, from, to, total } = hubPage;
  const path = `${hub.basePath}/page/${page}`;
  const title = `Rentals in ${hub.placeName} — Page ${page} of ${totalPages}`;
  const description = `Rentals ${from}–${to} of ${total} in ${hub.placeName}: owner-direct flats, PG, rooms and shops with photos, rent and map location. No brokerage.`;

  const robots =
    hub.city.status !== "coming-soon" && isInventoryGatedCountry(hub.city.countrySlug)
      ? robotsForInventoryGatedHub(total)
      : robotsForCity(hub.city);

  return {
    title,
    description,
    // Each page is self-canonical: pointing page 2+ at page 1 would hide the
    // listings it links to (Google: don't canonicalize paginated pages to page 1).
    alternates: { canonical: canonicalUrl(path) },
    robots,
    openGraph: { title: `${title} | RentalPins`, description, url: canonicalUrl(path), type: "website" },
  };
}

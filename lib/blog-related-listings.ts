import {
  getIndexableAreas,
  getLiveCities,
  rentalAreaPath,
  rentalCityPath,
} from "@/lib/cities-config";
import { getAreaConfig, type AreaConfig } from "@/lib/area-config";
import { fetchAreaListings, type SeoListingCard } from "@/lib/seo-listings";

export interface BlogListingHub {
  label: string;
  placeName: string;
  hubHref: string;
  areaConfig: AreaConfig;
}

function normalizeTag(tag: string): string {
  return tag.toLowerCase().trim().replace(/\s+/g, " ");
}

function tagMatchesField(field: string, tag: string): boolean {
  const normalizedField = normalizeTag(field);
  const normalizedTag = normalizeTag(tag);
  if (!normalizedField || !normalizedTag) return false;
  return (
    normalizedField === normalizedTag ||
    normalizedField.includes(normalizedTag) ||
    normalizedTag.includes(normalizedField)
  );
}

/** Map blog tags to the first live rental hub (city or area). */
export function resolveBlogListingHub(
  tags: string[] | undefined
): BlogListingHub | null {
  if (!tags?.length) return null;

  for (const rawTag of tags) {
    const tag = normalizeTag(rawTag);
    if (!tag) continue;

    for (const area of getIndexableAreas()) {
      if (
        tagMatchesField(area.slug, tag) ||
        tagMatchesField(area.name, tag)
      ) {
        const areaConfig = getAreaConfig(area.parentSlug, area.slug);
        if (!areaConfig) continue;

        const isCityHub = area.slug === area.parentSlug;
        return {
          label: `Related rentals in ${area.name}`,
          placeName: area.name,
          hubHref: isCityHub
            ? rentalCityPath(area.parentCountrySlug, area.parentSlug)
            : rentalAreaPath(
                area.parentCountrySlug,
                area.parentSlug,
                area.slug
              ),
          areaConfig,
        };
      }
    }

    for (const city of getLiveCities()) {
      if (
        tagMatchesField(city.slug, tag) ||
        tagMatchesField(city.name, tag)
      ) {
        const areaConfig = getAreaConfig(city.slug);
        if (!areaConfig) continue;

        return {
          label: `Related rentals in ${city.name}`,
          placeName: city.name,
          hubHref: rentalCityPath(city.countrySlug, city.slug),
          areaConfig,
        };
      }
    }
  }

  return null;
}

export async function fetchBlogRelatedListings(
  tags: string[] | undefined,
  limit = 6
): Promise<{ hub: BlogListingHub; listings: SeoListingCard[] } | null> {
  const hub = resolveBlogListingHub(tags);
  if (!hub) return null;

  const listings = await fetchAreaListings(hub.areaConfig, limit);
  return { hub, listings };
}

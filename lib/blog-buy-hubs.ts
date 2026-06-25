import { BUY_HUBS, getBuyPageConfig, type BuyPageConfig } from "@/lib/sale/buy-pages-config";
import { getAreaConfig } from "@/lib/area-config";
import { fetchAreaListings, type SeoListingCard } from "@/lib/seo-listings";

export interface BlogBuyHub {
  label: string;
  placeName: string;
  hubHref: string;
  placeQuery: string;
  mapCenter: { lat: number; lng: number };
  mapZoom: number;
  listingAreaSlug: string;
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

function hubFromConfig(config: BuyPageConfig): BlogBuyHub {
  const path = config.areaSlug
    ? `/buy/${config.hubSlug}/${config.areaSlug}`
    : `/buy/${config.hubSlug}`;
  return {
    label: `Explore sale listings in ${config.areaName}`,
    placeName: config.areaName,
    hubHref: path,
    placeQuery: config.placeQuery,
    mapCenter: config.mapCenter,
    mapZoom: config.mapZoom,
    listingAreaSlug: config.listingAreaSlug,
  };
}

/** Map blog tags to the first Tricity buy hub. */
export function resolveBlogBuyHub(tags: string[] | undefined): BlogBuyHub | null {
  if (!tags?.length) return null;

  const configs = Object.values(BUY_HUBS);

  for (const rawTag of tags) {
    const tag = normalizeTag(rawTag);
    if (!tag) continue;

    if (tag.includes("tricity") || tag.includes("chandigarh tricity")) {
      const mohali = getBuyPageConfig("mohali");
      if (mohali) return hubFromConfig(mohali);
    }

    for (const config of configs) {
      if (
        tagMatchesField(config.hubSlug, tag) ||
        tagMatchesField(config.cityName, tag) ||
        tagMatchesField(config.areaName, tag) ||
        (config.areaSlug && tagMatchesField(config.areaSlug, tag))
      ) {
        return hubFromConfig(config);
      }
    }
  }

  return null;
}

export async function fetchBlogRelatedSaleListings(
  tags: string[] | undefined,
  limit = 6
): Promise<{ hub: BlogBuyHub; listings: SeoListingCard[] } | null> {
  const hub = resolveBlogBuyHub(tags);
  if (!hub) return null;

  const areaConfig = getAreaConfig(hub.listingAreaSlug);
  if (!areaConfig) return null;

  const listings = await fetchAreaListings(areaConfig, limit, {
    transactionType: "sale",
  });

  return { hub, listings };
}

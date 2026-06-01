import { notFound } from "next/navigation";
import {
  getCityBySlug,
  getAreaBySlug,
  RENTAL_COUNTRY_SLUGS,
} from "@/lib/cities-config";
import { getAreaConfig } from "@/lib/area-config";
import { fetchAreaListings } from "@/lib/seo-listings";
import {
  getRentalCategoryBySlug,
  type RentalCategoryConfig,
} from "@/lib/seo/categories";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { mapSearchUrl } from "@/lib/map-search-url";
import { appPath } from "@/lib/config";
import type { Metadata } from "next";
import type { CityConfig, AreaConfig as CityAreaConfig } from "@/lib/cities-config";

export interface CategoryHubContext {
  city: CityConfig;
  category: RentalCategoryConfig;
  areaConfig: import("@/lib/area-config").AreaConfig;
  areaContent: CityAreaConfig | null;
  mapHref: string;
  listings: Awaited<ReturnType<typeof fetchAreaListings>>;
}

export async function resolveCategoryHub(
  country: string,
  citySlug: string,
  categorySlug: string,
  areaSlug?: string
): Promise<CategoryHubContext> {
  if (!RENTAL_COUNTRY_SLUGS.includes(country as (typeof RENTAL_COUNTRY_SLUGS)[number])) {
    notFound();
  }
  const category = getRentalCategoryBySlug(categorySlug);
  if (!category) notFound();

  const city = getCityBySlug(country, citySlug);
  if (!city) notFound();

  let areaContent: CityAreaConfig | null = null;
  if (areaSlug) {
    const result = getAreaBySlug(country, citySlug, areaSlug);
    if (!result) notFound();
    areaContent = result.area;
  }

  const areaConfig = areaContent
    ? getAreaConfig(city.slug, areaContent.slug)
    : getAreaConfig(city.slug);
  if (!areaConfig) notFound();

  const listings = await fetchAreaListings(areaConfig, 24);
  const filtered = listings.filter((l) => {
    if (l.category !== category.mainCategory) return false;
    if (category.subCategories.length === 0) return true;
    return category.subCategories.some(
      (sub) =>
        l.subCategory.toLowerCase().includes(sub.toLowerCase()) ||
        sub.toLowerCase().includes(l.subCategory.toLowerCase())
    );
  });

  const placeName = areaContent?.name ?? city.name;
  const mapHref = appPath(
    mapSearchUrl(
      areaConfig.center.lat,
      areaConfig.center.lng,
      13,
      undefined,
      category.mainCategory,
      null,
      category.searchKeywords[0] ?? null,
      placeName
    )
  );

  return {
    city,
    category,
    areaConfig,
    areaContent,
    mapHref,
    listings: filtered.length > 0 ? filtered : listings.slice(0, 12),
  };
}

export function categoryHubMetadata(ctx: CategoryHubContext, path: string): Metadata {
  const place = ctx.areaContent?.name ?? ctx.city.name;
  return buildPageMetadata({
    title: `${ctx.category.pluralLabel} for Rent in ${place} — No Broker | RentalPins`,
    description: `Find ${ctx.category.pluralLabel.toLowerCase()} in ${place} on RentalPins. Browse owner listings on the map, compare prices, and contact directly without broker fees.`,
    path,
    keywords: [
      ...ctx.category.searchKeywords,
      `${ctx.category.slug} for rent ${place}`,
      `no broker ${place}`,
    ],
  });
}

import { appPath, siteUrl } from "@/lib/config";
import {
  APP_DOWNLOAD_PAGES,
  APARTMENT_SEARCH_PAGES,
  CATEGORY_LANDING_PAGES,
  COMPETITOR_PAGES,
  INDUSTRIAL_PAGES,
  NEAR_ME_PAGES,
  STUDENT_RENTAL_PAGES,
  WITHOUT_BROKER_PAGES,
} from "@/lib/seo/marketing-pages";
import { protectedRoutes } from "@/lib/seo/protectedRoutes";

/** Static /rentals/{city} hubs — must match middleware RENTAL_STATIC_CITY_HUBS. */
export const RENTAL_STATIC_CITY_HUB_SLUGS = ["chandigarh"] as const;

/** Marketing + static landing slugs in `/sitemap.xml` (rent funnels). Buy hubs live via getBuyHubSitemapPaths in app/sitemap.ts. */
export function getCoreMarketingSitemapSlugs(): string[] {
  return [
    ...Object.keys(APARTMENT_SEARCH_PAGES),
    ...Object.keys(WITHOUT_BROKER_PAGES),
    ...Object.keys(APP_DOWNLOAD_PAGES),
    ...Object.keys(CATEGORY_LANDING_PAGES),
    ...Object.keys(INDUSTRIAL_PAGES),
    ...Object.keys(STUDENT_RENTAL_PAGES),
    ...Object.keys(NEAR_ME_PAGES),
    ...Object.keys(COMPETITOR_PAGES),
  ];
}

/** Static rental city hubs (e.g. /rentals/chandigarh) that do not 308 to /rentals/in/…. */
export function getStaticRentalCityHubSitemapPaths(): string[] {
  return RENTAL_STATIC_CITY_HUB_SLUGS.map((slug) => `/rentals/${slug}`);
}

/**
 * Canonical protected rental paths for sitemaps.
 * Excludes legacy /rentals/{city}/… URLs that 308 to /rentals/in/{city}/….
 */
export function getMandatoryRentalSitemapPaths(): string[] {
  const paths = new Set<string>();

  for (const path of protectedRoutes) {
    const segments = path.split("/").filter(Boolean);
    if (segments[0] !== "rentals") continue;

    if (
      segments.length === 2 &&
      RENTAL_STATIC_CITY_HUB_SLUGS.includes(
        segments[1] as (typeof RENTAL_STATIC_CITY_HUB_SLUGS)[number]
      )
    ) {
      paths.add(path);
      continue;
    }

    if (segments[1] === "in" && segments.length >= 3) {
      paths.add(path);
    }
  }

  return [...paths];
}

export function getMandatoryRentalCitySitemapPaths(): string[] {
  return getMandatoryRentalSitemapPaths().filter((path) => {
    const segments = path.split("/").filter(Boolean);
    return (
      (segments[1] === "in" && segments.length === 3) ||
      (segments.length === 2 &&
        RENTAL_STATIC_CITY_HUB_SLUGS.includes(
          segments[1] as (typeof RENTAL_STATIC_CITY_HUB_SLUGS)[number]
        ))
    );
  });
}

export function getMandatoryRentalAreaSitemapPaths(): string[] {
  return getMandatoryRentalSitemapPaths().filter((path) => {
    const segments = path.split("/").filter(Boolean);
    return segments[1] === "in" && segments.length >= 4;
  });
}

/**
 * Canonical child sitemaps for robots.txt and GSC.
 * Alias routes (e.g. city-sitemap.xml) re-export these — list once to avoid duplicate discovery.
 */
export function getPublicSitemapUrls(): string[] {
  return [
    `${siteUrl}${appPath("/sitemap.xml")}`,
    `${siteUrl}${appPath("/sitemap-cities.xml")}`,
    `${siteUrl}${appPath("/sitemap-localities.xml")}`,
    `${siteUrl}${appPath("/sitemap-listings.xml")}`,
    `${siteUrl}${appPath("/sitemap-projects.xml")}`,
    `${siteUrl}${appPath("/sitemap-blog.xml")}`,
    `${siteUrl}${appPath("/category-sitemap.xml")}`,
  ];
}

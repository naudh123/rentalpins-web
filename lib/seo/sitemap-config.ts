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
    `${siteUrl}${appPath("/sitemap-blog.xml")}`,
    `${siteUrl}${appPath("/category-sitemap.xml")}`,
  ];
}

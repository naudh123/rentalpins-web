import type { MetadataRoute } from "next";
import { canonicalUrl } from "@/lib/seo";
import {
  APP_DOWNLOAD_PAGES,
  CATEGORY_LANDING_PAGES,
  COMPETITOR_PAGES,
  INDUSTRIAL_PAGES,
  NEAR_ME_PAGES,
  STUDENT_RENTAL_PAGES,
  WITHOUT_BROKER_PAGES,
} from "@/lib/seo/marketing-pages";

/** Core sitemap — city/locality/listing/blog URLs live in dedicated XML routes (daily revalidate). */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date().toISOString();

  const marketingSlugs = [
    ...Object.keys(WITHOUT_BROKER_PAGES),
    ...Object.keys(APP_DOWNLOAD_PAGES),
    ...Object.keys(CATEGORY_LANDING_PAGES),
    ...Object.keys(INDUSTRIAL_PAGES),
    ...Object.keys(STUDENT_RENTAL_PAGES),
    ...Object.keys(NEAR_ME_PAGES),
    ...Object.keys(COMPETITOR_PAGES),
  ];

  const core: MetadataRoute.Sitemap = [
    { url: canonicalUrl("/"), lastModified: now, changeFrequency: "daily", priority: 1 },
    { url: canonicalUrl("/search"), lastModified: now, changeFrequency: "daily", priority: 0.95 },
    { url: canonicalUrl("/rentals"), lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: canonicalUrl("/about"), lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: canonicalUrl("/contact"), lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: canonicalUrl("/blog"), lastModified: now, changeFrequency: "weekly", priority: 0.6 },
    { url: canonicalUrl("/privacy-policy"), lastModified: now, changeFrequency: "yearly", priority: 0.2 },
    { url: canonicalUrl("/terms"), lastModified: now, changeFrequency: "yearly", priority: 0.2 },
    { url: canonicalUrl("/refund-policy"), lastModified: now, changeFrequency: "yearly", priority: 0.2 },
    ...marketingSlugs.map((slug) => ({
      url: canonicalUrl(`/${slug}`),
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.75,
    })),
  ];

  return core;
}

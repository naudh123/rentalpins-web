import type { MetadataRoute } from "next";
import { getCommercialLondonSitemapPaths } from "@/lib/commercial-london-config";
import { getIndianGscSitemapPaths } from "@/lib/rental-area-config";
import { getBuyHubSitemapPaths } from "@/lib/sale/buy-pages-config";
import { getBuyProjectSitemapPaths } from "@/lib/sale/buy-projects-config";
import { getBuyMoneyPageSitemapPaths } from "@/lib/seo/city-buy-seo-config";
import { getListForSaleSitemapPaths } from "@/lib/sale/list-for-sale-config";
import { getSaleMarketingSlugs } from "@/lib/sale/sale-marketing-pages";
import { getSupplyPageSitemapPaths } from "@/lib/supply-pages-config";
import { canonicalUrl } from "@/lib/seo";
import { getCoreMarketingSitemapSlugs } from "@/lib/seo/sitemap-config";
import { categoryAuthoritySitemapPaths } from "@/lib/seo/category-authority-page";
import { LISTING_CATEGORY_SEGMENTS } from "@/lib/seo/listing-category-segments";
import { getAllCities } from "@/lib/cities-config";
import { getGeoPageSitemapPaths } from "@/lib/seo/geo-pages-config";

/** Core sitemap — city/locality/listing/blog URLs live in dedicated XML routes (daily revalidate). */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date().toISOString();

  const marketingSlugs = getCoreMarketingSitemapSlugs();

  const core: MetadataRoute.Sitemap = [
    { url: canonicalUrl("/"), lastModified: now, changeFrequency: "daily", priority: 1 },
    { url: canonicalUrl("/search"), lastModified: now, changeFrequency: "daily", priority: 0.95 },
    { url: canonicalUrl("/buy"), lastModified: now, changeFrequency: "weekly", priority: 0.88 },
    { url: canonicalUrl("/buy/search"), lastModified: now, changeFrequency: "daily", priority: 0.87 },
    { url: canonicalUrl("/buy/requirements"), lastModified: now, changeFrequency: "weekly", priority: 0.72 },
    { url: canonicalUrl("/buy/projects"), lastModified: now, changeFrequency: "weekly", priority: 0.74 },
    { url: canonicalUrl("/advisor"), lastModified: now, changeFrequency: "monthly", priority: 0.65 },
    { url: canonicalUrl("/projects"), lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: canonicalUrl("/developers"), lastModified: now, changeFrequency: "weekly", priority: 0.68 },
    ...getAllCities()
      .filter((c) => c.status === "live")
      .flatMap((c) => [
        { path: `/buy/requirements/${c.slug}`, priority: 0.7 },
        { path: `/projects/${c.slug}`, priority: 0.68 },
      ])
      .map(({ path, priority }) => ({
        url: canonicalUrl(path),
        lastModified: now,
        changeFrequency: "weekly" as const,
        priority,
      })),
    ...LISTING_CATEGORY_SEGMENTS.flatMap((segment) =>
      categoryAuthoritySitemapPaths(segment).map((path) => ({
        url: canonicalUrl(path),
        lastModified: now,
        changeFrequency: "weekly" as const,
        priority: 0.76,
      }))
    ),
    ...getBuyProjectSitemapPaths().map((path) => ({
      url: canonicalUrl(path),
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.73,
    })),
    ...getBuyHubSitemapPaths().map((path) => ({
      url: canonicalUrl(path),
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.85,
    })),
    ...getBuyMoneyPageSitemapPaths().map((path) => ({
      url: canonicalUrl(path),
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.84,
    })),
    ...getSaleMarketingSlugs().map((slug) => ({
      url: canonicalUrl(`/${slug}`),
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    ...getListForSaleSitemapPaths().map((path) => ({
      url: canonicalUrl(path),
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.78,
    })),
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
    ...getCommercialLondonSitemapPaths().map((path) => ({
      url: canonicalUrl(path),
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
    ...getIndianGscSitemapPaths().map((path) => ({
      url: canonicalUrl(path),
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.82,
    })),
    ...getSupplyPageSitemapPaths().map((path) => ({
      url: canonicalUrl(path),
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.78,
    })),
    ...getGeoPageSitemapPaths().map((path) => ({
      url: canonicalUrl(path),
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.74,
    })),
  ];

  return core;
}

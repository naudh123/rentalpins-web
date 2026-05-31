import type { MetadataRoute } from "next";
import { getAllCities, getAllAreas } from "@/lib/cities-config";
import { getAllPosts } from "@/lib/blog";
import { canonicalUrl } from "@/lib/seo";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date().toISOString();

  const corePages: MetadataRoute.Sitemap = [
    { url: canonicalUrl("/"), lastModified: now, changeFrequency: "daily", priority: 1.0 },
    { url: canonicalUrl("/search"), lastModified: now, changeFrequency: "daily", priority: 0.95 },
    { url: canonicalUrl("/rentals"), lastModified: now, changeFrequency: "daily", priority: 0.85 },
    { url: canonicalUrl("/about"), lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: canonicalUrl("/contact"), lastModified: now, changeFrequency: "monthly", priority: 0.5 },
  ];

  const cityPages: MetadataRoute.Sitemap = getAllCities().map((city) => ({
    url: canonicalUrl(`/rentals/${city.countrySlug}/${city.slug}`),
    lastModified: now,
    changeFrequency: "daily" as const,
    priority: city.status === "live" ? 0.9 : 0.4,
  }));

  const areaPages: MetadataRoute.Sitemap = getAllAreas().map((area) => ({
    url: canonicalUrl(
      `/rentals/${area.parentCountrySlug}/${area.parentSlug}/${area.slug}`
    ),
    lastModified: now,
    changeFrequency: "daily" as const,
    priority: 0.8,
  }));

  const legalPages: MetadataRoute.Sitemap = [
    { url: canonicalUrl("/privacy-policy"), lastModified: now, changeFrequency: "yearly", priority: 0.2 },
    { url: canonicalUrl("/terms"), lastModified: now, changeFrequency: "yearly", priority: 0.2 },
    { url: canonicalUrl("/refund-policy"), lastModified: now, changeFrequency: "yearly", priority: 0.2 },
  ];

  const blogPosts = await getAllPosts();
  const blogPages: MetadataRoute.Sitemap = [
    { url: canonicalUrl("/blog"), lastModified: now, changeFrequency: "weekly", priority: 0.6 },
    ...blogPosts.map((post) => ({
      url: canonicalUrl(`/blog/${post.slug}`),
      lastModified: post.updatedAt ?? post.date ?? now,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];

  return [...corePages, ...cityPages, ...areaPages, ...legalPages, ...blogPages];
}

import { getMdxPosts } from "@/lib/blog";
import type { BlogPostSummary } from "@/lib/blog-types";
import { appPath } from "@/lib/config";
import { listCitySeoConfigKeys } from "@/lib/seo/city-seo-config";
import { pickCitySeoBlogPosts } from "@/lib/seo/city-seo-blog-links";
import {
  getNationalFunnelCities,
  type NationalFunnelKind,
} from "@/lib/seo/national-funnel-cities";

const SEO_GUIDE_ANCHOR = "#city-seo-content-heading";

export interface NationalFunnelCityGuide {
  placeName: string;
  hubHref: string;
  seoGuideHref: string;
  topBlogSlug?: string;
}

/** Priority money-page guides for national funnel landings. */
export function getNationalFunnelCityGuides(
  kind: NationalFunnelKind
): NationalFunnelCityGuide[] {
  return getNationalFunnelCities(kind)
    .filter((city) => city.seoGuideHref)
    .map((city) => ({
      placeName: city.name,
      hubHref: city.hubHref,
      seoGuideHref: city.seoGuideHref!,
      topBlogSlug: city.topBlogSlug,
    }));
}

/** Deduped blog guides across priority markets for national funnel pages. */
export function getNationalFunnelBlogGuides(limit = 7): BlogPostSummary[] {
  const posts = getMdxPosts();
  const seen = new Set<string>();
  const guides: BlogPostSummary[] = [];

  for (const configKey of listCitySeoConfigKeys()) {
    for (const post of pickCitySeoBlogPosts(configKey, posts, 2)) {
      if (seen.has(post.slug)) continue;
      seen.add(post.slug);
      guides.push(post);
      if (guides.length >= limit) return guides;
    }
  }

  return guides;
}

export function nationalFunnelBlogSectionTitle(kind: NationalFunnelKind): string {
  switch (kind) {
    case "flats":
      return "City guides for flats & apartments";
    case "houses":
      return "City guides for houses & villas";
    case "property":
      return "No-broker rental guides by city";
  }
}

export function nationalFunnelBlogSectionIntro(kind: NationalFunnelKind): string {
  switch (kind) {
    case "flats":
      return "Long-form tips on Tricity, Mohali, Kharar, Ludhiana, and Delhi flat search — with links back to live map inventory.";
    case "houses":
      return "Owner-direct house rental guides for our highest-demand Indian cities — compare areas before you contact on the map.";
    case "property":
      return "Broker-free search walkthroughs for priority markets — PG, flats, and deposit checklists with map links.";
  }
}

export function blogPostHref(slug: string): string {
  return appPath(`/blog/${slug}`);
}

export { SEO_GUIDE_ANCHOR };

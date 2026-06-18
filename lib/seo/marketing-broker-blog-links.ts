import type { BlogPostSummary } from "@/lib/blog-types";
import { pickCitySeoBlogPosts } from "@/lib/seo/city-seo-blog-links";

/** City money-page keys for marketing landings with blog guide modules. */
export const MARKETING_LANDING_CITY_KEYS: Partial<Record<string, string>> = {
  "property-without-broker-chandigarh": "in/chandigarh",
  "property-without-broker-mohali": "in/chandigarh/mohali",
  "property-without-broker-ludhiana": "in/ludhiana",
  "property-without-broker-delhi": "in/delhi",
  "property-without-broker-jaipur": "in/jaipur",
  "pg-near-chandigarh-university": "in/chandigarh/kharar",
  "pg-near-cgc-landran": "in/chandigarh/kharar",
  "pg-near-pec": "in/chandigarh",
  "pg-near-pau": "in/ludhiana",
  "pg-near-gndec": "in/ludhiana",
  "pg-near-lpu": "in/ludhiana",
};

export const MARKETING_LANDING_PLACE_NAMES: Partial<Record<string, string>> = {
  "property-without-broker-chandigarh": "Chandigarh Tricity",
  "property-without-broker-mohali": "Mohali",
  "property-without-broker-ludhiana": "Ludhiana",
  "property-without-broker-delhi": "Delhi NCR",
  "property-without-broker-jaipur": "Jaipur",
  "pg-near-chandigarh-university": "Kharar / CU",
  "pg-near-cgc-landran": "Landran",
  "pg-near-pec": "Chandigarh",
  "pg-near-pau": "Ludhiana / PAU",
  "pg-near-gndec": "Ludhiana / GNDEC",
  "pg-near-lpu": "LPU / Phagwara",
};

/** Blog guides to surface on a marketing landing with city context. */
export function pickMarketingLandingBlogPosts(
  slug: string,
  allPosts: BlogPostSummary[],
  limit = 3
): BlogPostSummary[] {
  const cityKey = MARKETING_LANDING_CITY_KEYS[slug];
  if (!cityKey) return [];
  return pickCitySeoBlogPosts(cityKey, allPosts, limit);
}

export function marketingLandingPlaceName(slug: string): string | null {
  return MARKETING_LANDING_PLACE_NAMES[slug] ?? null;
}

/** @deprecated Use pickMarketingLandingBlogPosts */
export const pickMarketingBrokerBlogPosts = pickMarketingLandingBlogPosts;

/** @deprecated Use marketingLandingPlaceName */
export const marketingBrokerPlaceName = marketingLandingPlaceName;

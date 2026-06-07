import type { MarketingPageConfig } from "@/lib/seo/marketing-pages";
import { MARKETING_PAGE_EXTRA_SECTIONS } from "@/lib/seo/marketing-page-expanded-sections";
import { MARKETING_PG_EXTRA_SECTIONS } from "@/lib/seo/marketing-pg-expanded-sections";
import { MARKETING_SECONDARY_EXTRA_SECTIONS } from "@/lib/seo/marketing-secondary-expanded-sections";
import { MARKETING_CATEGORY_EXTRA_SECTIONS } from "@/lib/seo/marketing-category-expanded-sections";
import { MARKETING_APP_EXTRA_SECTIONS } from "@/lib/seo/marketing-app-expanded-sections";

const ALL_MARKETING_EXTRA_SECTIONS = {
  ...MARKETING_PAGE_EXTRA_SECTIONS,
  ...MARKETING_PG_EXTRA_SECTIONS,
  ...MARKETING_SECONDARY_EXTRA_SECTIONS,
  ...MARKETING_CATEGORY_EXTRA_SECTIONS,
  ...MARKETING_APP_EXTRA_SECTIONS,
};

/** Broker landings expanded in the thin-marketing pass — guarded by word-count tests. */
export const PRIORITY_BROKER_LANDING_SLUGS = [
  "rent-without-broker",
  "flats-without-broker",
  "house-for-rent-without-broker",
  "property-without-broker-chandigarh",
  "property-without-broker-mohali",
  "property-without-broker-ludhiana",
  "property-without-broker-delhi",
] as const;

/** Student PG campus landings expanded in batch 2 — guarded by word-count tests. */
export const PRIORITY_PG_LANDING_SLUGS = [
  "pg-near-chandigarh-university",
  "pg-near-cgc-landran",
  "pg-near-pec",
  "pg-near-pau",
  "pg-near-gndec",
  "pg-near-lpu",
] as const;

/** Near-me, competitor, and industrial landings expanded in batch 3. */
export const PRIORITY_SECONDARY_LANDING_SLUGS = [
  "rentals-near-me",
  "flats-near-me",
  "pg-near-me",
  "shops-near-me",
  "offices-near-me",
  "warehouses-near-me",
  "rentalpins-vs-nobroker",
  "rentalpins-vs-magicbricks",
  "rentalpins-vs-99acres",
  "rentalpins-vs-housing",
  "warehouse-for-rent",
  "godown-for-rent",
  "industrial-property-for-rent",
  "warehouse-for-rent-ludhiana",
  "factory-shed-for-rent-ludhiana",
  "industrial-property-ludhiana",
  "warehouse-chandigarh",
  "warehouse-mohali",
] as const;

/** National category funnel landings expanded in batch 4. */
export const PRIORITY_CATEGORY_LANDING_SLUGS = [
  "flats-for-rent",
  "houses-for-rent",
  "pg-for-rent",
  "shops-for-rent",
  "offices-for-rent",
  "factory-shed-for-rent",
  "commercial-property-for-rent",
  "vehicles-for-rent",
  "equipment-for-rent",
] as const;

/** App download marketing landings expanded in batch 5. */
export const PRIORITY_APP_LANDING_SLUGS = [
  "download-app",
  "property-owner-app",
  "tenant-app",
  "rental-app-india",
] as const;

export type PriorityBrokerLandingSlug = (typeof PRIORITY_BROKER_LANDING_SLUGS)[number];
export type PriorityPgLandingSlug = (typeof PRIORITY_PG_LANDING_SLUGS)[number];
export type PrioritySecondaryLandingSlug = (typeof PRIORITY_SECONDARY_LANDING_SLUGS)[number];
export type PriorityCategoryLandingSlug = (typeof PRIORITY_CATEGORY_LANDING_SLUGS)[number];
export type PriorityAppLandingSlug = (typeof PRIORITY_APP_LANDING_SLUGS)[number];

function wordCount(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

/** Merge long-form sections into a marketing landing config. */
export function enrichMarketingPageConfig(config: MarketingPageConfig): MarketingPageConfig {
  const sections = ALL_MARKETING_EXTRA_SECTIONS[config.slug];
  if (!sections?.length) return config;
  return { ...config, sections };
}

/** Approximate visible word count for a marketing landing config. */
export function countMarketingPageWords(config: MarketingPageConfig): number {
  const chunks = [
    config.intro,
    ...config.benefits.flatMap((benefit) => [benefit.title, benefit.desc]),
    ...(config.sections ?? []).flatMap((section) => [
      section.title,
      ...section.paragraphs,
    ]),
    ...config.faqs.flatMap((faq) => [faq.q, faq.a]),
  ];
  return chunks.reduce((total, text) => total + wordCount(text), 0);
}

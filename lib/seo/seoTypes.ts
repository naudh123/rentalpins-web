export type SeoPageType =
  | "university"
  | "university_pg"
  | "university_hostel"
  | "university_flat"
  | "city"
  | "locality"
  | "landmark"
  | "road"
  | "building"
  | "society"
  | "project"
  | "builder"
  | "guide"
  | "calculator"
  | "comparison"
  | "budget";

export type SeoEntity = {
  id: string;
  type: SeoPageType;
  name: string;
  slug: string;
  city?: string;
  state?: string;
  country?: string;
  latitude?: number;
  longitude?: number;
  parentSlug?: string;
  aliases?: string[];
  nearbyLandmarks?: string[];
  relatedSlugs?: string[];
  priority?: number;
  indexable: boolean;
  /** Area slug for listing fetch via area-config */
  areaSlug?: string;
  /** Hub path for browse CTA */
  browseHref?: string;
  /** Intro override for page template */
  intro?: string;
  /** Rent range display e.g. "₹5,000–₹12,000" */
  rentRange?: string;
  /** Demand context: student | corporate | family | mixed */
  demandProfile?: "student" | "corporate" | "family" | "mixed";
  /** Property types available */
  propertyTypes?: string[];
};

export type SeoFaqItem = { question: string; answer: string };

export type SeoPageContext = {
  entity: SeoEntity;
  path: string;
  listingCount: number;
  faqs: SeoFaqItem[];
  breadcrumbs: { name: string; path: string }[];
};

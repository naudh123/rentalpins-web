// Shared types for city/area marketing pages (cities-config + intl city data).

export interface AreaConfig {
  slug: string;
  name: string;
  tagline: string;
  badge: string;
  primaryFocus: string;
  heroDescription: string;
  coordinates: { lat: number; lng: number };
  popularAreas: string[];
  topCategories: { name: string; color: string; icon: string; desc: string }[];
  popularSearches: string[];
  faqs: { q: string; a: string }[];
  ctaHeading: string;
  ctaBody: string;
}

export interface CityConfig {
  /** ISO-style path segment, e.g. in, uk, ke, ng */
  countrySlug: string;
  slug: string;
  name: string;
  country: string;
  tagline: string;
  badge: string;
  heroDescription: string;
  coordinates: { lat: number; lng: number };
  popularAreas: string[];
  topCategories: { name: string; color: string; icon: string; desc: string }[];
  popularSearches: string[];
  faqs: { q: string; a: string }[];
  ctaHeading: string;
  ctaBody: string;
  status: "live" | "coming-soon";
  areas: AreaConfig[];
}

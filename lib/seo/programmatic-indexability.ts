import type { Metadata } from "next";

/** Minimum live listings for area/category programmatic pages to be indexable. */
export const MIN_LISTINGS_FOR_INDEXABLE_AREA_CATEGORY = 3;

export interface ProgrammaticPageIndexabilityInput {
  /** True when the page is a city-level hub (broader editorial content). */
  isCityLevel?: boolean;
  area?: string;
  category?: string;
  listingCount: number;
  /** Unique SEO copy (city-seo-config, mohali overrides, GSC content, etc.). */
  hasUniqueContent: boolean;
}

export interface ProgrammaticPageIndexability {
  robots: NonNullable<Metadata["robots"]>;
  /** When set, page should canonicalize to this absolute or path URL. */
  canonicalParentPath?: string;
  includeInSitemap: boolean;
}

/**
 * Indexability rules for programmatic city/area/category pages.
 * City hubs may stay indexable with editorial content; thin area/category pages noindex.
 */
export function getProgrammaticPageIndexability(
  input: ProgrammaticPageIndexabilityInput
): ProgrammaticPageIndexability {
  const { isCityLevel, listingCount, hasUniqueContent } = input;

  if (isCityLevel) {
    return {
      robots: { index: true, follow: true },
      includeInSitemap: true,
    };
  }

  const enoughListings = listingCount >= MIN_LISTINGS_FOR_INDEXABLE_AREA_CATEGORY;
  const indexable = enoughListings || hasUniqueContent;

  if (!indexable) {
    return {
      robots: { index: false, follow: true },
      includeInSitemap: false,
    };
  }

  return {
    robots: { index: true, follow: true },
    includeInSitemap: true,
  };
}

/** Resolve canonical parent for empty area → city, or area+category → area. */
export function resolveCanonicalParentPath(opts: {
  countrySlug: string;
  citySlug: string;
  areaSlug?: string;
  categorySlug?: string;
}): string {
  const { countrySlug, citySlug, areaSlug, categorySlug } = opts;
  if (categorySlug && areaSlug) {
    return `/rentals/${countrySlug}/${citySlug}/${areaSlug}`;
  }
  if (areaSlug) {
    return `/rentals/${countrySlug}/${citySlug}`;
  }
  return `/rentals/${countrySlug}/${citySlug}`;
}

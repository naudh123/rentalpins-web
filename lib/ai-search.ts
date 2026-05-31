"use client";

import { parseSearchQueryCallable } from "@/lib/callable-functions";
import { CallableError } from "@/lib/firebase-callable";
import { mapCallableError } from "@/lib/auth-errors";
import {
  MAIN_CATEGORIES,
  BHK_OPTIONS,
  FURNISHING_OPTIONS,
  TENANT_PREFERENCE_OPTIONS,
  getSubCategories,
} from "./categories";
import {
  DEFAULT_LISTING_FILTERS,
  type ListingFilters,
  type ListingSort,
} from "./listing-filters";

export interface ParsedSearch {
  filters: ListingFilters;
  /** Free-text location to geocode + fly the map to ("" = none). */
  placeText: string;
  /** Leftover amenity keywords ("" = none). */
  keywords: string;
}

const SORTS: ListingSort[] = ["recommended", "price_asc", "price_desc", "newest"];

function allSubCategories(): string[] {
  const set = new Set<string>();
  for (const c of MAIN_CATEGORIES) {
    for (const s of getSubCategories(c)) set.add(s);
  }
  return [...set];
}

/**
 * Calls the `parseSearchQuery` Cloud Function (asia-south1) to turn a
 * natural-language query into structured listing filters + a place phrase.
 * The result is re-validated against the canonical option lists.
 */
export async function parseSearchQuery(query: string): Promise<ParsedSearch> {
  let data: {
    filters?: Partial<ListingFilters>;
    placeText?: string;
    keywords?: string;
  };
  try {
    data = (await parseSearchQueryCallable({
      query,
      categories: MAIN_CATEGORIES,
      subCategories: allSubCategories(),
      bhkOptions: BHK_OPTIONS,
      furnishingOptions: FURNISHING_OPTIONS,
      tenantOptions: TENANT_PREFERENCE_OPTIONS,
      currency: "INR",
    })) as typeof data;
  } catch (err) {
    if (err instanceof CallableError) {
      throw new Error(mapCallableError(err));
    }
    throw err;
  }

  const f = data.filters ?? {};

  const filters: ListingFilters = {
    ...DEFAULT_LISTING_FILTERS,
    category: typeof f.category === "string" ? f.category : "All",
    subCategory: typeof f.subCategory === "string" ? f.subCategory : "",
    priceMin: typeof f.priceMin === "number" ? f.priceMin : null,
    priceMax: typeof f.priceMax === "number" ? f.priceMax : null,
    sort: SORTS.includes(f.sort as ListingSort) ? (f.sort as ListingSort) : "recommended",
    bhk: typeof f.bhk === "string" ? f.bhk : "",
    furnishing: typeof f.furnishing === "string" ? f.furnishing : "",
    tenantPreference: typeof f.tenantPreference === "string" ? f.tenantPreference : "",
    areaMin: typeof f.areaMin === "number" ? f.areaMin : null,
    areaMax: typeof f.areaMax === "number" ? f.areaMax : null,
  };

  return {
    filters,
    placeText: typeof data.placeText === "string" ? data.placeText : "",
    keywords: typeof data.keywords === "string" ? data.keywords : "",
  };
}

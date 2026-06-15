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
  type ListingFilters,
  type ListingSort,
} from "./listing-filters";
import type { TransactionType } from "./transaction-type";
import { resetListingFilters } from "./listing-filter-reset";
import { BUY_SEARCH_PATH } from "@/lib/sale/buy-app-paths";
import { RENT_SEARCH_PATH } from "@/lib/search-url";

export interface ParsedSearch {
  filters: ListingFilters;
  /** Free-text location to geocode + fly the map to ("" = none). */
  placeText: string;
  /** Leftover amenity keywords ("" = none). */
  keywords: string;
}

/** Example queries surfaced in SEO copy and map UI hints. */
export const AI_SEARCH_RENT_EXAMPLES = [
  "2BHK furnished under 20k near Sector 22 Chandigarh",
  "PG for girls near IT Park Mohali",
  "Shop for rent in Zirakpur under 30k",
] as const;

export const AI_SEARCH_SALE_EXAMPLES = [
  "3BHK flat under 80 lakh in Phase 7 Mohali",
  "Plot in New Chandigarh sector 117 under 50 lakh",
  "2BHK ready to move Aerocity under 1 crore",
] as const;

/** Canonical map path for the active transaction module. */
export function mapPathForTransaction(transactionType: TransactionType): string {
  return transactionType === "sale" ? BUY_SEARCH_PATH : RENT_SEARCH_PATH;
}

const SORTS: ListingSort[] = ["recommended", "price_asc", "price_desc", "newest"];

/** GA4-safe error bucket for ai_search_failed. */
export function aiSearchErrorCode(err: unknown): string {
  if (err instanceof CallableError) {
    switch (err.code) {
      case "functions/deadline-exceeded":
        return "timeout";
      case "functions/unauthenticated":
        return "unauthenticated";
      case "functions/resource-exhausted":
        return "rate_limited";
      case "functions/unavailable":
        return "unavailable";
      case "functions/internal":
        return "internal";
      case "functions/invalid-argument":
        return "invalid_argument";
      default:
        return err.code.replace(/^functions\//, "").replace(/-/g, "_") || "unknown";
    }
  }
  if (err instanceof Error && err.name === "AbortError") return "timeout";
  return "unknown";
}

export function mapAiSearchError(err: unknown): string {
  if (err instanceof CallableError) {
    if (err.code === "functions/deadline-exceeded") {
      return "AI search took too long. Check your connection and try again.";
    }
    if (err.code === "functions/internal") {
      return "AI search is temporarily unavailable. Use filters or the location bar.";
    }
    if (err.code === "functions/resource-exhausted") {
      return "Too many AI searches. Wait a moment and try again.";
    }
    if (err.code === "functions/unauthenticated") {
      return "Sign in to use AI search, or use the location bar and filters.";
    }
    return mapCallableError(err);
  }
  if (err instanceof Error && err.message) return err.message;
  return "AI search failed. Try filters or the location bar.";
}

function allSubCategories(): string[] {
  const set = new Set<string>();
  for (const c of MAIN_CATEGORIES) {
    for (const s of getSubCategories(c)) set.add(s);
  }
  return [...set];
}

/**
 * Merge Cloud Function filter output with the active transaction context.
 * Sale mode always keeps transactionType=sale and Property category baseline.
 */
export function mergeAiSearchFilters(
  partial: Partial<ListingFilters>,
  transactionType: TransactionType = "rent"
): ListingFilters {
  const base = resetListingFilters(transactionType);
  const f = partial;

  return {
    ...base,
    category:
      transactionType === "sale"
        ? "Property"
        : typeof f.category === "string"
          ? f.category
          : base.category,
    subCategory: typeof f.subCategory === "string" ? f.subCategory : "",
    priceMin: typeof f.priceMin === "number" ? f.priceMin : null,
    priceMax: typeof f.priceMax === "number" ? f.priceMax : null,
    sort: SORTS.includes(f.sort as ListingSort) ? (f.sort as ListingSort) : "recommended",
    bhk: typeof f.bhk === "string" ? f.bhk : "",
    furnishing: typeof f.furnishing === "string" ? f.furnishing : "",
    tenantPreference:
      transactionType === "sale"
        ? ""
        : typeof f.tenantPreference === "string"
          ? f.tenantPreference
          : "",
    areaMin: typeof f.areaMin === "number" ? f.areaMin : null,
    areaMax: typeof f.areaMax === "number" ? f.areaMax : null,
    transactionType,
  };
}

/**
 * Calls the `parseSearchQuery` Cloud Function (asia-south1) to turn a
 * natural-language query into structured listing filters + a place phrase.
 * Pass `transactionType: "sale"` on the buy map so the backend biases toward
 * purchase intent (total price, BHK, Property category).
 */
export async function parseSearchQuery(
  query: string,
  transactionType: TransactionType = "rent"
): Promise<ParsedSearch> {
  const data = (await parseSearchQueryCallable({
    query,
    transactionType,
    categories: MAIN_CATEGORIES,
    subCategories: allSubCategories(),
    bhkOptions: BHK_OPTIONS,
    furnishingOptions: FURNISHING_OPTIONS,
    tenantOptions: TENANT_PREFERENCE_OPTIONS,
    currency: "INR",
  })) as {
    filters?: Partial<ListingFilters>;
    placeText?: string;
    keywords?: string;
  };

  const filters = mergeAiSearchFilters(data.filters ?? {}, transactionType);

  return {
    filters,
    placeText: typeof data.placeText === "string" ? data.placeText : "",
    keywords: typeof data.keywords === "string" ? data.keywords : "",
  };
}

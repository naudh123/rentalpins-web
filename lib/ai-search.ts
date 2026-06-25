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
  /** Parts of the query that could not map to filters or place (e.g. "pet friendly"). */
  unmatched: string[];
  confidence: AiSearchConfidence;
}

export type AiSearchConfidence = "high" | "low";

export interface AiSearchFeedback {
  unmatched: string[];
  confidence: AiSearchConfidence;
  /** User-facing note below the AI bar. */
  message: string | null;
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
 * Merge AI-parsed filters into the user's current map filters.
 * Only overrides fields the model populated (defaults like "All" / null are no-ops).
 */
export function mergeAiSearchFiltersIntoExisting(
  current: ListingFilters,
  partial: Partial<ListingFilters>,
  transactionType: TransactionType = current.transactionType ?? "rent"
): ListingFilters {
  const next: ListingFilters = {
    ...current,
    transactionType,
  };

  if (transactionType === "sale") {
    next.category = "Property";
  }

  if (partial.category && partial.category !== "All") {
    next.category = partial.category;
  }
  if (partial.subCategory) next.subCategory = partial.subCategory;
  if (partial.bhk) next.bhk = partial.bhk;
  if (partial.furnishing) next.furnishing = partial.furnishing;
  if (transactionType !== "sale" && partial.tenantPreference) {
    next.tenantPreference = partial.tenantPreference;
  }
  if (partial.priceMin != null && partial.priceMin > 0) next.priceMin = partial.priceMin;
  if (partial.priceMax != null && partial.priceMax > 0) next.priceMax = partial.priceMax;
  if (partial.areaMin != null && partial.areaMin > 0) next.areaMin = partial.areaMin;
  if (partial.areaMax != null && partial.areaMax > 0) next.areaMax = partial.areaMax;
  if (partial.sort && partial.sort !== "recommended") next.sort = partial.sort;

  return next;
}

/** Build inline feedback after a successful AI parse. */
export function buildAiSearchFeedback(
  parsed: Pick<ParsedSearch, "unmatched" | "confidence" | "placeText">,
  locationResolved: boolean
): AiSearchFeedback {
  const parts: string[] = [];

  if (parsed.unmatched.length > 0) {
    parts.push(
      `Couldn't match: ${parsed.unmatched.join(", ")} — showing results for the rest.`
    );
  }

  if (
    parsed.confidence === "low" &&
    parsed.placeText &&
    !locationResolved
  ) {
    parts.push(
      "Couldn't pin an exact location — here's what's closest in this area."
    );
  } else if (parsed.confidence === "low" && !parsed.placeText) {
    parts.push(
      "Query was vague — showing nearby listings that best match."
    );
  }

  return {
    unmatched: parsed.unmatched,
    confidence: parsed.confidence,
    message: parts.length ? parts.join(" ") : null,
  };
}

/**
 * Merge Cloud Function filter output with the active transaction context.
 * Sale mode always keeps transactionType=sale and Property category baseline.
 * @deprecated Prefer mergeAiSearchFiltersIntoExisting when user filters may already be set.
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
async function callParseSearchQueryApi(
  query: string,
  transactionType: TransactionType
): Promise<{
  filtersPartial: Partial<ListingFilters>;
  placeText: string;
  keywords: string;
  unmatched: string[];
  confidence: AiSearchConfidence;
}> {
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
    unmatched?: unknown;
    confidence?: string;
  };

  const unmatched = Array.isArray(data.unmatched)
    ? data.unmatched
        .filter((s): s is string => typeof s === "string")
        .map((s) => s.trim())
        .filter(Boolean)
        .slice(0, 8)
    : [];

  return {
    filtersPartial: data.filters ?? {},
    placeText: typeof data.placeText === "string" ? data.placeText : "",
    keywords: typeof data.keywords === "string" ? data.keywords : "",
    unmatched,
    confidence: data.confidence === "high" ? "high" : "low",
  };
}

export async function parseSearchQuery(
  query: string,
  transactionType: TransactionType = "rent"
): Promise<ParsedSearch> {
  const api = await callParseSearchQueryApi(query, transactionType);
  return {
    filters: mergeAiSearchFilters(api.filtersPartial, transactionType),
    placeText: api.placeText,
    keywords: api.keywords,
    unmatched: api.unmatched,
    confidence: api.confidence,
  };
}

/** Parse + merge into existing map filters (preserves unspecified fields). */
export async function parseSearchQueryMerged(
  query: string,
  currentFilters: ListingFilters,
  transactionType: TransactionType = currentFilters.transactionType ?? "rent"
): Promise<ParsedSearch> {
  const api = await callParseSearchQueryApi(query, transactionType);
  return {
    filters: mergeAiSearchFiltersIntoExisting(
      currentFilters,
      api.filtersPartial,
      transactionType
    ),
    placeText: api.placeText,
    keywords: api.keywords,
    unmatched: api.unmatched,
    confidence: api.confidence,
  };
}

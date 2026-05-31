import type { ListingCard } from "./types/listing";

export type ListingSort =
  | "recommended"
  | "price_asc"
  | "price_desc"
  | "newest";

export interface ListingFilters {
  category: string;
  /** Optional subcategory refinement (e.g. "Apartments / Flats"). "" = any. */
  subCategory?: string;
  priceMin: number | null;
  priceMax: number | null;
  sort: ListingSort;
  /* Property/residential attribute filters ("" / null = any). */
  bhk?: string;
  furnishing?: string;
  tenantPreference?: string;
  areaMin?: number | null;
  areaMax?: number | null;
}

export const DEFAULT_LISTING_FILTERS: ListingFilters = {
  category: "All",
  subCategory: "",
  priceMin: null,
  priceMax: null,
  sort: "recommended",
  bhk: "",
  furnishing: "",
  tenantPreference: "",
  areaMin: null,
  areaMax: null,
};

export function applyListingFilters(
  listings: ListingCard[],
  filters: ListingFilters
): ListingCard[] {
  let result = [...listings];

  if (filters.category && filters.category !== "All") {
    result = result.filter(
      (l) =>
        l.category === filters.category ||
        l.subCategory === filters.category
    );
  }

  if (filters.subCategory) {
    result = result.filter((l) => l.subCategory === filters.subCategory);
  }

  if (filters.priceMin != null && filters.priceMin > 0) {
    result = result.filter((l) => l.price >= filters.priceMin!);
  }

  if (filters.priceMax != null && filters.priceMax > 0) {
    result = result.filter((l) => l.price <= filters.priceMax!);
  }

  // Structured attribute filters. When a filter is active, listings missing the
  // attribute are excluded (strict quality) — except tenant preference, where
  // "Anyone" matches any requested audience.
  if (filters.bhk) {
    result = result.filter((l) => l.attributes?.bhk === filters.bhk);
  }

  if (filters.furnishing) {
    result = result.filter((l) => l.attributes?.furnishing === filters.furnishing);
  }

  if (filters.tenantPreference) {
    result = result.filter(
      (l) =>
        l.attributes?.tenantPreference === filters.tenantPreference ||
        l.attributes?.tenantPreference === "Anyone"
    );
  }

  if (filters.areaMin != null && filters.areaMin > 0) {
    result = result.filter((l) => (l.attributes?.areaSqft ?? 0) >= filters.areaMin!);
  }

  if (filters.areaMax != null && filters.areaMax > 0) {
    result = result.filter(
      (l) => l.attributes?.areaSqft != null && l.attributes.areaSqft <= filters.areaMax!
    );
  }

  result.sort((a, b) => compareListings(a, b, filters.sort));

  return result;
}

function compareListings(
  a: ListingCard,
  b: ListingCard,
  sort: ListingSort
): number {
  switch (sort) {
    case "price_asc":
      return (a.price || 0) - (b.price || 0);
    case "price_desc":
      return (b.price || 0) - (a.price || 0);
    case "newest":
      return (
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    case "recommended":
    default:
      if (a.isPromoted !== b.isPromoted) return a.isPromoted ? -1 : 1;
      return (
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
  }
}

/** Stable cache key segment for map listing fetches. */
export function listingFiltersFetchKey(filters: ListingFilters): string {
  const params = new URLSearchParams();
  appendListingFiltersToParams(params, filters);
  return params.toString() || "default";
}

/** Query params for GET /api/listings (category, price, sort). */
export function appendListingFiltersToParams(
  params: URLSearchParams,
  filters: ListingFilters
): void {
  if (filters.category && filters.category !== "All") {
    params.set("category", filters.category);
  }
  if (filters.subCategory) {
    params.set("sub", filters.subCategory);
  }
  if (filters.priceMin != null && filters.priceMin > 0) {
    params.set("priceMin", String(filters.priceMin));
  }
  if (filters.priceMax != null && filters.priceMax > 0) {
    params.set("priceMax", String(filters.priceMax));
  }
  if (filters.sort && filters.sort !== "recommended") {
    params.set("sort", filters.sort);
  }
  if (filters.bhk) params.set("bhk", filters.bhk);
  if (filters.furnishing) params.set("furn", filters.furnishing);
  if (filters.tenantPreference) params.set("tenant", filters.tenantPreference);
  if (filters.areaMin != null && filters.areaMin > 0) {
    params.set("areaMin", String(filters.areaMin));
  }
  if (filters.areaMax != null && filters.areaMax > 0) {
    params.set("areaMax", String(filters.areaMax));
  }
}

export function parseListingFiltersFromParams(
  searchParams: URLSearchParams
): ListingFilters {
  const category = searchParams.get("category") || DEFAULT_LISTING_FILTERS.category;
  const sortRaw = searchParams.get("sort");
  const sort = (
    ["recommended", "price_asc", "price_desc", "newest"] as const
  ).includes(sortRaw as ListingSort)
    ? (sortRaw as ListingSort)
    : DEFAULT_LISTING_FILTERS.sort;

  const parseNum = (key: string): number | null => {
    const v = searchParams.get(key);
    if (v == null || v === "") return null;
    const n = Number(v);
    return Number.isFinite(n) ? n : null;
  };

  return {
    category,
    subCategory: searchParams.get("sub") || "",
    priceMin: parseNum("priceMin"),
    priceMax: parseNum("priceMax"),
    sort,
    bhk: searchParams.get("bhk") || "",
    furnishing: searchParams.get("furn") || "",
    tenantPreference: searchParams.get("tenant") || "",
    areaMin: parseNum("areaMin"),
    areaMax: parseNum("areaMax"),
  };
}

export function countActiveFilters(filters: ListingFilters): number {
  let n = 0;
  if (filters.category !== "All") n++;
  if (filters.subCategory) n++;
  if (filters.priceMin != null && filters.priceMin > 0) n++;
  if (filters.priceMax != null && filters.priceMax > 0) n++;
  if (filters.sort !== "recommended") n++;
  if (filters.bhk) n++;
  if (filters.furnishing) n++;
  if (filters.tenantPreference) n++;
  if (filters.areaMin != null && filters.areaMin > 0) n++;
  if (filters.areaMax != null && filters.areaMax > 0) n++;
  return n;
}

/** Client-side AND match on title, description, location, category (Flutter parity). */
export function applyTextSearchFilter(
  listings: ListingCard[],
  query: string
): ListingCard[] {
  const q = query.trim().toLowerCase();
  if (!q) return listings;
  const words = q.split(/\s+/).filter(Boolean);
  if (!words.length) return listings;

  return listings.filter((l) => {
    const combined = [
      l.title,
      l.description,
      l.locationName,
      l.category,
      l.subCategory,
    ]
      .join(" ")
      .toLowerCase();
    return words.every((w) => combined.includes(w));
  });
}

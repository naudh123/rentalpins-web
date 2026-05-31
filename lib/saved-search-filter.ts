import type { SavedSearch } from "@/lib/types/saved-search";

/** DOM id for the saved-search list filter input (keyboard shortcuts target this). */
export const SAVED_SEARCH_FILTER_INPUT_ID = "saved-search-filter";

/** Client-side filter for the saved-searches list. */
export function filterSavedSearches(
  searches: SavedSearch[],
  queryText: string
): SavedSearch[] {
  const q = queryText.trim().toLowerCase();
  if (!q) return searches;
  return searches.filter((s) => {
    const haystack = [
      s.name,
      s.placeQuery ?? "",
      s.category,
      s.sort,
      s.priceMin != null ? String(s.priceMin) : "",
      s.priceMax != null ? String(s.priceMax) : "",
    ]
      .join(" ")
      .toLowerCase();
    return haystack.includes(q);
  });
}

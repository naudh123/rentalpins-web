import type { SearchUrlState } from "@/lib/search-url";
import { RENT_SEARCH_PATH, searchUrlQueryString } from "@/lib/search-url";

/** Build rent map URL with same viewport as buy map for yield underwriting. */
export function buildRentCompsUrlFromBuyView(state: SearchUrlState): string {
  const rentState: SearchUrlState = {
    ...state,
    filters: {
      ...state.filters,
      transactionType: "rent",
    },
    selectedId: null,
  };
  const qs = searchUrlQueryString(rentState);
  return qs ? `${RENT_SEARCH_PATH}?${qs}` : RENT_SEARCH_PATH;
}

import { DEFAULT_LISTING_FILTERS } from "@/lib/listing-filters";
import type { ListingFilters } from "@/lib/listing-filters";
import { clampBuyListingFilters, buildMapSearchUrl, type SearchUrlState } from "@/lib/search-url";
import type { TransactionType } from "@/lib/transaction-type";
import { getBuyHub } from "@/lib/sale/buy-pages-config";
import type { ParsedAgentSearch } from "./parse-query-server";

function mergeParsedFilters(
  partial: Partial<ListingFilters>,
  transactionType: TransactionType
): ListingFilters {
  const next: ListingFilters = {
    ...DEFAULT_LISTING_FILTERS,
    transactionType,
  };

  if (transactionType === "sale") {
    next.category = "Property";
  }

  if (partial.category && partial.category !== "All") next.category = partial.category;
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

  return transactionType === "sale" ? clampBuyListingFilters(next) : next;
}

function boundsAround(lat: number, lng: number, delta = 0.06) {
  return { north: lat + delta, south: lat - delta, east: lng + delta, west: lng - delta };
}

export function buildAgentMapUrl(
  parsed: ParsedAgentSearch,
  transactionType: TransactionType,
  hubSlug?: string
): string {
  const filters = mergeParsedFilters(parsed.filters, transactionType);

  let centerLat: number | null = null;
  let centerLng: number | null = null;
  let zoom: number | null = 12;
  let bounds = null;

  if (hubSlug) {
    const hub = getBuyHub(hubSlug);
    if (hub) {
      centerLat = hub.mapCenter.lat;
      centerLng = hub.mapCenter.lng;
      zoom = hub.mapZoom;
      bounds = boundsAround(hub.mapCenter.lat, hub.mapCenter.lng);
    }
  }

  const state: SearchUrlState = {
    filters,
    centerLat,
    centerLng,
    zoom,
    bounds,
    placeQuery: parsed.placeText || null,
    keywords: parsed.keywords || null,
    selectedId: null,
    drawnArea: null,
  };

  return buildMapSearchUrl(state);
}

export function extractMapPathFromText(text: string): string | null {
  const match = text.match(/(\/(?:buy\/)?search\?[^\s)\]"']+)/);
  return match?.[1] ?? null;
}

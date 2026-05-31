import {
  DEFAULT_LISTING_FILTERS,
  type ListingFilters,
  type ListingSort,
} from "./listing-filters";
import type { MapBounds } from "./types/saved-search";
import { decodeMapArea, encodeMapArea, type MapAreaShape } from "./map-area";

export interface SearchUrlState {
  filters: ListingFilters;
  centerLat: number | null;
  centerLng: number | null;
  zoom: number | null;
  bounds: MapBounds | null;
  /** Human-readable place from location search (shareable). */
  placeQuery: string | null;
  /** Amenity/keyword text filter from AI search (shareable). */
  keywords: string | null;
  /** Active listing in map/list UI (restored on return from detail). */
  selectedId: string | null;
  /** User-drawn search area (rectangle or polygon), shareable via URL. */
  drawnArea: MapAreaShape | null;
}

function parseNum(v: string | null): number | null {
  if (v == null || v === "") return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

export function parseSearchUrlState(
  params: URLSearchParams | Record<string, string | string[] | undefined>
): SearchUrlState {
  const get = (key: string): string | null => {
    const raw = params instanceof URLSearchParams ? params.get(key) : params[key];
    if (Array.isArray(raw)) return raw[0] ?? null;
    return raw ?? null;
  };

  const category = get("category") || DEFAULT_LISTING_FILTERS.category;
  const sort = (get("sort") as ListingSort) || DEFAULT_LISTING_FILTERS.sort;
  const priceMin = parseNum(get("priceMin"));
  const priceMax = parseNum(get("priceMax"));
  const subCategory = get("sub") || "";
  const bhk = get("bhk") || "";
  const furnishing = get("furn") || "";
  const tenantPreference = get("tenant") || "";
  const areaMin = parseNum(get("areaMin"));
  const areaMax = parseNum(get("areaMax"));
  const centerLat = parseNum(get("lat"));
  const centerLng = parseNum(get("lng"));
  const zoom = parseNum(get("zoom"));

  const north = parseNum(get("north"));
  const south = parseNum(get("south"));
  const east = parseNum(get("east"));
  const west = parseNum(get("west"));
  const bounds =
    north != null && south != null && east != null && west != null
      ? { north, south, east, west }
      : null;

  const placeQuery = get("q")?.trim() || null;
  const keywords = get("keywords")?.trim() || null;
  const selectedId = get("selected")?.trim() || null;
  const drawnArea = decodeMapArea(get("area"));

  return {
    filters: {
      category,
      subCategory,
      priceMin,
      priceMax,
      sort,
      bhk,
      furnishing,
      tenantPreference,
      areaMin,
      areaMax,
    },
    centerLat,
    centerLng,
    zoom,
    bounds,
    placeQuery,
    keywords,
    selectedId,
    drawnArea,
  };
}

function roundCoord(n: number): number {
  return Math.round(n * 1e5) / 1e5;
}

/** Canonical query string for stable compare (ignores param order). */
export function normalizeSearchQueryString(qs: string): string {
  if (!qs.trim()) return "";
  return searchUrlQueryString(parseSearchUrlState(new URLSearchParams(qs)));
}

/** Query string only (stable order) for compare / replace. */
export function searchUrlQueryString(state: SearchUrlState): string {
  const p = new URLSearchParams();
  const { filters, centerLat, centerLng, zoom, bounds, placeQuery, keywords, selectedId, drawnArea } =
    state;

  if (filters.category && filters.category !== "All") {
    p.set("category", filters.category);
  }
  if (filters.subCategory) p.set("sub", filters.subCategory);
  if (filters.priceMin != null && filters.priceMin > 0) {
    p.set("priceMin", String(filters.priceMin));
  }
  if (filters.priceMax != null && filters.priceMax > 0) {
    p.set("priceMax", String(filters.priceMax));
  }
  if (filters.sort && filters.sort !== "recommended") {
    p.set("sort", filters.sort);
  }
  if (filters.bhk) p.set("bhk", filters.bhk);
  if (filters.furnishing) p.set("furn", filters.furnishing);
  if (filters.tenantPreference) p.set("tenant", filters.tenantPreference);
  if (filters.areaMin != null && filters.areaMin > 0) {
    p.set("areaMin", String(filters.areaMin));
  }
  if (filters.areaMax != null && filters.areaMax > 0) {
    p.set("areaMax", String(filters.areaMax));
  }
  if (centerLat != null) p.set("lat", String(roundCoord(centerLat)));
  if (centerLng != null) p.set("lng", String(roundCoord(centerLng)));
  if (zoom != null) p.set("zoom", String(Math.round(zoom)));
  if (bounds) {
    p.set("north", String(roundCoord(bounds.north)));
    p.set("south", String(roundCoord(bounds.south)));
    p.set("east", String(roundCoord(bounds.east)));
    p.set("west", String(roundCoord(bounds.west)));
  }
  if (placeQuery) p.set("q", placeQuery);
  if (keywords) p.set("keywords", keywords);
  if (selectedId) p.set("selected", selectedId);
  const encodedArea = encodeMapArea(drawnArea ?? null);
  if (encodedArea) p.set("area", encodedArea);

  return p.toString();
}

export function buildSearchUrl(state: SearchUrlState): string {
  const qs = searchUrlQueryString(state);
  return qs ? `/search?${qs}` : "/search";
}

/** Viewport + filters key (excludes selected listing + drawn area) for change detection. */
export function searchViewQueryString(state: SearchUrlState): string {
  return searchUrlQueryString({ ...state, selectedId: null, drawnArea: null });
}

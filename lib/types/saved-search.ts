import type { ListingFilters, ListingSort } from "../listing-filters";
import type { MapAreaShape } from "../map-area";

export interface MapBounds {
  north: number;
  south: number;
  east: number;
  west: number;
}

export interface SavedSearch {
  id: string;
  userId: string;
  name: string;
  /** Human-readable place label from map search (optional, add-only). */
  placeQuery?: string | null;
  /** Amenity/keyword text filter (optional, add-only). */
  keywords?: string | null;
  category: string;
  /** Optional subcategory refinement (e.g. "Apartments / Flats"). */
  subCategory: string | null;
  priceMin: number | null;
  priceMax: number | null;
  sort: ListingSort;
  /** Structured residential attribute filters (null = any). */
  bhk: string | null;
  furnishing: string | null;
  tenantPreference: string | null;
  areaMin: number | null;
  areaMax: number | null;
  bounds: MapBounds | null;
  centerLat: number | null;
  centerLng: number | null;
  zoom: number | null;
  /** User-drawn search area (rectangle/polygon), persisted as encoded string. */
  drawnArea: MapAreaShape | null;
  alertsEnabled: boolean;
  source: "web";
  createdAtMs: number;
  updatedAtMs: number;
}

export interface SaveSearchInput {
  name?: string;
  placeQuery?: string | null;
  keywords?: string | null;
  filters: ListingFilters;
  bounds: MapBounds | null;
  centerLat: number | null;
  centerLng: number | null;
  zoom: number | null;
  drawnArea?: MapAreaShape | null;
  alertsEnabled?: boolean;
}

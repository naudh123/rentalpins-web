import { FieldValue, Timestamp } from "firebase-admin/firestore";
import { adminDb } from "./firebase-admin";
import { boundsAroundCenter } from "./map-bounds";
import { fetchListingsInBounds } from "./listings";
import {
  DEFAULT_LISTING_FILTERS,
  applyListingFilters,
  applyTextSearchFilter,
  type ListingFilters,
  type ListingSort,
} from "./listing-filters";
import { decodeMapArea, shapeToBounds, type MapAreaShape } from "./map-area";
import { pointInArea } from "./map-geometry";
import type { ListingCard } from "./types/listing";
import type { MapBounds } from "./types/saved-search";

const SEARCH_ALERTS = "search_alerts";
const SAVED_SEARCHES = "saved_searches";

interface SavedSearchRecord {
  id: string;
  userId: string;
  name: string;
  keywords: string | null;
  category: string;
  subCategory: string | null;
  priceMin: number | null;
  priceMax: number | null;
  sort: ListingSort;
  bhk: string | null;
  furnishing: string | null;
  tenantPreference: string | null;
  areaMin: number | null;
  areaMax: number | null;
  bounds: MapBounds | null;
  centerLat: number | null;
  centerLng: number | null;
  zoom: number | null;
  drawnArea: MapAreaShape | null;
  alertsEnabled: boolean;
  lastAlertedAtMs: number;
  createdAtMs: number;
}

export interface SavedSearchAlertsRunResult {
  searchesChecked: number;
  alertsCreated: number;
  skippedNoBounds: number;
  /** Saved searches where geohash sample may not cover the full area. */
  coverageLimitedSearches: number;
}

function tsToMs(v: unknown): number {
  if (v instanceof Timestamp) return v.toMillis();
  if (v && typeof v === "object" && "toMillis" in v) {
    return (v as Timestamp).toMillis();
  }
  return 0;
}

function docToSavedSearchRecord(
  id: string,
  data: Record<string, unknown>
): SavedSearchRecord {
  const boundsRaw = data.bounds as Record<string, number> | undefined;
  const bounds =
    boundsRaw &&
    typeof boundsRaw.north === "number" &&
    typeof boundsRaw.south === "number" &&
    typeof boundsRaw.east === "number" &&
    typeof boundsRaw.west === "number"
      ? {
          north: boundsRaw.north,
          south: boundsRaw.south,
          east: boundsRaw.east,
          west: boundsRaw.west,
        }
      : null;

  return {
    id,
    userId: String(data.userId ?? ""),
    name: String(data.name ?? "Saved search"),
    keywords:
      typeof data.keywords === "string" && data.keywords.trim()
        ? data.keywords.trim()
        : null,
    category: String(data.category ?? "All"),
    subCategory:
      typeof data.subCategory === "string" && data.subCategory ? data.subCategory : null,
    priceMin: typeof data.priceMin === "number" ? data.priceMin : null,
    priceMax: typeof data.priceMax === "number" ? data.priceMax : null,
    sort: (data.sort as ListingSort) || "recommended",
    bhk: typeof data.bhk === "string" && data.bhk ? data.bhk : null,
    furnishing:
      typeof data.furnishing === "string" && data.furnishing ? data.furnishing : null,
    tenantPreference:
      typeof data.tenantPreference === "string" && data.tenantPreference
        ? data.tenantPreference
        : null,
    areaMin: typeof data.areaMin === "number" ? data.areaMin : null,
    areaMax: typeof data.areaMax === "number" ? data.areaMax : null,
    bounds,
    centerLat: typeof data.centerLat === "number" ? data.centerLat : null,
    centerLng: typeof data.centerLng === "number" ? data.centerLng : null,
    zoom: typeof data.zoom === "number" ? data.zoom : null,
    drawnArea: decodeMapArea(typeof data.area === "string" ? data.area : null),
    alertsEnabled: data.alertsEnabled !== false,
    lastAlertedAtMs:
      tsToMs(data.lastAlertedAt) || tsToMs(data.createdAt) || Date.now(),
    createdAtMs: tsToMs(data.createdAt),
  };
}

function boundsForSavedSearch(search: SavedSearchRecord): MapBounds | null {
  if (search.drawnArea) return shapeToBounds(search.drawnArea);
  if (search.bounds) return search.bounds;
  if (search.centerLat != null && search.centerLng != null) {
    return boundsAroundCenter(
      search.centerLat,
      search.centerLng,
      search.zoom ?? 12
    );
  }
  return null;
}

function filtersForSavedSearch(search: SavedSearchRecord): ListingFilters {
  return {
    category: search.category || DEFAULT_LISTING_FILTERS.category,
    subCategory: search.subCategory ?? "",
    priceMin: search.priceMin,
    priceMax: search.priceMax,
    sort: search.sort || DEFAULT_LISTING_FILTERS.sort,
    bhk: search.bhk ?? "",
    furnishing: search.furnishing ?? "",
    tenantPreference: search.tenantPreference ?? "",
    areaMin: search.areaMin,
    areaMax: search.areaMax,
  };
}

function listingActivityMs(listing: ListingCard): number {
  return new Date(listing.updatedAt || listing.createdAt).getTime();
}

function isNewMatch(listing: ListingCard, sinceMs: number): boolean {
  return listingActivityMs(listing) > sinceMs;
}

/**
 * Cron job: find listings that newly match saved searches and write search_alerts docs.
 * Idempotent alert doc id: `{savedSearchId}_{listingId}`.
 */
export async function runSavedSearchAlerts(): Promise<SavedSearchAlertsRunResult> {
  const snap = await adminDb
    .collection(SAVED_SEARCHES)
    .where("alertsEnabled", "==", true)
    .get();

  const result: SavedSearchAlertsRunResult = {
    searchesChecked: 0,
    alertsCreated: 0,
    skippedNoBounds: 0,
    coverageLimitedSearches: 0,
  };

  const now = Date.now();

  for (const doc of snap.docs) {
    const search = docToSavedSearchRecord(doc.id, doc.data());
    if (!search.userId) continue;

    const bounds = boundsForSavedSearch(search);
    if (!bounds) {
      result.skippedNoBounds++;
      continue;
    }

    result.searchesChecked++;
    const sinceMs = search.lastAlertedAtMs || search.createdAtMs || now - 86_400_000;

    const filters = filtersForSavedSearch(search);
    const { listings: fetched, prefixCapActive, resultsMayBeIncomplete } =
      await fetchListingsInBounds(bounds, filters, { zoom: search.zoom });
    const coverageMayBeIncomplete = Boolean(prefixCapActive || resultsMayBeIncomplete);
    if (coverageMayBeIncomplete) result.coverageLimitedSearches++;
    // Enforce subcategory + structured attribute filters (BHK/furnishing/
    // tenant/area) client-side — fetchListingsInBounds only narrows by
    // category/price server-side.
    let listings = applyListingFilters(fetched, filters);
    if (search.keywords) {
      listings = applyTextSearchFilter(listings, search.keywords);
    }

    const area = search.drawnArea;
    for (const listing of listings) {
      if (!isNewMatch(listing, sinceMs)) continue;
      if (area && !pointInArea(listing.lat, listing.lng, area)) continue;

      const alertId = `${search.id}_${listing.id}`;
      const alertRef = adminDb.collection(SEARCH_ALERTS).doc(alertId);

      try {
        await alertRef.create({
          userId: search.userId,
          savedSearchId: search.id,
          savedSearchName: search.name,
          listingId: listing.id,
          listingTitle: listing.title,
          listingPrice: listing.price,
          listingImageUrl: listing.imageUrl || "",
          read: false,
          ...(coverageMayBeIncomplete ? { coverageMayBeIncomplete: true } : {}),
          createdAt: FieldValue.serverTimestamp(),
        });
        result.alertsCreated++;
      } catch (err) {
        const code = (err as { code?: number | string }).code;
        if (code !== 6 && code !== "already-exists") throw err;
      }
    }

    await doc.ref.update({
      lastAlertedAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });
  }

  return result;
}

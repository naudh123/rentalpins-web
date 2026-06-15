import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  getDocs,
  orderBy,
  onSnapshot,
  serverTimestamp,
  type Timestamp,
} from "firebase/firestore";
import { getClientDb } from "./firebase-client";
import type { ListingSort } from "./listing-filters";
import { DEFAULT_LISTING_FILTERS } from "./listing-filters";
import type { SearchUrlState } from "./search-url";
import { decodeMapArea, encodeMapArea } from "./map-area";
import type { MapBounds, SaveSearchInput, SavedSearch } from "./types/saved-search";

const COLLECTION = "saved_searches";

function tsToMs(v: unknown): number {
  if (v && typeof v === "object" && "toMillis" in v) {
    return (v as Timestamp).toMillis();
  }
  return 0;
}

function parseBounds(data: Record<string, unknown>): MapBounds | null {
  const b = data.bounds as Record<string, unknown> | undefined;
  if (!b) return null;
  const north = b.north as number;
  const south = b.south as number;
  const east = b.east as number;
  const west = b.west as number;
  if ([north, south, east, west].every((n) => typeof n === "number")) {
    return { north, south, east, west };
  }
  return null;
}

function docToSavedSearch(id: string, data: Record<string, unknown>): SavedSearch {
  return {
    id,
    userId: (data.userId as string) || "",
    name: (data.name as string) || "Saved search",
    placeQuery:
      typeof data.placeQuery === "string" && data.placeQuery.trim()
        ? data.placeQuery.trim()
        : null,
    keywords:
      typeof data.keywords === "string" && data.keywords.trim()
        ? data.keywords.trim()
        : null,
    category: (data.category as string) || "All",
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
    bounds: parseBounds(data),
    centerLat: typeof data.centerLat === "number" ? data.centerLat : null,
    centerLng: typeof data.centerLng === "number" ? data.centerLng : null,
    zoom: typeof data.zoom === "number" ? data.zoom : null,
    drawnArea: decodeMapArea(typeof data.area === "string" ? data.area : null),
    alertsEnabled: data.alertsEnabled !== false,
    source: "web",
    createdAtMs: tsToMs(data.createdAt),
    updatedAtMs: tsToMs(data.updatedAt),
  };
}

export function buildSavedSearchName(input: SaveSearchInput): string {
  if (input.name?.trim()) return input.name.trim();
  const parts: string[] = [];
  const place = input.placeQuery?.replace(/\s+/g, " ").trim();
  if (place) parts.push(place);
  if (input.filters.category !== "All") parts.push(input.filters.category);
  if (input.filters.bhk) parts.push(input.filters.bhk);
  if (input.filters.furnishing) parts.push(input.filters.furnishing);
  if (input.filters.priceMin != null || input.filters.priceMax != null) {
    const min = input.filters.priceMin ?? 0;
    const max = input.filters.priceMax != null ? `–${input.filters.priceMax}` : "+";
    parts.push(`₹${min}${max}`);
  }
  if (input.filters.sort !== "recommended") {
    parts.push(input.filters.sort.replace("_", " "));
  }
  const kw = input.keywords?.replace(/\s+/g, " ").trim();
  if (kw) parts.push(kw.length > 24 ? `${kw.slice(0, 21)}...` : kw);
  if (parts.length) {
    const name = parts.join(" · ");
    return name.length > 72 ? `${name.slice(0, 69).trimEnd()}...` : name;
  }
  return "Map area search";
}

function normalizedPlaceQuery(value: string | null | undefined): string {
  return value?.replace(/\s+/g, " ").trim().toLowerCase() ?? "";
}

function normalizedKeywords(value: string | null | undefined): string {
  return value?.replace(/\s+/g, " ").trim().toLowerCase() ?? "";
}

function nearlyEqual(a: number | null | undefined, b: number | null | undefined, epsilon = 0.0001): boolean {
  if (a == null && b == null) return true;
  if (a == null || b == null) return false;
  return Math.abs(a - b) <= epsilon;
}

function boundsEqual(a: MapBounds | null | undefined, b: MapBounds | null | undefined): boolean {
  if (!a && !b) return true;
  if (!a || !b) return false;
  return (
    nearlyEqual(a.north, b.north) &&
    nearlyEqual(a.south, b.south) &&
    nearlyEqual(a.east, b.east) &&
    nearlyEqual(a.west, b.west)
  );
}

function sameSavedSearch(
  data: Record<string, unknown>,
  input: SaveSearchInput
): boolean {
  const dataBounds = parseBounds(data);
  const dataPlace = normalizedPlaceQuery(
    typeof data.placeQuery === "string" ? data.placeQuery : null
  );
  const inputPlace = normalizedPlaceQuery(input.placeQuery ?? null);
  const dataKeywords = normalizedKeywords(
    typeof data.keywords === "string" ? data.keywords : null
  );
  const inputKeywords = normalizedKeywords(input.keywords ?? null);
  return (
    (data.category as string) === input.filters.category &&
    (data.sort as ListingSort) === input.filters.sort &&
    (typeof data.priceMin === "number" ? data.priceMin : null) ===
      (input.filters.priceMin ?? null) &&
    (typeof data.priceMax === "number" ? data.priceMax : null) ===
      (input.filters.priceMax ?? null) &&
    dataPlace === inputPlace &&
    dataKeywords === inputKeywords &&
    boundsEqual(dataBounds, input.bounds) &&
    nearlyEqual(
      typeof data.centerLat === "number" ? data.centerLat : null,
      input.centerLat ?? null
    ) &&
    nearlyEqual(
      typeof data.centerLng === "number" ? data.centerLng : null,
      input.centerLng ?? null
    ) &&
    nearlyEqual(typeof data.zoom === "number" ? data.zoom : null, input.zoom ?? null, 0.5) &&
    (typeof data.area === "string" ? data.area : null) ===
      encodeMapArea(input.drawnArea ?? null) &&
    (typeof data.subCategory === "string" ? data.subCategory : "") ===
      (input.filters.subCategory ?? "") &&
    (typeof data.bhk === "string" ? data.bhk : "") === (input.filters.bhk ?? "") &&
    (typeof data.furnishing === "string" ? data.furnishing : "") ===
      (input.filters.furnishing ?? "") &&
    (typeof data.tenantPreference === "string" ? data.tenantPreference : "") ===
      (input.filters.tenantPreference ?? "") &&
    (typeof data.areaMin === "number" ? data.areaMin : null) ===
      (input.filters.areaMin ?? null) &&
    (typeof data.areaMax === "number" ? data.areaMax : null) ===
      (input.filters.areaMax ?? null)
  );
}

export async function createSavedSearch(
  userId: string,
  input: SaveSearchInput
): Promise<{ id: string; created: boolean; reactivated: boolean }> {
  const db = getClientDb();
  const existingSnap = await getDocs(
    query(collection(db, COLLECTION), where("userId", "==", userId))
  );
  for (const snap of existingSnap.docs) {
    const data = snap.data() as Record<string, unknown>;
    if (sameSavedSearch(data, input)) {
      const alertsWereEnabled = data.alertsEnabled !== false;
      const reactivated = Boolean(input.alertsEnabled) && !alertsWereEnabled;
      await updateDoc(doc(db, COLLECTION, snap.id), {
        ...(reactivated
          ? { alertsEnabled: true, lastAlertedAt: serverTimestamp() }
          : {}),
        updatedAt: serverTimestamp(),
      });
      return { id: snap.id, created: false, reactivated };
    }
  }

  const name = buildSavedSearchName(input);
  const encodedArea = encodeMapArea(input.drawnArea ?? null);
  const ref = await addDoc(collection(db, COLLECTION), {
    userId,
    name,
    ...(input.placeQuery?.trim()
      ? { placeQuery: input.placeQuery.trim() }
      : {}),
    ...(input.keywords?.trim() ? { keywords: input.keywords.trim() } : {}),
    category: input.filters.category,
    ...(input.filters.subCategory ? { subCategory: input.filters.subCategory } : {}),
    priceMin: input.filters.priceMin,
    priceMax: input.filters.priceMax,
    sort: input.filters.sort,
    ...(input.filters.bhk ? { bhk: input.filters.bhk } : {}),
    ...(input.filters.furnishing ? { furnishing: input.filters.furnishing } : {}),
    ...(input.filters.tenantPreference
      ? { tenantPreference: input.filters.tenantPreference }
      : {}),
    ...(input.filters.areaMin != null && input.filters.areaMin > 0
      ? { areaMin: input.filters.areaMin }
      : {}),
    ...(input.filters.areaMax != null && input.filters.areaMax > 0
      ? { areaMax: input.filters.areaMax }
      : {}),
    bounds: input.bounds,
    centerLat: input.centerLat,
    centerLng: input.centerLng,
    zoom: input.zoom,
    ...(encodedArea ? { area: encodedArea } : {}),
    alertsEnabled: input.alertsEnabled ?? true,
    lastAlertedAt: serverTimestamp(),
    source: "web",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return { id: ref.id, created: true, reactivated: false };
}

export async function deleteSavedSearch(id: string): Promise<void> {
  await deleteDoc(doc(getClientDb(), COLLECTION, id));
}

export async function setSavedSearchAlerts(
  id: string,
  alertsEnabled: boolean
): Promise<void> {
  await updateDoc(doc(getClientDb(), COLLECTION, id), {
    alertsEnabled,
    ...(alertsEnabled ? { lastAlertedAt: serverTimestamp() } : {}),
    updatedAt: serverTimestamp(),
  });
}

export function subscribeSavedSearches(
  userId: string,
  onChange: (searches: SavedSearch[]) => void,
  onError?: (err: Error) => void
): () => void {
  const q = query(
    collection(getClientDb(), COLLECTION),
    where("userId", "==", userId),
    orderBy("updatedAt", "desc")
  );

  return onSnapshot(
    q,
    (snap) => {
      onChange(snap.docs.map((d) => docToSavedSearch(d.id, d.data())));
    },
    (err) => onError?.(err)
  );
}

export function savedSearchToUrlState(search: SavedSearch): SearchUrlState {
  return {
    filters: {
      transactionType: DEFAULT_LISTING_FILTERS.transactionType,
      category: search.category,
      subCategory: search.subCategory ?? "",
      priceMin: search.priceMin,
      priceMax: search.priceMax,
      sort: search.sort,
      bhk: search.bhk ?? "",
      furnishing: search.furnishing ?? "",
      tenantPreference: search.tenantPreference ?? "",
      areaMin: search.areaMin,
      areaMax: search.areaMax,
    },
    centerLat: search.centerLat,
    centerLng: search.centerLng,
    zoom: search.zoom,
    bounds: search.bounds,
    placeQuery: search.placeQuery ?? null,
    keywords: search.keywords ?? null,
    selectedId: null,
    drawnArea: search.drawnArea ?? null,
  };
}

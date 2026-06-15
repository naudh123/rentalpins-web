import type { CollectionReference, QuerySnapshot } from "firebase-admin/firestore";
import { adminDb } from "./firebase-admin";
import {
  applyListingFilters,
  DEFAULT_LISTING_FILTERS,
  type ListingFilters,
} from "./listing-filters";
import type { ListingCard, ListingDetail, MapBounds } from "./types/listing";
import { parseListingAttributes } from "./listing-attributes";
import { parseTransactionType } from "./transaction-type";
import {
  bonusLimitPerPrefix,
  capGeohashPrefixesNearCenter,
  geohashMaxPrefixesForZoom,
  GEOHASH_CENTER_BOOST_PREFIXES,
  geohashPrefixesForViewport,
  isLikelyGeohashPrefixCapped,
  sortGeohashPrefixesNearCenter,
  isLikelyResultCapSaturated,
  limitPerPrefixForZoom,
} from "./geohash-bounds";
import { logListingsFetchMetrics } from "./listings-fetch-metrics";

export interface ListingsInBoundsResult {
  listings: ListingCard[];
  /** Count before category/price/sort filters (for “X of Y” UI). */
  totalInBounds: number;
  /** Count after filters in this geohash sample. */
  filteredCount: number;
  /** True when geohash query likely hit density cap — prompt user to zoom in. */
  resultsMayBeIncomplete?: boolean;
  /** True when viewport grid exceeded prefix budget (center cells queried). */
  prefixCapActive?: boolean;
}

export { geohashPrefixesForBounds } from "./geohash-bounds";

function collectImageUrls(d: Record<string, unknown>): string[] {
  const pools = [
    d.imagesFull,
    d.imageUrls,
    d.imageThumbnails,
    d.imageIcons,
  ] as unknown[];
  const urls: string[] = [];
  const seen = new Set<string>();
  for (const pool of pools) {
    if (!Array.isArray(pool)) continue;
    for (const raw of pool) {
      const u = sanitizeImageUrl(raw);
      if (u && !seen.has(u)) {
        seen.add(u);
        urls.push(u);
      }
    }
  }
  return urls;
}

function sanitizeImageUrl(raw: unknown): string {
  if (typeof raw !== "string") return "";
  const u = raw.trim();
  if (!u.startsWith("https://")) return "";
  try {
    return new URL(u).protocol === "https:" ? u : "";
  } catch {
    return "";
  }
}

function firstString(arr: unknown): string {
  return Array.isArray(arr) && typeof arr[0] === "string" ? arr[0] : "";
}

function str(v: unknown, fallback = ""): string {
  return typeof v === "string" ? v : fallback;
}

function num(v: unknown, fallback = 0): number {
  return typeof v === "number" ? v : fallback;
}

function docToCard(id: string, d: Record<string, unknown>): ListingCard | null {
  const position = d.position as Record<string, unknown> | undefined;
  const geopoint = position?.geopoint as Record<string, unknown> | undefined;
  const lat =
    (geopoint?.latitude as number | undefined) ??
    (geopoint?._latitude as number | undefined);
  const lng =
    (geopoint?.longitude as number | undefined) ??
    (geopoint?._longitude as number | undefined);
  if (typeof lat !== "number" || typeof lng !== "number") return null;

  const imageUrl = sanitizeImageUrl(
    firstString(d.imageThumbnails) ||
      firstString(d.imageIcons) ||
      firstString(d.imageUrls) ||
      firstString(d.imagesFull) ||
      ""
  );

  const priceRaw = d.price;
  const price =
    typeof priceRaw === "number"
      ? priceRaw
      : parseFloat(String(priceRaw ?? "")) || 0;

  return {
    id,
    title: str(d.title, "Untitled"),
    description: str(d.description),
    price,
    priceUnit: str(d.priceUnit, "per month"),
    category: str(d.category, "Others"),
    subCategory: str(d.subCategory),
    locationName: str(d.locationName),
    imageUrl,
    lat,
    lng,
    isPromoted: d.isPromoted === true,
    viewsCount: num(d.viewsCount),
    inquiryCount: num(d.inquiryCount),
    ownerPhone: str(d.ownerPhone),
    ownerPhoneVerified:
      d.ownerPhoneVerified === true
        ? true
        : d.ownerPhoneVerified === false
          ? false
          : undefined,
    homeIso: str(d.homeIso) || str(d.iso) || undefined,
    attributes: parseListingAttributes(d),
    urlSlug: str(d.urlSlug) || undefined,
    transactionType: parseTransactionType(d.transactionType),
    createdAt:
      (d.createdAt as { toDate?: () => Date })?.toDate?.()?.toISOString?.() ||
      new Date().toISOString(),
    updatedAt:
      (d.updatedAt as { toDate?: () => Date })?.toDate?.()?.toISOString?.() ||
      (d.createdAt as { toDate?: () => Date })?.toDate?.()?.toISOString?.() ||
      new Date().toISOString(),
  };
}

function listingInGeohashBounds(card: ListingCard, bounds: MapBounds): boolean {
  if (card.lat < bounds.south || card.lat > bounds.north) return false;
  if (bounds.west <= bounds.east) {
    return card.lng >= bounds.west && card.lng <= bounds.east;
  }
  return card.lng <= bounds.east || card.lng >= bounds.west;
}

async function fetchGeohashPrefixWave(
  prefixes: string[],
  limitPerPrefix: number,
  listingsRef: CollectionReference
) {
  if (prefixes.length === 0) return [];

  return Promise.all(
    prefixes.map((prefix) =>
      listingsRef
        .where("isActive", "==", true)
        .where("position.geohash", ">=", prefix)
        .where("position.geohash", "<=", prefix + "\uf8ff")
        .limit(limitPerPrefix)
        .get()
        .catch((err) => {
          console.error("geohash query failed:", prefix, err);
          return null;
        })
    )
  );
}

function mergeGeohashSnapshots(
  snapshots: Array<QuerySnapshot | null>,
  bounds: MapBounds,
  seen: Set<string>,
  all: ListingCard[]
) {
  for (const snap of snapshots) {
    if (!snap) continue;
    for (const doc of snap.docs) {
      if (seen.has(doc.id)) continue;
      const card = docToCard(doc.id, doc.data());
      if (!card || !listingInGeohashBounds(card, bounds)) continue;
      seen.add(doc.id);
      all.push(card);
    }
  }
}

export async function fetchListingsInBounds(
  bounds: MapBounds,
  filters: ListingFilters = DEFAULT_LISTING_FILTERS,
  options?: { zoom?: number | null; limitPerPrefix?: number }
): Promise<ListingsInBoundsResult> {
  const limitPerPrefix = options?.limitPerPrefix ?? limitPerPrefixForZoom(options?.zoom);
  const { prefixes: rawPrefixes, gridSteps } = geohashPrefixesForViewport(
    bounds,
    options?.zoom
  );
  const prefixCapActive = isLikelyGeohashPrefixCapped(bounds, options?.zoom);
  const centerLat = (bounds.north + bounds.south) / 2;
  const centerLng = (bounds.west + bounds.east) / 2;
  const sorted = sortGeohashPrefixesNearCenter(rawPrefixes, centerLat, centerLng);
  const prefixes = capGeohashPrefixesNearCenter(
    sorted,
    centerLat,
    centerLng,
    geohashMaxPrefixesForZoom(options?.zoom)
  );
  const listingsRef = adminDb.collection("listings");

  const seen = new Set<string>();
  const all: ListingCard[] = [];

  const primaryWaveCount = 1;
  const snapshots = await fetchGeohashPrefixWave(prefixes, limitPerPrefix, listingsRef);
  mergeGeohashSnapshots(snapshots, bounds, seen, all);

  let boostWaveCount = 0;
  let boostLimitPerPrefix: number | undefined;
  if (
    all.length > 0 &&
    isLikelyResultCapSaturated(all.length, gridSteps, limitPerPrefix)
  ) {
    const boostPrefixes = prefixes.slice(0, GEOHASH_CENTER_BOOST_PREFIXES);
    boostLimitPerPrefix = bonusLimitPerPrefix(limitPerPrefix);
    boostWaveCount = 1;
    const boostSnaps = await fetchGeohashPrefixWave(
      boostPrefixes,
      boostLimitPerPrefix,
      listingsRef
    );
    mergeGeohashSnapshots(boostSnaps, bounds, seen, all);
  }

  const totalInBounds = all.length;
  const listings = applyListingFilters(all, filters);
  const filteredCount = listings.length;
  const resultsMayBeIncomplete =
    prefixCapActive ||
    isLikelyResultCapSaturated(totalInBounds, gridSteps, limitPerPrefix);

  logListingsFetchMetrics({
    zoom: options?.zoom,
    rawPrefixCount: rawPrefixes.length,
    queriedPrefixCount: prefixes.length,
    prefixCapActive,
    primaryWaveCount,
    boostWaveCount,
    limitPerPrefix,
    boostLimitPerPrefix,
    totalInBounds,
    filteredCount,
    resultsMayBeIncomplete,
  });

  return { listings, totalInBounds, filteredCount, resultsMayBeIncomplete, prefixCapActive };
}

export async function fetchListingById(id: string): Promise<ListingDetail | null> {
  const doc = await adminDb.collection("listings").doc(id).get();
  if (!doc.exists) return null;
  const raw = doc.data() as Record<string, unknown>;
  if (raw.isActive !== true) return null;

  const card = docToCard(doc.id, raw);
  if (!card) return null;

  const imageUrls = collectImageUrls(raw);
  return {
    ...card,
    imageUrl: card.imageUrl || imageUrls[0] || "",
    imageUrls: imageUrls.length ? imageUrls : card.imageUrl ? [card.imageUrl] : [],
    ownerUid: str(raw.ownerUid),
  };
}

function haversineKm(aLat: number, aLng: number, bLat: number, bLng: number): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(bLat - aLat);
  const dLng = toRad(bLng - aLng);
  const lat1 = toRad(aLat);
  const lat2 = toRad(bLat);
  const sinDLat = Math.sin(dLat / 2);
  const sinDLng = Math.sin(dLng / 2);
  const h =
    sinDLat * sinDLat +
    Math.cos(lat1) * Math.cos(lat2) * sinDLng * sinDLng;
  return 6371 * (2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h)));
}

export async function fetchSimilarListingsNearby(
  listing: ListingDetail,
  limit = 6
): Promise<ListingCard[]> {
  const latRadius = 0.12;
  const lngRadius = 0.12;
  const bounds: MapBounds = {
    north: listing.lat + latRadius,
    south: listing.lat - latRadius,
    east: listing.lng + lngRadius,
    west: listing.lng - lngRadius,
  };

  const { listings } = await fetchListingsInBounds(bounds, {
    ...DEFAULT_LISTING_FILTERS,
    transactionType: listing.transactionType ?? "rent",
    category: listing.category || DEFAULT_LISTING_FILTERS.category,
  }, {
    limitPerPrefix: 20,
  });
  const candidates = listings
    .filter((card) => card.id !== listing.id)
    .map((card) => ({
      card,
      distanceKm: haversineKm(listing.lat, listing.lng, card.lat, card.lng),
      categoryMatch: card.category === listing.category ? 1 : 0,
    }))
    .sort((a, b) => {
      if (b.categoryMatch !== a.categoryMatch) {
        return b.categoryMatch - a.categoryMatch;
      }
      return a.distanceKm - b.distanceKm;
    })
    .slice(0, limit)
    .map((entry) => entry.card);

  return candidates;
}

/** Other active listings by the same owner (newest first). */
export async function fetchMoreFromOwner(
  ownerUid: string,
  excludeListingId: string,
  limit = 4
): Promise<ListingCard[]> {
  if (!ownerUid) return [];

  const snap = await adminDb
    .collection("listings")
    .where("ownerUid", "==", ownerUid)
    .limit(24)
    .get();

  const cards: ListingCard[] = [];
  for (const doc of snap.docs) {
    if (doc.id === excludeListingId) continue;
    const raw = doc.data() as Record<string, unknown>;
    if (raw.isActive !== true) continue;
    const card = docToCard(doc.id, raw);
    if (card) cards.push(card);
  }

  return cards
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, limit);
}

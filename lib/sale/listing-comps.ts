import { fetchListingsInBounds } from "@/lib/listings";
import type { ListingFilters } from "@/lib/listing-filters";
import type { ListingCard, ListingDetail } from "@/lib/types/listing";
import type { MapBounds } from "@/lib/types/saved-search";
import { listingMatchesTransaction } from "@/lib/transaction-type";

export interface ValuationBand {
  low: number;
  mid: number;
  high: number;
  sampleSize: number;
  /** When listing and comps have sqft, indicative ₹/sqft band. */
  perSqftLow?: number;
  perSqftMid?: number;
  perSqftHigh?: number;
}

export interface SaleListingIntelligence {
  band: ValuationBand | null;
  comparables: ListingCard[];
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

function percentile(sorted: number[], p: number): number {
  if (!sorted.length) return 0;
  const idx = (sorted.length - 1) * p;
  const lo = Math.floor(idx);
  const hi = Math.ceil(idx);
  if (lo === hi) return sorted[lo]!;
  const w = idx - lo;
  return sorted[lo]! * (1 - w) + sorted[hi]! * w;
}

/** Comparable total prices for band — uses total or normalizes per-sqft listings. */
function comparablePrice(listing: ListingCard): number | null {
  if (listing.price <= 0) return null;
  const unit = (listing.priceUnit || "").toLowerCase();
  if (unit === "total" || unit === "" || unit.includes("month")) {
    return unit.includes("month") ? null : listing.price;
  }
  if (unit === "per sqft" && listing.attributes?.areaSqft) {
    return listing.price * listing.attributes.areaSqft;
  }
  return listing.price;
}

export function computeValuationBand(
  prices: number[],
  listingSqft?: number
): ValuationBand | null {
  const valid = prices.filter((p) => p > 0).sort((a, b) => a - b);
  if (valid.length < 2) return null;

  const band: ValuationBand = {
    low: Math.round(percentile(valid, 0.25)),
    mid: Math.round(percentile(valid, 0.5)),
    high: Math.round(percentile(valid, 0.75)),
    sampleSize: valid.length,
  };

  if (listingSqft && listingSqft > 0) {
    band.perSqftLow = Math.round(band.low / listingSqft);
    band.perSqftMid = Math.round(band.mid / listingSqft);
    band.perSqftHigh = Math.round(band.high / listingSqft);
  }

  return band;
}

function boundsAroundListing(listing: ListingDetail, km = 3): MapBounds {
  const latDelta = km / 111;
  const lngDelta = km / (111 * Math.cos((listing.lat * Math.PI) / 180));
  return {
    north: listing.lat + latDelta,
    south: listing.lat - latDelta,
    east: listing.lng + lngDelta,
    west: listing.lng - lngDelta,
  };
}

function compFilters(listing: ListingDetail): ListingFilters {
  return {
    transactionType: "sale",
    category: listing.category || "Property",
    subCategory: "",
    priceMin: null,
    priceMax: null,
    sort: "recommended",
    bhk: listing.attributes?.bhk ?? "",
    furnishing: "",
    tenantPreference: "",
    areaMin: null,
    areaMax: null,
  };
}

/**
 * Nearby sale comparables + indicative valuation band for a listing detail page.
 * Returns null band when fewer than 2 priced comps exist.
 */
export async function fetchSaleListingIntelligence(
  listing: ListingDetail,
  limit = 4
): Promise<SaleListingIntelligence> {
  if (!listingMatchesTransaction(listing.transactionType, "sale")) {
    return { band: null, comparables: [] };
  }

  const hasGeo =
    Number.isFinite(listing.lat) &&
    Number.isFinite(listing.lng) &&
    Math.abs(listing.lat) <= 90;

  if (!hasGeo) {
    return { band: null, comparables: [] };
  }

  const bounds = boundsAroundListing(listing);
  const filters = compFilters(listing);
  const { listings: raw } = await fetchListingsInBounds(bounds, filters, {
    limitPerPrefix: 24,
  });

  const candidates = raw
    .filter((card) => card.id !== listing.id && comparablePrice(card) != null)
    .map((card) => ({
      card,
      distanceKm: haversineKm(listing.lat, listing.lng, card.lat, card.lng),
      priceDelta: Math.abs((comparablePrice(card) ?? 0) - listing.price),
      bhkMatch: card.attributes?.bhk === listing.attributes?.bhk ? 1 : 0,
    }))
    .sort((a, b) => {
      if (b.bhkMatch !== a.bhkMatch) return b.bhkMatch - a.bhkMatch;
      if (a.priceDelta !== b.priceDelta) return a.priceDelta - b.priceDelta;
      return a.distanceKm - b.distanceKm;
    });

  const comparables = candidates.slice(0, limit).map((c) => c.card);
  const compPrices = candidates
    .map((c) => comparablePrice(c.card))
    .filter((p): p is number => p != null);

  const band = computeValuationBand(
    compPrices,
    listing.attributes?.areaSqft
  );

  return { band, comparables };
}

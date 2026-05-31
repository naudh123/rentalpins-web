import type { ListingCard } from "./types/listing";

/** ~1.1 m — listings within this radius share one building pin. */
export const BUILDING_GROUP_DECIMALS = 5;

export function buildingGroupKey(
  lat: number,
  lng: number,
  decimals = BUILDING_GROUP_DECIMALS
): string {
  return `${lat.toFixed(decimals)}|${lng.toFixed(decimals)}`;
}

export type MapListingDisplayItem =
  | { kind: "single"; listing: ListingCard }
  | { kind: "building"; key: string; lat: number; lng: number; listings: ListingCard[] };

export function sortListingsByPromotedThenPrice(listings: ListingCard[]): ListingCard[] {
  return [...listings].sort((a, b) => {
    if (a.isPromoted !== b.isPromoted) return a.isPromoted ? -1 : 1;
    const pa = a.price > 0 ? a.price : Number.MAX_SAFE_INTEGER;
    const pb = b.price > 0 ? b.price : Number.MAX_SAFE_INTEGER;
    return pa - pb;
  });
}

export function groupListingsByBuilding(
  listings: ListingCard[]
): Map<string, ListingCard[]> {
  const map = new Map<string, ListingCard[]>();
  for (const listing of listings) {
    if (!Number.isFinite(listing.lat) || !Number.isFinite(listing.lng)) continue;
    const key = buildingGroupKey(listing.lat, listing.lng);
    const group = map.get(key) ?? [];
    group.push(listing);
    map.set(key, group);
  }
  return map;
}

export function buildMapListingDisplayItems(
  listings: ListingCard[]
): MapListingDisplayItem[] {
  const groups = groupListingsByBuilding(listings);
  const items: MapListingDisplayItem[] = [];
  const seen = new Set<string>();

  for (const listing of listings) {
    const key = buildingGroupKey(listing.lat, listing.lng);
    if (seen.has(key)) continue;
    seen.add(key);
    const group = groups.get(key);
    if (!group?.length) continue;
    if (group.length >= 2) {
      items.push({
        kind: "building",
        key,
        lat: listing.lat,
        lng: listing.lng,
        listings: sortListingsByPromotedThenPrice(group),
      });
    } else {
      items.push({ kind: "single", listing: group[0] });
    }
  }
  return items;
}

export function primaryListingInGroup(listings: ListingCard[]): ListingCard {
  return sortListingsByPromotedThenPrice(listings)[0];
}

/** Building group containing selectedId, when zoom is high enough for building pins. */
export function findSelectedBuildingListings(
  selectedId: string | null,
  mapZoom: number,
  listings: ListingCard[],
  minZoom: number
): ListingCard[] | null {
  if (!selectedId || mapZoom < minZoom) return null;
  const groups = groupListingsByBuilding(listings);
  for (const group of groups.values()) {
    if (group.length >= 2 && group.some((l) => l.id === selectedId)) {
      return sortListingsByPromotedThenPrice(group);
    }
  }
  return null;
}

export interface UnitPriceChip {
  listingId: string;
  label: string;
}

/** Distinct price + BHK combos for building cards (Zillow-style unit pills). */
export function unitPriceChips(listings: ListingCard[]): UnitPriceChip[] {
  const seen = new Set<string>();
  const chips: UnitPriceChip[] = [];

  for (const listing of sortListingsByPromotedThenPrice(listings)) {
    const bhk = listing.attributes?.bhk?.trim();
    const pricePart =
      listing.price > 0
        ? listing.price.toLocaleString(
            listing.homeIso === "IN" ? "en-IN" : undefined,
            { maximumFractionDigits: 0 }
          )
        : "Ask";
    const label = bhk ? `${pricePart}+ ${bhk}` : `${pricePart}+`;
    const dedupeKey = `${pricePart}|${bhk ?? ""}`;
    if (seen.has(dedupeKey)) continue;
    seen.add(dedupeKey);
    chips.push({ listingId: listing.id, label });
  }
  return chips.slice(0, 4);
}

export function listingBuildingGroup(
  listing: ListingCard,
  listings: ListingCard[]
): ListingCard[] | null {
  const key = buildingGroupKey(listing.lat, listing.lng);
  const group = groupListingsByBuilding(listings).get(key);
  return group && group.length >= 2 ? sortListingsByPromotedThenPrice(group) : null;
}

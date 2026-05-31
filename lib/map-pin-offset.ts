import { groupListingsByBuilding } from "@/lib/map-building-groups";
import type { ListingCard } from "@/lib/types/listing";

/** Spread radius for co-located pins (meters) when not yet merged into a building pin. */
export const COLOCATED_PIN_OFFSET_METERS = 11;

const METERS_PER_DEGREE_LAT = 111_320;

/**
 * Circular offset so stacked price pins remain clickable below building-merge zoom.
 * True listing coordinates are unchanged for pan/selection; only marker position shifts.
 */
export function displayPositionForListing(
  listing: ListingCard,
  indexInGroup: number,
  groupSize: number
): { lat: number; lng: number } {
  if (groupSize < 2) {
    return { lat: listing.lat, lng: listing.lng };
  }
  const angle = (2 * Math.PI * indexInGroup) / groupSize - Math.PI / 2;
  const metersLat = COLOCATED_PIN_OFFSET_METERS * Math.sin(angle);
  const metersLng = COLOCATED_PIN_OFFSET_METERS * Math.cos(angle);
  const latRad = (listing.lat * Math.PI) / 180;
  const cosLat = Math.max(0.2, Math.cos(latRad));
  return {
    lat: listing.lat + metersLat / METERS_PER_DEGREE_LAT,
    lng: listing.lng + metersLng / (METERS_PER_DEGREE_LAT * cosLat),
  };
}

/** Index of each listing within its co-located building group. */
export function coLocatedPinIndexById(
  pinListings: ListingCard[]
): Map<string, { index: number; groupSize: number }> {
  const groups = groupListingsByBuilding(pinListings);
  const out = new Map<string, { index: number; groupSize: number }>();
  for (const group of groups.values()) {
    if (group.length < 2) continue;
    group.forEach((listing, index) => {
      out.set(listing.id, { index, groupSize: group.length });
    });
  }
  return out;
}

export function markerDisplayPosition(
  listing: ListingCard,
  coLocated: Map<string, { index: number; groupSize: number }>
): { lat: number; lng: number } {
  const slot = coLocated.get(listing.id);
  if (!slot) return { lat: listing.lat, lng: listing.lng };
  return displayPositionForListing(listing, slot.index, slot.groupSize);
}

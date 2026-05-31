import {
  groupListingsByBuilding,
  primaryListingInGroup,
} from "@/lib/map-building-groups";
import {
  coLocatedPinIndexById,
  markerDisplayPosition,
} from "@/lib/map-pin-offset";
import { MAP_CLUSTER_MAX_ZOOM } from "@/lib/map-cluster";
import type { ListingCard } from "@/lib/types/listing";

interface Options {
  listingId: string;
  listings: ListingCard[];
  mapZoom: number;
  buildingPinZoom: number;
  spiderfyPosition?: { lat: number; lng: number } | null;
}

/** Marker position for list-hover ring — mirrors pin display (spiderfy, offset, building). */
export function resolveHoverRingPosition({
  listingId,
  listings,
  mapZoom,
  buildingPinZoom,
  spiderfyPosition,
}: Options): { lat: number; lng: number } | null {
  const listing = listings.find((l) => l.id === listingId);
  if (!listing || !Number.isFinite(listing.lat) || !Number.isFinite(listing.lng)) {
    return null;
  }

  if (spiderfyPosition) return spiderfyPosition;

  const useBuildingPins = mapZoom >= buildingPinZoom;
  if (useBuildingPins) {
    const groups = groupListingsByBuilding(listings);
    for (const group of groups.values()) {
      if (group.length >= 2 && group.some((l) => l.id === listingId)) {
        const primary = primaryListingInGroup(group);
        return { lat: primary.lat, lng: primary.lng };
      }
    }
  }

  if (mapZoom < MAP_CLUSTER_MAX_ZOOM) {
    return { lat: listing.lat, lng: listing.lng };
  }

  const valid = listings.filter((l) => Number.isFinite(l.lat) && Number.isFinite(l.lng));
  const buildingListingIds = new Set<string>();
  if (useBuildingPins) {
    const groups = groupListingsByBuilding(valid);
    for (const group of groups.values()) {
      if (group.length >= 2) {
        for (const l of group) buildingListingIds.add(l.id);
      }
    }
  }
  const pinListings = valid.filter((l) => !buildingListingIds.has(l.id));
  const coLocated = useBuildingPins
    ? new Map<string, { index: number; groupSize: number }>()
    : coLocatedPinIndexById(pinListings);

  return markerDisplayPosition(listing, coLocated);
}

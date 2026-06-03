"use client";

import type { ListingCard as ListingCardData } from "@/lib/types/listing";
import type { MapListingDisplayItem } from "@/lib/map-building-groups";
import ListingCard from "@/components/listings/ListingCard";
import MapBuildingListingCard from "@/components/map/MapBuildingListingCard";
import { MAP_LIST_PAGE_SIZE } from "@/lib/map-list-count";

interface Props {
  items: MapListingDisplayItem[];
  selectedId: string | null;
  highlightedId: string | null;
  onHover: (listing: ListingCardData) => void;
}

/** Paginated map results — two columns on desktop (Zillow-style stack cards). */
export default function MapResultsList({
  items = [],
  selectedId,
  highlightedId,
  onHover,
}: Props) {
  const safeItems = items ?? [];

  return (
    <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
      {safeItems.map((item) => {
        if (item.kind === "building") {
          const primary = item.listings[0];
          return (
            <div
              key={item.key}
              id={`map-listing-${primary.id}`}
              data-listing-id={primary.id}
              role="listitem"
              className="col-span-1 md:col-span-2"
              onMouseEnter={() => onHover(primary)}
            >
              <MapBuildingListingCard
                listings={item.listings}
                source="map"
                selectedId={selectedId}
                highlightedId={highlightedId}
              />
            </div>
          );
        }
        return (
          <div
            key={item.listing.id}
            id={`map-listing-${item.listing.id}`}
            data-listing-id={item.listing.id}
            role="listitem"
            onMouseEnter={() => onHover(item.listing)}
          >
            <ListingCard
              listing={item.listing}
              source="map"
              layout="stack"
              selected={item.listing.id === selectedId}
              highlighted={item.listing.id === highlightedId && item.listing.id !== selectedId}
            />
          </div>
        );
      })}
      {safeItems.length === 0 && (
        <span className="sr-only">No listings on this page</span>
      )}
    </div>
  );
}

/** @deprecated Windowing removed — pagination caps at MAP_LIST_PAGE_SIZE. */
export const MAP_RESULTS_LIST_PAGE_CAP = MAP_LIST_PAGE_SIZE;

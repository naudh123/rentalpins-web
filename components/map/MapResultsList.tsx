"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { ListingCard as ListingCardData } from "@/lib/types/listing";
import { listingDetailHref } from "@/lib/listing-links";
import { listingToSlugInput } from "@/lib/listing-path";
import { trackListingClick } from "@/lib/ga4";
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
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function returnPathFor(listingId: string) {
    const p = new URLSearchParams(searchParams.toString());
    p.set("selected", listingId);
    const qs = p.toString();
    return `${pathname}${qs ? `?${qs}` : ""}`;
  }

  function openListing(listing: ListingCardData) {
    trackListingClick(listing.id, "map");
    router.push(
      listingDetailHref(listingToSlugInput(listing), returnPathFor(listing.id))
    );
  }

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
              className="col-span-1 md:col-span-2 cursor-pointer"
              onMouseEnter={() => onHover(primary)}
              onClick={(e) => {
                const el = e.target as HTMLElement;
                if (el.closest("button, a")) return;
                openListing(primary);
              }}
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
            onClick={(e) => {
              const el = e.target as HTMLElement;
              if (el.closest("button, a")) return;
              openListing(item.listing);
            }}
            onKeyDown={(e) => {
              if (e.key !== "Enter") return;
              e.preventDefault();
              openListing(item.listing);
            }}
            className="cursor-pointer"
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

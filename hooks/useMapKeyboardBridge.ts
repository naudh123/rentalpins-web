"use client";

import { useCallback } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { trackListingClick } from "@/lib/ga4";
import { listingDetailHref } from "@/lib/listing-links";
import type { ListingCard as ListingCardData } from "@/lib/types/listing";
import { useMapKeyboardShortcuts } from "@/hooks/useMapKeyboardShortcuts";
import type { RefObject } from "react";

interface Options {
  listings: ListingCardData[];
  selectedId: string | null;
  mapSearchInputId: string;
  mapRegionRef: RefObject<HTMLElement | null>;
  loading: boolean;
  onClearSelection: () => void;
  onNavigateListing: (listing: ListingCardData) => void;
  onFitAll?: () => void;
  onCycleMobileView?: () => void;
}

/** Keyboard shortcuts + open listing from Enter key. */
export function useMapKeyboardBridge({
  listings,
  selectedId,
  mapSearchInputId,
  mapRegionRef,
  loading,
  onClearSelection,
  onNavigateListing,
  onFitAll,
  onCycleMobileView,
}: Options): void {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const openListingFromKeyboard = useCallback(
    (listingId: string) => {
      const p = new URLSearchParams(searchParams.toString());
      p.set("selected", listingId);
      const qs = p.toString();
      const returnPath = `${pathname}${qs ? `?${qs}` : ""}`;
      trackListingClick(listingId, "map");
      router.push(listingDetailHref(listingId, returnPath));
    },
    [pathname, router, searchParams]
  );

  useMapKeyboardShortcuts({
    listings,
    selectedId,
    mapSearchInputId,
    mapRegionRef,
    onClearSelection,
    onNavigateListing,
    onOpenListing: openListingFromKeyboard,
    onFitAll,
    onCycleMobileView,
    loading,
  });
}

"use client";

import { useEffect, useMemo, useState } from "react";
import {
  applyListingFilters,
  applyTextSearchFilter,
  type ListingFilters,
} from "@/lib/listing-filters";
import { pointInArea } from "@/lib/map-geometry";
import type { MapAreaShape } from "@/lib/map-area";
import { buildMapListingDisplayItems } from "@/lib/map-building-groups";
import type { ListingCard as ListingCardData } from "@/lib/types/listing";
import { MAP_LIST_PAGE_SIZE } from "@/lib/map-list-count";

interface Options {
  rawListings: ListingCardData[];
  filters: ListingFilters;
  textQuery: string;
  drawnShape: MapAreaShape | null;
}

export function useMapFilteredListings({
  rawListings,
  filters,
  textQuery,
  drawnShape,
}: Options) {
  const filteredListings = useMemo(() => {
    const filtered = applyListingFilters(rawListings, filters);
    return applyTextSearchFilter(filtered, textQuery);
  }, [rawListings, filters, textQuery]);

  const listings = useMemo(() => {
    if (!drawnShape) return filteredListings;
    return filteredListings.filter((l) => pointInArea(l.lat, l.lng, drawnShape));
  }, [drawnShape, filteredListings]);

  const listDisplayItems = useMemo(
    () => buildMapListingDisplayItems(listings),
    [listings]
  );

  const listDisplayKey = useMemo(
    () =>
      listDisplayItems
        .map((item) => (item.kind === "building" ? item.key : item.listing.id))
        .join(","),
    [listDisplayItems]
  );

  const [listPage, setListPage] = useState(0);
  const listTotalPages = Math.max(1, Math.ceil(listDisplayItems.length / MAP_LIST_PAGE_SIZE));

  useEffect(() => {
    setListPage(0);
  }, [listDisplayKey]);

  useEffect(() => {
    if (listPage > listTotalPages - 1) {
      setListPage(Math.max(0, listTotalPages - 1));
    }
  }, [listPage, listTotalPages]);

  const paginatedListItems = useMemo(() => {
    const start = listPage * MAP_LIST_PAGE_SIZE;
    return listDisplayItems.slice(start, start + MAP_LIST_PAGE_SIZE);
  }, [listDisplayItems, listPage]);

  return {
    filteredListings,
    listings,
    listDisplayItems,
    listDisplayKey,
    listPage,
    setListPage,
    listTotalPages,
    paginatedListItems,
  };
}

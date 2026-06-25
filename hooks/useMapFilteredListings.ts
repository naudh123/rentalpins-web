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
import {
  mergeSemanticSearchResults,
  semanticRankListings,
  type SemanticScore,
} from "@/lib/semantic-search";

interface Options {
  rawListings: ListingCardData[];
  filters: ListingFilters;
  textQuery: string;
  /** Full natural-language query for embedding similarity (AI bar or keywords). */
  semanticQuery: string;
  drawnShape: MapAreaShape | null;
}

export function useMapFilteredListings({
  rawListings,
  filters,
  textQuery,
  semanticQuery,
  drawnShape,
}: Options) {
  const structurallyFiltered = useMemo(
    () => applyListingFilters(rawListings, filters),
    [rawListings, filters]
  );

  const candidateKey = useMemo(
    () => structurallyFiltered.map((l) => l.id).join(","),
    [structurallyFiltered]
  );

  const [semanticScores, setSemanticScores] = useState<SemanticScore[]>([]);
  const [semanticLoading, setSemanticLoading] = useState(false);

  useEffect(() => {
    const q = semanticQuery.trim();
    if (!q || structurallyFiltered.length === 0) {
      setSemanticScores([]);
      setSemanticLoading(false);
      return;
    }

    let cancelled = false;
    setSemanticLoading(true);

    void semanticRankListings(q, structurallyFiltered.map((l) => l.id))
      .then((result) => {
        if (!cancelled) setSemanticScores(result.scores);
      })
      .catch(() => {
        if (!cancelled) setSemanticScores([]);
      })
      .finally(() => {
        if (!cancelled) setSemanticLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [semanticQuery, candidateKey, structurallyFiltered]);

  const filteredListings = useMemo(() => {
    const q = semanticQuery.trim();
    if (!q) {
      return applyTextSearchFilter(structurallyFiltered, textQuery);
    }
    if (semanticLoading && semanticScores.length === 0) {
      return applyTextSearchFilter(structurallyFiltered, textQuery.trim() || q);
    }
    return mergeSemanticSearchResults(
      structurallyFiltered,
      semanticScores,
      q,
      textQuery
    );
  }, [
    structurallyFiltered,
    semanticQuery,
    textQuery,
    semanticScores,
    semanticLoading,
  ]);

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
    semanticLoading,
  };
}

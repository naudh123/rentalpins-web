"use client";

import { useEffect, useRef } from "react";
import {
  MarkerClusterer,
  type Cluster,
  type MarkerClustererOptions,
} from "@googlemaps/markerclusterer";
import type { ListingCard as ListingCardData } from "@/lib/types/listing";
import { trackEvent } from "@/lib/ga4";
import {
  MAP_CLUSTER_ALGORITHM_OPTIONS,
  MAP_CLUSTER_MAX_ZOOM,
  rentalPinsClusterRenderer,
} from "@/lib/map-cluster";
import { spiderfyPositions } from "@/lib/map-spiderfy";
import {
  groupListingsByBuilding,
  primaryListingInGroup,
} from "@/lib/map-building-groups";
import { MAP_BUILDING_PIN_ZOOM } from "@/lib/map-view-mode";
import {
  coLocatedPinIndexById,
  markerDisplayPosition,
} from "@/lib/map-pin-offset";
import { buildPriceMarkerIcon, buildHoverRingIcon, buildUnitCountMarkerIcon, formatPinPrice } from "@/lib/map-pins";
import { resolveHoverRingPosition } from "@/lib/map-hover-ring-position";
import {
  buildingKeysForAffectedListings,
  buildingMarkerStyleKey,
  isBuildingHoverOnlyHighlight,
  isListingHoverOnlyHighlight,
  listingMarkerIconStyleChanged,
  listingMarkerStyleKey,
  listingMarkerSvgKey,
  mapPinStructureKey,
  selectionAffectedListingIds,
} from "@/lib/map-marker-structure";
import type { MapPinLabelTier } from "@/lib/map-zoom-tier";

interface Props {
  map: google.maps.Map | null;
  listings: ListingCardData[];
  selectedId: string | null;
  highlightedId: string | null;
  labelTier: MapPinLabelTier;
  mapZoom: number;
  buildingPinZoom?: number;
  /** Increment to clear temporary cluster spiderfy positions. */
  spiderfyEpoch?: number;
  /** Skip marker rebuilds while tab/background or full list sheet hides the map. */
  paused?: boolean;
  onClusterZoom?: () => void;
  onSelect: (listing: ListingCardData) => void;
}

function markerIcon(
  listing: ListingCardData,
  selectedId: string | null,
  highlightedId: string | null,
  labelTier: MapPinLabelTier
): google.maps.Icon | undefined {
  if (typeof google === "undefined") return undefined;
  const detailed = labelTier === "detailed";
  const label = detailed
    ? listing.price > 0
      ? listing.price.toLocaleString(
          listing.homeIso === "IN" ? "en-IN" : undefined,
          { maximumFractionDigits: 0 }
        )
      : "Ask"
    : formatPinPrice(listing.price, listing.homeIso);
  return buildPriceMarkerIcon(
    label,
    {
      selected: listing.id === selectedId,
      highlighted: listing.id === highlightedId && listing.id !== selectedId,
      promoted: listing.isPromoted,
    },
    google.maps
  );
}

function markerZIndex(
  listing: ListingCardData,
  selectedId: string | null,
  highlightedId: string | null
): number {
  if (listing.id === selectedId) return 1000;
  if (listing.id === highlightedId) return 750;
  if (listing.isPromoted) return 500;
  return 1;
}

function markerTitle(listing: ListingCardData, labelTier: MapPinLabelTier): string {
  const detailed = labelTier === "detailed";
  const priceLabel = detailed
    ? listing.price > 0
      ? listing.price.toLocaleString(
          listing.homeIso === "IN" ? "en-IN" : undefined,
          { maximumFractionDigits: 0 }
        )
      : "Ask"
    : formatPinPrice(listing.price, listing.homeIso);
  const location = listing.locationName ? `, ${listing.locationName}` : "";
  return `${listing.title}${location}, ${priceLabel}`;
}

const SPIDERFY_MAX_MARKERS = 15;

type MarkerVisualState = {
  svgKey: string;
  styleKey: string;
  title: string;
  z: number;
  lat: number;
  lng: number;
};

function applyListingMarkerVisual(
  marker: google.maps.Marker,
  listing: ListingCardData,
  opts: {
    selectedId: string | null;
    highlightedId: string | null;
    labelTier: MapPinLabelTier;
    position: { lat: number; lng: number };
    stateMap: Map<string, MarkerVisualState>;
    listingId: string;
  }
) {
  const { selectedId, highlightedId, labelTier, position, stateMap, listingId } = opts;
  const svgKey = listingMarkerSvgKey(listing, labelTier);
  const styleKey = listingMarkerStyleKey(listing.id, selectedId, highlightedId);
  const hoverOnly = isListingHoverOnlyHighlight(listing.id, selectedId, highlightedId);
  const title = markerTitle(listing, labelTier);
  const z = markerZIndex(listing, selectedId, highlightedId);
  const prev = stateMap.get(listingId);
  if (!prev || prev.lat !== position.lat || prev.lng !== position.lng) {
    marker.setPosition(position);
  }
  const iconStyleChanged = listingMarkerIconStyleChanged(prev?.styleKey, styleKey, hoverOnly);
  if (!prev || prev.svgKey !== svgKey || iconStyleChanged) {
    marker.setIcon(markerIcon(listing, selectedId, highlightedId, labelTier));
  }
  if (!prev || prev.title !== title) marker.setTitle(title);
  if (!prev || prev.z !== z) marker.setZIndex(z);
  stateMap.set(listingId, { svgKey, styleKey, title, z, lat: position.lat, lng: position.lng });
}

function applyBuildingMarkerVisual(
  marker: google.maps.Marker,
  opts: {
    count: number;
    primary: ListingCardData;
    group: ListingCardData[];
    selectedId: string | null;
    highlightedId: string | null;
    labelTier: MapPinLabelTier;
    stateMap: Map<string, MarkerVisualState>;
    buildingKey: string;
  }
) {
  const { count, primary, group, selectedId, highlightedId, labelTier, stateMap, buildingKey } =
    opts;
  const isSelected = group.some((l) => l.id === selectedId);
  const isHighlighted = group.some(
    (l) => l.id === highlightedId && l.id !== selectedId
  );
  const svgKey = `building|${count}`;
  const styleKey = buildingMarkerStyleKey(group, selectedId, highlightedId);
  const hoverOnly = isBuildingHoverOnlyHighlight(group, selectedId, highlightedId);
  const title =
    count === 1
      ? markerTitle(primary, labelTier)
      : `${count} listings at ${primary.locationName || primary.title}. Click to view.`;
  const z = isSelected ? 1000 : isHighlighted ? 750 : 600;
  const position = { lat: primary.lat, lng: primary.lng };
  const prev = stateMap.get(buildingKey);
  if (!prev || prev.lat !== position.lat || prev.lng !== position.lng) {
    marker.setPosition(position);
  }
  const iconStyleChanged = listingMarkerIconStyleChanged(prev?.styleKey, styleKey, hoverOnly);
  if (!prev || prev.svgKey !== svgKey || iconStyleChanged) {
    marker.setIcon(
      buildUnitCountMarkerIcon(
        count,
        { selected: isSelected, highlighted: isHighlighted },
        google.maps
      )
    );
  }
  if (!prev || prev.title !== title) marker.setTitle(title);
  if (!prev || prev.z !== z) marker.setZIndex(z);
  stateMap.set(buildingKey, { svgKey, styleKey, title, z, lat: position.lat, lng: position.lng });
}

/**
 * Imperative price pins + clustering (keeps map performant with many listings).
 * Updates markers incrementally by listing id to avoid pin flash on viewport refresh.
 */
export default function ListingMarkerCluster({
  map,
  listings,
  selectedId,
  highlightedId,
  labelTier,
  mapZoom,
  buildingPinZoom = MAP_BUILDING_PIN_ZOOM,
  spiderfyEpoch = 0,
  paused = false,
  onClusterZoom,
  onSelect,
}: Props) {
  const clustererRef = useRef<MarkerClusterer | null>(null);
  const markersByIdRef = useRef<Map<string, google.maps.Marker>>(new Map());
  const buildingMarkersByKeyRef = useRef<Map<string, google.maps.Marker>>(new Map());
  /** Last applied visual state per marker — skip redundant SVG/title rebuilds. */
  const markerStateRef = useRef<Map<string, MarkerVisualState>>(new Map());
  const buildingStateRef = useRef<Map<string, MarkerVisualState>>(new Map());
  const markerToListingIdRef = useRef(new WeakMap<google.maps.Marker, string>());
  const onSelectRef = useRef(onSelect);
  onSelectRef.current = onSelect;
  const listingsRef = useRef(listings);
  listingsRef.current = listings;
  const lastPinIdsKeyRef = useRef("");
  const lastStructureKeyRef = useRef("");
  const lastSelectedIdRef = useRef<string | null>(null);
  const lastHighlightedIdRef = useRef<string | null>(null);
  const spiderfyDisplayRef = useRef<Map<string, { lat: number; lng: number }>>(new Map());
  const handleClusterClickRef = useRef<
    (
      event: google.maps.MapMouseEvent,
      cluster: Cluster,
      mapInstance: google.maps.Map
    ) => void
  >(() => {});

  const hoverRingMarkerRef = useRef<google.maps.Marker | null>(null);

  useEffect(() => {
    spiderfyDisplayRef.current.clear();
  }, [spiderfyEpoch]);

  useEffect(() => {
    if (!map || !paused) return;
    hoverRingMarkerRef.current?.setMap(null);
    clustererRef.current?.clearMarkers();
    clustererRef.current?.setMap(null);
    clustererRef.current = null;
    for (const marker of markersByIdRef.current.values()) {
      google.maps.event.clearInstanceListeners(marker);
      marker.setMap(null);
    }
    for (const marker of buildingMarkersByKeyRef.current.values()) {
      google.maps.event.clearInstanceListeners(marker);
      marker.setMap(null);
    }
    markersByIdRef.current.clear();
    buildingMarkersByKeyRef.current.clear();
    markerStateRef.current.clear();
    buildingStateRef.current.clear();
    lastPinIdsKeyRef.current = "";
    lastStructureKeyRef.current = "";
    lastSelectedIdRef.current = null;
    lastHighlightedIdRef.current = null;
  }, [map, paused]);

  useEffect(() => {
    if (!map || paused) return;

    if (mapZoom < MAP_CLUSTER_MAX_ZOOM) {
      spiderfyDisplayRef.current.clear();
    }

    const useBuildingPins = mapZoom >= buildingPinZoom;
    const validListings = listings.filter(
      (l) => Number.isFinite(l.lat) && Number.isFinite(l.lng)
    );
    const buildingGroups = useBuildingPins ? groupListingsByBuilding(validListings) : new Map();
    const buildingListingIds = new Set<string>();
    if (useBuildingPins) {
      for (const group of buildingGroups.values()) {
        if (group.length >= 2) {
          for (const l of group) buildingListingIds.add(l.id);
        }
      }
    }

    const pinListings = validListings.filter((l) => !buildingListingIds.has(l.id));
    const coLocated = useBuildingPins
      ? new Map<string, { index: number; groupSize: number }>()
      : coLocatedPinIndexById(pinListings);
    const nextIds = new Set(pinListings.map((l) => l.id));
    const nextBuildingKeys = new Set<string>();
    if (useBuildingPins) {
      for (const [key, group] of buildingGroups.entries()) {
        if (group.length >= 2) nextBuildingKeys.add(key);
      }
    }

    const pinIdsKey = pinListings
      .map((l) => l.id)
      .sort()
      .join(",");
    const pinVisualKey = pinListings
      .map(
        (l) =>
          `${l.id}|${l.title}|${l.price}|${l.isPromoted ? 1 : 0}|${l.lat}|${l.lng}|${l.homeIso ?? ""}`
      )
      .sort()
      .join(",");
    const buildingKeysKey = [...nextBuildingKeys]
      .sort()
      .map((key) => {
        const group = buildingGroups.get(key)!;
        return `${key}:${group.length}`;
      })
      .join(",");
    const structureKey = mapPinStructureKey({
      useBuildingPins,
      labelTier,
      pinIdsKey: pinVisualKey,
      buildingKeysKey,
    });

    if (structureKey === lastStructureKeyRef.current) {
      const affected = selectionAffectedListingIds(
        lastSelectedIdRef.current,
        lastHighlightedIdRef.current,
        selectedId,
        highlightedId
      );
      if (affected.size > 0) {
        const listingById = new Map(pinListings.map((l) => [l.id, l]));
        for (const id of affected) {
          const listing = listingById.get(id);
          const marker = markersByIdRef.current.get(id);
          if (!listing || !marker) continue;
          let position = markerDisplayPosition(listing, coLocated);
          const spider = spiderfyDisplayRef.current.get(id);
          if (spider) position = spider;
          applyListingMarkerVisual(marker, listing, {
            selectedId,
            highlightedId,
            labelTier,
            position,
            stateMap: markerStateRef.current,
            listingId: id,
          });
        }
        for (const key of buildingKeysForAffectedListings(buildingGroups, affected)) {
          const group = buildingGroups.get(key)! as ListingCardData[];
          const marker = buildingMarkersByKeyRef.current.get(key);
          if (!marker) continue;
          applyBuildingMarkerVisual(marker, {
            count: group.length,
            primary: primaryListingInGroup(group),
            group,
            selectedId,
            highlightedId,
            labelTier,
            stateMap: buildingStateRef.current,
            buildingKey: key,
          });
        }
      }
      lastSelectedIdRef.current = selectedId;
      lastHighlightedIdRef.current = highlightedId;
      return;
    }

    for (const [id, marker] of [...markersByIdRef.current.entries()]) {
      if (nextIds.has(id)) continue;
      clustererRef.current?.removeMarker(marker);
      google.maps.event.clearInstanceListeners(marker);
      marker.setMap(null);
      markersByIdRef.current.delete(id);
      markerStateRef.current.delete(id);
    }

    for (const [key, marker] of [...buildingMarkersByKeyRef.current.entries()]) {
      if (nextBuildingKeys.has(key)) continue;
      google.maps.event.clearInstanceListeners(marker);
      marker.setMap(null);
      buildingMarkersByKeyRef.current.delete(key);
      buildingStateRef.current.delete(key);
    }

    const toAdd: google.maps.Marker[] = [];
    for (const listing of pinListings) {
      let position = markerDisplayPosition(listing, coLocated);
      const spider = spiderfyDisplayRef.current.get(listing.id);
      if (spider) position = spider;

      let marker = markersByIdRef.current.get(listing.id);
      if (!marker) {
        const svgKey = listingMarkerSvgKey(listing, labelTier);
        const styleKey = listingMarkerStyleKey(listing.id, selectedId, highlightedId);
        const title = markerTitle(listing, labelTier);
        const z = markerZIndex(listing, selectedId, highlightedId);
        marker = new google.maps.Marker({
          position,
          title,
          icon: markerIcon(listing, selectedId, highlightedId, labelTier),
          zIndex: z,
          optimized: true,
          clickable: true,
        });
        const listingId = listing.id;
        marker.addListener("click", (e: google.maps.MapMouseEvent) => {
          e.domEvent?.stopPropagation();
          const current = listingsRef.current.find((l) => l.id === listingId);
          if (current) onSelectRef.current(current);
        });
        markersByIdRef.current.set(listing.id, marker);
        markerToListingIdRef.current.set(marker, listing.id);
        markerStateRef.current.set(listing.id, {
          svgKey,
          styleKey,
          title,
          z,
          lat: position.lat,
          lng: position.lng,
        });
        toAdd.push(marker);
      } else {
        applyListingMarkerVisual(marker, listing, {
          selectedId,
          highlightedId,
          labelTier,
          position,
          stateMap: markerStateRef.current,
          listingId: listing.id,
        });
      }
    }

    for (const key of nextBuildingKeys) {
      const group = buildingGroups.get(key)! as ListingCardData[];
      const primary = primaryListingInGroup(group);
      const count = group.length;

      let marker = buildingMarkersByKeyRef.current.get(key);
      if (!marker) {
        marker = new google.maps.Marker({
          position: { lat: primary.lat, lng: primary.lng },
          map,
          title: "",
          icon: buildUnitCountMarkerIcon(count, { selected: false, highlighted: false }, google.maps),
          zIndex: 600,
          optimized: true,
          clickable: true,
        });
        marker.addListener("click", (e: google.maps.MapMouseEvent) => {
          e.domEvent?.stopPropagation();
          onSelectRef.current(primary);
        });
        buildingMarkersByKeyRef.current.set(key, marker);
      }
      applyBuildingMarkerVisual(marker, {
        count,
        primary,
        group,
        selectedId,
        highlightedId,
        labelTier,
        stateMap: buildingStateRef.current,
        buildingKey: key,
      });
      if (!marker.getMap()) marker.setMap(map);
    }

    for (const id of [...spiderfyDisplayRef.current.keys()]) {
      if (!nextIds.has(id)) spiderfyDisplayRef.current.delete(id);
    }

    handleClusterClickRef.current = (_event, cluster, mapInstance) => {
      const count = cluster.count;
      trackEvent("map_cluster_clicked", { count, spiderfy: count <= SPIDERFY_MAX_MARKERS ? "yes" : "no" });
      onClusterZoom?.();

      const zoom = mapInstance.getZoom() ?? 0;
      if (count <= SPIDERFY_MAX_MARKERS && zoom >= MAP_CLUSTER_MAX_ZOOM - 1) {
        const center = cluster.position;
        const lat = center.lat();
        const lng = center.lng();
        const positions = spiderfyPositions(lat, lng, count);
        let index = 0;
        for (const marker of cluster.markers) {
          const listingId = markerToListingIdRef.current.get(marker as google.maps.Marker);
          if (!listingId) continue;
          const pos = positions[index++];
          if (!pos) break;
          spiderfyDisplayRef.current.set(listingId, pos);
          const m = markersByIdRef.current.get(listingId);
          m?.setPosition(pos);
        }
        mapInstance.panTo(center);
        if (zoom < 15) mapInstance.setZoom(15);
        return;
      }

      spiderfyDisplayRef.current.clear();
      const bounds = cluster.bounds;
      if (bounds) mapInstance.fitBounds(bounds, 48);
    };

    if (!clustererRef.current) {
      clustererRef.current = new MarkerClusterer({
        map,
        markers: Array.from(markersByIdRef.current.values()),
        algorithmOptions:
          MAP_CLUSTER_ALGORITHM_OPTIONS as MarkerClustererOptions["algorithmOptions"],
        renderer: rentalPinsClusterRenderer,
        onClusterClick: (event, cluster, mapInstance) => {
          handleClusterClickRef.current(event, cluster, mapInstance);
        },
      });
      lastPinIdsKeyRef.current = pinIdsKey;
    } else if (toAdd.length > 0) {
      clustererRef.current.addMarkers(toAdd);
      lastPinIdsKeyRef.current = pinIdsKey;
    } else if (pinIdsKey !== lastPinIdsKeyRef.current) {
      lastPinIdsKeyRef.current = pinIdsKey;
    }

    lastStructureKeyRef.current = structureKey;
    lastSelectedIdRef.current = selectedId;
    lastHighlightedIdRef.current = highlightedId;
  }, [
    map,
    listings,
    selectedId,
    highlightedId,
    labelTier,
    mapZoom,
    buildingPinZoom,
    onClusterZoom,
    paused,
  ]);

  useEffect(() => {
    if (!map || paused || typeof google === "undefined") {
      hoverRingMarkerRef.current?.setMap(null);
      return;
    }

    const hoverOnly =
      highlightedId != null &&
      highlightedId !== selectedId &&
      isListingHoverOnlyHighlight(highlightedId, selectedId, highlightedId);
    if (!hoverOnly) {
      hoverRingMarkerRef.current?.setMap(null);
      return;
    }

    const spiderfyPosition = spiderfyDisplayRef.current.get(highlightedId) ?? null;
    const position = resolveHoverRingPosition({
      listingId: highlightedId,
      listings,
      mapZoom,
      buildingPinZoom,
      spiderfyPosition,
    });
    if (!position) {
      hoverRingMarkerRef.current?.setMap(null);
      return;
    }

    let ring = hoverRingMarkerRef.current;
    if (!ring) {
      ring = new google.maps.Marker({
        map,
        position,
        icon: buildHoverRingIcon(google.maps),
        zIndex: 700,
        clickable: false,
        optimized: true,
      });
      hoverRingMarkerRef.current = ring;
    } else {
      ring.setPosition(position);
      ring.setMap(map);
      ring.setZIndex(700);
    }
  }, [map, paused, highlightedId, selectedId, listings, mapZoom, buildingPinZoom, spiderfyEpoch]);

  useEffect(() => {
    return () => {
      hoverRingMarkerRef.current?.setMap(null);
      hoverRingMarkerRef.current = null;
      clustererRef.current?.clearMarkers();
      clustererRef.current?.setMap(null);
      markersByIdRef.current.forEach((m) => {
        google.maps.event.clearInstanceListeners(m);
        m.setMap(null);
      });
      buildingMarkersByKeyRef.current.forEach((m) => {
        google.maps.event.clearInstanceListeners(m);
        m.setMap(null);
      });
      markersByIdRef.current.clear();
      buildingMarkersByKeyRef.current.clear();
      markerStateRef.current.clear();
      buildingStateRef.current.clear();
      spiderfyDisplayRef.current.clear();
      lastPinIdsKeyRef.current = "";
      lastStructureKeyRef.current = "";
      lastSelectedIdRef.current = null;
      lastHighlightedIdRef.current = null;
      clustererRef.current = null;
    };
  }, []);

  return null;
}

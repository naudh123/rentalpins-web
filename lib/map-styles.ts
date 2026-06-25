/** RentalPins roadmap themes — rent (silver) vs sale (ivory/gold). */

import type { TransactionType } from "./transaction-type";
import { isRoadmapSurface, resolveMapTypeId, type MapViewMode } from "./map-view-mode";

export type MapSurfaceTransaction = TransactionType;

export const SILVER_MAP_STYLES: google.maps.MapTypeStyle[] = [
  { elementType: "geometry", stylers: [{ color: "#f7f4f0" }] },
  { elementType: "labels.icon", stylers: [{ visibility: "off" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#4a5f7a" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#f7f4f0" }] },
  {
    featureType: "administrative",
    elementType: "geometry",
    stylers: [{ color: "#e8e2da" }],
  },
  {
    featureType: "administrative.country",
    elementType: "labels.text.fill",
    stylers: [{ color: "#8a96a8" }],
  },
  {
    featureType: "administrative.land_parcel",
    elementType: "labels.text.fill",
    stylers: [{ color: "#a8b0bc" }],
  },
  {
    featureType: "administrative.locality",
    elementType: "labels.text.fill",
    stylers: [{ color: "#1e3a6e" }],
  },
  {
    featureType: "poi",
    elementType: "geometry",
    stylers: [{ color: "#efeae4" }],
  },
  {
    featureType: "poi",
    elementType: "labels.text.fill",
    stylers: [{ color: "#6b7a8f" }],
  },
  {
    featureType: "poi.park",
    elementType: "geometry",
    stylers: [{ color: "#e4ebe3" }],
  },
  {
    featureType: "poi.park",
    elementType: "labels.text.fill",
    stylers: [{ color: "#6d8574" }],
  },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [{ color: "#ffffff" }],
  },
  {
    featureType: "road",
    elementType: "geometry.stroke",
    stylers: [{ color: "#ddd6cc" }],
  },
  {
    featureType: "road.arterial",
    elementType: "labels.text.fill",
    stylers: [{ color: "#5c6d82" }],
  },
  {
    featureType: "road.highway",
    elementType: "geometry",
    stylers: [{ color: "#e8dfd4" }],
  },
  {
    featureType: "road.highway",
    elementType: "geometry.stroke",
    stylers: [{ color: "#d4c8b8" }],
  },
  {
    featureType: "road.highway",
    elementType: "labels.text.fill",
    stylers: [{ color: "#1e3a6e" }],
  },
  {
    featureType: "road.local",
    elementType: "labels.text.fill",
    stylers: [{ color: "#8a96a8" }],
  },
  {
    featureType: "transit.line",
    elementType: "geometry",
    stylers: [{ color: "#e8e4de" }],
  },
  {
    featureType: "transit.station",
    elementType: "geometry",
    stylers: [{ color: "#efeae4" }],
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#b8c9de" }],
  },
  {
    featureType: "water",
    elementType: "labels.text.fill",
    stylers: [{ color: "#5c7a9e" }],
  },
];

export const MAP_ROADMAP_BACKGROUND = "#f7f4f0";

/** RentalPins Buy — ivory land, champagne-tinted roads, soft navy water. */
export const SALE_MAP_STYLES: google.maps.MapTypeStyle[] = [
  { elementType: "geometry", stylers: [{ color: "#fffefb" }] },
  { elementType: "labels.icon", stylers: [{ visibility: "off" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#5c5348" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#fffefb" }] },
  {
    featureType: "administrative",
    elementType: "geometry",
    stylers: [{ color: "#f0ebe3" }],
  },
  {
    featureType: "administrative.country",
    elementType: "labels.text.fill",
    stylers: [{ color: "#9a9084" }],
  },
  {
    featureType: "administrative.land_parcel",
    elementType: "labels.text.fill",
    stylers: [{ color: "#b0a89c" }],
  },
  {
    featureType: "administrative.locality",
    elementType: "labels.text.fill",
    stylers: [{ color: "#1e3a6e" }],
  },
  {
    featureType: "poi",
    elementType: "geometry",
    stylers: [{ color: "#f5f0e8" }],
  },
  {
    featureType: "poi",
    elementType: "labels.text.fill",
    stylers: [{ color: "#6b6358" }],
  },
  {
    featureType: "poi.park",
    elementType: "geometry",
    stylers: [{ color: "#e8ede4" }],
  },
  {
    featureType: "poi.park",
    elementType: "labels.text.fill",
    stylers: [{ color: "#6d8574" }],
  },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [{ color: "#ffffff" }],
  },
  {
    featureType: "road",
    elementType: "geometry.stroke",
    stylers: [{ color: "#e8dfc8" }],
  },
  {
    featureType: "road.arterial",
    elementType: "labels.text.fill",
    stylers: [{ color: "#5c5348" }],
  },
  {
    featureType: "road.highway",
    elementType: "geometry",
    stylers: [{ color: "#f0e6d4" }],
  },
  {
    featureType: "road.highway",
    elementType: "geometry.stroke",
    stylers: [{ color: "#d4c4a0" }],
  },
  {
    featureType: "road.highway",
    elementType: "labels.text.fill",
    stylers: [{ color: "#1e3a6e" }],
  },
  {
    featureType: "road.local",
    elementType: "labels.text.fill",
    stylers: [{ color: "#9a9084" }],
  },
  {
    featureType: "transit.line",
    elementType: "geometry",
    stylers: [{ color: "#efe9df" }],
  },
  {
    featureType: "transit.station",
    elementType: "geometry",
    stylers: [{ color: "#f5f0e8" }],
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#c5d0e4" }],
  },
  {
    featureType: "water",
    elementType: "labels.text.fill",
    stylers: [{ color: "#5c7a9e" }],
  },
];

export const SALE_MAP_ROADMAP_BACKGROUND = "#fffefb";

const MAP_UI_OPTIONS: google.maps.MapOptions = {
  disableDefaultUI: false,
  zoomControl: true,
  mapTypeControl: false,
  streetViewControl: false,
  fullscreenControl: true,
  clickableIcons: false,
  gestureHandling: "greedy",
};

export function resolveMapRoadmapStyles(
  transaction: MapSurfaceTransaction = "rent"
): google.maps.MapTypeStyle[] {
  return transaction === "sale" ? SALE_MAP_STYLES : SILVER_MAP_STYLES;
}

export function resolveMapRoadmapBackground(
  transaction: MapSurfaceTransaction = "rent"
): string {
  return transaction === "sale" ? SALE_MAP_ROADMAP_BACKGROUND : MAP_ROADMAP_BACKGROUND;
}

export function buildMapOptions(
  transaction: MapSurfaceTransaction = "rent"
): google.maps.MapOptions {
  return {
    ...MAP_UI_OPTIONS,
    backgroundColor: resolveMapRoadmapBackground(transaction),
    styles: resolveMapRoadmapStyles(transaction),
  };
}

export const SILVER_MAP_OPTIONS: google.maps.MapOptions = buildMapOptions("rent");

/** Prebuilt sale map options — RentalPins Buy ivory/gold roadmap. */
export const SALE_MAP_OPTIONS: google.maps.MapOptions = buildMapOptions("sale");

/** @deprecated Use buildMapOptions("rent") — kept for LocationPicker imports. */
export const RENT_MAP_OPTIONS = SILVER_MAP_OPTIONS;

/** Apply roadmap theme or high-res satellite/hybrid tiles (Zillow-style auto switch). */
export function applyMapViewSurface(
  map: google.maps.Map,
  mode: MapViewMode,
  zoom: number,
  transaction: MapSurfaceTransaction = "rent"
): google.maps.MapTypeId {
  const typeId = resolveMapTypeId(mode, zoom);
  const roadmap = isRoadmapSurface(typeId);
  map.setMapTypeId(typeId);
  map.setOptions({
    styles: roadmap ? resolveMapRoadmapStyles(transaction) : [],
    backgroundColor: roadmap ? resolveMapRoadmapBackground(transaction) : "#0a0a0a",
  });
  return typeId;
}

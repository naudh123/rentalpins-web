/** RentalPins light roadmap theme — warm land, navy-tinted water, pins stay legible. */

import { isRoadmapSurface, resolveMapTypeId, type MapViewMode } from "./map-view-mode";

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

export const SILVER_MAP_OPTIONS: google.maps.MapOptions = {
  disableDefaultUI: false,
  zoomControl: true,
  mapTypeControl: false,
  streetViewControl: false,
  fullscreenControl: true,
  clickableIcons: false,
  gestureHandling: "greedy",
  backgroundColor: MAP_ROADMAP_BACKGROUND,
  styles: SILVER_MAP_STYLES,
};

/** Apply roadmap silver theme or high-res satellite/hybrid tiles (Zillow-style auto switch). */
export function applyMapViewSurface(
  map: google.maps.Map,
  mode: MapViewMode,
  zoom: number
): google.maps.MapTypeId {
  const typeId = resolveMapTypeId(mode, zoom);
  const roadmap = isRoadmapSurface(typeId);
  map.setMapTypeId(typeId);
  map.setOptions({
    styles: roadmap ? SILVER_MAP_STYLES : [],
    backgroundColor: roadmap ? MAP_ROADMAP_BACKGROUND : "#0a0a0a",
  });
  return typeId;
}

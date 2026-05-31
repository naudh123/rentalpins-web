/** Zillow-style auto satellite: switch to aerial imagery when zoomed in close. */
export const MAP_SATELLITE_AUTO_ZOOM = 17;

/** Merge co-located listings into one "N units" pin from this zoom upward. */
export const MAP_BUILDING_PIN_ZOOM = 15;

export type MapViewMode = "auto" | "roadmap" | "satellite";

export function resolveMapTypeId(
  mode: MapViewMode,
  zoom: number
): google.maps.MapTypeId {
  if (mode === "roadmap") return google.maps.MapTypeId.ROADMAP;
  if (mode === "satellite") return google.maps.MapTypeId.SATELLITE;
  return zoom >= MAP_SATELLITE_AUTO_ZOOM
    ? google.maps.MapTypeId.HYBRID
    : google.maps.MapTypeId.ROADMAP;
}

export function isRoadmapSurface(typeId: google.maps.MapTypeId): boolean {
  return typeId === google.maps.MapTypeId.ROADMAP;
}

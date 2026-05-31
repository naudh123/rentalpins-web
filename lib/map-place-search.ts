import type { MapBounds } from "@/lib/types/saved-search";

export interface PlaceSearchResult {
  label: string;
  lat: number;
  lng: number;
  bounds: MapBounds | null;
  zoom: number | null;
}

/** Prefer viewport bounds; otherwise center + zoom from place types. */
export function placeToSearchResult(
  place: google.maps.places.PlaceResult
): PlaceSearchResult | null {
  const loc = place.geometry?.location;
  if (!loc) return null;

  const lat = loc.lat();
  const lng = loc.lng();
  const label =
    place.formatted_address || place.name || `${lat.toFixed(4)}, ${lng.toFixed(4)}`;

  const vp = place.geometry?.viewport;
  if (vp) {
    const ne = vp.getNorthEast();
    const sw = vp.getSouthWest();
    return {
      label,
      lat,
      lng,
      bounds: {
        north: ne.lat(),
        south: sw.lat(),
        east: ne.lng(),
        west: sw.lng(),
      },
      zoom: null,
    };
  }

  return {
    label,
    lat,
    lng,
    bounds: null,
    zoom: zoomForPlaceTypes(place.types),
  };
}

/** Build search result from Geocoder API (manual Enter / fallback). */
export function geocoderResultToSearchResult(
  result: google.maps.GeocoderResult
): PlaceSearchResult | null {
  const loc = result.geometry?.location;
  if (!loc) return null;

  const lat = loc.lat();
  const lng = loc.lng();
  const label = result.formatted_address || `${lat.toFixed(4)}, ${lng.toFixed(4)}`;

  const vp = result.geometry?.viewport;
  if (vp) {
    const ne = vp.getNorthEast();
    const sw = vp.getSouthWest();
    return {
      label,
      lat,
      lng,
      bounds: {
        north: ne.lat(),
        south: sw.lat(),
        east: ne.lng(),
        west: sw.lng(),
      },
      zoom: null,
    };
  }

  return {
    label,
    lat,
    lng,
    bounds: null,
    zoom: zoomForPlaceTypes(result.types),
  };
}

function zoomForPlaceTypes(types?: string[]): number {
  if (!types?.length) return 13;
  if (types.includes("country")) return 5;
  if (types.includes("administrative_area_level_1")) return 8;
  if (types.includes("administrative_area_level_2")) return 10;
  if (types.includes("locality")) return 11;
  if (types.includes("sublocality") || types.includes("neighborhood")) return 14;
  if (types.includes("route") || types.includes("street_address")) return 15;
  return 13;
}

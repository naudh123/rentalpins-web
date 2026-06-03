"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Autocomplete } from "@react-google-maps/api";
import { trackEvent, trackSearchInitiated } from "@/lib/ga4";
import {
  geocoderResultToSearchResult,
  placeToSearchResult,
  type PlaceSearchResult,
} from "@/lib/map-place-search";

function boundsFromAccuracy(
  lat: number,
  lng: number,
  accuracyMeters?: number
): PlaceSearchResult["bounds"] {
  const radiusMeters = Math.min(Math.max(accuracyMeters ?? 2500, 1200), 7000);
  const latDelta = radiusMeters / 111_000;
  const lngDelta =
    radiusMeters / (111_000 * Math.max(Math.cos((lat * Math.PI) / 180), 0.25));
  return {
    north: lat + latDelta,
    south: lat - latDelta,
    east: lng + lngDelta,
    west: lng - lngDelta,
  };
}

interface Props {
  /** Shown in the input when restoring URL / saved search. */
  initialQuery?: string;
  onPlaceResult: (result: PlaceSearchResult) => void;
  onClear?: () => void;
  onUseCurrentLocation?: (result: PlaceSearchResult) => void;
  inputId?: string;
  disabled?: boolean;
}

export default function MapLocationSearch({
  initialQuery = "",
  onPlaceResult,
  onClear,
  onUseCurrentLocation,
  inputId = "map-location-search-input",
  disabled,
}: Props) {
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const placePickRef = useRef(false);
  const mountedRef = useRef(true);
  const [query, setQuery] = useState(initialQuery);
  const [geoBusy, setGeoBusy] = useState(false);
  const [geoError, setGeoError] = useState("");
  const canUseGeolocation =
    typeof navigator !== "undefined" && Boolean(navigator.geolocation);
  const prevQueryRef = useRef(initialQuery);
  const geoStatus = geoBusy
    ? "Searching location."
    : geoError
      ? geoError
      : "";
  const geoHelpMessage =
    !geoError && !canUseGeolocation
      ? "Current location is not supported in this browser."
      : "";

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    setQuery(initialQuery);
    if (geoError) setGeoError("");
    prevQueryRef.current = initialQuery;
  }, [initialQuery]);

  useEffect(() => {
    const hadQuery = prevQueryRef.current.trim().length > 0;
    const hasQuery = query.trim().length > 0;
    if (hadQuery && !hasQuery) {
      onClear?.();
    }
    prevQueryRef.current = query;
  }, [onClear, query]);

  const submitGeocode = useCallback(async () => {
    const text = query.trim();
    if (!text || disabled || geoBusy) return;
    if (typeof google === "undefined" || !google.maps?.Geocoder) {
      setGeoError("Location search is not ready yet.");
      return;
    }
    setGeoError("");
    setGeoBusy(true);
    try {
      const geocoder = new google.maps.Geocoder();
      const response = await geocoder.geocode({ address: text });
      const top = response.results?.[0];
      const result = top ? geocoderResultToSearchResult(top) : null;
      if (!result) {
        setGeoError("No results for that location. Try a city or area name.");
        trackEvent("map_location_geocode_failed", { reason: "no_results" });
        return;
      }
      setQuery(result.label);
      trackSearchInitiated("geocode_enter", result.label);
      trackEvent("map_location_geocoded", { method: "enter_key" });
      onPlaceResult(result);
    } catch {
      setGeoError("Could not search that location. Try again.");
      trackEvent("map_location_geocode_failed", { reason: "error" });
    } finally {
      if (mountedRef.current) setGeoBusy(false);
    }
  }, [disabled, geoBusy, onPlaceResult, query]);

  const onPlaceChanged = useCallback(() => {
    const place = autocompleteRef.current?.getPlace();
    if (!place) return;
    const result = placeToSearchResult(place);
    if (!result) return;
    placePickRef.current = true;
    setQuery(result.label);
    if (geoError) setGeoError("");
    trackSearchInitiated("places_autocomplete", result.label);
    onPlaceResult(result);
  }, [geoError, onPlaceResult]);

  const useCurrentLocation = useCallback(() => {
    if (disabled || geoBusy || !onUseCurrentLocation) return;
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      const message = "Location is not supported in this browser.";
      setGeoError(message);
      trackEvent("map_use_current_location_failed", {
        reason: "not_supported",
      });
      return;
    }
    setGeoError("");
    setGeoBusy(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        if (!mountedRef.current) return;
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        const fallbackLabel = "Current location";
        let label = fallbackLabel;
        let geocoded = false;
        if (typeof google !== "undefined" && google.maps?.Geocoder) {
          try {
            const geocoder = new google.maps.Geocoder();
            const result = await geocoder.geocode({
              location: { lat, lng },
            });
            const top = result.results?.[0];
            if (top?.formatted_address) {
              label = top.formatted_address;
              geocoded = true;
            }
          } catch {
            // Keep fallback label when reverse geocode fails.
          }
        }
        setQuery(label);
        trackSearchInitiated("geolocation", label);
        trackEvent("map_use_current_location_succeeded", {
          geocoded,
          accuracy_m: Math.round(position.coords.accuracy || 0),
        });
        if (!mountedRef.current) return;
        onUseCurrentLocation({
          label,
          lat,
          lng,
          bounds: boundsFromAccuracy(lat, lng, position.coords.accuracy),
          zoom: null,
        });
        setGeoBusy(false);
      },
      (err) => {
        if (!mountedRef.current) return;
        let reason = "unknown";
        let message = "Could not get your current location.";
        if (err.code === err.PERMISSION_DENIED) {
          reason = "permission_denied";
          message = "Location permission denied.";
        } else if (err.code === err.TIMEOUT) {
          reason = "timeout";
          message = "Location request timed out.";
        } else if (err.code === err.POSITION_UNAVAILABLE) {
          reason = "position_unavailable";
          message = "Current location is unavailable right now.";
        }
        setGeoError(message);
        trackEvent("map_use_current_location_failed", { reason });
        setGeoBusy(false);
      },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 120000 }
    );
  }, [disabled, geoBusy, onUseCurrentLocation]);

  return (
    <div className="pointer-events-auto w-full max-w-xl">
      <div className="rp-glass flex items-center gap-2 rounded-2xl border border-[var(--border)] bg-[var(--surface)]/95 px-3 py-2 shadow-md">
        <span className="shrink-0 text-base opacity-70" aria-hidden>
          ⌕
        </span>
        <Autocomplete
          onLoad={(ac) => {
            autocompleteRef.current = ac;
          }}
          onPlaceChanged={onPlaceChanged}
          options={{
            fields: ["formatted_address", "geometry", "name", "types"],
          }}
        >
          <input
            id={inputId}
            type="search"
            enterKeyHint="search"
            placeholder="City, area, or address…"
            value={query}
            disabled={disabled || geoBusy}
            onChange={(e) => setQuery(e.target.value)}
            onBlur={() => {
              document.querySelectorAll(".pac-container").forEach((el) => {
                (el as HTMLElement).style.display = "none";
              });
            }}
            onFocus={() => {
              document.querySelectorAll(".pac-container").forEach((el) => {
                (el as HTMLElement).style.display = "";
              });
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                requestAnimationFrame(() => {
                  if (placePickRef.current) {
                    placePickRef.current = false;
                    return;
                  }
                  void submitGeocode();
                });
                return;
              }
              if (e.key === "Escape" && query.trim().length > 0) {
                e.preventDefault();
                setQuery("");
                if (geoError) setGeoError("");
              }
            }}
            aria-busy={geoBusy}
            className="min-w-0 flex-1 bg-transparent py-1.5 text-sm text-[var(--text)] outline-none placeholder:text-[var(--muted)] disabled:opacity-50"
            aria-label="Search location on map"
            aria-keyshortcuts="/"
            title="Search location (shortcut: /)"
          />
        </Autocomplete>
        <button
          type="button"
          className="shrink-0 rounded-full bg-[var(--brand-navy)] px-3 py-1 text-xs font-semibold text-white disabled:opacity-50"
          onClick={() => void submitGeocode()}
          disabled={disabled || geoBusy || !query.trim()}
          aria-label="Search this location"
        >
          Go
        </button>
        {onUseCurrentLocation && (
          <button
            type="button"
            className="shrink-0 rounded-full px-2 py-1 text-xs text-[var(--muted)] hover:bg-[var(--border)]/40 hover:text-[var(--text)] disabled:opacity-50"
            aria-label="Use current location"
            aria-busy={geoBusy}
            onClick={useCurrentLocation}
            disabled={disabled || geoBusy || !canUseGeolocation}
            title={
              canUseGeolocation
                ? "Use current location"
                : "Current location not supported"
            }
          >
            {geoBusy ? "Locating..." : "Near me"}
          </button>
        )}
        {query && !disabled && (
          <button
            type="button"
            className="shrink-0 rounded-full px-2 py-1 text-xs text-[var(--muted)] hover:bg-[var(--border)]/40 hover:text-[var(--text)]"
            aria-label="Clear search"
            onClick={() => {
              setQuery("");
              if (geoError) setGeoError("");
            }}
          >
            ✕
          </button>
        )}
      </div>
      <span className="sr-only" aria-live="polite">
        {geoStatus}
      </span>
      {geoError && (
        <div className="mt-1.5 flex flex-wrap items-center gap-2 pl-2" role="alert">
          <p className="text-[11px] text-red-700">{geoError}</p>
          {canUseGeolocation && onUseCurrentLocation && (
            <button
              type="button"
              className="text-[11px] font-semibold text-[var(--brand-navy)] underline"
              onClick={useCurrentLocation}
              disabled={disabled || geoBusy}
            >
              Try again
            </button>
          )}
        </div>
      )}
      {geoHelpMessage && (
        <p className="mt-1.5 pl-2 text-[11px] text-[var(--muted)]">{geoHelpMessage}</p>
      )}
    </div>
  );
}

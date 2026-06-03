"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  Autocomplete,
  GoogleMap,
  Marker,
} from "@react-google-maps/api";
import { useRentalPinsMapsLoader } from "@/lib/google-maps-loader";
import MapsApiKeyMissingNotice, {
  isGoogleMapsConfigured,
} from "@/components/MapsApiKeyMissingNotice";
import {
  isCoordOnlyLocationLabel,
  isValidListingCoordinate,
  listingCoordinateWarning,
  pickListingLocationName,
} from "@/lib/listing-location";
import { SILVER_MAP_OPTIONS } from "@/lib/map-styles";

export interface PickedLocation {
  lat: number;
  lng: number;
  label: string;
}

interface Props {
  value: PickedLocation | null;
  onChange: (loc: PickedLocation) => void;
  /** Mirrors Flutter `_prefillCurrentLocation` on sheet open. */
  prefillCurrentLocationOnMount?: boolean;
  /** Used for optional “outside India” warnings. */
  homeIso?: string | null;
}

const DEFAULT = { lat: 30.7333, lng: 76.7794 };

function reverseGeocodeOnce(
  lat: number,
  lng: number
): Promise<string | null> {
  return new Promise((resolve) => {
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ location: { lat, lng } }, (results, status) => {
      if (status === "OK" && results?.[0]?.formatted_address) {
        resolve(results[0].formatted_address);
      } else {
        resolve(null);
      }
    });
  });
}

/** Best-effort address; retries once on failure (#17). */
async function reverseGeocodeLabel(
  lat: number,
  lng: number,
  fallback: string
): Promise<string> {
  let label = await reverseGeocodeOnce(lat, lng);
  if (!label) {
    await new Promise((r) => setTimeout(r, 400));
    label = await reverseGeocodeOnce(lat, lng);
  }
  return pickListingLocationName(fallback, label);
}

function formatStatusLabel(value: PickedLocation): string {
  const label = value.label.trim();
  if (label.length <= 72) return label;
  return `${label.slice(0, 69)}…`;
}

export default function LocationPicker({
  value,
  onChange,
  prefillCurrentLocationOnMount = false,
  homeIso = null,
}: Props) {
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [locating, setLocating] = useState(false);
  const [geoError, setGeoError] = useState("");
  const [coordWarning, setCoordWarning] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState(value?.label ?? "");
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const { isLoaded } = useRentalPinsMapsLoader();

  useEffect(() => {
    setSearchQuery(value?.label ?? "");
  }, [value?.lat, value?.lng, value?.label]);

  useEffect(() => {
    if (!value || !map) return;
    map.panTo({ lat: value.lat, lng: value.lng });
    map.setZoom(15);
  }, [value, map, value?.lat, value?.lng]);

  const locationStatus = (() => {
    if (locating) return "Detecting current location…";
    if (value) return `${formatStatusLabel(value)} · tap map to adjust`;
    if (geoError) return "Tap the map or search to set your pin";
    return "Tap the map, search, or use your location";
  })();

  const applyCoords = useCallback(
    async (lat: number, lng: number, labelHint?: string) => {
      if (!isValidListingCoordinate(lat, lng)) {
        setCoordWarning("Invalid coordinates. Pick a point on the map.");
        setGeoError("");
        return;
      }

      const warning = listingCoordinateWarning(lat, lng, homeIso);
      setCoordWarning(warning);

      const fallback =
        labelHint || `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
      const label = await reverseGeocodeLabel(lat, lng, fallback);
      onChange({ lat, lng, label });
      setSearchQuery(label);
      setGeoError("");
      map?.panTo({ lat, lng });
      if (map) map.setZoom(15);
    },
    [homeIso, map, onChange]
  );

  const onMapClick = useCallback(
    (e: google.maps.MapMouseEvent) => {
      if (!e.latLng) return;
      void applyCoords(e.latLng.lat(), e.latLng.lng());
    },
    [applyCoords]
  );

  const onPlaceChanged = useCallback(() => {
    const place = autocompleteRef.current?.getPlace();
    const loc = place?.geometry?.location;
    if (!loc) return;
    const lat = loc.lat();
    const lng = loc.lng();
    const label =
      place.formatted_address ||
      place.name ||
      `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
    setSearchQuery(label);
    void applyCoords(lat, lng, label);
  }, [applyCoords]);

  const useMyLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setGeoError("Location is not supported in this browser.");
      return;
    }
    setGeoError("");
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocating(false);
        void applyCoords(pos.coords.latitude, pos.coords.longitude);
      },
      () => {
        setLocating(false);
        setGeoError(
          "Could not get your location. Check permissions or pick on the map."
        );
      },
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 60_000 }
    );
  }, [applyCoords]);

  const didPrefillRef = useRef(false);
  useEffect(() => {
    if (
      !prefillCurrentLocationOnMount ||
      value ||
      didPrefillRef.current ||
      !isLoaded
    ) {
      return;
    }
    didPrefillRef.current = true;
    useMyLocation();
  }, [prefillCurrentLocationOnMount, value, isLoaded, useMyLocation]);

  if (!isGoogleMapsConfigured()) {
    return <MapsApiKeyMissingNotice compact />;
  }

  if (!isLoaded) {
    return <p className="text-sm text-[var(--muted)]">Loading map…</p>;
  }

  return (
    <div className="space-y-2">
      <div
        className={`rounded-lg border px-3 py-2.5 text-sm ${
          value
            ? "border-blue-200 bg-blue-50 text-blue-900"
            : "border-[var(--border)] bg-[var(--surface)] text-[var(--muted)]"
        }`}
        role="status"
      >
        <span className="mr-2 inline-block align-middle" aria-hidden>
          📍
        </span>
        {locationStatus}
      </div>

      <Autocomplete
        onLoad={(ac) => {
          autocompleteRef.current = ac;
        }}
        onPlaceChanged={onPlaceChanged}
        options={{
          fields: ["formatted_address", "geometry", "name"],
        }}
      >
        <input
          type="text"
          placeholder="Search address or place…"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
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
          className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-4 py-2.5 text-sm"
        />
      </Autocomplete>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={useMyLocation}
          disabled={locating}
          className="rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 py-1.5 text-xs font-medium text-[var(--brand-navy)] hover:border-[var(--accent)] disabled:opacity-50"
        >
          {locating ? "Locating…" : "Use my location"}
        </button>
        {value && map && (
          <button
            type="button"
            className="rounded-full border border-[var(--border)] px-3 py-1.5 text-xs text-[var(--accent)] hover:border-[var(--accent)]"
            onClick={() => map.panTo({ lat: value.lat, lng: value.lng })}
          >
            Center on pin
          </button>
        )}
      </div>

      {geoError && <p className="text-xs text-red-600">{geoError}</p>}
      {coordWarning && (
        <p className="text-xs text-amber-700">{coordWarning}</p>
      )}

      <div className="h-48 overflow-hidden rounded-xl border border-[var(--border)]">
        <GoogleMap
          mapContainerStyle={{ width: "100%", height: "100%" }}
          center={value ?? DEFAULT}
          zoom={value ? 15 : 14}
          onClick={onMapClick}
          onLoad={(m) => {
            setMap(m);
            if (value) {
              m.panTo({ lat: value.lat, lng: value.lng });
              m.setZoom(15);
            }
          }}
          options={{
            ...SILVER_MAP_OPTIONS,
            zoomControl: true,
            fullscreenControl: false,
          }}
        >
          {value && <Marker position={value} />}
        </GoogleMap>
      </div>

      <input
        type="text"
        placeholder="Display name (shown on listing)"
        value={value?.label ?? ""}
        onChange={(e) => {
          if (!value) return;
          const nextLabel = e.target.value;
          onChange({ ...value, label: nextLabel });
          if (!isCoordOnlyLocationLabel(nextLabel)) {
            setSearchQuery(nextLabel);
          }
        }}
        disabled={!value}
        className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-4 py-2.5 text-sm disabled:opacity-50"
      />
      <p className="text-xs text-[var(--muted)]">
        Search, use your location, or tap the map to set the pin. Edit the display
        name if needed.
      </p>
    </div>
  );
}

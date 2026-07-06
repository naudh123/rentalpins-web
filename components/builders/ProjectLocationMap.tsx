"use client";

import { GoogleMap, Marker } from "@react-google-maps/api";
import { useRentalPinsMapsLoader } from "@/lib/google-maps-loader";

interface ProjectLocationMapProps {
  latitude: number;
  longitude: number;
  label: string;
  address?: string | null;
}

function googleMapsUrl(latitude: number, longitude: number, label: string): string {
  const q = encodeURIComponent(`${latitude},${longitude} (${label})`);
  return `https://www.google.com/maps/search/?api=1&query=${q}`;
}

export default function ProjectLocationMap({
  latitude,
  longitude,
  label,
  address,
}: ProjectLocationMapProps) {
  const { isLoaded } = useRentalPinsMapsLoader();

  if (!isLoaded) {
    return (
      <div className="flex h-64 items-center justify-center bg-[var(--bg-elevated)] text-sm text-[var(--muted)]">
        Loading map...
      </div>
    );
  }

  return (
    <div>
      <GoogleMap
        mapContainerClassName="h-64 w-full sm:h-80"
        center={{ lat: latitude, lng: longitude }}
        zoom={15}
        options={{
          disableDefaultUI: true,
          zoomControl: true,
          clickableIcons: false,
        }}
      >
        <Marker position={{ lat: latitude, lng: longitude }} title={label} />
      </GoogleMap>
      <div className="flex flex-col gap-2 border-t border-[var(--border)] bg-[var(--surface)] px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        {address ? (
          <p className="text-sm text-[var(--muted)]">{address}</p>
        ) : (
          <p className="text-sm text-[var(--muted)]">
            {latitude.toFixed(5)}, {longitude.toFixed(5)}
          </p>
        )}
        <a
          href={googleMapsUrl(latitude, longitude, label)}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 text-sm font-medium text-[var(--lux-accent)] hover:underline"
        >
          Open in Google Maps
        </a>
      </div>
    </div>
  );
}

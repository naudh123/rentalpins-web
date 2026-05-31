import { googleMapsApiKey } from "@/lib/config";

export function isGoogleMapsConfigured(): boolean {
  return Boolean(googleMapsApiKey);
}

interface Props {
  /** Shorter copy for inline fields (e.g. LocationPicker). */
  compact?: boolean;
  className?: string;
}

/**
 * Shown when `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` is missing — post flow and search map
 * cannot load the picker or Places autocomplete.
 */
export default function MapsApiKeyMissingNotice({
  compact = false,
  className = "",
}: Props) {
  if (isGoogleMapsConfigured()) return null;

  if (compact) {
    return (
      <div
        className={`rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900 ${className}`}
        role="alert"
      >
        <p className="font-medium">Map unavailable</p>
        <p className="mt-1 text-xs text-amber-800">
          Set{" "}
          <code className="rounded bg-amber-100 px-1">NEXT_PUBLIC_GOOGLE_MAPS_API_KEY</code> in
          .env.local (enable Maps JavaScript API and Places API) to pick a location and use AI
          landmarks.
        </p>
      </div>
    );
  }

  return (
    <div
      className={`rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-950 ${className}`}
      role="alert"
    >
      <p className="font-semibold">Posting needs Google Maps</p>
      <p className="mt-1 text-amber-900">
        Location and <strong>Improve with AI</strong> (nearby places) require a Maps API key on
        this environment.
      </p>
      <p className="mt-2 text-xs text-amber-800">
        Add{" "}
        <code className="rounded bg-amber-100 px-1 py-0.5">
          NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
        </code>{" "}
        to <code className="rounded bg-amber-100 px-1 py-0.5">.env.local</code>, enable{" "}
        <strong>Maps JavaScript API</strong> and <strong>Places API</strong> in Google Cloud, then
        restart the dev server.
      </p>
    </div>
  );
}

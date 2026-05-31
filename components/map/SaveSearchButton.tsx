"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/AuthProvider";
import { appPath } from "@/lib/config";
import { createSavedSearch } from "@/lib/saved-searches";
import { enableWebPush, isWebPushConfigured } from "@/lib/web-push";
import { trackEvent, trackSearchAlertCreated } from "@/lib/ga4";
import type { ListingFilters } from "@/lib/listing-filters";
import type { MapAreaShape } from "@/lib/map-area";
import type { MapBounds } from "@/lib/types/saved-search";

interface Props {
  filters: ListingFilters;
  bounds: MapBounds | null;
  centerLat: number | null;
  centerLng: number | null;
  zoom: number | null;
  placeQuery?: string | null;
  keywords?: string | null;
  drawnArea?: MapAreaShape | null;
  disabled?: boolean;
}

export default function SaveSearchButton({
  filters,
  bounds,
  centerLat,
  centerLng,
  zoom,
  placeQuery,
  keywords,
  drawnArea = null,
  disabled = false,
}: Props) {
  const router = useRouter();
  const { user } = useAuth();
  const [busy, setBusy] = useState(false);
  const [saveState, setSaveState] = useState<"idle" | "saved" | "existing" | "reactivated">(
    "idle"
  );
  const [error, setError] = useState("");
  const [lastSavedId, setLastSavedId] = useState<string | null>(null);
  const resetTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hasMapContext = Boolean(bounds || centerLat != null);

  useEffect(() => {
    return () => {
      if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
    };
  }, []);

  useEffect(() => {
    if (!hasMapContext) return;
    if (!error) return;
    setError("");
  }, [error, hasMapContext]);

  async function handleSave() {
    if (disabled) return;
    if (!user) {
      setError("");
      router.push(appPath("/auth/login?next=/search"));
      trackEvent("saved_search_save_login_redirect", { category: filters.category });
      return;
    }
    if (!hasMapContext) {
      const message = "Move or search on the map first, then save this area.";
      setError(message);
      trackEvent("saved_search_save_blocked_no_view");
      return;
    }

    setError("");
    setBusy(true);
    try {
      const result = await createSavedSearch(user.uid, {
        filters,
        bounds,
        centerLat,
        centerLng,
        zoom,
        placeQuery: placeQuery?.trim() || null,
        keywords: keywords?.trim() || null,
        drawnArea,
        alertsEnabled: true,
      });
      setLastSavedId(result.id);
      // Best-effort: turn on web push so alerts can reach this browser.
      if ((result.created || result.reactivated) && isWebPushConfigured()) {
        void enableWebPush(user.uid).then((ok) => {
          trackEvent("web_push_enable_attempt", { granted: ok });
        });
      }
      if (result.created) {
        trackSearchAlertCreated(result.id, filters.category);
        setSaveState("saved");
      } else if (result.reactivated) {
        trackEvent("saved_search_reactivated", { saved_search_id: result.id });
        setSaveState("reactivated");
      } else {
        trackEvent("saved_search_already_exists", { saved_search_id: result.id });
        setSaveState("existing");
      }
      if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
      resetTimerRef.current = setTimeout(() => setSaveState("idle"), 2500);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Could not save this search right now.";
      setError(message);
      trackEvent("saved_search_save_failed", { category: filters.category });
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        type="button"
        onClick={handleSave}
        disabled={disabled || busy || saveState !== "idle"}
        className={`rp-btn rp-btn-ghost ${saveState !== "idle" ? "border-[var(--success)] text-[var(--success)]" : ""}`}
        title={
          disabled
            ? "Wait for map results to finish loading"
            : !user
              ? "Sign in to save"
              : !hasMapContext
                ? "Move or search on the map first"
                : "Save this map area and filters"
        }
        aria-busy={disabled || busy}
      >
        {busy
          ? "…"
          : saveState === "saved"
            ? "Saved ✓"
            : saveState === "reactivated"
              ? "Alerts on ✓"
              : saveState === "existing"
                ? "Already saved"
                : "★ Save"}
      </button>
      <span className="sr-only" aria-live="polite">
        {saveState === "saved"
          ? "Search saved."
          : saveState === "reactivated"
            ? "Saved search found and alerts were turned on."
          : saveState === "existing"
            ? "This search is already saved."
            : error
              ? `Save failed. ${error}`
              : ""}
      </span>
      {error && (
        <p className="max-w-[220px] text-right text-[10px] leading-tight text-red-700" role="alert">
          {error}
        </p>
      )}
      {lastSavedId && saveState !== "idle" && (
        <Link
          href={appPath("/saved-searches")}
          className="text-[10px] font-medium text-[var(--accent)] underline underline-offset-2"
          onClick={() =>
            trackEvent("saved_search_view_list_clicked", { saved_search_id: lastSavedId })
          }
        >
          View saved searches
        </Link>
      )}
    </div>
  );
}

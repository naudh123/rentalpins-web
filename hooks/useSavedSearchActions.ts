"use client";

import { useCallback } from "react";
import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import {
  deleteSavedSearch,
  savedSearchToUrlState,
  setSavedSearchAlerts,
} from "@/lib/saved-searches";
import { appPath } from "@/lib/config";
import { buildSearchUrl } from "@/lib/search-url";
import { savedSearchZoomInUrlState } from "@/lib/saved-search-coverage";
import { trackEvent } from "@/lib/ga4";
import type { SavedSearch } from "@/lib/types/saved-search";

interface Options {
  router: AppRouterInstance;
  setBusyId: (id: string | null) => void;
  setActionError: (message: string) => void;
}

/** Tracked open / zoom / alert / delete handlers for saved-search cards. */
export function useSavedSearchActions({ router, setBusyId, setActionError }: Options) {
  const runBusy = useCallback(
    async (id: string, fn: () => Promise<void>, fallbackError: string) => {
      setBusyId(id);
      setActionError("");
      try {
        await fn();
      } catch (err) {
        const message = err instanceof Error ? err.message : fallbackError;
        setActionError(message);
      } finally {
        setBusyId(null);
      }
    },
    [setBusyId, setActionError]
  );

  const toggleAlerts = useCallback(
    (search: SavedSearch, enabled: boolean) =>
      runBusy(
        search.id,
        async () => {
          await setSavedSearchAlerts(search.id, enabled);
          trackEvent("saved_search_alert_toggled", {
            saved_search_id: search.id,
            alerts_enabled: enabled,
          });
        },
        "Could not update alerts. Please try again."
      ),
    [runBusy]
  );

  const openOnMap = useCallback(
    (search: SavedSearch) => {
      trackEvent("saved_search_opened", { saved_search_id: search.id });
      router.push(appPath(buildSearchUrl(savedSearchToUrlState(search))));
    },
    [router]
  );

  const zoomIn = useCallback(
    (search: SavedSearch, source: "badge" | "button") => {
      trackEvent("saved_search_zoom_in_clicked", {
        saved_search_id: search.id,
        source,
      });
      router.push(appPath(buildSearchUrl(savedSearchZoomInUrlState(search))));
    },
    [router]
  );

  const deleteSearch = useCallback(
    async (search: SavedSearch) => {
      const ok = window.confirm(`Delete saved search "${search.name}"?`);
      if (!ok) return;
      await runBusy(
        search.id,
        async () => {
          await deleteSavedSearch(search.id);
          trackEvent("saved_search_deleted", { saved_search_id: search.id });
        },
        "Could not delete saved search. Please try again."
      );
    },
    [runBusy]
  );

  return { toggleAlerts, openOnMap, zoomIn, deleteSearch };
}

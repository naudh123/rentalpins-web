"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/AuthProvider";
import { Button } from "@/components/ui/Button";
import SearchAlertsFeed from "@/components/saved-searches/SearchAlertsFeed";
import SavedSearchCoverageBanner from "@/components/saved-searches/SavedSearchCoverageBanner";
import SavedSearchCard from "@/components/saved-searches/SavedSearchCard";
import { subscribeSavedSearches } from "@/lib/saved-searches";
import { subscribeSearchAlerts } from "@/lib/search-alerts";
import { appPath } from "@/lib/config";
import {
  isSavedSearchCoverageLimited,
  hasCoverageLimitedAlerts,
} from "@/lib/saved-search-coverage";
import { useSavedSearchActions } from "@/hooks/useSavedSearchActions";
import { useSavedSearchFilter } from "@/hooks/useSavedSearchFilter";
import type { SavedSearch } from "@/lib/types/saved-search";
import type { SearchAlert } from "@/lib/types/search-alert";

export default function SavedSearchesPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [searches, setSearches] = useState<SavedSearch[]>([]);
  const [alerts, setAlerts] = useState<SearchAlert[]>([]);
  const [error, setError] = useState("");
  const [actionError, setActionError] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);
  const actionErrorTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const {
    filterInputId,
    queryText,
    setQueryText,
    visibleSearches,
    shortcutHintVisible,
    clearFilter,
  } = useSavedSearchFilter(searches);

  const { toggleAlerts, openOnMap, zoomIn, deleteSearch } = useSavedSearchActions({
    router,
    setBusyId,
    setActionError,
  });

  useEffect(() => {
    if (!user) return;
    return subscribeSavedSearches(user.uid, setSearches, (err) => setError(err.message));
  }, [user]);

  useEffect(() => {
    if (!user) return;
    return subscribeSearchAlerts(user.uid, setAlerts, (err) => setError(err.message));
  }, [user]);

  useEffect(() => {
    if (actionErrorTimerRef.current) {
      clearTimeout(actionErrorTimerRef.current);
      actionErrorTimerRef.current = null;
    }
    if (!actionError) return;
    actionErrorTimerRef.current = setTimeout(() => {
      setActionError("");
      actionErrorTimerRef.current = null;
    }, 4500);
  }, [actionError]);

  useEffect(() => {
    return () => {
      if (actionErrorTimerRef.current) clearTimeout(actionErrorTimerRef.current);
    };
  }, []);

  const limitedSearchCount = useMemo(
    () => searches.filter(isSavedSearchCoverageLimited).length,
    [searches]
  );
  const limitedAlertCount = useMemo(
    () => alerts.filter((a) => a.coverageMayBeIncomplete).length,
    [alerts]
  );
  const showCoverageBanner = useMemo(
    () => limitedSearchCount > 0 || hasCoverageLimitedAlerts(alerts),
    [limitedSearchCount, alerts]
  );

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-[var(--muted)]">
        Loading…
      </div>
    );
  }

  if (!user) {
    return (
      <div className="mx-auto max-w-md px-4 py-16 text-center">
        <div className="rp-card p-8">
          <p className="text-[var(--muted)]">Sign in to view saved searches.</p>
          <Link href={appPath("/auth/login?next=/saved-searches")} className="rp-btn rp-btn-primary mt-6 inline-flex">
            Sign in
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 pb-24 md:pb-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="rp-badge">Your alerts</p>
          <h1 className="mt-2 font-serif text-2xl tracking-tight md:text-3xl">Saved searches</h1>
          <p className="mt-2 text-sm text-[var(--muted)]">
            New listings that match your saved areas appear below. Alerts run hourly.
          </p>
        </div>
        <Link href={appPath("/search")} className="rp-btn rp-btn-secondary shrink-0 px-4 py-2 text-sm">
          Map
        </Link>
      </div>

      {error && (
        <p className="mt-6 rounded-lg border border-red-900/50 bg-red-950/30 p-3 text-sm text-red-300">
          {error.includes("index")
            ? "Deploy Firestore rules/indexes from docs/firestore-saved-searches.md and docs/firestore-search-alerts.md"
            : error}
        </p>
      )}
      {actionError && (
        <p className="mt-3 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800">
          {actionError}
        </p>
      )}

      {showCoverageBanner && (
        <SavedSearchCoverageBanner
          limitedSearchCount={limitedSearchCount}
          limitedAlertCount={limitedAlertCount}
        />
      )}

      <SearchAlertsFeed alerts={alerts} />

      {searches.length > 0 && (
        <div className="mt-6">
          <label htmlFor={filterInputId} className="sr-only">
            Filter saved searches
          </label>
          <input
            id={filterInputId}
            type="search"
            value={queryText}
            onChange={(e) => setQueryText(e.target.value)}
            placeholder="Filter saved searches..."
            className="rp-input w-full !py-2.5 text-sm"
            aria-label="Filter saved searches"
            aria-keyshortcuts="/,Escape"
            title="Shortcuts: / focus filter, Esc clear filter"
          />
          {!!queryText.trim().length && (
            <div className="mt-2 flex justify-end">
              <Button
                type="button"
                variant="ghost"
                className="!px-3 !py-1 text-[11px]"
                onClick={() => clearFilter("button")}
              >
                Clear filter
              </Button>
            </div>
          )}
          {shortcutHintVisible && (
            <p className="mt-1 text-[10px] text-[var(--muted)]">
              Shortcuts: / focus filter, Esc clear filter
            </p>
          )}
          <p className="mt-1 text-xs text-[var(--muted)]" aria-live="polite">
            Showing {visibleSearches.length} of {searches.length} saved searches
          </p>
        </div>
      )}

      <ul className="mt-8 space-y-3">
        {visibleSearches.map((s) => (
          <SavedSearchCard
            key={s.id}
            search={s}
            busy={busyId === s.id}
            onToggleAlerts={(next) => toggleAlerts(s, next)}
            onOpen={() => openOnMap(s)}
            onZoomIn={(source) => zoomIn(s, source)}
            onDelete={() => deleteSearch(s)}
          />
        ))}
      </ul>

      {!!searches.length && !visibleSearches.length && (
        <div className="rp-card mt-8 p-6 text-center">
          <p className="text-sm text-[var(--muted)]">No saved searches match your filter.</p>
          <Button
            type="button"
            variant="ghost"
            className="mt-3 !px-3 !py-1.5 text-xs"
            onClick={() => clearFilter("empty_state_cta")}
          >
            Clear filter
          </Button>
        </div>
      )}

      {!searches.length && !error && (
        <div className="rp-card mt-12 p-10 text-center">
          <p className="text-4xl opacity-30" aria-hidden>
            ★
          </p>
          <p className="mt-4 text-sm text-[var(--muted)]">No saved searches yet.</p>
          <Link href={appPath("/search")} className="rp-btn rp-btn-primary mt-6 inline-flex">
            Search on map
          </Link>
        </div>
      )}
    </div>
  );
}

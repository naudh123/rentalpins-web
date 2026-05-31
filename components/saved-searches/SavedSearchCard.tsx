"use client";

import { Button } from "@/components/ui/Button";
import SavedSearchCoverageBadge from "@/components/saved-searches/SavedSearchCoverageBadge";
import {
  isSavedSearchCoverageLimited,
  savedSearchCoverageHint,
} from "@/lib/saved-search-coverage";
import type { SavedSearch } from "@/lib/types/saved-search";

interface Props {
  search: SavedSearch;
  busy: boolean;
  onToggleAlerts: (enabled: boolean) => Promise<void>;
  onOpen: () => void;
  onZoomIn: (source: "badge" | "button") => void;
  onDelete: () => Promise<void>;
}

function formatWhen(ms: number): string {
  if (!ms) return "";
  return new Date(ms).toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

export default function SavedSearchCard({
  search: s,
  busy,
  onToggleAlerts,
  onOpen,
  onZoomIn,
  onDelete,
}: Props) {
  const coverageLimited = isSavedSearchCoverageLimited(s);

  return (
    <li className="rp-card p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <p className="font-medium leading-snug">{s.name}</p>
            {coverageLimited && (
              <SavedSearchCoverageBadge
                zoom={s.zoom}
                title={savedSearchCoverageHint(s)}
                onZoomIn={() => onZoomIn("badge")}
              />
            )}
          </div>
          {s.placeQuery && s.placeQuery !== s.name && (
            <p className="mt-0.5 text-xs text-[var(--muted)]">{s.placeQuery}</p>
          )}
          {s.keywords && (
            <p className="mt-0.5 text-xs text-[var(--muted)]">Keywords: {s.keywords}</p>
          )}
          <p className="mt-1 text-xs text-[var(--muted)]">
            {s.category !== "All" ? s.category : "All categories"}
            {(s.priceMin != null || s.priceMax != null) &&
              ` · ₹${s.priceMin ?? 0}${s.priceMax != null ? `–${s.priceMax}` : "+"}`}
            {s.updatedAtMs ? ` · ${formatWhen(s.updatedAtMs)}` : ""}
          </p>
        </div>
        <label className="flex shrink-0 cursor-pointer items-center gap-2 text-xs text-[var(--muted)]">
          <input
            type="checkbox"
            checked={s.alertsEnabled}
            onChange={(e) => void onToggleAlerts(e.target.checked)}
            className="h-4 w-4 rounded border-[var(--border)] accent-[var(--accent)]"
            disabled={busy}
          />
          Alerts
        </label>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <Button type="button" onClick={onOpen} className="!px-4 !py-2 text-xs">
          Open on map
        </Button>
        {coverageLimited && (
          <Button
            type="button"
            variant="secondary"
            onClick={() => onZoomIn("button")}
            className="!px-4 !py-2 text-xs"
          >
            Zoom in
          </Button>
        )}
        <Button
          type="button"
          variant="ghost"
          onClick={() => void onDelete()}
          className="!px-4 !py-2 text-xs"
          disabled={busy}
        >
          Delete
        </Button>
      </div>

      {s.alertsEnabled && (
        <p className="mt-3 text-[10px] leading-relaxed text-[var(--muted)]">
          In-app alerts on when new listings match this area (hourly check).
        </p>
      )}
    </li>
  );
}

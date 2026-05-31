"use client";

import type { MapEmptyAction, MapEmptyVariant } from "@/lib/map-empty-state";
import {
  mapEmptyActionLabel,
  mapEmptyOverlayCopy,
  resolveMapEmptyActions,
} from "@/lib/map-empty-state";
import { trackEvent } from "@/lib/ga4";

interface Props {
  variant: MapEmptyVariant;
  totalInBounds: number;
  filtersActive: boolean;
  keywordsActive: boolean;
  drawnAreaActive: boolean;
  keywordPreview?: string;
  canResetView?: boolean;
  onZoomIn?: () => void;
  onClearFilters?: () => void;
  onClearKeywords?: () => void;
  onClearDrawnArea?: () => void;
  onResetView?: () => void;
}

export default function MapResultsEmptyState({
  variant,
  totalInBounds,
  filtersActive,
  keywordsActive,
  drawnAreaActive,
  keywordPreview,
  canResetView = false,
  onZoomIn,
  onClearFilters,
  onClearKeywords,
  onClearDrawnArea,
  onResetView,
}: Props) {
  const { title, detail } = mapEmptyOverlayCopy({
    variant,
    totalInBounds,
    filtersActive,
    keywordsActive,
    drawnAreaActive,
  });

  const actions = resolveMapEmptyActions({
    variant,
    filtersActive,
    keywordsActive,
    drawnAreaActive,
  });

  const handlers: Record<MapEmptyAction, (() => void) | undefined> = {
    clear_filters: onClearFilters,
    clear_keywords: onClearKeywords,
    clear_drawn_area: onClearDrawnArea,
  };

  return (
    <div className="py-8 text-center" role="status" aria-live="polite">
      <p className="text-sm font-semibold text-[var(--brand-navy)]">{title}</p>
      <p className="mt-1.5 text-xs leading-relaxed text-[var(--muted)]">{detail}</p>
      <div className="mt-4 flex flex-col items-center gap-2">
        {variant === "zoom_for_more" && onZoomIn && (
          <button
            type="button"
            onClick={onZoomIn}
            className="rounded-full bg-[var(--brand-navy)] px-4 py-2 text-xs font-semibold text-white"
          >
            Zoom in
          </button>
        )}
        {actions.map((action) => {
          const onClick = handlers[action];
          if (!onClick) return null;
          const primary = action === "clear_keywords" && actions.length === 1;
          return (
            <button
              key={action}
              type="button"
              onClick={onClick}
              className={
                primary
                  ? "rounded-full bg-[var(--brand-navy)] px-4 py-2 text-xs font-semibold text-white"
                  : "text-xs font-semibold text-[var(--accent)] underline underline-offset-2"
              }
            >
              {mapEmptyActionLabel(action, keywordPreview)}
            </button>
          );
        })}
        {canResetView && onResetView && variant === "no_listings" && (
          <button
            type="button"
            onClick={() => {
              trackEvent("map_empty_state_reset_clicked");
              onResetView();
            }}
            className="text-xs font-semibold text-[var(--muted)] underline underline-offset-2"
          >
            Reset map and filters
          </button>
        )}
      </div>
    </div>
  );
}

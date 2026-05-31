"use client";

import type { MapEmptyAction, MapEmptyVariant } from "@/lib/map-empty-state";
import {
  mapEmptyActionLabel,
  mapEmptyOverlayCopy,
  resolveMapEmptyActions,
} from "@/lib/map-empty-state";

interface Props {
  visible: boolean;
  variant: MapEmptyVariant;
  totalInBounds: number;
  filtersActive: boolean;
  keywordsActive: boolean;
  drawnAreaActive: boolean;
  keywordPreview?: string;
  onZoomIn?: () => void;
  onClearFilters?: () => void;
  onClearKeywords?: () => void;
  onClearDrawnArea?: () => void;
  className?: string;
}

export default function MapEmptyOverlay({
  visible,
  variant,
  totalInBounds,
  filtersActive,
  keywordsActive,
  drawnAreaActive,
  keywordPreview,
  onZoomIn,
  onClearFilters,
  onClearKeywords,
  onClearDrawnArea,
  className = "",
}: Props) {
  if (!visible) return null;

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
    <div
      className={`pointer-events-auto absolute left-1/2 top-1/2 z-10 w-[min(100%,20rem)] -translate-x-1/2 -translate-y-1/2 px-4 ${className}`.trim()}
      role="status"
      aria-live="polite"
    >
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)]/95 px-4 py-4 text-center shadow-[0_12px_40px_rgba(30,58,110,0.15)] backdrop-blur-sm">
        <p className="text-sm font-semibold text-[var(--brand-navy)]">{title}</p>
        <p className="mt-1.5 text-xs leading-relaxed text-[var(--muted)]">{detail}</p>
        <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
          {variant === "zoom_for_more" && onZoomIn && (
            <button
              type="button"
              onClick={onZoomIn}
              className="rounded-full bg-[var(--brand-navy)] px-3 py-1.5 text-[10px] font-semibold text-white"
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
                    ? "rounded-full bg-[var(--brand-navy)] px-3 py-1.5 text-[10px] font-semibold text-white"
                    : "rounded-full border border-[var(--brand-navy)]/25 px-3 py-1.5 text-[10px] font-semibold text-[var(--brand-navy)]"
                }
              >
                {mapEmptyActionLabel(action, keywordPreview)}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

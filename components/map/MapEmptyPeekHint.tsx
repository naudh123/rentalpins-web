"use client";

import type { MapEmptyAction, MapEmptyVariant } from "@/lib/map-empty-state";
import {
  mapEmptyActionLabel,
  mapEmptyOverlayCopy,
  mapEmptyPeekPrimaryAction,
} from "@/lib/map-empty-state";

interface Props {
  visible: boolean;
  variant: MapEmptyVariant;
  totalInBounds: number;
  filtersActive: boolean;
  keywordsActive: boolean;
  drawnAreaActive: boolean;
  keywordPreview?: string;
  actions: MapEmptyAction[];
  onZoomIn?: () => void;
  onClearFilters?: () => void;
  onClearKeywords?: () => void;
  onClearDrawnArea?: () => void;
  onOpenList?: () => void;
  onDismiss?: () => void;
}

export default function MapEmptyPeekHint({
  visible,
  variant,
  totalInBounds,
  filtersActive,
  keywordsActive,
  drawnAreaActive,
  keywordPreview,
  actions,
  onZoomIn,
  onClearFilters,
  onClearKeywords,
  onClearDrawnArea,
  onOpenList,
  onDismiss,
}: Props) {
  if (!visible) return null;

  const { title } = mapEmptyOverlayCopy({
    variant,
    totalInBounds,
    filtersActive,
    keywordsActive,
    drawnAreaActive,
  });

  const primary = mapEmptyPeekPrimaryAction({ variant, actions });
  const handlers: Record<MapEmptyAction, (() => void) | undefined> = {
    clear_filters: onClearFilters,
    clear_keywords: onClearKeywords,
    clear_drawn_area: onClearDrawnArea,
  };

  let buttonLabel = "See options";
  let onPrimary: (() => void) | undefined = onOpenList;
  if (primary === "zoom_in") {
    buttonLabel = "Zoom in";
    onPrimary = onZoomIn;
  } else if (primary && primary !== "open_list") {
    buttonLabel = mapEmptyActionLabel(primary, keywordPreview);
    onPrimary = handlers[primary];
  }

  return (
    <div
      className="pointer-events-auto absolute inset-x-3 bottom-[4.75rem] z-10 mx-auto flex max-w-sm items-center gap-2 rounded-2xl border border-[var(--brand-navy)]/15 bg-[var(--surface)]/95 px-3 py-2 text-xs text-[var(--brand-navy)] shadow-sm backdrop-blur-sm md:hidden"
      role="status"
      aria-live="polite"
    >
      <span className="min-w-0 flex-1 truncate font-medium">{title}</span>
      {onPrimary && (
        <button
          type="button"
          onClick={onPrimary}
          className="shrink-0 rounded-full bg-[var(--brand-navy)] px-3 py-1.5 text-[10px] font-semibold text-white"
        >
          {buttonLabel}
        </button>
      )}
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Dismiss empty map hint for this view"
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[var(--muted)] transition hover:bg-[var(--bg-elevated)] hover:text-[var(--brand-navy)]"
        >
          ×
        </button>
      )}
    </div>
  );
}

"use client";

interface Props {
  visible: boolean;
  listingCount: number;
  onDismiss?: () => void;
}

/** Shown when zoomed out — clusters cover the map; nudge users to zoom for pins. */
export default function MapLowZoomHint({ visible, listingCount, onDismiss }: Props) {
  if (!visible || listingCount === 0) return null;

  const noun = listingCount === 1 ? "rental" : "rentals";

  return (
    <div
      className="pointer-events-auto absolute bottom-24 left-3 right-3 z-10 mx-auto hidden max-w-sm items-center justify-between gap-2 rounded-2xl border border-[var(--brand-navy)]/15 bg-[var(--surface)]/90 px-3 py-2.5 text-xs text-[var(--brand-navy)] shadow-sm backdrop-blur-sm md:bottom-20 md:left-auto md:right-4 md:flex md:px-4"
      role="status"
      aria-live="polite"
    >
      <span className="min-w-0 text-center md:text-left">
        {listingCount} {noun} in view — zoom in for price pins
      </span>
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Dismiss zoom hint for this map view"
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[var(--muted)] transition hover:bg-[var(--bg-elevated)] hover:text-[var(--brand-navy)]"
        >
          ×
        </button>
      )}
    </div>
  );
}

"use client";

interface Props {
  message: string;
  onZoomIn?: () => void;
  onFitAll?: () => void;
  onDismiss?: () => void;
}

/** Subtle luxury hint when the viewport may not show every listing. */
export default function MapDensityBanner({ message, onZoomIn, onFitAll, onDismiss }: Props) {
  return (
    <div
      className="pointer-events-auto absolute bottom-32 left-3 right-3 z-10 mx-auto hidden max-w-md items-center justify-between gap-2 rounded-2xl border border-[var(--brand-orange)]/25 bg-[var(--surface)]/95 px-3 py-2.5 text-xs text-[var(--brand-navy)] shadow-[0_8px_32px_rgba(30,58,110,0.12)] backdrop-blur-sm md:bottom-16 md:left-4 md:right-auto md:flex md:gap-3 md:px-4"
      role="status"
      aria-live="polite"
    >
      <span className="flex min-w-0 flex-1 items-center gap-2">
        <span
          className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--brand-orange)]/15 text-[10px] text-[var(--brand-orange)]"
          aria-hidden
        >
          ◎
        </span>
        <span className="min-w-0">{message}</span>
      </span>
      <span className="flex shrink-0 items-center gap-1.5">
        {onDismiss && (
          <button
            type="button"
            onClick={onDismiss}
            aria-label="Dismiss density hint for this map view"
            className="flex h-7 w-7 items-center justify-center rounded-full text-[var(--muted)] transition hover:bg-[var(--bg-elevated)] hover:text-[var(--brand-navy)]"
          >
            ×
          </button>
        )}
        {onFitAll && (
          <button
            type="button"
            onClick={onFitAll}
            aria-label="Fit map to show all current listings"
            className="rounded-full border border-[var(--brand-navy)]/25 bg-transparent px-3 py-1.5 text-[10px] font-semibold text-[var(--brand-navy)] transition-opacity hover:opacity-90"
          >
            Fit all
          </button>
        )}
        {onZoomIn && (
          <button
            type="button"
            onClick={onZoomIn}
            aria-label="Zoom in to load more listings in this area"
            className="rounded-full bg-[var(--brand-navy)] px-3 py-1.5 text-[10px] font-semibold text-white transition-opacity hover:opacity-90"
          >
            Zoom in
          </button>
        )}
      </span>
    </div>
  );
}

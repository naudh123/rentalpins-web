"use client";

interface Props {
  keywords: string;
  onClear: () => void;
}

/** Active amenity/keyword filter from AI or shared URL. */
export default function MapKeywordChip({ keywords, onClear }: Props) {
  const trimmed = keywords.trim();
  if (!trimmed) return null;

  return (
    <div className="pointer-events-auto flex w-full max-w-xl items-center gap-2 rounded-full border border-[var(--brand-orange)]/30 bg-[var(--surface)] px-3 py-1.5 text-xs shadow-sm">
      <span className="shrink-0 text-[var(--brand-orange)]" aria-hidden>
        ✦
      </span>
      <span className="min-w-0 flex-1 truncate text-[var(--brand-navy)]">
        Keywords: <strong className="font-semibold">{trimmed}</strong>
      </span>
      <button
        type="button"
        onClick={onClear}
        className="shrink-0 rounded-full px-2 py-0.5 font-semibold text-[var(--muted)] hover:text-[var(--brand-navy)]"
        aria-label="Clear keyword filter"
      >
        Clear
      </button>
    </div>
  );
}

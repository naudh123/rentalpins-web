"use client";

interface Props {
  page: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  disabled?: boolean;
}

export default function MapListPagination({
  page,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
  disabled = false,
}: Props) {
  if (totalPages <= 1) return null;

  const start = page * pageSize + 1;
  const end = Math.min(totalItems, (page + 1) * pageSize);

  return (
    <div className="flex shrink-0 items-center justify-between gap-2 border-t border-[var(--border-subtle)] bg-[var(--bg-elevated)]/80 px-3 py-2.5">
      <p className="text-xs text-[var(--muted)]">
        {start}–{end} of {totalItems}
      </p>
      <div className="flex items-center gap-1">
        <button
          type="button"
          className="rp-btn rp-btn-ghost min-h-8 px-2.5 text-xs disabled:opacity-40"
          disabled={disabled || page <= 0}
          onClick={() => onPageChange(page - 1)}
          aria-label="Previous page"
        >
          Prev
        </button>
        <span className="min-w-[4.5rem] text-center text-xs font-medium text-[var(--brand-navy)]">
          {page + 1} / {totalPages}
        </span>
        <button
          type="button"
          className="rp-btn rp-btn-ghost min-h-8 px-2.5 text-xs disabled:opacity-40"
          disabled={disabled || page >= totalPages - 1}
          onClick={() => onPageChange(page + 1)}
          aria-label="Next page"
        >
          Next
        </button>
      </div>
    </div>
  );
}

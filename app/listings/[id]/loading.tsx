export default function ListingDetailLoading() {
  return (
    <div
      className="mx-auto max-w-3xl px-4 py-6 pb-28 sm:py-8 sm:pb-8"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <span className="sr-only">Loading listing details.</span>
      <div className="motion-safe:animate-pulse">
        <div className="mb-4 h-5 w-40 rounded bg-[var(--surface)]" />
        <div className="h-56 w-full rounded-[var(--radius-xl)] bg-[var(--surface)] sm:h-72" />

        <div className="mt-6 rounded-[var(--radius-xl)] border border-[var(--border)] p-5">
          <div className="h-4 w-20 rounded bg-[var(--surface)]" />
          <div className="mt-3 h-8 w-3/4 rounded bg-[var(--surface)]" />
          <div className="mt-3 h-4 w-1/2 rounded bg-[var(--surface)]" />
          <div className="mt-5 h-8 w-36 rounded bg-[var(--surface)]" />
          <div className="mt-4 h-4 w-48 rounded bg-[var(--surface)]" />
        </div>

        <div className="mt-4 rounded-[var(--radius-xl)] border border-[var(--border)] p-5">
          <div className="h-4 w-28 rounded bg-[var(--surface)]" />
          <div className="mt-3 h-20 w-full rounded bg-[var(--surface)]" />
        </div>

        <div className="mt-4 rounded-[var(--radius-xl)] border border-[var(--border)] p-5">
          <div className="h-4 w-24 rounded bg-[var(--surface)]" />
          <div className="mt-3 h-16 w-full rounded bg-[var(--surface)]" />
        </div>
      </div>
    </div>
  );
}

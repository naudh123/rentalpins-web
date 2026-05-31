/** Placeholder card while map listings load. */
export default function MapListingCardSkeleton() {
  return (
    <div
      className="flex animate-pulse gap-3 rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] p-3"
      aria-hidden="true"
    >
      <div className="h-[5.5rem] w-[5.5rem] shrink-0 rounded-[var(--radius-md)] bg-[var(--bg-elevated)]" />
      <div className="flex min-w-0 flex-1 flex-col justify-center gap-2">
        <div className="h-4 w-[80%] rounded bg-[var(--bg-elevated)]" />
        <div className="h-3 w-1/2 rounded bg-[var(--bg-elevated)]" />
        <div className="h-4 w-1/3 rounded bg-[var(--bg-elevated)]" />
      </div>
    </div>
  );
}

interface ProjectConstructionTimelineProps {
  updates: string[];
}

export default function ProjectConstructionTimeline({
  updates,
}: ProjectConstructionTimelineProps) {
  if (updates.length === 0) return null;

  return (
    <ol className="relative space-y-0 border-l-2 border-[var(--lux-accent-muted)] pl-6">
      {updates.map((update, i) => (
        <li key={`${i}-${update.slice(0, 24)}`} className="relative pb-8 last:pb-0">
          <span
            className="absolute -left-[1.65rem] top-1 flex h-3 w-3 rounded-full border-2 border-[var(--lux-accent)] bg-[var(--surface)]"
            aria-hidden
          />
          <p className="text-sm leading-relaxed text-[var(--muted)]">{update}</p>
        </li>
      ))}
    </ol>
  );
}

interface TrustStat {
  label: string;
  value: string;
}

export default function TrustStats({ stats }: { stats: TrustStat[] }) {
  return (
    <section className="border-y border-[var(--border-subtle)] bg-[var(--bg-elevated)]/50 px-4 py-8">
      <div className="mx-auto grid max-w-5xl grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {stats.map((s) => (
          <div key={s.label} className="rp-card p-4 text-center">
            <p className="font-serif text-xl text-[var(--brand-orange)]">{s.value}</p>
            <p className="mt-1 text-[11px] font-semibold uppercase tracking-wide text-[var(--muted)]">
              {s.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

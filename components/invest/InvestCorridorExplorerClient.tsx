"use client";

import Link from "next/link";
import { appPath } from "@/lib/config";
import {
  INVEST_CORRIDORS,
  corridorBuySearchUrl,
  corridorRentSearchUrl,
  type InvestCorridor,
} from "@/lib/invest/invest-corridors";
import { useState } from "react";

function CorridorCard({ corridor }: { corridor: InvestCorridor }) {
  return (
    <article className="rounded-2xl border border-[var(--border)] bg-white p-6 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--invest-emerald)]">
            {corridor.tagline}
          </p>
          <h2 className="mt-1 font-serif text-xl text-[var(--brand-navy)]">{corridor.name}</h2>
        </div>
        <span className="rounded-full bg-[color-mix(in_srgb,var(--invest-emerald)_10%,white)] px-3 py-1 text-xs font-medium text-[var(--invest-emerald)]">
          {corridor.budgetBand}
        </span>
      </div>
      <p className="mt-2 text-sm text-[var(--muted)]">Hold horizon: {corridor.horizon}</p>
      <ul className="mt-4 space-y-2 text-sm text-[var(--brand-navy)]">
        {corridor.highlights.map((h) => (
          <li key={h} className="flex gap-2">
            <span className="text-[var(--invest-emerald)]" aria-hidden>
              ✓
            </span>
            {h}
          </li>
        ))}
      </ul>
      <div className="mt-6 flex flex-wrap gap-2">
        <Link
          href={appPath(corridorBuySearchUrl(corridor))}
          className="rounded-full bg-[var(--invest-emerald)] px-4 py-2 text-xs font-semibold text-white"
        >
          Buy map
        </Link>
        <Link
          href={appPath(corridorRentSearchUrl(corridor))}
          className="rounded-full border border-[var(--border)] px-4 py-2 text-xs font-semibold text-[var(--brand-navy)]"
        >
          Rent comps
        </Link>
        <Link
          href={appPath(`/invest/calculator`)}
          className="rounded-full border border-[var(--border)] px-4 py-2 text-xs font-semibold text-[var(--brand-navy)]"
        >
          Yield calc
        </Link>
        {corridor.guidePath && (
          <Link
            href={appPath(corridor.guidePath)}
            className="rounded-full border border-[var(--border)] px-4 py-2 text-xs font-semibold text-[var(--brand-navy)]"
          >
            Guide
          </Link>
        )}
        {corridor.projectsPath && (
          <Link
            href={appPath(corridor.projectsPath)}
            className="text-xs font-semibold text-[var(--muted)] self-center hover:underline"
          >
            Projects →
          </Link>
        )}
      </div>
    </article>
  );
}

export default function InvestCorridorExplorerClient() {
  const [strategyFilter, setStrategyFilter] = useState<string>("all");

  const filtered =
    strategyFilter === "all"
      ? INVEST_CORRIDORS
      : INVEST_CORRIDORS.filter((c) => c.strategy === strategyFilter);

  const strategies = [...new Set(INVEST_CORRIDORS.map((c) => c.strategy))];

  return (
    <div className="invest-theme space-y-6">
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setStrategyFilter("all")}
          className={`rounded-full px-4 py-2 text-sm font-semibold ${
            strategyFilter === "all"
              ? "bg-[var(--invest-emerald)] text-white"
              : "border border-[var(--border)] bg-white"
          }`}
        >
          All strategies
        </button>
        {strategies.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setStrategyFilter(s)}
            className={`rounded-full px-4 py-2 text-sm font-semibold capitalize ${
              strategyFilter === s
                ? "bg-[var(--invest-emerald)] text-white"
                : "border border-[var(--border)] bg-white"
            }`}
          >
            {s.replace(/-/g, " ")}
          </button>
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        {filtered.map((c) => (
          <CorridorCard key={c.id} corridor={c} />
        ))}
      </div>
    </div>
  );
}

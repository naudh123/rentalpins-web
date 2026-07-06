"use client";

import Link from "next/link";
import { appPath } from "@/lib/config";
import { INVEST_CORRIDORS } from "@/lib/invest/invest-corridors";
import {
  INVEST_GOAL_OPTIONS,
  INVEST_HUB,
  INVEST_QUICK_ACTIONS,
  INVEST_TOOLS,
  goalToCorridorFilter,
  type InvestGoal,
} from "@/lib/invest/invest-hub-content";
import { useMemo, useState } from "react";

export default function InvestHubClient() {
  const [goal, setGoal] = useState<InvestGoal>("both");

  const corridors = useMemo(() => {
    const filter = goalToCorridorFilter(goal);
    if (!filter) return INVEST_CORRIDORS;
    return INVEST_CORRIDORS.filter((c) => filter.includes(c.id));
  }, [goal]);

  return (
    <div className="invest-theme">
      {/* Goal picker */}
      <section className="mt-10">
        <h2 className="font-serif text-xl text-[var(--brand-navy)]">What is your primary goal?</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {INVEST_GOAL_OPTIONS.map((opt) => (
            <button
              key={opt.id}
              type="button"
              onClick={() => setGoal(opt.id)}
              className={`rounded-xl border p-4 text-left transition ${
                goal === opt.id
                  ? "border-[var(--invest-emerald)] bg-[color-mix(in_srgb,var(--invest-emerald)_8%,white)]"
                  : "border-[var(--border)] bg-white hover:border-[color-mix(in_srgb,var(--invest-emerald)_25%,var(--border))]"
              }`}
            >
              <p className="font-semibold text-[var(--brand-navy)]">{opt.label}</p>
              <p className="mt-1 text-xs text-[var(--muted)]">{opt.hint}</p>
            </button>
          ))}
        </div>
      </section>

      {/* Corridors */}
      <section className="mt-12">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="font-serif text-xl text-[var(--brand-navy)]">Growth corridors</h2>
            <p className="mt-1 text-sm text-[var(--muted)]">
              Tricity-native belts with buy map, rent comps, and guide links.
            </p>
          </div>
          <Link
            href={appPath("/invest/corridors")}
            className="text-sm font-semibold text-[var(--invest-emerald)] hover:underline"
          >
            Full corridor explorer →
          </Link>
        </div>
        <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {corridors.map((c) => (
            <li key={c.id}>
              <article className="rp-home-area-card rp-home-area-card--invest h-full p-5">
                <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--invest-emerald)]">
                  {c.tagline}
                </p>
                <h3 className="mt-2 font-serif text-lg text-[var(--brand-navy)]">{c.name}</h3>
                <p className="mt-2 text-xs text-[var(--muted)]">
                  {c.budgetBand} · {c.horizon}
                </p>
                <ul className="mt-3 space-y-1 text-xs text-[var(--muted)]">
                  {c.highlights.slice(0, 2).map((h) => (
                    <li key={h}>· {h}</li>
                  ))}
                </ul>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Link
                    href={appPath(`/buy/search?lat=${c.mapCenter.lat}&lng=${c.mapCenter.lng}&zoom=${c.mapZoom}`)}
                    className="rounded-full bg-[var(--invest-emerald)] px-3 py-1.5 text-xs font-semibold text-white"
                  >
                    Buy map
                  </Link>
                  {c.guidePath && (
                    <Link
                      href={appPath(c.guidePath)}
                      className="rounded-full border border-[var(--border)] px-3 py-1.5 text-xs font-semibold text-[var(--brand-navy)]"
                    >
                      Guide
                    </Link>
                  )}
                </div>
              </article>
            </li>
          ))}
        </ul>
      </section>

      {/* Tools grid */}
      <section className="mt-14">
        <h2 className="font-serif text-xl text-[var(--brand-navy)]">Investor tools</h2>
        <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {INVEST_TOOLS.map((tool) => (
            <li key={tool.href}>
              <Link href={appPath(tool.href)} className="block h-full no-underline">
                <article className="h-full rounded-xl border border-[var(--border)] bg-white p-5 transition hover:border-[color-mix(in_srgb,var(--invest-emerald)_30%,var(--border))]">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--invest-emerald)]">
                    {tool.tag}
                  </span>
                  <h3 className="mt-2 font-semibold text-[var(--brand-navy)]">{tool.title}</h3>
                  <p className="mt-2 text-sm text-[var(--muted)]">{tool.description}</p>
                </article>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* Quick actions + disclaimer */}
      <section className="mt-14 rounded-2xl border border-[color-mix(in_srgb,var(--invest-emerald)_20%,var(--border))] bg-[color-mix(in_srgb,var(--invest-platinum)_60%,white)] p-6">
        <h2 className="font-serif text-lg text-[var(--brand-navy)]">Ready to underwrite?</h2>
        <div className="mt-4 flex flex-wrap gap-3">
          {INVEST_QUICK_ACTIONS.map((a) => (
            <Link
              key={a.href}
              href={appPath(a.href)}
              className={
                a.href.includes("calculator") || a.href.includes("advisor")
                  ? "rounded-full bg-[var(--invest-emerald)] px-5 py-2.5 text-sm font-semibold text-white"
                  : "rounded-full border border-[var(--border)] bg-white px-5 py-2.5 text-sm font-semibold text-[var(--brand-navy)]"
              }
            >
              {a.label}
            </Link>
          ))}
        </div>
        <p className="mt-5 text-xs leading-relaxed text-[var(--muted)]">{INVEST_HUB.disclaimer}</p>
      </section>
    </div>
  );
}

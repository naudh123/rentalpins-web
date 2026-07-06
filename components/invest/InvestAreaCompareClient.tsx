"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { appPath } from "@/lib/config";
import {
  INVEST_COMPARE_SLUGS,
  compareInvestAreas,
} from "@/lib/invest/invest-compare";

export default function InvestAreaCompareClient() {
  const [selected, setSelected] = useState<string[]>(["mohali", "zirakpur"]);

  function toggle(slug: string) {
    setSelected((prev) => {
      if (prev.includes(slug)) {
        return prev.filter((s) => s !== slug);
      }
      if (prev.length >= 4) return prev;
      return [...prev, slug];
    });
  }

  const { profiles, note } = useMemo(() => compareInvestAreas(selected), [selected]);

  return (
    <div className="invest-theme">
      <div className="flex flex-wrap gap-2">
        {INVEST_COMPARE_SLUGS.map((slug) => {
          const active = selected.includes(slug);
          return (
            <button
              key={slug}
              type="button"
              onClick={() => toggle(slug)}
              className={`rounded-full px-4 py-2 text-sm font-semibold capitalize transition ${
                active
                  ? "bg-[var(--invest-emerald)] text-white"
                  : "border border-[var(--border)] bg-white text-[var(--brand-navy)]"
              }`}
            >
              {slug}
            </button>
          );
        })}
      </div>
      <p className="mt-3 text-xs text-[var(--muted)]">{note}</p>

      {profiles.length >= 2 && (
        <div className="mt-8 overflow-x-auto">
          <table className="w-full min-w-[640px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-[var(--border)] text-left">
                <th className="py-3 pr-4 font-medium text-[var(--muted)]">Factor</th>
                {profiles.map((p) => (
                  <th key={p.slug} className="py-3 pr-4 font-serif text-[var(--brand-navy)]">
                    {p.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {(
                [
                  ["Budget band", (p: (typeof profiles)[0]) => p.budgetBand],
                  ["Horizon", (p: (typeof profiles)[0]) => p.horizon],
                  ["Yield style", (p: (typeof profiles)[0]) => p.yieldStyle],
                  ["Appreciation", (p: (typeof profiles)[0]) => p.appreciationStyle],
                  ["Liquidity", (p: (typeof profiles)[0]) => p.liquidity],
                  ["Tenant profile", (p: (typeof profiles)[0]) => p.tenantProfile],
                ] as const
              ).map(([label, getter]) => (
                <tr key={label}>
                  <td className="py-3 pr-4 align-top font-medium text-[var(--muted)]">{label}</td>
                  {profiles.map((p) => (
                    <td key={p.slug} className="py-3 pr-4 align-top text-[var(--brand-navy)]">
                      {getter(p)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {profiles.length >= 2 && (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {profiles.map((p) => (
            <article
              key={p.slug}
              className="rounded-xl border border-[var(--border)] bg-white p-4"
            >
              <h3 className="font-semibold text-[var(--brand-navy)]">{p.name}</h3>
              <p className="mt-2 text-xs font-medium text-[var(--invest-emerald)]">Strengths</p>
              <ul className="mt-1 space-y-1 text-xs text-[var(--muted)]">
                {p.strengths.slice(0, 3).map((s) => (
                  <li key={s}>· {s}</li>
                ))}
              </ul>
              <p className="mt-3 text-xs font-medium text-red-700/80">Risks</p>
              <ul className="mt-1 space-y-1 text-xs text-[var(--muted)]">
                {p.risks.slice(0, 2).map((r) => (
                  <li key={r}>· {r}</li>
                ))}
              </ul>
              <div className="mt-4 flex flex-wrap gap-2">
                <Link
                  href={appPath(p.buyMapPath)}
                  className="text-xs font-semibold text-[var(--invest-emerald)] hover:underline"
                >
                  Buy map
                </Link>
                <Link
                  href={appPath(p.rentMapPath)}
                  className="text-xs font-semibold text-[var(--muted)] hover:underline"
                >
                  Rent comps
                </Link>
                {p.guidePath && (
                  <Link
                    href={appPath(p.guidePath)}
                    className="text-xs font-semibold text-[var(--muted)] hover:underline"
                  >
                    Guide
                  </Link>
                )}
              </div>
            </article>
          ))}
        </div>
      )}

      <div className="mt-10 rounded-xl border border-[var(--border)] bg-[color-mix(in_srgb,var(--invest-platinum)_40%,white)] p-5">
        <p className="text-sm text-[var(--muted)]">
          Next step: run the{" "}
          <Link href={appPath("/invest/calculator")} className="font-semibold text-[var(--invest-emerald)] hover:underline">
            yield calculator
          </Link>{" "}
          with rent comps from the rent map for your shortlisted society.
        </p>
      </div>
    </div>
  );
}

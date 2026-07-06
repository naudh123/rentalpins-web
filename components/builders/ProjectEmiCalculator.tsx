"use client";

import { useMemo, useState } from "react";
import { estimateEmi, formatEmi } from "@/lib/builders/project-emi";
import { formatIndianPrice } from "@/lib/builders/format";

interface ProjectEmiCalculatorProps {
  priceMin: number | null;
  priceMax: number | null;
  paymentPlan?: string | null;
}

export default function ProjectEmiCalculator({
  priceMin,
  priceMax,
  paymentPlan,
}: ProjectEmiCalculatorProps) {
  const defaultPrincipal = priceMin ?? priceMax ?? 50_00_000;
  const [principalCr, setPrincipalCr] = useState(
    (defaultPrincipal / 1_00_00_000).toFixed(2)
  );
  const [rate, setRate] = useState("8.5");
  const [years, setYears] = useState("20");

  const emi = useMemo(() => {
    const p = parseFloat(principalCr) * 1_00_00_000;
    const r = parseFloat(rate);
    const y = parseInt(years, 10);
    if (!Number.isFinite(p) || p <= 0) return 0;
    return estimateEmi(p, Number.isFinite(r) ? r : 8.5, Number.isFinite(y) ? y : 20);
  }, [principalCr, rate, years]);

  if (priceMin == null && priceMax == null && !paymentPlan) return null;

  return (
    <div className="lux-glass rounded-2xl p-6 sm:p-8">
      <p className="lux-eyebrow">Affordability</p>
      <p className="mt-2 font-serif text-3xl font-bold text-[var(--lux-primary)]">
        {formatEmi(emi)}
      </p>
      <p className="mt-2 text-sm text-[var(--muted)]">
        Indicative monthly EMI at {rate}% over {years} years
        {priceMin != null && ` · From ${formatIndianPrice(priceMin)}`}
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
          Loan amount (Cr)
          <input
            type="number"
            step="0.05"
            min="0.1"
            value={principalCr}
            onChange={(e) => setPrincipalCr(e.target.value)}
            className="lux-input mt-2 w-full py-2"
          />
        </label>
        <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
          Rate (% p.a.)
          <input
            type="number"
            step="0.1"
            min="1"
            max="20"
            value={rate}
            onChange={(e) => setRate(e.target.value)}
            className="lux-input mt-2 w-full py-2"
          />
        </label>
        <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
          Tenure (years)
          <input
            type="number"
            min="1"
            max="30"
            value={years}
            onChange={(e) => setYears(e.target.value)}
            className="lux-input mt-2 w-full py-2"
          />
        </label>
      </div>

      {paymentPlan && (
        <p className="mt-6 rounded-xl border border-[var(--border)] bg-white/60 px-4 py-3 text-sm leading-relaxed text-[var(--muted)]">
          {paymentPlan}
        </p>
      )}
      <p className="mt-4 text-[0.65rem] tracking-wide text-[var(--muted)]">
        Illustrative only. Actual rates depend on lender and profile.
      </p>
    </div>
  );
}

"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { formatEmi } from "@/lib/builders/project-emi";
import { appPath } from "@/lib/config";
import {
  computeYield,
  formatCashFlow,
  formatYieldPercent,
} from "@/lib/invest/yield-calculator";

function parseLakhs(raw: string): number {
  const n = parseFloat(raw.replace(/,/g, ""));
  if (!Number.isFinite(n) || n <= 0) return 0;
  return Math.round(n * 1_00_000);
}

function parseThousands(raw: string): number {
  const n = parseFloat(raw.replace(/,/g, ""));
  if (!Number.isFinite(n) || n <= 0) return 0;
  return Math.round(n * 1_000);
}

interface Props {
  /** Pre-fill from URL e.g. ?price=75&rent=22 */
  initialBuyLakh?: string;
  initialRentK?: string;
}

export default function InvestYieldCalculator({
  initialBuyLakh = "75",
  initialRentK = "22",
}: Props) {
  const [buyLakh, setBuyLakh] = useState(initialBuyLakh);
  const [downLakh, setDownLakh] = useState("15");
  const [rentK, setRentK] = useState(initialRentK);
  const [maintenanceK, setMaintenanceK] = useState("3");
  const [vacancyPct, setVacancyPct] = useState("8");
  const [rate, setRate] = useState("8.5");
  const [years, setYears] = useState("20");

  const result = useMemo(() => {
    const buyPrice = parseLakhs(buyLakh);
    const downPayment = parseLakhs(downLakh);
    return computeYield({
      buyPrice,
      downPayment,
      monthlyRent: parseThousands(rentK),
      annualMaintenance: parseThousands(maintenanceK) * 1_000,
      vacancyRate: (parseFloat(vacancyPct) || 0) / 100,
      loanRatePercent: parseFloat(rate) || 8.5,
      loanTenureYears: parseInt(years, 10) || 20,
    });
  }, [buyLakh, downLakh, rentK, maintenanceK, vacancyPct, rate, years]);

  return (
    <div className="invest-theme">
      <div className="grid gap-8 lg:grid-cols-2">
        <div className="rounded-2xl border border-[var(--border)] bg-white p-6 shadow-[var(--shadow-card)]">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--invest-emerald)]">
            Inputs
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
              Buy price (₹ L)
              <input
                type="number"
                min={1}
                step={1}
                value={buyLakh}
                onChange={(e) => setBuyLakh(e.target.value)}
                className="rp-input mt-2 w-full"
              />
            </label>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
              Down payment (₹ L)
              <input
                type="number"
                min={0}
                step={1}
                value={downLakh}
                onChange={(e) => setDownLakh(e.target.value)}
                className="rp-input mt-2 w-full"
              />
            </label>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
              Expected rent (₹ k/mo)
              <input
                type="number"
                min={0}
                step={0.5}
                value={rentK}
                onChange={(e) => setRentK(e.target.value)}
                className="rp-input mt-2 w-full"
              />
            </label>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
              Maintenance (₹ k/yr)
              <input
                type="number"
                min={0}
                step={0.5}
                value={maintenanceK}
                onChange={(e) => setMaintenanceK(e.target.value)}
                className="rp-input mt-2 w-full"
              />
            </label>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
              Vacancy buffer (%)
              <input
                type="number"
                min={0}
                max={50}
                step={1}
                value={vacancyPct}
                onChange={(e) => setVacancyPct(e.target.value)}
                className="rp-input mt-2 w-full"
              />
            </label>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
              Loan rate (% p.a.)
              <input
                type="number"
                min={1}
                max={20}
                step={0.1}
                value={rate}
                onChange={(e) => setRate(e.target.value)}
                className="rp-input mt-2 w-full"
              />
            </label>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--muted)] sm:col-span-2">
              Loan tenure (years)
              <input
                type="number"
                min={1}
                max={30}
                value={years}
                onChange={(e) => setYears(e.target.value)}
                className="rp-input mt-2 w-full"
              />
            </label>
          </div>
          <p className="mt-4 text-xs text-[var(--muted)]">
            Pull rent comps from the{" "}
            <Link href={appPath("/search")} className="font-semibold text-[var(--invest-emerald)] hover:underline">
              rent map
            </Link>{" "}
            for your target society before finalising rent assumptions.
          </p>
        </div>

        <div className="rounded-2xl border border-[color-mix(in_srgb,var(--invest-emerald)_25%,var(--border))] bg-[color-mix(in_srgb,var(--invest-platinum)_50%,white)] p-6">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--invest-emerald)]">
            Indicative results
          </p>
          <dl className="mt-6 space-y-4">
            <div>
              <dt className="text-xs text-[var(--muted)]">Monthly EMI</dt>
              <dd className="font-serif text-3xl font-bold text-[var(--brand-navy)]">
                {formatEmi(result.emi)}
              </dd>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <dt className="text-xs text-[var(--muted)]">Gross yield</dt>
                <dd className="text-lg font-semibold text-[var(--brand-navy)]">
                  {formatYieldPercent(result.grossYieldPercent)}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-[var(--muted)]">Net yield</dt>
                <dd className="text-lg font-semibold text-[var(--invest-emerald)]">
                  {formatYieldPercent(result.netYieldPercent)}
                </dd>
              </div>
            </div>
            <div>
              <dt className="text-xs text-[var(--muted)]">Monthly cash flow (after vacancy)</dt>
              <dd
                className={`text-lg font-semibold ${
                  result.monthlyCashFlow >= 0 ? "text-[var(--invest-emerald)]" : "text-red-600"
                }`}
              >
                {formatCashFlow(result.monthlyCashFlow)}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-[var(--muted)]">Break-even rent (cover EMI + maintenance)</dt>
              <dd className="text-sm font-medium text-[var(--brand-navy)]">
                ₹{result.breakEvenRent.toLocaleString("en-IN")}/mo
              </dd>
            </div>
          </dl>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href={appPath("/buy/search")}
              className="rounded-full bg-[var(--invest-emerald)] px-5 py-2.5 text-sm font-semibold text-white"
            >
              Shortlist on buy map
            </Link>
            <Link
              href={appPath("/search")}
              className="rounded-full border border-[var(--border)] bg-white px-5 py-2.5 text-sm font-semibold text-[var(--brand-navy)]"
            >
              Check rent comps
            </Link>
          </div>
          <p className="mt-4 text-[0.65rem] leading-relaxed text-[var(--muted)]">
            Illustrative only. Actual yields depend on rent achieved, vacancy, taxes, and loan terms.
            RentalPins does not provide investment advice.
          </p>
        </div>
      </div>
    </div>
  );
}

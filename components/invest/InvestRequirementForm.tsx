"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/AuthProvider";
import { appPath } from "@/lib/config";
import { createBuyerRequirement } from "@/lib/buyer-requirements";
import type {
  BuyerRequirementPurpose,
  InvestorHoldPeriod,
  InvestorTargetYield,
  InvestorTenantType,
} from "@/lib/types/buyer-requirement";
import { BUY_HUB_SLUGS } from "@/lib/sale/buy-pages-config";
import { INVEST_REQUIREMENTS_POST_PATH } from "@/lib/invest/invest-paths";

const PROPERTY_TYPES = [
  "1–2 BHK Flat",
  "2–3 BHK Flat",
  "3+ BHK Flat",
  "Villa / House",
  "Plot / Land",
  "Commercial (Shop / Office)",
  "Any residential",
] as const;

const TIMELINES = [
  "Within 1 month",
  "Within 3 months",
  "Within 6 months",
  "Flexible",
] as const;

const HOLD_PERIODS: InvestorHoldPeriod[] = [
  "Under 3 years",
  "3–5 years",
  "5–10 years",
  "10+ years",
];

const YIELD_BANDS: InvestorTargetYield[] = [
  "Any",
  "4–6% net",
  "6–8% net",
  "8%+ net",
  "Appreciation focus",
];

const TENANT_TYPES: InvestorTenantType[] = [
  "Any",
  "Family / professional",
  "Student / PG",
  "Commercial tenant",
];

function parseBudgetLakhs(raw: string): number | null {
  const n = Number(raw.replace(/,/g, "").trim());
  if (!Number.isFinite(n) || n <= 0) return null;
  return Math.round(n * 1_00_000);
}

export default function InvestRequirementForm() {
  const router = useRouter();
  const { user } = useAuth();
  const [propertyType, setPropertyType] = useState<string>(PROPERTY_TYPES[1]!);
  const [budgetMinL, setBudgetMinL] = useState("");
  const [budgetMaxL, setBudgetMaxL] = useState("");
  const [city, setCity] = useState("mohali");
  const [locality, setLocality] = useState("");
  const [timeline, setTimeline] = useState<string>(TIMELINES[1]!);
  const [holdPeriod, setHoldPeriod] = useState<InvestorHoldPeriod>("3–5 years");
  const [targetYield, setTargetYield] = useState<InvestorTargetYield>("Any");
  const [tenantType, setTenantType] = useState<InvestorTenantType>("Any");
  const [notes, setNotes] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) {
      router.push(
        appPath(`/auth/login?next=${encodeURIComponent(INVEST_REQUIREMENTS_POST_PATH)}`)
      );
      return;
    }
    setError("");
    setBusy(true);
    try {
      await createBuyerRequirement(user.uid, {
        propertyType,
        budgetMin: parseBudgetLakhs(budgetMinL),
        budgetMax: parseBudgetLakhs(budgetMaxL),
        city,
        locality: locality.trim() || city,
        timeline,
        purpose: "Investment" as BuyerRequirementPurpose,
        holdPeriod,
        targetYield,
        tenantType,
        notes: notes.trim() || undefined,
      });
      router.push(appPath("/buy/requirements?posted=1&purpose=investment"));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not post requirement");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="invest-theme space-y-5">
      <div>
        <label className="rp-label">Property type</label>
        <select
          value={propertyType}
          onChange={(e) => setPropertyType(e.target.value)}
          className="rp-input"
          required
        >
          {PROPERTY_TYPES.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="rp-label">Budget min (₹ lakh)</label>
          <input
            type="number"
            min={0}
            value={budgetMinL}
            onChange={(e) => setBudgetMinL(e.target.value)}
            className="rp-input"
            placeholder="e.g. 50"
          />
        </div>
        <div>
          <label className="rp-label">Budget max (₹ lakh)</label>
          <input
            type="number"
            min={0}
            value={budgetMaxL}
            onChange={(e) => setBudgetMaxL(e.target.value)}
            className="rp-input"
            placeholder="e.g. 90"
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="rp-label">City</label>
          <select value={city} onChange={(e) => setCity(e.target.value)} className="rp-input">
            {BUY_HUB_SLUGS.map((slug) => (
              <option key={slug} value={slug}>
                {slug.charAt(0).toUpperCase() + slug.slice(1)}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="rp-label">Target corridor / locality</label>
          <input
            type="text"
            value={locality}
            onChange={(e) => setLocality(e.target.value)}
            className="rp-input"
            placeholder="e.g. Aerocity, VIP Road, Kharar CU"
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="rp-label">Purchase timeline</label>
          <select
            value={timeline}
            onChange={(e) => setTimeline(e.target.value)}
            className="rp-input"
          >
            {TIMELINES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="rp-label">Hold period</label>
          <select
            value={holdPeriod}
            onChange={(e) => setHoldPeriod(e.target.value as InvestorHoldPeriod)}
            className="rp-input"
          >
            {HOLD_PERIODS.map((h) => (
              <option key={h} value={h}>
                {h}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="rp-label">Target yield band</label>
          <select
            value={targetYield}
            onChange={(e) => setTargetYield(e.target.value as InvestorTargetYield)}
            className="rp-input"
          >
            {YIELD_BANDS.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="rp-label">Preferred tenant type</label>
          <select
            value={tenantType}
            onChange={(e) => setTenantType(e.target.value as InvestorTenantType)}
            className="rp-input"
          >
            {TENANT_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="rp-label">Investment thesis / notes</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="rp-input min-h-[88px]"
          placeholder="Yield vs appreciation, furnished preference, society type…"
          maxLength={500}
        />
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button type="submit" disabled={busy} className="rounded-full bg-[var(--invest-emerald)] px-6 py-3 text-sm font-semibold text-white disabled:opacity-60">
        {busy ? "Publishing…" : "Publish investor requirement"}
      </button>
      <p className="text-xs text-[var(--muted)]">
        Posted to the public buyer board with Purpose = Investment. Sellers and developers can match without seeing your phone number.
      </p>
    </form>
  );
}

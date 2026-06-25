"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/AuthProvider";
import { appPath } from "@/lib/config";
import { createBuyerRequirement } from "@/lib/buyer-requirements";
import type { BuyerRequirementPurpose } from "@/lib/types/buyer-requirement";
import { BUY_HUB_SLUGS } from "@/lib/sale/buy-pages-config";

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

const PURPOSES: BuyerRequirementPurpose[] = ["Self use", "Investment", "Both"];

interface Props {
  defaultCity?: string;
  defaultLocality?: string;
  onSuccess?: () => void;
}

function parseBudgetLakhs(raw: string): number | null {
  const n = Number(raw.replace(/,/g, "").trim());
  if (!Number.isFinite(n) || n <= 0) return null;
  return Math.round(n * 1_00_000);
}

export default function BuyerRequirementForm({
  defaultCity = "mohali",
  defaultLocality = "",
  onSuccess,
}: Props) {
  const router = useRouter();
  const { user } = useAuth();
  const [propertyType, setPropertyType] = useState<string>(PROPERTY_TYPES[1]!);
  const [budgetMinL, setBudgetMinL] = useState("");
  const [budgetMaxL, setBudgetMaxL] = useState("");
  const [city, setCity] = useState(defaultCity);
  const [locality, setLocality] = useState(defaultLocality);
  const [timeline, setTimeline] = useState<string>(TIMELINES[1]!);
  const [purpose, setPurpose] = useState<BuyerRequirementPurpose>("Self use");
  const [notes, setNotes] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) {
      router.push(appPath(`/auth/login?next=${encodeURIComponent("/buy/requirements/post")}`));
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
        purpose,
        notes: notes.trim() || undefined,
      });
      onSuccess?.();
      router.push(appPath("/buy/requirements?posted=1"));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not post requirement");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
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
            step={1}
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
            step={1}
            value={budgetMaxL}
            onChange={(e) => setBudgetMaxL(e.target.value)}
            className="rp-input"
            placeholder="e.g. 80"
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
          <label className="rp-label">Preferred locality</label>
          <input
            type="text"
            value={locality}
            onChange={(e) => setLocality(e.target.value)}
            className="rp-input"
            placeholder="e.g. Phase 7, Sector 70"
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="rp-label">Timeline</label>
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
          <label className="rp-label">Purpose</label>
          <select
            value={purpose}
            onChange={(e) => setPurpose(e.target.value as BuyerRequirementPurpose)}
            className="rp-input"
          >
            {PURPOSES.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="rp-label">Additional notes (optional)</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="rp-input min-h-[88px]"
          placeholder="Parking, floor preference, society type…"
          maxLength={500}
        />
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button type="submit" disabled={busy} className="rp-btn rp-btn-primary px-6 py-3">
        {busy ? "Publishing…" : "Publish requirement"}
      </button>
      <p className="text-xs text-[var(--muted)]">
        Your phone number is not shown publicly. Sellers reach you through RentalPins.
      </p>
    </form>
  );
}

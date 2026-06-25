"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { appPath } from "@/lib/config";
import {
  advisorModeLabel,
  defaultAdvisorMapPath,
  recommendBuyAreas,
  resolveAdvisorMapUrl,
  type AdvisorMode,
} from "@/lib/property-advisor";
import { trackEvent } from "@/lib/ga4";

const PURPOSES = ["Self use", "Investment", "Rental income", "Any"];
const TIMELINES = ["Within 1 month", "Within 3 months", "Within 6 months", "Flexible"];

export default function PropertyAdvisorPanel() {
  const router = useRouter();
  const [mode, setMode] = useState<AdvisorMode>("buy");
  const [budgetMinL, setBudgetMinL] = useState("");
  const [budgetMaxL, setBudgetMaxL] = useState("");
  const [purpose, setPurpose] = useState("Self use");
  const [timeline, setTimeline] = useState("Within 3 months");
  const [locationHint, setLocationHint] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [previewAreas, setPreviewAreas] = useState<
    ReturnType<typeof recommendBuyAreas>
  >([]);

  function parseLakhs(raw: string): number | null {
    const n = Number(raw.replace(/,/g, "").trim());
    if (!Number.isFinite(n) || n <= 0) return null;
    return Math.round(n * 1_00_000);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setBusy(true);
    trackEvent("advisor_submit", { mode });

    const budgetMax = parseLakhs(budgetMaxL);
    const budgetMin = parseLakhs(budgetMinL);

    try {
      const { mapUrl } = await resolveAdvisorMapUrl({
        mode,
        budgetMin,
        budgetMax,
        purpose,
        timeline,
        locationHint,
      });
      router.push(appPath(mapUrl));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Advisor could not build recommendations");
      if (mode !== "rent") {
        setPreviewAreas(recommendBuyAreas(parseLakhs(budgetMaxL), locationHint));
      }
    } finally {
      setBusy(false);
    }
  }

  function handlePreviewAreas() {
    setPreviewAreas(
      mode === "rent" ? [] : recommendBuyAreas(parseLakhs(budgetMaxL), locationHint)
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      <form onSubmit={handleSubmit} className="space-y-5 rounded-xl border border-[var(--border)] bg-white p-6">
        <div>
          <label className="rp-label">I want to</label>
          <div className="mt-2 flex flex-wrap gap-2">
            {(["buy", "rent", "invest"] as AdvisorMode[]).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setMode(m)}
                className={`rp-chip px-4 py-2 text-sm ${mode === m ? "rp-chip-active" : ""}`}
              >
                {advisorModeLabel(m)}
              </button>
            ))}
          </div>
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
              placeholder="Optional"
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
              placeholder="e.g. 80"
            />
          </div>
        </div>

        <div>
          <label className="rp-label">Preferred area or city</label>
          <input
            type="text"
            value={locationHint}
            onChange={(e) => setLocationHint(e.target.value)}
            onBlur={handlePreviewAreas}
            className="rp-input"
            placeholder="e.g. Phase 7 Mohali, Aerocity, Zirakpur"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="rp-label">Purpose</label>
            <select
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              className="rp-input"
            >
              {PURPOSES.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>
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
        </div>

        {error && (
          <p className="text-sm text-red-600">
            {error}{" "}
            <Link href={appPath(defaultAdvisorMapPath(mode))} className="underline">
              Open map anyway
            </Link>
          </p>
        )}

        <button type="submit" disabled={busy} className="rp-btn rp-btn-primary w-full py-3">
          {busy ? "Building shortlist…" : "Show matching areas on map"}
        </button>
      </form>

      {previewAreas.length > 0 && (
        <section className="mt-8">
          <h2 className="font-serif text-xl text-[var(--brand-navy)]">Suggested buy hubs</h2>
          <ul className="mt-4 space-y-3">
            {previewAreas.map((area) => (
              <li key={area.slug} className="rounded-lg border border-[var(--border)] p-4">
                <Link
                  href={appPath(area.href)}
                  className="font-semibold text-[var(--sale-gold)] hover:underline"
                >
                  {area.label}
                </Link>
                <p className="mt-1 text-sm text-[var(--muted)]">{area.reason}</p>
              </li>
            ))}
          </ul>
        </section>
      )}

      <p className="mt-6 text-center text-xs text-[var(--muted)]">
        Powered by RentalPins AI map search — always verify listings and documents on the ground.
      </p>
    </div>
  );
}

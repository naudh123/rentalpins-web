"use client";

import { useState } from "react";
import type { LeadSource } from "@/lib/types/builder-microsite";
import {
  trackProjectLeadStarted,
  trackProjectLeadSubmitted,
} from "@/lib/ga4";

const BUDGET_OPTIONS = [
  "Under ₹50 Lakh",
  "₹50 L – ₹1 Cr",
  "₹1 – ₹2 Cr",
  "₹2 – ₹5 Cr",
  "Above ₹5 Cr",
];

const TIMELINE_OPTIONS = [
  "Ready to buy now",
  "Within 3 months",
  "3–6 months",
  "6–12 months",
  "Just exploring",
];

const PURPOSE_OPTIONS = ["Self use", "Investment", "Both"];

const HEAR_ABOUT_OPTIONS = [
  "Google search",
  "Social media",
  "Friend / referral",
  "Agent / broker",
  "RentalPins",
  "Other",
];

interface ProjectLeadAnalytics {
  projectSlug: string;
  citySlug: string;
  placement?: string;
}

interface ProjectLeadFormProps {
  builderId: string;
  projectId?: string;
  unitId?: string;
  source: LeadSource;
  projectName?: string;
  plotNumber?: string;
  compact?: boolean;
  showQualification?: boolean;
  onSuccess?: () => void;
  analytics?: ProjectLeadAnalytics;
}

export default function ProjectLeadForm({
  builderId,
  projectId,
  unitId,
  source,
  projectName,
  plotNumber,
  compact = false,
  showQualification = true,
  onSuccess,
  analytics,
}: ProjectLeadFormProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [visitDate, setVisitDate] = useState("");
  const [budgetRange, setBudgetRange] = useState("");
  const [preferredSize, setPreferredSize] = useState("");
  const [buyingTimeline, setBuyingTimeline] = useState("");
  const [purchasePurpose, setPurchasePurpose] = useState("");
  const [hearAboutUs, setHearAboutUs] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (analytics) {
      trackProjectLeadStarted({
        projectId,
        projectSlug: analytics.projectSlug,
        citySlug: analytics.citySlug,
        source,
        placement: analytics.placement,
      });
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/project-leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          builderId,
          projectId,
          unitId,
          source,
          name,
          phone,
          email,
          message: message || undefined,
          preferredVisitDate: visitDate || undefined,
          budgetRange: budgetRange || undefined,
          preferredSize: preferredSize || undefined,
          buyingTimeline: buyingTimeline || undefined,
          purchasePurpose: purchasePurpose || undefined,
          hearAboutUs: hearAboutUs || undefined,
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to submit");
      }
      if (analytics) {
        trackProjectLeadSubmitted({
          projectId,
          projectSlug: analytics.projectSlug,
          citySlug: analytics.citySlug,
          source,
          placement: analytics.placement,
        });
      }
      setDone(true);
      onSuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  if (done) {
    return (
      <div className="lux-success-panel">
        <p className="font-serif text-2xl font-bold text-[var(--lux-primary)]">Enquiry received</p>
        <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
          Our concierge team will contact you shortly to arrange your private site visit.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {!compact && (
        <p className="text-xs text-[var(--muted)]">
          Share your phone and email — we&apos;ll arrange your site visit.
        </p>
      )}
      {(projectName || plotNumber) && (
        <p className="text-sm text-[var(--muted)]">
          Enquiring about{" "}
          <span className="font-medium text-[var(--brand-navy)]">
            {plotNumber ? `Plot ${plotNumber}` : projectName}
          </span>
        </p>
      )}
      <div className={compact ? "grid gap-3 sm:grid-cols-2" : "space-y-4"}>
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
            Name *
          </label>
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="lux-input"
            placeholder="Your full name"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
            Phone *
          </label>
          <input
            required
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="lux-input"
            placeholder="9915061640"
          />
        </div>
      </div>
      <div>
        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
          Email *
        </label>
        <input
          required
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="lux-input"
          placeholder="you@email.com"
        />
      </div>

      {showQualification && !compact && (
        <>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
                Budget
              </label>
              <select
                value={budgetRange}
                onChange={(e) => setBudgetRange(e.target.value)}
                className="lux-input w-full py-2"
              >
                <option value="">Select range</option>
                {BUDGET_OPTIONS.map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
                Timeline
              </label>
              <select
                value={buyingTimeline}
                onChange={(e) => setBuyingTimeline(e.target.value)}
                className="lux-input w-full py-2"
              >
                <option value="">When buying?</option>
                {TIMELINE_OPTIONS.map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
                Preferred size / type
              </label>
              <input
                value={preferredSize}
                onChange={(e) => setPreferredSize(e.target.value)}
                className="lux-input"
                placeholder="e.g. 250 sq yd, 3 BHK"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
                Purpose
              </label>
              <select
                value={purchasePurpose}
                onChange={(e) => setPurchasePurpose(e.target.value)}
                className="lux-input w-full py-2"
              >
                <option value="">Select</option>
                {PURPOSE_OPTIONS.map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
              How did you hear about us?
            </label>
            <select
              value={hearAboutUs}
              onChange={(e) => setHearAboutUs(e.target.value)}
              className="lux-input w-full py-2"
            >
              <option value="">Select</option>
              {HEAR_ABOUT_OPTIONS.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>
          </div>
        </>
      )}

      {!compact && (
        <>
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
              Preferred visit date
            </label>
            <input
              type="date"
              value={visitDate}
              onChange={(e) => setVisitDate(e.target.value)}
              className="lux-input"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
              Message
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
              className="lux-input resize-none"
              placeholder="Tell us what you're looking for..."
            />
          </div>
        </>
      )}

      {error && <p className="text-sm text-red-600">{error}</p>}
      <button type="submit" disabled={loading} className="lux-btn-gold w-full">
        {loading ? "Submitting..." : compact ? "Unlock & continue" : "Enquire Now"}
      </button>
    </form>
  );
}

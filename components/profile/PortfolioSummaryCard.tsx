"use client";

import Link from "next/link";
import type { OwnerPortfolioSummary } from "@/lib/owner-portfolio";
import { appPath } from "@/lib/config";

interface Props {
  summary: OwnerPortfolioSummary;
}

export default function PortfolioSummaryCard({ summary }: Props) {
  if (summary.total === 0) return null;

  return (
    <div className="mt-4 grid gap-3 rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] p-4 sm:grid-cols-2">
      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-[var(--muted)]">
          Portfolio
        </p>
        <p className="mt-1 font-serif text-2xl text-[var(--brand-navy)]">
          {summary.total} {summary.total === 1 ? "property" : "properties"}
        </p>
        <p className="mt-0.5 text-xs text-[var(--muted)]">
          {summary.live} live · {summary.drafts} draft
          {summary.saved > 0 ? ` · ${summary.saved} saved` : ""}
        </p>
      </div>
      <div className="flex flex-col justify-center gap-1 text-sm">
        <p className="text-[var(--text)]">
          <span className="font-semibold text-[var(--brand-navy)]">{summary.totalViews}</span>{" "}
          views ·{" "}
          <span className="font-semibold text-[var(--brand-navy)]">{summary.totalInquiries}</span>{" "}
          inquiries
        </p>
        {summary.expiringSoon > 0 && (
          <p className="text-xs font-medium text-amber-700">
            {summary.expiringSoon} listing{summary.expiringSoon > 1 ? "s" : ""} expiring within 3
            days —{" "}
            <Link href={appPath("/profile")} className="underline">
              renew now
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}

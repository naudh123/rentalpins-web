import type { Metadata } from "next";
import Link from "next/link";
import InvestPageHero from "@/components/invest/InvestPageHero";
import { appPath } from "@/lib/config";
import { getLatestInvestPulse, INVEST_PULSE_REPORTS } from "@/lib/invest/invest-pulse";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { INVEST_PULSE_PATH } from "@/lib/invest/invest-paths";

export const metadata: Metadata = buildPageMetadata({
  title: "Invest Pulse | RentalPins Invest",
  description:
    "Quarterly Tricity property investment briefing — corridors, project entry checklists, and underwriting workflow on RentalPins.",
  path: INVEST_PULSE_PATH,
});

export default function InvestPulsePage() {
  const report = getLatestInvestPulse();

  return (
    <>
      <InvestPageHero
        title="Invest Pulse"
        subtitle="Tricity investor briefing — narrative context only, no fabricated market statistics. Update your underwriting with live map pins."
      />
      <div className="mx-auto max-w-3xl px-4 pb-16">
        <article className="invest-theme mt-8">
          <header className="border-b border-[var(--border)] pb-6">
            <p className="text-sm font-semibold text-[var(--invest-emerald)]">{report.quarter}</p>
            <h2 className="mt-2 font-serif text-2xl text-[var(--brand-navy)]">{report.title}</h2>
            <p className="mt-4 text-sm leading-relaxed text-[var(--muted)]">{report.summary}</p>
          </header>

          {report.sections.map((section) => (
            <section key={section.heading} className="mt-8">
              <h3 className="font-serif text-xl text-[var(--brand-navy)]">{section.heading}</h3>
              <p className="mt-3 text-sm leading-relaxed text-[var(--muted)]">{section.body}</p>
              {section.links && section.links.length > 0 && (
                <ul className="mt-4 flex flex-wrap gap-3">
                  {section.links.map((l) => (
                    <li key={l.href}>
                      <Link
                        href={appPath(l.href)}
                        className="text-sm font-semibold text-[var(--invest-emerald)] hover:underline"
                      >
                        {l.label} →
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          ))}

          {INVEST_PULSE_REPORTS.length > 1 && (
            <p className="mt-12 text-xs text-[var(--muted)]">
              Archive: {INVEST_PULSE_REPORTS.length} reports published.
            </p>
          )}
        </article>
      </div>
    </>
  );
}

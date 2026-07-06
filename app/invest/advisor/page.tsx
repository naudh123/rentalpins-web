import type { Metadata } from "next";
import Link from "next/link";
import PropertyAgentChat from "@/components/agent/PropertyAgentChat";
import InvestPageHero from "@/components/invest/InvestPageHero";
import { appPath } from "@/lib/config";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { INVEST_ADVISOR_PATH } from "@/lib/invest/invest-paths";

export const metadata: Metadata = buildPageMetadata({
  title: "AI investment advisor | RentalPins Invest",
  description:
    "Ask RentalPins AI about Tricity investment playbooks, yield corridors, planning/zoning, and transaction due diligence — with live map and project tools.",
  path: INVEST_ADVISOR_PATH,
});

const SUGGESTED_PROMPTS = [
  "Best rental yield under 80 lakh in Tricity?",
  "Compare Mohali vs Zirakpur for investor yield",
  "Is New Chandigarh good for 10 year plot hold?",
  "Kharar PG investment — what to check in society?",
  "Sale deed due diligence checklist for buyer",
];

export default function InvestAdvisorPage() {
  return (
    <>
      <InvestPageHero
        title="Ask AI — investment mode"
        subtitle="Trained on Tricity investment playbooks, planning/zoning, and transaction guides. The agent will not invent ROI — it shows how to underwrite with live maps."
      />
      <div className="mx-auto max-w-3xl px-4 pb-16">
        <section className="invest-theme mt-8 rounded-2xl border border-[var(--border)] bg-white p-4 shadow-[var(--shadow-card)] md:p-6">
          <PropertyAgentChat surface="advisor" transactionType="sale" />
        </section>

        <section className="mt-8">
          <h2 className="font-serif text-lg text-[var(--brand-navy)]">Suggested prompts</h2>
          <ul className="mt-3 flex flex-wrap gap-2">
            {SUGGESTED_PROMPTS.map((p) => (
              <li key={p}>
                <span className="rounded-full border border-[var(--border)] bg-white px-3 py-1.5 text-xs text-[var(--muted)]">
                  {p}
                </span>
              </li>
            ))}
          </ul>
        </section>

        <div className="mt-10 flex flex-wrap justify-center gap-4 text-sm">
          <Link href={appPath("/invest/calculator")} className="font-semibold text-[var(--invest-emerald)] hover:underline">
            Yield calculator
          </Link>
          <Link href={appPath("/invest/compare")} className="font-semibold text-[var(--invest-emerald)] hover:underline">
            Compare areas
          </Link>
          <Link href={appPath("/buy/search")} className="font-semibold text-[var(--muted)] hover:underline">
            Buy map
          </Link>
          <Link href={appPath("/search")} className="font-semibold text-[var(--muted)] hover:underline">
            Rent comps
          </Link>
        </div>
      </div>
    </>
  );
}

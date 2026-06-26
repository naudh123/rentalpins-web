import type { Metadata } from "next";
import Link from "next/link";
import PropertyAdvisorPanel from "@/components/advisor/PropertyAdvisorPanel";
import PropertyAgentChat from "@/components/agent/PropertyAgentChat";
import { appPath } from "@/lib/config";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "AI property advisor | RentalPins Buy",
  description:
    "Chat with the RentalPins property agent or use the quick form — budget, purpose, and timeline in, map areas and listings out.",
  path: "/advisor",
  robots: { index: true, follow: true },
});

export default function AdvisorPage() {
  return (
    <div className="sale-theme">
      <section className="rp-gradient-hero">
        <div className="mx-auto max-w-3xl px-4 py-14 text-center">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--sale-gold)]">
            RentalPins AI
          </p>
          <h1 className="mt-3 font-serif text-3xl text-[var(--brand-navy)] md:text-4xl">
            AI property advisor
          </h1>
          <p className="mt-4 text-[var(--muted)]">
            Multi-turn agent with live tools — area guides, projects, map search, and sample listings
            across Chandigarh Tricity. Or use the quick form below.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-3xl px-4 py-10">
        <section className="rounded-2xl border border-[var(--border)] bg-white p-4 shadow-[var(--shadow-card)] md:p-6">
          <h2 className="font-serif text-xl text-[var(--brand-navy)]">Chat with the agent</h2>
          <p className="mt-1 text-sm text-[var(--muted)]">
            Trained on RentalPins area guides, buy projects, and blog playbooks.
          </p>
          <div className="mt-4">
            <PropertyAgentChat surface="advisor" transactionType="sale" />
          </div>
        </section>

        <section className="mt-10">
          <h2 className="text-center font-serif text-xl text-[var(--brand-navy)]">
            Quick advisor form
          </h2>
          <p className="mt-1 text-center text-sm text-[var(--muted)]">
            One-shot — jumps straight to the map with filters applied.
          </p>
          <div className="mt-6">
            <PropertyAdvisorPanel />
          </div>
        </section>

        <div className="mt-10 flex flex-wrap justify-center gap-4 text-sm">
          <Link href={appPath("/buy/search")} className="font-semibold text-[var(--sale-gold)] hover:underline">
            Open buy map
          </Link>
          <Link href={appPath("/search")} className="font-semibold text-[var(--brand-orange)] hover:underline">
            Open rent map
          </Link>
          <Link href={appPath("/buy/requirements/post")} className="font-semibold text-[var(--muted)] hover:underline">
            Post buy requirement
          </Link>
          <Link href={appPath("/developers")} className="font-semibold text-[var(--muted)] hover:underline">
            PropTech showcase
          </Link>
        </div>
      </div>
    </div>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import PropertyAdvisorPanel from "@/components/advisor/PropertyAdvisorPanel";
import { appPath } from "@/lib/config";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "AI property advisor | RentalPins Buy",
  description:
    "Tell RentalPins your budget, purpose, and timeline — get a map shortlist for rent, buy, or investment in Chandigarh Tricity.",
  path: "/advisor",
  robots: { index: true, follow: true },
});

export default function AdvisorPage() {
  return (
    <div className="sale-theme">
      <section className="rp-gradient-hero">
        <div className="mx-auto max-w-2xl px-4 py-14 text-center">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--sale-gold)]">
            RentalPins AI
          </p>
          <h1 className="mt-3 font-serif text-3xl text-[var(--brand-navy)] md:text-4xl">
            AI property advisor
          </h1>
          <p className="mt-4 text-[var(--muted)]">
            Budget, purpose, and timeline in — map areas and listings out. Works for buy, rent, and
            investment goals across Tricity.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-2xl px-4 py-10">
        <PropertyAdvisorPanel />
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
        </div>
      </div>
    </div>
  );
}

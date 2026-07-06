import type { Metadata } from "next";
import Link from "next/link";
import InvestShortlistClient from "@/components/invest/InvestShortlistClient";
import InvestPageHero from "@/components/invest/InvestPageHero";
import { appPath } from "@/lib/config";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { INVEST_SHORTLIST_PATH } from "@/lib/invest/invest-paths";

export const metadata: Metadata = buildPageMetadata({
  title: "Invest shortlist | RentalPins Invest",
  description:
    "Save and annotate property listings for investment underwriting — notes, target yield, and corridor tags on RentalPins Invest.",
  path: INVEST_SHORTLIST_PATH,
  robots: { index: false, follow: true },
});

export default function InvestShortlistPage() {
  return (
    <>
      <InvestPageHero
        title="Your invest shortlist"
        subtitle="Track listings you're underwriting with notes and target yield. Save hearts on the buy map, then add invest context here."
      />
      <div className="mx-auto max-w-3xl px-4 pb-16">
        <InvestShortlistClient />
        <p className="mt-8 text-center text-sm text-[var(--muted)]">
          <Link href={appPath("/saved-listings")} className="font-semibold text-[var(--invest-emerald)] hover:underline">
            View all saved listings
          </Link>
        </p>
      </div>
    </>
  );
}

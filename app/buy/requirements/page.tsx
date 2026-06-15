import type { Metadata } from "next";
import Link from "next/link";
import { appPath, siteUrl } from "@/lib/config";
import { BUY_REQUIREMENTS_PATH, BUY_SEARCH_PATH } from "@/lib/sale/buy-app-paths";

export const metadata: Metadata = {
  title: "Post buy requirement | RentalPins Buy",
  description:
    "Tell us what you want to buy — budget, location, and property type. RentalPins Buy requirement board (coming soon).",
  alternates: { canonical: `${siteUrl}${appPath(BUY_REQUIREMENTS_PATH)}` },
  robots: { index: false, follow: true },
};

/**
 * Placeholder for the buyer requirement / demand module.
 * TODO: Replace with authenticated requirement posting + public demand board.
 */
export default function BuyRequirementsPage() {
  return (
    <section className="rp-gradient-hero">
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-20">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--sale-gold)]">
          RentalPins Buy
        </p>
        <h1 className="mt-3 font-serif text-3xl text-[var(--brand-navy)] md:text-4xl">
          Post your buy requirement
        </h1>
        <p className="mt-4 text-[var(--muted)]">
          Share budget, location, and property type so owners and developers can match your
          requirement. The full requirement board is launching soon — browse live sale listings on
          the buy map today.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href={appPath(BUY_SEARCH_PATH)} className="rp-btn rp-btn-primary px-6 py-3">
            Browse for sale
          </Link>
          <Link
            href={appPath("/buy")}
            className="rp-btn rp-btn-secondary px-6 py-3 text-sm"
          >
            Back to Buy hub
          </Link>
        </div>
      </div>
    </section>
  );
}

import Link from "next/link";
import type { BlogBuyHub } from "@/lib/blog-buy-hubs";
import { appPath } from "@/lib/config";
import { BUY_SEARCH_PATH } from "@/lib/sale/buy-app-paths";

export default function BlogBuyHubLink({ hub }: { hub: BlogBuyHub }) {
  return (
    <aside
      aria-label={`Explore sale listings in ${hub.placeName}`}
      className="mt-8 rounded-2xl border border-[color-mix(in_srgb,var(--sale-gold)_35%,white)] bg-[color-mix(in_srgb,var(--sale-gold)_10%,white)] p-5 sm:p-6"
    >
      <p className="text-xs font-semibold uppercase tracking-wide text-[var(--sale-gold)]">
        RentalPins Buy
      </p>
      <p className="mt-2 font-serif text-lg font-bold text-[var(--brand-navy)]">
        Explore properties for sale in {hub.placeName}
      </p>
      <p className="mt-2 text-sm leading-relaxed text-slate-600">
        Browse owner-direct sale listings on the buy map — compare localities,
        filter by budget, and contact sellers without brokerage search fees.
      </p>
      <div className="mt-4 flex flex-wrap gap-4">
        <Link
          href={appPath(hub.hubHref)}
          className="inline-flex items-center text-sm font-semibold text-[var(--brand-navy)] hover:underline"
        >
          {hub.placeName} buy hub →
        </Link>
        <Link
          href={appPath(BUY_SEARCH_PATH)}
          className="inline-flex items-center text-sm font-semibold text-[var(--sale-gold)] hover:underline"
        >
          Open sale map →
        </Link>
      </div>
    </aside>
  );
}

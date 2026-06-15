import type { Metadata } from "next";
import Link from "next/link";
import { appPath, siteUrl } from "@/lib/config";
import { BUY_POST_PATH, BUY_SEARCH_PATH } from "@/lib/sale/buy-app-paths";
import { BUY_HUBS } from "@/lib/sale/buy-pages-config";

export const metadata: Metadata = {
  title: "RentalPins Buy — Luxury property for sale in India",
  description:
    "Owner-direct property for sale on a curated map. Flats, villas, and land in Chandigarh Tricity — private listings without brokerage search fees.",
  alternates: { canonical: `${siteUrl}${appPath("/buy")}` },
  openGraph: {
    title: "RentalPins Buy — Property for sale",
    description:
      "Map-first property sale discovery. Owner-direct flats, villas, and land in Mohali, Kharar, Zirakpur, and Panchkula.",
    url: `${siteUrl}${appPath("/buy")}`,
    siteName: "RentalPins",
    type: "website",
  },
};

export default function BuyIndexPage() {
  return (
    <section className="rp-gradient-hero">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--sale-gold)]">
          RentalPins Buy
        </p>
        <h1 className="mt-3 max-w-3xl font-serif text-4xl text-[var(--brand-navy)] md:text-5xl">
          India&apos;s map-first property sale experience
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-[var(--muted)]">
          Curated owner-direct listings. Champagne clarity for buyers and sellers — starting in
          Chandigarh Tricity.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href={appPath(BUY_SEARCH_PATH)}
            className="rp-btn rp-btn-primary px-6 py-3"
          >
            Explore sale map
          </Link>
          <Link href={appPath(BUY_POST_PATH)} className="rp-btn rp-btn-secondary px-6 py-3">
            List for sale
          </Link>
          <Link href={appPath("/flats-for-sale")} className="rp-btn rp-btn-secondary px-6 py-3">
            Flats for sale
          </Link>
        </div>

        <div className="mt-14">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--muted)]">
            Launch cities
          </h2>
          <ul className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Object.values(BUY_HUBS).map((hub) => (
              <li key={hub.slug}>
                <Link
                  href={appPath(`/buy/${hub.slug}`)}
                  className="rp-card-interactive block p-5 no-underline"
                >
                  <span className="font-serif text-xl text-[var(--brand-navy)]">
                    {hub.cityName}
                  </span>
                  <p className="mt-2 text-sm text-[var(--muted)]">{hub.subhead.slice(0, 100)}…</p>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

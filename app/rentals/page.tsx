import type { Metadata } from "next";
import Link from "next/link";
import { getAllCities } from "@/lib/cities-config";
import MarketingShell from "@/components/MarketingShell";
import { appPath } from "@/lib/config";
import { canonicalUrl } from "@/lib/seo";
import MohaliGscHubLinks from "@/components/seo/MohaliGscHubLinks";

export const metadata: Metadata = {
  title: "Rentals by City",
  description:
    "Explore RentalPins city hubs — rooms, PG, flats, vehicles, electronics, furniture and equipment — in Chandigarh Tricity, Ludhiana, Delhi, Jaipur, Lucknow, Mumbai, London, Nairobi, Lagos and more.",
  keywords: [
    "browse rentals by city",
    "RentalPins cities",
    "rentals India map",
  ],
  alternates: {
    canonical: canonicalUrl("/rentals"),
  },
  openGraph: {
    title: "Rentals by City | RentalPins",
    description:
      "Jump to city rental hubs and area pages with live map listings.",
    url: canonicalUrl("/rentals"),
    type: "website",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Rentals by City | RentalPins",
    description: "Browse RentalPins city hubs and discover rentals near you.",
    images: ["/og-image.png"],
  },
  robots: { index: true, follow: true },
};

export default function RentalsIndexPage() {
  const cities = getAllCities();

  return (
    <MarketingShell>
      <div className="relative mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
        <div
          className="pointer-events-none absolute inset-x-0 -top-20 h-56 rounded-full bg-gradient-to-br from-[#1E3A6E]/[0.08] via-transparent to-[#E8501A]/[0.05] blur-3xl"
          aria-hidden
        />
        <h1 className="font-serif text-3xl font-bold tracking-tight text-[#1E3A6E] sm:text-4xl">
          Browse rentals by city
        </h1>
        <p className="mt-3 max-w-2xl text-lg text-slate-600">
          Pick a city hub, then explore neighbourhoods and live listings on the map.
        </p>

        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {cities.map((city) => (
            <Link
              key={city.slug}
              href={appPath(`/rentals/${city.countrySlug}/${city.slug}`)}
              className="group block rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-[#E8501A]/40 hover:shadow-md"
            >
              <h2 className="text-lg font-semibold text-slate-900 group-hover:text-[#1E3A6E]">
                {city.name}
              </h2>
              <p className="mt-1.5 text-sm leading-relaxed text-slate-600">
                {city.tagline}
              </p>
              <span className="mt-4 inline-flex items-center text-sm font-semibold text-[#E8501A]">
                Explore areas →
              </span>
            </Link>
          ))}
        </div>

        <MohaliGscHubLinks
          title="Popular Mohali rental pages"
          className="mt-12 border-t border-slate-200 pt-10"
        />
      </div>
    </MarketingShell>
  );
}

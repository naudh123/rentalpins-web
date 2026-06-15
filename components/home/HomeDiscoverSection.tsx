import Link from "next/link";
import type { CityConfig } from "@/lib/cities-config";
import { rentalCityPath } from "@/lib/cities-config";
import { appPath } from "@/lib/config";
import { MAIN_CATEGORIES } from "@/lib/categories";
import { RENTAL_CATEGORIES } from "@/lib/seo/categories";
import { HOME_BUY_SECTION, HOME_RENTER_SECTION, HOME_SEO_LINKS } from "@/lib/seo/home-page-content";

const CATEGORY_ICONS: Record<string, string> = {
  Property: "🏠",
  Vehicles: "🚗",
  "Electronics & Gadgets": "💻",
  "Home Appliances": "🍳",
  Furniture: "🛋️",
  "Heavy Machinery": "🏗️",
  "Construction Equipment": "🔧",
  "Event & Production": "🎬",
  Others: "📦",
};

interface Props {
  cities: CityConfig[];
  topCities: CityConfig[];
}

export default function HomeDiscoverSection({ cities, topCities }: Props) {
  return (
    <>
      <section
        aria-labelledby="home-renter-heading"
        className="border-t border-[var(--border-subtle)] px-4 py-16"
      >
        <div className="mx-auto max-w-5xl">
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--brand-orange)]">
              For renters & buyers
            </p>
            <h2
              id="home-renter-heading"
              className="mt-3 font-serif text-2xl text-[var(--brand-navy)] md:text-3xl"
            >
              {HOME_RENTER_SECTION.title}
            </h2>
            <p className="mt-2 text-sm text-[var(--muted)]">{HOME_RENTER_SECTION.subtitle}</p>
          </div>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {HOME_RENTER_SECTION.steps.map((item) => (
              <div key={item.step} className="rp-home-lux-card rounded-2xl p-6 text-center">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[var(--border)] bg-white font-serif text-sm font-bold text-[var(--brand-navy)]">
                  {item.step}
                </span>
                <h3 className="mt-4 font-semibold text-[var(--brand-navy)]">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        aria-labelledby="home-buy-links-heading"
        className="border-t border-[var(--border-subtle)] bg-[color-mix(in_srgb,var(--sale-gold)_5%,var(--bg))] px-4 py-12"
      >
        <div className="mx-auto max-w-5xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--sale-gold)]">
            RentalPins Buy
          </p>
          <h2 id="home-buy-links-heading" className="mt-3 font-serif text-2xl text-[var(--brand-navy)] md:text-3xl">
            {HOME_BUY_SECTION.title}
          </h2>
          <p className="mt-2 text-sm text-[var(--muted)]">{HOME_BUY_SECTION.subtitle}</p>
          <ul className="mt-6 flex flex-wrap justify-center gap-2">
            {HOME_BUY_SECTION.links.map((link) => (
              <li key={link.href}>
                <Link
                  href={appPath(link.href)}
                  className="rounded-full border border-[color-mix(in_srgb,var(--sale-gold)_35%,var(--border))] bg-white px-4 py-2 text-sm font-medium text-[var(--brand-navy)] no-underline hover:border-[var(--sale-gold)]"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="border-t border-[var(--border-subtle)] bg-[var(--bg-elevated)]/40 px-4 py-14">
        <div className="mx-auto max-w-5xl">
          <h2 className="rp-section-title text-center text-xl">Property rentals by type</h2>
          <p className="mt-2 text-center text-sm text-[var(--muted)]">
            Owner listings on the map — no broker search fee
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            {RENTAL_CATEGORIES.filter((c) => c.mainCategory === "Property").map((cat) => (
              <Link
                key={cat.slug}
                href={appPath(`/rentals/in/chandigarh/mohali/${cat.slug}`)}
                className="rounded-full border border-[var(--border)] bg-white px-3 py-1.5 text-xs font-semibold text-[var(--brand-navy)] no-underline hover:border-[var(--brand-orange)]"
              >
                {cat.pluralLabel}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-14">
        <h2 className="rp-section-title text-center text-xl">Top cities</h2>
        <div className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-4">
          {topCities.map((city) => (
            <Link
              key={`${city.countrySlug}-${city.slug}`}
              href={appPath(rentalCityPath(city.countrySlug, city.slug))}
              className="rp-card-interactive rounded-2xl p-3 text-center text-sm font-semibold text-[var(--brand-navy)] no-underline"
            >
              {city.name}
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-14">
        <h2 className="rp-section-title text-center text-xl">Nine rental categories</h2>
        <p className="mt-2 text-center text-sm text-[var(--muted)]">
          Property, vehicles, electronics, furniture and more on one map
        </p>
        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {MAIN_CATEGORIES.map((cat) => (
            <Link
              key={cat}
              href={appPath(`/search?category=${encodeURIComponent(cat)}`)}
              className="rp-card-interactive flex flex-col items-center rounded-2xl p-4 text-center no-underline"
            >
              <span className="text-2xl" aria-hidden>
                {CATEGORY_ICONS[cat] ?? "📦"}
              </span>
              <span className="mt-2 text-sm font-semibold text-[var(--brand-navy)]">{cat}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="border-t border-[var(--border-subtle)] px-4 py-14">
        <div className="mx-auto max-w-5xl">
          <h2 className="rp-section-title text-center text-xl">Browse by city</h2>
          <p className="mt-2 text-center text-sm text-[var(--muted)]">
            Area guides with map search and owner listing CTAs
          </p>
          <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {cities.map((city) => {
              const isLive = city.status === "live";
              return (
                <Link
                  key={`${city.countrySlug}-${city.slug}`}
                  href={appPath(rentalCityPath(city.countrySlug, city.slug))}
                  className="rp-card-interactive group rounded-2xl p-4 no-underline"
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-semibold text-[var(--brand-navy)] group-hover:text-[var(--brand-orange)]">
                      {city.name}
                    </p>
                    <span
                      className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${
                        isLive
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {isLive ? "Live" : "Coming soon"}
                    </span>
                  </div>
                  <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-[var(--muted)]">
                    {city.tagline}
                  </p>
                  <span className="mt-3 inline-block text-xs font-semibold text-[var(--brand-orange)]">
                    View areas →
                  </span>
                </Link>
              );
            })}
          </div>
          <p className="mt-8 text-center">
            <Link
              href={appPath("/rentals")}
              className="text-sm font-semibold text-[var(--brand-orange)] hover:underline"
            >
              All cities →
            </Link>
          </p>
        </div>
      </section>

      <section className="border-t border-[var(--border-subtle)] bg-[var(--bg-elevated)]/50 px-4 py-12">
        <div className="mx-auto max-w-4xl">
          <h2 className="rp-section-title text-center text-lg">{HOME_SEO_LINKS.title}</h2>
          <ul className="mt-5 flex flex-wrap justify-center gap-2">
            {HOME_SEO_LINKS.links.map((link) => (
              <li key={link.href}>
                <Link
                  href={appPath(link.href)}
                  className="rounded-full border border-[var(--border)] bg-white px-4 py-2 text-sm font-medium text-[var(--brand-navy)] no-underline hover:border-[var(--brand-orange)]"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}

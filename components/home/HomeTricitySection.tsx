import Link from "next/link";
import { appPath } from "@/lib/config";
import { HOME_TRICITY_SECTION } from "@/lib/seo/home-page-content";

export default function HomeTricitySection() {
  return (
    <section className="rp-home-section border-t border-[var(--border-subtle)] bg-[var(--bg-elevated)]">
      <div className="rp-home-section-inner">
        <h2 className="rp-section-title text-center font-serif text-2xl text-[var(--brand-navy)] md:text-3xl">
          {HOME_TRICITY_SECTION.title}
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-center text-sm leading-relaxed text-[var(--muted)] md:text-base">
          {HOME_TRICITY_SECTION.subtitle}
        </p>

        <ul className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {HOME_TRICITY_SECTION.cities.map((city) => (
            <li key={city.name}>
              <article className="rp-home-area-card h-full">
                <h3 className="font-serif text-lg text-[var(--brand-navy)]">{city.name}</h3>
                <ul className="mt-3 space-y-2 text-sm">
                  <li>
                    <Link
                      href={appPath(city.rentalHref)}
                      className="font-medium text-[var(--brand-navy)] hover:text-[var(--brand-orange)]"
                    >
                      Rentals
                    </Link>
                  </li>
                  <li>
                    <Link
                      href={appPath(city.saleHref)}
                      className="font-medium text-[var(--brand-navy)] hover:text-[var(--sale-gold)]"
                    >
                      Properties for sale
                    </Link>
                  </li>
                  <li>
                    <Link
                      href={appPath(city.investHref)}
                      className="text-[var(--muted)] hover:text-[var(--invest-emerald)]"
                    >
                      {city.investLabel}
                    </Link>
                  </li>
                </ul>
              </article>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

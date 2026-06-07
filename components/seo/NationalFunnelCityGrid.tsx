import Link from "next/link";
import {
  getNationalFunnelCities,
  nationalFunnelSectionIntro,
  nationalFunnelSectionTitle,
  type NationalFunnelKind,
} from "@/lib/seo/national-funnel-cities";
import { blogPostHref } from "@/lib/seo/national-funnel-guides";

export default function NationalFunnelCityGrid({ kind }: { kind: NationalFunnelKind }) {
  const cities = getNationalFunnelCities(kind);

  return (
    <section
      aria-labelledby="national-funnel-cities-heading"
      className="border-y border-[var(--border-subtle)] bg-[var(--surface)] px-4 py-12"
    >
      <div className="mx-auto max-w-5xl">
        <h2
          id="national-funnel-cities-heading"
          className="rp-section-title text-2xl text-[var(--brand-navy)]"
        >
          {nationalFunnelSectionTitle(kind)}
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[var(--muted)]">
          {nationalFunnelSectionIntro(kind)}
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {cities.map((city) => (
            <article
              key={`${city.name}-${city.primaryHref}`}
              className="rp-card flex flex-col p-5 transition hover:border-[var(--brand-orange)]/30"
            >
              <h3 className="font-serif text-lg font-bold text-[var(--brand-navy)]">
                {city.name}
              </h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-[var(--muted)]">
                {city.description}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <Link
                  href={city.primaryHref}
                  className="rp-btn rp-btn-primary px-4 py-2 text-xs sm:text-sm"
                >
                  {city.primaryLabel}
                </Link>
                <Link
                  href={city.hubHref}
                  className="rp-btn rp-btn-secondary px-4 py-2 text-xs sm:text-sm"
                >
                  City hub
                </Link>
                {city.seoGuideHref ? (
                  <Link
                    href={city.seoGuideHref}
                    className="rp-btn rp-btn-secondary px-4 py-2 text-xs sm:text-sm"
                  >
                    Rental guide
                  </Link>
                ) : null}
                {city.topBlogSlug ? (
                  <Link
                    href={blogPostHref(city.topBlogSlug)}
                    className="inline-flex items-center px-2 py-2 text-xs font-medium text-[var(--brand-orange)] hover:underline sm:text-sm"
                  >
                    Blog tips
                  </Link>
                ) : null}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

import Link from "next/link";
import type { MarketInsightsData } from "@/lib/seo/locality-insights";

interface Props {
  insights: MarketInsightsData;
  className?: string;
}

/** Market insights block for locality and city hub pages. */
export default function MarketInsightsBlock({ insights, className = "" }: Props) {
  return (
    <section
      className={`rounded-xl border border-[var(--border)] bg-white p-6 ${className}`}
      aria-labelledby="market-insights-heading"
    >
      <h2 id="market-insights-heading" className="font-serif text-2xl text-[var(--brand-navy)]">
        {insights.heading}
      </h2>
      <p className="mt-3 leading-relaxed text-[var(--muted)]">{insights.intro}</p>

      {insights.hasRealData && (
        <dl className="mt-5 grid gap-4 sm:grid-cols-2">
          {insights.priceRange && (
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">
                Price range
              </dt>
              <dd className="mt-1 font-medium text-[var(--brand-navy)]">{insights.priceRange}</dd>
            </div>
          )}
          {insights.commonTypes.length > 0 && (
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">
                Common property types
              </dt>
              <dd className="mt-1 text-[var(--brand-navy)]">{insights.commonTypes.join(", ")}</dd>
            </div>
          )}
          {insights.popularCategories.length > 0 && (
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">
                Popular categories
              </dt>
              <dd className="mt-1 text-[var(--brand-navy)]">
                {insights.popularCategories.join(", ")}
              </dd>
            </div>
          )}
        </dl>
      )}

      <p className="mt-4 text-sm leading-relaxed text-[var(--muted)]">{insights.demandNote}</p>

      {insights.nearbyAreas.length > 0 && (
        <div className="mt-5">
          <h3 className="text-sm font-semibold text-[var(--brand-navy)]">Nearby areas</h3>
          <ul className="mt-2 flex flex-wrap gap-2">
            {insights.nearbyAreas.map((area) => (
              <li key={area}>
                <span className="rounded-full border border-[var(--border)] px-3 py-1 text-xs text-[var(--muted)]">
                  {area}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}

/** Popular search chips linking to map and category pages. */
export function PopularSearchesBlock({
  searches,
  className = "",
}: {
  searches: { label: string; href: string }[];
  className?: string;
}) {
  if (!searches.length) return null;

  return (
    <section className={className} aria-labelledby="popular-searches-heading">
      <h2 id="popular-searches-heading" className="font-serif text-xl text-[var(--brand-navy)]">
        Popular searches
      </h2>
      <ul className="mt-3 flex flex-wrap gap-2">
        {searches.map((s) => (
          <li key={s.href}>
            <Link
              href={s.href}
              className="rounded-full border border-[var(--border)] bg-[var(--bg)] px-3 py-1.5 text-sm text-[var(--brand-navy)] hover:border-[var(--brand-orange)]"
            >
              {s.label}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

/** Crawlable FAQ block for hub pages. */
export function HubFaqSection({
  faqs,
  className = "",
}: {
  faqs: { question: string; answer: string }[];
  className?: string;
}) {
  if (!faqs.length) return null;

  return (
    <section className={className} aria-labelledby="hub-faq-heading">
      <h2 id="hub-faq-heading" className="font-serif text-xl text-[var(--brand-navy)]">
        Frequently asked questions
      </h2>
      <dl className="mt-4 space-y-4">
        {faqs.map((faq) => (
          <div key={faq.question}>
            <dt className="font-semibold text-[var(--brand-navy)]">{faq.question}</dt>
            <dd className="mt-1 text-sm leading-relaxed text-[var(--muted)]">{faq.answer}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

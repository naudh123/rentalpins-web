import Link from "next/link";
import type { CityBuySEOConfig } from "@/lib/seo/city-buy-seo-config";
import { appPath } from "@/lib/config";
import { BUY_POST_PATH, BUY_SEARCH_PATH } from "@/lib/sale/buy-app-paths";

export default function CityBuySeoContent({ config }: { config: CityBuySEOConfig }) {
  return (
    <section
      aria-labelledby="city-buy-seo-heading"
      className="mx-auto max-w-5xl px-4 py-12 sm:px-6"
    >
      <div className="rounded-2xl border border-[color-mix(in_srgb,var(--sale-gold)_20%,var(--border))] bg-[var(--surface)] p-6 shadow-sm sm:p-10">
        <p className="text-xs font-bold uppercase tracking-[0.15em] text-[var(--sale-gold)]">
          RentalPins Buy · {config.placeName}
        </p>
        <h2
          id="city-buy-seo-heading"
          className="mt-2 font-serif text-2xl font-bold text-[var(--brand-navy)] sm:text-3xl"
        >
          Buy property in {config.placeName} — areas, prices & tips
        </h2>

        <div className="mt-6 space-y-4 text-base leading-relaxed text-[var(--muted)]">
          {config.intro.map((paragraph) => (
            <p key={paragraph.slice(0, 48)}>{paragraph}</p>
          ))}
        </div>

        {config.bestAreas.length > 0 && (
          <div className="mt-10">
            <h3 className="font-serif text-xl font-bold text-[var(--brand-navy)]">
              Best areas to buy in {config.placeName}
            </h3>
            <ul className="mt-4 space-y-4">
              {config.bestAreas.map((area) => (
                <li key={area.name} className="rp-card p-4">
                  {area.href ? (
                    <Link
                      href={area.href}
                      className="font-semibold text-[var(--brand-navy)] hover:text-[var(--sale-gold)] hover:underline"
                    >
                      {area.name}
                    </Link>
                  ) : (
                    <span className="font-semibold text-[var(--brand-navy)]">{area.name}</span>
                  )}
                  <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
                    {area.description}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        )}

        {config.averagePrice.length > 0 && (
          <div className="mt-10">
            <h3 className="font-serif text-xl font-bold text-[var(--brand-navy)]">
              Indicative prices in {config.placeName}
            </h3>
            <p className="mt-2 text-sm text-[var(--muted)]">
              Market ranges for planning — compare live owner asking prices on the sale map.
            </p>
            <div className="mt-4 overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-[var(--border-subtle)] text-[var(--muted)]">
                    <th className="py-2 pr-4 font-semibold">Type</th>
                    <th className="py-2 pr-4 font-semibold">Typical range</th>
                  </tr>
                </thead>
                <tbody>
                  {config.averagePrice.map((row) => (
                    <tr key={row.label} className="border-b border-[var(--border-subtle)]">
                      <td className="py-3 pr-4 font-medium text-[var(--brand-navy)]">
                        {row.label}
                      </td>
                      <td className="py-3 pr-4 text-[var(--muted)]">
                        {row.range}
                        {row.note ? (
                          <span className="mt-1 block text-xs">{row.note}</span>
                        ) : null}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {config.sections?.map((section) => (
          <div key={section.title} className="mt-10">
            <h3 className="font-serif text-xl font-bold text-[var(--brand-navy)]">
              {section.title}
            </h3>
            <div className="mt-4 space-y-3 text-sm leading-relaxed text-[var(--muted)]">
              {section.paragraphs.map((p) => (
                <p key={p.slice(0, 40)}>{p}</p>
              ))}
            </div>
          </div>
        ))}

        {config.faq.length > 0 && (
          <div className="mt-10">
            <h3 className="font-serif text-xl font-bold text-[var(--brand-navy)]">Buyer FAQs</h3>
            <dl className="mt-4 space-y-4">
              {config.faq.map((item) => (
                <div key={item.q} className="rp-card p-4">
                  <dt className="font-semibold text-[var(--brand-navy)]">{item.q}</dt>
                  <dd className="mt-2 text-sm text-[var(--muted)]">{item.a}</dd>
                </div>
              ))}
            </dl>
          </div>
        )}

        <div className="mt-10 flex flex-wrap gap-3">
          <Link href={appPath(BUY_SEARCH_PATH)} className="rp-btn rp-btn-primary px-6 py-2.5">
            Open sale map
          </Link>
          <Link href={appPath(BUY_POST_PATH)} className="rp-btn rp-btn-secondary px-6 py-2.5">
            List for sale
          </Link>
        </div>
      </div>
    </section>
  );
}

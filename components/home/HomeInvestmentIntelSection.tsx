import Link from "next/link";
import { appPath } from "@/lib/config";
import { HOME_INVESTMENT_INTEL } from "@/lib/seo/home-page-content";

export default function HomeInvestmentIntelSection() {
  return (
    <section className="rp-home-section border-t border-[var(--border-subtle)] bg-[var(--bg-elevated)]">
      <div className="rp-home-section-inner">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--invest-emerald)]">
            Investment intelligence
          </p>
          <h2 className="mt-2 font-serif text-2xl text-[var(--brand-navy)] md:text-3xl">
            {HOME_INVESTMENT_INTEL.title}
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-[var(--muted)] md:text-base">
            {HOME_INVESTMENT_INTEL.subtitle}
          </p>
        </div>

        <ul className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {HOME_INVESTMENT_INTEL.areas.map((area) => (
            <li key={area.name}>
              <article className="rp-home-area-card h-full text-center">
                <h3 className="font-serif text-base text-[var(--brand-navy)]">{area.name}</h3>
                <p className="mt-2 text-xs font-medium uppercase tracking-wide text-[var(--invest-emerald)]">
                  {area.tag}
                </p>
              </article>
            </li>
          ))}
        </ul>

        <div className="mt-8 text-center">
          <Link
            href={appPath(HOME_INVESTMENT_INTEL.cta.href)}
            className="inline-flex rounded-full border border-[color-mix(in_srgb,var(--invest-emerald)_35%,var(--border))] px-6 py-3 text-sm font-semibold text-[var(--invest-emerald)] transition hover:border-[var(--invest-emerald)]"
          >
            {HOME_INVESTMENT_INTEL.cta.label}
          </Link>
        </div>
      </div>
    </section>
  );
}

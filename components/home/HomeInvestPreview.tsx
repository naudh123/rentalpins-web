import Link from "next/link";
import ProductBadge from "@/components/brand/ProductBadge";
import { appPath } from "@/lib/config";
import { HOME_INVEST_PREVIEW } from "@/lib/seo/home-page-content";

export default function HomeInvestPreview() {
  return (
    <section
      className="border-t border-[var(--border-subtle)] px-4 py-8 sm:px-6"
      aria-labelledby="home-invest-preview-heading"
    >
      <article className="home-hero-lane--invest mx-auto flex max-w-6xl flex-col items-center rounded-2xl border border-[var(--border)] px-6 py-8 text-center sm:px-10 sm:py-10 md:flex-row md:text-left">
        <div className="flex-1">
          <ProductBadge variant="invest" />
          <span className="ml-2 text-[10px] font-semibold uppercase tracking-wider text-[var(--muted)]">
            Coming soon
          </span>
          <h2
            id="home-invest-preview-heading"
            className="mt-3 font-serif text-2xl text-[var(--brand-navy)] md:text-3xl"
          >
            {HOME_INVEST_PREVIEW.title}
          </h2>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-[var(--muted)]">
            {HOME_INVEST_PREVIEW.copy}
          </p>
        </div>
        <div className="mt-6 md:mt-0 md:shrink-0">
          <Link
            href={appPath(HOME_INVEST_PREVIEW.cta.href)}
            className="inline-flex rounded-full border border-[color-mix(in_srgb,var(--invest-emerald)_35%,var(--border))] px-6 py-3 text-sm font-semibold text-[var(--invest-emerald)] transition hover:border-[var(--invest-emerald)]"
          >
            {HOME_INVEST_PREVIEW.cta.label}
          </Link>
        </div>
      </article>
    </section>
  );
}

import Link from "next/link";
import ProductBadge from "@/components/brand/ProductBadge";
import { appPath } from "@/lib/config";
import { HOME_MODE_GATEWAY } from "@/lib/seo/home-page-content";

export default function HomeModeGateway() {
  const { rent, buy, invest } = HOME_MODE_GATEWAY;

  return (
    <section
      className="relative border-b border-[var(--border-subtle)] px-4 py-6 sm:px-6 sm:py-7"
      aria-labelledby="home-mode-gateway-heading"
    >
      <div className="mx-auto max-w-6xl">
        <div className="mb-5 text-center md:mb-6">
          <h2
            id="home-mode-gateway-heading"
            className="font-serif text-xl text-[var(--brand-navy)] sm:text-2xl"
          >
            {HOME_MODE_GATEWAY.headline}
          </h2>
          <p className="mt-1.5 text-sm text-[var(--muted)]">{HOME_MODE_GATEWAY.subhead}</p>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
          <article className="rp-home-mode-card rp-home-mode-card--rent flex flex-col p-5 sm:p-6">
            <ProductBadge variant="rent" />
            <h3 className="mt-3 font-serif text-lg text-[var(--brand-navy)]">{rent.title}</h3>
            <p className="mt-2 flex-1 text-sm leading-relaxed text-[var(--muted)]">{rent.copy}</p>
            <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
              <Link
                href={appPath(rent.primary.href)}
                className="rp-btn rp-btn-primary px-5 py-2.5 text-center text-sm"
              >
                {rent.primary.label}
              </Link>
              <Link
                href={appPath(rent.secondary.href)}
                className="text-center text-sm font-semibold text-[var(--brand-navy)] underline-offset-2 hover:underline sm:px-2 sm:py-2.5"
              >
                {rent.secondary.label}
              </Link>
            </div>
          </article>

          <article className="rp-home-mode-card rp-home-mode-card--buy sale-theme flex flex-col p-5 sm:p-6">
            <ProductBadge variant="buy" />
            <h3 className="mt-3 font-serif text-lg text-[var(--brand-navy)]">{buy.title}</h3>
            <p className="mt-2 flex-1 text-sm leading-relaxed text-[var(--muted)]">{buy.copy}</p>
            <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
              <Link
                href={appPath(buy.primary.href)}
                className="rp-btn rp-btn-primary px-5 py-2.5 text-center text-sm"
              >
                {buy.primary.label}
              </Link>
              <Link
                href={appPath(buy.secondary.href)}
                className="text-center text-sm font-semibold text-[var(--brand-navy)] underline-offset-2 hover:underline sm:px-2 sm:py-2.5"
              >
                {buy.secondary.label}
              </Link>
            </div>
          </article>

          <article className="rp-home-mode-card rp-home-mode-card--invest flex flex-col p-5 sm:p-6">
            <div className="flex flex-wrap items-center gap-2">
              <ProductBadge variant="invest" />
              <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--muted)]">
                Coming soon
              </span>
            </div>
            <h3 className="mt-3 font-serif text-lg text-[var(--brand-navy)]">{invest.title}</h3>
            <p className="mt-2 flex-1 text-sm leading-relaxed text-[var(--muted)]">{invest.copy}</p>
            <div className="mt-4">
              <Link
                href={appPath(invest.primary.href)}
                className="inline-flex rounded-full border border-[color-mix(in_srgb,var(--invest-emerald)_35%,var(--border))] px-5 py-2.5 text-sm font-semibold text-[var(--invest-emerald)] transition hover:border-[var(--invest-emerald)]"
              >
                {invest.primary.label}
              </Link>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}

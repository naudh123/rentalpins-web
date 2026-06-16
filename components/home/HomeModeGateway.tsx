import Link from "next/link";
import ProductBadge from "@/components/brand/ProductBadge";
import { appPath } from "@/lib/config";
import { HOME_BUY_HERO_CHIPS, HOME_MODE_GATEWAY } from "@/lib/seo/home-page-content";

export default function HomeModeGateway() {
  const { rent, buy, invest } = HOME_MODE_GATEWAY;

  return (
    <section
      className="relative border-b border-[var(--border-subtle)] px-4 py-5 sm:px-6 sm:py-6"
      aria-labelledby="home-mode-gateway-heading"
    >
      <div className="mx-auto max-w-6xl">
        <div className="mb-4 text-center md:mb-5">
          <h2
            id="home-mode-gateway-heading"
            className="font-serif text-lg text-[var(--brand-navy)] sm:text-xl"
          >
            {HOME_MODE_GATEWAY.headline}
          </h2>
          <p className="mt-1 text-sm text-[var(--muted)]">{HOME_MODE_GATEWAY.subhead}</p>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
          <article className="rp-home-mode-card rp-home-mode-card--rent flex flex-col p-5 sm:p-6">
            <ProductBadge variant="rent" />
            <h3 className="mt-3 font-serif text-lg text-[var(--brand-navy)]">{rent.title}</h3>
            <p className="mt-2 flex-1 text-sm leading-relaxed text-[var(--muted)]">{rent.copy}</p>
            <div className="mt-4 flex flex-col gap-2">
              <Link
                href={appPath(rent.primary.href)}
                className="rp-btn rp-btn-primary px-5 py-2.5 text-center text-sm"
              >
                {rent.primary.label}
              </Link>
              <Link
                href={appPath(rent.secondary.href)}
                className="text-sm font-semibold text-[var(--brand-navy)] underline-offset-2 hover:underline"
              >
                {rent.secondary.label}
              </Link>
            </div>
          </article>

          <article className="rp-home-mode-card rp-home-mode-card--buy sale-theme flex flex-col p-5 sm:p-6">
            <ProductBadge variant="buy" />
            <h3 className="mt-3 font-serif text-lg text-[var(--brand-navy)]">{buy.title}</h3>
            <p className="mt-2 flex-1 text-sm leading-relaxed text-[var(--muted)]">{buy.copy}</p>
            <div className="mt-4 flex flex-col gap-2">
              <Link
                href={appPath(buy.primary.href)}
                className="rp-btn rp-btn-primary px-5 py-2.5 text-center text-sm"
              >
                {buy.primary.label}
              </Link>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                <Link
                  href={appPath(buy.secondary.href)}
                  className="text-sm font-semibold text-[var(--brand-navy)] underline-offset-2 hover:underline"
                >
                  {buy.secondary.label}
                </Link>
                {"tertiary" in buy && buy.tertiary ? (
                  <Link
                    href={appPath(buy.tertiary.href)}
                    className="text-sm font-semibold text-[var(--brand-navy)] underline-offset-2 hover:underline"
                  >
                    {buy.tertiary.label}
                  </Link>
                ) : null}
              </div>
            </div>
            <ul className="mt-4 flex flex-wrap gap-2" aria-label="Popular buy areas">
              {HOME_BUY_HERO_CHIPS.map((chip) => (
                <li key={chip.href}>
                  <Link
                    href={appPath(chip.href)}
                    className="inline-block rounded-full border border-[color-mix(in_srgb,var(--sale-gold)_35%,var(--border))] bg-white/90 px-2.5 py-1 text-[11px] font-semibold text-[var(--brand-navy)] no-underline transition-colors hover:border-[var(--sale-gold)]"
                  >
                    {chip.label}
                  </Link>
                </li>
              ))}
            </ul>
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

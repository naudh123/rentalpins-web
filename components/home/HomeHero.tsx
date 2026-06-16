import BrandMark from "@/components/brand/BrandMark";
import { PLAY_STORE_URL } from "@/lib/site-links";
import {
  HOME_HERO,
  HOME_PLATFORM_PILLS,
  HOME_TRUST_PILLS,
} from "@/lib/seo/home-page-content";
import HomeModeGateway from "@/components/home/HomeModeGateway";

interface Props {
  liveCityCount: number;
}

export default function HomeHero({ liveCityCount }: Props) {
  return (
    <section aria-labelledby="home-hero-heading" className="relative overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_-10%,rgba(30,58,110,0.1),transparent)]"
        aria-hidden
      />

      <div className="relative px-4 pb-2 pt-3 text-center sm:pt-4 md:pb-3">
        <div className="mx-auto flex max-w-4xl flex-col items-center">
          <BrandMark size="hero" priority />
          <h1
            id="home-hero-heading"
            className="mt-3 max-w-4xl font-serif text-[1.55rem] leading-[1.12] tracking-tight text-[var(--brand-navy)] sm:mt-4 sm:text-[1.85rem] md:text-4xl md:leading-tight lg:text-[2.5rem]"
          >
            {HOME_HERO.headline}
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[var(--muted)] md:text-[0.95rem]">
            {HOME_HERO.subhead}
          </p>

          <ul
            className="mt-3 flex max-w-3xl flex-wrap items-center justify-center gap-2"
            aria-label="Platform highlights"
          >
            {HOME_TRUST_PILLS.map((pill) => (
              <li key={pill}>
                <span className="rp-home-trust-pill">{pill}</span>
              </li>
            ))}
          </ul>

          <p className="mt-2 text-xs text-[var(--muted)] sm:text-sm">
            Also on{" "}
            <a
              href={PLAY_STORE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-[var(--brand-orange)] hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--brand-orange)]"
            >
              Google Play
            </a>
          </p>
        </div>
      </div>

      <HomeModeGateway />

      <dl className="mx-auto grid max-w-3xl grid-cols-2 gap-3 border-t border-[var(--border-subtle)] px-4 py-5 sm:grid-cols-4 sm:py-6">
        {HOME_PLATFORM_PILLS.map((pill) => (
          <div key={pill.label} className="rp-home-lux-card rounded-2xl px-3 py-3 text-center">
            <dt className="text-[10px] font-semibold uppercase tracking-wide text-[var(--muted)] sm:text-xs">
              {pill.label}
            </dt>
            <dd className="mt-1 font-serif text-base text-[var(--brand-orange)] sm:text-lg">
              {pill.value}
            </dd>
          </div>
        ))}
        <div className="rp-home-lux-card rounded-2xl px-3 py-3 text-center">
          <dt className="text-[10px] font-semibold uppercase tracking-wide text-[var(--muted)] sm:text-xs">
            Live cities
          </dt>
          <dd className="mt-1 font-serif text-base text-[var(--brand-orange)] sm:text-lg">
            {liveCityCount}
          </dd>
        </div>
      </dl>
    </section>
  );
}

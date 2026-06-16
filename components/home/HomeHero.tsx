import BrandMark from "@/components/brand/BrandMark";
import { PLAY_STORE_URL } from "@/lib/site-links";
import {
  HOME_BUY_HERO_CHIPS,
  HOME_BUY_LANE,
  HOME_HERO,
  HOME_PLATFORM_PILLS,
  HOME_RENT_LANE,
  HOME_TRUST_PILLS,
} from "@/lib/seo/home-page-content";
import HomeHeroLane from "@/components/home/HomeHeroLane";
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

      <div className="relative px-4 pb-3 pt-4 text-center sm:pt-5 md:pb-4 md:pt-6">
        <div className="mx-auto flex max-w-4xl flex-col items-center">
          <BrandMark size="hero" priority />
          <p className="mt-3 font-serif text-[1.95rem] font-bold tracking-tight sm:text-[2.44rem] md:mt-4 md:text-[2.93rem]">
            <span className="rp-wordmark-navy">Rental</span>
            <span className="rp-wordmark-orange">Pins</span>
          </p>
          <h1
            id="home-hero-heading"
            className="mt-2 max-w-4xl font-serif text-[1.55rem] leading-[1.12] tracking-tight text-[var(--brand-navy)] sm:mt-3 sm:text-[1.85rem] md:text-4xl md:leading-tight lg:text-[2.5rem]"
          >
            {HOME_HERO.headline}
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[var(--muted)] md:text-[0.95rem]">
            {HOME_HERO.subhead}
          </p>

          <ul
            className="mt-4 flex max-w-3xl flex-wrap items-center justify-center gap-2"
            aria-label="Platform highlights"
          >
            {HOME_TRUST_PILLS.map((pill) => (
              <li key={pill}>
                <span className="rp-home-trust-pill">{pill}</span>
              </li>
            ))}
          </ul>

          <p className="mt-3 text-xs text-[var(--muted)] sm:text-sm">
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

      <div className="relative mx-auto grid max-w-6xl grid-cols-1 border-y border-[var(--border-subtle)] md:grid-cols-2">
        <HomeHeroLane
          variant="rent"
          eyebrow={HOME_RENT_LANE.eyebrow}
          heading={HOME_RENT_LANE.heading}
          copy={HOME_RENT_LANE.copy}
          benefits={HOME_RENT_LANE.benefits}
          headingId="home-rent-lane-heading"
          primaryCta={{
            label: HOME_RENT_LANE.primaryCta.label,
            href: HOME_RENT_LANE.primaryCta.href,
            dataCta: "browse-rentals-map",
          }}
          secondaryCta={{
            label: HOME_RENT_LANE.secondaryCta.label,
            href: HOME_RENT_LANE.secondaryCta.href,
            dataCta: "list-for-rent",
          }}
        />
        <HomeHeroLane
          variant="buy"
          eyebrow={HOME_BUY_LANE.eyebrow}
          heading={HOME_BUY_LANE.heading}
          copy={HOME_BUY_LANE.copy}
          benefits={HOME_BUY_LANE.benefits}
          headingId="home-buy-lane-heading"
          primaryCta={{
            label: HOME_BUY_LANE.primaryCta.label,
            href: HOME_BUY_LANE.primaryCta.href,
            dataCta: "browse-buy-map",
          }}
          secondaryCta={{
            label: HOME_BUY_LANE.secondaryCta.label,
            href: HOME_BUY_LANE.secondaryCta.href,
            dataCta: "list-for-sale",
          }}
          tertiaryCta={{
            label: HOME_BUY_LANE.tertiaryCta.label,
            href: HOME_BUY_LANE.tertiaryCta.href,
            dataCta: "post-buy-requirement",
          }}
          chips={HOME_BUY_HERO_CHIPS}
        />
      </div>

      <dl className="mx-auto grid max-w-3xl grid-cols-2 gap-3 px-4 py-6 sm:grid-cols-4 sm:py-7">
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

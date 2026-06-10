import Image from "next/image";
import Link from "next/link";
import { appPath } from "@/lib/config";
import { PLAY_STORE_URL } from "@/lib/site-links";
import { HOME_HERO, HOME_PLATFORM_PILLS } from "@/lib/seo/home-page-content";

interface Props {
  liveCityCount: number;
}

export default function HomeHero({ liveCityCount }: Props) {
  return (
    <section className="relative overflow-hidden px-4 pb-16 pt-12 md:pb-24 md:pt-20">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_-10%,rgba(30,58,110,0.12),transparent)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-24 top-20 h-64 w-64 rounded-full bg-[var(--brand-orange)] opacity-[0.05] blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -left-16 bottom-0 h-48 w-48 rounded-full bg-[var(--brand-navy)] opacity-[0.06] blur-3xl"
        aria-hidden
      />

      <div className="relative mx-auto max-w-5xl text-center">
        <div className="mx-auto flex flex-col items-center">
          <Image
            src="/logo/logo.png"
            alt="RentalPins"
            width={112}
            height={112}
            className="h-24 w-24 object-contain sm:h-28 sm:w-28"
            priority
          />
          <p className="mt-5 inline-flex items-center gap-2 rounded-full border border-[var(--border-subtle)] bg-white/80 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--brand-navy)] backdrop-blur-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--brand-orange)]" aria-hidden />
            {HOME_HERO.eyebrow}
          </p>
        </div>

        <h1 className="mt-8 font-serif text-4xl leading-[1.06] tracking-tight text-[var(--brand-navy)] md:text-5xl lg:text-[3.5rem]">
          {HOME_HERO.headline}
          <br />
          <span className="bg-gradient-to-r from-[var(--brand-navy)] via-[var(--brand-navy)] to-[var(--brand-orange)] bg-clip-text text-transparent">
            {HOME_HERO.headlineAccent}
          </span>
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-[var(--muted)] md:text-lg">
          {HOME_HERO.subhead}
        </p>

        <div className="mt-10 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
          <Link
            href={appPath("/post")}
            data-cta="list-property-free"
            data-cta-location="home-hero"
            data-intent="general"
            className="rp-btn rp-btn-primary px-8 py-3.5 text-base shadow-[0_12px_40px_rgba(232,80,26,0.22)]"
          >
            List property free
          </Link>
          <Link
            href={appPath("/search")}
            data-cta="browse-rentals-map"
            data-cta-location="home-hero"
            className="rp-btn rp-btn-secondary px-8 py-3.5 text-base"
          >
            Browse rentals on map
          </Link>
        </div>

        <p className="mt-5 text-sm text-[var(--muted)]">
          Also on{" "}
          <a
            href={PLAY_STORE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-[var(--brand-orange)] hover:underline"
          >
            Google Play
          </a>
        </p>

        <dl className="mx-auto mt-14 grid max-w-2xl grid-cols-2 gap-3 sm:grid-cols-4">
          {HOME_PLATFORM_PILLS.map((pill) => (
            <div
              key={pill.label}
              className="rp-home-lux-card rounded-2xl px-3 py-4 text-center"
            >
              <dt className="text-[10px] font-semibold uppercase tracking-wide text-[var(--muted)] sm:text-xs">
                {pill.label}
              </dt>
              <dd className="mt-1 font-serif text-lg text-[var(--brand-orange)] sm:text-xl">
                {pill.value}
              </dd>
            </div>
          ))}
          <div className="rp-home-lux-card rounded-2xl px-3 py-4 text-center">
            <dt className="text-[10px] font-semibold uppercase tracking-wide text-[var(--muted)] sm:text-xs">
              Live cities
            </dt>
            <dd className="mt-1 font-serif text-lg text-[var(--brand-orange)] sm:text-xl">
              {liveCityCount}
            </dd>
          </div>
        </dl>
      </div>
    </section>
  );
}

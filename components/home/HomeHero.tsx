import Link from "next/link";
import { appPath } from "@/lib/config";
import {
  HOME_HERO,
  HOME_TRUST_POINTS,
  HOME_VERTICALS,
  type HomeVerticalKey,
} from "@/lib/seo/home-page-content";
import { CheckIcon, PinIcon, SearchIcon } from "@/components/home/HomeIcons";
import HomeHeroMap from "@/components/home/HomeHeroMap";

const VERTICAL_ACCENT: Record<HomeVerticalKey, string> = {
  rent: "var(--brand-orange)",
  buy: "var(--sale-gold)",
  invest: "var(--invest-emerald)",
};

/** Vertical landing for each hero shortcut (Buy hub covers both buying and selling). */
const VERTICAL_HUB: Record<HomeVerticalKey, string> = {
  rent: "/search",
  buy: "/buy",
  invest: "/invest",
};

interface Props {
  liveIndiaCityCount: number;
}

/**
 * Above-the-fold hero: single H1, plain GET search form (works without JS —
 * the secondary button switches the form action to the sale map).
 */
export default function HomeHero({ liveIndiaCityCount }: Props) {
  return (
    <section
      aria-labelledby="home-hero-heading"
      className="relative overflow-hidden border-b border-[var(--border-subtle)] bg-[radial-gradient(ellipse_70%_60%_at_15%_0%,rgba(30,58,110,0.10),transparent),radial-gradient(ellipse_50%_50%_at_95%_10%,rgba(232,80,26,0.08),transparent)]"
    >
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 pb-12 pt-10 sm:px-6 md:pb-16 md:pt-14 lg:grid-cols-[1.1fr_0.9fr] lg:gap-12 lg:pb-16 lg:pt-10">
        <div>
          <p className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-white/80 px-3 py-1 text-xs font-semibold text-[var(--brand-navy)]">
            <PinIcon className="h-3.5 w-3.5 text-[var(--brand-orange)]" />
            {HOME_HERO.eyebrow}
          </p>

          <h1
            id="home-hero-heading"
            className="mt-5 font-serif text-[2.1rem] leading-[1.1] tracking-tight text-[var(--brand-navy)] sm:text-5xl lg:text-[3.4rem]"
          >
            {HOME_HERO.headline}
          </h1>

          <p className="mt-5 max-w-xl text-base leading-relaxed text-[var(--muted)] sm:text-lg">
            {HOME_HERO.subhead}
          </p>

          <form
            action={appPath(HOME_HERO.rentSearch.action)}
            method="get"
            role="search"
            aria-label="Search property"
            className="mt-7 max-w-xl rounded-2xl border border-[var(--border)] bg-white p-2 shadow-[0_18px_50px_-20px_rgba(15,37,84,0.35)]"
          >
            <label htmlFor="home-search-q" className="sr-only">
              {HOME_HERO.searchLabel}
            </label>
            <div className="flex items-center gap-2 px-3 py-1.5">
              <SearchIcon className="h-5 w-5 shrink-0 text-[var(--muted)]" />
              <input
                id="home-search-q"
                name="q"
                type="search"
                autoComplete="off"
                enterKeyHint="search"
                placeholder={HOME_HERO.searchPlaceholder}
                className="min-w-0 flex-1 bg-transparent py-2 text-[15px] text-[var(--text)] placeholder:text-[var(--muted)] focus:outline-none"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="submit"
                data-cta="home-search-rent"
                className="rounded-xl bg-[var(--brand-orange)] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[var(--brand-orange-hover)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--brand-navy)]"
              >
                {HOME_HERO.rentSearch.label}
              </button>
              <button
                type="submit"
                formAction={appPath(HOME_HERO.buySearch.action)}
                data-cta="home-search-buy"
                className="rounded-xl bg-[var(--brand-navy)] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[var(--brand-navy-dark)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--brand-orange)]"
              >
                {HOME_HERO.buySearch.label}
              </button>
            </div>
          </form>

          <ul
            className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm text-[var(--text)]"
            aria-label="Why RentalPins"
          >
            {HOME_TRUST_POINTS.map((point) => (
              <li key={point} className="flex items-center gap-1.5">
                <CheckIcon className="h-4 w-4 text-[var(--invest-emerald)]" />
                {point}
              </li>
            ))}
            <li className="flex items-center gap-1.5">
              <CheckIcon className="h-4 w-4 text-[var(--invest-emerald)]" />
              {liveIndiaCityCount} live Indian cities
            </li>
          </ul>

          {/* The three verticals at a glance, above the fold on every screen size. */}
          <nav aria-label="Choose a vertical" className="mt-5 max-w-xl">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">
              I want to
            </p>
            <ul className="mt-2 grid grid-cols-3 gap-2">
              {HOME_VERTICALS.map((v) => (
                <li key={v.key}>
                  <Link
                    href={appPath(VERTICAL_HUB[v.key])}
                    data-cta={`home-hero-${v.key}`}
                    className="flex h-full flex-col items-center justify-center rounded-xl border border-[var(--border)] bg-white px-2 py-2.5 text-center text-sm font-semibold text-[var(--brand-navy)] transition hover:border-[var(--brand-navy)]"
                  >
                    <span
                      className="mb-1 h-1.5 w-6 rounded-full"
                      style={{ backgroundColor: VERTICAL_ACCENT[v.key] }}
                      aria-hidden
                    />
                    {v.badge === "Buy & Sell" ? "Buy / Sell" : v.badge}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <HomeHeroMap />
      </div>
    </section>
  );
}

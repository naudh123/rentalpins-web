import Link from "next/link";
import type { ReactNode } from "react";
import { appPath } from "@/lib/config";
import {
  HOME_BUY_CHIPS,
  HOME_VERTICALS,
  HOME_VERTICALS_SECTION,
  type HomeVerticalKey,
} from "@/lib/seo/home-page-content";
import { ArrowIcon, ChartIcon, CheckIcon, HomeIcon, KeyIcon } from "@/components/home/HomeIcons";
import HomeSectionHeading from "@/components/home/HomeSectionHeading";

interface Theme {
  accent: string;
  tint: string;
  /** Icon / badge colour on the tint (amber is too light for text). */
  ink: string;
  primaryBtn: string;
  icon: ReactNode;
}

const THEMES: Record<HomeVerticalKey, Theme> = {
  rent: {
    accent: "var(--brand-orange)",
    tint: "color-mix(in srgb, var(--brand-orange) 10%, white)",
    ink: "var(--brand-orange)",
    primaryBtn:
      "bg-[var(--brand-orange)] text-white hover:bg-[var(--brand-orange-hover)]",
    icon: <KeyIcon />,
  },
  buy: {
    accent: "var(--sale-gold)",
    tint: "color-mix(in srgb, var(--sale-gold) 16%, white)",
    ink: "var(--brand-navy)",
    primaryBtn:
      "bg-[var(--sale-gold)] text-[var(--brand-navy)] hover:bg-[var(--sale-gold-hover)]",
    icon: <HomeIcon />,
  },
  invest: {
    accent: "var(--invest-emerald)",
    tint: "color-mix(in srgb, var(--invest-emerald) 10%, white)",
    ink: "var(--invest-emerald)",
    primaryBtn: "bg-[var(--invest-emerald)] text-white hover:brightness-110",
    icon: <ChartIcon />,
  },
};

export default function HomeVerticals() {
  return (
    <section
      id="choose-your-path"
      aria-labelledby="home-verticals-heading"
      className="scroll-mt-20 bg-[var(--bg-elevated)] px-4 py-16 sm:px-6 md:py-20"
    >
      <div className="mx-auto max-w-6xl">
        <HomeSectionHeading
          id="home-verticals-heading"
          eyebrow={HOME_VERTICALS_SECTION.eyebrow}
          title={HOME_VERTICALS_SECTION.title}
          subtitle={HOME_VERTICALS_SECTION.subtitle}
        />

        {/* md+: cards share row tracks (subgrid) so titles, bullets and buttons line up. */}
        <div className="mt-10 grid gap-5 md:grid-cols-3 md:grid-rows-[repeat(6,auto)]">
          {HOME_VERTICALS.map((v) => {
            const theme = THEMES[v.key];
            return (
              <article
                key={v.key}
                aria-labelledby={`home-vertical-${v.key}`}
                className="relative flex flex-col overflow-hidden md:row-span-6 md:grid md:grid-rows-subgrid md:gap-y-0 rounded-3xl border border-[var(--border)] bg-white p-6 shadow-[0_12px_40px_-24px_rgba(15,37,84,0.35)] transition hover:-translate-y-0.5 hover:shadow-[0_24px_60px_-28px_rgba(15,37,84,0.45)] sm:p-7"
              >
                <span
                  className="absolute inset-x-0 top-0 h-1"
                  style={{ backgroundColor: theme.accent }}
                  aria-hidden
                />
                <div className="flex items-center justify-between">
                  <span
                    className="flex h-12 w-12 items-center justify-center rounded-2xl"
                    style={{ backgroundColor: theme.tint, color: theme.ink }}
                  >
                    {theme.icon}
                  </span>
                  <span
                    className="rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em]"
                    style={{ backgroundColor: theme.tint, color: theme.ink }}
                  >
                    {v.badge}
                  </span>
                </div>

                <h3
                  id={`home-vertical-${v.key}`}
                  className="mt-5 font-serif text-2xl text-[var(--brand-navy)]"
                >
                  {v.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">{v.audience}</p>

                <ul className="mt-5 space-y-2.5">
                  {v.bullets.map((b) => (
                    <li key={b} className="flex items-start gap-2.5 text-sm text-[var(--text)]">
                      <span
                        className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full"
                        style={{ backgroundColor: theme.tint, color: theme.ink }}
                      >
                        <CheckIcon className="h-3 w-3" />
                      </span>
                      {b}
                    </li>
                  ))}
                </ul>

                {v.key === "buy" ? (
                  <ul className="mt-5 flex flex-wrap gap-1.5" aria-label="Property for sale by area">
                    {HOME_BUY_CHIPS.map((chip) => (
                      <li key={chip.href}>
                        <Link
                          href={appPath(chip.href)}
                          className="inline-block rounded-full border border-[var(--border)] px-2.5 py-1 text-xs font-medium text-[var(--brand-navy)] transition hover:border-[var(--sale-gold)] hover:bg-[color-mix(in_srgb,var(--sale-gold)_10%,white)]"
                        >
                          {chip.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div aria-hidden />
                )}

                <div className="mt-auto pt-7">
                  <div className="flex flex-col gap-2.5">
                    <Link
                      href={appPath(v.primary.href)}
                      data-cta={`home-${v.key}-primary`}
                      data-intent={v.key}
                      className={`inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--brand-navy)] ${theme.primaryBtn}`}
                    >
                      {v.primary.label}
                      <ArrowIcon />
                    </Link>
                    <Link
                      href={appPath(v.secondary.href)}
                      data-cta={`home-${v.key}-secondary`}
                      data-intent={v.key}
                      className="inline-flex items-center justify-center rounded-xl border border-[var(--border)] px-5 py-3 text-sm font-semibold text-[var(--brand-navy)] transition hover:border-[var(--brand-navy)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--brand-navy)]"
                    >
                      {v.secondary.label}
                    </Link>
                  </div>
                  <ul className="mt-5 flex flex-wrap gap-x-4 gap-y-1.5 border-t border-[var(--border-subtle)] pt-4 text-xs">
                    {v.more.map((link) => (
                      <li key={link.href}>
                        <Link
                          href={appPath(link.href)}
                          className="font-medium text-[var(--muted)] underline-offset-2 hover:text-[var(--brand-navy)] hover:underline"
                        >
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

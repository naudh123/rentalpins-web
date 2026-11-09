import Link from "next/link";
import { appPath } from "@/lib/config";
import {
  HOME_CITIES_SECTION,
  type HomeCityCard,
  type HomeLink,
} from "@/lib/seo/home-page-content";
import { ArrowIcon, PinIcon } from "@/components/home/HomeIcons";
import HomeSectionHeading from "@/components/home/HomeSectionHeading";

interface Props {
  indiaCities: HomeCityCard[];
  globalCities: HomeLink[];
}

/** Crawlable links to every live city hub (/rentals/in/{city}). */
export default function HomeCities({ indiaCities, globalCities }: Props) {
  return (
    <section
      aria-labelledby="home-cities-heading"
      className="border-y border-[var(--border-subtle)] bg-[var(--bg-elevated)] px-4 py-16 sm:px-6 md:py-20"
    >
      <div className="mx-auto max-w-6xl">
        <HomeSectionHeading
          id="home-cities-heading"
          eyebrow={HOME_CITIES_SECTION.eyebrow}
          title={HOME_CITIES_SECTION.title}
          subtitle={HOME_CITIES_SECTION.subtitle}
        />

        <ul className="mt-10 grid grid-cols-2 gap-2.5 sm:gap-3 lg:grid-cols-4">
          {indiaCities.map((city) => (
            <li key={city.href}>
              <Link
                href={appPath(city.href)}
                className="group flex h-full items-start gap-3 rounded-2xl border border-[var(--border)] bg-white p-3 sm:p-4 transition hover:border-[var(--brand-orange)] hover:shadow-[0_14px_36px_-22px_rgba(15,37,84,0.45)]"
              >
                <span className="mt-0.5 hidden h-9 w-9 shrink-0 sm:flex items-center justify-center rounded-xl bg-[color-mix(in_srgb,var(--brand-orange)_10%,white)] text-[var(--brand-orange)]">
                  <PinIcon className="h-4.5 w-4.5" />
                </span>
                <span className="min-w-0">
                  <span className="block text-sm font-semibold text-[var(--brand-navy)] sm:text-base group-hover:text-[var(--brand-orange)]">
                    Property in {city.name}
                  </span>
                  {city.areas ? (
                    <span className="mt-0.5 hidden truncate text-xs sm:block text-[var(--muted)]">
                      {city.areas}
                    </span>
                  ) : null}
                </span>
              </Link>
            </li>
          ))}
        </ul>

        <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
          {globalCities.length > 0 ? (
            <p className="text-sm text-[var(--muted)]">
              Also live:{" "}
              {globalCities.map((city, i) => (
                <span key={city.href}>
                  {i > 0 ? ", " : ""}
                  <Link
                    href={appPath(city.href)}
                    className="font-semibold text-[var(--brand-navy)] underline-offset-2 hover:underline"
                  >
                    {city.label}
                  </Link>
                </span>
              ))}
            </p>
          ) : (
            <span />
          )}
          <Link
            href={appPath(HOME_CITIES_SECTION.allCities.href)}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--brand-orange)] hover:underline"
          >
            {HOME_CITIES_SECTION.allCities.label}
            <ArrowIcon />
          </Link>
        </div>
      </div>
    </section>
  );
}

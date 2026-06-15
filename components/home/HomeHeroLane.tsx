import Image from "next/image";
import Link from "next/link";
import { appPath } from "@/lib/config";

export type HomeHeroLaneVariant = "rent" | "buy";

export interface HomeHeroLaneChip {
  label: string;
  href: string;
}

export interface HomeHeroLaneCta {
  label: string;
  href: string;
  dataCta: string;
}

interface Props {
  variant: HomeHeroLaneVariant;
  eyebrow: string;
  heading: string;
  copy: string;
  benefits?: readonly string[];
  primaryCta: HomeHeroLaneCta;
  secondaryCta: HomeHeroLaneCta;
  tertiaryCta?: HomeHeroLaneCta;
  chips?: readonly HomeHeroLaneChip[];
  headingId: string;
}

export default function HomeHeroLane({
  variant,
  eyebrow,
  heading,
  copy,
  benefits,
  primaryCta,
  secondaryCta,
  tertiaryCta,
  chips,
  headingId,
}: Props) {
  const isBuy = variant === "buy";
  const accentVar = isBuy ? "var(--sale-gold)" : "var(--brand-orange)";
  const laneShell = isBuy
    ? "sale-theme home-hero-lane home-hero-lane--buy border-t border-[var(--border-subtle)] md:border-t-0 md:border-l"
    : "home-hero-lane home-hero-lane--rent";

  return (
    <article
      className={`${laneShell} flex flex-col px-5 py-8 sm:px-7 sm:py-9 md:px-9 md:py-10 lg:min-h-[24rem]`}
    >
      <div className="flex flex-1 flex-col">
        {isBuy ? (
          <div className="mb-5 flex justify-center">
            <Image
              src="/logo/logo-buy.png"
              alt="RentalPins Buy"
              width={200}
              height={200}
              className="h-28 w-auto object-contain sm:h-32 md:h-36 lg:h-40"
              priority
            />
          </div>
        ) : null}

        <p
          className="text-[11px] font-bold uppercase tracking-[0.22em]"
          style={{ color: accentVar }}
        >
          {eyebrow}
        </p>

        <h2
          id={headingId}
          className="mt-2 font-serif text-2xl leading-tight text-[var(--brand-navy)] sm:text-3xl md:text-[2rem]"
        >
          {heading}
        </h2>

        <p className="mt-3 max-w-md text-sm leading-relaxed text-[var(--muted)] md:text-[0.95rem]">
          {copy}
        </p>

        {benefits && benefits.length > 0 ? (
          <ul className="mt-4 space-y-1.5" aria-label={`${eyebrow} benefits`}>
            {benefits.map((item) => (
              <li
                key={item}
                className="flex items-start gap-2 text-xs leading-snug text-[var(--text)] sm:text-sm"
              >
                <span
                  className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full"
                  style={{ backgroundColor: accentVar }}
                  aria-hidden
                />
                {item}
              </li>
            ))}
          </ul>
        ) : null}

        <div className="mt-7 flex flex-col gap-3">
          <Link
            href={appPath(primaryCta.href)}
            data-cta={primaryCta.dataCta}
            data-cta-location="home-hero-lane"
            data-intent={variant}
            className="rp-btn rp-btn-primary w-full px-7 py-3.5 text-center text-base sm:w-fit"
            style={
              isBuy
                ? undefined
                : { boxShadow: "0 12px 40px rgba(232, 80, 26, 0.22)" }
            }
          >
            {primaryCta.label}
          </Link>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <Link
              href={appPath(secondaryCta.href)}
              data-cta={secondaryCta.dataCta}
              data-cta-location="home-hero-lane"
              data-intent={variant}
              className="text-sm font-semibold text-[var(--brand-navy)] underline-offset-2 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
              style={{ outlineColor: accentVar }}
            >
              {secondaryCta.label}
            </Link>
            {tertiaryCta ? (
              <Link
                href={appPath(tertiaryCta.href)}
                data-cta={tertiaryCta.dataCta}
                data-cta-location="home-hero-lane"
                data-intent={variant}
                className="text-sm font-semibold text-[var(--brand-navy)] underline-offset-2 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                style={{ outlineColor: accentVar }}
              >
                {tertiaryCta.label}
              </Link>
            ) : null}
          </div>
        </div>

        {chips && chips.length > 0 ? (
          <ul className="mt-6 flex flex-wrap gap-2" aria-label="Popular buy areas">
            {chips.map((chip) => (
              <li key={chip.href}>
                <Link
                  href={appPath(chip.href)}
                  className="inline-block rounded-full border border-[color-mix(in_srgb,var(--sale-gold)_35%,var(--border))] bg-white/90 px-3 py-1.5 text-xs font-semibold text-[var(--brand-navy)] no-underline transition-colors hover:border-[var(--sale-gold)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--sale-gold)]"
                >
                  {chip.label}
                </Link>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </article>
  );
}

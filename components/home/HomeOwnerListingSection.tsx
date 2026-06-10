import Link from "next/link";
import ListPropertyCTA from "@/components/seo/ListPropertyCTA";
import SupplyAudienceSection from "@/components/seo/SupplyAudienceSection";
import { appPath } from "@/lib/config";
import {
  HOME_LISTING_STEPS,
  HOME_OWNER_VALUE,
  HOME_PROPERTY_TYPES,
} from "@/lib/seo/home-page-content";

export default function HomeOwnerListingSection() {
  return (
    <>
      <section
        aria-labelledby="home-owner-value-heading"
        className="border-t border-[var(--border-subtle)] bg-[var(--bg-elevated)]/50 px-4 py-16 md:py-20"
      >
        <div className="mx-auto max-w-5xl">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--brand-orange)]">
              For property owners
            </p>
            <h2
              id="home-owner-value-heading"
              className="mt-3 font-serif text-2xl text-[var(--brand-navy)] md:text-3xl"
            >
              {HOME_OWNER_VALUE.title}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-[var(--muted)] md:text-base">
              {HOME_OWNER_VALUE.subtitle}
            </p>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {HOME_OWNER_VALUE.benefits.map((benefit) => (
              <div
                key={benefit.title}
                className="rp-home-lux-card group rounded-2xl p-6 transition-transform duration-300 hover:-translate-y-0.5"
              >
                <div className="mb-4 h-0.5 w-10 rounded-full bg-gradient-to-r from-[var(--brand-orange)] to-transparent opacity-80" />
                <h3 className="font-semibold text-[var(--brand-navy)]">{benefit.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">{benefit.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        aria-labelledby="home-listing-steps-heading"
        className="px-4 py-16 md:py-20"
      >
        <div className="mx-auto max-w-5xl">
          <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:items-start">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--brand-orange)]">
                Post listing
              </p>
              <h2
                id="home-listing-steps-heading"
                className="mt-3 font-serif text-2xl text-[var(--brand-navy)] md:text-3xl"
              >
                {HOME_LISTING_STEPS.title}
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-[var(--muted)] md:text-base">
                {HOME_LISTING_STEPS.subtitle}
              </p>
              <Link
                href={appPath("/post")}
                data-cta="list-property-free"
                data-cta-location="home-listing-steps"
                data-intent="general"
                className="rp-btn rp-btn-primary mt-8 px-7 py-3"
              >
                Start free listing
              </Link>
            </div>

            <ol className="space-y-4">
              {HOME_LISTING_STEPS.steps.map((item) => (
                <li
                  key={item.step}
                  className="rp-home-lux-card flex gap-5 rounded-2xl p-5 md:p-6"
                >
                  <span className="font-serif text-2xl font-bold leading-none text-[var(--brand-orange)]/80">
                    {item.step}
                  </span>
                  <div>
                    <h3 className="font-semibold text-[var(--brand-navy)]">{item.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">{item.desc}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <ListPropertyCTA variant="hero" intent="general" />

      <SupplyAudienceSection intent="general" />

      <section
        aria-labelledby="home-property-types-heading"
        className="border-t border-[var(--border-subtle)] bg-[var(--bg-elevated)]/40 px-4 py-14"
      >
        <div className="mx-auto max-w-4xl text-center">
          <h2
            id="home-property-types-heading"
            className="rp-section-title text-xl md:text-2xl"
          >
            {HOME_PROPERTY_TYPES.title}
          </h2>
          <ul className="mt-8 flex flex-wrap justify-center gap-2">
            {HOME_PROPERTY_TYPES.types.map((type) => (
              <li key={type.label}>
                <Link
                  href={appPath(type.href)}
                  className="rounded-full border border-[var(--border)] bg-white px-4 py-2 text-sm font-medium text-[var(--brand-navy)] no-underline transition-colors hover:border-[var(--brand-orange)] hover:text-[var(--brand-orange)]"
                >
                  {type.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}

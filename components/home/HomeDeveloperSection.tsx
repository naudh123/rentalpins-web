import Link from "next/link";
import { appPath } from "@/lib/config";
import { HOME_DEVELOPER_TEASER } from "@/lib/seo/home-page-content";

export default function HomeDeveloperSection() {
  return (
    <section className="rp-home-section border-t border-[var(--border-subtle)] rp-home-navy-band text-white">
      <div className="rp-home-section-inner">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--sale-gold-muted)]">
            Developers
          </p>
          <h2 className="mt-2 font-serif text-2xl md:text-3xl">{HOME_DEVELOPER_TEASER.title}</h2>
          <p className="mt-3 text-sm leading-relaxed text-white/80 md:text-base">
            {HOME_DEVELOPER_TEASER.subtitle}
          </p>
        </div>

        <ul className="mx-auto mt-8 grid max-w-4xl grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {HOME_DEVELOPER_TEASER.benefits.map((benefit) => (
            <li
              key={benefit}
              className="flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm text-white/90"
            >
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--sale-gold)]" aria-hidden />
              {benefit}
            </li>
          ))}
        </ul>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href={appPath(HOME_DEVELOPER_TEASER.cta.href)}
            className="rounded-full bg-[var(--sale-gold)] px-6 py-3 text-sm font-semibold text-[var(--brand-navy)] transition hover:bg-[var(--sale-gold-hover)]"
          >
            {HOME_DEVELOPER_TEASER.cta.label}
          </Link>
          <Link
            href={appPath(HOME_DEVELOPER_TEASER.secondaryCta.href)}
            className="text-sm font-semibold text-white underline-offset-2 hover:underline"
          >
            {HOME_DEVELOPER_TEASER.secondaryCta.label}
          </Link>
        </div>
      </div>
    </section>
  );
}

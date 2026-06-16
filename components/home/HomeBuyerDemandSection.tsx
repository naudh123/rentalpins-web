import Link from "next/link";
import { appPath } from "@/lib/config";
import { HOME_BUYER_DEMAND } from "@/lib/seo/home-page-content";

export default function HomeBuyerDemandSection() {
  return (
    <section className="rp-home-section">
      <div className="rp-home-section-inner">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--sale-gold)]">
            Buyer demand
          </p>
          <h2 className="mt-2 font-serif text-2xl text-[var(--brand-navy)] md:text-3xl">
            {HOME_BUYER_DEMAND.title}
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-[var(--muted)] md:text-base">
            {HOME_BUYER_DEMAND.subtitle}
          </p>
        </div>

        <ul className="mx-auto mt-8 grid max-w-4xl grid-cols-1 gap-3 sm:grid-cols-3">
          {HOME_BUYER_DEMAND.examples.map((example) => (
            <li
              key={example}
              className="rp-home-lux-card rounded-2xl px-4 py-4 text-center text-sm text-[var(--text)]"
            >
              {example}
            </li>
          ))}
        </ul>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href={appPath(HOME_BUYER_DEMAND.primaryCta.href)}
            className="rp-btn rp-btn-primary sale-theme px-6 py-3 text-sm"
          >
            {HOME_BUYER_DEMAND.primaryCta.label}
          </Link>
          <Link
            href={appPath(HOME_BUYER_DEMAND.secondaryCta.href)}
            className="text-sm font-semibold text-[var(--brand-navy)] underline-offset-2 hover:underline"
          >
            {HOME_BUYER_DEMAND.secondaryCta.label}
          </Link>
        </div>
      </div>
    </section>
  );
}

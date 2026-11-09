import Link from "next/link";
import { appPath } from "@/lib/config";
import { HOME_FINAL_CTA } from "@/lib/seo/home-page-content";
import { ArrowIcon } from "@/components/home/HomeIcons";

export default function HomeFinalCta() {
  return (
    <section aria-labelledby="home-final-cta-heading" className="px-4 py-16 sm:px-6 md:py-20">
      <div className="mx-auto max-w-4xl rounded-3xl bg-[linear-gradient(135deg,var(--brand-navy)_0%,var(--brand-navy-dark)_100%)] px-6 py-12 text-center text-white shadow-[0_30px_80px_-40px_rgba(15,37,84,0.8)] sm:px-12">
        <h2 id="home-final-cta-heading" className="font-serif text-[1.75rem] leading-tight sm:text-4xl">
          {HOME_FINAL_CTA.title}
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-base text-white/75">{HOME_FINAL_CTA.subtitle}</p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href={appPath(HOME_FINAL_CTA.primary.href)}
            data-cta="home-final-search"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--brand-orange)] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[var(--brand-orange-hover)]"
          >
            {HOME_FINAL_CTA.primary.label}
            <ArrowIcon />
          </Link>
          <Link
            href={appPath(HOME_FINAL_CTA.secondary.href)}
            data-cta="list-property-free"
            data-cta-location="home-final-cta"
            className="inline-flex items-center justify-center rounded-xl border border-white/30 px-6 py-3 text-sm font-semibold text-white transition hover:border-white"
          >
            {HOME_FINAL_CTA.secondary.label}
          </Link>
        </div>
      </div>
    </section>
  );
}

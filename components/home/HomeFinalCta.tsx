import Link from "next/link";
import { appPath } from "@/lib/config";
import { HOME_FINAL_CTA } from "@/lib/seo/home-page-content";

export default function HomeFinalCta() {
  return (
    <section className="rp-home-navy-band relative overflow-hidden px-4 py-16 text-center text-white md:py-20">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_80%_at_50%_120%,rgba(232,80,26,0.18),transparent)]"
        aria-hidden
      />
      <div className="relative mx-auto max-w-2xl">
        <h2 className="font-serif text-2xl md:text-3xl">{HOME_FINAL_CTA.title}</h2>
        <p className="mx-auto mt-4 text-sm leading-relaxed text-white/75 md:text-base">
          {HOME_FINAL_CTA.subtitle}
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href={appPath("/post")}
            data-cta="list-property-free"
            data-cta-location="home-footer"
            data-intent="general"
            className="rp-btn bg-white px-8 py-3.5 font-semibold text-[var(--brand-navy)] hover:brightness-95"
          >
            List property free
          </Link>
          <Link
            href={appPath("/search")}
            data-cta="browse-rentals-map"
            data-cta-location="home-footer"
            className="rp-btn border border-white/40 px-8 py-3.5 text-white hover:bg-white/10"
          >
            Browse rentals on map
          </Link>
        </div>
      </div>
    </section>
  );
}

import Link from "next/link";
import type { NationalFunnelKind } from "@/lib/seo/national-funnel-cities";
import {
  blogPostHref,
  getNationalFunnelBlogGuides,
  getNationalFunnelCityGuides,
  nationalFunnelBlogSectionIntro,
  nationalFunnelBlogSectionTitle,
} from "@/lib/seo/national-funnel-guides";
import { appPath } from "@/lib/config";

export default function NationalFunnelGuides({ kind }: { kind: NationalFunnelKind }) {
  const cityGuides = getNationalFunnelCityGuides(kind);
  const blogGuides = getNationalFunnelBlogGuides();

  if (!cityGuides.length && !blogGuides.length) return null;

  return (
    <section
      aria-labelledby="national-funnel-guides-heading"
      className="mx-auto max-w-5xl px-4 py-12"
    >
      <h2
        id="national-funnel-guides-heading"
        className="rp-section-title text-2xl text-[var(--brand-navy)]"
      >
        {nationalFunnelBlogSectionTitle(kind)}
      </h2>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[var(--muted)]">
        {nationalFunnelBlogSectionIntro(kind)}
      </p>

      {cityGuides.length > 0 ? (
        <div className="mt-8">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-[var(--brand-orange)]">
            Money-page rental guides
          </h3>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {cityGuides.map((guide) => (
              <li key={guide.seoGuideHref}>
                <Link
                  href={guide.seoGuideHref}
                  className="block rounded-xl border border-[var(--border-subtle)] bg-[var(--surface)] p-4 transition hover:border-[var(--brand-orange)]/30"
                >
                  <span className="font-semibold text-[var(--brand-navy)] hover:text-[var(--brand-orange)]">
                    {guide.placeName} rental guide
                  </span>
                  <span className="mt-1 block text-xs text-[var(--muted)]">
                    Areas, rent bands, FAQs & map search tips
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {blogGuides.length > 0 ? (
        <div className="mt-10">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-[var(--brand-orange)]">
            Blog guides
          </h3>
          <ul className="mt-4 space-y-3">
            {blogGuides.map((post) => (
              <li key={post.slug}>
                <Link
                  href={blogPostHref(post.slug)}
                  className="group block rounded-xl border border-[var(--border-subtle)] bg-[var(--surface)] p-4 transition hover:border-[var(--brand-orange)]/30"
                >
                  <span className="font-semibold text-[var(--brand-navy)] group-hover:text-[var(--brand-orange)] group-hover:underline">
                    {post.title}
                  </span>
                  <p className="mt-1 text-sm leading-relaxed text-[var(--muted)]">
                    {post.excerpt}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-sm">
            <Link
              href={appPath("/blog")}
              className="font-medium text-[var(--brand-orange)] hover:underline"
            >
              Browse all RentalPins guides →
            </Link>
          </p>
        </div>
      ) : null}
    </section>
  );
}

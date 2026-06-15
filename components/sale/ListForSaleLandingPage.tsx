import Link from "next/link";
import BreadcrumbSchema from "@/components/seo/BreadcrumbSchema";
import FAQSchema from "@/components/seo/FAQSchema";
import { canonicalUrl } from "@/lib/seo";
import {
  LIST_FOR_SALE_STEPS,
  listForSaleBrowseHref,
  listForSalePostHref,
  type ListForSalePageConfig,
} from "@/lib/sale/list-for-sale-config";

interface Props {
  config: ListForSalePageConfig;
}

export default function ListForSaleLandingPage({ config }: Props) {
  const pageUrl = canonicalUrl(config.path);
  const listHref = listForSalePostHref(config.citySlug);
  const browseHref = listForSaleBrowseHref(config);

  const breadcrumbs = [
    { name: "Home", url: canonicalUrl("/") },
    { name: "Buy", url: canonicalUrl("/buy") },
    { name: config.h1, url: pageUrl },
  ];

  return (
    <>
      <BreadcrumbSchema items={breadcrumbs} />
      <FAQSchema faqs={config.faq.map((f) => ({ question: f.q, answer: f.a }))} />

      <article className="rp-gradient-hero px-4 py-12">
        <div className="mx-auto max-w-3xl">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--sale-gold)]">
            For property sellers
          </p>
          <h1 className="mt-2 font-serif text-3xl text-[var(--brand-navy)] md:text-4xl">
            {config.h1}
          </h1>
          <p className="mt-4 text-base leading-relaxed text-[var(--muted)]">{config.intro}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href={listHref} className="rp-btn rp-btn-primary px-6 py-2.5">
              List for sale
            </Link>
            <Link href={browseHref} className="rp-btn rp-btn-secondary px-6 py-2.5">
              Browse sale map
            </Link>
          </div>
        </div>
      </article>

      <section className="border-y border-[var(--border-subtle)] bg-[var(--surface)] px-4 py-12">
        <div className="mx-auto max-w-3xl">
          <h2 className="font-serif text-xl text-[var(--brand-navy)]">Supported property types</h2>
          <ul className="mt-4 grid gap-2 sm:grid-cols-2">
            {config.supportedTypes.map((t) => (
              <li key={t} className="rp-card px-4 py-3 text-sm text-[var(--muted)]">
                {t}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="px-4 py-12">
        <div className="mx-auto max-w-3xl">
          <h2 className="font-serif text-xl text-[var(--brand-navy)]">How listing works</h2>
          <ol className="mt-6 space-y-4">
            {LIST_FOR_SALE_STEPS.map((step, i) => (
              <li key={step.title} className="rp-card flex gap-4 p-5">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--sale-gold)] text-sm font-bold text-[var(--brand-navy)]">
                  {i + 1}
                </span>
                <div>
                  <h3 className="font-semibold text-[var(--brand-navy)]">{step.title}</h3>
                  <p className="mt-1 text-sm text-[var(--muted)]">{step.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {config.nearbyLinks.length > 0 && (
        <section className="border-t border-[var(--border-subtle)] bg-[var(--surface)] px-4 py-10">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--muted)]">
              Related
            </h2>
            <ul className="mt-4 flex flex-wrap gap-2">
              {config.nearbyLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="rp-btn rp-btn-secondary px-4 py-2 text-sm">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <section className="border-t border-[var(--border-subtle)] px-4 py-12">
        <div className="mx-auto max-w-3xl">
          <h2 className="font-serif text-xl text-[var(--brand-navy)]">Seller FAQs</h2>
          <dl className="mt-4 space-y-4">
            {config.faq.map((f) => (
              <div key={f.q} className="rp-card p-5">
                <dt className="font-semibold text-[var(--brand-navy)]">{f.q}</dt>
                <dd className="mt-2 text-sm text-[var(--muted)]">{f.a}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>
    </>
  );
}

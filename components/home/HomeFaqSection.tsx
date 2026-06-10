import { HOME_FAQS } from "@/lib/seo/home-page-content";

export default function HomeFaqSection() {
  return (
    <section
      aria-labelledby="home-faq-heading"
      className="border-t border-[var(--border-subtle)] bg-[var(--bg-elevated)]/60 px-4 py-16"
    >
      <div className="mx-auto max-w-3xl">
        <h2 id="home-faq-heading" className="rp-section-title text-center text-xl md:text-2xl">
          Frequently asked questions
        </h2>
        <p className="mt-2 text-center text-sm text-[var(--muted)]">
          Listing, browsing, and cities — answered honestly
        </p>
        <dl className="mt-10 space-y-4">
          {HOME_FAQS.map((faq) => (
            <div key={faq.q} className="rp-home-lux-card rounded-2xl p-5 md:p-6">
              <dt className="font-semibold text-[var(--brand-navy)]">{faq.q}</dt>
              <dd className="mt-2 text-sm leading-relaxed text-[var(--muted)]">{faq.a}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

import type { SeoFaqItem } from "@/lib/seo/seoTypes";

interface Props {
  faqs: SeoFaqItem[];
  heading?: string;
}

export default function FaqBlock({ faqs, heading = "FAQs" }: Props) {
  if (!faqs.length) return null;
  return (
    <section className="mx-auto max-w-3xl px-4 py-12" aria-labelledby="seo-faq-heading">
      <h2 id="seo-faq-heading" className="rp-section-title text-center text-lg">
        {heading}
      </h2>
      <dl className="mt-6 space-y-4">
        {faqs.map((f) => (
          <div key={f.question} className="rp-card p-5">
            <dt className="font-semibold text-[var(--brand-navy)]">{f.question}</dt>
            <dd className="mt-2 text-sm text-[var(--muted)]">{f.answer}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

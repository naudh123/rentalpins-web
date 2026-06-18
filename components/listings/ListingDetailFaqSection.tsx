import FAQSchema from "@/components/seo/FAQSchema";
import type { SeoFaq } from "@/lib/seo/listing-faqs";

interface Props {
  faqs: SeoFaq[];
}

/** Crawlable FAQ section for listing detail pages — visible HTML + FAQPage schema. */
export default function ListingDetailFaqSection({ faqs }: Props) {
  if (!faqs.length) return null;

  return (
    <section
      id="listing-faq"
      className="rp-card mt-6 scroll-mt-24 p-5"
      aria-labelledby="listing-faq-heading"
    >
      <FAQSchema faqs={faqs} />
      <h2 id="listing-faq-heading" className="font-serif text-xl">
        Frequently asked questions
      </h2>
      <dl className="mt-4 space-y-4">
        {faqs.map((faq) => (
          <div key={faq.question}>
            <dt className="font-semibold text-[var(--brand-navy)]">{faq.question}</dt>
            <dd className="mt-1 text-sm leading-relaxed text-[var(--muted)]">{faq.answer}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

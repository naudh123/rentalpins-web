import type { RentalAreaFaq } from "@/lib/rental-area-config";

interface Props {
  faqs: RentalAreaFaq[];
}

export default function IndiaRentalFAQ({ faqs }: Props) {
  return (
    <section
      aria-labelledby="india-rental-faq-heading"
      className="mx-auto max-w-3xl px-4 py-12"
    >
      <h2
        id="india-rental-faq-heading"
        className="font-serif text-2xl text-[var(--brand-navy)]"
      >
        Frequently asked questions
      </h2>
      <dl className="mt-6 space-y-5">
        {faqs.map((faq) => (
          <div
            key={faq.q}
            className="rounded-xl border border-[var(--border)] bg-white p-5 shadow-sm"
          >
            <dt className="font-semibold text-[var(--brand-navy)]">{faq.q}</dt>
            <dd className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
              {faq.a}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

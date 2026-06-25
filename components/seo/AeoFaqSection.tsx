import type { AeoFaqItem } from "@/lib/seo/aeo-types";
import { flattenAeoFaqAnswer } from "@/lib/seo/aeo-faq";

interface Props {
  faqs: AeoFaqItem[];
  heading?: string;
  className?: string;
}

/** Answer-first FAQ — direct 40–60 word block, then optional explanation. */
export default function AeoFaqSection({
  faqs,
  heading = "Frequently asked questions",
  className = "",
}: Props) {
  if (!faqs.length) return null;

  return (
    <section className={className} aria-labelledby="aeo-faq-heading">
      <h2 id="aeo-faq-heading" className="font-serif text-xl text-[var(--brand-navy)] md:text-2xl">
        {heading}
      </h2>
      <dl className="mt-4 space-y-5">
        {faqs.map((faq) => (
          <div
            key={faq.question}
            className="rounded-xl border border-[var(--border)] bg-white p-5"
          >
            <dt className="font-semibold text-[var(--brand-navy)]">{faq.question}</dt>
            <dd className="mt-2 space-y-2 text-sm leading-relaxed text-[var(--muted)]">
              <p className="text-[var(--brand-navy)]">{faq.directAnswer}</p>
              {faq.explanation ? <p>{faq.explanation}</p> : null}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

/** Plain-text answers for FAQ schema (must match visible content). */
export function aeoFaqsForSchema(faqs: AeoFaqItem[]): { question: string; answer: string }[] {
  return faqs.map((faq) => ({
    question: faq.question,
    answer: flattenAeoFaqAnswer(faq),
  }));
}

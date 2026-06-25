import type { AeoFaqItem } from "@/lib/seo/aeo-types";

/** Flatten AEO FAQ into schema-safe plain text (must match visible content). */
export function flattenAeoFaqAnswer(faq: AeoFaqItem): string {
  const direct = faq.directAnswer.trim();
  const extra = faq.explanation?.trim();
  return extra ? `${direct} ${extra}` : direct;
}

/** Convert AEO FAQs to FAQPage schema input — answers match visible text. */
export function aeoFaqsToSchema(
  faqs: AeoFaqItem[]
): { question: string; answer: string }[] {
  return faqs.map((faq) => ({
    question: faq.question,
    answer: flattenAeoFaqAnswer(faq),
  }));
}

/** Legacy `{ q, a }` or `{ question, answer }` → AEO shape (whole answer as direct). */
export function toAeoFaq(
  faq: { q?: string; a?: string; question?: string; answer?: string }
): AeoFaqItem {
  const question = faq.question ?? faq.q ?? "";
  const answer = faq.answer ?? faq.a ?? "";
  return { question, directAnswer: answer };
}

export function toAeoFaqs(
  faqs: { q?: string; a?: string; question?: string; answer?: string }[]
): AeoFaqItem[] {
  return faqs.map(toAeoFaq);
}

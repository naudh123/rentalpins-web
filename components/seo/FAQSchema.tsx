import { JsonLdFAQ } from "@/components/JsonLd";
import { aeoFaqsToSchema } from "@/lib/seo/aeo-faq";
import type { AeoFaqItem } from "@/lib/seo/aeo-types";

export { JsonLdFAQ as FAQSchema };

type FaqInput =
  | { question: string; answer: string }
  | AeoFaqItem
  | { q: string; a: string };

function normalizeFaqs(faqs: FaqInput[]): { question: string; answer: string }[] {
  if (!faqs.length) return [];
  const first = faqs[0]!;
  if ("directAnswer" in first) {
    return aeoFaqsToSchema(faqs as AeoFaqItem[]);
  }
  if ("q" in first) {
    return (faqs as { q: string; a: string }[]).map((f) => ({
      question: f.q,
      answer: f.a,
    }));
  }
  return faqs as { question: string; answer: string }[];
}

export default function FAQSchema({ faqs }: { faqs: FaqInput[] }) {
  return <JsonLdFAQ faqs={normalizeFaqs(faqs)} />;
}

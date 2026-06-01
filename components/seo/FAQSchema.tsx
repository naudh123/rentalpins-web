import { JsonLdFAQ } from "@/components/JsonLd";

export { JsonLdFAQ as FAQSchema };

export default function FAQSchema({
  faqs,
}: {
  faqs: { question: string; answer: string }[];
}) {
  return <JsonLdFAQ faqs={faqs} />;
}

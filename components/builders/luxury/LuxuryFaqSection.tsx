"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LuxurySectionHeader } from "@/components/builders/luxury/LuxuryUI";

interface FaqItem {
  question: string;
  answer?: string;
  directAnswer?: string;
  explanation?: string;
}

export default function LuxuryFaqSection({
  faqs,
  className = "",
}: {
  faqs: FaqItem[];
  className?: string;
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  if (!faqs.length) return null;

  const items = faqs.map((faq) => ({
    question: faq.question,
    answer: [faq.directAnswer ?? faq.answer ?? "", faq.explanation]
      .filter(Boolean)
      .join(" "),
  }));

  return (
    <section className={`lux-faq-section ${className}`} aria-labelledby="lux-faq-heading">
      <LuxurySectionHeader
        eyebrow="Concierge Knowledge"
        title="Frequently Asked Questions"
        description="Everything discerning buyers ask before booking a private site visit."
        align="center"
      />
      <ul className="mt-10 mx-auto max-w-3xl space-y-3">
        {items.map((faq, i) => {
          const isOpen = openIndex === i;
          return (
            <li key={faq.question} className="lux-faq-item">
              <button
                type="button"
                id={`lux-faq-heading-${i}`}
                aria-expanded={isOpen}
                aria-controls={`lux-faq-panel-${i}`}
                onClick={() => setOpenIndex(isOpen ? null : i)}
                className="lux-faq-question"
              >
                <span>{faq.question}</span>
                <span className={`lux-faq-chevron ${isOpen ? "is-open" : ""}`} aria-hidden>
                  +
                </span>
              </button>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    id={`lux-faq-panel-${i}`}
                    role="region"
                    aria-labelledby={`lux-faq-heading-${i}`}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                    className="overflow-hidden"
                  >
                    <p className="lux-faq-answer">{faq.answer}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

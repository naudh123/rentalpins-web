"use client";

import { memo } from "react";
import { BLOG_LIMITS } from "@/lib/blog-config";
import type { BlogFaqItem } from "@/lib/blog-types";

const fieldClass = "rp-input mt-1 text-sm";

const BlogFaqEditor = memo(function BlogFaqEditor({
  faqs,
  onChange,
}: {
  faqs: BlogFaqItem[];
  onChange: (faqs: BlogFaqItem[]) => void;
}) {
  function updateItem(index: number, patch: Partial<BlogFaqItem>) {
    onChange(
      faqs.map((item, i) => (i === index ? { ...item, ...patch } : item))
    );
  }

  function addItem() {
    if (faqs.length >= BLOG_LIMITS.faqsMax) return;
    onChange([...faqs, { q: "", a: "" }]);
  }

  function removeItem(index: number) {
    onChange(faqs.filter((_, i) => i !== index));
  }

  return (
    <fieldset className="rounded-xl border border-slate-200 p-4">
      <legend className="px-1 text-sm font-semibold text-slate-700">
        FAQs (manual, 5–8 recommended)
      </legend>
      <p className="mt-1 text-xs text-slate-500">
        Add real renter questions and answers. These appear on the post and in FAQ
        rich results when you publish 5–8 items.
      </p>

      <div className="mt-4 space-y-4">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="rounded-xl border border-slate-200 bg-slate-50/70 p-4"
          >
            <div className="mb-3 flex items-center justify-between gap-3">
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                FAQ {index + 1}
              </span>
              <button
                type="button"
                onClick={() => removeItem(index)}
                className="text-xs font-semibold text-red-600 hover:underline"
              >
                Remove
              </button>
            </div>
            <label className="block">
              <span className="text-sm font-semibold text-slate-700">Question</span>
              <input
                value={faq.q}
                onChange={(e) => updateItem(index, { q: e.target.value })}
                className={fieldClass}
                maxLength={BLOG_LIMITS.faqQuestionMax}
                autoComplete="off"
              />
            </label>
            <label className="mt-3 block">
              <span className="text-sm font-semibold text-slate-700">Answer</span>
              <textarea
                value={faq.a}
                onChange={(e) => updateItem(index, { a: e.target.value })}
                rows={3}
                className={`${fieldClass} min-h-[5rem] resize-y leading-relaxed`}
                maxLength={BLOG_LIMITS.faqAnswerMax}
                autoComplete="off"
              />
            </label>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={addItem}
        disabled={faqs.length >= BLOG_LIMITS.faqsMax}
        className="mt-4 text-sm font-semibold text-[#E8501A] hover:underline disabled:cursor-not-allowed disabled:text-slate-400"
      >
        Add FAQ
      </button>
    </fieldset>
  );
});

export default BlogFaqEditor;

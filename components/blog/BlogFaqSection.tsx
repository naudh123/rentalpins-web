import type { BlogFaqItem } from "@/lib/blog-types";

export default function BlogFaqSection({ faqs }: { faqs: BlogFaqItem[] }) {
  const visible = faqs.filter((faq) => faq.q.trim() && faq.a.trim());
  if (visible.length === 0) return null;

  return (
    <section
      aria-labelledby="blog-faq-heading"
      className="mt-16 border-t border-slate-200 pt-12"
    >
      <h2
        id="blog-faq-heading"
        className="font-serif text-2xl font-bold text-[#1E3A6E]"
      >
        Frequently asked questions
      </h2>
      <div className="mt-6 divide-y divide-slate-200 rounded-2xl border border-slate-200 bg-white">
        {visible.map((faq) => (
          <details key={faq.q} className="group px-5 py-4 sm:px-6">
            <summary className="cursor-pointer list-none font-medium text-slate-900 marker:content-none [&::-webkit-details-marker]:hidden">
              <span className="flex items-start justify-between gap-4">
                <span>{faq.q}</span>
                <span className="text-[#E8501A] transition group-open:rotate-45">+</span>
              </span>
            </summary>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">{faq.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

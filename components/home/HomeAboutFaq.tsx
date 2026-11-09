import { HOME_ABOUT, HOME_FAQS } from "@/lib/seo/home-page-content";

/**
 * Indexable intro + FAQ. Uses native <details> so answers stay in the HTML
 * (crawlable, matches FAQPage JSON-LD) and toggle without client JS.
 */
export default function HomeAboutFaq() {
  return (
    <section
      aria-labelledby="home-about-heading"
      className="border-t border-[var(--border-subtle)] bg-[var(--bg-elevated)] px-4 py-16 sm:px-6 md:py-20"
    >
      <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[0.85fr_1.15fr]">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--brand-orange)]">
            RentalPins
          </p>
          <h2
            id="home-about-heading"
            className="mt-3 font-serif text-[1.75rem] leading-tight text-[var(--brand-navy)] sm:text-4xl"
          >
            {HOME_ABOUT.title}
          </h2>
          {HOME_ABOUT.paragraphs.map((p) => (
            <p key={p.slice(0, 32)} className="mt-4 text-base leading-relaxed text-[var(--muted)]">
              {p}
            </p>
          ))}
        </div>

        <div>
          <h2
            id="home-faq-heading"
            className="font-serif text-2xl text-[var(--brand-navy)] sm:text-3xl"
          >
            Frequently asked questions
          </h2>
          <div className="mt-6 divide-y divide-[var(--border)] overflow-hidden rounded-2xl border border-[var(--border)] bg-white">
            {HOME_FAQS.map((faq, i) => (
              <details key={faq.q} className="group" open={i === 0}>
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-left font-semibold text-[var(--brand-navy)] marker:hidden hover:bg-[var(--surface-hover)] [&::-webkit-details-marker]:hidden">
                  <h3 className="text-[15px]">{faq.q}</h3>
                  <span
                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[var(--border)] text-lg leading-none text-[var(--muted)] transition group-open:rotate-45"
                    aria-hidden
                  >
                    +
                  </span>
                </summary>
                <p className="px-5 pb-5 text-sm leading-relaxed text-[var(--muted)]">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

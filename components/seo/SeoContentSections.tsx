import type { SeoContentSection } from "@/lib/seo/content-templates";

export default function SeoContentSections({ sections }: { sections: SeoContentSection[] }) {
  return (
    <div className="prose-seo mx-auto max-w-3xl space-y-10 px-4 py-10">
      {sections.map((section) => (
        <section key={section.id} id={section.id} className="scroll-mt-24">
          <h2 className="font-serif text-xl text-[var(--brand-navy)] md:text-2xl">
            {section.title}
          </h2>
          {section.paragraphs.map((p, i) => (
            <p key={i} className="mt-3 text-sm leading-relaxed text-[var(--muted)] md:text-base">
              {p}
            </p>
          ))}
          {section.bullets && section.bullets.length > 0 && (
            <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-[var(--muted)]">
              {section.bullets.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
          )}
        </section>
      ))}
    </div>
  );
}

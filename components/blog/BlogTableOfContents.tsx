import type { BlogTocEntry } from "@/lib/blog-toc";

export default function BlogTableOfContents({ entries }: { entries: BlogTocEntry[] }) {
  if (entries.length < 2) return null;

  return (
    <nav
      aria-label="Table of contents"
      className="mt-8 rounded-2xl border border-slate-200 bg-slate-50/80 p-5 sm:p-6"
    >
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        On this page
      </p>
      <ol className="mt-3 space-y-2 text-sm">
        {entries.map((entry) => (
          <li
            key={entry.id}
            className={entry.level === 3 ? "ml-4 list-none" : "list-none"}
          >
            <a
              href={`#${entry.id}`}
              className="text-slate-700 underline decoration-slate-300 underline-offset-2 transition hover:text-[#E8501A] hover:decoration-[#E8501A]"
            >
              {entry.text}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}

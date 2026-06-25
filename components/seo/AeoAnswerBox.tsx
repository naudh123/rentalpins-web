import Link from "next/link";
import { appPath } from "@/lib/config";

interface Props {
  summary: string;
  heading?: string;
  className?: string;
}

/** AEO answer-first summary box — direct page answer for snippets and AI overviews. */
export default function AeoAnswerBox({
  summary,
  heading = "Quick answer",
  className = "",
}: Props) {
  return (
    <aside
      className={`rounded-xl border border-[var(--brand-orange)]/25 bg-[var(--brand-orange)]/5 p-5 md:p-6 ${className}`}
      aria-label={heading}
    >
      <p className="text-xs font-semibold uppercase tracking-wide text-[var(--brand-orange)]">
        {heading}
      </p>
      <p className="mt-2 text-base leading-relaxed text-[var(--brand-navy)]">{summary}</p>
    </aside>
  );
}

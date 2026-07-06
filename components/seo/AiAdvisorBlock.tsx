import Link from "next/link";
import { appPath } from "@/lib/config";

const DEFAULT_QUESTIONS = [
  "What is the average rent here?",
  "Is this area good for students?",
  "Which nearby areas are cheaper?",
  "Is food included in PG rent?",
  "Is this area safe for girls?",
  "How far is this from the university?",
  "Should I choose PG or flat?",
];

interface Props {
  areaName: string;
  questions?: string[];
}

export default function AiAdvisorBlock({ areaName, questions = DEFAULT_QUESTIONS }: Props) {
  const advisorHref = `/advisor?place=${encodeURIComponent(areaName)}`;
  return (
    <section className="mx-auto max-w-3xl px-4 py-10" aria-labelledby="ai-advisor-heading">
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[var(--shadow-card)] sm:p-8">
        <h2 id="ai-advisor-heading" className="text-center font-serif text-xl text-[var(--brand-navy)] md:text-2xl">
          Ask RentalPins AI about {areaName}
        </h2>
        <p className="mt-3 text-center text-sm text-[var(--muted)]">
          Get quick answers on rent, safety, commute and PG vs flat — then shortlist on the map.
        </p>
        <ul className="mt-6 flex flex-wrap justify-center gap-2" role="list">
          {questions.slice(0, 7).map((q) => (
            <li key={q}>
              <Link
                href={appPath(`${advisorHref}&q=${encodeURIComponent(q)}`)}
                className="inline-block rounded-full border border-[var(--border)] bg-[var(--bg-elevated)] px-3 py-2 text-xs font-medium text-[var(--brand-navy)] hover:border-[var(--brand-orange)]"
              >
                {q}
              </Link>
            </li>
          ))}
        </ul>
        <div className="mt-6 text-center">
          <Link href={appPath(advisorHref)} className="rp-btn rp-btn-primary px-6 py-2.5">
            Open AI rental advisor
          </Link>
        </div>
      </div>
    </section>
  );
}

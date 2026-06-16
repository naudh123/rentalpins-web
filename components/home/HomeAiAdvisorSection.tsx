import Link from "next/link";
import { appPath } from "@/lib/config";
import { HOME_AI_ADVISOR } from "@/lib/seo/home-page-content";

export default function HomeAiAdvisorSection() {
  return (
    <section className="rp-home-section">
      <div className="rp-home-section-inner">
        <div className="mx-auto max-w-3xl rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[var(--shadow-card)] sm:p-8">
          <h2 className="text-center font-serif text-2xl text-[var(--brand-navy)] md:text-3xl">
            {HOME_AI_ADVISOR.title}
          </h2>
          <p className="mt-3 text-center text-sm leading-relaxed text-[var(--muted)] md:text-base">
            {HOME_AI_ADVISOR.subtitle}
          </p>

          <div
            className="mt-6 flex flex-wrap justify-center gap-2"
            role="group"
            aria-label="Property purpose"
          >
            {HOME_AI_ADVISOR.modes.map((mode) => (
              <span
                key={mode}
                className="rounded-full border border-[var(--border)] bg-[var(--bg-elevated)] px-4 py-2 text-xs font-semibold text-[var(--brand-navy)]"
              >
                {mode}
              </span>
            ))}
          </div>

          <div className="mt-6 text-center">
            <Link href={appPath(HOME_AI_ADVISOR.cta.href)} className="rp-btn rp-btn-primary px-6 py-3">
              {HOME_AI_ADVISOR.cta.label}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

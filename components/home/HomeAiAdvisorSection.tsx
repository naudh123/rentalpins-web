"use client";

import { useState } from "react";
import Link from "next/link";
import { appPath } from "@/lib/config";
import { HOME_AI_ADVISOR, type HomeAdvisorMode } from "@/lib/seo/home-page-content";

const MODES = HOME_AI_ADVISOR.modes;

const CTA_CLASS: Record<HomeAdvisorMode, string> = {
  Rent: "rp-btn rp-btn-primary",
  Buy: "rp-btn rp-btn-primary sale-theme",
  Invest:
    "inline-flex rounded-full bg-[var(--invest-emerald)] px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:brightness-105",
  Commercial:
    "inline-flex rounded-full border border-[var(--brand-navy)] bg-[var(--brand-navy)] px-6 py-3 text-sm font-semibold text-white transition hover:opacity-95",
};

const PILL_CLASS: Record<HomeAdvisorMode, string> = {
  Rent: "rp-home-lane-tab rp-home-lane-tab--rent",
  Buy: "rp-home-lane-tab rp-home-lane-tab--buy",
  Invest: "rp-home-lane-tab rp-home-lane-tab--invest",
  Commercial: "rp-home-lane-tab",
};

export default function HomeAiAdvisorSection() {
  const [mode, setMode] = useState<HomeAdvisorMode>("Rent");
  const modeConfig = HOME_AI_ADVISOR.modeLinks[mode];

  return (
    <section className="rp-home-section">
      <div className="rp-home-section-inner">
        <div
          className={`mx-auto max-w-3xl rounded-2xl border p-6 shadow-[var(--shadow-card)] sm:p-8 rp-home-advisor-card rp-home-advisor-card--${mode.toLowerCase()}`}
        >
          <p className="text-center text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--muted)]">
            AI property advisor
          </p>
          <h2 className="mt-2 text-center font-serif text-2xl text-[var(--brand-navy)] md:text-3xl">
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
            {MODES.map((item) => {
              const active = mode === item;
              return (
                <button
                  key={item}
                  type="button"
                  onClick={() => setMode(item)}
                  className={`${PILL_CLASS[item]}${active ? " is-active" : ""}`}
                >
                  {item}
                </button>
              );
            })}
          </div>

          <p className="mt-4 text-center text-xs text-[var(--muted)]">{modeConfig.hint}</p>

          <div className="mt-6 text-center">
            <Link href={appPath(modeConfig.href)} className={CTA_CLASS[mode]}>
              {modeConfig.label}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

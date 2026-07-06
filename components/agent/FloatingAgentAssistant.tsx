"use client";

import { useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import PropertyAgentChat from "@/components/agent/PropertyAgentChat";
import { appPath } from "@/lib/config";
import {
  resolveFloatingAgentContext,
  shouldShowFloatingAgent,
} from "@/lib/agent/floating-agent-context";

interface Props {
  agentEnabled?: boolean;
}

function AiSparkleIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M12 2.5l1.2 4.2 4.2 1.2-4.2 1.2L12 13.3l-1.2-4.2-4.2-1.2 4.2-1.2L12 2.5Z"
        fill="currentColor"
      />
      <path
        d="M18.5 14l.8 2.8 2.8.8-2.8.8-.8 2.8-.8-2.8-2.8-.8.8-2.8Z"
        fill="currentColor"
        opacity="0.85"
      />
    </svg>
  );
}

function askAiLaneStyles(transactionType: "rent" | "sale") {
  if (transactionType === "sale") {
    return {
      fabBg: "bg-[var(--brand-amber)]",
      fabText: "text-[var(--brand-navy)]",
      fabShadow:
        "shadow-[0_8px_28px_rgba(251,179,22,0.35)] group-hover:shadow-[0_12px_32px_rgba(251,179,22,0.42)]",
      headerGradient:
        "bg-[linear-gradient(135deg,color-mix(in_srgb,var(--brand-amber)_14%,white),white)]",
      iconBg: "bg-[var(--brand-amber)] text-[var(--brand-navy)]",
    };
  }
  return {
    fabBg: "bg-[var(--brand-orange)]",
    fabText: "text-white",
    fabShadow:
      "shadow-[0_8px_28px_rgba(232,80,26,0.35)] group-hover:shadow-[0_12px_32px_rgba(232,80,26,0.42)]",
    headerGradient:
      "bg-[linear-gradient(135deg,color-mix(in_srgb,var(--brand-orange)_14%,white),white)]",
    iconBg: "bg-[var(--brand-orange)] text-white",
  };
}

export default function FloatingAgentAssistant({ agentEnabled = true }: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const visible = shouldShowFloatingAgent(pathname);
  const ctx = useMemo(() => resolveFloatingAgentContext(pathname), [pathname]);
  const onMap = ctx.placement === "map";
  const lane = askAiLaneStyles(ctx.transactionType);

  if (!visible) return null;

  const dockClass = onMap
    ? "bottom-[max(10.5rem,env(safe-area-inset-bottom))] md:bottom-6"
    : "bottom-0 pb-[max(1rem,env(safe-area-inset-bottom))] md:pb-6";

  const padClass = onMap ? "p-4 sm:p-5 md:pr-14" : "p-4 sm:p-5";

  return (
    <div
      className={`pointer-events-none fixed inset-x-0 z-[70] flex justify-end ${padClass} ${dockClass}`}
      aria-live="polite"
    >
      {open ? (
        <div
          className="pointer-events-auto flex w-full max-w-md flex-col overflow-hidden rounded-2xl border border-[var(--border)] bg-white shadow-2xl ring-1 ring-black/5"
          role="dialog"
          aria-modal="true"
          aria-labelledby="floating-agent-title"
        >
          <header
            className={`flex items-start justify-between gap-3 border-b border-[var(--border)] px-4 py-3 ${lane.headerGradient}`}
          >
            <div className="min-w-0">
              <p
                id="floating-agent-title"
                className="flex items-center gap-2 text-sm font-bold text-[var(--brand-navy)]"
              >
                <span
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${lane.iconBg}`}
                  aria-hidden
                >
                  <AiSparkleIcon />
                </span>
                Ask AI
              </p>
              <p className="mt-0.5 truncate text-xs text-[var(--muted)]">{ctx.subtitle}</p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="shrink-0 rounded-lg px-2 py-1 text-xs font-medium text-[var(--muted)] hover:bg-white hover:text-[var(--brand-navy)]"
              aria-label="Close Ask AI"
            >
              Close
            </button>
          </header>

          <div className="max-h-[min(70vh,560px)] overflow-y-auto p-4">
            <PropertyAgentChat
              surface={ctx.surface}
              transactionType={ctx.transactionType}
              citySlug={ctx.citySlug}
              projectSlug={ctx.projectSlug}
              projectName={ctx.projectName}
              agentEnabled={agentEnabled}
              compact
              className="min-h-[280px]"
              onApplyMapPath={
                ctx.surface === "map"
                  ? (path) => {
                      router.push(appPath(path));
                      setOpen(false);
                    }
                  : undefined
              }
            />
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="pointer-events-auto group flex flex-col items-center gap-1.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--brand-navy)]"
          aria-label="Open Ask AI"
          title="Ask AI"
        >
          <span
            className={`flex h-14 w-14 items-center justify-center rounded-full transition group-hover:scale-[1.04] ${lane.fabBg} ${lane.fabText} ${lane.fabShadow}`}
          >
            <AiSparkleIcon />
          </span>
          <span className="rounded-full bg-white/95 px-2.5 py-0.5 text-xs font-semibold text-[var(--brand-navy)] shadow-sm ring-1 ring-black/5">
            Ask AI
          </span>
        </button>
      )}
    </div>
  );
}

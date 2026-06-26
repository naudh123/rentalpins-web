"use client";

import { useState } from "react";
import PropertyAgentChat from "./PropertyAgentChat";

interface Props {
  transactionType?: "rent" | "sale";
  onApplyMapPath?: (path: string) => void;
}

/** Collapsible map copilot — Phase A3. */
export default function MapAgentCopilot({ transactionType = "rent", onApplyMapPath }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <div className="pointer-events-auto w-full max-w-xl">
      {!open ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="flex w-full items-center justify-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface)] px-4 py-2 text-sm font-medium text-[var(--brand-navy)] shadow-sm hover:border-[var(--accent)]"
        >
          <span aria-hidden>✦</span>
          Chat with property AI
        </button>
      ) : (
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-3 shadow-lg">
          <div className="mb-2 flex items-center justify-between gap-2">
            <p className="text-xs font-bold uppercase tracking-widest text-[var(--muted)]">
              Map copilot
            </p>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="text-xs text-[var(--muted)] hover:text-[var(--brand-navy)]"
            >
              Close
            </button>
          </div>
          <PropertyAgentChat
            surface="map"
            transactionType={transactionType}
            compact
            onApplyMapPath={(path) => {
              onApplyMapPath?.(path);
              setOpen(false);
            }}
          />
        </div>
      )}
    </div>
  );
}

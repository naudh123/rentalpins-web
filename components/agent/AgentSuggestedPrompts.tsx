"use client";

import type { AgentSurface } from "@/lib/agent/types";
import { suggestedPromptsForSurface } from "@/lib/agent/prompts";

interface Props {
  surface: AgentSurface;
  transactionType?: "rent" | "sale";
  onSelect: (prompt: string) => void;
  disabled?: boolean;
  className?: string;
}

export default function AgentSuggestedPrompts({
  surface,
  transactionType = "rent",
  onSelect,
  disabled,
  className = "",
}: Props) {
  const prompts = suggestedPromptsForSurface(surface, transactionType);

  return (
    <div className={`space-y-2 ${className}`}>
      <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--muted)]">
        Try asking
      </p>
      <div className="flex flex-wrap gap-2">
        {prompts.map((prompt) => (
          <button
            key={prompt}
            type="button"
            disabled={disabled}
            onClick={() => onSelect(prompt)}
            className="rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 py-1.5 text-left text-xs text-[var(--brand-navy)] hover:border-[var(--accent)] disabled:opacity-50"
          >
            {prompt}
          </button>
        ))}
      </div>
    </div>
  );
}

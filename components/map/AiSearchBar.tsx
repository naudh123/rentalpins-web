"use client";

import { useState } from "react";
import { mapAiSearchError } from "@/lib/ai-search";

interface Props {
  onSearch: (query: string) => Promise<void> | void;
  disabled?: boolean;
  variant?: "rent" | "sale";
}

const PLACEHOLDERS = {
  rent: "Ask in plain English — e.g. 2BHK furnished under 20k near Sector 22",
  sale: "Ask in plain English — e.g. 3BHK flat under 80 lakh in Phase 7 Mohali",
} as const;

/**
 * Natural-language search bar. Submits the raw text to the parent, which calls
 * the `parseSearchQuery` Cloud Function and applies the resulting filters +
 * map location.
 */
export default function AiSearchBar({
  onSearch,
  disabled,
  variant = "rent",
}: Props) {
  const [value, setValue] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function submit() {
    const q = value.trim();
    if (!q || busy || disabled) return;
    setBusy(true);
    setError("");
    try {
      await onSearch(q);
    } catch (err) {
      setError(mapAiSearchError(err));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="pointer-events-auto flex w-full max-w-xl flex-col items-center gap-1">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          void submit();
        }}
        className="flex w-full items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 py-1.5 shadow-sm"
      >
        <span aria-hidden className="text-sm text-[var(--accent)]">
          ✦
        </span>
        <input
          type="text"
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            if (error) setError("");
          }}
          placeholder={PLACEHOLDERS[variant]}
          className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-[var(--muted)]"
          disabled={disabled || busy}
          aria-label={variant === "sale" ? "Search property for sale in plain English" : "Search in plain English"}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? "ai-search-error" : undefined}
        />
        <button
          type="submit"
          disabled={disabled || busy || !value.trim()}
          className="rp-btn rp-btn-primary min-h-8 shrink-0 rounded-full px-3 py-1.5 text-xs disabled:opacity-60"
        >
          {busy ? "Thinking…" : "Search"}
        </button>
      </form>
      {error ? (
        <p
          id="ai-search-error"
          role="alert"
          className="w-full rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs text-red-800"
        >
          {error}
        </p>
      ) : null}
    </div>
  );
}

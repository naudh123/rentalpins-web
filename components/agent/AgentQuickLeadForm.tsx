"use client";

import { useState } from "react";
import { appPath } from "@/lib/config";

interface Props {
  sessionId: string;
  projectId?: string;
  citySlug?: string;
  projectSlug?: string;
  projectName?: string;
  defaultBudget?: string;
  className?: string;
}

export default function AgentQuickLeadForm({
  sessionId,
  projectId,
  citySlug,
  projectSlug,
  projectName,
  defaultBudget = "",
  className = "",
}: Props) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [budget, setBudget] = useState(defaultBudget);
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !budget.trim()) return;
    setStatus("loading");
    setMessage("");
    try {
      const res = await fetch(appPath("/api/agent/capture-lead"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId,
          name: name.trim(),
          phone: phone.trim(),
          email: email.trim() || undefined,
          budgetRange: budget.trim(),
          projectId,
          citySlug,
          projectSlug,
          projectName,
          interestedProjectName: projectName,
        }),
      });
      const data = (await res.json()) as { success?: boolean; message?: string; error?: string };
      if (data.success) {
        setStatus("done");
        setMessage(data.message ?? "Details saved — our team will call you soon.");
      } else {
        setStatus("error");
        setMessage(data.error ?? "Could not save. Try again or call +91 9915061640.");
      }
    } catch {
      setStatus("error");
      setMessage("Network error. Call +91 9915061640.");
    }
  }

  if (status === "done") {
    return (
      <div
        className={`rounded-xl border border-green-200 bg-green-50 px-3 py-3 text-sm text-green-900 ${className}`}
      >
        <p className="font-semibold">Enquiry registered</p>
        <p className="mt-1">{message}</p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={`rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] p-3 ${className}`}
    >
      <p className="text-xs font-bold uppercase tracking-wide text-[var(--brand-navy)]">
        Register for callback
      </p>
      <p className="mt-1 text-[11px] text-[var(--muted)]">
        Name, mobile & budget — saved directly to our sales team (9915061640).
      </p>
      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        <input
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name"
          className="rounded-lg border border-[var(--border)] bg-white px-3 py-2 text-sm"
        />
        <input
          type="tel"
          required
          inputMode="numeric"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Mobile (10 digits)"
          className="rounded-lg border border-[var(--border)] bg-white px-3 py-2 text-sm"
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email (optional)"
          className="rounded-lg border border-[var(--border)] bg-white px-3 py-2 text-sm"
        />
        <input
          type="text"
          required
          value={budget}
          onChange={(e) => setBudget(e.target.value)}
          placeholder="Budget e.g. ₹90 lakh"
          className="rounded-lg border border-[var(--border)] bg-white px-3 py-2 text-sm"
        />
      </div>
      {message && status === "error" && (
        <p className="mt-2 text-xs text-red-700">{message}</p>
      )}
      <button
        type="submit"
        disabled={status === "loading"}
        className="mt-3 w-full rounded-lg bg-[var(--brand-navy)] px-3 py-2 text-sm font-semibold text-white disabled:opacity-60"
      >
        {status === "loading" ? "Saving…" : "Save & get callback"}
      </button>
    </form>
  );
}

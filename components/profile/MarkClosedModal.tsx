"use client";

import { useState } from "react";
import type { TransactionType } from "@/lib/transaction-type";
import { markClosedLabel } from "@/lib/owner-listing-lifecycle";

interface Props {
  open: boolean;
  transactionType: TransactionType;
  onClose: () => void;
  onConfirm: (leaseEndAtMs?: number) => Promise<void>;
}

export default function MarkClosedModal({
  open,
  transactionType,
  onClose,
  onConfirm,
}: Props) {
  const [leaseEnd, setLeaseEnd] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  if (!open) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      let leaseEndAtMs: number | undefined;
      if (leaseEnd.trim()) {
        const parsed = new Date(leaseEnd).getTime();
        if (!Number.isFinite(parsed)) {
          setError("Enter a valid date");
          setBusy(false);
          return;
        }
        leaseEndAtMs = parsed;
      }
      await onConfirm(leaseEndAtMs);
      onClose();
      setLeaseEnd("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save");
    } finally {
      setBusy(false);
    }
  }

  const label = markClosedLabel(transactionType);
  const isSale = transactionType === "sale";

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-4 sm:items-center"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <form
        className="rp-card w-full max-w-md p-5 shadow-xl"
        onClick={(e) => e.stopPropagation()}
        onSubmit={(e) => void handleSubmit(e)}
      >
        <h2 className="font-serif text-xl text-[var(--brand-navy)]">{label}?</h2>
        <p className="mt-2 text-sm text-[var(--muted)]">
          {isSale
            ? "This removes the listing from the map and saves it under your properties. Re-list anytime."
            : "This removes the listing from the map and saves it under your properties. Re-list when vacant."}
        </p>

        {!isSale && (
          <div className="mt-4">
            <label className="rp-label">Lease end date (optional)</label>
            <p className="mb-2 text-xs text-[var(--muted)]">
              We&apos;ll remind you when it&apos;s time to re-list.
            </p>
            <input
              type="date"
              value={leaseEnd}
              onChange={(e) => setLeaseEnd(e.target.value)}
              className="rp-input w-full"
              min={new Date().toISOString().slice(0, 10)}
            />
          </div>
        )}

        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

        <div className="mt-5 flex flex-wrap gap-2">
          <button
            type="submit"
            disabled={busy}
            className="rp-btn rp-btn-primary flex-1 py-2.5 disabled:opacity-50"
          >
            {busy ? "Saving…" : label}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="rp-btn rp-btn-secondary flex-1 py-2.5"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

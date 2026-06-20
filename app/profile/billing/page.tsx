"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/AuthProvider";
import { getClientDb } from "@/lib/firebase-client";
import { fetchOwnerPayments, type OwnerPaymentRow } from "@/lib/owner-payments";
import { appPath } from "@/lib/config";

function formatDate(ms: number): string {
  if (!ms) return "—";
  return new Date(ms).toLocaleDateString([], {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function BillingPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [payments, setPayments] = useState<OwnerPaymentRow[]>([]);
  const [paymentsLoading, setPaymentsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!loading && !user) {
      router.replace(appPath("/auth/login?next=/profile/billing"));
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (!user) return;
    setPaymentsLoading(true);
    void fetchOwnerPayments(getClientDb(), user.uid)
      .then(setPayments)
      .catch((err) => setError(err instanceof Error ? err.message : "Could not load payments"))
      .finally(() => setPaymentsLoading(false));
  }, [user]);

  if (loading || !user) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <p className="text-[var(--muted)]">Loading…</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-6 pb-28 md:pb-8">
      <Link href={appPath("/profile")} className="text-sm text-[var(--brand-orange)]">
        ← My properties
      </Link>
      <h1 className="mt-4 font-serif text-3xl text-[var(--brand-navy)]">Billing history</h1>
      <p className="mt-1 text-sm text-[var(--muted)]">
        Plan activations and boosts for your listings.
      </p>

      {paymentsLoading && (
        <p className="mt-8 text-center text-sm text-[var(--muted)]">Loading payments…</p>
      )}

      {error && (
        <p className="mt-6 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </p>
      )}

      {!paymentsLoading && !error && payments.length === 0 && (
        <p className="mt-8 text-center text-sm text-[var(--muted)]">
          No payments yet. Activate a listing to see records here.
        </p>
      )}

      {!paymentsLoading && payments.length > 0 && (
        <ul className="mt-6 space-y-2">
          {payments.map((p) => (
            <li
              key={p.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] p-4"
            >
              <div className="min-w-0">
                <p className="font-medium text-[var(--brand-navy)]">{p.planName}</p>
                <p className="mt-0.5 text-xs capitalize text-[var(--muted)]">
                  {p.type} · {formatDate(p.createdAtMs)}
                </p>
              </div>
              <div className="text-right">
                <p className="font-serif text-[var(--brand-orange)]">
                  {p.amount === 0 ? "Free" : `${p.amount.toLocaleString()} ${p.currency}`}
                </p>
                <p className="text-[10px] uppercase text-[var(--muted)]">{p.status}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

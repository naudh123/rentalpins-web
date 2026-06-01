"use client";

import { useState } from "react";
import Link from "next/link";
import { appPath } from "@/lib/config";

interface Props {
  message: string;
  onRetry?: () => void | Promise<void>;
  signInHref?: string;
}

export default function AccountUnavailable({
  message,
  onRetry,
  signInHref = "/auth/login",
}: Props) {
  const [retrying, setRetrying] = useState(false);

  async function handleRetry() {
    if (!onRetry) return;
    setRetrying(true);
    try {
      await onRetry();
    } finally {
      setRetrying(false);
    }
  }

  return (
    <div className="mx-auto max-w-md px-4 py-12 text-center">
      <h1 className="font-serif text-2xl text-[var(--brand-navy)]">Account unavailable</h1>
      <p className="mt-2 text-sm text-red-700">{message}</p>
      <p className="mt-2 text-sm text-[var(--muted)]">
        Check your internet connection, then retry or sign in again.
      </p>
      <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
        {onRetry && (
          <button
            type="button"
            onClick={handleRetry}
            disabled={retrying}
            className="rp-btn rp-btn-primary px-6 py-2.5 disabled:opacity-50"
          >
            {retrying ? "Retrying…" : "Retry"}
          </button>
        )}
        <Link href={appPath(signInHref)} className="text-[var(--accent)]">
          Sign in
        </Link>
      </div>
    </div>
  );
}

"use client";

import { useEffect, type ReactNode } from "react";
import Link from "next/link";
import { appPath } from "@/lib/config";
import { trackEvent } from "@/lib/ga4";

interface Props {
  title: string;
  description?: string;
  error: Error & { digest?: string };
  reset: () => void;
  viewEvent: string;
  retryEvent: string;
  backEvent: string;
  backHref?: string;
  backLabel?: string;
  context?: Record<string, string | number | boolean | undefined>;
  footer?: ReactNode;
}

/** Shared segment error UI with GA4 tracking. */
export default function RouteError({
  title,
  description,
  error,
  reset,
  viewEvent,
  retryEvent,
  backEvent,
  backHref = appPath("/search"),
  backLabel = "Back to map",
  context,
  footer,
}: Props) {
  useEffect(() => {
    trackEvent(viewEvent, {
      message: error.message || "unknown_error",
      ...(error.digest ? { digest: error.digest } : {}),
      ...context,
    });
  }, [context, error.digest, error.message, viewEvent]);

  return (
    <div className="mx-auto max-w-md px-4 py-16 text-center">
      <div className="rp-card p-8">
        <h1 className="font-serif text-2xl text-[var(--brand-navy)]">{title}</h1>
        <p className="mt-3 text-sm text-[var(--muted)]">
          {description || error.message || "Something went wrong. Please try again."}
        </p>
        <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
          <button
            type="button"
            onClick={() => {
              trackEvent(retryEvent, context);
              reset();
            }}
            className="rp-btn rp-btn-primary px-6 py-2.5"
          >
            Try again
          </button>
          <Link
            href={backHref}
            className="rp-btn rp-btn-secondary px-6 py-2.5"
            onClick={() => trackEvent(backEvent, context)}
          >
            {backLabel}
          </Link>
        </div>
        {footer}
      </div>
    </div>
  );
}

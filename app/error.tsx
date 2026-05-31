"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { appPath } from "@/lib/config";
import { trackEvent } from "@/lib/ga4";

interface Props {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function AppError({ error, reset }: Props) {
  const pathname = usePathname();

  useEffect(() => {
    trackEvent("app_error_viewed", {
      message: error.message || "unknown_error",
      ...(pathname ? { path: pathname } : {}),
      ...(error.digest ? { digest: error.digest } : {}),
    });
  }, [error.digest, error.message, pathname]);

  return (
    <div className="mx-auto max-w-md px-4 py-16 text-center">
      <div className="rp-card p-8">
        <h1 className="font-serif text-2xl text-[var(--brand-navy)]">Something went wrong</h1>
        <p className="mt-3 text-sm text-[var(--muted)]">
          We hit an unexpected error. Please try again — if it keeps happening, head back to the map.
        </p>
        <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
          <button
            type="button"
            onClick={() => {
              trackEvent("app_error_retry_clicked", { ...(pathname ? { path: pathname } : {}) });
              reset();
            }}
            className="rp-btn rp-btn-primary px-6 py-2.5"
          >
            Try again
          </button>
          <Link
            href={appPath("/search")}
            className="rp-btn rp-btn-secondary px-6 py-2.5"
            onClick={() =>
              trackEvent("app_error_back_to_map_clicked", { ...(pathname ? { path: pathname } : {}) })
            }
          >
            Back to map
          </Link>
        </div>
      </div>
    </div>
  );
}

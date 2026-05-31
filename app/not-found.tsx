"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { appPath } from "@/lib/config";
import { trackEvent } from "@/lib/ga4";

export default function NotFound() {
  const pathname = usePathname();

  useEffect(() => {
    trackEvent("not_found_viewed", {
      ...(pathname ? { path: pathname } : {}),
    });
  }, [pathname]);

  return (
    <div className="mx-auto max-w-md px-4 py-16 text-center">
      <div className="rp-card p-8">
        <h1 className="font-serif text-2xl text-[var(--brand-navy)]">Page not found</h1>
        <p className="mt-3 text-sm text-[var(--muted)]">
          The page you&apos;re looking for doesn&apos;t exist or may have moved.
        </p>
        <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
          <Link
            href={appPath("/search")}
            className="rp-btn rp-btn-primary px-6 py-2.5"
            onClick={() => trackEvent("not_found_cta_clicked", { destination: "search" })}
          >
            Browse map
          </Link>
          <Link
            href={appPath("/")}
            className="rp-btn rp-btn-secondary px-6 py-2.5"
            onClick={() => trackEvent("not_found_cta_clicked", { destination: "home" })}
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

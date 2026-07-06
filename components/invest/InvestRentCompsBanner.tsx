"use client";

import Link from "next/link";
import { buildRentCompsUrlFromBuyView } from "@/lib/invest/rent-comps-url";
import { appPath } from "@/lib/config";
import type { SearchUrlState } from "@/lib/search-url";
import { useMemo, useState } from "react";

interface Props {
  urlState: SearchUrlState;
}

const DISMISS_KEY = "rentalpins-invest-rent-comps-dismissed";

export default function InvestRentCompsBanner({ urlState }: Props) {
  const [dismissed, setDismissed] = useState(() => {
    if (typeof window === "undefined") return false;
    return sessionStorage.getItem(DISMISS_KEY) === "1";
  });

  const rentUrl = useMemo(() => buildRentCompsUrlFromBuyView(urlState), [urlState]);

  if (dismissed) return null;

  function handleDismiss() {
    sessionStorage.setItem(DISMISS_KEY, "1");
    setDismissed(true);
  }

  return (
    <div
      className="pointer-events-auto absolute bottom-44 left-3 right-3 z-10 mx-auto flex max-w-lg items-center justify-between gap-2 rounded-2xl border border-[color-mix(in_srgb,var(--invest-emerald)_35%,var(--border))] bg-[var(--surface)]/95 px-3 py-2.5 text-xs text-[var(--brand-navy)] shadow-lg backdrop-blur-sm md:bottom-28 md:left-4 md:right-auto"
      role="status"
    >
      <span className="min-w-0 flex-1">
        <span className="font-semibold text-[var(--invest-emerald)]">Underwriting?</span>{" "}
        Open rent comps for this map view to validate yield assumptions.
      </span>
      <span className="flex shrink-0 items-center gap-1.5">
        <button
          type="button"
          onClick={handleDismiss}
          aria-label="Dismiss rent comps hint"
          className="flex h-7 w-7 items-center justify-center rounded-full text-[var(--muted)] hover:bg-[var(--bg-elevated)]"
        >
          ×
        </button>
        <Link
          href={appPath(rentUrl)}
          className="rounded-full bg-[var(--invest-emerald)] px-3 py-1.5 text-[10px] font-semibold text-white"
        >
          Rent comps
        </Link>
        <Link
          href={appPath("/invest/calculator")}
          className="hidden rounded-full border border-[var(--border)] px-3 py-1.5 text-[10px] font-semibold sm:inline-block"
        >
          Calculator
        </Link>
      </span>
    </div>
  );
}

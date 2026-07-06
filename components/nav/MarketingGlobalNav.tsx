"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { appPath } from "@/lib/config";
import {
  GLOBAL_PRIMARY_NAV,
  GLOBAL_SECONDARY_NAV,
  type GlobalNavMode,
} from "@/lib/nav/mode-nav";

function isPrimaryNavActive(
  pathname: string | null,
  href: string,
  mode: GlobalNavMode
): boolean {
  if (!pathname) return false;
  if (pathname === appPath("/")) return false;

  if (mode === "buy") {
    return (
      pathname === href ||
      pathname.startsWith(`${href}/`) ||
      pathname.startsWith(appPath("/projects")) ||
      pathname.startsWith(appPath("/builders")) ||
      pathname.startsWith(appPath("/developers")) ||
      pathname.startsWith(appPath("/flats-for-sale")) ||
      pathname.startsWith(appPath("/property-for-sale")) ||
      pathname.startsWith(appPath("/list-for-sale"))
    );
  }
  if (mode === "rent") {
    return (
      pathname === appPath("/search") ||
      pathname.startsWith(`${appPath("/search")}/`) ||
      pathname === appPath("/post") ||
      pathname.startsWith(`${appPath("/post")}/`) ||
      pathname.startsWith(appPath("/rentals")) ||
      pathname.startsWith(appPath("/list-property")) ||
      pathname.startsWith(appPath("/list-pg")) ||
      pathname.startsWith(appPath("/list-flat"))
    );
  }
  if (mode === "invest") {
    return (
      pathname === href ||
      pathname.startsWith(`${href}/`) ||
      pathname.includes("investment-guide") ||
      pathname.startsWith(appPath("/property-market-insights"))
    );
  }
  if (mode === "blog") {
    return pathname === href || pathname.startsWith(`${href}/`);
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

function isSecondaryNavActive(pathname: string | null, href: string): boolean {
  if (!pathname) return false;
  return pathname === href || pathname.startsWith(`${href}/`);
}

function primaryLinkClass(mode: GlobalNavMode, active: boolean): string {
  let className =
    "rounded-full px-3.5 py-1.5 text-sm font-medium transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ";

  if (mode === "buy") {
    className += active
      ? "bg-[color-mix(in_srgb,var(--sale-gold)_18%,transparent)] text-[var(--brand-navy)] ring-1 ring-[color-mix(in_srgb,var(--sale-gold)_45%,var(--border))]"
      : "border border-[color-mix(in_srgb,var(--sale-gold)_35%,var(--border))] bg-[color-mix(in_srgb,var(--sale-gold)_7%,transparent)] text-[var(--brand-navy)] hover:border-[var(--sale-gold)]";
  } else if (mode === "rent") {
    className += active
      ? "bg-[color-mix(in_srgb,var(--brand-orange)_14%,transparent)] text-[var(--brand-orange)]"
      : "text-[var(--muted)] hover:text-[var(--brand-orange)]";
  } else if (mode === "invest") {
    className += active
      ? "bg-[color-mix(in_srgb,var(--invest-emerald)_12%,transparent)] text-[var(--invest-emerald)]"
      : "text-[var(--muted)] hover:text-[var(--invest-emerald)]";
  } else if (mode === "blog") {
    className += active
      ? "bg-[color-mix(in_srgb,var(--brand-navy)_8%,transparent)] text-[var(--brand-navy)]"
      : "text-[var(--muted)] hover:text-[var(--brand-navy)]";
  } else if (active) {
    className +=
      "bg-[color-mix(in_srgb,var(--brand-orange)_14%,transparent)] text-[var(--brand-orange)]";
  } else {
    className += "text-[var(--muted)] hover:text-[var(--brand-navy)]";
  }

  return className;
}

interface Props {
  onNavigate?: () => void;
  variant?: "desktop" | "mobile";
}

export default function MarketingGlobalNav({ onNavigate, variant = "desktop" }: Props) {
  const pathname = usePathname();
  const [moreOpen, setMoreOpen] = useState(false);
  const moreRef = useRef<HTMLDivElement>(null);

  const secondaryActive = GLOBAL_SECONDARY_NAV.some((item) =>
    isSecondaryNavActive(pathname, item.href)
  );

  useEffect(() => {
    if (!moreOpen) return;
    function onPointerDown(e: MouseEvent) {
      if (moreRef.current && !moreRef.current.contains(e.target as Node)) {
        setMoreOpen(false);
      }
    }
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [moreOpen]);

  if (variant === "mobile") {
    return (
      <nav className="flex flex-col gap-1" aria-label="Primary">
        {GLOBAL_PRIMARY_NAV.map((item) => {
          const isBuy = item.mode === "buy";
          const isInvest = item.mode === "invest";
          const isBlog = item.mode === "blog";
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-[var(--bg-elevated)] ${
                isBuy
                  ? "border border-[color-mix(in_srgb,var(--sale-gold)_35%,var(--border))] bg-[color-mix(in_srgb,var(--sale-gold)_6%,transparent)] text-[var(--brand-navy)]"
                  : isInvest
                    ? "text-[var(--invest-emerald)]"
                    : isBlog
                      ? "text-[var(--brand-navy)]"
                      : ""
              }`}
              onClick={onNavigate}
            >
              {item.label}
            </Link>
          );
        })}
        <p className="mt-3 px-3 text-[10px] font-bold uppercase tracking-widest text-[var(--muted)]">
          More
        </p>
        {GLOBAL_SECONDARY_NAV.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="rounded-lg px-3 py-2.5 text-sm font-medium text-[var(--muted)] hover:bg-[var(--bg-elevated)] hover:text-[var(--brand-navy)]"
            onClick={onNavigate}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    );
  }

  return (
    <nav className="flex items-center gap-1" aria-label="Primary">
      {GLOBAL_PRIMARY_NAV.map((item) => {
        const active = isPrimaryNavActive(pathname, item.href, item.mode);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={primaryLinkClass(item.mode, active)}
          >
            {item.label}
          </Link>
        );
      })}

      <div className="mx-1 hidden h-5 w-px bg-[var(--border)] sm:block" aria-hidden />

      <div className="relative" ref={moreRef}>
        <button
          type="button"
          onClick={() => setMoreOpen((o) => !o)}
          aria-expanded={moreOpen}
          aria-haspopup="menu"
          className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition ${
            secondaryActive || moreOpen
              ? "bg-[var(--bg-elevated)] text-[var(--brand-navy)]"
              : "text-[var(--muted)] hover:bg-[var(--bg-elevated)] hover:text-[var(--brand-navy)]"
          }`}
        >
          More
          <span className="ml-0.5 text-[10px] opacity-70" aria-hidden>
            ▾
          </span>
        </button>
        {moreOpen && (
          <div
            role="menu"
            className="absolute right-0 top-full z-50 mt-2 min-w-[11rem] rounded-xl border border-[var(--border)] bg-[var(--surface)] py-1.5 shadow-lg"
          >
            {GLOBAL_SECONDARY_NAV.map((item) => {
              const active = isSecondaryNavActive(pathname, item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  role="menuitem"
                  className={`block px-4 py-2 text-sm ${
                    active
                      ? "bg-[color-mix(in_srgb,var(--brand-orange)_8%,transparent)] font-semibold text-[var(--brand-navy)]"
                      : "text-[var(--muted)] hover:bg-[var(--bg-elevated)] hover:text-[var(--brand-navy)]"
                  }`}
                  onClick={() => setMoreOpen(false)}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </nav>
  );
}

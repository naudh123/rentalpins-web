"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import Logo from "@/components/brand/Logo";
import SiteFooter from "@/components/marketing/SiteFooter";
import SeoCtaTracker from "@/components/seo/SeoCtaTracker";
import { appPath } from "@/lib/config";
import { GLOBAL_NAV } from "@/lib/nav/mode-nav";
import { PLAY_STORE_URL } from "@/lib/site-links";

export default function MarketingShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  function isNavActive(href: string, mode: (typeof GLOBAL_NAV)[number]["mode"]): boolean {
    if (mode === "buy") {
      return pathname === href || Boolean(pathname?.startsWith(`${href}/`));
    }
    if (mode === "rent") {
      return (
        pathname === appPath("/search") ||
        pathname?.startsWith(`${appPath("/search")}/`) ||
        pathname === appPath("/post") ||
        pathname?.startsWith(`${appPath("/post")}/`)
      );
    }
    if (mode === "invest") {
      return pathname === href || Boolean(pathname?.startsWith(`${href}/`));
    }
    return pathname === href || Boolean(pathname?.startsWith(`${href}/`));
  }

  return (
    <div className="flex min-h-screen flex-col bg-[var(--bg)] text-[var(--text)]">
      <header className="sticky top-0 z-50 overflow-visible border-b border-[var(--border-subtle)] rp-glass">
        <div className="mx-auto flex min-h-14 max-w-6xl items-center justify-between gap-4 px-4 py-1 sm:px-6">
          <Logo href={appPath("/")} size="nav" />

          <nav className="hidden items-center gap-1 md:flex" aria-label="Primary">
            {GLOBAL_NAV.map((item) => {
              const isBuy = item.mode === "buy";
              const isRent = item.mode === "rent";
              const isInvest = item.mode === "invest";
              const active = isNavActive(item.href, item.mode);

              let className =
                "rounded-full px-3.5 py-1.5 text-sm font-medium transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ";

              if (isBuy) {
                className += active
                  ? "bg-[color-mix(in_srgb,var(--sale-gold)_18%,transparent)] text-[var(--brand-navy)] ring-1 ring-[color-mix(in_srgb,var(--sale-gold)_45%,var(--border))]"
                  : "border border-[color-mix(in_srgb,var(--sale-gold)_35%,var(--border))] bg-[color-mix(in_srgb,var(--sale-gold)_7%,transparent)] text-[var(--brand-navy)] hover:border-[var(--sale-gold)]";
              } else if (isRent && active) {
                className +=
                  "bg-[color-mix(in_srgb,var(--brand-orange)_14%,transparent)] text-[var(--brand-orange)]";
              } else if (isInvest) {
                className += active
                  ? "bg-[color-mix(in_srgb,var(--invest-emerald)_12%,transparent)] text-[var(--invest-emerald)]"
                  : "text-[var(--muted)] hover:text-[var(--invest-emerald)]";
              } else if (active) {
                className +=
                  "bg-[color-mix(in_srgb,var(--brand-orange)_14%,transparent)] text-[var(--brand-orange)]";
              } else {
                className += "text-[var(--muted)] hover:text-[var(--brand-navy)]";
              }

              return (
                <Link key={item.href} href={item.href} className={className}>
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            <Link
              href={appPath("/auth/login")}
              className="hidden px-3 py-2 text-xs font-semibold text-[var(--brand-navy)] hover:text-[var(--brand-orange)] sm:inline-flex"
            >
              Sign in
            </Link>
            <a
              href={PLAY_STORE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden rounded-lg border border-[var(--border)] px-3 py-2 text-xs font-semibold text-[var(--brand-navy)] hover:border-[var(--brand-navy)] lg:inline-block"
            >
              Android app
            </a>
            <button
              type="button"
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-[var(--border)] text-[var(--brand-navy)] md:hidden"
              aria-expanded={open}
              aria-label="Menu"
              onClick={() => setOpen((o) => !o)}
            >
              {open ? "×" : "☰"}
            </button>
          </div>
        </div>

        {open && (
          <div className="border-t border-[var(--border)] bg-[var(--surface)] px-4 py-4 md:hidden">
            <nav className="flex flex-col gap-1">
              {GLOBAL_NAV.map((item) => {
                const isBuy = item.mode === "buy";
                const isInvest = item.mode === "invest";
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-[var(--bg-elevated)] ${
                      isBuy
                        ? "border border-[color-mix(in_srgb,var(--sale-gold)_35%,var(--border))] bg-[color-mix(in_srgb,var(--sale-gold)_6%,transparent)] text-[var(--brand-navy)]"
                        : isInvest
                          ? "text-[var(--invest-emerald)]"
                          : ""
                    }`}
                    onClick={() => setOpen(false)}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>
        )}
      </header>

      <main className="flex-1">{children}</main>

      <SiteFooter />
      <SeoCtaTracker />
    </div>
  );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import Logo from "@/components/brand/Logo";
import SiteFooter from "@/components/marketing/SiteFooter";
import SeoCtaTracker from "@/components/seo/SeoCtaTracker";
import { appPath } from "@/lib/config";
import { PLAY_STORE_URL } from "@/lib/site-links";

const NAV = [
  { label: "Buy map", href: appPath("/search?transaction=sale&category=Property") },
  { label: "Mohali", href: appPath("/buy/mohali") },
  { label: "Rent", href: appPath("/search") },
  { label: "About", href: appPath("/about") },
] as const;

export default function SaleShell({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div
      className="sale-theme flex min-h-screen flex-col bg-[var(--bg)] text-[var(--text)]"
      data-transaction="sale"
    >
      <header className="sticky top-0 z-50 border-b border-[var(--border-subtle)] rp-glass">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
          <div className="flex items-center gap-2">
            <Logo href={appPath("/buy")} size="sm" />
            <span className="hidden rounded-full border border-[var(--sale-gold-muted)] bg-[color-mix(in_srgb,var(--sale-gold)_12%,transparent)] px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-[var(--brand-navy)] sm:inline">
              Buy
            </span>
          </div>

          <nav className="hidden items-center gap-1 md:flex" aria-label="Buy">
            {NAV.map((item) => {
              const active =
                pathname === item.href ||
                (item.href.includes("/buy/mohali") &&
                  pathname?.startsWith("/buy/mohali"));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition ${
                    active
                      ? "bg-[color-mix(in_srgb,var(--sale-gold)_18%,transparent)] text-[var(--brand-navy)]"
                      : "text-[var(--muted)] hover:text-[var(--brand-navy)]"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            <Link
              href={appPath("/search?transaction=sale&category=Property")}
              className="rp-btn rp-btn-primary hidden px-4 py-2 text-xs sm:inline-flex"
            >
              Explore sale map
            </Link>
            <Link
              href={appPath("/post?transaction=sale")}
              className="rp-btn rp-btn-secondary hidden px-4 py-2 text-xs sm:inline-flex"
            >
              List for sale
            </Link>
            <button
              type="button"
              className="rounded-lg border border-[var(--border)] px-2 py-1 text-xs font-semibold text-[var(--brand-navy)] md:hidden"
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
            >
              Menu
            </button>
          </div>
        </div>

        {open ? (
          <nav className="border-t border-[var(--border-subtle)] px-4 py-3 md:hidden">
            <ul className="flex flex-col gap-2">
              {NAV.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="block rounded-lg px-3 py-2 text-sm font-medium text-[var(--brand-navy)]"
                    onClick={() => setOpen(false)}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href={appPath("/post?transaction=sale")}
                  className="block rounded-lg px-3 py-2 text-sm font-semibold text-[var(--brand-navy)]"
                  onClick={() => setOpen(false)}
                >
                  List for sale
                </Link>
              </li>
            </ul>
          </nav>
        ) : null}
      </header>

      <main className="flex-1">{children}</main>

      <SiteFooter />
      <SeoCtaTracker />
    </div>
  );
}

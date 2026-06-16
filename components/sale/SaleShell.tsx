"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import Logo from "@/components/brand/Logo";
import ProductBadge from "@/components/brand/ProductBadge";
import SiteFooter from "@/components/marketing/SiteFooter";
import SeoCtaTracker from "@/components/seo/SeoCtaTracker";
import { appPath } from "@/lib/config";
import { BUY_NAV } from "@/lib/nav/mode-nav";
import {
  BUY_POST_PATH,
  BUY_SEARCH_PATH,
} from "@/lib/sale/buy-app-paths";

export default function SaleShell({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const primaryNav = BUY_NAV.slice(0, 4);

  function isActive(href: string): boolean {
    return pathname === href || Boolean(pathname?.startsWith(`${href}/`));
  }

  return (
    <div
      className="sale-theme flex min-h-screen flex-col bg-[var(--bg)] text-[var(--text)]"
      data-transaction="sale"
    >
      <header className="sticky top-0 z-50 border-b border-[var(--border-subtle)] rp-glass">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
          <div className="flex items-center gap-2">
            <Logo href={appPath("/buy")} size="sm" />
            <ProductBadge variant="buy" className="hidden sm:inline-flex" />
          </div>

          <nav className="hidden items-center gap-1 lg:flex" aria-label="RentalPins Buy">
            {primaryNav.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`rounded-full px-3 py-1.5 text-sm font-medium transition ${
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
              href={appPath(BUY_SEARCH_PATH)}
              className="rp-btn rp-btn-primary hidden px-4 py-2 text-xs sm:inline-flex"
            >
              Search properties
            </Link>
            <Link
              href={appPath(BUY_POST_PATH)}
              className="rp-btn rp-btn-secondary hidden px-4 py-2 text-xs md:inline-flex"
            >
              Post property
            </Link>
            <Link
              href={appPath("/search")}
              className="hidden text-xs font-semibold text-[var(--muted)] hover:text-[var(--brand-navy)] lg:inline-flex"
            >
              Rent
            </Link>
            <button
              type="button"
              className="rounded-lg border border-[var(--border)] px-2 py-1 text-xs font-semibold text-[var(--brand-navy)] lg:hidden"
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
            >
              Menu
            </button>
          </div>
        </div>

        {open ? (
          <nav className="border-t border-[var(--border-subtle)] px-4 py-3 lg:hidden">
            <ul className="flex flex-col gap-2">
              {BUY_NAV.map((item) => (
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
                  href={appPath("/search")}
                  className="block rounded-lg px-3 py-2 text-sm text-[var(--muted)]"
                  onClick={() => setOpen(false)}
                >
                  Switch to Rent
                </Link>
              </li>
            </ul>
          </nav>
        ) : null}
      </header>

      <main className="flex-1">{children}</main>

      <SiteFooter variant="sale" />
      <SeoCtaTracker />
    </div>
  );
}

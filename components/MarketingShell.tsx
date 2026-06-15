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
  { label: "Map search", href: appPath("/search") },
  { label: "Buy", href: appPath("/buy") },
  { label: "Cities", href: appPath("/rentals") },
  { label: "Blog", href: appPath("/blog") },
  { label: "About", href: appPath("/about") },
  { label: "Contact", href: appPath("/contact") },
] as const;

export default function MarketingShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen flex-col bg-[var(--bg)] text-[var(--text)]">
      <header className="sticky top-0 z-50 border-b border-[var(--border-subtle)] rp-glass">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
          <Logo href={appPath("/")} size="sm" />

          <nav className="hidden items-center gap-1 md:flex" aria-label="Primary">
            {NAV.map((item) => {
              const active =
                pathname === item.href || pathname?.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition ${
                    active
                      ? "bg-[color-mix(in_srgb,var(--brand-orange)_14%,transparent)] text-[var(--brand-orange)]"
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
              href={appPath("/search")}
              className="rp-btn rp-btn-primary hidden px-4 py-2 text-xs sm:inline-flex"
            >
              Open map
            </Link>
            <Link
              href={appPath("/post")}
              className="rp-btn rp-btn-secondary hidden px-4 py-2 text-xs sm:inline-flex"
            >
              Post listing
            </Link>
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
              {NAV.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-[var(--bg-elevated)]"
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              <Link
                href={appPath("/search")}
                className="rp-btn rp-btn-primary mt-2 w-full"
                onClick={() => setOpen(false)}
              >
                Open map
              </Link>
              <Link
                href={appPath("/post")}
                className="rp-btn rp-btn-secondary mt-2 w-full"
                onClick={() => setOpen(false)}
              >
                Post listing
              </Link>
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

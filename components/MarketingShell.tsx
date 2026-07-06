"use client";

import Link from "next/link";
import { useState } from "react";
import Logo from "@/components/brand/Logo";
import SiteFooter from "@/components/marketing/SiteFooter";
import MarketingGlobalNav from "@/components/nav/MarketingGlobalNav";
import SeoCtaTracker from "@/components/seo/SeoCtaTracker";
import { appPath } from "@/lib/config";
import { PLAY_STORE_URL } from "@/lib/site-links";

export default function MarketingShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex min-h-screen flex-col bg-[var(--bg)] text-[var(--text)]">
      <header className="sticky top-0 z-50 overflow-visible border-b border-[var(--border-subtle)] rp-glass">
        <div className="mx-auto flex min-h-14 max-w-6xl items-center justify-between gap-4 px-4 py-1 sm:px-6">
          <Logo href={appPath("/")} size="nav" />

          <div className="hidden md:block">
            <MarketingGlobalNav />
          </div>

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
            <MarketingGlobalNav variant="mobile" onNavigate={() => setOpen(false)} />
          </div>
        )}
      </header>

      <main className="flex-1">{children}</main>

      <SiteFooter />
      <SeoCtaTracker />
    </div>
  );
}

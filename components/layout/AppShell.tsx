"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import Logo from "@/components/brand/Logo";
import {
  IconChat,
  IconPost,
  IconSaved,
  IconSearch,
  IconUser,
} from "@/components/icons/NavIcons";
import { useAuth } from "@/components/providers/AuthProvider";
import { appPath, basePath, showStagingBanner } from "@/lib/config";
import { getClientDb } from "@/lib/firebase-client";

const DESKTOP_NAV = [
  { href: "/search", label: "Search" },
  { href: "/saved-listings", label: "Saved" },
  { href: "/rentals", label: "Cities" },
  { href: "/post", label: "Post" },
  { href: "/chat", label: "Chat" },
] as const;

const MOBILE_NAV = [
  { href: "/search", label: "Search", Icon: IconSearch },
  { href: "/saved-listings", label: "Saved", Icon: IconSaved },
  { href: "/post", label: "Post", Icon: IconPost },
  { href: "/chat", label: "Chat", Icon: IconChat },
  { href: "/auth/login", label: "Account", Icon: IconUser },
] as const;

const MARKETING_PREFIXES = [
  "/rentals",
  "/blog",
  "/about",
  "/contact",
  "/privacy-policy",
  "/terms",
  "/refund-policy",
  "/delete-account",
];

function isMarketingPath(pathname: string | null): boolean {
  if (!pathname) return false;
  const normalized =
    basePath && pathname.startsWith(basePath)
      ? pathname.slice(basePath.length) || "/"
      : pathname;
  if (normalized === "/") return true;
  return MARKETING_PREFIXES.some(
    (p) => normalized === p || normalized.startsWith(`${p}/`)
  );
}

function isActive(pathname: string | null, href: string): boolean {
  if (!pathname) return false;
  const normalizedPathname =
    basePath && pathname.startsWith(basePath)
      ? pathname.slice(basePath.length) || "/"
      : pathname;
  if (href === "/") return normalizedPathname === "/";
  return (
    normalizedPathname === href || normalizedPathname.startsWith(`${href}/`)
  );
}

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, signOut } = useAuth();
  const [unreadChatCount, setUnreadChatCount] = useState(0);

  useEffect(() => {
    if (!user) {
      setUnreadChatCount(0);
      return;
    }
    const db = getClientDb();
    let buyerUnread = 0;
    let sellerUnread = 0;
    const recalc = () => setUnreadChatCount(buyerUnread + sellerUnread);
    const unsubBuyer = onSnapshot(
      query(collection(db, "chat_rooms"), where("buyerUid", "==", user.uid)),
      (snap) => {
        buyerUnread = snap.docs.reduce(
          (sum, d) => sum + ((d.data().hasUnreadBuyer as boolean) ? 1 : 0),
          0
        );
        recalc();
      }
    );
    const unsubSeller = onSnapshot(
      query(collection(db, "chat_rooms"), where("sellerUid", "==", user.uid)),
      (snap) => {
        sellerUnread = snap.docs.reduce(
          (sum, d) => sum + ((d.data().hasUnreadSeller as boolean) ? 1 : 0),
          0
        );
        recalc();
      }
    );
    return () => {
      unsubBuyer();
      unsubSeller();
    };
  }, [user]);

  if (isMarketingPath(pathname)) {
    return <>{children}</>;
  }

  const accountHref = user ? appPath("/profile") : appPath("/auth/login");
  const normalizedPathname =
    basePath && pathname?.startsWith(basePath)
      ? pathname.slice(basePath.length) || "/"
      : pathname;
  const isMapPage = normalizedPathname === "/search";

  return (
    <div className="flex min-h-dvh flex-col bg-[var(--bg)] text-[var(--text)]">
      {showStagingBanner && (
        <div className="bg-amber-600 px-3 py-1.5 text-center text-xs font-medium text-white">
          Staging build — not production
        </div>
      )}

      <header
        className={`sticky top-0 z-50 border-b border-[var(--border-subtle)] rp-glass ${
          isMapPage ? "md:border-b" : ""
        }`}
      >
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-4 px-4">
          <Logo href={appPath("/")} size="sm" />

          <nav className="hidden items-center gap-1 md:flex" aria-label="Main">
            {DESKTOP_NAV.map((item) => (
              <Link
                key={item.href}
                href={appPath(item.href)}
                className={`rounded-full px-3.5 py-1.5 text-sm transition ${
                  isActive(pathname, item.href)
                    ? "bg-[color-mix(in_srgb,var(--brand-orange)_14%,transparent)] font-semibold text-[var(--brand-orange)]"
                    : "text-[var(--muted)] hover:bg-[var(--bg-elevated)] hover:text-[var(--brand-navy)]"
                }`}
              >
                <span className="relative inline-flex items-center">
                  {item.label}
                  {item.href === "/chat" && unreadChatCount > 0 && (
                    <span className="ml-1 inline-flex min-w-4 items-center justify-center rounded-full bg-[var(--brand-orange)] px-1 text-[10px] font-bold leading-4 text-white">
                      {unreadChatCount > 9 ? "9+" : unreadChatCount}
                    </span>
                  )}
                </span>
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            {user ? (
              <>
                <Link
                  href={appPath("/profile")}
                  className={`hidden rounded-full px-3.5 py-1.5 text-sm transition sm:inline-flex ${
                    isActive(pathname, "/profile")
                      ? "bg-[color-mix(in_srgb,var(--brand-orange)_14%,transparent)] font-semibold text-[var(--brand-orange)]"
                      : "text-[var(--muted)] hover:bg-[var(--bg-elevated)] hover:text-[var(--brand-navy)]"
                  }`}
                >
                  Account
                </Link>
                <button
                  type="button"
                  onClick={() => signOut()}
                  className="rp-btn rp-btn-ghost hidden sm:inline-flex"
                >
                  Sign out
                </button>
              </>
            ) : (
              <Link href={appPath("/auth/login")} className="rp-btn rp-btn-primary hidden px-4 py-2 text-sm sm:inline-flex">
                Sign in
              </Link>
            )}
          </div>
        </div>
      </header>

      <main className="rp-app-main">{children}</main>

      <nav
        className="fixed inset-x-0 bottom-0 z-50 border-t border-[var(--border-subtle)] rp-glass pb-[env(safe-area-inset-bottom)] md:hidden"
        aria-label="Mobile"
      >
        <div className="mx-auto flex max-w-lg items-stretch justify-around">
          {MOBILE_NAV.map((item) => {
            const href = item.href === "/auth/login" ? accountHref : appPath(item.href);
            const active =
              isActive(pathname, item.href) ||
              (item.href === "/auth/login" && user && normalizedPathname === "/profile");
            const { Icon } = item;
            return (
              <Link
                key={item.href}
                href={href}
                className={`flex min-h-14 flex-1 flex-col items-center justify-center gap-1 py-2.5 text-xs font-medium transition ${
                  active ? "text-[var(--brand-orange)]" : "text-[var(--muted)]"
                }`}
              >
                <span className="relative">
                  <Icon className="h-5 w-5" />
                  {item.href === "/chat" && unreadChatCount > 0 && (
                    <span className="absolute -right-2 -top-1 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-[var(--brand-orange)] px-1 text-[9px] font-bold leading-4 text-white">
                      {unreadChatCount > 9 ? "9+" : unreadChatCount}
                    </span>
                  )}
                </span>
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>

      <div className="h-[4.25rem] shrink-0 md:hidden" aria-hidden />
    </div>
  );
}

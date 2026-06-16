"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import Logo from "@/components/brand/Logo";
import ProductBadge from "@/components/brand/ProductBadge";
import {
  IconChat,
  IconPost,
  IconSaved,
  IconSearch,
  IconUser,
} from "@/components/icons/NavIcons";
import { useAuth } from "@/components/providers/AuthProvider";
import { appPath, basePath, showStagingBanner } from "@/lib/config";
import { isBuyAppPath } from "@/lib/sale/buy-app-paths";
import { getClientDb } from "@/lib/firebase-client";

const DESKTOP_NAV = [
  { href: "/search", label: "Search rentals" },
  { href: "/saved-listings", label: "Saved" },
  { href: "/rentals", label: "Cities" },
  { href: "/post", label: "Post rental" },
  { href: "/chat", label: "Chat" },
] as const;

const MOBILE_NAV_LEFT = [
  { href: "/search", label: "Search", Icon: IconSearch },
  { href: "/saved-listings", label: "Saved", Icon: IconSaved },
] as const;

const MOBILE_NAV_RIGHT = [
  { href: "/chat", label: "Chat", Icon: IconChat },
  { href: "/auth/login", label: "Account", Icon: IconUser },
] as const;

const POST_HREF = "/post";

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

function isPostPath(pathname: string | null): boolean {
  if (!pathname) return false;
  const normalized =
    basePath && pathname.startsWith(basePath)
      ? pathname.slice(basePath.length) || "/"
      : pathname;
  return normalized === POST_HREF || normalized.startsWith(`${POST_HREF}/`);
}

function MobileNavItem({
  href,
  label,
  Icon,
  active,
  unreadChatCount,
}: {
  href: string;
  label: string;
  Icon: typeof IconSearch;
  active: boolean;
  unreadChatCount: number;
}) {
  return (
    <Link
      href={href}
      className={`flex min-h-14 min-w-0 flex-1 flex-col items-center justify-center gap-0.5 py-2 text-[11px] font-medium transition ${
        active ? "text-[var(--brand-orange)]" : "text-[var(--muted)]"
      }`}
    >
      <span className="relative">
        <Icon className="h-5 w-5" />
        {label === "Chat" && unreadChatCount > 0 && (
          <span className="absolute -right-2 -top-1 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-[var(--brand-orange)] px-1 text-[9px] font-bold leading-4 text-white">
            {unreadChatCount > 9 ? "9+" : unreadChatCount}
          </span>
        )}
      </span>
      <span className="truncate">{label}</span>
    </Link>
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

  if (isMarketingPath(pathname) || isBuyAppPath(pathname)) {
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
          <div className="flex items-center gap-2">
            <Logo href={appPath("/")} size="sm" />
            <ProductBadge variant="rent" className="hidden sm:inline-flex" />
          </div>

          <nav className="hidden items-center gap-1 md:flex" aria-label="Main">
            {DESKTOP_NAV.map((item) => {
              const active = isActive(pathname, item.href);
              const isPost = item.href === POST_HREF;
              return (
                <Link
                  key={item.href}
                  href={appPath(item.href)}
                  className={
                    isPost
                      ? `inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-bold shadow-[var(--shadow-glow)] transition ${
                          active
                            ? "bg-[var(--brand-orange-hover)] text-white"
                            : "bg-[var(--brand-orange)] text-white hover:bg-[var(--brand-orange-hover)]"
                        }`
                      : `rounded-full px-3.5 py-1.5 text-sm transition ${
                          active
                            ? "bg-[color-mix(in_srgb,var(--brand-orange)_14%,transparent)] font-semibold text-[var(--brand-orange)]"
                            : "text-[var(--muted)] hover:bg-[var(--bg-elevated)] hover:text-[var(--brand-navy)]"
                        }`
                  }
                >
                  <span className="relative inline-flex items-center">
                    {isPost ? (
                      <>
                        <IconPost className="h-4 w-4" />
                        {item.label}
                      </>
                    ) : (
                      item.label
                    )}
                    {item.href === "/chat" && unreadChatCount > 0 && (
                      <span className="ml-1 inline-flex min-w-4 items-center justify-center rounded-full bg-[var(--brand-orange)] px-1 text-[10px] font-bold leading-4 text-white">
                        {unreadChatCount > 9 ? "9+" : unreadChatCount}
                      </span>
                    )}
                  </span>
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            <Link
              href={appPath("/search")}
              className="rp-btn rp-btn-primary hidden px-4 py-2 text-xs lg:inline-flex"
            >
              Open map
            </Link>
            <Link
              href={appPath("/post")}
              className="rp-btn rp-btn-secondary hidden px-4 py-2 text-xs lg:inline-flex"
            >
              Post listing
            </Link>
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
        className="fixed inset-x-0 bottom-0 z-50 border-t border-[var(--border-subtle)] bg-[var(--surface)]/95 pb-[env(safe-area-inset-bottom)] shadow-[0_-4px_24px_rgba(30,58,110,0.08)] backdrop-blur-md md:hidden"
        aria-label="Mobile"
      >
        <div className="mx-auto grid max-w-lg grid-cols-5 items-end px-1 pt-1">
          {MOBILE_NAV_LEFT.map((item) => (
            <MobileNavItem
              key={item.href}
              href={appPath(item.href)}
              label={item.label}
              Icon={item.Icon}
              active={isActive(pathname, item.href)}
              unreadChatCount={0}
            />
          ))}

          <Link
            href={appPath(POST_HREF)}
            aria-label="Post a listing — list your property for rent"
            aria-current={isPostPath(pathname) ? "page" : undefined}
            className="relative -mt-6 flex flex-col items-center justify-end pb-1.5"
          >
            <span
              className={`flex h-[3.35rem] w-[3.35rem] items-center justify-center rounded-full bg-gradient-to-br from-[var(--brand-orange)] to-[var(--brand-orange-hover)] text-white ring-4 ring-[var(--bg)] transition active:scale-95 ${
                isPostPath(pathname)
                  ? "shadow-[0_8px_28px_rgba(232,80,26,0.55)]"
                  : "shadow-[var(--shadow-glow)]"
              }`}
            >
              <svg
                className="h-8 w-8"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.75"
                aria-hidden
              >
                <path d="M12 5v14M5 12h14" strokeLinecap="round" />
              </svg>
            </span>
            <span
              className={`mt-1 text-[11px] font-bold tracking-wide ${
                isPostPath(pathname)
                  ? "text-[var(--brand-orange)]"
                  : "text-[var(--brand-navy)]"
              }`}
            >
              Post
            </span>
          </Link>

          {MOBILE_NAV_RIGHT.map((item) => {
            const href =
              item.href === "/auth/login" ? accountHref : appPath(item.href);
            const active = Boolean(
              isActive(pathname, item.href) ||
                (item.href === "/auth/login" &&
                  user &&
                  normalizedPathname === "/profile")
            );
            return (
              <MobileNavItem
                key={item.href}
                href={href}
                label={item.label}
                Icon={item.Icon}
                active={active}
                unreadChatCount={unreadChatCount}
              />
            );
          })}
        </div>
      </nav>

      <div className="h-[4.75rem] shrink-0 md:hidden" aria-hidden />
    </div>
  );
}

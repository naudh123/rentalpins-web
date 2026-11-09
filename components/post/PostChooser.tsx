"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { appPath, basePath } from "@/lib/config";
import { trackEvent } from "@/lib/ga4";
import {
  currentPostIntent,
  POST_OPTIONS,
  type PostIntent,
} from "@/lib/nav/post-options";

interface PostChooserContextValue {
  openPostChooser: (source: string) => void;
  /** Header Post buttons register so the provider knows whether to show the floating fallback. */
  registerPostButton: () => () => void;
}

const PostChooserContext = createContext<PostChooserContextValue | null>(null);

/**
 * True inside AppShell's <main>. Some routes (e.g. /invest, /projects) render a
 * MarketingShell inside AppShell; their nested header must not add a second Post button.
 */
const NestedInAppShellContext = createContext(false);

export function NestedInAppShell({ children }: { children: React.ReactNode }) {
  return (
    <NestedInAppShellContext.Provider value={true}>{children}</NestedInAppShellContext.Provider>
  );
}

export function usePostChooser(): PostChooserContextValue {
  const ctx = useContext(PostChooserContext);
  if (!ctx) {
    throw new Error("usePostChooser must be used inside <PostChooserProvider>");
  }
  return ctx;
}

function normalize(pathname: string | null): string | null {
  if (!pathname) return null;
  return basePath && pathname.startsWith(basePath)
    ? pathname.slice(basePath.length) || "/"
    : pathname;
}

const ACCENT: Record<PostIntent, { ring: string; icon: string; badge: string }> = {
  rent: {
    ring: "hover:border-[var(--brand-orange)] focus-visible:border-[var(--brand-orange)]",
    icon: "bg-[color-mix(in_srgb,var(--brand-orange)_12%,transparent)] text-[var(--brand-orange)]",
    badge: "text-[var(--brand-orange)]",
  },
  sell: {
    ring: "hover:border-[var(--sale-gold)] focus-visible:border-[var(--sale-gold)]",
    icon: "bg-[color-mix(in_srgb,var(--sale-gold)_18%,transparent)] text-[var(--brand-navy)]",
    badge: "text-[color-mix(in_srgb,var(--sale-gold)_70%,var(--brand-navy))]",
  },
  invest: {
    ring: "hover:border-[var(--invest-emerald)] focus-visible:border-[var(--invest-emerald)]",
    icon: "bg-[color-mix(in_srgb,var(--invest-emerald)_12%,transparent)] text-[var(--invest-emerald)]",
    badge: "text-[var(--invest-emerald)]",
  },
};

function OptionIcon({ intent }: { intent: PostIntent }) {
  const common = {
    className: "h-6 w-6",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };
  if (intent === "rent") {
    // Key
    return (
      <svg {...common}>
        <circle cx="8" cy="15" r="4" />
        <path d="M11 12l9-9M17 6l3 3M15 8l2 2" />
      </svg>
    );
  }
  if (intent === "sell") {
    // House with tag
    return (
      <svg {...common}>
        <path d="M3 11l9-7 9 7" />
        <path d="M5 10v10h14V10" />
        <path d="M10 20v-5h4v5" />
      </svg>
    );
  }
  // Buildings
  return (
    <svg {...common}>
      <path d="M4 21V8l6-3v16" />
      <path d="M10 21V3l10 4v14" />
      <path d="M2 21h20M14 10h2M14 14h2M6 12h1M6 16h1" />
    </svg>
  );
}

function PostChooserDialog({ source, onClose }: { source: string; onClose: () => void }) {
  const pathname = usePathname();
  const current = currentPostIntent(normalize(pathname));
  const panelRef = useRef<HTMLDivElement>(null);
  const firstLinkRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;
    firstLinkRef.current?.focus();
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key !== "Tab" || !panelRef.current) return;
      // Keep focus inside the dialog.
      const focusables = panelRef.current.querySelectorAll<HTMLElement>("a[href], button");
      if (!focusables.length) return;
      const first = focusables[0]!;
      const last = focusables[focusables.length - 1]!;
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
      previouslyFocused?.focus?.();
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center sm:p-4">
      <button
        type="button"
        aria-label="Close"
        tabIndex={-1}
        className="absolute inset-0 bg-[color-mix(in_srgb,var(--brand-navy)_45%,transparent)] backdrop-blur-[2px]"
        onClick={onClose}
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="post-chooser-title"
        className="relative w-full max-w-md rounded-t-2xl border border-[var(--border)] bg-[var(--surface)] shadow-2xl sm:rounded-2xl"
        // Spacing is inline on purpose: some pages (city hubs) inject an unlayered
        // `* { margin:0; padding:0 }` reset that overrides Tailwind spacing utilities.
        style={{ padding: "14px 18px calc(18px + env(safe-area-inset-bottom))" }}
      >
        <div
          className="h-1 w-10 rounded-full bg-[var(--border)] sm:hidden"
          style={{ margin: "0 auto 12px" }}
          aria-hidden
        />
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2
              id="post-chooser-title"
              className="font-serif text-xl text-[var(--brand-navy)]"
            >
              What do you want to post?
            </h2>
            <p className="text-sm text-[var(--muted)]" style={{ marginTop: 4 }}>
              Owner-direct, no brokers. Pick one to continue.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xl text-[var(--muted)] hover:bg-[var(--bg-elevated)] hover:text-[var(--brand-navy)]"
          >
            ×
          </button>
        </div>

        <ul className="flex flex-col gap-2.5" style={{ marginTop: 16 }}>
          {POST_OPTIONS.map((option, i) => {
            const accent = ACCENT[option.intent];
            const isCurrent = current === option.intent;
            return (
              <li key={option.intent}>
                <Link
                  ref={i === 0 ? firstLinkRef : undefined}
                  href={appPath(option.href)}
                  aria-current={isCurrent ? "page" : undefined}
                  data-post-intent={option.intent}
                  onClick={() => {
                    trackEvent("post_chooser_selected", {
                      intent: option.intent,
                      source,
                    });
                    onClose();
                  }}
                  style={{ padding: 14 }}
                  className={`flex items-center gap-3 rounded-xl border bg-[var(--surface)] text-left outline-none transition ${
                    isCurrent ? "border-[var(--brand-navy)]" : "border-[var(--border)]"
                  } ${accent.ring}`}
                >
                  <span
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${accent.icon}`}
                  >
                    <OptionIcon intent={option.intent} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center gap-2">
                      <span className="font-semibold text-[var(--brand-navy)]">
                        {option.title}
                      </span>
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider ${accent.badge}`}
                      >
                        {option.badge}
                      </span>
                    </span>
                    <span
                      className="block text-xs leading-relaxed text-[var(--muted)]"
                      style={{ marginTop: 2 }}
                    >
                      {isCurrent ? "You're here · " : ""}
                      {option.description}
                    </span>
                  </span>
                  <span className="text-lg text-[var(--muted)]" aria-hidden>
                    →
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

/** Mount once near the root; any header can then open the Rent / Sell / Invest chooser. */
export function PostChooserProvider({ children }: { children: React.ReactNode }) {
  const [openSource, setOpenSource] = useState<string | null>(null);
  const [registeredButtons, setRegisteredButtons] = useState(0);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  const openPostChooser = useCallback((source: string) => {
    trackEvent("post_chooser_opened", { source });
    setOpenSource(source);
  }, []);
  const close = useCallback(() => setOpenSource(null), []);
  const registerPostButton = useCallback(() => {
    setRegisteredButtons((n) => n + 1);
    return () => setRegisteredButtons((n) => n - 1);
  }, []);

  // Avoid flashing the floating button before headers have mounted.
  useEffect(() => {
    const t = window.setTimeout(() => setMounted(true), 0);
    return () => window.clearTimeout(t);
  }, []);

  // Close if the route changes underneath (e.g. back button).
  const lastPathRef = useRef(pathname);
  useEffect(() => {
    if (lastPathRef.current !== pathname) {
      lastPathRef.current = pathname;
      setOpenSource(null);
    }
  }, [pathname]);

  const value = useMemo(
    () => ({ openPostChooser, registerPostButton }),
    [openPostChooser, registerPostButton]
  );

  const normalizedPath = normalize(pathname);
  const showFloating =
    mounted &&
    registeredButtons === 0 &&
    !(normalizedPath?.startsWith("/admin") ?? false);

  return (
    <PostChooserContext.Provider value={value}>
      {children}
      {showFloating && (
        <button
          type="button"
          aria-haspopup="dialog"
          aria-label="Post — rent out, sell, or list a project"
          onClick={() => openPostChooser("floating_fallback")}
          style={{ padding: "12px 20px" }}
          className="fixed bottom-[calc(1rem+env(safe-area-inset-bottom))] left-4 z-[60] inline-flex items-center gap-1.5 rounded-full bg-[var(--brand-orange)] text-sm font-bold text-white shadow-[0_8px_28px_rgba(232,80,26,0.45)] transition hover:bg-[var(--brand-orange-hover)] active:scale-95"
        >
          <svg
            className="h-4 w-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.75"
            aria-hidden
          >
            <path d="M12 5v14M5 12h14" strokeLinecap="round" />
          </svg>
          Post
        </button>
      )}
      {openSource !== null && <PostChooserDialog source={openSource} onClose={close} />}
    </PostChooserContext.Provider>
  );
}

interface PostButtonProps {
  /** Where the button lives, for analytics. */
  source: string;
  className?: string;
  children?: React.ReactNode;
  ariaLabel?: string;
  /** For headers that may be rendered inside AppShell: render nothing there (AppShell has its own). */
  hideInsideAppShell?: boolean;
}

/** The single "Post" entry point used in every header. */
export function PostButton(props: PostButtonProps) {
  const nested = useContext(NestedInAppShellContext);
  if (props.hideInsideAppShell && nested) return null;
  return <PostButtonInner {...props} />;
}

function PostButtonInner({ source, className, children, ariaLabel }: PostButtonProps) {
  const { openPostChooser, registerPostButton } = usePostChooser();
  useEffect(() => registerPostButton(), [registerPostButton]);
  return (
    <button
      type="button"
      aria-haspopup="dialog"
      aria-label={ariaLabel}
      onClick={() => openPostChooser(source)}
      className={
        className ??
        "inline-flex items-center gap-1.5 rounded-full bg-[var(--brand-orange)] px-4 py-2 text-sm font-bold text-white shadow-[var(--shadow-glow)] transition hover:bg-[var(--brand-orange-hover)]"
      }
    >
      {children ?? (
        <>
          <svg
            className="h-4 w-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            aria-hidden
          >
            <path d="M12 5v14M5 12h14" strokeLinecap="round" />
          </svg>
          Post
        </>
      )}
    </button>
  );
}

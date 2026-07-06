"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { appPath } from "@/lib/config";

const NAV = [
  { href: "/admin/builders", label: "Builders" },
  { href: "/admin/projects", label: "Projects" },
  { href: "/admin/project-units", label: "Inventory" },
  { href: "/admin/project-leads", label: "Leads" },
  { href: "/admin/agent", label: "Agent Metrics" },
];

export default function BuilderAdminShell({
  children,
  title,
}: {
  children: React.ReactNode;
  title?: string;
}) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-[var(--bg-elevated)]">
      <header className="border-b border-[var(--border)] bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-[var(--muted)]">
              RentalPins Admin
            </p>
            {title && <h1 className="text-xl font-bold text-[var(--text)]">{title}</h1>}
          </div>
          <Link href={appPath("/")} className="text-sm text-[var(--brand-navy)] hover:underline">
            ← Back to site
          </Link>
        </div>
        <nav className="mx-auto flex max-w-6xl gap-1 overflow-x-auto px-4 pb-3">
          {NAV.map(({ href, label }) => {
            const path = appPath(href);
            const active = pathname === path || pathname?.startsWith(`${path}/`);
            return (
              <Link
                key={href}
                href={path}
                className={`whitespace-nowrap rounded-lg px-3 py-1.5 text-sm font-medium ${
                  active
                    ? "bg-[var(--brand-navy)] text-white"
                    : "text-[var(--muted)] hover:bg-[var(--border-subtle)]"
                }`}
              >
                {label}
              </Link>
            );
          })}
        </nav>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
    </div>
  );
}

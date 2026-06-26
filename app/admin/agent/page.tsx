import type { Metadata } from "next";
import Link from "next/link";
import AgentMetricsDashboard from "@/components/admin/AgentMetricsDashboard";
import { appPath } from "@/lib/config";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Agent metrics | RentalPins admin",
  description: "Property agent conversation metrics and lead intent scores.",
  path: "/admin/agent",
  robots: { index: false, follow: false },
});

export default function AdminAgentPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <div className="mb-8">
        <p className="text-xs font-bold uppercase tracking-widest text-[var(--muted)]">Admin</p>
        <h1 className="mt-2 font-serif text-3xl text-[var(--brand-navy)]">Property agent metrics</h1>
        <p className="mt-2 text-sm text-[var(--muted)]">
          Conversation logs from /advisor, map copilot, /developers showcase, and Flutter mobile turns.
        </p>
        <div className="mt-4 flex flex-wrap gap-3 text-sm">
          <Link href={appPath("/advisor")} className="font-semibold text-[var(--accent)] hover:underline">
            Open advisor
          </Link>
          <Link href={appPath("/developers")} className="font-semibold text-[var(--muted)] hover:underline">
            Showcase page
          </Link>
        </div>
      </div>
      <AgentMetricsDashboard />
    </div>
  );
}

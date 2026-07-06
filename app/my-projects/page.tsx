"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/AuthProvider";
import { BuilderLuxuryShell } from "@/components/builders/luxury/LuxuryUI";
import { projectPath } from "@/lib/builders/project-paths";
import { appPath } from "@/lib/config";
import type { BuilderProject } from "@/lib/types/builder-microsite";
import MarketingShell from "@/components/MarketingShell";

export default function MyProjectsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [projects, setProjects] = useState<BuilderProject[]>([]);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.replace(appPath("/auth/login?next=/my-projects"));
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (!user) return;
    user
      .getIdToken()
      .then((token) =>
        fetch("/api/my-projects", {
          headers: { Authorization: `Bearer ${token}` },
        })
      )
      .then((r) => r.json())
      .then((d) => setProjects(d.projects || []))
      .finally(() => setFetching(false));
  }, [user]);

  return (
    <MarketingShell>
      <BuilderLuxuryShell>
        <div className="mx-auto max-w-4xl px-4 py-12">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="lux-eyebrow">Your listings</p>
              <h1 className="mt-2 font-serif text-3xl font-bold text-[var(--brand-navy)]">
                My projects
              </h1>
              <p className="mt-2 text-sm text-[var(--muted)]">
                Manage your microsites. Enquiries are handled by RentalPins — you&apos;ll receive
                leads when purchased.
              </p>
            </div>
            <Link href={appPath("/projects/post")} className="lux-btn-gold">
              + New project
            </Link>
          </div>

          <div className="mt-10">
            {fetching ? (
              <p className="text-[var(--muted)]">Loading…</p>
            ) : projects.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-[var(--border)] p-12 text-center">
                <p className="font-serif text-lg text-[var(--brand-navy)]">No projects yet</p>
                <p className="mt-2 text-sm text-[var(--muted)]">
                  Create your first project microsite — it takes under two minutes.
                </p>
                <Link href={appPath("/projects/post")} className="lux-btn-gold mt-6 inline-flex">
                  List a project
                </Link>
              </div>
            ) : (
              <ul className="space-y-4">
                {projects.map((p) => (
                  <li
                    key={p.id}
                    className="lux-card flex flex-wrap items-center justify-between gap-4 p-5"
                  >
                    <div>
                      <h2 className="font-serif text-xl font-bold text-[var(--brand-navy)]">
                        {p.name}
                      </h2>
                      <p className="mt-1 text-sm text-[var(--muted)]">
                        {p.city} · {p.isPublished ? "Live" : "Draft"} · {p.enquiryCount} enquiries
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Link
                        href={appPath(`/my-projects/${p.id}`)}
                        className="lux-btn-outline text-sm"
                      >
                        Edit
                      </Link>
                      {p.isPublished && (
                        <Link
                          href={appPath(projectPath(p.citySlug, p.slug))}
                          target="_blank"
                          className="lux-btn-gold text-sm"
                        >
                          View live
                        </Link>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </BuilderLuxuryShell>
    </MarketingShell>
  );
}

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/components/providers/AuthProvider";
import BuilderAdminShell from "@/components/builders/BuilderAdminShell";
import { projectPath } from "@/lib/builders/project-paths";
import { appPath } from "@/lib/config";
import type { BuilderProject } from "@/lib/types/builder-microsite";

export default function AdminProjectsPage() {
  const { user, profile, loading: authLoading } = useAuth();
  const [projects, setProjects] = useState<BuilderProject[]>([]);
  const [loading, setLoading] = useState(true);

  const isAdmin =
    profile?.role === "admin" ||
    profile?.role === "sysadmin" ||
    profile?.role === "superadmin";

  useEffect(() => {
    if (authLoading) return;
    if (!user || !isAdmin) {
      setLoading(false);
      return;
    }
    fetch("/api/builder-projects")
      .then((r) => r.json())
      .then((d) => setProjects(d.projects || []))
      .finally(() => setLoading(false));
  }, [user, isAdmin, authLoading]);

  if (!user || !isAdmin) {
    return (
      <BuilderAdminShell title="Projects">
        <p className="text-red-600">Admin access required.</p>
      </BuilderAdminShell>
    );
  }

  return (
    <BuilderAdminShell title="Projects">
      <div className="mb-6 flex justify-between">
        <p className="text-[var(--muted)]">{projects.length} project(s)</p>
        <Link href={appPath("/admin/projects/new")} className="rp-btn rp-btn-primary text-sm">
          + New Project
        </Link>
      </div>

      {loading ? (
        <p className="text-[var(--muted)]">Loading...</p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-[var(--border)] bg-white">
          <table className="w-full text-left text-sm">
            <thead className="bg-[var(--bg-elevated)] text-xs uppercase text-[var(--muted)]">
              <tr>
                <th className="px-4 py-3">Project</th>
                <th className="px-4 py-3">Builder</th>
                <th className="px-4 py-3">City</th>
                <th className="px-4 py-3">Units</th>
                <th className="px-4 py-3">Published</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-subtle)]">
              {projects.map((p) => (
                <tr key={p.id}>
                  <td className="px-4 py-3 font-medium">{p.name}</td>
                  <td className="px-4 py-3">{p.builderName}</td>
                  <td className="px-4 py-3">{p.city}</td>
                  <td className="px-4 py-3">{p.totalUnits}</td>
                  <td className="px-4 py-3">{p.isPublished ? "Yes" : "No"}</td>
                  <td className="px-4 py-3 space-x-2">
                    <Link href={appPath(`/admin/projects/${p.id}`)} className="text-[var(--brand-navy)] hover:underline">
                      Edit
                    </Link>
                    <Link href={appPath(`/admin/master-plan/${p.id}`)} className="text-[var(--brand-orange)] hover:underline">
                      Master Plan
                    </Link>
                    {p.isPublished && (
                      <Link
                        href={appPath(projectPath(p.citySlug, p.slug))}
                        target="_blank"
                        className="text-green-600 hover:underline"
                      >
                        View
                      </Link>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </BuilderAdminShell>
  );
}

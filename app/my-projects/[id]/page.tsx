"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/AuthProvider";
import ProjectEditForm from "@/components/builders/ProjectEditForm";
import { BuilderLuxuryShell } from "@/components/builders/luxury/LuxuryUI";
import { projectPath } from "@/lib/builders/project-paths";
import { appPath } from "@/lib/config";
import type { BuilderProject } from "@/lib/types/builder-microsite";
import MarketingShell from "@/components/MarketingShell";

export default function MyProjectEditPage() {
  const { id } = useParams<{ id: string }>();
  const { user, loading } = useAuth();
  const router = useRouter();
  const [project, setProject] = useState<BuilderProject | null>(null);
  const [denied, setDenied] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      router.replace(appPath(`/auth/login?next=/my-projects/${id}`));
    }
  }, [user, loading, router, id]);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/builder-projects/${id}`)
      .then((r) => r.json())
      .then((d) => {
        const p = d.project as BuilderProject | null;
        if (!p || !user) return;
        if (p.ownerUserId !== user.uid) {
          setDenied(true);
          return;
        }
        setProject(p);
      });
  }, [id, user]);

  async function save(patch: Record<string, unknown>, options?: { upload?: boolean }) {
    if (!user || !id) return;
    setSaving(true);
    setMessage(null);
    try {
      const token = await user.getIdToken();
      const res = await fetch(`/api/builder-projects/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(patch),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Save failed");
      setProject(data.project);
      setMessage(options?.upload ? "Upload saved!" : "Saved!");
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  return (
    <MarketingShell>
      <BuilderLuxuryShell>
        <div className="mx-auto max-w-3xl px-4 py-12">
          <Link href={appPath("/my-projects")} className="text-sm text-[var(--muted)] hover:underline">
            ← My projects
          </Link>

          {denied ? (
            <p className="mt-8 text-red-600">You don&apos;t have access to this project.</p>
          ) : !project ? (
            <p className="mt-8 text-[var(--muted)]">Loading…</p>
          ) : (
            <>
              <h1 className="mt-4 font-serif text-2xl font-bold text-[var(--brand-navy)]">
                {project.name}
              </h1>
              <p className="mt-2 text-sm text-[var(--muted)]">
                Add photos and pricing. Our team reviews new projects before they go live, and
                enquiries go to RentalPins for lead qualification.
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                <Link
                  href={appPath(`/admin/master-plan/${id}`)}
                  className="lux-btn-outline text-sm"
                >
                  Master plan
                </Link>
                <Link href={appPath("/admin/project-units")} className="lux-btn-outline text-sm">
                  Plot inventory
                </Link>
                {project.isPublished && (
                  <Link
                    href={appPath(projectPath(project.citySlug, project.slug))}
                    target="_blank"
                    className="lux-btn-gold text-sm"
                  >
                    View public page
                  </Link>
                )}
              </div>

              <div className="mt-8">
                <ProjectEditForm
                  project={project}
                  projectId={id!}
                  saving={saving}
                  onSave={save}
                />
              </div>
              {message && (
                <p
                  className={`mt-4 text-sm ${message.includes("failed") || message.includes("Failed") ? "text-red-600" : "text-green-600"}`}
                >
                  {message}
                </p>
              )}
            </>
          )}
        </div>
      </BuilderLuxuryShell>
    </MarketingShell>
  );
}

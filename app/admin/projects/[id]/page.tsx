"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useAuth } from "@/components/providers/AuthProvider";
import BuilderAdminShell from "@/components/builders/BuilderAdminShell";
import ProjectEditForm from "@/components/builders/ProjectEditForm";
import { projectPath } from "@/lib/builders/project-paths";
import { appPath } from "@/lib/config";
import type { BuilderProject } from "@/lib/types/builder-microsite";

export default function EditProjectPage() {
  const { id } = useParams<{ id: string }>();
  const { user, profile } = useAuth();
  const [project, setProject] = useState<BuilderProject | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const isAdmin =
    profile?.role === "admin" ||
    profile?.role === "sysadmin" ||
    profile?.role === "superadmin";

  useEffect(() => {
    if (!id) return;
    fetch(`/api/builder-projects/${id}`)
      .then((r) => r.json())
      .then((d) => setProject(d.project || null));
  }, [id]);

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

  if (!isAdmin || !project) {
    return (
      <BuilderAdminShell title="Edit Project">
        <p className="text-[var(--muted)]">{!isAdmin ? "Admin access required." : "Loading..."}</p>
      </BuilderAdminShell>
    );
  }

  return (
    <BuilderAdminShell title={`Edit: ${project.name}`}>
      <div className="mb-4 flex flex-wrap gap-2">
        <Link href={appPath(`/admin/master-plan/${id}`)} className="rp-btn rp-btn-secondary text-sm">
          Master Plan Editor
        </Link>
        <Link href={appPath("/admin/project-units")} className="rp-btn rp-btn-secondary text-sm">
          Manage Inventory
        </Link>
        {project.isPublished && (
          <Link
            href={appPath(projectPath(project.citySlug, project.slug))}
            target="_blank"
            className="rp-btn rp-btn-primary text-sm"
          >
            View Public Page
          </Link>
        )}
      </div>

      <ProjectEditForm
        project={project}
        projectId={id!}
        saving={saving}
        allowFeatured
        allowPublish
        onSave={save}
      />
      {message && (
        <p className={`mt-4 text-sm ${message.includes("failed") ? "text-red-600" : "text-green-600"}`}>
          {message}
        </p>
      )}
    </BuilderAdminShell>
  );
}

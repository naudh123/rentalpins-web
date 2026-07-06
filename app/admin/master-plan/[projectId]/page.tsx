"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useAuth } from "@/components/providers/AuthProvider";
import BuilderAdminShell from "@/components/builders/BuilderAdminShell";
import MasterPlanEditor from "@/components/builders/MasterPlanEditor";
import { projectMasterPlanPath, projectPath } from "@/lib/builders/project-paths";
import { appPath } from "@/lib/config";
import type { BuilderProject, ProjectMasterPlan, ProjectUnit } from "@/lib/types/builder-microsite";

export default function AdminMasterPlanPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const { user, profile } = useAuth();
  const [project, setProject] = useState<BuilderProject | null>(null);
  const [units, setUnits] = useState<ProjectUnit[]>([]);
  const [masterPlan, setMasterPlan] = useState<ProjectMasterPlan | null>(null);
  const [denied, setDenied] = useState(false);

  const isAdmin =
    profile?.role === "admin" ||
    profile?.role === "sysadmin" ||
    profile?.role === "superadmin";

  useEffect(() => {
    if (!projectId) return;
    Promise.all([
      fetch(`/api/builder-projects/${projectId}`).then((r) => r.json()),
      fetch(`/api/project-units?projectId=${projectId}`).then((r) => r.json()),
      fetch(`/api/master-plans/${projectId}`).then((r) => r.json()),
    ]).then(([proj, unitData, planData]) => {
      const p = proj.project as BuilderProject | null;
      setProject(p);
      setUnits(unitData.units || []);
      setMasterPlan(planData.masterPlan || null);
      if (p && user && !isAdmin && p.ownerUserId !== user.uid) {
        setDenied(true);
      }
    });
  }, [projectId, user, isAdmin]);

  if (!user) {
    return (
      <BuilderAdminShell title="Master Plan Editor">
        <p className="text-[var(--muted)]">Sign in to edit your master plan.</p>
      </BuilderAdminShell>
    );
  }

  if (denied) {
    return (
      <BuilderAdminShell title="Master Plan Editor">
        <p className="text-red-600">You don&apos;t have access to this project.</p>
      </BuilderAdminShell>
    );
  }

  if (!project) {
    return (
      <BuilderAdminShell title="Master Plan Editor">
        <p className="text-[var(--muted)]">Loading...</p>
      </BuilderAdminShell>
    );
  }

  return (
    <BuilderAdminShell title={`Master Plan: ${project.name}`}>
      <div className="mb-4 flex flex-wrap gap-2">
        {project.isPublished && (
          <Link
            href={appPath(projectMasterPlanPath(project.citySlug, project.slug))}
            target="_blank"
            className="rp-btn rp-btn-primary text-sm"
          >
            Preview Public View
          </Link>
        )}
        <Link
          href={appPath(projectPath(project.citySlug, project.slug))}
          className="rp-btn rp-btn-secondary text-sm"
        >
          Back to Project
        </Link>
      </div>

      <MasterPlanEditor
        projectId={projectId!}
        initialImageUrl={
          masterPlan?.defaultImageUrl || project.masterPlanImageUrl
        }
        initialAngles={masterPlan?.angles || []}
        units={units}
        onSaved={() => {
          fetch(`/api/master-plans/${projectId}`).then((r) => r.json()).then((d) =>
            setMasterPlan(d.masterPlan || null)
          );
        }}
      />
    </BuilderAdminShell>
  );
}

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/components/providers/AuthProvider";
import BuilderAdminShell from "@/components/builders/BuilderAdminShell";
import ProjectInventoryTable from "@/components/builders/ProjectInventoryTable";
import StatusBadge from "@/components/builders/StatusBadge";
import type { BuilderProject, ProjectUnit, UnitStatus } from "@/lib/types/builder-microsite";

export default function AdminProjectUnitsPage() {
  const { user, profile } = useAuth();
  const [projects, setProjects] = useState<BuilderProject[]>([]);
  const [projectId, setProjectId] = useState("");
  const [units, setUnits] = useState<ProjectUnit[]>([]);
  const [plotNumber, setPlotNumber] = useState("");
  const [size, setSize] = useState("");
  const [price, setPrice] = useState("");
  const [facing, setFacing] = useState("");
  const [loading, setLoading] = useState(false);

  const isAdmin =
    profile?.role === "admin" ||
    profile?.role === "sysadmin" ||
    profile?.role === "superadmin";

  useEffect(() => {
    if (!user) return;
    if (isAdmin) {
      fetch("/api/builder-projects")
        .then((r) => r.json())
        .then((d) => {
          const list = d.projects || [];
          setProjects(list);
          if (list[0]) setProjectId(list[0].id);
        });
      return;
    }
    user
      .getIdToken()
      .then((token) =>
        fetch("/api/my-projects", { headers: { Authorization: `Bearer ${token}` } })
      )
      .then((r) => r.json())
      .then((d) => {
        const list = d.projects || [];
        setProjects(list);
        if (list[0]) setProjectId(list[0].id);
      });
  }, [user, isAdmin]);

  useEffect(() => {
    if (!projectId) return;
    fetch(`/api/project-units?projectId=${projectId}`)
      .then((r) => r.json())
      .then((d) => setUnits(d.units || []));
  }, [projectId]);

  async function addUnit(e: React.FormEvent) {
    e.preventDefault();
    if (!user || !projectId) return;
    setLoading(true);
    try {
      const token = await user.getIdToken();
      await fetch("/api/project-units", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          projectId,
          plotNumber,
          size: size ? Number(size) : undefined,
          price: price ? Number(price) : undefined,
          facing: facing || undefined,
        }),
      });
      setPlotNumber("");
      setSize("");
      setPrice("");
      setFacing("");
      const refreshed = await fetch(`/api/project-units?projectId=${projectId}`).then((r) => r.json());
      setUnits(refreshed.units || []);
    } finally {
      setLoading(false);
    }
  }

  async function updateStatus(unitId: string, status: UnitStatus) {
    if (!user) return;
    const token = await user.getIdToken();
    await fetch(`/api/project-units/${unitId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status }),
    });
    const refreshed = await fetch(`/api/project-units?projectId=${projectId}`).then((r) => r.json());
    setUnits(refreshed.units || []);
  }

  if (!user) {
    return (
      <BuilderAdminShell title="Inventory">
        <p className="text-[var(--muted)]">Sign in to manage plot inventory.</p>
      </BuilderAdminShell>
    );
  }

  if (!isAdmin && projects.length === 0) {
    return (
      <BuilderAdminShell title="Inventory">
        <p className="text-[var(--muted)]">
          No projects yet.{" "}
          <Link href="/projects/post" className="text-[var(--brand-navy)] underline">
            List a project
          </Link>
        </p>
      </BuilderAdminShell>
    );
  }

  return (
    <BuilderAdminShell title="Plot / Unit Inventory">
      <div className="mb-6">
        <label className="mb-1 block text-sm font-medium">Select project</label>
        <select
          value={projectId}
          onChange={(e) => setProjectId(e.target.value)}
          className="w-full max-w-md rounded-lg border border-[var(--border)] px-3 py-2"
        >
          {projects.map((p) => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>
      </div>

      <form onSubmit={addUnit} className="mb-8 flex flex-wrap gap-3 rounded-xl border border-[var(--border)] bg-white p-4">
        <input
          required
          placeholder="Plot number"
          value={plotNumber}
          onChange={(e) => setPlotNumber(e.target.value)}
          className="rounded-lg border border-[var(--border)] px-3 py-2 text-sm"
        />
        <input
          placeholder="Size (sq yd)"
          value={size}
          onChange={(e) => setSize(e.target.value)}
          className="w-32 rounded-lg border border-[var(--border)] px-3 py-2 text-sm"
        />
        <input
          placeholder="Price (INR)"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="w-36 rounded-lg border border-[var(--border)] px-3 py-2 text-sm"
        />
        <input
          placeholder="Facing"
          value={facing}
          onChange={(e) => setFacing(e.target.value)}
          className="w-32 rounded-lg border border-[var(--border)] px-3 py-2 text-sm"
        />
        <button type="submit" disabled={loading} className="rp-btn rp-btn-primary text-sm">
          Add Plot
        </button>
      </form>

      <ProjectInventoryTable units={units} />

      <div className="mt-6 overflow-x-auto rounded-xl border border-[var(--border)] bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-[var(--bg-elevated)] text-xs uppercase text-[var(--muted)]">
            <tr>
              <th className="px-4 py-3">Plot</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Quick update</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border-subtle)]">
            {units.map((u) => (
              <tr key={u.id}>
                <td className="px-4 py-3">{u.plotNumber}</td>
                <td className="px-4 py-3"><StatusBadge status={u.status} /></td>
                <td className="px-4 py-3">
                  <select
                    value={u.status}
                    onChange={(e) => updateStatus(u.id, e.target.value as UnitStatus)}
                    className="rounded border border-[var(--border)] px-2 py-1 text-xs"
                  >
                    <option value="available">Available</option>
                    <option value="reserved">Reserved</option>
                    <option value="sold">Sold</option>
                    <option value="coming-soon">Coming Soon</option>
                    <option value="hold">Hold</option>
                    <option value="not-released">Not Released</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </BuilderAdminShell>
  );
}

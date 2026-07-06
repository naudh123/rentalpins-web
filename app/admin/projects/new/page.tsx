"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/AuthProvider";
import BuilderAdminShell from "@/components/builders/BuilderAdminShell";
import { slugify } from "@/lib/builders/format";
import { appPath } from "@/lib/config";
import type { Builder, ProjectType } from "@/lib/types/builder-microsite";

export default function NewProjectPage() {
  const { user, profile } = useAuth();
  const router = useRouter();
  const [builders, setBuilders] = useState<Builder[]>([]);
  const [builderId, setBuilderId] = useState("");
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [citySlug, setCitySlug] = useState("mohali");
  const [projectType, setProjectType] = useState<ProjectType>("plots");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isAdmin =
    profile?.role === "admin" ||
    profile?.role === "sysadmin" ||
    profile?.role === "superadmin";

  useEffect(() => {
    fetch("/api/builders").then((r) => r.json()).then((d) => setBuilders(d.builders || []));
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      const token = await user.getIdToken();
      const res = await fetch("/api/builder-projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          builderId,
          name,
          slug: slug || slugify(name),
          citySlug,
          projectType,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      router.push(appPath(`/admin/projects/${data.id}`));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed");
    } finally {
      setLoading(false);
    }
  }

  if (!isAdmin) {
    return (
      <BuilderAdminShell title="New Project">
        <p className="text-red-600">Admin access required.</p>
      </BuilderAdminShell>
    );
  }

  return (
    <BuilderAdminShell title="New Project">
      <form onSubmit={handleSubmit} className="max-w-lg space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium">Builder *</label>
          <select
            required
            value={builderId}
            onChange={(e) => setBuilderId(e.target.value)}
            className="w-full rounded-lg border border-[var(--border)] px-3 py-2"
          >
            <option value="">Select builder</option>
            {builders.map((b) => (
              <option key={b.id} value={b.id}>{b.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Project name *</label>
          <input
            required
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (!slug) setSlug(slugify(e.target.value));
            }}
            className="w-full rounded-lg border border-[var(--border)] px-3 py-2"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Slug *</label>
          <input
            required
            value={slug}
            onChange={(e) => setSlug(slugify(e.target.value))}
            className="w-full rounded-lg border border-[var(--border)] px-3 py-2"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">City slug *</label>
          <input
            required
            value={citySlug}
            onChange={(e) => setCitySlug(e.target.value.toLowerCase())}
            placeholder="mohali"
            className="w-full rounded-lg border border-[var(--border)] px-3 py-2"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Project type</label>
          <select
            value={projectType}
            onChange={(e) => setProjectType(e.target.value as ProjectType)}
            className="w-full rounded-lg border border-[var(--border)] px-3 py-2"
          >
            <option value="plots">Plots</option>
            <option value="villas">Villas</option>
            <option value="apartments">Apartments</option>
            <option value="commercial">Commercial</option>
            <option value="farmhouse">Farmhouse</option>
            <option value="mixed-use">Mixed-use</option>
          </select>
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button type="submit" disabled={loading} className="rp-btn rp-btn-primary">
          {loading ? "Creating..." : "Create Project"}
        </button>
      </form>
    </BuilderAdminShell>
  );
}

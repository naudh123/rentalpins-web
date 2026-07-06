"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/AuthProvider";
import PostAuthGate from "@/components/post/PostAuthGate";
import { slugify } from "@/lib/builders/format";
import { TRICITY_PROJECT_CITIES } from "@/lib/builders/tricity-cities";
import { appPath } from "@/lib/config";
import type { ProjectType } from "@/lib/types/builder-microsite";

export default function PostProjectForm() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [companyName, setCompanyName] = useState("");
  const [projectName, setProjectName] = useState("");
  const [citySlug, setCitySlug] = useState("mohali");
  const [projectType, setProjectType] = useState<ProjectType>("plots");
  const [phone, setPhone] = useState("");
  const [description, setDescription] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (loading) {
    return <p className="text-[var(--muted)]">Loading…</p>;
  }

  if (!user) {
    return (
      <PostAuthGate
        redirectPath="/projects/post"
        title="List your project"
        description="Sign in with Google or phone to create your project microsite on RentalPins. Enquiries are handled by our team."
        badge="Developer listing"
      />
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const token = await user!.getIdToken();
      const res = await fetch("/api/my-projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          companyName,
          projectName,
          citySlug,
          projectType,
          phone: phone || undefined,
          description: description || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create project");
      router.push(appPath(`/my-projects/${data.projectId}`));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="rounded-xl border border-[var(--sale-border)] bg-[var(--sale-ivory-elevated)] p-4 text-sm text-[var(--muted)]">
        Chandigarh Tricity only — Mohali, Chandigarh, Panchkula, Zirakpur, Kharar, Landran & Banur.
        Every visitor enquiry captures their phone and email for RentalPins lead sales.
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Company / developer name *</label>
        <input
          required
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
          className="lux-input"
          placeholder="ABC Developers"
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium">Project name *</label>
        <input
          required
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
          className="lux-input"
          placeholder="Green Valley Plots"
        />
        {projectName && (
          <p className="mt-1 text-xs text-[var(--muted)]">
            URL slug: {slugify(projectName)}
          </p>
        )}
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium">City *</label>
          <select
            value={citySlug}
            onChange={(e) => setCitySlug(e.target.value)}
            className="lux-input"
          >
            {TRICITY_PROJECT_CITIES.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Project type *</label>
          <select
            value={projectType}
            onChange={(e) => setProjectType(e.target.value as ProjectType)}
            className="lux-input"
          >
            <option value="plots">Plots / Colonies</option>
            <option value="villas">Villas</option>
            <option value="apartments">Apartments</option>
            <option value="commercial">Commercial</option>
            <option value="industrial">Industrial / Warehouse</option>
            <option value="farmhouse">Farmhouse</option>
            <option value="mixed-use">Mixed use</option>
          </select>
        </div>
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium">Your phone</label>
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="lux-input"
          placeholder="+91 98765 43210"
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium">Short description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="lux-input resize-none"
          placeholder="Premium plotted development near..."
        />
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button type="submit" disabled={busy} className="lux-btn-gold w-full sm:w-auto">
        {busy ? "Creating…" : "Create project"}
      </button>
    </form>
  );
}

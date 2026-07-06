"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/components/providers/AuthProvider";
import BuilderAdminShell from "@/components/builders/BuilderAdminShell";
import { appPath } from "@/lib/config";
import { builderPath } from "@/lib/builders/project-paths";
import type { Builder } from "@/lib/types/builder-microsite";

export default function AdminBuildersPage() {
  const { user, profile, loading: authLoading } = useAuth();
  const [builders, setBuilders] = useState<Builder[]>([]);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);
  const [seedingTricity, setSeedingTricity] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

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
    fetch("/api/builders")
      .then((r) => r.json())
      .then((d) => setBuilders(d.builders || []))
      .finally(() => setLoading(false));
  }, [user, isAdmin, authLoading]);

  async function seedSample() {
    if (!user) return;
    setSeeding(true);
    setMessage(null);
    try {
      const token = await user.getIdToken();
      const res = await fetch("/api/builders/seed", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Seed failed");
      setMessage(`Seeded! Visit ${data.urls?.builder}`);
      const list = await fetch("/api/builders").then((r) => r.json());
      setBuilders(list.builders || []);
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Seed failed");
    } finally {
      setSeeding(false);
    }
  }

  async function seedTricity() {
    if (!user) return;
    setSeedingTricity(true);
    setMessage(null);
    try {
      const token = await user.getIdToken();
      const res = await fetch("/api/builders/seed-tricity", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Seed failed");
      setMessage(
        `${data.message} (${data.projectsCreated} new projects, ${data.projectsSkipped} skipped)`
      );
      const list = await fetch("/api/builders").then((r) => r.json());
      setBuilders(list.builders || []);
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Tricity seed failed");
    } finally {
      setSeedingTricity(false);
    }
  }

  if (authLoading || loading) {
    return (
      <BuilderAdminShell title="Builders">
        <p className="text-[var(--muted)]">Loading...</p>
      </BuilderAdminShell>
    );
  }

  if (!user || !isAdmin) {
    return (
      <BuilderAdminShell title="Builders">
        <div className="rounded-xl border border-[var(--border)] bg-white p-6">
          {!user ? (
            <>
              <p className="text-[var(--text)]">Sign in to manage builder profiles.</p>
              <Link
                href={appPath("/profile")}
                className="rp-btn rp-btn-primary mt-4 inline-block text-sm"
              >
                Sign in
              </Link>
            </>
          ) : (
            <>
              <p className="text-red-600">
                Admin access required. Your account role is &quot;{profile?.role ?? "user"}&quot;.
              </p>
              <p className="mt-2 text-sm text-[var(--muted)]">
                In Firebase Console → Firestore → users → your uid → set{" "}
                <code className="rounded bg-[var(--bg-elevated)] px-1">role</code> to{" "}
                <code className="rounded bg-[var(--bg-elevated)] px-1">admin</code>.
              </p>
            </>
          )}
        </div>
      </BuilderAdminShell>
    );
  }

  return (
    <BuilderAdminShell title="Builders">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <p className="text-[var(--muted)]">{builders.length} builder(s)</p>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={seedTricity}
            disabled={seedingTricity || seeding}
            className="rp-btn rp-btn-secondary text-sm"
          >
            {seedingTricity ? "Seeding Tricity..." : "Seed Tricity Catalog"}
          </button>
          <button
            type="button"
            onClick={seedSample}
            disabled={seeding || seedingTricity}
            className="rp-btn rp-btn-secondary text-sm"
          >
            {seeding ? "Seeding..." : "Seed Sample Data"}
          </button>
          <Link href={appPath("/admin/builders/new")} className="rp-btn rp-btn-primary text-sm">
            + New Builder
          </Link>
        </div>
      </div>

      {message && (
        <p className={`mb-4 text-sm ${message.includes("failed") || message.includes("Failed") ? "text-red-600" : "text-green-600"}`}>
          {message}
        </p>
      )}

      <div className="overflow-x-auto rounded-xl border border-[var(--border)] bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-[var(--bg-elevated)] text-xs uppercase text-[var(--muted)]">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Slug</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Plan</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border-subtle)]">
            {builders.map((b) => (
              <tr key={b.id}>
                <td className="px-4 py-3 font-medium">{b.name}</td>
                <td className="px-4 py-3 text-[var(--muted)]">{b.slug}</td>
                <td className="px-4 py-3 capitalize">{b.status}</td>
                <td className="px-4 py-3 capitalize">{b.builderPlan}</td>
                <td className="px-4 py-3">
                  <Link
                    href={appPath(`/admin/builders/${b.id}`)}
                    className="text-[var(--brand-navy)] hover:underline"
                  >
                    Edit
                  </Link>
                  {b.status === "published" && (
                    <>
                      {" · "}
                      <Link
                        href={appPath(builderPath(b.slug))}
                        className="text-[var(--brand-orange)] hover:underline"
                        target="_blank"
                      >
                        View
                      </Link>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </BuilderAdminShell>
  );
}

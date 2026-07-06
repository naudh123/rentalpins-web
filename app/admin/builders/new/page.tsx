"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/AuthProvider";
import BuilderAdminShell from "@/components/builders/BuilderAdminShell";
import { slugify } from "@/lib/builders/format";
import { appPath } from "@/lib/config";

export default function NewBuilderPage() {
  const { user, profile } = useAuth();
  const router = useRouter();
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isAdmin =
    profile?.role === "admin" ||
    profile?.role === "sysadmin" ||
    profile?.role === "superadmin";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      const token = await user.getIdToken();
      const res = await fetch("/api/builders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name,
          slug: slug || slugify(name),
          description,
          phone,
          email,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      router.push(appPath(`/admin/builders/${data.id}`));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create");
    } finally {
      setLoading(false);
    }
  }

  if (!isAdmin) {
    return (
      <BuilderAdminShell title="New Builder">
        <p className="text-red-600">Admin access required.</p>
      </BuilderAdminShell>
    );
  }

  return (
    <BuilderAdminShell title="New Builder">
      <form onSubmit={handleSubmit} className="max-w-lg space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium">Builder name *</label>
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
          <label className="mb-1 block text-sm font-medium">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="w-full rounded-lg border border-[var(--border)] px-3 py-2"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Phone</label>
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full rounded-lg border border-[var(--border)] px-3 py-2"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border border-[var(--border)] px-3 py-2"
          />
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button type="submit" disabled={loading} className="rp-btn rp-btn-primary">
          {loading ? "Creating..." : "Create Builder"}
        </button>
      </form>
    </BuilderAdminShell>
  );
}

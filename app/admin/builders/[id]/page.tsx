"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useAuth } from "@/components/providers/AuthProvider";
import BuilderAdminShell from "@/components/builders/BuilderAdminShell";
import BuilderAssetUploadField from "@/components/builders/BuilderAssetUploadField";
import { builderPath } from "@/lib/builders/project-paths";
import { appPath } from "@/lib/config";
import type { Builder } from "@/lib/types/builder-microsite";

export default function EditBuilderPage() {
  const { id } = useParams<{ id: string }>();
  const { user, profile } = useAuth();
  const [builder, setBuilder] = useState<Builder | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const isAdmin =
    profile?.role === "admin" ||
    profile?.role === "sysadmin" ||
    profile?.role === "superadmin";

  useEffect(() => {
    if (!id) return;
    fetch(`/api/builders/${id}`)
      .then((r) => r.json())
      .then((d) => setBuilder(d.builder || null));
  }, [id]);

  async function save(patch: Record<string, unknown>, options?: { upload?: boolean }) {
    if (!user || !id) return;
    setSaving(true);
    setMessage(null);
    try {
      const token = await user.getIdToken();
      const res = await fetch(`/api/builders/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(patch),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Save failed");
      setBuilder(data.builder);
      setMessage(options?.upload ? "Upload saved!" : "Saved!");
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  if (!isAdmin) {
    return (
      <BuilderAdminShell title="Edit Builder">
        <p className="text-red-600">Admin access required.</p>
      </BuilderAdminShell>
    );
  }

  if (!builder) {
    return (
      <BuilderAdminShell title="Edit Builder">
        <p className="text-[var(--muted)]">Loading...</p>
      </BuilderAdminShell>
    );
  }

  return (
    <BuilderAdminShell title={`Edit: ${builder.name}`}>
      <div className="mb-4 flex flex-wrap gap-2">
        {builder.status === "published" && (
          <Link
            href={appPath(builderPath(builder.slug))}
            target="_blank"
            className="rp-btn rp-btn-secondary text-sm"
          >
            View Public Page
          </Link>
        )}
        <Link href={appPath("/admin/projects/new")} className="rp-btn rp-btn-primary text-sm">
          + Add Project
        </Link>
      </div>

      <BuilderEditForm
        builder={builder}
        saving={saving}
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

function BuilderEditForm({
  builder,
  saving,
  onSave,
}: {
  builder: Builder;
  saving: boolean;
  onSave: (patch: Record<string, unknown>, options?: { upload?: boolean }) => Promise<void>;
}) {
  const [form, setForm] = useState(builder);

  useEffect(() => {
    setForm(builder);
  }, [builder]);

  function field<K extends keyof Builder>(key: K, value: Builder[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function saveUpload(patch: Record<string, unknown>) {
    setForm((f) => ({ ...f, ...patch }));
    await onSave(patch, { upload: true });
  }

  async function appendGallery(url: string) {
    let galleryUrls: string[] = [];
    setForm((f) => {
      galleryUrls = [...f.galleryUrls, url];
      return { ...f, galleryUrls };
    });
    await onSave({ galleryUrls }, { upload: true });
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSave({
          name: form.name,
          description: form.description,
          phone: form.phone,
          whatsapp: form.whatsapp,
          email: form.email,
          website: form.website,
          address: form.address,
          city: form.city,
          state: form.state,
          reraNumber: form.reraNumber,
          establishedYear: form.establishedYear,
          logoUrl: form.logoUrl,
          coverImageUrl: form.coverImageUrl,
          galleryUrls: form.galleryUrls,
          status: form.status,
          builderPlan: form.builderPlan,
          isFeatured: form.isFeatured,
        });
      }}
      className="max-w-2xl space-y-4"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Name" value={form.name} onChange={(v) => field("name", v)} />
        <div>
          <label className="mb-1 block text-sm font-medium">Status</label>
          <select
            value={form.status}
            onChange={(e) => field("status", e.target.value as Builder["status"])}
            className="w-full rounded-lg border border-[var(--border)] px-3 py-2"
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </select>
        </div>
      </div>
      <Field
        label="Description"
        value={form.description}
        onChange={(v) => field("description", v)}
        multiline
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Phone" value={form.phone || ""} onChange={(v) => field("phone", v || null)} />
        <Field label="WhatsApp" value={form.whatsapp || ""} onChange={(v) => field("whatsapp", v || null)} />
        <Field label="Email" value={form.email || ""} onChange={(v) => field("email", v || null)} />
        <Field label="Website" value={form.website || ""} onChange={(v) => field("website", v || null)} />
        <Field label="RERA" value={form.reraNumber || ""} onChange={(v) => field("reraNumber", v || null)} />
        <div>
          <label className="mb-1 block text-sm font-medium">Plan</label>
          <select
            value={form.builderPlan}
            onChange={(e) => field("builderPlan", e.target.value as Builder["builderPlan"])}
            className="w-full rounded-lg border border-[var(--border)] px-3 py-2"
          >
            <option value="basic">Basic</option>
            <option value="microsite">Microsite</option>
            <option value="premium">Premium Plot Finder</option>
            <option value="enterprise">Enterprise</option>
          </select>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <BuilderAssetUploadField
          label="Logo"
          kind="builder-logo"
          entityId={builder.id}
          existingUrl={form.logoUrl}
          disabled={saving}
          onUploaded={(url) => saveUpload({ logoUrl: url })}
        />
        <BuilderAssetUploadField
          label="Cover banner"
          kind="builder-cover"
          entityId={builder.id}
          existingUrl={form.coverImageUrl}
          disabled={saving}
          onUploaded={(url) => saveUpload({ coverImageUrl: url })}
          aspectClass="aspect-[16/7]"
        />
      </div>

      <BuilderAssetUploadField
        label="Add gallery photo"
        kind="builder-gallery"
        entityId={builder.id}
        disabled={saving}
        onUploaded={(url) => appendGallery(url)}
      />
      {form.galleryUrls.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {form.galleryUrls.map((url) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={url} src={url} alt="" className="h-16 w-16 rounded-lg object-cover" />
          ))}
        </div>
      )}

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={form.isFeatured}
          onChange={(e) => field("isFeatured", e.target.checked)}
        />
        Featured builder
      </label>
      <button type="submit" disabled={saving} className="rp-btn rp-btn-primary">
        {saving ? "Saving..." : "Save Changes"}
      </button>
    </form>
  );
}

function Field({
  label,
  value,
  onChange,
  multiline,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  multiline?: boolean;
}) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium">{label}</label>
      {multiline ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={4}
          className="w-full rounded-lg border border-[var(--border)] px-3 py-2"
        />
      ) : (
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full rounded-lg border border-[var(--border)] px-3 py-2"
        />
      )}
    </div>
  );
}

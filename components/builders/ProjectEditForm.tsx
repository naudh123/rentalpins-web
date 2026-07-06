"use client";

import { useEffect, useState } from "react";
import BuilderAssetUploadField from "@/components/builders/BuilderAssetUploadField";
import BuilderPdfUploadField from "@/components/builders/BuilderPdfUploadField";
import type { BuilderProject, ProjectStatus } from "@/lib/types/builder-microsite";

interface ProjectEditFormProps {
  project: BuilderProject;
  projectId: string;
  saving: boolean;
  allowFeatured?: boolean;
  onSave: (patch: Record<string, unknown>, options?: { upload?: boolean }) => Promise<void>;
}

export default function ProjectEditForm({
  project,
  projectId,
  saving,
  allowFeatured = false,
  onSave,
}: ProjectEditFormProps) {
  const [form, setForm] = useState(project);

  useEffect(() => setForm(project), [project]);

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
          status: form.status,
          address: form.address,
          reraNumber: form.reraNumber,
          priceMin: form.priceMin,
          priceMax: form.priceMax,
          sizeMin: form.sizeMin,
          sizeMax: form.sizeMax,
          possessionDate: form.possessionDate,
          latitude: form.latitude,
          longitude: form.longitude,
          amenities: form.amenities,
          galleryUrls: form.galleryUrls,
          brochureUrl: form.brochureUrl,
          paymentPlan: form.paymentPlan,
          masterPlanImageUrl: form.masterPlanImageUrl,
          isPublished: form.isPublished,
          isFeatured: allowFeatured ? form.isFeatured : undefined,
          seoTitle: form.seoTitle,
          seoDescription: form.seoDescription,
        });
      }}
      className="max-w-2xl space-y-4"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium">Name</label>
          <input
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full rounded-lg border border-[var(--border)] px-3 py-2"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Status</label>
          <select
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value as ProjectStatus })}
            className="w-full rounded-lg border border-[var(--border)] px-3 py-2"
          >
            <option value="upcoming">Upcoming</option>
            <option value="ongoing">Ongoing</option>
            <option value="ready">Ready</option>
            <option value="sold-out">Sold Out</option>
          </select>
        </div>
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium">Description</label>
        <textarea
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          rows={4}
          className="w-full rounded-lg border border-[var(--border)] px-3 py-2"
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium">Price min (INR)</label>
          <input
            type="number"
            value={form.priceMin ?? ""}
            onChange={(e) =>
              setForm({ ...form, priceMin: e.target.value ? Number(e.target.value) : null })
            }
            className="w-full rounded-lg border border-[var(--border)] px-3 py-2"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Price max (INR)</label>
          <input
            type="number"
            value={form.priceMax ?? ""}
            onChange={(e) =>
              setForm({ ...form, priceMax: e.target.value ? Number(e.target.value) : null })
            }
            className="w-full rounded-lg border border-[var(--border)] px-3 py-2"
          />
        </div>
      </div>

      <div className="space-y-6 rounded-xl border border-[var(--border)] bg-white p-4">
        <h3 className="font-medium">Media uploads</h3>
        <BuilderPdfUploadField
          projectId={projectId}
          existingUrl={form.brochureUrl}
          disabled={saving}
          onUploaded={(url) => saveUpload({ brochureUrl: url })}
        />
        <BuilderAssetUploadField
          label="Master plan preview image"
          kind="project-master-plan"
          entityId={projectId}
          pathExtra="preview"
          existingUrl={form.masterPlanImageUrl}
          disabled={saving}
          onUploaded={(url) => saveUpload({ masterPlanImageUrl: url })}
        />
        <BuilderAssetUploadField
          label="Add gallery photo"
          kind="project-gallery"
          entityId={projectId}
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
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Amenities (comma-separated)</label>
        <input
          value={form.amenities.join(", ")}
          onChange={(e) =>
            setForm({
              ...form,
              amenities: e.target.value
                .split(",")
                .map((s) => s.trim())
                .filter(Boolean),
            })
          }
          className="w-full rounded-lg border border-[var(--border)] px-3 py-2"
        />
      </div>
      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={form.isPublished}
          onChange={(e) => setForm({ ...form, isPublished: e.target.checked })}
        />
        Published — live on RentalPins
      </label>
      {allowFeatured && (
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={form.isFeatured}
            onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })}
          />
          Featured project
        </label>
      )}
      <button type="submit" disabled={saving} className="rp-btn rp-btn-primary">
        {saving ? "Saving..." : "Save Project"}
      </button>
    </form>
  );
}

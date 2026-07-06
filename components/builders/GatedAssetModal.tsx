"use client";

import { useState } from "react";
import ProjectLeadForm from "@/components/builders/ProjectLeadForm";
import type { LeadSource } from "@/lib/types/builder-microsite";

interface GatedAssetModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description: string;
  assetUrl: string;
  builderId: string;
  projectId: string;
  projectName: string;
  source: LeadSource;
}

export default function GatedAssetModal({
  open,
  onClose,
  title,
  description,
  assetUrl,
  builderId,
  projectId,
  projectName,
  source,
}: GatedAssetModalProps) {
  const [unlocked, setUnlocked] = useState(false);

  if (!open) return null;

  function handleSuccess() {
    setUnlocked(true);
    window.open(assetUrl, "_blank", "noopener,noreferrer");
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/55 p-4 sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="gated-asset-title"
    >
      <div className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-2xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 id="gated-asset-title" className="font-serif text-xl font-bold text-[var(--lux-primary)]">
              {title}
            </h2>
            <p className="mt-2 text-sm text-[var(--muted)]">{description}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="shrink-0 rounded-full p-2 text-[var(--muted)] hover:bg-[var(--bg-elevated)]"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {unlocked ? (
          <div className="mt-6 space-y-3 text-center">
            <p className="text-sm text-emerald-800">Download opened in a new tab.</p>
            <a
              href={assetUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="lux-btn-gold inline-block w-full py-3 text-center"
            >
              Open again
            </a>
            <button type="button" onClick={onClose} className="lux-btn-outline w-full py-3">
              Done
            </button>
          </div>
        ) : (
          <div className="mt-6">
            <ProjectLeadForm
              builderId={builderId}
              projectId={projectId}
              source={source}
              projectName={projectName}
              compact
              onSuccess={handleSuccess}
            />
          </div>
        )}
      </div>
    </div>
  );
}

"use client";

import { useRef, useState } from "react";
import { useAuth } from "@/components/providers/AuthProvider";
import { uploadBuilderPdf } from "@/lib/builder-storage-upload";

interface BuilderPdfUploadFieldProps {
  projectId: string;
  existingUrl?: string | null;
  onUploaded: (url: string) => void | Promise<void>;
  disabled?: boolean;
}

export default function BuilderPdfUploadField({
  projectId,
  existingUrl,
  onUploaded,
  disabled,
}: BuilderPdfUploadFieldProps) {
  const { user } = useAuth();
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(
    existingUrl ? "Current brochure" : null
  );

  async function handleFile(file: File | null) {
    if (!file || !user) return;
    setError(null);
    setUploading(true);
    setProgress(0);
    setFileName(file.name);
    try {
      const url = await uploadBuilderPdf(user.uid, file, projectId, setProgress);
      await onUploaded(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
      setFileName(existingUrl ? "Current brochure" : null);
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium">Brochure PDF</label>
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          disabled={disabled || uploading || !user}
          onClick={() => inputRef.current?.click()}
          className="rp-btn rp-btn-secondary text-sm"
        >
          {uploading ? `Uploading ${progress}%` : "Upload PDF"}
        </button>
        {fileName && <span className="text-sm text-[var(--muted)]">{fileName}</span>}
        {existingUrl && (
          <a
            href={existingUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-[var(--brand-navy)] hover:underline"
          >
            View current
          </a>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="application/pdf"
        className="sr-only"
        disabled={disabled || uploading || !user}
        onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
      />
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}

"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useAuth } from "@/components/providers/AuthProvider";
import {
  uploadBuilderImage,
  type BuilderAssetKind,
} from "@/lib/builder-storage-upload";

interface BuilderAssetUploadFieldProps {
  label: string;
  kind: Exclude<BuilderAssetKind, "project-brochure">;
  entityId: string;
  /** Extra segment for master-plan angle id, etc. */
  pathExtra?: string;
  existingUrl?: string | null;
  onUploaded: (url: string) => void | Promise<void>;
  disabled?: boolean;
  aspectClass?: string;
}

export default function BuilderAssetUploadField({
  label,
  kind,
  entityId,
  pathExtra,
  existingUrl,
  onUploaded,
  disabled,
  aspectClass = "aspect-[4/3]",
}: BuilderAssetUploadFieldProps) {
  const { user } = useAuth();
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(existingUrl || null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setPreview(existingUrl || null);
  }, [existingUrl]);

  const handleFile = useCallback(
    async (file: File | null) => {
      if (!file || !user || !entityId) return;
      if (!file.type.startsWith("image/")) {
        setError("Please choose an image file.");
        return;
      }
      setError(null);
      setUploading(true);
      setProgress(0);
      const localPreview = URL.createObjectURL(file);
      setPreview(localPreview);
      try {
        const url = await uploadBuilderImage(
          user.uid,
          file,
          kind,
          entityId,
          pathExtra,
          setProgress
        );
        await onUploaded(url);
        setPreview(url);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Upload failed");
        setPreview(existingUrl || null);
      } finally {
        URL.revokeObjectURL(localPreview);
        setUploading(false);
        setProgress(0);
      }
    },
    [user, entityId, kind, pathExtra, onUploaded, existingUrl]
  );

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium">{label}</label>
      <div
        role="button"
        tabIndex={disabled || uploading ? -1 : 0}
        onClick={() => !disabled && !uploading && inputRef.current?.click()}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            if (!disabled && !uploading) inputRef.current?.click();
          }
        }}
        className={`relative overflow-hidden rounded-xl border-2 border-dashed border-[var(--border)] bg-[var(--surface)] ${
          disabled || uploading ? "cursor-not-allowed opacity-60" : "cursor-pointer hover:border-[var(--accent)]/50"
        }`}
      >
        {preview ? (
          <div className={`relative w-full ${aspectClass}`}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={preview} alt="" className="h-full w-full object-cover" />
            {uploading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-sm text-white">
                Uploading {progress}%
              </div>
            )}
          </div>
        ) : (
          <div className={`flex ${aspectClass} flex-col items-center justify-center gap-1 px-4 text-center`}>
            <span className="text-xl opacity-60">📷</span>
            <p className="text-xs text-[var(--muted)]">Click to upload</p>
          </div>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="sr-only"
        disabled={disabled || uploading || !user}
        onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
      />
      {error && <p className="text-xs text-red-600">{error}</p>}
      {!user && <p className="text-xs text-[var(--muted)]">Sign in to upload</p>}
    </div>
  );
}

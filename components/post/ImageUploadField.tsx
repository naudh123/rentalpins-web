"use client";

import { useCallback, useEffect, useRef, useState } from "react";

interface Props {
  file: File | null;
  onChange: (file: File | null) => void;
  /** Shown when editing a draft without replacing the photo yet. */
  existingImageUrl?: string | null;
  disabled?: boolean;
}

export default function ImageUploadField({
  file,
  onChange,
  existingImageUrl,
  disabled,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);

  useEffect(() => {
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    }
    setPreviewUrl(existingImageUrl || null);
  }, [file, existingImageUrl]);

  const pickFile = useCallback(
    (next: File | null) => {
      if (!next || !next.type.startsWith("image/")) {
        onChange(null);
        return;
      }
      onChange(next);
    },
    [onChange]
  );

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      if (disabled) return;
      const dropped = e.dataTransfer.files?.[0];
      if (dropped) pickFile(dropped);
    },
    [disabled, pickFile]
  );

  return (
    <div className="space-y-2">
      <div
        role="button"
        tabIndex={disabled ? -1 : 0}
        onKeyDown={(e) => {
          if (disabled) return;
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            inputRef.current?.click();
          }
        }}
        onClick={() => !disabled && inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          if (!disabled) setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
        className={`relative overflow-hidden rounded-xl border-2 border-dashed transition-colors ${
          dragOver
            ? "border-[var(--accent)] bg-[var(--accent)]/5"
            : "border-[var(--border)] bg-[var(--surface)]"
        } ${disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer hover:border-[var(--accent)]/50"}`}
      >
        {previewUrl ? (
          <div className="relative aspect-[4/3] w-full bg-[var(--border)]/30">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={previewUrl}
              alt="Cover photo preview"
              className="h-full w-full object-cover"
            />
            {!disabled && (
              <p className="absolute bottom-0 inset-x-0 bg-black/50 px-3 py-2 text-center text-xs text-white">
                Tap or drop to replace
              </p>
            )}
          </div>
        ) : (
          <div className="flex aspect-[4/3] flex-col items-center justify-center gap-2 px-4 py-8 text-center">
            <span className="text-2xl opacity-60" aria-hidden>
              📷
            </span>
            <p className="text-sm font-medium text-[var(--brand-navy)]">
              Add cover photo
            </p>
            <p className="text-xs text-[var(--muted)]">
              Drag & drop or click to choose · JPG, PNG, WebP
            </p>
          </div>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="sr-only"
        disabled={disabled}
        onChange={(e) => pickFile(e.target.files?.[0] ?? null)}
      />

      {(file || existingImageUrl) && (
        <div className="flex items-center justify-between gap-2 text-xs text-[var(--muted)]">
          <span className="truncate" title={file?.name ?? "Current cover"}>
            {file ? file.name : "Current cover photo"}
          </span>
          {!disabled && (
            <button
              type="button"
              className="shrink-0 text-[var(--accent)] hover:underline"
              onClick={(e) => {
                e.stopPropagation();
                onChange(null);
                if (inputRef.current) inputRef.current.value = "";
              }}
            >
              Remove
            </button>
          )}
        </div>
      )}
    </div>
  );
}

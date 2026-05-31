"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export const MAX_LISTING_PHOTOS = 8;

export type ListingPhotoSlot =
  | {
      id: string;
      kind: "saved";
      full: string;
      thumbnail: string;
      icon: string;
    }
  | { id: string; kind: "new"; file: File };

interface Props {
  slots: ListingPhotoSlot[];
  onChange: (slots: ListingPhotoSlot[]) => void;
  disabled?: boolean;
}

function fileKey(file: File): string {
  return `${file.name}-${file.size}-${file.lastModified}`;
}

function newId(): string {
  return `ph_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

export default function ListingPhotosField({ slots, onChange, disabled }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [previewUrls, setPreviewUrls] = useState<Record<string, string>>({});

  const slotsRemaining = MAX_LISTING_PHOTOS - slots.length;

  useEffect(() => {
    const next: Record<string, string> = {};
    const newFiles = slots.filter((s): s is Extract<ListingPhotoSlot, { kind: "new" }> => s.kind === "new");

    for (const slot of newFiles) {
      const key = fileKey(slot.file);
      if (!previewUrls[key]) {
        next[key] = URL.createObjectURL(slot.file);
      } else {
        next[key] = previewUrls[key];
      }
    }

    Object.entries(previewUrls).forEach(([key, url]) => {
      if (!newFiles.some((s) => fileKey(s.file) === key)) {
        URL.revokeObjectURL(url);
      }
    });

    setPreviewUrls(next);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slots]);

  const addFiles = useCallback(
    (incoming: FileList | File[]) => {
      const list = Array.from(incoming).filter((f) => f.type.startsWith("image/"));
      if (!list.length || slotsRemaining <= 0) return;
      const added: ListingPhotoSlot[] = list.slice(0, slotsRemaining).map((file) => ({
        id: newId(),
        kind: "new" as const,
        file,
      }));
      onChange([...slots, ...added]);
    },
    [onChange, slots, slotsRemaining]
  );

  const removeAt = (index: number) => {
    onChange(slots.filter((_, i) => i !== index));
  };

  const setCover = (index: number) => {
    if (index === 0) return;
    const next = [...slots];
    const [item] = next.splice(index, 1);
    onChange([item, ...next]);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-baseline justify-between gap-2">
        <p className="text-xs text-[var(--muted)]">
          First photo is the cover on map & search. Up to {MAX_LISTING_PHOTOS} photos.
        </p>
        <span className="text-xs font-medium text-[var(--brand-navy)]">
          {slots.length}/{MAX_LISTING_PHOTOS}
        </span>
      </div>

      {slots.length > 0 && (
        <ul className="grid grid-cols-3 gap-2 sm:grid-cols-4">
          {slots.map((slot, index) => {
            const url =
              slot.kind === "saved"
                ? slot.thumbnail || slot.full
                : previewUrls[fileKey(slot.file)] || "";

            return (
              <li
                key={slot.id}
                className="relative aspect-square overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--bg-elevated)]"
              >
                {url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={url} alt="" className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full items-center justify-center text-lg opacity-40">
                    …
                  </div>
                )}
                {index === 0 && (
                  <span className="absolute left-1 top-1 rounded bg-[var(--brand-navy)] px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-white">
                    Cover
                  </span>
                )}
                {!disabled && (
                  <div className="absolute inset-x-0 bottom-0 flex gap-0.5 bg-black/55 p-1">
                    {index > 0 && (
                      <button
                        type="button"
                        className="flex-1 rounded px-1 py-0.5 text-[9px] font-medium text-white hover:bg-white/20"
                        onClick={() => setCover(index)}
                      >
                        Cover
                      </button>
                    )}
                    <button
                      type="button"
                      className="flex-1 rounded px-1 py-0.5 text-[9px] font-medium text-white hover:bg-white/20"
                      onClick={() => removeAt(index)}
                    >
                      Remove
                    </button>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}

      {slotsRemaining > 0 && (
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
          onDrop={(e) => {
            e.preventDefault();
            setDragOver(false);
            if (disabled) return;
            if (e.dataTransfer.files?.length) addFiles(e.dataTransfer.files);
          }}
          className={`rounded-xl border-2 border-dashed px-4 py-6 text-center transition-colors ${
            dragOver
              ? "border-[var(--accent)] bg-[var(--accent)]/5"
              : "border-[var(--border)] hover:border-[var(--accent)]/50"
          } ${disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer"}`}
        >
          <p className="text-sm font-medium text-[var(--brand-navy)]">
            {slots.length === 0 ? "Add photos" : "Add more photos"}
          </p>
          <p className="mt-1 text-xs text-[var(--muted)]">
            Drag & drop or click · {slotsRemaining} slot{slotsRemaining === 1 ? "" : "s"} left
          </p>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="sr-only"
        disabled={disabled}
        onChange={(e) => {
          if (e.target.files?.length) addFiles(e.target.files);
          e.target.value = "";
        }}
      />
    </div>
  );
}

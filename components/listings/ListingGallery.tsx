"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { trackEvent } from "@/lib/ga4";

interface Props {
  images: string[];
  title: string;
  listingId?: string;
}

type PhotoSource =
  | "inline_thumb"
  | "inline_arrow"
  | "inline_swipe"
  | "lightbox_thumb"
  | "lightbox_arrow"
  | "lightbox_swipe";

function Lightbox({
  images,
  title,
  listingId,
  startIndex,
  onClose,
}: {
  images: string[];
  title: string;
  listingId?: string;
  startIndex: number;
  onClose: () => void;
}) {
  const [index, setIndex] = useState(startIndex);
  const touchStartX = useRef<number | null>(null);

  const trackPhoto = useCallback(
    (newIndex: number, source: PhotoSource) => {
      if (!listingId) return;
      trackEvent("listing_gallery_photo_changed", {
        listing_id: listingId,
        photo_index: newIndex + 1,
        photo_count: images.length,
        source,
      });
    },
    [images.length, listingId]
  );

  const goTo = useCallback(
    (newIndex: number, source: PhotoSource) => {
      setIndex(newIndex);
      trackPhoto(newIndex, source);
    },
    [trackPhoto]
  );

  const prev = useCallback(() => {
    const newIndex = index === 0 ? images.length - 1 : index - 1;
    goTo(newIndex, "lightbox_arrow");
  }, [goTo, images.length, index]);

  const next = useCallback(() => {
    const newIndex = (index + 1) % images.length;
    goTo(newIndex, "lightbox_arrow");
  }, [goTo, images.length, index]);

  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    closeRef.current?.focus();
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose, prev, next]);

  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, []);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(delta) > 50) {
      const newIndex =
        delta < 0
          ? (index + 1) % images.length
          : index === 0
            ? images.length - 1
            : index - 1;
      goTo(newIndex, "lightbox_swipe");
    }
    touchStartX.current = null;
  };

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col bg-black/95"
      role="dialog"
      aria-modal="true"
      aria-label="Photo viewer"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className="flex items-center justify-between px-4 py-3 text-white/70">
        <span className="text-sm">
          {index + 1} / {images.length}
        </span>
        <button
          ref={closeRef}
          type="button"
          aria-label="Close photo viewer"
          onClick={onClose}
          className="rounded-full p-1 text-2xl leading-none text-white hover:bg-white/10"
        >
          ×
        </button>
      </div>

      <div className="relative flex flex-1 items-center justify-center">
        <div className="relative h-full w-full">
          <Image
            key={images[index]}
            src={images[index]}
            alt={`${title} — photo ${index + 1}`}
            fill
            className="object-contain"
            sizes="100vw"
            priority
          />
        </div>

        {images.length > 1 && (
          <>
            <button
              type="button"
              aria-label="Previous photo"
              onClick={prev}
              className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-black/50 px-4 py-3 text-2xl text-white hover:bg-black/70"
            >
              ‹
            </button>
            <button
              type="button"
              aria-label="Next photo"
              onClick={next}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-black/50 px-4 py-3 text-2xl text-white hover:bg-black/70"
            >
              ›
            </button>
          </>
        )}
      </div>

      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto px-4 py-3">
          {images.map((url, i) => (
            <button
              key={`${url}-${i}`}
              type="button"
              onClick={() => {
                if (i !== index) goTo(i, "lightbox_thumb");
              }}
              aria-label={`Photo ${i + 1}`}
              className={`relative h-14 w-14 shrink-0 overflow-hidden rounded-md border-2 transition-opacity ${
                i === index
                  ? "border-white opacity-100"
                  : "border-transparent opacity-50 hover:opacity-80"
              }`}
            >
              <Image src={url} alt="" fill className="object-cover" sizes="56px" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function ListingGallery({ images, title, listingId }: Props) {
  const [index, setIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const current = images[index] || "";

  const trackPhoto = useCallback(
    (newIndex: number, source: PhotoSource) => {
      if (!listingId) return;
      trackEvent("listing_gallery_photo_changed", {
        listing_id: listingId,
        photo_index: newIndex + 1,
        photo_count: images.length,
        source,
      });
    },
    [images.length, listingId]
  );

  const goTo = useCallback(
    (newIndex: number, source: PhotoSource) => {
      setIndex(newIndex);
      trackPhoto(newIndex, source);
    },
    [trackPhoto]
  );

  const goPrev = useCallback(() => {
    const newIndex = index === 0 ? images.length - 1 : index - 1;
    goTo(newIndex, "inline_arrow");
  }, [goTo, images.length, index]);

  const goNext = useCallback(() => {
    const newIndex = (index + 1) % images.length;
    goTo(newIndex, "inline_arrow");
  }, [goTo, images.length, index]);

  const openLightbox = useCallback(() => {
    setLightboxOpen(true);
    trackEvent("listing_gallery_opened", {
      listing_id: listingId,
      photo_count: images.length,
    });
  }, [images.length, listingId]);

  useEffect(() => {
    if (lightboxOpen || images.length <= 1) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        goPrev();
      }
      if (e.key === "ArrowRight") {
        e.preventDefault();
        goNext();
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [goNext, goPrev, images.length, lightboxOpen]);

  if (!images.length) {
    return (
      <div className="flex aspect-[4/3] items-center justify-center rounded-2xl bg-[var(--surface)] text-[var(--muted)]">
        No photos
      </div>
    );
  }

  return (
    <>
      {lightboxOpen && (
        <Lightbox
          images={images}
          title={title}
          listingId={listingId}
          startIndex={index}
          onClose={() => setLightboxOpen(false)}
        />
      )}

      <div>
        <button
          type="button"
          aria-label="View full-screen photo"
          className="relative block w-full cursor-zoom-in"
          onClick={openLightbox}
          onTouchStart={(e) => {
            touchStartX.current = e.touches[0].clientX;
          }}
          onTouchEnd={(e) => {
            if (touchStartX.current === null || images.length <= 1) return;
            const delta = e.changedTouches[0].clientX - touchStartX.current;
            if (Math.abs(delta) > 50) {
              const newIndex =
                delta < 0
                  ? (index + 1) % images.length
                  : index === 0
                    ? images.length - 1
                    : index - 1;
              goTo(newIndex, "inline_swipe");
            }
            touchStartX.current = null;
          }}
        >
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-[var(--surface)]">
            <Image
              src={current}
              alt={`${title} — photo ${index + 1}`}
              fill
              className="object-cover transition-transform duration-200 hover:scale-[1.02]"
              priority
              sizes="(max-width: 768px) 100vw, 768px"
            />
            {images.length > 1 && (
              <span className="absolute bottom-3 right-3 rounded-full bg-black/50 px-2 py-1 text-xs text-white">
                {index + 1} / {images.length}
              </span>
            )}
            <span className="absolute left-3 top-3 rounded-full bg-black/50 px-2 py-1 text-xs text-white">
              ⛶ View all
            </span>
          </div>
        </button>

        {images.length > 1 && (
          <div className="mt-3 flex items-center gap-2 overflow-x-auto pb-1">
            <button
              type="button"
              aria-label="Previous photo"
              onClick={(e) => {
                e.stopPropagation();
                goPrev();
              }}
              className="shrink-0 rounded-full bg-[var(--surface)] px-2 py-1 text-lg text-[var(--muted)] hover:bg-[var(--border)]"
            >
              ‹
            </button>
            {images.map((url, i) => (
              <button
                key={`${url}-${i}`}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  if (i !== index) goTo(i, "inline_thumb");
                }}
                aria-label={`Photo ${i + 1}`}
                className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border-2 transition-opacity ${
                  i === index
                    ? "border-[var(--accent)] opacity-100"
                    : "border-transparent opacity-70 hover:opacity-100"
                }`}
              >
                <Image src={url} alt="" fill className="object-cover" sizes="64px" />
              </button>
            ))}
            <button
              type="button"
              aria-label="Next photo"
              onClick={(e) => {
                e.stopPropagation();
                goNext();
              }}
              className="shrink-0 rounded-full bg-[var(--surface)] px-2 py-1 text-lg text-[var(--muted)] hover:bg-[var(--border)]"
            >
              ›
            </button>
          </div>
        )}
      </div>
    </>
  );
}

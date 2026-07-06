"use client";

import { useCallback, useEffect, useRef, useState } from "react";

interface ProjectGalleryLightboxProps {
  images: string[];
  title: string;
}

function GalleryImage({
  src,
  alt,
  className,
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);
  if (failed) {
    return (
      <div
        className={`flex items-center justify-center bg-gradient-to-br from-[var(--brand-navy)] to-[#0f172a] text-center text-white/70 ${className ?? ""}`}
        role="img"
        aria-label={alt}
      >
        <span className="px-4 text-xs font-medium sm:text-sm">Project photo</span>
      </div>
    );
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} className={className} onError={() => setFailed(true)} />
  );
}

function LightboxModal({
  images,
  title,
  startIndex,
  onClose,
}: {
  images: string[];
  title: string;
  startIndex: number;
  onClose: () => void;
}) {
  const [index, setIndex] = useState(startIndex);
  const touchStartX = useRef<number | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  const prev = useCallback(() => {
    setIndex((i) => (i === 0 ? images.length - 1 : i - 1));
  }, [images.length]);

  const next = useCallback(() => {
    setIndex((i) => (i + 1) % images.length);
  }, [images.length]);

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

  return (
    <div
      className="fixed inset-0 z-[60] flex flex-col bg-[var(--lux-navy-deep)]/95 backdrop-blur-md"
      role="dialog"
      aria-modal="true"
      aria-label={`${title} gallery`}
      onClick={onClose}
    >
      <div
        className="flex items-center justify-between border-b border-white/10 px-4 py-4 sm:px-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div>
          <p className="lux-eyebrow text-[var(--sale-gold-muted)]">Gallery</p>
          <p className="mt-1 font-serif text-lg text-white">{title}</p>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm tabular-nums text-white/60">
            {index + 1} / {images.length}
          </span>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-white/80 transition hover:bg-white/10"
            aria-label="Close gallery"
          >
            ✕
          </button>
        </div>
      </div>

      <div
        className="relative flex flex-1 items-center justify-center px-4 py-6 sm:px-12"
        onClick={(e) => e.stopPropagation()}
        onTouchStart={(e) => {
          touchStartX.current = e.touches[0].clientX;
        }}
        onTouchEnd={(e) => {
          if (touchStartX.current === null) return;
          const delta = e.changedTouches[0].clientX - touchStartX.current;
          if (Math.abs(delta) > 50) {
            if (delta < 0) next();
            else prev();
          }
          touchStartX.current = null;
        }}
      >
        <button
          type="button"
          onClick={prev}
          className="absolute left-2 z-10 hidden h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-black/30 text-2xl text-white transition hover:bg-black/50 sm:flex"
          aria-label="Previous photo"
        >
          ‹
        </button>

        <GalleryImage
          src={images[index]}
          alt={`${title} — photo ${index + 1}`}
          className="max-h-[70vh] max-w-full rounded-lg object-contain shadow-2xl"
        />

        <button
          type="button"
          onClick={next}
          className="absolute right-2 z-10 hidden h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-black/30 text-2xl text-white transition hover:bg-black/50 sm:flex"
          aria-label="Next photo"
        >
          ›
        </button>
      </div>

      <div
        className="flex gap-2 overflow-x-auto border-t border-white/10 px-4 py-4 sm:justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        {images.map((url, i) => (
          <button
            key={url}
            type="button"
            onClick={() => setIndex(i)}
            className={`shrink-0 overflow-hidden rounded-lg border-2 transition ${
              i === index
                ? "border-[var(--sale-gold)] ring-2 ring-[var(--sale-gold)]/30"
                : "border-transparent opacity-60 hover:opacity-100"
            }`}
            aria-label={`View photo ${i + 1}`}
            aria-current={i === index}
          >
            <GalleryImage src={url} alt="" className="h-14 w-20 object-cover sm:h-16 sm:w-24" />
          </button>
        ))}
      </div>
    </div>
  );
}

export default function ProjectGalleryLightbox({ images, title }: ProjectGalleryLightboxProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  if (images.length === 0) return null;

  const displayImages = images.length > 1 ? images.slice(1) : images;
  // If extras are missing (single hero only), still show the hero in gallery.
  const gridImages = displayImages.length > 0 ? displayImages : images;
  const heroOffset = images.length > 1 ? 1 : 0;

  const openAt = (displayIndex: number) => setLightboxIndex(displayIndex + heroOffset);

  return (
    <>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-12">
        {gridImages.slice(0, 3).map((url, i) => (
          <button
            key={url}
            type="button"
            onClick={() => openAt(i)}
            className={`lux-gallery-item group relative cursor-zoom-in text-left ${
              i === 0 ? "col-span-2 row-span-2 lg:col-span-8 lg:row-span-2" : "lg:col-span-4"
            }`}
            aria-label={`Open gallery photo ${i + 1}`}
          >
            <GalleryImage
              src={url}
              alt=""
              className={`w-full object-cover transition duration-700 group-hover:scale-105 ${
                i === 0 ? "aspect-[16/10] lg:aspect-auto lg:h-full lg:min-h-[320px]" : "aspect-[4/3]"
              }`}
            />
            <span className="absolute inset-0 flex items-end justify-end bg-gradient-to-t from-black/40 to-transparent p-4 opacity-0 transition group-hover:opacity-100">
              <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-[var(--brand-navy)]">
                View full size
              </span>
            </span>
          </button>
        ))}
        {gridImages.slice(3).map((url, i) => (
          <button
            key={url}
            type="button"
            onClick={() => openAt(i + 3)}
            className="lux-gallery-item group relative cursor-zoom-in text-left lg:col-span-4"
            aria-label={`Open gallery photo ${i + 4}`}
          >
            <GalleryImage src={url} alt="" className="aspect-[4/3] w-full object-cover transition duration-700 group-hover:scale-105" />
            <span className="absolute inset-0 flex items-end justify-end bg-gradient-to-t from-black/40 to-transparent p-4 opacity-0 transition group-hover:opacity-100">
              <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-[var(--brand-navy)]">
                View full size
              </span>
            </span>
          </button>
        ))}
      </div>

      {lightboxIndex !== null && (
        <LightboxModal
          images={images}
          title={title}
          startIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
        />
      )}
    </>
  );
}

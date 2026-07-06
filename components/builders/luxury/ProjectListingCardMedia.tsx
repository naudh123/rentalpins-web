"use client";

import { useState } from "react";
import type { BrandTheme } from "@/lib/builders/brand-themes";

interface ProjectListingCardMediaProps {
  imageUrl: string | null;
  logoUrl: string | null;
  projectName: string;
  builderName: string;
  theme: BrandTheme;
}

function builderMonogram(name: string): string {
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return "?";
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (words[0][0] + words[1][0]).toUpperCase();
}

export default function ProjectListingCardMedia({
  imageUrl,
  logoUrl,
  projectName,
  builderName,
  theme,
}: ProjectListingCardMediaProps) {
  const [imageFailed, setImageFailed] = useState(false);
  const [logoFailed, setLogoFailed] = useState(false);
  const showImage = Boolean(imageUrl && !imageFailed);
  const showLogoImg = Boolean(logoUrl && !logoFailed);
  const monogram = builderMonogram(builderName);

  return (
    <div className="relative h-full min-h-[11rem] w-full">
      {/* Branded base — always fills the panel (no gray gaps) */}
      <div
        className="absolute inset-0 flex items-center justify-center overflow-hidden px-3"
        style={{
          background: `linear-gradient(135deg, ${theme.primary} 0%, ${theme.primaryDeep} 100%)`,
          color: theme.accent,
        }}
      >
        <span
          className={`line-clamp-4 text-center font-serif text-lg font-bold uppercase leading-tight tracking-wide transition-opacity sm:text-xl ${
            showImage ? "opacity-0" : "opacity-100"
          }`}
        >
          {projectName}
        </span>
      </div>

      {showImage && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={imageUrl!}
          alt=""
          className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"
          onError={() => setImageFailed(true)}
        />
      )}

      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition group-hover:opacity-100"
        style={{
          background: `linear-gradient(135deg, color-mix(in srgb, ${theme.primary} 25%, transparent), transparent)`,
        }}
      />

      <div className="absolute bottom-3 left-3 z-10">
        {showLogoImg ? (
          <div className="rounded-lg border border-white/20 bg-white/95 p-1.5 shadow-md backdrop-blur-sm">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={logoUrl!}
              alt=""
              className="h-7 w-auto max-w-[5.5rem] object-contain object-left"
              onError={() => setLogoFailed(true)}
            />
          </div>
        ) : (
          <div
            className="flex h-9 min-w-[2.25rem] items-center justify-center rounded-lg border border-white/25 px-2 text-xs font-bold tracking-wide shadow-md backdrop-blur-sm"
            style={{
              background: `color-mix(in srgb, ${theme.accent} 92%, white)`,
              color: theme.accentText ?? theme.primaryDeep,
            }}
            aria-hidden
          >
            {monogram}
          </div>
        )}
      </div>
    </div>
  );
}

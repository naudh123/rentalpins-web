"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { CSSProperties, ReactNode } from "react";
import {
  brandThemeToCssVars,
  getBrandTheme,
  type BrandTheme,
} from "@/lib/builders/brand-themes";

export function BuilderLuxuryShell({
  children,
  className = "",
  builderSlug,
  projectSlug,
  theme: themeOverride,
}: {
  children: ReactNode;
  className?: string;
  builderSlug?: string;
  projectSlug?: string;
  theme?: BrandTheme;
}) {
  const theme = themeOverride ?? getBrandTheme(builderSlug, projectSlug);
  const style = brandThemeToCssVars(theme) as CSSProperties;

  return (
    <div
      className={`builder-luxury sale-theme ${className}`}
      data-transaction="sale"
      data-brand={theme.id}
      style={style}
    >
      {children}
    </div>
  );
}

export function LuxuryBreadcrumbs({
  items,
  light = false,
}: {
  items: { label: string; href?: string }[];
  light?: boolean;
}) {
  return (
    <nav
      className={`flex flex-wrap items-center gap-1.5 text-xs tracking-wide ${
        light ? "text-white/65" : "text-[var(--muted)]"
      }`}
      aria-label="Breadcrumb"
    >
      {items.map((item, i) => (
        <span key={`${item.label}-${i}`} className="inline-flex items-center gap-1.5">
          {i > 0 && <span className={light ? "text-white/35" : "text-[var(--border)]"}>/</span>}
          {item.href ? (
            <Link
              href={item.href}
              className={`transition hover:underline ${
                light ? "hover:text-white" : "hover:text-[var(--lux-primary)]"
              }`}
            >
              {item.label}
            </Link>
          ) : (
            <span className={light ? "text-white/90" : "text-[var(--text)]"}>{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}

export function LuxurySectionHeader({
  eyebrow,
  title,
  description,
  align = "left",
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
}) {
  const centered = align === "center";
  return (
    <div className={centered ? "text-center" : ""}>
      {eyebrow && (
        <p className={`lux-eyebrow ${centered ? "mx-auto" : ""}`}>{eyebrow}</p>
      )}
      <h2
        className={`mt-2 font-serif text-2xl font-bold tracking-tight text-[var(--lux-primary)] sm:text-3xl ${
          centered ? "mx-auto max-w-2xl" : ""
        }`}
      >
        {title}
      </h2>
      <div className={`lux-gold-rule mt-3 ${centered ? "mx-auto" : ""}`} />
      {description && (
        <p
          className={`mt-4 max-w-2xl text-[var(--muted)] leading-relaxed ${
            centered ? "mx-auto" : ""
          }`}
        >
          {description}
        </p>
      )}
    </div>
  );
}

export function LuxurySubpageHero({
  breadcrumbs,
  title,
  description,
  badge,
}: {
  breadcrumbs: { label: string; href?: string }[];
  title: string;
  description?: string;
  badge?: string;
}) {
  return (
    <section className="lux-index-hero border-b border-[var(--border)]">
      <div className="relative mx-auto max-w-6xl px-4 py-14 sm:py-20">
        <LuxuryBreadcrumbs items={breadcrumbs} />
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] as const }}
        >
          <p className="lux-eyebrow mt-6">RentalPins · Curated Collection</p>
          <h1 className="mt-2 font-serif text-3xl font-bold tracking-tight text-[var(--lux-primary)] sm:text-4xl lg:text-5xl">
            {title}
          </h1>
          <div className="lux-gold-rule mt-4" />
          {description && (
            <p className="mt-4 max-w-2xl text-lg leading-relaxed text-[var(--muted)] sm:text-xl">
              {description}
            </p>
          )}
          {badge && <p className="lux-subpage-badge">{badge}</p>}
        </motion.div>
      </div>
    </section>
  );
}

export function LuxuryIndexHero({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <section className="lux-index-hero border-b border-[var(--border)]">
      <div className="relative mx-auto max-w-6xl px-4 py-20 sm:py-28">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] as const }}
          className="max-w-3xl"
        >
          <p className="lux-eyebrow">{eyebrow}</p>
          <h1 className="mt-3 font-serif text-4xl font-bold tracking-tight text-[var(--lux-primary)] sm:text-5xl lg:text-[3.5rem] lg:leading-[1.1]">
            {title}
          </h1>
          <div className="lux-gold-rule mt-5" />
          <p className="mt-6 text-lg leading-relaxed text-[var(--muted)] sm:text-xl">
            {description}
          </p>
          <p className="lux-subpage-badge mt-8">Verified microsites · Private enquiries · RERA disclosures</p>
        </motion.div>
      </div>
    </section>
  );
}

export function LuxuryStatChip({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return <span className={`lux-chip ${className}`}>{children}</span>;
}

export function LuxuryGlassPanel({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`lux-glass rounded-2xl p-6 sm:p-8 ${className}`}>{children}</div>
  );
}

export function LuxuryProjectCard({
  href,
  name,
  imageUrl,
  city,
  status,
  priceLabel,
}: {
  href: string;
  name: string;
  imageUrl?: string;
  city: string;
  status: string;
  priceLabel?: string;
}) {
  return (
    <Link href={href} className="lux-card group block overflow-hidden">
      <div className="relative aspect-[16/10] overflow-hidden bg-[var(--sale-ivory-elevated)]">
        {imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imageUrl}
            alt={name}
            className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center font-serif text-2xl text-[var(--muted)]">
            {name.charAt(0)}
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--lux-primary-deep)]/70 via-transparent to-transparent opacity-80" />
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <p className="text-xs font-medium uppercase tracking-wider text-white/70">{city}</p>
          <h3 className="mt-1 font-serif text-xl font-bold text-white">{name}</h3>
        </div>
      </div>
      <div className="flex items-center justify-between gap-3 p-4">
        <span className="text-sm capitalize text-[var(--muted)]">{status.replace("-", " ")}</span>
        {priceLabel && (
          <span className="text-sm font-semibold text-[var(--lux-primary)]">{priceLabel}</span>
        )}
        <span className="text-sm font-medium text-[var(--lux-accent)]">View →</span>
      </div>
    </Link>
  );
}

export function LuxuryBuilderCard({
  href,
  name,
  logoUrl,
  coverUrl,
  city,
  establishedYear,
}: {
  href: string;
  name: string;
  logoUrl?: string;
  coverUrl?: string;
  city: string;
  establishedYear?: number | null;
}) {
  return (
    <Link href={href} className="lux-card group block overflow-hidden">
      <div className="relative aspect-[16/9] overflow-hidden bg-[var(--sale-ivory-elevated)]">
        {coverUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={coverUrl}
            alt={name}
            className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-gradient-to-br from-[var(--lux-primary)] to-[var(--lux-primary-deep)] font-serif text-3xl text-white/90">
            {name.slice(0, 2).toUpperCase()}
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
      </div>
      <div className="flex items-center gap-4 p-5">
        {logoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={logoUrl}
            alt=""
            className="h-14 w-14 rounded-xl border border-[var(--border)] bg-white object-contain p-1.5 shadow-sm"
          />
        ) : (
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-[var(--lux-primary)] font-serif text-lg font-bold text-white">
            {name.charAt(0)}
          </div>
        )}
        <div className="min-w-0 flex-1">
          <h2 className="truncate font-serif text-lg font-bold text-[var(--lux-primary)] group-hover:text-[var(--lux-accent-hover)]">
            {name}
          </h2>
          <p className="mt-0.5 text-sm text-[var(--muted)]">
            {city}
            {establishedYear ? ` · Est. ${establishedYear}` : ""}
          </p>
        </div>
      </div>
    </Link>
  );
}

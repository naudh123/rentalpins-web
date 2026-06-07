import type { Metadata } from "next";
import { canonicalUrl } from "@/lib/seo";

export const SEO_BRAND_SUFFIX = " | RentalPins";

/** Remove a trailing "| RentalPins" so the root layout title template does not duplicate it. */
export function stripBrandSuffix(title: string): string {
  return title.replace(/\s*\|\s*RentalPins\s*$/i, "").trim();
}

/** Full title for Open Graph, Twitter, and absolute metadata. */
export function withBrandSuffix(title: string): string {
  const base = stripBrandSuffix(title);
  return base ? `${base}${SEO_BRAND_SUFFIX}` : "RentalPins";
}

export interface PageSeoInput {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
  ogType?: "website" | "article";
  ogImage?: string;
  locale?: string;
  robots?: Metadata["robots"];
  noIndex?: boolean;
}

/** Production-ready metadata builder for App Router `generateMetadata` / `export const metadata`. */
export function buildPageMetadata(input: PageSeoInput): Metadata {
  const canonical = canonicalUrl(input.path);
  const image = input.ogImage ?? "/og-image.png";
  const pageTitle = stripBrandSuffix(input.title);
  const fullTitle = withBrandSuffix(pageTitle);

  return {
    title: pageTitle,
    description: input.description,
    keywords: input.keywords,
    alternates: { canonical },
    robots: input.noIndex
      ? { index: false, follow: true }
      : (input.robots ?? { index: true, follow: true }),
    openGraph: {
      title: fullTitle,
      description: input.description,
      url: canonical,
      siteName: "RentalPins",
      type: input.ogType ?? "website",
      locale: input.locale ?? "en_IN",
      images: [{ url: image, width: 1200, height: 630, alt: "RentalPins" }],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description: input.description,
      images: [image],
    },
  };
}

import type { Metadata } from "next";
import { canonicalUrl } from "@/lib/seo";

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

  return {
    title: input.title,
    description: input.description,
    keywords: input.keywords,
    alternates: { canonical },
    robots: input.noIndex
      ? { index: false, follow: true }
      : (input.robots ?? { index: true, follow: true }),
    openGraph: {
      title: input.title,
      description: input.description,
      url: canonical,
      siteName: "RentalPins",
      type: input.ogType ?? "website",
      locale: input.locale ?? "en_IN",
      images: [{ url: image, width: 1200, height: 630, alt: "RentalPins" }],
    },
    twitter: {
      card: "summary_large_image",
      title: input.title,
      description: input.description,
      images: [image],
    },
  };
}

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getCityBySlug, RENTAL_COUNTRY_SLUGS } from "@/lib/cities-config";
import { LEGACY_BLOG_SLUGS } from "@/lib/blog-legacy";

/** Indexed legacy paths → canonical (308 permanent). */
const LEGACY_PATH_REDIRECTS: Record<string, string> = {
  "/privacy": "/privacy-policy",
  "/refunds": "/refund-policy",
  "/refund": "/refund-policy",
  "/terms-of-service": "/terms",
};

function decodePath(pathname: string): string {
  try {
    return decodeURIComponent(pathname);
  } catch {
    return pathname;
  }
}

/**
 * Legacy URLs:
 * - /rentals/{city} → /rentals/{country}/{city}
 * - /privacy, /refunds → legal pages
 * - /blog/{old-slug} → canonical blog slug
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const decoded = decodePath(pathname);

  const configuredBase =
    process.env.NEXT_PUBLIC_BASE_PATH?.replace(/\/$/, "") || "";

  // Local dev: /staging/search links work when basePath is not configured.
  if (!configuredBase && decoded.startsWith("/staging")) {
    const url = request.nextUrl.clone();
    url.pathname = decoded.slice("/staging".length) || "/";
    return NextResponse.redirect(url);
  }

  const legacyTarget = LEGACY_PATH_REDIRECTS[decoded];
  if (legacyTarget) {
    const url = request.nextUrl.clone();
    url.pathname = legacyTarget;
    return NextResponse.redirect(url, 308);
  }

  if (decoded.startsWith("/blog/")) {
    const slug = decoded.slice("/blog/".length);
    const canonical = LEGACY_BLOG_SLUGS[slug];
    if (canonical && canonical !== slug) {
      const url = request.nextUrl.clone();
      url.pathname = `/blog/${canonical}`;
      return NextResponse.redirect(url, 308);
    }
  }

  const segments = pathname.split("/").filter(Boolean);
  if (segments[0] !== "rentals" || segments.length < 2) {
    return NextResponse.next();
  }

  const first = segments[1].toLowerCase();
  if (RENTAL_COUNTRY_SLUGS.includes(first as (typeof RENTAL_COUNTRY_SLUGS)[number])) {
    return NextResponse.next();
  }

  const legacyCity = getCityBySlug(segments[1]);
  if (!legacyCity) {
    return NextResponse.next();
  }

  const url = request.nextUrl.clone();
  if (segments.length === 2) {
    url.pathname = `/rentals/${legacyCity.countrySlug}/${legacyCity.slug}`;
  } else if (segments.length >= 3) {
    url.pathname = `/rentals/${legacyCity.countrySlug}/${legacyCity.slug}/${segments[2]}`;
  }
  return NextResponse.redirect(url, 308);
}

export const config = {
  matcher: [
    "/staging",
    "/staging/:path*",
    "/rentals/:path*",
    "/blog/:path*",
    "/privacy",
    "/refunds",
    "/refund",
    "/terms-of-service",
  ],
};

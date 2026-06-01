/** App-wide config from env (client-safe where prefixed NEXT_PUBLIC_). */

import {
  resolveDeployEnv,
  resolveShowStagingBanner,
  type DeployEnv,
} from "@/lib/deploy-env";

export type { DeployEnv };

/** Staging only when DEPLOY_ENV=staging or BASE_PATH=/staging — never from SHOW_STAGING_BANNER on prod. */
export const deployEnv = resolveDeployEnv();

/** Must match `basePath` in next.config.ts (from NEXT_PUBLIC_BASE_PATH). */
export const basePath =
  process.env.NEXT_PUBLIC_BASE_PATH?.replace(/\/$/, "") || "";

export const showStagingBanner = resolveShowStagingBanner(deployEnv);

/** Height of AppShell mobile bottom nav (matches bottom spacer + Post FAB). */
export const MOBILE_BOTTOM_NAV_HEIGHT = "4.75rem";

const DEFAULT_PUBLIC_SITE = "https://www.rentalpins.com";

function normalizeSiteUrl(raw: string): string {
  const trimmed = raw.replace(/\/$/, "");
  if (trimmed === "https://rentalpins.com") return DEFAULT_PUBLIC_SITE;
  return trimmed;
}

function readSiteUrlFromEnv(): string {
  return normalizeSiteUrl(
    process.env.NEXT_PUBLIC_SITE_URL || DEFAULT_PUBLIC_SITE
  );
}

function isLocalDevSiteUrl(url: string): boolean {
  try {
    const host = new URL(url).hostname;
    return host === "localhost" || host === "127.0.0.1";
  } catch {
    return false;
  }
}

/**
 * Resolved public origin for canonicals, sitemaps, robots, JSON-LD, and metadataBase.
 * Local dev may use localhost; production builds must never bake localhost into static SEO output.
 */
function resolveSiteUrl(): string {
  const publicOverride = process.env.NEXT_PUBLIC_PUBLIC_SITE_URL?.replace(/\/$/, "");
  if (publicOverride && !isLocalDevSiteUrl(publicOverride)) {
    return normalizeSiteUrl(publicOverride);
  }
  const configured = readSiteUrlFromEnv();
  if (isLocalDevSiteUrl(configured)) {
    if (process.env.NODE_ENV === "development") return configured;
    return DEFAULT_PUBLIC_SITE;
  }
  return configured;
}

export const siteUrl = resolveSiteUrl();

/** Public URL for share/copy/WhatsApp — same origin as siteUrl. */
export function publicSiteUrl(): string {
  return siteUrl;
}

/** Production defaults to required unless explicitly set to "false". */
export const requirePhoneVerification =
  process.env.NEXT_PUBLIC_REQUIRE_PHONE_VERIFICATION === "true" ||
  (deployEnv === "production" &&
    process.env.NEXT_PUBLIC_REQUIRE_PHONE_VERIFICATION !== "false");

export const gaMeasurementId =
  process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "G-VGVQGGL24W";

export const googleMapsApiKey =
  process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";

/** Prefix for Next.js Link hrefs when using basePath in config */
export function appPath(path: string): string {
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${basePath}${p}`;
}

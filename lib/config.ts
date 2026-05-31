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

/** Height of AppShell mobile bottom nav (matches h-[4.25rem] spacer). */
export const MOBILE_BOTTOM_NAV_HEIGHT = "4.25rem";

function normalizeSiteUrl(raw: string): string {
  const trimmed = raw.replace(/\/$/, "");
  if (trimmed === "https://rentalpins.com") return "https://www.rentalpins.com";
  return trimmed;
}

export const siteUrl = normalizeSiteUrl(
  process.env.NEXT_PUBLIC_SITE_URL || "https://www.rentalpins.com"
);

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

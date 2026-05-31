import { deployEnv, gaMeasurementId } from "@/lib/config";

/** GA4 Web stream — hits go to Google via gtag.js after consent. */
export const GA4_COLLECT_ENDPOINT =
  "https://www.google-analytics.com/g/collect";

export function ga4TagLoaderUrl(id = gaMeasurementId): string {
  return `https://www.googletagmanager.com/gtag/js?id=${id}`;
}

/** gtag scripts are included in root layout only on non-staging builds. */
export function isGa4ScriptEnabledOnBuild(): boolean {
  return deployEnv !== "staging" && Boolean(gaMeasurementId);
}

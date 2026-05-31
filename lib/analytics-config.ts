import { gaMeasurementId } from "@/lib/config";
import { resolveDeployEnv } from "@/lib/deploy-env";

/** GA4 Web stream — hits go to Google via gtag.js after consent. */
export const GA4_COLLECT_ENDPOINT =
  "https://www.google-analytics.com/g/collect";

export function ga4TagLoaderUrl(id = gaMeasurementId): string {
  return `https://www.googletagmanager.com/gtag/js?id=${id}`;
}

/** gtag scripts are included in root layout only on non-staging builds. */
export function isGa4ScriptEnabledOnBuild(): boolean {
  return resolveDeployEnv() !== "staging" && Boolean(gaMeasurementId);
}

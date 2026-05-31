import { GA4_WEB_MEASUREMENT_ID_DEFAULT } from "./ga4-embed-contract";

/**
 * GA4 web stream Measurement ID for www.rentalpins.com.
 * Set NEXT_PUBLIC_GA_MEASUREMENT_ID in production (e.g. Vercel) to override; defaults to [GA4_WEB_MEASUREMENT_ID_DEFAULT].
 */
export const GA_MEASUREMENT_ID =
  (process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ?? "").trim() || GA4_WEB_MEASUREMENT_ID_DEFAULT;

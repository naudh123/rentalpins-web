import { NextResponse } from "next/server";
import {
  deployEnv,
  gaMeasurementId,
  googleMapsApiKey,
  requirePhoneVerification,
} from "@/lib/config";
import {
  GA4_COLLECT_ENDPOINT,
  ga4TagLoaderUrl,
  isGa4ScriptEnabledOnBuild,
} from "@/lib/analytics-config";

/** Deployment smoke check — no secrets in response. */
export async function GET() {
  const hasAdmin =
    Boolean(process.env.FIREBASE_CLIENT_EMAIL) &&
    Boolean(process.env.FIREBASE_PRIVATE_KEY);
  const hasMapsKey = Boolean(googleMapsApiKey);
  const hasFirebaseClient = Boolean(process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID);

  const checks = {
    deployEnv,
    basePath: process.env.NEXT_PUBLIC_BASE_PATH || "",
    requirePhoneVerification,
    firebaseClient: hasFirebaseClient,
    firebaseAdmin: hasAdmin,
    googleMaps: hasMapsKey,
    analytics: {
      measurementId: gaMeasurementId,
      scriptEnabledOnBuild: isGa4ScriptEnabledOnBuild(),
      requiresCookieConsent: true,
      consentStorageKey: "rp_analytics_consent",
      tagLoader: ga4TagLoaderUrl(),
      collectEndpoint: GA4_COLLECT_ENDPOINT,
      note: "Events send only after user taps Accept on the cookie banner (production builds).",
    },
  };

  const ok = hasAdmin && hasMapsKey && hasFirebaseClient;

  return NextResponse.json(
    {
      ok,
      checks,
      hint: ok
        ? undefined
        : "Set Firebase Admin + NEXT_PUBLIC_GOOGLE_MAPS_API_KEY in hosting env",
    },
    { status: ok ? 200 : 503 }
  );
}

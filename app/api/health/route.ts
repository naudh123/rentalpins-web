import { NextResponse } from "next/server";
import { deployEnv, googleMapsApiKey, requirePhoneVerification } from "@/lib/config";

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

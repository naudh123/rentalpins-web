"use client";

import { getClientAuth } from "@/lib/firebase-client";

const PROJECT_ID =
  process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "rent-it-dev-6bcfd";

/** Firebase callable HTTP error with `code` for mapCallableError. */
export class CallableError extends Error {
  readonly code: string;

  constructor(code: string, message: string) {
    super(message);
    this.name = "CallableError";
    this.code = code;
  }
}

function httpsErrorCode(status: string | undefined): string {
  const normalized = (status || "INTERNAL").toLowerCase().replace(/_/g, "-");
  return `functions/${normalized}`;
}

/**
 * Call a Cloud Function using the documented callable HTTP protocol.
 * Wraps payload as `{ data: ... }` so the backend receives request.data correctly.
 */
export interface CallHttpsFunctionOptions {
  /** Client-side abort; use slightly above the Cloud Function timeout (e.g. 65s for 60s functions). */
  timeoutMs?: number;
  /** Refresh Firebase ID token before the request (use for long / slow callables). */
  refreshAuthToken?: boolean;
}

export async function callHttpsFunction<TResult>(
  functionName: string,
  data: Record<string, unknown>,
  region = "us-central1",
  options?: CallHttpsFunctionOptions
): Promise<TResult> {
  const auth = getClientAuth();
  const user = auth.currentUser;
  if (!user) {
    throw new CallableError("functions/unauthenticated", "Sign in required.");
  }

  const listingId = data.listingId;
  const needsListingId =
    functionName === "activateFreePlan" ||
    functionName === "createRazorpayOrderForListing" ||
    functionName === "createPayPalOrder";
  if (
    needsListingId &&
    (typeof listingId !== "string" || !listingId.trim())
  ) {
    throw new CallableError(
      "functions/invalid-argument",
      "listingId is required"
    );
  }

  const token = await user.getIdToken(options?.refreshAuthToken === true);
  const url = `https://${region}-${PROJECT_ID}.cloudfunctions.net/${functionName}`;

  const timeoutMs = options?.timeoutMs;
  const controller =
    typeof timeoutMs === "number" && timeoutMs > 0
      ? new AbortController()
      : null;
  const timer = controller
    ? setTimeout(() => controller.abort(), timeoutMs)
    : null;

  let res: Response;
  try {
    res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ data }),
      signal: controller?.signal,
    });
  } catch (err) {
    if (err instanceof Error && err.name === "AbortError") {
      throw new CallableError(
        "functions/deadline-exceeded",
        "Request timed out. Please try again."
      );
    }
    throw err;
  } finally {
    if (timer) clearTimeout(timer);
  }

  let json: { result?: TResult; error?: { message?: string; status?: string } };
  try {
    json = (await res.json()) as typeof json;
  } catch {
    throw new CallableError(
      "functions/internal",
      `Function call failed (${res.status}).`
    );
  }

  if (json.error) {
    throw new CallableError(
      httpsErrorCode(json.error.status),
      json.error.message || "Function call failed"
    );
  }

  if (json.result === undefined) {
    throw new CallableError("functions/internal", "Empty function response.");
  }

  return json.result;
}

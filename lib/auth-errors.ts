/** Map Firebase Auth errors to user-friendly copy. */

function isLocalDevHost(): boolean {
  if (typeof window === "undefined") return false;
  const host = window.location.hostname;
  return host === "localhost" || host === "127.0.0.1";
}

function securityCheckFailedMessage(): string {
  if (typeof window !== "undefined" && window.location.hostname === "localhost") {
    return (
      "Phone OTP does not work on localhost. Open http://127.0.0.1:3000 instead " +
      "(add 127.0.0.1 under Firebase → Authentication → Authorized domains), " +
      "use Continue with Google, or a Firebase test phone number."
    );
  }
  if (isLocalDevHost()) {
    return (
      "Security check failed. In Firebase Console → Authentication → Settings, " +
      "add 127.0.0.1 to Authorized domains, refresh, and try again. " +
      "Or use Google sign-in or a test phone number."
    );
  }
  return "Security check failed. Refresh the page and try again.";
}

function getAuthCode(err: unknown): string {
  if (err && typeof err === "object" && "code" in err) {
    return String((err as { code: string }).code);
  }
  return "";
}

/** Firebase callable (Cloud Functions) errors — post/pay flows. */
export function mapCallableError(err: unknown): string {
  const message =
    err && typeof err === "object" && "message" in err
      ? String((err as { message: string }).message)
      : "";
  const lower = message.toLowerCase();
  if (lower.includes("cooldown")) return message;
  if (lower.includes("not a free plan")) {
    return "Selected plan is not a free plan.";
  }
  if (lower.includes("not available")) {
    return "Free plan is not available for this market.";
  }
  if (lower.includes("blocked")) {
    return "Your account is currently blocked.";
  }
  if (lower.includes("not the owner")) {
    return "You are not the owner of this listing.";
  }
  if (lower.includes("plan price must be positive")) {
    return "Free plans activate without payment. Tap Activate free.";
  }
  if (lower.includes("owner mismatch") || lower.includes("not your listing")) {
    return "You can only activate your own listings.";
  }
  if (lower.includes("signature mismatch")) {
    return "Payment verification failed. Try again or contact support.";
  }
  if (lower.includes("listingid is required")) {
    return "Listing ID was not sent. Hard-refresh the page (Ctrl+Shift+R), then try again.";
  }
  if (lower.includes("failed to improve listing")) {
    return "AI improve is temporarily unavailable. You can still publish manually.";
  }

  const code = getAuthCode(err);
  if (code === "functions/unauthenticated") {
    return "Your session expired. Sign in again, then retry Improve with AI.";
  }
  if (code === "functions/deadline-exceeded") {
    return "AI improve took too long. Check your connection and try again.";
  }
  if (code === "functions/resource-exhausted") {
    return "Too many requests. Wait a moment and try again.";
  }
  if (code === "functions/unavailable" || code === "functions/internal") {
    if (lower.includes("improve") || lower.includes("openai")) {
      return "AI improve is temporarily unavailable. You can still publish manually.";
    }
  }

  return mapAuthError(err);
}

export function mapAuthError(err: unknown): string {
  const code = getAuthCode(err);

  switch (code) {
    case "auth/invalid-phone-number":
      return "Enter a valid mobile number with country code (e.g. +91 98765 43210).";
    case "auth/missing-phone-number":
      return "Enter your mobile number including country code.";
    case "auth/too-many-requests":
      return "Too many attempts. Please wait a few minutes and try again.";
    case "auth/captcha-check-failed":
    case "auth/invalid-app-credential":
    case "auth/missing-app-credential":
      return securityCheckFailedMessage();
    case "auth/invalid-verification-code":
      return "That code is incorrect. Check the SMS and try again.";
    case "auth/code-expired":
      return "This code has expired. Tap Send OTP to get a new one.";
    case "auth/session-expired":
      return "Session expired. Request a new OTP.";
    case "auth/popup-closed-by-user":
      return "Google sign-in was cancelled.";
    case "auth/popup-blocked":
      return "Pop-up blocked. Allow pop-ups for this site and try again.";
    case "auth/account-exists-with-different-credential":
      return "This email is already registered with another sign-in method. Try phone OTP.";
    case "auth/credential-already-in-use":
      return "This phone number is linked to another account.";
    case "auth/network-request-failed":
      return "Network error. Check your connection and try again.";
    case "auth/user-disabled":
      return "This account has been disabled. Contact support.";
    case "auth/operation-not-allowed":
      return "This sign-in method is not enabled. Contact support.";
    default:
      if (err instanceof Error && err.message && !err.message.startsWith("Firebase:")) {
        return err.message;
      }
      if (code) {
        return "Sign-in failed. Please try again or use phone OTP.";
      }
      return err instanceof Error ? err.message : "Something went wrong. Please try again.";
  }
}

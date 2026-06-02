/** Detect social / messenger in-app browsers where Firebase phone OTP + reCAPTCHA often fail. */

export type InAppBrowserKind =
  | "facebook"
  | "instagram"
  | "messenger"
  | "whatsapp"
  | "other";

export interface InAppBrowserInfo {
  inApp: boolean;
  kind: InAppBrowserKind | null;
  /** Human label for UI copy */
  label: string;
}

const UA_PATTERNS: { kind: InAppBrowserKind; re: RegExp; label: string }[] = [
  { kind: "facebook", re: /FBAN|FBAV|FB_IAB|FBIOS|FBDV|MetaIAB/i, label: "Facebook" },
  { kind: "instagram", re: /Instagram/i, label: "Instagram" },
  { kind: "messenger", re: /Messenger/i, label: "Messenger" },
  { kind: "whatsapp", re: /WhatsApp/i, label: "WhatsApp" },
];

export function detectInAppBrowser(userAgent?: string): InAppBrowserInfo {
  const ua =
    userAgent ??
    (typeof navigator !== "undefined" ? navigator.userAgent : "");
  if (!ua) {
    return { inApp: false, kind: null, label: "" };
  }

  for (const { kind, re, label } of UA_PATTERNS) {
    if (re.test(ua)) {
      return { inApp: true, kind, label };
    }
  }

  // Generic WebView hint (Android in-app shells without Chrome token)
  if (/wv\)|; wv\)/i.test(ua) && !/Chrome\/\d+/i.test(ua)) {
    return { inApp: true, kind: "other", label: "this app" };
  }

  return { inApp: false, kind: null, label: "" };
}

/** Current page URL for “open in browser” (preserve path + query). */
export function externalBrowserUrl(): string {
  if (typeof window === "undefined") return "https://www.rentalpins.com";
  return window.location.href;
}

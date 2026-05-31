import { isAllowedListingMessageOrigin } from "./meta-pixel";

export type ParsedEmbedMessage = Record<string, unknown>;

/** Parse postMessage payload from Flutter embed (object or JSON string). */
export function parseEmbedPostMessage(data: unknown): ParsedEmbedMessage | null {
  if (data && typeof data === "object" && !Array.isArray(data)) {
    return data as ParsedEmbedMessage;
  }
  if (typeof data === "string") {
    try {
      const parsed: unknown = JSON.parse(data);
      if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
        return parsed as ParsedEmbedMessage;
      }
    } catch {
      return null;
    }
  }
  return null;
}

/** Razorpay / checkout-frame noise — not RentalPins embed protocol. */
export function isCheckoutFrameNoise(data: unknown): boolean {
  if (!data || typeof data !== "object") return false;
  return (data as { source?: unknown }).source === "checkout-frame";
}

export function isTrustedFlutterEmbedOrigin(origin: string): boolean {
  return isAllowedListingMessageOrigin(origin);
}

/**
 * Meta Pixel helpers. Base pixel loads in `app/layout.tsx` before any of this runs.
 */

/**
 * Origins allowed to send listing events from the embedded Flutter app.
 * Temporary flexibility: allow overriding host via NEXT_PUBLIC_FLUTTER_EMBED_HOST.
 */
export function isAllowedListingMessageOrigin(origin: string): boolean {
  try {
    const { hostname } = new URL(origin);
    const configuredHost = (process.env.NEXT_PUBLIC_FLUTTER_EMBED_HOST || "").trim().toLowerCase();
    const configuredHosts = (process.env.NEXT_PUBLIC_FLUTTER_EMBED_HOSTS || "")
      .split(",")
      .map((h) => h.trim().toLowerCase())
      .filter(Boolean);
    const defaultHosts = new Set<string>(["app.rentalpins.com", "localhost"]);
    // Firebase dev hosting — only accept in non-production to reduce supply-chain / spoof surface.
    if (process.env.NODE_ENV !== "production") {
      defaultHosts.add("rent-it-dev-6bcfd.web.app");
    }
    if (configuredHost.length > 0) defaultHosts.add(configuredHost);
    for (const h of configuredHosts) defaultHosts.add(h);
    return defaultHosts.has(hostname);
  } catch {
    return false;
  }
}

export type ListingSubmittedPayload = {
  property_type: string;
  city: string;
  rent: string | number;
};

export type ViewContentPayload = {
  property_type: string;
  city: string;
};

export type SearchPayload = {
  search_string: string;
};

export type SmartLoaderEventPayload = {
  source: string;
  city: string;
  value?: number;
};

type FbqCommand = {
  method: "track" | "trackCustom";
  eventName: string;
  params: Record<string, unknown>;
};

type PixelWindow = Window & {
  fbq?: (...args: unknown[]) => void;
  __rentalPinsMetaQueue?: FbqCommand[];
};

function getPixelWindow(): PixelWindow | null {
  if (typeof window === "undefined") return null;
  return window as PixelWindow;
}

function sendOrQueue(cmd: FbqCommand): void {
  const w = getPixelWindow();
  if (!w) return;
  if (typeof w.fbq !== "undefined") {
    w.fbq(cmd.method, cmd.eventName, cmd.params);
    return;
  }
  w.__rentalPinsMetaQueue = w.__rentalPinsMetaQueue || [];
  w.__rentalPinsMetaQueue.push(cmd);
}

export function flushMetaPixelQueue(): void {
  const w = getPixelWindow();
  if (!w || typeof w.fbq === "undefined") return;
  const queue = w.__rentalPinsMetaQueue || [];
  if (queue.length === 0) return;
  w.__rentalPinsMetaQueue = [];
  for (const cmd of queue) {
    w.fbq(cmd.method, cmd.eventName, cmd.params);
  }
}

export function trackListingSubmitted(payload: ListingSubmittedPayload): void {
  sendOrQueue({
    method: "track",
    eventName: "Lead",
    params: {
      content_category: String(payload.property_type),
      content_name: String(payload.city),
      value: typeof payload.rent === "number" ? payload.rent : Number(payload.rent) || 0,
      currency: "INR",
    },
  });
}

export function trackPropertyViewContent(payload: ViewContentPayload): void {
  sendOrQueue({
    method: "track",
    eventName: "ViewContent",
    params: {
      content_type: "property",
      content_category: String(payload.property_type),
      content_name: String(payload.city),
      currency: "INR",
    },
  });
}

export function trackSearch(payload: SearchPayload): void {
  sendOrQueue({
    method: "track",
    eventName: "Search",
    params: {
      search_string: String(payload.search_string),
    },
  });
}

export function trackSmartLoaderEvent(eventName: string, payload: SmartLoaderEventPayload): void {
  sendOrQueue({
    method: "trackCustom",
    eventName,
    params: {
      source: String(payload.source),
      city: String(payload.city),
      ...(typeof payload.value === "number" ? { value: payload.value } : {}),
    },
  });
}

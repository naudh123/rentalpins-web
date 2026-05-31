/**
 * GA4 (gtag.js) helpers for www.rentalpins.com.
 * Queues events until gtag is ready (same pattern as meta-pixel).
 */

import { GA4_LINKER_DOMAINS } from "./ga4-embed-contract";

export type Ga4EventParams = Record<string, string | number | boolean>;

type GtagWindow = Window & {
  dataLayer?: unknown[];
  gtag?: (...args: unknown[]) => void;
  __rentalPinsGa4Queue?: Array<{ name: string; params: Ga4EventParams }>;
};

function getGtagWindow(): GtagWindow | null {
  if (typeof window === "undefined") return null;
  return window as GtagWindow;
}

/** Domains passed to gtag config `linker` (www ↔ app). */
export function ga4LinkerDomains(): readonly string[] {
  return GA4_LINKER_DOMAINS;
}

/** Sanitize custom event params for GA4 (string | number | boolean only). */
export function sanitizeGa4Params(
  raw: Record<string, unknown> | null | undefined
): Ga4EventParams {
  const params: Ga4EventParams = {};
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return params;
  for (const [k, v] of Object.entries(raw)) {
    if (typeof v === "string" || typeof v === "number" || typeof v === "boolean") {
      params[k] = v;
    }
  }
  return params;
}

export function trackGa4Event(name: string, params: Ga4EventParams = {}): void {
  const eventName = name.trim();
  if (!eventName) return;

  const w = getGtagWindow();
  if (!w) return;

  if (typeof w.gtag === "function") {
    w.gtag("event", eventName, params);
    return;
  }

  w.__rentalPinsGa4Queue = w.__rentalPinsGa4Queue ?? [];
  w.__rentalPinsGa4Queue.push({ name: eventName, params });
}

export function flushGa4Queue(): void {
  const w = getGtagWindow();
  if (!w || typeof w.gtag !== "function") return;
  const queue = w.__rentalPinsGa4Queue ?? [];
  if (queue.length === 0) return;
  w.__rentalPinsGa4Queue = [];
  for (const { name, params } of queue) {
    w.gtag!("event", name, params);
  }
}

/**
 * Append GA4 cross-domain `_gl` linker params so www → app.rentalpins.com
 * stays in one session (requires linker config on both domains).
 */
/** Max wait for gtag linker — GA4 often never invokes the decorate callback. */
const LINKER_DECORATE_MS = 150;

export function decorateHandoffUrl(url: string, onDone: (decorated: string) => void): void {
  const w = getGtagWindow();
  if (!w || typeof w.gtag !== "function") {
    onDone(url);
    return;
  }

  let finished = false;
  const finish = (next: string) => {
    if (finished) return;
    finished = true;
    onDone(next);
  };

  const timer = window.setTimeout(() => finish(url), LINKER_DECORATE_MS);

  try {
    w.gtag("linker", "decorate", url, (result: unknown) => {
      window.clearTimeout(timer);
      finish(typeof result === "string" && result.length > 0 ? result : url);
    });
  } catch {
    window.clearTimeout(timer);
    finish(url);
  }
}

/** Track optional GA4 event, decorate URL, then navigate (top-level). */
export function navigateToFlutterApp(
  url: string,
  options?: { gaEvent?: { name: string; params?: Ga4EventParams } }
): void {
  if (options?.gaEvent) {
    trackGa4Event(options.gaEvent.name, options.gaEvent.params ?? {});
  }

  let navigated = false;
  const go = (target: string) => {
    if (navigated) return;
    navigated = true;
    (window.top ?? window).location.assign(target);
  };

  const cap = window.setTimeout(() => go(url), LINKER_DECORATE_MS);

  decorateHandoffUrl(url, (decorated) => {
    window.clearTimeout(cap);
    go(decorated);
  });
}

"use client";

import { useCallback, useEffect, useState } from "react";
import { trackEvent } from "@/lib/ga4";

/** Hide a map hint for the current viewport until pan/zoom changes. */
export function useMapViewportHintDismiss(
  active: boolean,
  viewportKey: string,
  storageKey: string,
  analyticsEvent?: string
) {
  const [dismissedKey, setDismissedKey] = useState<string | null>(null);

  useEffect(() => {
    try {
      setDismissedKey(sessionStorage.getItem(storageKey));
    } catch {
      setDismissedKey(null);
    }
  }, [storageKey]);

  const show = active && dismissedKey !== viewportKey;

  const dismiss = useCallback(() => {
    setDismissedKey(viewportKey);
    try {
      sessionStorage.setItem(storageKey, viewportKey);
    } catch {
      // Ignore storage errors.
    }
    if (analyticsEvent) {
      trackEvent(analyticsEvent, { viewport_key: viewportKey });
    }
  }, [viewportKey, storageKey, analyticsEvent]);

  return { show, dismiss };
}

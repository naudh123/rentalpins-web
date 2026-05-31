"use client";

import { useEffect, useState } from "react";

/** True only after `value` stays true for `delayMs` — hides brief fetch flashes. */
export function useDebouncedTrue(value: boolean, delayMs: number): boolean {
  const [debounced, setDebounced] = useState(false);

  useEffect(() => {
    if (!value) {
      setDebounced(false);
      return;
    }
    const timer = window.setTimeout(() => setDebounced(true), delayMs);
    return () => window.clearTimeout(timer);
  }, [value, delayMs]);

  return debounced;
}

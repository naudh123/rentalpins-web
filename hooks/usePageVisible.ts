"use client";

import { useEffect, useRef, useState } from "react";

/** Tracks document visibility — pause map fetches while the tab is in the background. */
export function usePageVisible() {
  const [visible, setVisible] = useState(true);
  const visibleRef = useRef(true);
  visibleRef.current = visible;

  useEffect(() => {
    const sync = () => {
      const v = !document.hidden;
      visibleRef.current = v;
      setVisible(v);
    };
    sync();
    document.addEventListener("visibilitychange", sync);
    return () => document.removeEventListener("visibilitychange", sync);
  }, []);

  return { visible, visibleRef };
}

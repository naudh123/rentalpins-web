"use client";

import { useEffect, type MutableRefObject } from "react";
import type { PersistedMapView } from "@/lib/map-last-view";
import {
  cancelScheduledSavePersistedMapView,
  flushPersistedMapView,
} from "@/lib/map-last-view";

interface Options {
  mapRef: MutableRefObject<google.maps.Map | null>;
  abortFetch: () => void;
  cancelUrlSync: () => void;
  buildPersistedView: (map: google.maps.Map) => PersistedMapView | null;
}

/** Flush persisted map view and abort in-flight work on unmount. */
export function useMapLifecycleCleanup({
  mapRef,
  abortFetch,
  cancelUrlSync,
  buildPersistedView,
}: Options): void {
  useEffect(() => {
    return () => {
      abortFetch();
      cancelUrlSync();
      const map = mapRef.current;
      const view = map ? buildPersistedView(map) : null;
      if (view) flushPersistedMapView(view);
      else cancelScheduledSavePersistedMapView();
    };
  }, [abortFetch, buildPersistedView, cancelUrlSync, mapRef]);
}

"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useJsApiLoader, type Libraries, type LoadScriptProps } from "@react-google-maps/api";
import { googleMapsApiKey } from "@/lib/config";

/**
 * Single Maps bootstrap for the whole app — useJsApiLoader must only run once per
 * options set. SearchMap + LocationPicker share this provider.
 * Bump id when libraries change (dev HMR may need a hard refresh after bump).
 *
 * The loader is lazy: the Maps JS + Places script is only requested once a
 * component calls useRentalPinsMapsLoader(), so pages without a map (home,
 * blog, city hubs) don't download it. After the first request the loader stays
 * mounted, so client-side navigation between map pages never reloads the script.
 */
export const GOOGLE_MAPS_LOADER_ID = "rentalpins-maps-v4";

const LIBRARIES: Libraries = ["places"];

/** Stable options object — do not inline in useJsApiLoader (referential equality). */
export const GOOGLE_MAPS_LOADER_OPTIONS: LoadScriptProps = {
  googleMapsApiKey,
  id: GOOGLE_MAPS_LOADER_ID,
  libraries: LIBRARIES,
};

type LoaderState = ReturnType<typeof useJsApiLoader>;

interface LoaderContextValue {
  state: LoaderState;
  request: () => void;
}

const INITIAL_STATE: LoaderState = { isLoaded: false, loadError: undefined };

const GoogleMapsLoaderContext = createContext<LoaderContextValue | null>(null);

/** Mounted only after the first request; runs the real loader once. */
function MapsScriptLoader({ onState }: { onState: (state: LoaderState) => void }) {
  const { isLoaded, loadError } = useJsApiLoader(GOOGLE_MAPS_LOADER_OPTIONS);
  useEffect(() => {
    onState({ isLoaded, loadError });
  }, [isLoaded, loadError, onState]);
  return null;
}

export function GoogleMapsLoaderProvider({ children }: { children: React.ReactNode }) {
  const [requested, setRequested] = useState(false);
  const [state, setState] = useState<LoaderState>(INITIAL_STATE);
  const request = useCallback(() => setRequested(true), []);
  const value = useMemo(() => ({ state, request }), [state, request]);

  return (
    <GoogleMapsLoaderContext.Provider value={value}>
      {requested ? <MapsScriptLoader onState={setState} /> : null}
      {children}
    </GoogleMapsLoaderContext.Provider>
  );
}

export function useRentalPinsMapsLoader(): LoaderState {
  const ctx = useContext(GoogleMapsLoaderContext);
  if (!ctx) {
    throw new Error("useRentalPinsMapsLoader requires GoogleMapsLoaderProvider");
  }
  const { request } = ctx;
  useEffect(() => {
    request();
  }, [request]);
  return ctx.state;
}

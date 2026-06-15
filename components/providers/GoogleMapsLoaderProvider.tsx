"use client";

import { createContext, useContext } from "react";
import { useJsApiLoader, type Libraries, type LoadScriptProps } from "@react-google-maps/api";
import { googleMapsApiKey } from "@/lib/config";

/**
 * Single Maps bootstrap for the whole app — useJsApiLoader must only run once per
 * options set. SearchMap + LocationPicker share this provider.
 * Bump id when libraries change (dev HMR may need a hard refresh after bump).
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

const GoogleMapsLoaderContext = createContext<LoaderState | null>(null);

export function GoogleMapsLoaderProvider({ children }: { children: React.ReactNode }) {
  const loader = useJsApiLoader(GOOGLE_MAPS_LOADER_OPTIONS);
  return (
    <GoogleMapsLoaderContext.Provider value={loader}>
      {children}
    </GoogleMapsLoaderContext.Provider>
  );
}

export function useRentalPinsMapsLoader(): LoaderState {
  const loader = useContext(GoogleMapsLoaderContext);
  if (!loader) {
    throw new Error("useRentalPinsMapsLoader requires GoogleMapsLoaderProvider");
  }
  return loader;
}

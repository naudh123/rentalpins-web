import { useJsApiLoader, type Libraries } from "@react-google-maps/api";
import { googleMapsApiKey } from "@/lib/config";

/** Single loader id + libraries for all map surfaces (avoids "Loader must not be called again"). */
/** Bump when libraries change — avoids stale @react-google-maps/api loader singleton in dev HMR. */
export const GOOGLE_MAPS_LOADER_ID = "rentalpins-maps-v2";

const libraries: Libraries = ["places", "drawing"];

export function useRentalPinsMapsLoader() {
  return useJsApiLoader({
    googleMapsApiKey,
    id: GOOGLE_MAPS_LOADER_ID,
    libraries,
  });
}

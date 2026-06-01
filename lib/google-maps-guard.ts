/** True when the Maps JavaScript API is loaded on window. */
export function isGoogleMapsReady(): boolean {
  return typeof google !== "undefined" && Boolean(google.maps);
}

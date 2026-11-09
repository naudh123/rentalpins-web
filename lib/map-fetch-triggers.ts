/**
 * Map refetch trigger rules (pure, unit-tested).
 *
 * A forced refetch must only happen when something actually changed: the tab
 * became visible again, or the server-side filters changed. It must never be
 * driven by callback identity — that turned every render into a forced fetch
 * (an idle /search tab requested /api/listings ~2.7×/s).
 */

/** True only on a hidden → visible transition (tab refocus), never on mount or re-render. */
export function shouldRefetchOnVisibility(wasVisible: boolean, isVisible: boolean): boolean {
  return !wasVisible && isVisible;
}

/** True when the server-side filter key changed since the last fetch-triggering render. */
export function shouldRefetchOnFilters(lastKey: string, nextKey: string): boolean {
  return lastKey !== nextKey;
}

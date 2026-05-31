const STORAGE_KEY = "rp_map_last_view";
const MAX_AGE_MS = 1000 * 60 * 60 * 24 * 30; // 30 days

type PersistedBounds = {
  north: number;
  south: number;
  east: number;
  west: number;
};

export interface PersistedMapView {
  centerLat: number;
  centerLng: number;
  zoom: number;
  savedAtMs?: number;
  bounds?: PersistedBounds;
  selectedId?: string | null;
  placeQuery?: string | null;
  category?: string;
  sort?: string;
  priceMin?: number | null;
  priceMax?: number | null;
}

function isFiniteNumber(v: unknown): v is number {
  return typeof v === "number" && Number.isFinite(v);
}

function isLat(v: unknown): v is number {
  return isFiniteNumber(v) && v >= -90 && v <= 90;
}

function isLng(v: unknown): v is number {
  return isFiniteNumber(v) && v >= -180 && v <= 180;
}

function isZoom(v: unknown): v is number {
  return isFiniteNumber(v) && v >= 1 && v <= 22;
}

export function loadPersistedMapView(): PersistedMapView | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as PersistedMapView;
    if (!isLat(parsed.centerLat) || !isLng(parsed.centerLng) || !isZoom(parsed.zoom)) {
      return null;
    }
    if (
      isFiniteNumber(parsed.savedAtMs) &&
      Date.now() - parsed.savedAtMs > MAX_AGE_MS
    ) {
      return null;
    }
    if (parsed.bounds) {
      const { north, south, east, west } = parsed.bounds;
      const boundsAreValid =
        isLat(north) &&
        isLat(south) &&
        isLng(east) &&
        isLng(west) &&
        north >= south &&
        east >= west;
      if (!boundsAreValid) delete parsed.bounds;
    }
    if (typeof parsed.selectedId !== "string" || !parsed.selectedId.trim()) {
      delete parsed.selectedId;
    } else {
      parsed.selectedId = parsed.selectedId.trim();
    }
    if (!isFiniteNumber(parsed.priceMin) || parsed.priceMin < 0) {
      delete parsed.priceMin;
    }
    if (!isFiniteNumber(parsed.priceMax) || parsed.priceMax < 0) {
      delete parsed.priceMax;
    }
    if (
      isFiniteNumber(parsed.priceMin) &&
      isFiniteNumber(parsed.priceMax) &&
      parsed.priceMin > parsed.priceMax
    ) {
      const tmp = parsed.priceMin;
      parsed.priceMin = parsed.priceMax;
      parsed.priceMax = tmp;
    }
    return parsed;
  } catch {
    return null;
  }
}

export function savePersistedMapView(view: PersistedMapView): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...view, savedAtMs: Date.now() }));
}

const SAVE_DEBOUNCE_MS = 800;
let saveTimer: ReturnType<typeof setTimeout> | null = null;
let lastFingerprint: string | null = null;

function fingerprint(view: PersistedMapView): string {
  return [
    view.centerLat.toFixed(4),
    view.centerLng.toFixed(4),
    view.zoom,
    view.bounds ? view.bounds.north.toFixed(4) : "",
    view.bounds ? view.bounds.south.toFixed(4) : "",
    view.bounds ? view.bounds.east.toFixed(4) : "",
    view.bounds ? view.bounds.west.toFixed(4) : "",
    view.selectedId ?? "",
    view.placeQuery ?? "",
    view.category ?? "",
    view.sort ?? "",
    view.priceMin ?? "",
    view.priceMax ?? "",
  ].join("|");
}

/** Debounced write — avoids localStorage churn on every map idle while panning. */
export function scheduleSavePersistedMapView(
  view: PersistedMapView,
  delayMs = SAVE_DEBOUNCE_MS
): void {
  if (typeof window === "undefined") return;
  const fp = fingerprint(view);
  if (fp === lastFingerprint) return;

  if (saveTimer) clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    saveTimer = null;
    savePersistedMapView(view);
    lastFingerprint = fp;
  }, delayMs);
}

/** Persist immediately (e.g. before leaving the page). */
export function flushPersistedMapView(view: PersistedMapView): void {
  if (typeof window === "undefined") return;
  if (saveTimer) {
    clearTimeout(saveTimer);
    saveTimer = null;
  }
  savePersistedMapView(view);
  lastFingerprint = fingerprint(view);
}

export function cancelScheduledSavePersistedMapView(): void {
  if (saveTimer) {
    clearTimeout(saveTimer);
    saveTimer = null;
  }
}

export function clearPersistedMapView(): void {
  if (typeof window === "undefined") return;
  if (saveTimer) {
    clearTimeout(saveTimer);
    saveTimer = null;
  }
  lastFingerprint = null;
  localStorage.removeItem(STORAGE_KEY);
}

export function hasUrlMapViewport(
  params: URLSearchParams | Record<string, string | string[] | undefined>
): boolean {
  const get = (key: string): string | null => {
    const raw = params instanceof URLSearchParams ? params.get(key) : params[key];
    if (Array.isArray(raw)) return raw[0] ?? null;
    return raw ?? null;
  };
  return (
    get("lat") != null ||
    get("lng") != null ||
    get("zoom") != null ||
    (get("north") != null && get("south") != null && get("east") != null && get("west") != null)
  );
}

export function hasUrlSearchFilters(
  params: URLSearchParams | Record<string, string | string[] | undefined>
): boolean {
  const has = (key: string): boolean => {
    if (params instanceof URLSearchParams) return params.has(key);
    const raw = params[key];
    if (raw == null) return false;
    if (Array.isArray(raw)) return raw.length > 0 && raw[0] !== "";
    return raw !== "";
  };
  return has("category") || has("sort") || has("priceMin") || has("priceMax") || has("q");
}

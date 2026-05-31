const STORAGE_KEY = "rp_recently_viewed";
const MAX_ENTRIES = 12;

export interface RecentlyViewedEntry {
  id: string;
  viewedAt: number;
}

function readRaw(): RecentlyViewedEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter(
        (e): e is RecentlyViewedEntry =>
          typeof e === "object" &&
          e !== null &&
          typeof (e as RecentlyViewedEntry).id === "string" &&
          typeof (e as RecentlyViewedEntry).viewedAt === "number"
      )
      .slice(0, MAX_ENTRIES);
  } catch {
    return [];
  }
}

function write(entries: RecentlyViewedEntry[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries.slice(0, MAX_ENTRIES)));
}

/** Most recently viewed first. */
export function getRecentlyViewedIds(): string[] {
  return readRaw()
    .sort((a, b) => b.viewedAt - a.viewedAt)
    .map((e) => e.id);
}

export function recordRecentlyViewed(listingId: string): void {
  if (!listingId || typeof window === "undefined") return;
  const now = Date.now();
  const rest = readRaw().filter((e) => e.id !== listingId);
  write([{ id: listingId, viewedAt: now }, ...rest]);
}

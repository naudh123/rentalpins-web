const STORAGE_KEY = "rentalpins-invest-shortlist";

export interface InvestShortlistEntry {
  listingId: string;
  title: string;
  priceLabel: string | null;
  locality: string | null;
  notes: string;
  targetYieldPercent: number | null;
  corridorId: string | null;
  savedAtMs: number;
}

function readAll(): InvestShortlistEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as InvestShortlistEntry[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeAll(items: InvestShortlistEntry[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items.slice(0, 30)));
}

export function getInvestShortlist(): InvestShortlistEntry[] {
  return readAll().sort((a, b) => b.savedAtMs - a.savedAtMs);
}

export function isInInvestShortlist(listingId: string): boolean {
  return readAll().some((e) => e.listingId === listingId);
}

export function addToInvestShortlist(
  entry: Omit<InvestShortlistEntry, "savedAtMs">
): void {
  const all = readAll().filter((e) => e.listingId !== entry.listingId);
  all.unshift({ ...entry, savedAtMs: Date.now() });
  writeAll(all);
}

export function updateInvestShortlistNotes(
  listingId: string,
  updates: Partial<Pick<InvestShortlistEntry, "notes" | "targetYieldPercent" | "corridorId">>
): void {
  const all = readAll();
  const idx = all.findIndex((e) => e.listingId === listingId);
  if (idx < 0) return;
  all[idx] = { ...all[idx]!, ...updates };
  writeAll(all);
}

export function removeFromInvestShortlist(listingId: string): void {
  writeAll(readAll().filter((e) => e.listingId !== listingId));
}

export function toggleInvestShortlist(
  entry: Omit<InvestShortlistEntry, "savedAtMs">
): boolean {
  if (isInInvestShortlist(entry.listingId)) {
    removeFromInvestShortlist(entry.listingId);
    return false;
  }
  addToInvestShortlist(entry);
  return true;
}

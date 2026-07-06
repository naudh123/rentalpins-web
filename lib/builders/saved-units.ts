const STORAGE_KEY = "rentalpins-saved-units";

export interface SavedUnitRef {
  projectId: string;
  projectSlug: string;
  citySlug: string;
  projectName: string;
  unitId: string;
  plotNumber: string | null;
  savedAtMs: number;
}

function readAll(): SavedUnitRef[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as SavedUnitRef[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeAll(items: SavedUnitRef[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items.slice(0, 20)));
}

export function getSavedUnitsForProject(projectId: string): SavedUnitRef[] {
  return readAll().filter((u) => u.projectId === projectId);
}

export function isUnitSaved(projectId: string, unitId: string): boolean {
  return readAll().some((u) => u.projectId === projectId && u.unitId === unitId);
}

export function toggleSavedUnit(ref: Omit<SavedUnitRef, "savedAtMs">): boolean {
  const all = readAll();
  const idx = all.findIndex((u) => u.projectId === ref.projectId && u.unitId === ref.unitId);
  if (idx >= 0) {
    all.splice(idx, 1);
    writeAll(all);
    return false;
  }
  all.unshift({ ...ref, savedAtMs: Date.now() });
  writeAll(all);
  return true;
}

export function removeSavedUnit(projectId: string, unitId: string): void {
  writeAll(readAll().filter((u) => !(u.projectId === projectId && u.unitId === unitId)));
}

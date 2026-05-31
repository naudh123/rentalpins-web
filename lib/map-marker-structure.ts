import type { MapPinLabelTier } from "@/lib/map-zoom-tier";

export function listingMarkerSvgKey(
  listing: { price: number; isPromoted?: boolean; homeIso?: string | null },
  labelTier: MapPinLabelTier
): string {
  return `${labelTier}|${listing.price}|${listing.isPromoted ? 1 : 0}|${listing.homeIso ?? ""}`;
}

export function listingMarkerStyleKey(
  listingId: string,
  selectedId: string | null,
  highlightedId: string | null
): string {
  const isSelected = listingId === selectedId;
  const isHighlighted = listingId === highlightedId && !isSelected;
  return `${isSelected ? 1 : 0}|${isHighlighted ? 1 : 0}`;
}

/** List hover highlights a pin without selecting it — z-index only, no SVG rebuild. */
export function isListingHoverOnlyHighlight(
  listingId: string,
  selectedId: string | null,
  highlightedId: string | null
): boolean {
  return listingId === highlightedId && listingId !== selectedId;
}

/** True when pin icon SVG should rebuild for a style change (not hover-only). */
export function listingMarkerIconStyleChanged(
  prevStyleKey: string | undefined,
  nextStyleKey: string,
  hoverOnly: boolean
): boolean {
  if (!prevStyleKey || prevStyleKey === nextStyleKey) return false;
  return !hoverOnly;
}

export function buildingMarkerStyleKey(
  group: { id: string }[],
  selectedId: string | null,
  highlightedId: string | null
): string {
  const isSelected = group.some((l) => l.id === selectedId);
  const isHighlighted = group.some(
    (l) => l.id === highlightedId && l.id !== selectedId
  );
  return `${isSelected ? 1 : 0}|${isHighlighted ? 1 : 0}`;
}

export function isBuildingHoverOnlyHighlight(
  group: { id: string }[],
  selectedId: string | null,
  highlightedId: string | null
): boolean {
  return (
    highlightedId != null &&
    !group.some((l) => l.id === selectedId) &&
    group.some((l) => l.id === highlightedId)
  );
}

export function mapPinStructureKey(opts: {
  useBuildingPins: boolean;
  labelTier: MapPinLabelTier;
  pinIdsKey: string;
  buildingKeysKey: string;
}): string {
  const { useBuildingPins, labelTier, pinIdsKey, buildingKeysKey } = opts;
  return `${useBuildingPins ? 1 : 0}|${labelTier}|${pinIdsKey}|${buildingKeysKey}`;
}

/** Listing ids whose pin visuals may change when selection/highlight moves. */
export function selectionAffectedListingIds(
  prevSelected: string | null,
  prevHighlighted: string | null,
  selectedId: string | null,
  highlightedId: string | null
): Set<string> {
  const ids = new Set<string>();
  if (prevSelected) ids.add(prevSelected);
  if (prevHighlighted) ids.add(prevHighlighted);
  if (selectedId) ids.add(selectedId);
  if (highlightedId) ids.add(highlightedId);
  return ids;
}

export function buildingKeysForAffectedListings(
  buildingGroups: Map<string, { id: string }[]>,
  affectedListingIds: Set<string>
): string[] {
  const keys: string[] = [];
  for (const [key, group] of buildingGroups.entries()) {
    if (group.some((l) => affectedListingIds.has(l.id))) keys.push(key);
  }
  return keys;
}

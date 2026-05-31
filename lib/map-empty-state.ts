export type MapEmptyVariant = "no_listings" | "filtered_out" | "zoom_for_more";

export type MapEmptyAction = "clear_filters" | "clear_keywords" | "clear_drawn_area";

export function resolveMapEmptyState(opts: {
  listingCount: number;
  totalInBounds: number;
  loading: boolean;
  refreshing?: boolean;
  areaMayHaveMore: boolean;
  filtersActive: boolean;
  keywordsActive: boolean;
  drawnAreaActive: boolean;
}): { show: boolean; variant: MapEmptyVariant } {
  const {
    listingCount,
    totalInBounds,
    loading,
    refreshing,
    areaMayHaveMore,
    filtersActive,
    keywordsActive,
    drawnAreaActive,
  } = opts;

  if (loading || refreshing || listingCount > 0) {
    return { show: false, variant: "no_listings" };
  }

  const clientFilterActive = keywordsActive || drawnAreaActive;
  const filteredOut =
    totalInBounds > 0 && (filtersActive || clientFilterActive);
  if (filteredOut) {
    return { show: true, variant: "filtered_out" };
  }

  if (areaMayHaveMore) {
    return { show: true, variant: "zoom_for_more" };
  }

  return { show: true, variant: "no_listings" };
}

export function resolveMapEmptyActions(opts: {
  variant: MapEmptyVariant;
  filtersActive: boolean;
  keywordsActive: boolean;
  drawnAreaActive: boolean;
}): MapEmptyAction[] {
  if (opts.variant !== "filtered_out") return [];
  const actions: MapEmptyAction[] = [];
  if (opts.filtersActive) actions.push("clear_filters");
  if (opts.keywordsActive) actions.push("clear_keywords");
  if (opts.drawnAreaActive) actions.push("clear_drawn_area");
  return actions;
}

function filteredOutConstraintLabel(opts: {
  filtersActive: boolean;
  keywordsActive: boolean;
  drawnAreaActive: boolean;
}): string {
  const parts: string[] = [];
  if (opts.filtersActive) parts.push("filters");
  if (opts.keywordsActive) parts.push("your search");
  if (opts.drawnAreaActive) parts.push("the drawn area");
  if (parts.length === 0) return "your filters";
  if (parts.length === 1) return parts[0]!;
  if (parts.length === 2) return `${parts[0]} and ${parts[1]}`;
  return `${parts.slice(0, -1).join(", ")}, and ${parts[parts.length - 1]}`;
}

export function mapEmptyOverlayCopy(opts: {
  variant: MapEmptyVariant;
  totalInBounds: number;
  filtersActive?: boolean;
  keywordsActive?: boolean;
  drawnAreaActive?: boolean;
}): { title: string; detail: string } {
  const {
    variant,
    totalInBounds,
    filtersActive = false,
    keywordsActive = false,
    drawnAreaActive = false,
  } = opts;

  if (variant === "filtered_out") {
    const noun =
      totalInBounds === 1 ? "1 rental is" : `${totalInBounds} rentals are`;
    const constraint = filteredOutConstraintLabel({
      filtersActive,
      keywordsActive,
      drawnAreaActive,
    });
    return {
      title: "No matches in this view",
      detail: `${noun} in this area but none match ${constraint}.`,
    };
  }
  if (variant === "zoom_for_more") {
    return {
      title: "Zoom in to see pins",
      detail: "This area may have more listings — zoom in or pan to a neighborhood.",
    };
  }
  return {
    title: "No rentals here yet",
    detail: "Try another city, search a place name, or zoom to a nearby area.",
  };
}

export type MapEmptyPeekPrimary = MapEmptyAction | "zoom_in" | "open_list";

export function mapEmptyPeekPrimaryAction(opts: {
  variant: MapEmptyVariant;
  actions: MapEmptyAction[];
}): MapEmptyPeekPrimary | null {
  if (opts.variant === "zoom_for_more") return "zoom_in";
  if (opts.actions.length === 1) return opts.actions[0]!;
  if (opts.actions.length > 1) return "open_list";
  if (opts.variant === "no_listings") return "open_list";
  return null;
}

export function mapEmptyActionLabel(
  action: MapEmptyAction,
  keywordPreview?: string
): string {
  if (action === "clear_keywords") {
    const trimmed = keywordPreview?.trim();
    if (trimmed) {
      const short = trimmed.length > 18 ? `${trimmed.slice(0, 16)}…` : trimmed;
      return `Clear “${short}”`;
    }
    return "Clear search";
  }
  if (action === "clear_drawn_area") return "Clear drawn area";
  return "Clear filters";
}

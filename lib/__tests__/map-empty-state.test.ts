import { describe, expect, it } from "vitest";
import {
  mapEmptyActionLabel,
  mapEmptyOverlayCopy,
  mapEmptyPeekPrimaryAction,
  resolveMapEmptyActions,
  resolveMapEmptyState,
} from "@/lib/map-empty-state";
import { mapGestureHandlingDuringDraw } from "@/lib/map-gestures";

describe("resolveMapEmptyState", () => {
  it("hides while loading or when pins exist", () => {
    expect(
      resolveMapEmptyState({
        listingCount: 3,
        totalInBounds: 10,
        loading: false,
        areaMayHaveMore: false,
        filtersActive: false,
        keywordsActive: false,
        drawnAreaActive: false,
      }).show
    ).toBe(false);
    expect(
      resolveMapEmptyState({
        listingCount: 0,
        totalInBounds: 0,
        loading: true,
        areaMayHaveMore: false,
        filtersActive: false,
        keywordsActive: false,
        drawnAreaActive: false,
      }).show
    ).toBe(false);
  });

  it("shows filtered_out when rentals exist but none match", () => {
    const state = resolveMapEmptyState({
      listingCount: 0,
      totalInBounds: 12,
      loading: false,
      areaMayHaveMore: false,
      filtersActive: true,
      keywordsActive: false,
      drawnAreaActive: false,
    });
    expect(state).toEqual({ show: true, variant: "filtered_out" });
  });

  it("shows filtered_out for keyword-only empty map", () => {
    const state = resolveMapEmptyState({
      listingCount: 0,
      totalInBounds: 8,
      loading: false,
      areaMayHaveMore: false,
      filtersActive: false,
      keywordsActive: true,
      drawnAreaActive: false,
    });
    expect(state).toEqual({ show: true, variant: "filtered_out" });
  });

  it("shows zoom_for_more when area may have more", () => {
    const state = resolveMapEmptyState({
      listingCount: 0,
      totalInBounds: 0,
      loading: false,
      areaMayHaveMore: true,
      filtersActive: false,
      keywordsActive: false,
      drawnAreaActive: false,
    });
    expect(state).toEqual({ show: true, variant: "zoom_for_more" });
  });
});

describe("resolveMapEmptyActions", () => {
  it("returns keyword clear when only search is active", () => {
    expect(
      resolveMapEmptyActions({
        variant: "filtered_out",
        filtersActive: false,
        keywordsActive: true,
        drawnAreaActive: false,
      })
    ).toEqual(["clear_keywords"]);
  });

  it("returns all applicable clears when stacked", () => {
    expect(
      resolveMapEmptyActions({
        variant: "filtered_out",
        filtersActive: true,
        keywordsActive: true,
        drawnAreaActive: true,
      })
    ).toEqual(["clear_filters", "clear_keywords", "clear_drawn_area"]);
  });
});

describe("mapEmptyOverlayCopy", () => {
  it("mentions search when keywords filter everything", () => {
    const copy = mapEmptyOverlayCopy({
      variant: "filtered_out",
      totalInBounds: 5,
      keywordsActive: true,
    });
    expect(copy.detail).toContain("your search");
  });
});

describe("mapEmptyActionLabel", () => {
  it("truncates long keyword preview", () => {
    const label = mapEmptyActionLabel(
      "clear_keywords",
      "very long search phrase here"
    );
    expect(label).toContain("Clear");
    expect(label.length).toBeLessThan(30);
  });
});

describe("mapGestureHandlingDuringDraw", () => {
  it("uses cooperative on mobile only", () => {
    expect(mapGestureHandlingDuringDraw(true)).toBe("cooperative");
    expect(mapGestureHandlingDuringDraw(false)).toBe("greedy");
  });
});

describe("mapEmptyPeekPrimaryAction", () => {
  it("prefers zoom in for zoom_for_more", () => {
    expect(
      mapEmptyPeekPrimaryAction({ variant: "zoom_for_more", actions: [] })
    ).toBe("zoom_in");
  });

  it("returns single action when only one clear applies", () => {
    expect(
      mapEmptyPeekPrimaryAction({
        variant: "filtered_out",
        actions: ["clear_keywords"],
      })
    ).toBe("clear_keywords");
  });

  it("opens list when multiple clears apply", () => {
    expect(
      mapEmptyPeekPrimaryAction({
        variant: "filtered_out",
        actions: ["clear_filters", "clear_keywords"],
      })
    ).toBe("open_list");
  });
});

describe("useMapEmptyState visibility", () => {
  function emptyStateSnapshot(opts: {
    listingCount: number;
    totalInBounds: number;
    filteredListingsCount: number;
    drawnShape: boolean;
    loading: boolean;
    refreshing: boolean;
    areaMayHaveMore: boolean;
    activeFilterCount: number;
    textQuery: string;
    drawMode: boolean;
  }) {
    const keywordsActive = Boolean(opts.textQuery.trim());
    const drawnAreaActive = opts.drawnShape;
    const effectiveTotalInBounds = opts.drawnShape
      ? opts.filteredListingsCount
      : opts.totalInBounds;
    const emptyState = resolveMapEmptyState({
      listingCount: opts.listingCount,
      totalInBounds: effectiveTotalInBounds,
      loading: opts.loading,
      refreshing: opts.refreshing,
      areaMayHaveMore: opts.areaMayHaveMore,
      filtersActive: opts.activeFilterCount > 0,
      keywordsActive,
      drawnAreaActive,
    });
    return {
      showMapEmpty: emptyState.show && !opts.drawMode,
      showListEmpty: emptyState.show && !opts.loading,
      variant: emptyState.variant,
    };
  }

  it("shows list empty when filtered on mobile list view", () => {
    const snap = emptyStateSnapshot({
      listingCount: 0,
      totalInBounds: 5,
      filteredListingsCount: 5,
      drawnShape: false,
      loading: false,
      refreshing: false,
      areaMayHaveMore: false,
      activeFilterCount: 1,
      textQuery: "",
      drawMode: false,
    });
    expect(snap.showListEmpty).toBe(true);
    expect(snap.showMapEmpty).toBe(true);
    expect(snap.variant).toBe("filtered_out");
  });

  it("hides both while loading", () => {
    const snap = emptyStateSnapshot({
      listingCount: 0,
      totalInBounds: 0,
      filteredListingsCount: 0,
      drawnShape: false,
      loading: true,
      refreshing: false,
      areaMayHaveMore: false,
      activeFilterCount: 0,
      textQuery: "",
      drawMode: false,
    });
    expect(snap.showListEmpty).toBe(false);
    expect(snap.showMapEmpty).toBe(false);
  });
});

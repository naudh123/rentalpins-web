"use client";

import { useState, type ReactNode } from "react";
import {
  MAIN_CATEGORIES,
  PROPERTY_CATEGORY,
  getSubCategories,
  BHK_OPTIONS,
  FURNISHING_OPTIONS,
  TENANT_PREFERENCE_OPTIONS,
} from "@/lib/categories";
import {
  countActiveFilters,
  type ListingFilters,
  type ListingSort,
} from "@/lib/listing-filters";
import { resetListingFilters } from "@/lib/listing-filter-reset";
import { buildMapResultsCountInfo, type MapResultsCountInfo } from "@/lib/map-list-count";
import { trackEvent } from "@/lib/ga4";

const SORT_OPTIONS: { value: ListingSort; label: string }[] = [
  { value: "recommended", label: "Recommended" },
  { value: "newest", label: "Newest" },
  { value: "price_asc", label: "Price ↑" },
  { value: "price_desc", label: "Price ↓" },
];

interface Props {
  filters: ListingFilters;
  onChange: (filters: ListingFilters) => void;
  resultCount: number;
  totalCount: number;
  mapZoom: number;
  resultsMayBeIncomplete?: boolean;
  loading?: boolean;
  refreshing?: boolean;
  filtersActive?: boolean;
  clientFilterActive?: boolean;
  saveSearchSlot?: ReactNode;
  /** Precomputed count copy — avoids header flicker during map refresh. */
  countInfo?: MapResultsCountInfo;
}

export default function SearchFilters({
  filters,
  onChange,
  resultCount,
  totalCount,
  mapZoom,
  resultsMayBeIncomplete = false,
  loading = false,
  refreshing = false,
  filtersActive = false,
  clientFilterActive = false,
  saveSearchSlot,
  countInfo: countInfoProp,
}: Props) {
  const [expanded, setExpanded] = useState(false);
  const activeCount = countActiveFilters(filters);
  const categories = ["All", ...MAIN_CATEGORIES];
  const countInfo =
    countInfoProp ??
    buildMapResultsCountInfo({
      resultCount,
      totalInBounds: totalCount,
      loading,
      refreshing,
      resultsMayBeIncomplete,
      mapZoom,
      filtersActive,
      clientFilterActive,
    });

  function update(patch: Partial<ListingFilters>) {
    if (loading) return;
    const prev = filters;
    const next = { ...filters, ...patch };
    // Changing the main category invalidates subcategory + property attributes.
    if (patch.category != null && patch.category !== prev.category) {
      next.subCategory = "";
      next.bhk = "";
      next.furnishing = "";
      next.tenantPreference = "";
      next.areaMin = null;
      next.areaMax = null;
    }
    if (
      next.priceMin != null &&
      next.priceMax != null &&
      next.priceMin > next.priceMax
    ) {
      const tmp = next.priceMin;
      next.priceMin = next.priceMax;
      next.priceMax = tmp;
    }
    onChange(next);
    if (next.category !== prev.category) {
      trackEvent("filter_applied", { filter_name: "category", filter_value: next.category });
    }
    if (next.sort !== prev.sort) {
      trackEvent("filter_applied", { filter_name: "sort", filter_value: next.sort });
    }
    if (next.priceMin !== prev.priceMin || next.priceMax !== prev.priceMax) {
      trackEvent("filter_applied", {
        filter_name: "price",
        filter_value: `${next.priceMin ?? ""}-${next.priceMax ?? ""}`,
      });
    }
    for (const key of ["subCategory", "bhk", "furnishing", "tenantPreference"] as const) {
      if (next[key] !== prev[key]) {
        trackEvent("filter_applied", { filter_name: key, filter_value: next[key] || "any" });
      }
    }
    if (next.areaMin !== prev.areaMin || next.areaMax !== prev.areaMax) {
      trackEvent("filter_applied", {
        filter_name: "area",
        filter_value: `${next.areaMin ?? ""}-${next.areaMax ?? ""}`,
      });
    }
  }

  const isProperty = filters.category === PROPERTY_CATEGORY;
  const subOptions =
    filters.category !== "All" ? getSubCategories(filters.category) : [];

  function reset() {
    if (loading) return;
    if (activeCount === 0) {
      setExpanded(false);
      return;
    }
    onChange(resetListingFilters(filters.transactionType));
    setExpanded(false);
    trackEvent("filter_applied", {
      filter_name: "reset_all",
      filter_value: "all_defaults",
    });
  }

  return (
    <div className="relative z-[1] shrink-0 border-b border-[var(--border-subtle)] bg-[var(--bg-elevated)]/80 pointer-events-auto">
      <div className="flex items-center justify-between gap-3 px-4 py-3">
        <div>
          <h2 className="rp-section-title">
            {filters.transactionType === "sale"
              ? resultCount > 0
                ? "Properties for sale"
                : "Sale listings"
              : resultCount > 0
                ? "Rental Listings"
                : "Listings"}
          </h2>
          <p className="text-xs text-[var(--muted)]" aria-live="off">
            {countInfo.headline}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {saveSearchSlot}
          {activeCount > 0 && (
            <button
              type="button"
              onClick={reset}
              className="rp-btn rp-btn-ghost min-h-9 px-3 py-2 text-xs"
              title="Clear active filters"
              disabled={loading || activeCount === 0}
            >
              Clear
            </button>
          )}
          <button
            type="button"
            onClick={() => setExpanded((e) => !e)}
            className={`rp-btn rp-btn-ghost relative min-h-9 px-3 py-2 text-xs ${activeCount > 0 ? "border-[var(--accent)] text-[var(--accent)]" : ""}`}
            aria-expanded={expanded}
            disabled={loading}
          >
            Filters
            {activeCount > 0 && (
              <span className="ml-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[var(--accent)] px-1 text-[10px] font-bold text-[var(--accent-fg)]">
                {activeCount}
              </span>
            )}
          </button>
        </div>
      </div>

      <div className="flex snap-x snap-mandatory gap-2 overflow-x-auto px-4 pb-3.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => update({ category: cat })}
            className={`rp-chip snap-start shrink-0 px-4 py-2 text-sm ${filters.category === cat ? "rp-chip-active" : ""}`}
            aria-pressed={filters.category === cat}
          >
            {cat === "All" ? "All" : cat.split(" ")[0]}
          </button>
        ))}
      </div>

      {expanded && (
        <div
          className={`space-y-4 border-t border-[var(--border-subtle)] px-4 py-4 ${loading ? "pointer-events-none opacity-60" : ""}`}
        >
          <div>
            <label className="rp-label">Category</label>
            <select
              value={filters.category}
              onChange={(e) => update({ category: e.target.value })}
              className="rp-input"
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {subOptions.length > 0 && (
            <div>
              <label className="rp-label">Type</label>
              <select
                value={filters.subCategory ?? ""}
                onChange={(e) => update({ subCategory: e.target.value })}
                className="rp-input"
              >
                <option value="">All types</option>
                {subOptions.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          )}

          {isProperty && (
            <div className="space-y-4 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg)]/40 p-3">
              <div>
                <label className="rp-label">BHK</label>
                <div className="flex flex-wrap gap-2">
                  {BHK_OPTIONS.map((opt) => {
                    const active = filters.bhk === opt;
                    return (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => update({ bhk: active ? "" : opt })}
                        className={`rp-chip px-3 py-1.5 text-xs ${active ? "rp-chip-active" : ""}`}
                        aria-pressed={active}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="rp-label">Furnishing</label>
                  <select
                    value={filters.furnishing ?? ""}
                    onChange={(e) => update({ furnishing: e.target.value })}
                    className="rp-input"
                  >
                    <option value="">Any</option>
                    {FURNISHING_OPTIONS.map((o) => (
                      <option key={o} value={o}>
                        {o}
                      </option>
                    ))}
                  </select>
                </div>
                {filters.transactionType !== "sale" && (
                <div>
                  <label className="rp-label">Tenant</label>
                  <select
                    value={filters.tenantPreference ?? ""}
                    onChange={(e) => update({ tenantPreference: e.target.value })}
                    className="rp-input"
                  >
                    <option value="">Any</option>
                    {TENANT_PREFERENCE_OPTIONS.map((o) => (
                      <option key={o} value={o}>
                        {o}
                      </option>
                    ))}
                  </select>
                </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="rp-label">Min area (sq ft)</label>
                  <input
                    type="number"
                    min={0}
                    placeholder="0"
                    value={filters.areaMin ?? ""}
                    onChange={(e) =>
                      update({ areaMin: e.target.value ? Number(e.target.value) : null })
                    }
                    className="rp-input"
                  />
                </div>
                <div>
                  <label className="rp-label">Max area (sq ft)</label>
                  <input
                    type="number"
                    min={0}
                    placeholder="Any"
                    value={filters.areaMax ?? ""}
                    onChange={(e) =>
                      update({ areaMax: e.target.value ? Number(e.target.value) : null })
                    }
                    className="rp-input"
                  />
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="rp-label">Min price</label>
              <input
                type="number"
                min={0}
                placeholder="0"
                value={filters.priceMin ?? ""}
                onChange={(e) =>
                  update({ priceMin: e.target.value ? Number(e.target.value) : null })
                }
                className="rp-input"
              />
            </div>
            <div>
              <label className="rp-label">Max price</label>
              <input
                type="number"
                min={0}
                placeholder="Any"
                value={filters.priceMax ?? ""}
                onChange={(e) =>
                  update({ priceMax: e.target.value ? Number(e.target.value) : null })
                }
                className="rp-input"
              />
            </div>
          </div>

          <div>
            <label className="rp-label">Sort by</label>
            <select
              value={filters.sort}
              onChange={(e) => update({ sort: e.target.value as ListingSort })}
              className="rp-input"
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>

          <button
            type="button"
            onClick={reset}
            disabled={activeCount === 0}
            className="text-xs font-medium text-[var(--accent)] disabled:opacity-60"
          >
            Clear all filters
          </button>
          {activeCount === 0 && (
            <p className="text-[10px] text-[var(--muted)]">No active filters.</p>
          )}
        </div>
      )}
    </div>
  );
}

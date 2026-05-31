"use client";

export type MapMobileView = "map" | "peek" | "list";

interface Props {
  view: MapMobileView;
  listingCount: number;
  onChange: (view: MapMobileView) => void;
}

/** Map ↔ list on mobile (full map uses pinch zoom; no split “Both” sheet). */
export default function MapMobileViewSwitcher({ view, listingCount, onChange }: Props) {
  const tabs: { id: MapMobileView; label: string }[] = [
    { id: "map", label: "Map" },
    { id: "list", label: listingCount > 0 ? `List (${listingCount})` : "List" },
  ];

  return (
    <div
      className="pointer-events-auto absolute bottom-[max(1rem,env(safe-area-inset-bottom))] left-1/2 z-20 flex -translate-x-1/2 rounded-full border border-[var(--border)] bg-[var(--surface)]/95 p-1 shadow-[0_8px_32px_rgba(30,58,110,0.12)] backdrop-blur-sm md:hidden"
      role="tablist"
      aria-label="Map or list view"
    >
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          role="tab"
          aria-selected={view === tab.id}
          className={`min-h-10 rounded-full px-4 py-2 text-xs font-semibold transition-all duration-200 motion-reduce:transition-none ${
            view === tab.id
              ? "bg-[var(--brand-navy)] text-white shadow-sm"
              : "text-[var(--brand-navy)] hover:bg-[var(--bg-elevated)]"
          }`}
          onClick={() => onChange(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

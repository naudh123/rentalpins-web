interface Props {
  title?: string;
  zoom?: number | null;
  onZoomIn?: () => void;
}

export default function SavedSearchCoverageBadge({
  title,
  zoom,
  onZoomIn,
}: Props) {
  const hint =
    title ??
    (zoom != null
      ? `Large map area at zoom ${zoom} — open on map and zoom to 15+ for full coverage`
      : "Large map area — open on map and zoom in for full coverage");

  if (onZoomIn) {
    return (
      <button
        type="button"
        className="inline-flex items-center rounded-full border border-amber-200/90 bg-amber-50 px-2 py-0.5 text-[10px] font-semibold text-amber-900 hover:bg-amber-100/90"
        title={hint}
        onClick={(e) => {
          e.stopPropagation();
          onZoomIn();
        }}
      >
        Coverage limited
      </button>
    );
  }

  return (
    <span
      className="inline-flex items-center rounded-full border border-amber-200/90 bg-amber-50 px-2 py-0.5 text-[10px] font-semibold text-amber-900"
      title={hint}
    >
      Coverage limited
    </span>
  );
}

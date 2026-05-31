"use client";

interface Props {
  limitedSearchCount: number;
  limitedAlertCount: number;
}

export default function SavedSearchCoverageBanner({
  limitedSearchCount,
  limitedAlertCount,
}: Props) {
  if (limitedSearchCount === 0 && limitedAlertCount === 0) return null;

  const searchNote =
    limitedSearchCount === 1
      ? "1 saved search covers a large map area"
      : `${limitedSearchCount} saved searches cover large map areas`;
  const alertNote =
    limitedAlertCount > 0
      ? limitedAlertCount === 1
        ? "1 recent alert was flagged for incomplete coverage"
        : `${limitedAlertCount} recent alerts were flagged for incomplete coverage`
      : null;

  return (
    <div
      className="mt-6 rounded-lg border border-amber-200/80 bg-amber-50 px-4 py-3 text-sm text-amber-950"
      role="status"
    >
      <p className="font-semibold">Coverage may be incomplete</p>
      <p className="mt-1 text-xs leading-relaxed text-amber-900/90">
        {limitedSearchCount > 0 && (
          <>
            {searchNote} — hourly alerts may miss some listings. Open the map and
            zoom in on your area for fuller results.
          </>
        )}
        {limitedSearchCount > 0 && alertNote ? " " : null}
        {alertNote ? `${alertNote}.` : null}
      </p>
    </div>
  );
}

interface Props {
  areaName: string;
  rentRange?: string;
  listingCount: number;
  demandProfile?: string;
}

export default function RentTrendBlock({ areaName, rentRange, listingCount, demandProfile }: Props) {
  return (
    <section className="mx-auto max-w-4xl px-4 py-8" aria-labelledby="rent-trend-heading">
      <h2 id="rent-trend-heading" className="rp-section-title text-lg">
        Rent trends — {areaName}
      </h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-3">
        {rentRange ? (
          <div className="rp-card p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--brand-orange)]">Typical rent</p>
            <p className="mt-1 text-lg font-semibold text-[var(--brand-navy)]">{rentRange}/mo</p>
          </div>
        ) : null}
        <div className="rp-card p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--brand-orange)]">Live listings</p>
          <p className="mt-1 text-lg font-semibold text-[var(--brand-navy)]">{listingCount}</p>
        </div>
        {demandProfile ? (
          <div className="rp-card p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--brand-orange)]">Demand</p>
            <p className="mt-1 text-lg font-semibold capitalize text-[var(--brand-navy)]">{demandProfile}</p>
          </div>
        ) : null}
      </div>
      <p className="mt-4 text-sm text-[var(--muted)]">
        Figures are indicative from owner-listed inventory on RentalPins — confirm rent, deposit and inclusions with owners before token.
      </p>
    </section>
  );
}

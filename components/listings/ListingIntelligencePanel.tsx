import Link from "next/link";
import ListingRelatedListingCard from "@/components/listings/ListingRelatedListingCard";
import { appPath } from "@/lib/config";
import { formatPrice } from "@/lib/format";
import type { ValuationBand } from "@/lib/sale/listing-comps";
import type { ListingCard } from "@/lib/types/listing";

interface Props {
  listingId: string;
  listingPrice: number;
  priceUnit: string;
  homeIso?: string;
  band: ValuationBand | null;
  comparables: ListingCard[];
  areaName?: string;
}

function formatBandAmount(amount: number, homeIso?: string): string {
  return formatPrice(amount, "total", homeIso);
}

export default function ListingIntelligencePanel({
  listingId,
  listingPrice,
  priceUnit,
  homeIso,
  band,
  comparables,
  areaName,
}: Props) {
  if (!band && comparables.length === 0) return null;

  const unit = (priceUnit || "").toLowerCase();
  const showBand = band && band.sampleSize >= 2;
  const listingInBand =
    showBand && listingPrice > 0
      ? listingPrice >= band.low && listingPrice <= band.high
      : null;

  return (
    <section
      id="listing-intelligence"
      className="rp-card mt-4 scroll-mt-24 border-[color-mix(in_srgb,var(--sale-gold)_25%,var(--border))] p-5"
      aria-labelledby="listing-intelligence-heading"
    >
      <p className="text-xs font-bold uppercase tracking-[0.15em] text-[var(--sale-gold)]">
        RentalPins Buy · Market context
      </p>
      <h2
        id="listing-intelligence-heading"
        className="mt-1 font-serif text-xl text-[var(--brand-navy)]"
      >
        Sale intelligence
      </h2>
      <p className="mt-2 text-sm text-[var(--muted)]">
        Indicative band from {band?.sampleSize ?? comparables.length} nearby owner-listed
        sale {band?.sampleSize === 1 ? "property" : "properties"}
        {areaName ? ` in ${areaName}` : ""}. Not a formal appraisal — verify documents
        before any token.
      </p>

      {showBand && (
        <div className="mt-5 rounded-xl bg-[color-mix(in_srgb,var(--sale-gold)_6%,var(--bg))] p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">
            Valuation band (nearby comps)
          </p>
          <div className="mt-3 grid gap-3 sm:grid-cols-3">
            <div>
              <p className="text-xs text-[var(--muted)]">Lower quartile</p>
              <p className="font-serif text-lg text-[var(--brand-navy)]">
                {formatBandAmount(band.low, homeIso)}
              </p>
            </div>
            <div>
              <p className="text-xs text-[var(--muted)]">Median</p>
              <p className="font-serif text-lg font-semibold text-[var(--sale-gold)]">
                {formatBandAmount(band.mid, homeIso)}
              </p>
            </div>
            <div>
              <p className="text-xs text-[var(--muted)]">Upper quartile</p>
              <p className="font-serif text-lg text-[var(--brand-navy)]">
                {formatBandAmount(band.high, homeIso)}
              </p>
            </div>
          </div>
          {band.perSqftMid != null && (
            <p className="mt-3 text-xs text-[var(--muted)]">
              Indicative ~₹{band.perSqftLow?.toLocaleString("en-IN")}–₹
              {band.perSqftHigh?.toLocaleString("en-IN")} / sq.ft (normalized from nearby
              listings)
            </p>
          )}
          {listingInBand != null && unit !== "per month" && (
            <p className="mt-3 text-sm text-[var(--brand-navy)]">
              {listingInBand
                ? "Asking price sits within the nearby comp band."
                : listingPrice < band.low
                  ? "Asking price is below the nearby comp band — confirm why with the seller."
                  : "Asking price is above the nearby comp band — compare amenities and title before offering."}
            </p>
          )}
        </div>
      )}

      {comparables.length > 0 && (
        <div className="mt-6">
          <h3 className="text-sm font-semibold text-[var(--brand-navy)]">Comparable listings</h3>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {comparables.map((comp) => (
              <ListingRelatedListingCard
                key={comp.id}
                listing={comp}
                section="similar"
                sourceListingId={listingId}
              />
            ))}
          </div>
        </div>
      )}

      <div className="mt-5 flex flex-wrap gap-2">
        <Link
          href={appPath("/search?transaction=sale&category=Property")}
          className="rp-btn rp-btn-secondary px-4 py-2 text-sm"
        >
          Browse sale map
        </Link>
      </div>
    </section>
  );
}

interface Props {
  phoneVerified: boolean;
  /** When true and not phone-verified, show direct-contact badge (listing detail). */
  showDirectContact?: boolean;
  /** Show the "No brokerage" trust badge (RentalPins connects renters to owners directly). */
  showNoBrokerage?: boolean;
}

export default function OwnerTrustBadges({
  phoneVerified,
  showDirectContact = false,
  showNoBrokerage = true,
}: Props) {
  if (!phoneVerified && !showDirectContact && !showNoBrokerage) return null;

  return (
    <div className="flex flex-wrap items-center gap-2">
      {phoneVerified && (
        <span
          className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-800"
          title="Verified their phone with RentalPins"
        >
          <span aria-hidden>✓</span>
          Phone verified
        </span>
      )}
      {!phoneVerified && showDirectContact && (
        <span className="inline-flex items-center gap-1 rounded-full border border-[var(--border)] bg-[var(--surface)] px-2.5 py-1 text-xs font-medium text-[var(--brand-navy)]">
          Direct owner contact
        </span>
      )}
      {showNoBrokerage && (
        <span
          className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-800"
          title="Rent directly from the owner — RentalPins charges no brokerage"
        >
          <span aria-hidden>₹</span>
          No brokerage
        </span>
      )}
    </div>
  );
}

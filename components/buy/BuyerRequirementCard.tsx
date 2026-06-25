import Link from "next/link";
import { appPath } from "@/lib/config";
import type { BuyerRequirement } from "@/lib/types/buyer-requirement";

interface Props {
  requirement: BuyerRequirement;
  showOwnerActions?: boolean;
  onDeactivate?: (id: string) => void;
}

export default function BuyerRequirementCard({
  requirement,
  showOwnerActions = false,
  onDeactivate,
}: Props) {
  return (
    <li className="rounded-xl border border-[var(--border)] bg-white p-5">
      <h3 className="font-semibold text-[var(--brand-navy)]">{requirement.propertyType}</h3>
      <dl className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
        <div>
          <dt className="text-[var(--muted)]">Budget</dt>
          <dd>{requirement.budgetLabel}</dd>
        </div>
        <div>
          <dt className="text-[var(--muted)]">Preferred locality</dt>
          <dd>{requirement.locality || requirement.city}</dd>
        </div>
        <div>
          <dt className="text-[var(--muted)]">Timeline</dt>
          <dd>{requirement.timeline}</dd>
        </div>
        <div>
          <dt className="text-[var(--muted)]">Purpose</dt>
          <dd>{requirement.purpose}</dd>
        </div>
      </dl>
      {requirement.notes && (
        <p className="mt-3 text-sm text-[var(--muted)]">{requirement.notes}</p>
      )}
      <p className="mt-3 text-xs text-[var(--muted)]">
        Verified buyer · contact via RentalPins chat
      </p>
      <div className="mt-3 flex flex-wrap gap-3">
        <Link
          href={appPath("/buy/post")}
          className="text-sm font-semibold text-[var(--sale-gold)] hover:underline"
        >
          I have a matching property →
        </Link>
        {showOwnerActions && onDeactivate && requirement.isActive && (
          <button
            type="button"
            onClick={() => onDeactivate(requirement.id)}
            className="text-sm text-[var(--muted)] hover:text-[var(--brand-navy)]"
          >
            Mark fulfilled
          </button>
        )}
      </div>
    </li>
  );
}

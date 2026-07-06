import Link from "next/link";
import { appPath } from "@/lib/config";

interface Props {
  areaName: string;
  browseHref: string;
  tips?: string[];
}

const DEFAULT_TIPS = [
  "Save a map search to catch fresh owner posts without daily classified scrolling.",
  "Message owners with move-in date, budget band and sharing preference in the first WhatsApp.",
  "Visit three shortlisted pins in one trip — inspect food, security and ventilation before deposit.",
  "Confirm deposit refund rules and photograph room condition at handover.",
];

export default function NoInventoryGuideBlock({ areaName, browseHref, tips = DEFAULT_TIPS }: Props) {
  return (
    <section className="mx-auto max-w-4xl px-4 py-10" aria-labelledby="no-inventory-guide-heading">
      <div className="rounded-2xl border border-amber-200 bg-amber-50/80 p-6 sm:p-8">
        <h2 id="no-inventory-guide-heading" className="font-serif text-xl text-[var(--brand-navy)]">
          Finding rentals in {areaName}
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-[var(--muted)]">
          Live inventory in this micro-area may be limited right now. Use these steps while owners list on RentalPins —
          inventory grows weekly in student and IT corridors.
        </p>
        <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-slate-700">
          {tips.map((t) => (
            <li key={t.slice(0, 40)}>{t}</li>
          ))}
        </ul>
        <Link href={appPath(browseHref)} className="rp-btn rp-btn-primary mt-6 inline-flex px-5 py-2.5">
          Browse {areaName} on map
        </Link>
      </div>
    </section>
  );
}

import Link from "next/link";
import { getListPropertyHref, type SupplyIntent } from "@/lib/seo-links";

interface Props {
  intent?: SupplyIntent;
  citySlug?: string;
  areaSlug?: string;
  listHref?: string;
}

const ALL_AUDIENCES = [
  { label: "Property owners", icon: "🏠" },
  { label: "PG owners", icon: "🛏️" },
  { label: "Hostel operators", icon: "🏫" },
  { label: "Brokers and agents", icon: "🤝" },
  { label: "Shop owners", icon: "🏪" },
  { label: "Office owners", icon: "💼" },
  { label: "Warehouse owners", icon: "📦" },
  { label: "Vehicle rental businesses", icon: "🚗" },
  { label: "Equipment rental businesses", icon: "🔧" },
] as const;

function audiencesForIntent(intent: SupplyIntent) {
  if (intent === "commercial") {
    return ALL_AUDIENCES.filter((a) =>
      ["Shop owners", "Office owners", "Warehouse owners", "Brokers and agents", "Property owners"].includes(
        a.label
      )
    );
  }
  if (intent === "pg" || intent === "hostel") {
    return ALL_AUDIENCES.filter((a) =>
      ["PG owners", "Hostel operators", "Property owners", "Brokers and agents"].includes(a.label)
    );
  }
  if (intent === "shop") {
    return ALL_AUDIENCES.filter((a) =>
      ["Shop owners", "Brokers and agents", "Property owners"].includes(a.label)
    );
  }
  if (intent === "office") {
    return ALL_AUDIENCES.filter((a) =>
      ["Office owners", "Brokers and agents", "Property owners"].includes(a.label)
    );
  }
  if (intent === "warehouse") {
    return ALL_AUDIENCES.filter((a) =>
      ["Warehouse owners", "Brokers and agents", "Property owners"].includes(a.label)
    );
  }
  if (intent === "vehicle") {
    return ALL_AUDIENCES.filter((a) =>
      ["Vehicle rental businesses", "Brokers and agents"].includes(a.label)
    );
  }
  if (intent === "equipment") {
    return ALL_AUDIENCES.filter((a) =>
      ["Equipment rental businesses", "Brokers and agents"].includes(a.label)
    );
  }
  return ALL_AUDIENCES;
}

export default function SupplyAudienceSection({
  intent = "general",
  citySlug,
  areaSlug,
  listHref,
}: Props) {
  const list = listHref ?? getListPropertyHref({ citySlug, areaSlug, intent });
  const cards = audiencesForIntent(intent);

  return (
    <section
      aria-labelledby="supply-audience-heading"
      className="mx-auto max-w-4xl px-4 py-12"
    >
      <h2
        id="supply-audience-heading"
        className="rp-section-title text-xl text-[var(--brand-navy)]"
      >
        Housing and commercial owners can list on RentalPins
      </h2>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[var(--muted)]">
        Whether you rent out homes, PG beds, shops, offices, warehouses, vehicles or
        equipment — publish a map pin and receive direct inquiries.
      </p>
      <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((item) => (
          <li
            key={item.label}
            className="flex items-center gap-3 rounded-xl border border-[var(--border)] bg-white px-4 py-3 text-sm font-medium text-[var(--brand-navy)]"
          >
            <span aria-hidden className="text-lg">
              {item.icon}
            </span>
            {item.label}
          </li>
        ))}
      </ul>
      <div className="mt-8">
        <Link
          href={list}
          data-cta="list-property-free"
          data-location="inline"
          data-city={citySlug ?? ""}
          data-area={areaSlug ?? ""}
          data-intent={intent}
          className="rp-btn rp-btn-primary px-6 py-2.5"
        >
          Start Free Listing
        </Link>
      </div>
    </section>
  );
}

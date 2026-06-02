import type { CityConfig, AreaConfig as CityAreaConfig } from "@/lib/cities-config";
import type { RentalCategoryConfig } from "@/lib/seo/categories";
import { rentalCityPath } from "@/lib/cities-config";
import { rentalAreaPath } from "@/lib/cities-config";
import { appPath } from "@/lib/config";
import { rentalCategoryPath } from "@/lib/seo/categories";

export interface SeoContentSection {
  id: string;
  title: string;
  paragraphs: string[];
  bullets?: string[];
}

export function buildCitySeoSections(city: CityConfig): SeoContentSection[] {
  const areas = city.popularAreas.slice(0, 12).join(", ");
  return [
    {
      id: "overview",
      title: `${city.name} rental market overview`,
      paragraphs: [
        `${city.name} is one of RentalPins' active rental hubs. ${city.heroDescription}`,
        `Whether you need a room, PG, flat, shop, office, warehouse, or vehicle, you can browse verified owner listings on an interactive map — without paying broker commission to search.`,
        `RentalPins mirrors the same inventory as our Android app, so owners and tenants see consistent pins, prices, and contact options across web and mobile.`,
      ],
    },
    {
      id: "popular-areas",
      title: `Popular rental areas in ${city.name}`,
      paragraphs: [
        `Demand is spread across established neighbourhoods and emerging corridors. On RentalPins, renters frequently explore ${areas}, and adjacent micro-markets listed on our city hub.`,
        `Each area page includes local FAQs, category shortcuts, and live listings near that centre — useful when you are comparing commute, budget, and property type.`,
      ],
      bullets: city.popularAreas.slice(0, 10),
    },
    {
      id: "student",
      title: `Student & young professional rentals`,
      paragraphs: [
        `PG, shared rooms, and budget flats remain the fastest-moving segments in most Indian cities. Filter by PG/Hostels or Rooms on the map, then contact owners on WhatsApp or in-app chat.`,
        `OTP-verified accounts reduce spam compared with open classifieds, and you can save searches to get alerts when new pins appear in your preferred zone.`,
      ],
    },
    {
      id: "commercial",
      title: `Commercial, retail & office rentals`,
      paragraphs: [
        `Shop, showroom, co-working, warehouse, and office listings are grouped under Property sub-categories. Business tenants can compare multiple localities before scheduling visits.`,
        `Owners list commercial units with map pins so footfall, highway access, and industrial belt proximity are obvious at a glance.`,
      ],
    },
    {
      id: "trends",
      title: `Rent trends & how to compare listings`,
      paragraphs: [
        `Rents vary by furnishing, floor, parking, and proximity to colleges, IT parks, or wholesale markets. Use map filters for price band, BHK, furnishing, and category before shortlisting.`,
        `Promoted pins may appear higher in results, but all listings show price, category, and direct owner contact — supporting transparent comparison without hidden brokerage.`,
      ],
    },
    {
      id: "owner",
      title: `List your property free on RentalPins`,
      paragraphs: [
        `Owners post drafts on the web, verify mobile OTP, and publish to the same map used by app users. Supported cities include free or low-cost activation plans depending on market policy.`,
        city.ctaBody,
      ],
    },
  ];
}

export function buildAreaSeoSections(
  city: CityConfig,
  area: CityAreaConfig
): SeoContentSection[] {
  const near = area.popularAreas.slice(0, 8).join(", ");
  const faqBullets = area.faqs.map((f) => `${f.q} — ${f.a}`);
  return [
    {
      id: "overview",
      title: `${area.name} rental overview`,
      paragraphs: [
        area.heroDescription,
        `${area.name} is a locality hub under ${city.name} on RentalPins. Primary focus: ${area.primaryFocus}.`,
        `Use this page to compare live map listings, category shortcuts, and nearby localities before contacting owners directly (no broker commission to browse).`,
      ],
    },
    {
      id: "connectivity",
      title: `Connectivity & commute in ${area.name}`,
      paragraphs: [
        `Renters shortlist ${area.name} based on commute to offices, colleges, hospitals, and wholesale markets. Sub-pockets such as ${near} often have different price bands despite sharing the same locality name.`,
        `Map-first search shows exact pin placement so you can judge road access and travel corridors versus ${city.name}-wide classified posts.`,
      ],
    },
    {
      id: "landmarks",
      title: `Landmarks, facilities & daily life`,
      paragraphs: [
        `Family renters weigh school access, safety, and parking; students prioritize PG/room stock near transit; businesses look at visibility and logistics.`,
        `Exploring ${area.name} on RentalPins lets you validate surrounding infrastructure using locality context instead of generic city averages.`,
      ],
      bullets: area.popularAreas.slice(0, 6),
    },
    {
      id: "rent-trends",
      title: `Rent trends in ${area.name}`,
      paragraphs: [
        `Rents vary by furnishing, floor, building age, and distance from demand anchors. Compare multiple active pins in the same category before setting a budget.`,
        `Owners who align pricing with nearby live inventory typically receive faster inquiries than listings priced against outdated portal averages.`,
      ],
    },
    {
      id: "faqs",
      title: `FAQs — renting in ${area.name}`,
      paragraphs: [
        `Common questions from renters and owners exploring ${area.name} on RentalPins:`,
      ],
      bullets: faqBullets.length > 0 ? faqBullets : undefined,
    },
    {
      id: "nearby",
      title: `Nearby localities to compare`,
      paragraphs: [
        `Before committing, compare ${area.name} with adjacent pockets in ${city.name}: ${near}.`,
        `Use sibling area links on this page, then open the map to filter by category and budget for side-by-side evaluation.`,
      ],
      bullets: area.popularSearches.slice(0, 6),
    },
    {
      id: "types",
      title: `Popular rental categories`,
      paragraphs: [
        `Browse category hubs for flats, PG, shops, offices, and warehouses from this area page, or jump to the live map for precise matches.`,
      ],
      bullets: area.topCategories.map((c) => `${c.icon} ${c.name} — ${c.desc}`),
    },
  ];
}

export function buildCategorySeoSections(
  city: CityConfig,
  category: RentalCategoryConfig
): SeoContentSection[] {
  return [
    {
      id: "category-intro",
      title: `${category.pluralLabel} for rent in ${city.name}`,
      paragraphs: [
        `Find ${category.pluralLabel.toLowerCase()} across ${city.name} on RentalPins — map-first search with direct owner contact and no broker in the middle.`,
        `Popular owner searches include ${category.searchKeywords.join(", ")}.`,
      ],
    },
    {
      id: "how-to",
      title: `How to find the right ${category.label.toLowerCase()}`,
      paragraphs: [
        `Use map filters for price, furnishing, and sub-category. Save your view to return later or get alerts when new listings match.`,
        `Contact owners via WhatsApp, call, or chat after reviewing photos, location, and price on the listing detail page.`,
      ],
    },
    {
      id: "areas",
      title: `Top areas for ${category.pluralLabel.toLowerCase()}`,
      paragraphs: [
        `Explore neighbourhood hubs across ${city.popularAreas.slice(0, 8).join(", ")} — each area page links back to this category for localized inventory.`,
      ],
    },
  ];
}

export function buildCategorySpokeLinks(
  city: CityConfig,
  area: CityAreaConfig | null,
  category: RentalCategoryConfig
): { label: string; href: string }[] {
  const base = area
    ? rentalAreaPath(city.countrySlug, city.slug, area.slug)
    : rentalCityPath(city.countrySlug, city.slug);
  const links: { label: string; href: string }[] = [
    { label: `All rentals in ${city.name}`, href: appPath(rentalCityPath(city.countrySlug, city.slug)) },
    {
      label: `${category.pluralLabel} in ${city.name}`,
      href: appPath(rentalCategoryPath(city.countrySlug, city.slug, category.slug)),
    },
    { label: "Open map search", href: appPath("/search") },
    { label: "Post listing free", href: appPath("/post") },
  ];
  if (area) {
    links.unshift({
      label: `All rentals in ${area.name}`,
      href: appPath(base),
    });
  }
  return links;
}

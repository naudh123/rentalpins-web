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
  return [
    {
      id: "guide",
      title: `${area.name} area guide`,
      paragraphs: [
        area.heroDescription,
        `${area.name} is part of the ${city.name} hub on RentalPins. Primary focus: ${area.primaryFocus}.`,
      ],
    },
    {
      id: "facilities",
      title: `Nearby facilities & connectivity`,
      paragraphs: [
        `Renters typically evaluate ${area.name} against commute to colleges, offices, markets, and highways. Sub-areas such as ${near} each have distinct price bands and inventory mix.`,
        `Open the live map to see exact pin locations — more reliable than text-only classified posts.`,
      ],
    },
    {
      id: "demand",
      title: `Rental demand in ${area.name}`,
      paragraphs: [
        `Search demand on RentalPins includes queries like ${area.popularSearches.slice(0, 4).join("; ")}.`,
        `High-intent categories in this zone often align with ${area.topCategories.map((c) => c.name).join(", ")}.`,
      ],
    },
    {
      id: "types",
      title: `Popular property types`,
      paragraphs: [
        `Browse category hubs for flats, PG, shops, offices, and warehouses directly from this area page, or filter on the map for precise matches.`,
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

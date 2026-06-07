import {
  getAllAreas,
  getAllCities,
  getLiveCities,
  rentalAreaPath,
  rentalCityPath,
} from "@/lib/cities-config";
import { resolveAreaFromCoordinates } from "@/lib/listing-slug-location";
import { listingCanonicalUrl } from "@/lib/listing-share";
import {
  getRentalCategoryBySlug,
  rentalAreaCategoryPath,
  rentalCategoryPath,
  RENTAL_CATEGORIES,
  type RentalCategoryConfig,
} from "@/lib/seo/categories";
import { appPath, siteUrl } from "@/lib/config";
import type { ListingDetail } from "@/lib/types/listing";

export interface ListingBreadcrumbItem {
  name: string;
  url: string;
}

export interface ListingBreadcrumbUiItem {
  label: string;
  href?: string;
}

interface ResolvedLocation {
  countrySlug: string;
  citySlug: string;
  cityName: string;
  areaSlug: string | null;
  areaName: string | null;
}

function resolveCategoryFromListing(
  listing: Pick<ListingDetail, "category" | "subCategory">
): RentalCategoryConfig | null {
  const sub = (listing.subCategory || "").toLowerCase();
  const main = (listing.category || "").toLowerCase();

  if (main === "vehicles") {
    return getRentalCategoryBySlug("vehicles");
  }

  if (main && main !== "property") {
    return null;
  }

  for (const category of RENTAL_CATEGORIES) {
    if (category.mainCategory !== "Property") continue;
    if (
      category.subCategories.some(
        (label) =>
          sub.includes(label.toLowerCase()) || label.toLowerCase().includes(sub)
      )
    ) {
      return category;
    }
  }

  if (/pg|hostel|paying guest/.test(sub)) return getRentalCategoryBySlug("pg");
  if (/flat|apartment|bhk/.test(sub)) return getRentalCategoryBySlug("flats");
  if (/house|villa|independent/.test(sub)) return getRentalCategoryBySlug("houses");
  if (/shop|showroom/.test(sub)) return getRentalCategoryBySlug("shops");
  if (/office|co-working/.test(sub)) return getRentalCategoryBySlug("offices");
  if (/warehouse|godown|industrial/.test(sub)) {
    return getRentalCategoryBySlug("warehouses");
  }

  return null;
}

function resolveMarketingArea(lat: number, lng: number): ResolvedLocation | null {
  const geoArea = resolveAreaFromCoordinates(lat, lng);
  if (!geoArea) return null;

  const marketingArea = getAllAreas().find((area) => area.slug === geoArea.slug);
  if (marketingArea) {
    return {
      countrySlug: marketingArea.parentCountrySlug,
      citySlug: marketingArea.parentSlug,
      cityName: marketingArea.parentName,
      areaSlug: marketingArea.slug,
      areaName: marketingArea.name,
    };
  }

  const cityMatch = getLiveCities().find((city) => city.slug === geoArea.slug);
  if (cityMatch) {
    return {
      countrySlug: cityMatch.countrySlug,
      citySlug: cityMatch.slug,
      cityName: cityMatch.name,
      areaSlug: null,
      areaName: null,
    };
  }

  return null;
}

function resolveCityFromLocationName(locationName: string): ResolvedLocation | null {
  const lower = locationName.toLowerCase();
  if (!lower.trim()) return null;

  for (const city of getAllCities()) {
    if (city.status !== "live") continue;

    for (const area of city.areas) {
      if (lower.includes(area.name.toLowerCase()) || lower.includes(area.slug)) {
        return {
          countrySlug: city.countrySlug,
          citySlug: city.slug,
          cityName: city.name,
          areaSlug: area.slug,
          areaName: area.name,
        };
      }
    }

    if (
      lower.includes(city.slug.replace(/-/g, " ")) ||
      lower.includes(city.name.toLowerCase())
    ) {
      return {
        countrySlug: city.countrySlug,
        citySlug: city.slug,
        cityName: city.name,
        areaSlug: null,
        areaName: null,
      };
    }
  }

  return null;
}

function shouldShowAreaCrumb(location: ResolvedLocation): boolean {
  if (!location.areaSlug || !location.areaName) return false;
  return location.areaSlug !== location.citySlug;
}

export function buildListingBreadcrumbs(
  listing: ListingDetail,
  listingUrl = listingCanonicalUrl(listing)
): {
  schema: ListingBreadcrumbItem[];
  ui: ListingBreadcrumbUiItem[];
} {
  const schema: ListingBreadcrumbItem[] = [
    { name: "Home", url: `${siteUrl}${appPath("/")}` },
    { name: "Rentals", url: `${siteUrl}${appPath("/rentals")}` },
  ];
  const ui: ListingBreadcrumbUiItem[] = [
    { label: "Home", href: appPath("/") },
    { label: "Rentals", href: appPath("/rentals") },
  ];

  const hasCoords =
    Number.isFinite(listing.lat) &&
    Number.isFinite(listing.lng) &&
    Math.abs(listing.lat) <= 90 &&
    Math.abs(listing.lng) <= 180 &&
    !(listing.lat === 0 && listing.lng === 0);

  const location =
    (hasCoords ? resolveMarketingArea(listing.lat, listing.lng) : null) ??
    resolveCityFromLocationName(listing.locationName);

  if (location) {
    const cityPath = rentalCityPath(location.countrySlug, location.citySlug);
    schema.push({
      name: location.cityName,
      url: `${siteUrl}${appPath(cityPath)}`,
    });
    ui.push({
      label: location.cityName,
      href: appPath(cityPath),
    });

    if (shouldShowAreaCrumb(location)) {
      const areaPath = rentalAreaPath(
        location.countrySlug,
        location.citySlug,
        location.areaSlug!
      );
      schema.push({
        name: location.areaName!,
        url: `${siteUrl}${appPath(areaPath)}`,
      });
      ui.push({
        label: location.areaName!,
        href: appPath(areaPath),
      });
    }
  }

  const category = resolveCategoryFromListing(listing);
  if (location && category) {
    const categoryPath = location.areaSlug
      ? rentalAreaCategoryPath(
          location.countrySlug,
          location.citySlug,
          location.areaSlug,
          category.slug
        )
      : rentalCategoryPath(location.countrySlug, location.citySlug, category.slug);

    schema.push({
      name: category.pluralLabel,
      url: `${siteUrl}${appPath(categoryPath)}`,
    });
    ui.push({
      label: category.pluralLabel,
      href: appPath(categoryPath),
    });
  }

  const listingLabel =
    listing.title.length > 72 ? `${listing.title.slice(0, 72)}…` : listing.title;

  schema.push({ name: listing.title, url: listingUrl });
  ui.push({ label: listingLabel });

  return { schema, ui };
}

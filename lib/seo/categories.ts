/** Programmatic SEO category slugs — must not collide with area slugs in cities-config. */

export interface RentalCategoryConfig {
  slug: string;
  label: string;
  pluralLabel: string;
  mainCategory: string;
  subCategories: string[];
  schemaType: "Apartment" | "Residence" | "Product" | "LocalBusiness";
  searchKeywords: string[];
}

export const RENTAL_CATEGORIES: RentalCategoryConfig[] = [
  {
    slug: "flats",
    label: "Flat",
    pluralLabel: "Flats & Apartments",
    mainCategory: "Property",
    subCategories: ["Apartments / Flats", "Room"],
    schemaType: "Apartment",
    searchKeywords: ["flat for rent", "apartment for rent", "1 bhk", "2 bhk"],
  },
  {
    slug: "houses",
    label: "House",
    pluralLabel: "Houses & Villas",
    mainCategory: "Property",
    subCategories: ["House", "Villas", "Independent"],
    schemaType: "Residence",
    searchKeywords: ["house for rent", "villa for rent", "independent house"],
  },
  {
    slug: "pg",
    label: "PG",
    pluralLabel: "PG & Hostels",
    mainCategory: "Property",
    subCategories: ["PG/Hostels"],
    schemaType: "Residence",
    searchKeywords: ["pg for rent", "hostel", "paying guest"],
  },
  {
    slug: "shops",
    label: "Shop",
    pluralLabel: "Shops & Showrooms",
    mainCategory: "Property",
    subCategories: ["Shops", "Showroom"],
    schemaType: "LocalBusiness",
    searchKeywords: ["shop for rent", "retail space", "showroom rent"],
  },
  {
    slug: "offices",
    label: "Office",
    pluralLabel: "Offices & Co-working",
    mainCategory: "Property",
    subCategories: ["Office Space", "Co-working"],
    schemaType: "LocalBusiness",
    searchKeywords: ["office for rent", "co-working space", "commercial office"],
  },
  {
    slug: "warehouses",
    label: "Warehouse",
    pluralLabel: "Warehouses & Industrial",
    mainCategory: "Property",
    subCategories: ["Warehouse", "Industrial"],
    schemaType: "LocalBusiness",
    searchKeywords: ["warehouse for rent", "industrial shed", "godown rent"],
  },
  {
    slug: "commercial",
    label: "Commercial",
    pluralLabel: "Commercial Property",
    mainCategory: "Property",
    subCategories: ["Shops", "Office Space", "Showroom", "Industrial", "Warehouse"],
    schemaType: "LocalBusiness",
    searchKeywords: ["commercial property rent", "commercial space"],
  },
  {
    slug: "vehicles",
    label: "Vehicle",
    pluralLabel: "Vehicles",
    mainCategory: "Vehicles",
    subCategories: [],
    schemaType: "Product",
    searchKeywords: ["car on rent", "bike rental", "vehicle hire"],
  },
];

const BY_SLUG = new Map(RENTAL_CATEGORIES.map((c) => [c.slug, c]));

export function getRentalCategoryBySlug(slug: string): RentalCategoryConfig | null {
  return BY_SLUG.get(slug.toLowerCase()) ?? null;
}

export function isRentalCategorySlug(slug: string): boolean {
  return BY_SLUG.has(slug.toLowerCase());
}

export function rentalCategoryPath(
  countrySlug: string,
  citySlug: string,
  categorySlug: string
): string {
  return `/rentals/${countrySlug}/${citySlug}/${categorySlug}`;
}

export function rentalAreaCategoryPath(
  countrySlug: string,
  citySlug: string,
  areaSlug: string,
  categorySlug: string
): string {
  return `/rentals/${countrySlug}/${citySlug}/${areaSlug}/${categorySlug}`;
}

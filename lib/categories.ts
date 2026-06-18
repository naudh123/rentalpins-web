/** Locked categories — aligned with Flutter `map_config.dart`. */

export const MAIN_CATEGORIES = [
  "Property",
  "Vehicles",
  "Electronics & Gadgets",
  "Home Appliances",
  "Furniture",
  "Heavy Machinery",
  "Construction Equipment",
  "Event & Production",
  "Others",
] as const;

export const SUB_CATEGORIES: Record<string, string[]> = {
  Property: [
    "Room",
    "Apartments / Flats",
    "House",
    "Villas",
    "Plot",
    "PG/Hostels",
    "Shops",
    "Showroom",
    "Office Space",
    "Co-working",
    "Industrial",
    "Warehouse",
    "Land",
    "Others",
  ],
  Vehicles: ["Cars", "Bikes", "Vans", "Trucks", "Tractors", "Buses", "Others"],
  "Electronics & Gadgets": [
    "Mobile",
    "Laptops",
    "Cameras",
    "Projectors",
    "Gaming",
    "Printers",
    "Networking",
    "Others",
  ],
  "Home Appliances": [
    "AC",
    "Refrigerators",
    "Washing Machines",
    "Televisions",
    "Microwave",
    "Purifier",
    "Heaters",
    "Others",
  ],
  Furniture: [
    "Beds",
    "Sofas",
    "Tables",
    "Chairs",
    "Wardrobes",
    "Office Furniture",
    "Event Furniture",
    "Others",
  ],
  "Heavy Machinery": [
    "Cranes",
    "Excavators",
    "Bulldozers",
    "Forklifts",
    "Loaders",
    "Road Rollers",
    "Others",
  ],
  "Construction Equipment": [
    "Scaffolding",
    "Mixers",
    "Power Tools",
    "Drilling",
    "Cutting",
    "Welding",
    "Others",
  ],
  "Event & Production": [
    "Sound",
    "Lighting",
    "LED Screens",
    "Stage",
    "DJ",
    "Live Stream Gear",
    "Others",
  ],
  Others: [
    "Fitness",
    "Medical",
    "Books",
    "Office Equipment",
    "Services",
    "Miscellaneous",
    "Others",
  ],
};

export const PRICE_UNITS = [
  "per hour",
  "per day",
  "per week",
  "per month",
  "per year",
] as const;

/** Sale listing price units — luxury buy vertical. */
export const SALE_PRICE_UNITS = ["total", "per sqft", "per acre"] as const;

/** Property subcategories offered when listing for sale. */
export const SALE_PROPERTY_SUBCATEGORIES = [
  "Apartments / Flats",
  "House",
  "Villas",
  "Plot",
  "Land",
  "Shops",
  "Showroom",
  "Office Space",
  "Warehouse",
] as const;

export function getSubCategories(main: string): string[] {
  return SUB_CATEGORIES[main] ?? ["Others"];
}

/* ------------------------------------------------------------------ *
 * Structured listing attributes (canonical — mirror in Flutter)
 * ------------------------------------------------------------------ */

export const PROPERTY_CATEGORY = "Property";

/** Property subcategories that take residential attributes (BHK, furnishing…). */
export const RESIDENTIAL_PROPERTY_SUBS = [
  "Room",
  "Apartments / Flats",
  "House",
  "Villas",
  "PG/Hostels",
] as const;

export const BHK_OPTIONS = ["1RK", "1BHK", "2BHK", "3BHK", "4BHK", "5BHK+"] as const;
export const FURNISHING_OPTIONS = ["Furnished", "Semi-furnished", "Unfurnished"] as const;
export const TENANT_PREFERENCE_OPTIONS = ["Family", "Bachelors", "Anyone"] as const;

export type BhkOption = (typeof BHK_OPTIONS)[number];
export type FurnishingOption = (typeof FURNISHING_OPTIONS)[number];
export type TenantPreferenceOption = (typeof TENANT_PREFERENCE_OPTIONS)[number];

/** True when the category/subcategory pair should collect residential attributes. */
export function isResidentialProperty(main: string, sub: string): boolean {
  return (
    main === PROPERTY_CATEGORY &&
    (RESIDENTIAL_PROPERTY_SUBS as readonly string[]).includes(sub)
  );
}

import { appPath } from "@/lib/config";
import {
  BUY_POST_PATH,
  BUY_PROJECTS_PATH,
  BUY_REQUIREMENTS_PATH,
  BUY_SEARCH_PATH,
} from "@/lib/sale/buy-app-paths";

/** Global homepage / marketing gateway navigation. */
export const GLOBAL_NAV = [
  { label: "Rent", href: appPath("/search"), mode: "rent" as const },
  { label: "Buy", href: appPath("/buy"), mode: "buy" as const },
  // TODO: Full RentalPins Invest experience — placeholder until /invest ships broadly.
  { label: "Invest", href: appPath("/invest"), mode: "invest" as const },
  { label: "Cities", href: appPath("/rentals"), mode: null },
  { label: "Insights", href: appPath("/blog"), mode: null },
] as const;

/** Rent experience — map search, post, cities. */
export const RENT_NAV = [
  { label: "Search rentals", href: appPath("/search") },
  { label: "Post rental", href: appPath("/post") },
  { label: "Cities", href: appPath("/rentals") },
  { label: "Categories", href: appPath("/search") },
  { label: "How it works", href: appPath("/about") },
  { label: "My listings", href: appPath("/profile") },
] as const;

/** Buy experience — sale map, post, requirements, investment areas. */
export const BUY_NAV = [
  { label: "Search properties", href: appPath(BUY_SEARCH_PATH) },
  { label: "Post property", href: appPath(BUY_POST_PATH) },
  { label: "Guides", href: appPath("/blog/buy") },
  { label: "Post requirement", href: appPath(BUY_REQUIREMENTS_PATH) },
  { label: "Projects", href: appPath(BUY_PROJECTS_PATH) },
  { label: "Developers", href: appPath("/developers") },
  { label: "Investment areas", href: appPath("/invest") },
] as const;

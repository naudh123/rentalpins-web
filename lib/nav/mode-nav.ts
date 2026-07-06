import { appPath } from "@/lib/config";
import {
  BUY_POST_PATH,
  BUY_REQUIREMENTS_PATH,
  BUY_SEARCH_PATH,
} from "@/lib/sale/buy-app-paths";

export type GlobalNavMode = "rent" | "buy" | "invest" | "blog" | null;

/** Top-level product lanes + blog — always visible in the header. */
export const GLOBAL_PRIMARY_NAV = [
  { label: "Rent", href: appPath("/search"), mode: "rent" as const },
  { label: "Buy", href: appPath("/buy"), mode: "buy" as const },
  { label: "Invest", href: appPath("/invest"), mode: "invest" as const },
  { label: "Blog", href: appPath("/blog"), mode: "blog" as const },
] as const;

/** Secondary discovery links — shown under “More” in the header. */
export const GLOBAL_SECONDARY_NAV = [
  { label: "Projects", href: appPath("/projects") },
  { label: "Cities", href: appPath("/rentals") },
  { label: "Builders", href: appPath("/builders") },
  { label: "Developers", href: appPath("/developers") },
  { label: "About", href: appPath("/about") },
] as const;

/** @deprecated Use GLOBAL_PRIMARY_NAV + GLOBAL_SECONDARY_NAV */
export const GLOBAL_NAV = [
  ...GLOBAL_PRIMARY_NAV,
  ...GLOBAL_SECONDARY_NAV.map((item) => ({
    ...item,
    mode: null as GlobalNavMode,
  })),
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
  { label: "New projects", href: appPath("/projects") },
  { label: "Builders", href: appPath("/builders") },
  { label: "Developers", href: appPath("/developers") },
  { label: "Investment hub", href: appPath("/invest") },
] as const;

/** Invest experience — hub, tools, guides, projects lens. */
export const INVEST_NAV = [
  { label: "Invest hub", href: appPath("/invest") },
  { label: "Yield calculator", href: appPath("/invest/calculator") },
  { label: "Compare areas", href: appPath("/invest/compare") },
  { label: "Growth corridors", href: appPath("/invest/corridors") },
  { label: "Investment guides", href: appPath("/invest/guides") },
  { label: "Projects (invest)", href: appPath("/invest/projects") },
  { label: "Ask AI", href: appPath("/invest/advisor") },
  { label: "Post requirement", href: appPath("/invest/requirements/post") },
  { label: "Invest shortlist", href: appPath("/invest/shortlist") },
] as const;

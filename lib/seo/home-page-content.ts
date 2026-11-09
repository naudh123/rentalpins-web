/**
 * Homepage copy and link inventory — honest, SEO-friendly, three verticals
 * (Rent, Buy & Sell, Invest). Every href here is an internal app route; the
 * home-page-content test checks that each one resolves to a real page.
 */
import { getLiveCities, rentalCityPath } from "@/lib/cities-config";
import {
  getListPropertyCityConfig,
  getListPropertyCitySlugs,
} from "@/lib/supply-pages-config";

export interface HomeLink {
  label: string;
  href: string;
}

export const HOME_META = {
  title: "Rent, Buy & Sell Property Without Brokers in India",
  description:
    "Rent flats, PG and commercial space or buy and sell property directly from owners on a live map. List free and explore new projects across India.",
  keywords: [
    "property without broker",
    "rent property directly from owner",
    "flats for rent without brokerage",
    "PG for rent",
    "buy property from owner",
    "sell property without broker",
    "new projects investment",
    "list property free",
    "map based property search",
    "owner direct property India",
  ],
} as const;

export const HOME_HERO = {
  eyebrow: "Owner-direct property marketplace",
  headline: "Rent, buy or invest in property — straight from owners",
  subhead:
    "RentalPins puts flats, PG, houses, shops and offices on a live map so you deal with owners directly. No brokerage to search, and listing is free.",
  searchLabel: "City, locality or landmark",
  searchPlaceholder: "Try “Koramangala”, “Sector 70 Mohali” or “near LPU”",
  rentSearch: { label: "Search rentals", action: "/search" },
  buySearch: { label: "Search for sale", action: "/buy/search" },
} as const;

/** Honest trust signals only — no user counts or invented ratings. */
export const HOME_TRUST_POINTS = [
  "No brokerage to search",
  "Free to list",
  "Chat or WhatsApp owners",
] as const;

export type HomeVerticalKey = "rent" | "buy" | "invest";

export interface HomeVertical {
  key: HomeVerticalKey;
  badge: string;
  title: string;
  audience: string;
  bullets: readonly string[];
  primary: HomeLink;
  secondary: HomeLink;
  more: readonly HomeLink[];
}

export const HOME_VERTICALS_SECTION = {
  eyebrow: "Choose your path",
  title: "What would you like to do?",
  subtitle:
    "Three ways to use RentalPins. Pick the one that fits — each has its own map, listings and tools.",
} as const;

export const HOME_VERTICALS: readonly HomeVertical[] = [
  {
    key: "rent",
    badge: "Rent",
    title: "Rent a home or workspace",
    audience:
      "For tenants, students and professionals looking for a flat, PG, room, shop or office.",
    bullets: [
      "Flats, houses, PG, rooms and commercial space",
      "Contact owners on WhatsApp, call or chat",
      "Filter by budget, BHK, furnishing and area",
    ],
    primary: { label: "Browse rentals on the map", href: "/search" },
    secondary: { label: "List your rental free", href: "/post" },
    more: [
      { label: "PG near me", href: "/pg-near-me" },
      { label: "Flats without broker", href: "/flats-without-broker" },
      { label: "Commercial for rent", href: "/commercial-property-for-rent" },
    ],
  },
  {
    key: "buy",
    badge: "Buy & Sell",
    title: "Buy or sell property",
    audience:
      "For home buyers, and for owners selling a flat, house, plot or commercial unit without a middleman.",
    bullets: [
      "Owner-direct resale listings on a sale map",
      "Post what you want to buy and get matched",
      "Sell with a free listing — no commission",
    ],
    primary: { label: "Browse property for sale", href: "/buy/search" },
    secondary: { label: "Sell your property", href: "/buy/post" },
    more: [
      { label: "Buy hub", href: "/buy" },
      { label: "Post a requirement", href: "/buy/requirements" },
      { label: "Buying guides", href: "/blog/buy" },
    ],
  },
  {
    key: "invest",
    badge: "Invest",
    title: "Invest with better data",
    audience:
      "For investors comparing growth corridors, rental yields and new builder projects.",
    bullets: [
      "New launch and under-construction projects",
      "Rental-yield calculator and area comparison",
      "Growth-corridor investment guides",
    ],
    primary: { label: "Explore the Invest hub", href: "/invest" },
    secondary: { label: "Browse new projects", href: "/invest/projects" },
    more: [
      { label: "Yield calculator", href: "/invest/calculator" },
      { label: "Compare areas", href: "/invest/compare" },
      { label: "Investment guides", href: "/invest/guides" },
    ],
  },
];

/** Chandigarh Tricity buy hubs — canonical hub URLs, shown on the Buy card. */
export const HOME_BUY_CHIPS: readonly HomeLink[] = [
  { label: "Chandigarh", href: "/buy/in/chandigarh" },
  { label: "Mohali", href: "/buy/mohali" },
  { label: "Panchkula", href: "/buy/panchkula" },
  { label: "Zirakpur", href: "/buy/zirakpur" },
  { label: "New Chandigarh", href: "/buy/mohali/new-chandigarh" },
];

export const HOME_STEPS = {
  eyebrow: "How it works",
  title: "From search to keys, without the middleman",
  steps: [
    {
      title: "Search the map",
      desc: "Pan to your city, sector or campus and see owner-posted pins with photos, price and details.",
    },
    {
      title: "Talk to the owner",
      desc: "Message on WhatsApp, call or chat straight from the listing — no unlock fee, no broker in between.",
    },
    {
      title: "Close directly",
      desc: "Visit, agree terms and sign with the owner. Owners list free and manage everything from web or app.",
    },
  ],
} as const;

export interface HomeCityCard {
  name: string;
  href: string;
  areas: string;
}

function trimAreas(tagline: string | undefined): string {
  if (!tagline) return "";
  const parts = tagline
    .split("·")
    .map((p) => p.trim())
    .filter(Boolean);
  return parts.slice(0, 4).join(" · ");
}

/** Live India city hubs (/rentals/in/{city}) — includes every live city. */
export function getHomeIndiaCities(): HomeCityCard[] {
  return getLiveCities()
    .filter((c) => c.countrySlug === "in")
    .map((c) => ({
      name: c.name,
      href: rentalCityPath(c.countrySlug, c.slug),
      areas: trimAreas(c.tagline),
    }));
}

export function getHomeGlobalCities(): HomeLink[] {
  return getLiveCities()
    .filter((c) => c.countrySlug !== "in")
    .map((c) => ({ label: c.name, href: rentalCityPath(c.countrySlug, c.slug) }));
}

export const HOME_CITIES_SECTION = {
  eyebrow: "Browse by city",
  title: "Property across India's fastest-moving cities",
  subtitle:
    "Each city hub has locality guides, rent ranges and live owner listings on the map.",
  allCities: { label: "See all cities and localities", href: "/rentals" },
} as const;

export const HOME_OWNERS = {
  eyebrow: "For owners, sellers and builders",
  title: "List your property free — reach people already searching",
  subtitle:
    "Drop a pin, add photos and go live in minutes. Enquiries come straight to you.",
  paths: [
    {
      title: "Renting out?",
      desc: "Flats, PG, rooms, shops, offices or warehouses.",
      cta: { label: "Post a rental", href: "/post" },
    },
    {
      title: "Selling?",
      desc: "Resale flats, houses, plots and commercial units.",
      cta: { label: "List for sale", href: "/buy/post" },
    },
    {
      title: "Builder or developer?",
      desc: "Showcase projects and receive site-visit requests.",
      cta: { label: "List a project", href: "/projects/post" },
    },
  ],
  noBrokerTitle: "Property without broker",
  noBrokerLinks: [
    { label: "Chandigarh", href: "/property-without-broker-chandigarh" },
    { label: "Mohali", href: "/property-without-broker-mohali" },
    { label: "Delhi", href: "/property-without-broker-delhi" },
    { label: "Gurugram", href: "/property-without-broker-gurugram" },
    { label: "Bengaluru", href: "/property-without-broker-bengaluru" },
    { label: "Hyderabad", href: "/property-without-broker-hyderabad" },
    { label: "Jaipur", href: "/property-without-broker-jaipur" },
    { label: "Ludhiana", href: "/property-without-broker-ludhiana" },
  ] as readonly HomeLink[],
  listCityTitle: "List property free in your city",
} as const;

/** /list-property/{city} landings, labelled by city name. */
export function getHomeListPropertyLinks(): HomeLink[] {
  return getListPropertyCitySlugs().map((slug) => {
    const title = getListPropertyCityConfig(slug)?.title ?? slug;
    const label = title.replace(/^List Property Free in\s+/i, "").trim() || slug;
    return { label, href: `/list-property/${slug}` };
  });
}

export const HOME_GUIDES = {
  eyebrow: "Guides & insights",
  title: "Know the area before you decide",
  subtitle:
    "Locality guides, rent and price trends, and practical how-tos from the RentalPins blog.",
  cards: [
    {
      title: "RentalPins blog",
      desc: "Best areas to rent, PG guides and city explainers.",
      href: "/blog",
    },
    {
      title: "Buying guides",
      desc: "Paperwork, pricing and resale checks before you buy.",
      href: "/blog/buy",
    },
    {
      title: "Investment guides",
      desc: "Growth corridors, yields and project due diligence.",
      href: "/invest/guides",
    },
    {
      title: "Tricity market insights",
      desc: "Rent and price movement across Chandigarh, Mohali and Panchkula.",
      href: "/property-market-insights/chandigarh-tricity",
    },
  ],
  more: [
    { label: "Rent without broker", href: "/rent-without-broker" },
    { label: "No-broker rentals in India", href: "/no-broker-rental-india" },
    { label: "PG near Chandigarh University", href: "/pg-near-chandigarh-university" },
    { label: "PG near LPU", href: "/pg-near-lpu" },
    { label: "RentalPins vs NoBroker", href: "/rentalpins-vs-nobroker" },
  ] as readonly HomeLink[],
} as const;

export const HOME_ABOUT = {
  title: "About RentalPins",
  paragraphs: [
    "RentalPins is an owner-direct property marketplace built around a map. Instead of scrolling endless lists, you see where each flat, PG, house, shop or office actually is — next to your college, office or metro line — and contact the owner yourself.",
    "Renting, buying and investing each have their own space: the rent map for tenants and students, RentalPins Buy for resale property and seller listings, and RentalPins Invest for new projects, growth corridors and yield tools. Owners, sellers and builders list free, and searching never carries a brokerage fee.",
  ],
} as const;

export const HOME_FAQS = [
  {
    q: "What is RentalPins?",
    a: "RentalPins is a map-first, owner-direct property marketplace in India. You can rent flats, PG, rooms and commercial space, buy or sell property, and explore new projects for investment — dealing with owners and builders directly.",
  },
  {
    q: "Do I pay brokerage to find a property on RentalPins?",
    a: "No. Browsing the map and contacting owners is free. RentalPins does not charge tenants or buyers a search commission or an unlock fee.",
  },
  {
    q: "Is it free to list property on RentalPins?",
    a: "Yes — owners can post flats, PG, houses, shops, offices and warehouses at no listing fee, and sellers can list resale property free on RentalPins Buy.",
  },
  {
    q: "How do I list my flat or PG on RentalPins?",
    a: "Sign in with Google, open Post listing, drop your pin on the map, add photos and rent details, then publish. Your listing appears in map search for that area.",
  },
  {
    q: "Who can list on RentalPins?",
    a: "Property owners, PG and hostel operators, shop and office owners, warehouse landlords, sellers of resale property, builders with new projects, and brokers with owner authorisation.",
  },
  {
    q: "Can I buy or sell property on RentalPins?",
    a: "Yes. RentalPins Buy has a separate sale map with owner-direct resale listings, strongest today in Chandigarh Tricity. Sellers list free, and buyers can post a requirement describing what they want.",
  },
  {
    q: "What is RentalPins Invest?",
    a: "RentalPins Invest brings together new builder projects, growth-corridor guides, a rental-yield calculator and area comparisons so investors can shortlist locations before visiting.",
  },
  {
    q: "Which cities are live on RentalPins?",
    a: "Chandigarh Tricity, Ludhiana, Delhi, Noida, Gurugram, Ghaziabad, Bengaluru, Hyderabad, Pune, Kolkata, Jaipur, Lucknow, Patna, Indore, Bhopal and Mumbai in India, plus London, Nairobi and Lagos — with locality guides for each city.",
  },
  {
    q: "Can I manage listings from the Android app?",
    a: "Yes. The same Google account works on the web and the RentalPins Android app — edit photos, location and availability from either.",
  },
] as const;

export const HOME_FINAL_CTA = {
  title: "Your next property is already on the map",
  subtitle:
    "Search owner-direct listings, or list yours free and let people nearby find it.",
  primary: { label: "Start searching", href: "/search" },
  secondary: { label: "List property free", href: "/post" },
} as const;

/** Patterns we avoid on the homepage (no fake social proof). */
export const HOME_FORBIDDEN_CLAIMS =
  /\b(thousands of tenants|millions of users|guaranteed leads|10,000\+|25,000\+|50,000\+|95%\+ verified)\b/i;

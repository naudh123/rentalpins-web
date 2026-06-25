import type { MarketingPageConfig } from "@/lib/seo/marketing-pages";
import { appPath } from "@/lib/config";
import { buyHubPath } from "@/lib/sale/buy-pages-config";
import { BUY_SEARCH_PATH } from "@/lib/sale/buy-app-paths";

/** Demand-side sale SEO landings (mirrors CATEGORY_LANDING_PAGES + broker landings). */
export const SALE_MARKETING_PAGES: Record<string, MarketingPageConfig> = {
  "flats-for-sale": {
    slug: "flats-for-sale",
    title: "Flats for Sale in India | RentalPins Buy",
    description:
      "Find 1BHK, 2BHK and furnished flats for sale in Chandigarh Tricity — Mohali, Kharar, Zirakpur, and Panchkula with owner-direct map search.",
    h1: "Flats for sale in India",
    intro:
      "Browse owner-listed flats on the RentalPins sale map and contact sellers directly — starting in Chandigarh Tricity with Mohali, Kharar, Zirakpur, and Panchkula buy hubs.",
    benefits: [
      { title: "Owner-direct sale", desc: "No brokerage to search or shortlist flats on the map." },
      { title: "Tricity launch markets", desc: "Mohali, Kharar, Zirakpur, and Panchkula buy hubs with live sale pins." },
      { title: "Map-first discovery", desc: "Compare sectors and phases before site visits." },
      { title: "List for sale free", desc: "Owners post flats with photos, price, and location pin." },
      { title: "Luxury clarity", desc: "RentalPins Buy — curated sale experience separate from rentals." },
      { title: "Document diligence", desc: "Always verify title and approvals before token or payment." },
    ],
    faqs: [
      { q: "Which cities have flats for sale on RentalPins?", a: "We launch in Chandigarh Tricity — Mohali, Kharar, Zirakpur, and Panchkula — with more cities as inventory grows." },
      { q: "Are these broker listings?", a: "RentalPins Buy prioritises owner-direct sellers. Confirm listing authority and documents before any payment." },
      { q: "How do I list my flat for sale?", a: "Use List for sale on web — add photos, BHK, society, and asking price." },
      { q: "Can I compare Mohali vs Zirakpur prices?", a: "Yes — open each city buy hub or pan the Tricity sale map to compare pins." },
    ],
    relatedLinks: [
      { label: "Property for sale Tricity", href: appPath("/property-for-sale-chandigarh") },
      { label: "Mohali flats for sale", href: appPath(buyHubPath("mohali")) },
      { label: "List for sale", href: appPath("/list-for-sale") },
      { label: "Sale map", href: appPath(BUY_SEARCH_PATH) },
    ],
  },
  "property-for-sale": {
    slug: "property-for-sale",
    title: "Property for Sale in India | RentalPins Buy",
    description:
      "Owner-direct property for sale — flats, houses, plots, and villas on a curated map. Launching in Chandigarh Tricity.",
    h1: "Property for sale in India",
    intro:
      "RentalPins Buy is map-first property sale discovery — owner-direct listings without brokerage search fees, starting in Chandigarh Tricity.",
    benefits: [
      { title: "Buy hub cities", desc: "Mohali, Kharar, Zirakpur, Panchkula — each with a dedicated sale landing." },
      { title: "Residential focus", desc: "Flats, villas, builder floors, and plots in Property category." },
      { title: "Seller listings", desc: "Owners list through List for sale with map pin accuracy." },
      { title: "Separate from rentals", desc: "Sale map and post flow use transaction=sale — no rental noise." },
    ],
    faqs: [
      { q: "Is RentalPins Buy different from rentals?", a: "Yes — Buy is our sale vertical with gold-themed discovery and sale-only map filters." },
      { q: "Do you cover commercial property for sale?", a: "v1 focuses on residential Property category in Tricity. Commercial sale may follow." },
      { q: "How do buyers contact sellers?", a: "Open a listing pin and message the owner directly from listing detail." },
    ],
    relatedLinks: [
      { label: "Flats for sale", href: appPath("/flats-for-sale") },
      { label: "Tricity property", href: appPath("/property-for-sale-chandigarh") },
      { label: "Mohali property", href: appPath("/property-for-sale-mohali") },
      { label: "Explore buy hubs", href: appPath("/buy") },
    ],
  },
  "property-for-sale-chandigarh": {
    slug: "property-for-sale-chandigarh",
    title: "Chandigarh Tricity Property for Sale | RentalPins Buy",
    description:
      "Property for sale in Chandigarh Tricity — Mohali, Kharar, Panchkula, Zirakpur. Owner-direct flats, houses, and plots on the map.",
    h1: "Chandigarh Tricity property for sale",
    intro:
      "Browse owner-direct sale listings across Mohali phases, Kharar CU belt, Panchkula sectors, and Zirakpur highway corridors — one Tricity sale map with city-specific buy hubs.",
    benefits: [
      { title: "Four launch cities", desc: "Mohali, Kharar, Zirakpur, Panchkula buy pages with live inventory." },
      { title: "IT Park & Aerocity", desc: "Professional buyer demand zones in Greater Mohali." },
      { title: "Student & family belts", desc: "Kharar and Zirakpur value corridors for first-time buyers." },
      { title: "Owner-first", desc: "List and receive buyer inquiries without brokerage to search." },
      { title: "Cross-city compare", desc: "Pan the sale map to compare Tricity pins before shortlisting." },
      { title: "List for sale", desc: "Sellers post from web with transaction=sale." },
    ],
    faqs: [
      { q: "Which Tricity city should I start with?", a: "Mohali suits IT Park buyers; Kharar for budget flats; Zirakpur for larger homes; Panchkula for sector living." },
      { q: "Are Chandigarh sector flats for sale listed?", a: "v1 Tricity launch focuses on Mohali, Kharar, Panchkula, and Zirakpur. Chandigarh sector sale inventory may grow over time." },
      { q: "How do I list property for sale in Tricity?", a: "Use List for sale — pick Property, set asking price, and pin your society accurately." },
      { q: "Is there a brokerage fee to buyers?", a: "RentalPins does not charge buyers to search or contact owners on the sale map." },
    ],
    relatedLinks: [
      { label: "Mohali for sale", href: appPath(buyHubPath("mohali")) },
      { label: "Kharar for sale", href: appPath(buyHubPath("kharar")) },
      { label: "Zirakpur for sale", href: appPath(buyHubPath("zirakpur")) },
      { label: "Panchkula for sale", href: appPath(buyHubPath("panchkula")) },
      { label: "Flats for sale India", href: appPath("/flats-for-sale") },
    ],
  },
  "property-for-sale-mohali": {
    slug: "property-for-sale-mohali",
    title: "Mohali Property for Sale | RentalPins Buy",
    description:
      "Flats, villas, and plots for sale in Mohali Phase 7–11, IT Park, Aerocity — owner-direct listings on the map.",
    h1: "Mohali property for sale",
    intro:
      "Mohali buy hub covers Phase 7–11, IT Park, Aerocity, and sector belts — browse owner-posted flats, villas, and plots for sale without brokerage search fees on RentalPins Buy.",
    benefits: [
      { title: "Phase-wise map", desc: "Find sale pins across Phase 7, 9, 11 and Aerocity." },
      { title: "IT Park corridor", desc: "Popular with professionals buying near workplaces." },
      { title: "Tricity compare", desc: "Link to Kharar, Zirakpur, and Panchkula buy hubs from one place." },
      { title: "List for sale Mohali", desc: "Owners post with phase and society in the title." },
    ],
    faqs: [
      { q: "Which Mohali phases have sale listings?", a: "Inventory varies — Phase 7, 9, Sector 70, IT Park, and Aerocity are commonly searched. Check the live sale map." },
      { q: "Can I buy a villa in Mohali?", a: "Owners list villas and independent houses under Property. Filter on the Mohali sale map." },
      { q: "How do I sell my flat in Mohali?", a: "List for sale with society name, BHK, and phase in the title for buyer discovery." },
    ],
    relatedLinks: [
      { label: "Mohali buy hub", href: appPath(buyHubPath("mohali")) },
      { label: "Tricity property", href: appPath("/property-for-sale-chandigarh") },
      { label: "List flat for sale Mohali", href: appPath("/list-for-sale/mohali") },
      { label: "Sale map Mohali", href: appPath(`${BUY_SEARCH_PATH}?lat=30.7046&lng=76.7179&zoom=12&category=Property`) },
    ],
  },
  "commercial-property-for-sale": {
    slug: "commercial-property-for-sale",
    title: "Commercial Property for Sale | RentalPins Buy",
    description:
      "Shops, showrooms, office space, and warehouses for sale in Chandigarh Tricity — owner-direct commercial listings on the RentalPins buy map.",
    h1: "Commercial property for sale",
    intro:
      "Browse owner-listed shops, showrooms, offices, and warehouses on the RentalPins buy map. Filter by commercial sub-type and contact sellers directly — starting in Chandigarh Tricity.",
    benefits: [
      { title: "Commercial sub-types", desc: "Shops, showrooms, office space, and warehouse pins on the sale map." },
      { title: "Owner-direct", desc: "No brokerage to search or shortlist commercial inventory." },
      { title: "Tricity corridors", desc: "Mohali IT Park, Zirakpur VIP Road, and Kharar growth belts." },
      { title: "List commercial for sale", desc: "Owners post with accurate map pins and asking price." },
      { title: "Due diligence", desc: "Verify title, approvals, and use permissions before token." },
    ],
    faqs: [
      { q: "Which commercial types can I buy on RentalPins?", a: "Shops, showrooms, office space, and warehouses listed under Property for sale. Filter by sub-type on the buy map." },
      { q: "Is commercial sale available outside Tricity?", a: "We launch in Chandigarh Tricity first. More cities follow as owner inventory grows." },
      { q: "How do I list my shop for sale?", a: "Use List for sale, choose Property, pick Shops or Showroom, and drop an accurate map pin." },
      { q: "Can I compare commercial with residential?", a: "Residential and commercial sale listings share the buy map — use sub-type filters to focus." },
    ],
    relatedLinks: [
      { label: "Sale map", href: appPath(`${BUY_SEARCH_PATH}?category=Property&sub=Shops`) },
      { label: "Mohali buy hub", href: appPath(buyHubPath("mohali")) },
      { label: "Property for sale", href: appPath("/property-for-sale") },
      { label: "List for sale", href: appPath("/list-for-sale") },
    ],
  },
};

export function getSaleMarketingSlugs(): string[] {
  return Object.keys(SALE_MARKETING_PAGES);
}

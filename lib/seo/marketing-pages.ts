import { buildPageMetadata } from "@/lib/seo/metadata";
import type { Metadata } from "next";
import { appPath } from "@/lib/config";
import { rentalCityPath } from "@/lib/cities-config";

export interface MarketingSeoSection {
  title: string;
  paragraphs: string[];
}

export interface MarketingPageConfig {
  slug: string;
  title: string;
  description: string;
  h1: string;
  intro: string;
  benefits: { title: string; desc: string }[];
  faqs: { q: string; a: string }[];
  relatedLinks: { label: string; href: string }[];
  sections?: MarketingSeoSection[];
}

export function marketingMetadata(config: MarketingPageConfig): Metadata {
  return buildPageMetadata({
    title: config.title,
    description: config.description,
    path: `/${config.slug}`,
    keywords: [
      "rent without broker",
      "no brokerage",
      "RentalPins",
      "property rent",
      "direct owner",
    ],
  });
}

export const WITHOUT_BROKER_PAGES: Record<string, MarketingPageConfig> = {
  "rent-without-broker": {
    slug: "rent-without-broker",
    title: "Rent Without Broker — Direct Owner Rentals | RentalPins",
    description:
      "Find flats, houses, PG, shops and commercial property for rent without broker fees. Browse owner listings on the map and contact directly on RentalPins.",
    h1: "Rent without broker — contact owners directly",
    intro:
      "RentalPins is a map-first rental marketplace where owners list property and tenants browse live pins — no brokerage commission to search or contact. Filter flats, PG, houses, shops, and offices by city hub, compare neighbourhood pins, and message owners on WhatsApp without a broker middleman.",
    benefits: [
      { title: "Zero search brokerage", desc: "Browse and message owners without paying a broker to unlock listings." },
      { title: "Map discovery", desc: "See price pins by neighbourhood — faster than scrolling classified feeds." },
      { title: "OTP-verified users", desc: "Phone-verified accounts reduce spam vs anonymous boards." },
      { title: "Free owner listings", desc: "Post rentals on web or Android in supported cities." },
      { title: "Priority city guides", desc: "Chandigarh Tricity, Mohali, Kharar, Ludhiana, and Delhi include long-form rental guides with live map links." },
      { title: "Save searches", desc: "Get alerts when new owner posts match your budget and area." },
    ],
    faqs: [
      { q: "Is RentalPins completely free for tenants?", a: "Browsing and contacting owners is free. Some owner activation plans may apply when publishing — see in-app terms." },
      { q: "How is this different from broker-led portals?", a: "Listings are posted by owners; you contact them directly rather than through an intermediary." },
      { q: "Which cities have the deepest no-broker inventory?", a: "Chandigarh Tricity, Mohali, Kharar, Ludhiana, and Delhi NCR — each has city hubs, area pages, and blog guides linking back to live pins." },
      { q: "Can I list my property without a broker?", a: "Yes — owners post free on web or Android in supported cities and receive WhatsApp leads from tenants." },
      { q: "How do I avoid broker duplicates of owner listings?", a: "Shortlist on RentalPins and message the owner from the app pin — broker reposts of the same photos are common on external boards." },
    ],
    relatedLinks: [
      { label: "Flats without broker", href: appPath("/flats-without-broker") },
      { label: "Property without broker", href: appPath("/property-without-broker") },
      { label: "Map search", href: appPath("/search") },
      { label: "Ludhiana rentals", href: appPath(rentalCityPath("in", "ludhiana")) },
      { label: "Chandigarh rentals", href: appPath(rentalCityPath("in", "chandigarh")) },
      { label: "Delhi rentals", href: appPath(rentalCityPath("in", "delhi")) },
    ],
  },
  "flats-without-broker": {
    slug: "flats-without-broker",
    title: "Flats for Rent Without Broker | RentalPins",
    description:
      "Find apartments and flats for rent without broker commission. Map search across India with direct owner contact.",
    h1: "Flats & apartments for rent without broker",
    intro:
      "Filter Property → Apartments / Flats on the RentalPins map and contact verified owners instantly — no brokerage to search 1BHK, 2BHK, or furnished flats in Chandigarh Tricity, Mohali, Ludhiana, Delhi, and other live city hubs.",
    benefits: [
      { title: "1–3 BHK filters", desc: "Narrow by budget, BHK, and furnishing on the map." },
      { title: "Area hubs", desc: "City and locality pages for Ludhiana, Tricity, Delhi NCR, and more." },
      { title: "Save searches", desc: "Get alerts when new flats match your criteria." },
      { title: "WhatsApp leads", desc: "One-tap owner contact from listing detail." },
      { title: "Flats for rent funnel", desc: "India-wide entry at /flats-for-rent links into priority city flat hubs with live inventory." },
      { title: "Owner-direct only", desc: "Skip broker unlock fees — negotiate rent and deposit with the person who listed the pin." },
    ],
    faqs: [
      { q: "Can I rent a furnished flat without broker?", a: "Yes — use furnishing filters and contact owners listed on the map." },
      { q: "Which cities have the most flat inventory?", a: "Chandigarh Tricity, Mohali, Kharar, Ludhiana, and Delhi — each has flats category pages under the city hub." },
      { q: "How do I compare flats in the same budget?", a: "Pan the map, open pins for exact sector or phase, and message multiple owners before visiting." },
      { q: "Are shared flats listed without broker?", a: "Yes — owners post shared and single-tenant flats; confirm bedroom allocation and bills in your first message." },
    ],
    relatedLinks: [
      { label: "Flats for rent India", href: appPath("/flats-for-rent") },
      { label: "Rent without broker", href: appPath("/rent-without-broker") },
      { label: "Houses without broker", href: appPath("/house-for-rent-without-broker") },
      { label: "Chandigarh flats", href: appPath("/rentals/in/chandigarh/flats") },
      { label: "Browse map", href: appPath("/search") },
    ],
  },
  "house-for-rent-without-broker": {
    slug: "house-for-rent-without-broker",
    title: "House for Rent Without Broker | RentalPins",
    description:
      "Independent houses and villas for rent without brokerage. Owner listings on an interactive map.",
    h1: "House for rent without broker",
    intro:
      "Discover independent houses and villas posted by owners — compare locations on the map before visiting. Family belts in Chandigarh sectors, Mohali phases, Ludhiana Model Town, and Delhi Dwarka are browsable without brokerage commission on RentalPins.",
    benefits: [
      { title: "Villa & house category", desc: "Property sub-filters for houses and villas." },
      { title: "Family-friendly zones", desc: "Explore city area guides for residential belts." },
      { title: "Direct negotiation", desc: "Speak with owners — no mandatory broker layer." },
      { title: "Same app inventory", desc: "Web and Android share one listing pool." },
      { title: "Houses for rent funnel", desc: "National /houses-for-rent entry links into city house hubs with owner-direct inventory." },
      { title: "Deposit clarity", desc: "Confirm maintenance, parking, and society NOC with the owner before token — not through a broker." },
    ],
    faqs: [
      { q: "Are villas listed without broker?", a: "Owners can list villas under Property; browse and contact them on RentalPins." },
      { q: "Which cities have house and villa inventory?", a: "Chandigarh Tricity, Mohali, Ludhiana, and Delhi — use houses category pages under each city hub." },
      { q: "How is house search different from flats?", a: "Filter Property → Houses / Villas, then compare pin clusters near schools, markets, and your commute anchor." },
      { q: "Can I avoid broker reposts of owner houses?", a: "Message owners from the RentalPins pin — duplicate broker listings of the same photos remain common on other boards." },
    ],
    relatedLinks: [
      { label: "Houses for rent India", href: appPath("/houses-for-rent") },
      { label: "Flats without broker", href: appPath("/flats-without-broker") },
      { label: "Mohali property", href: appPath("/property-without-broker-mohali") },
      { label: "Chandigarh houses", href: appPath("/rentals/in/chandigarh/houses") },
    ],
  },
  "property-without-broker-ludhiana": {
    slug: "property-without-broker-ludhiana",
    title: "Property for Rent in Ludhiana Without Broker | RentalPins",
    description:
      "Rooms, flats, PG, shops and commercial property in Ludhiana — direct owner contact, no broker.",
    h1: "Ludhiana property for rent without broker",
    intro:
      "RentalPins Ludhiana hub covers Model Town, Sarabha Nagar, Focal Point, Pakhowal Road, BRS Nagar, and more — browse rooms, flats, PG, shops, and warehouses with direct owner contact and no brokerage to search or inquire.",
    benefits: [
      { title: "Ludhiana area pages", desc: "Deep links for major localities with live listings." },
      { title: "Student & family PG", desc: "PG and room filters for university belts near PAU." },
      { title: "Commercial belts", desc: "Shops and warehouses on industrial corridors." },
      { title: "Free post", desc: "Owners list from web or app." },
      { title: "Money-page guide", desc: "Long-form Ludhiana rental guide with rent bands and deposit tips on the city hub." },
      { title: "Blog tips", desc: "Room-finding guides link back to live Ludhiana map inventory." },
    ],
    faqs: [
      { q: "Which Ludhiana areas are live?", a: "Model Town, Sarabha Nagar, Pakhowal Road, BRS Nagar, Focal Point and the city hub." },
      { q: "Can I find PG near PAU without broker?", a: "Yes — filter PG/Hostels on the Ludhiana map and contact owners directly." },
      { q: "Does RentalPins charge tenants brokerage?", a: "No search commission — you message owners from listing pins." },
      { q: "How do I compare Ludhiana flats in one budget?", a: "Pan the map across Model Town and Sarabha Nagar, open pins for exact locality, then shortlist before visits." },
    ],
    relatedLinks: [
      { label: "Ludhiana rentals hub", href: appPath(rentalCityPath("in", "ludhiana")) },
      { label: "Ludhiana rental guide", href: appPath(`${rentalCityPath("in", "ludhiana")}#city-seo-content-heading`) },
      { label: "Rent without broker", href: appPath("/rent-without-broker") },
      { label: "Property without broker India", href: appPath("/property-without-broker") },
    ],
  },
  "property-without-broker-chandigarh": {
    slug: "property-without-broker-chandigarh",
    title: "Chandigarh Tricity Property Without Broker | RentalPins",
    description:
      "Rent in Chandigarh, Mohali, Panchkula, Zirakpur without broker. Map-based owner listings.",
    h1: "Chandigarh Tricity — no broker rentals",
    intro:
      "Browse Tricity sectors, Mohali phases, Panchkula blocks, and Kharar town on one map — owner-direct flats, PG, houses, shops, and offices without paying brokerage to search or contact on RentalPins.",
    benefits: [
      { title: "Tricity coverage", desc: "Chandigarh, Mohali, Panchkula, Zirakpur, Kharar hubs." },
      { title: "IT Park & Aerocity", desc: "Popular zones for working professionals." },
      { title: "Sector-wise search", desc: "Pan the map to Sector 17, 22, 35 and more." },
      { title: "Owner-first", desc: "List and receive WhatsApp leads." },
      { title: "Money-page guide", desc: "Chandigarh hub includes average rents, transport, and broker-free viewing checklist." },
      { title: "Kharar & CU corridor", desc: "Student PG and shared flats near Chandigarh University without broker unlock fees." },
    ],
    faqs: [
      { q: "Does RentalPins cover Mohali and Panchkula?", a: "Yes — dedicated area pages under the Chandigarh Tricity hub." },
      { q: "Can I rent in Kharar without broker?", a: "Yes — use the Kharar area page and map filters for PG and flats near CU." },
      { q: "How do I avoid Tricity broker duplicates?", a: "Message owners from RentalPins pins — broker reposts of owner photos are common on external boards." },
      { q: "Which Tricity zones suit IT professionals?", a: "Mohali IT Park, Aerocity, and central Chandigarh sectors — compare commute on one map before signing." },
    ],
    relatedLinks: [
      { label: "Chandigarh hub", href: appPath(rentalCityPath("in", "chandigarh")) },
      { label: "Tricity rental guide", href: appPath(`${rentalCityPath("in", "chandigarh")}#city-seo-content-heading`) },
      { label: "Mohali without broker", href: appPath("/property-without-broker-mohali") },
      { label: "Kharar area", href: appPath("/rentals/in/chandigarh/kharar") },
    ],
  },
  "property-without-broker-mohali": {
    slug: "property-without-broker-mohali",
    title: "Mohali Property for Rent Without Broker | RentalPins",
    description:
      "Flats, PG, and offices in Mohali Phase 7–11, IT Park, Aerocity — direct owner listings.",
    h1: "Mohali rentals without broker",
    intro:
      "Mohali area hub includes Phase 7–11, IT Park, Aerocity, and student-friendly PG inventory — browse owner-posted flats, PG, houses, and offices without brokerage commission on RentalPins.",
    benefits: [
      { title: "Phase-wise map", desc: "Find pins across Phase 7, 9, 11 and Aerocity." },
      { title: "PG near IT Park", desc: "Filter PG/Hostels for professionals and students." },
      { title: "Office & co-working", desc: "Commercial sub-categories for businesses." },
      { title: "Tricity commute", desc: "Compare Mohali vs Chandigarh pins on one map." },
      { title: "Money-page guide", desc: "Mohali rental guide with phase tips and rent context on the area hub." },
      { title: "Blog: IT Park tips", desc: "Mohali IT Park rental guide links back to live map inventory." },
    ],
    faqs: [
      { q: "Best Mohali areas on RentalPins?", a: "Phase 7, Phase 11, Aerocity, and IT Park — see the Mohali area page." },
      { q: "Can I find PG near Mohali IT Park without broker?", a: "Yes — filter PG/Hostels on the Mohali map and contact owners directly." },
      { q: "How is Mohali different from Chandigarh search?", a: "Mohali is phase-driven — use the area page when your anchor is SAS Nagar rather than Chandigarh sectors." },
      { q: "Are furnished flats listed by owners?", a: "Yes — confirm AC, appliances, and deposit terms with the owner before token payment." },
    ],
    relatedLinks: [
      { label: "Mohali rentals hub", href: appPath("/rentals/mohali") },
      { label: "Sector 70 Mohali", href: appPath("/rentals/mohali/sector-70") },
      { label: "Phase 7 Mohali", href: appPath("/rentals/mohali/phase-7") },
      { label: "Mohali flats on map", href: appPath("/rentals/in/chandigarh/mohali/flats") },
      { label: "PG near CU", href: appPath("/pg-near-chandigarh-university") },
    ],
  },
  "property-without-broker": {
    slug: "property-without-broker",
    title: "Property Without Broker in India | RentalPins",
    description: "Find residential and commercial property for rent without broker fees on RentalPins.",
    h1: "Property without broker",
    intro: "Owner-direct listings for flats, houses, PG, shops, and offices with map-first discovery.",
    benefits: [
      { title: "No brokerage search", desc: "Contact owners directly." },
      { title: "City-locality coverage", desc: "Deep pages for key Indian hubs." },
    ],
    faqs: [{ q: "Is this only for residential rentals?", a: "No, commercial and industrial categories are included too." }],
    relatedLinks: [
      { label: "Chandigarh property", href: appPath("/property-without-broker-chandigarh") },
      { label: "Delhi property", href: appPath("/property-without-broker-delhi") },
      { label: "Jaipur property", href: appPath("/property-without-broker-jaipur") },
      { label: "All rentals", href: appPath("/rentals") },
    ],
  },
  "houses-without-broker": {
    slug: "houses-without-broker",
    title: "Houses Without Broker | Direct Owner House Rentals",
    description: "Find independent houses and villas for rent without brokerage.",
    h1: "Houses without broker",
    intro: "Explore owner-posted house rentals with area-level map visibility.",
    benefits: [{ title: "Direct negotiation", desc: "Talk to owners without a mandatory broker layer." }],
    faqs: [{ q: "Are villas included?", a: "Yes, villas and independent homes are covered." }],
    relatedLinks: [{ label: "Houses for rent", href: appPath("/houses-for-rent") }],
  },
  "no-broker-rental-india": {
    slug: "no-broker-rental-india",
    title: "No Broker Rental India | RentalPins",
    description: "Pan-India no-broker rental marketplace for flats, PG, houses and commercial property.",
    h1: "No broker rental India",
    intro: "RentalPins helps tenants find owner listings across major Indian cities with map-led search.",
    benefits: [{ title: "City hubs", desc: "Structured city + locality pages for fast discovery." }],
    faqs: [{ q: "Which cities are active?", a: "See live city badges on the rentals hub and homepage." }],
    relatedLinks: [{ label: "All rentals", href: appPath("/rentals") }],
  },
  "property-without-broker-delhi": {
    slug: "property-without-broker-delhi",
    title: "Property Without Broker Delhi | RentalPins",
    description: "Find flats, PG, houses, and commercial space in Delhi without broker fees.",
    h1: "Delhi property without broker",
    intro:
      "Owner-direct Delhi rental discovery with map-based search and locality links — flats, PG, houses, and rooms in coaching belts, residential sectors, and commercial corridors without brokerage to browse or contact on RentalPins.",
    benefits: [
      { title: "Delhi localities", desc: "Mukherjee Nagar, GTB Nagar, Karol Bagh, Dwarka, Rohini, and more on one map." },
      { title: "PG & shared flats", desc: "Filter PG/Hostels or Apartments for coaching and college stays." },
      { title: "Owner WhatsApp leads", desc: "Contact listing owners directly from pin detail." },
      { title: "Money-page guide", desc: "Delhi hub rental guide with locality context and deposit checklist." },
      { title: "Blog: Delhi no-broker tips", desc: "Delhi rentals without broker guide links back to live map inventory." },
      { title: "Save searches", desc: "Monitor new owner posts in your target locality before session peak." },
    ],
    faqs: [
      { q: "Do you cover NCR too?", a: "Yes — Delhi and nearby hubs are available in rentals pages." },
      { q: "Can I find PG near coaching centers without broker?", a: "Yes — pan Mukherjee Nagar or GTB Nagar on the Delhi map and filter PG/Hostels." },
      { q: "Does RentalPins charge tenants brokerage?", a: "No search commission — message owners from listing pins." },
      { q: "How do I avoid broker duplicates in Delhi?", a: "Shortlist on RentalPins and contact the owner from the app — broker reposts of owner photos remain common." },
    ],
    relatedLinks: [
      { label: "Delhi rentals", href: appPath("/rentals/in/delhi") },
      { label: "Delhi rental guide", href: appPath("/rentals/in/delhi#city-seo-content-heading") },
      { label: "Property without broker India", href: appPath("/property-without-broker") },
      { label: "Rent without broker", href: appPath("/rent-without-broker") },
    ],
  },
  "property-without-broker-jaipur": {
    slug: "property-without-broker-jaipur",
    title: "Property for Rent in Jaipur Without Broker | RentalPins",
    description:
      "Rooms, flats, PG, shops and commercial property in Jaipur — direct owner contact, no broker.",
    h1: "Jaipur property for rent without broker",
    intro:
      "RentalPins Jaipur hub covers Malviya Nagar, Vaishali Nagar, Mansarovar, Jagatpura, C-Scheme, Raja Park, Sitapura, Tonk Road, Bani Park, Vidhyadhar Nagar, and more — browse rooms, flats, PG, and shops with direct owner contact and no brokerage to search or inquire.",
    benefits: [
      { title: "Jaipur area pages", desc: "Deep links for major localities with live listings." },
      { title: "Student & IT PG", desc: "PG and room filters for Malviya Nagar and Jagatpura belts." },
      { title: "Family society flats", desc: "Vaishali Nagar, Mansarovar, and Vidhyadhar Nagar hubs." },
      { title: "Free post", desc: "Owners list from web or app." },
      { title: "Money-page guide", desc: "Long-form Jaipur rental guide with rent bands and deposit tips on the city hub." },
      { title: "GSC locality guides", desc: "Short /rentals/jaipur spokes link back to live map inventory." },
    ],
    faqs: [
      { q: "Which Jaipur areas are live?", a: "Malviya Nagar, Vaishali Nagar, Mansarovar, Jagatpura, C-Scheme, Raja Park, Sitapura, Tonk Road, Bani Park, Vidhyadhar Nagar and the city hub." },
      { q: "Can I find PG in Malviya Nagar without broker?", a: "Yes — filter PG/Hostels on the Jaipur map and contact owners directly." },
      { q: "Does RentalPins charge tenants brokerage?", a: "No search commission — you message owners from listing pins." },
      { q: "How do I compare Jaipur flats in one budget?", a: "Pan the map across Vaishali Nagar and Mansarovar, open pins for exact locality, then shortlist before visits." },
    ],
    relatedLinks: [
      { label: "Jaipur rentals hub", href: appPath(rentalCityPath("in", "jaipur")) },
      { label: "Jaipur rental guide", href: appPath(`${rentalCityPath("in", "jaipur")}#city-seo-content-heading`) },
      { label: "Malviya Nagar guide", href: appPath("/rentals/jaipur/malviya-nagar") },
      { label: "Rent without broker", href: appPath("/rent-without-broker") },
      { label: "Property without broker India", href: appPath("/property-without-broker") },
    ],
  },
};

export const APP_DOWNLOAD_PAGES: Record<string, MarketingPageConfig> = {
  "download-app": {
    slug: "download-app",
    title: "Download RentalPins App — Android Property & Rental Map",
    description:
      "Get the RentalPins Android app for map search, owner listings, WhatsApp leads, and free property posts in Tricity, Ludhiana, Delhi, and live cities.",
    h1: "Download the RentalPins app",
    intro:
      "Same live map and listings as the website — search PG, flats, houses, shops, vehicles, and equipment on Android with saved-search alerts, owner WhatsApp leads, and free listing drafts optimized for mobile.",
    benefits: [
      { title: "Live map", desc: "Price pins, filters, and saved searches on mobile." },
      { title: "Post in minutes", desc: "Draft, verify OTP, activate plans from your phone." },
      { title: "Instant leads", desc: "WhatsApp and in-app chat notifications for owners." },
      { title: "Multi-category", desc: "Property, vehicles, equipment and more on one app." },
      { title: "Web + app sync", desc: "One account, one listing pool across surfaces." },
      { title: "Priority cities", desc: "Tricity, Ludhiana, and Delhi deep hub inventory." },
    ],
    faqs: [
      { q: "Is the app free?", a: "Download is free; listing activation follows city policy shown in-app." },
      { q: "Does the app charge tenant brokerage?", a: "No — tenants browse and contact owners without search commission." },
      { q: "Can owners and tenants use the same app?", a: "Yes — one RentalPins app for posting and map search." },
      { q: "Is inventory the same as the website?", a: "Yes — web and Android share live map pins and listings." },
    ],
    relatedLinks: [
      { label: "Property owner app", href: appPath("/property-owner-app") },
      { label: "Tenant app", href: appPath("/tenant-app") },
      { label: "Rental app India", href: appPath("/rental-app-india") },
      { label: "Web map", href: appPath("/search") },
    ],
  },
  "property-owner-app": {
    slug: "property-owner-app",
    title: "Property Owner App — List Rentals Free | RentalPins",
    description:
      "Android app for landlords and owners to post property, vehicles, and equipment on the map with WhatsApp leads in live Indian cities.",
    h1: "RentalPins for property owners",
    intro:
      "Publish listings, receive leads, and manage visibility from your phone — map pins appear to web and app tenants in Ludhiana, Tricity, Delhi, and other live markets with OTP-verified inquiries.",
    benefits: [
      { title: "Free listing flow", desc: "Post drafts then activate when ready." },
      { title: "Map visibility", desc: "Pins appear alongside web traffic instantly." },
      { title: "Lead tracking", desc: "WhatsApp and inquiry counters on listings." },
      { title: "OTP trust", desc: "Verified tenant conversations reduce spam." },
      { title: "Multi-category", desc: "Property, vehicles, gear, and equipment posts." },
      { title: "Photo refresh", desc: "Update pins after vacancy for faster leasing." },
    ],
    faqs: [
      { q: "Can I manage listings on web too?", a: "Yes — www.rentalpins.com supports post, edit, and activate flows." },
      { q: "Which cities can I list in?", a: "See live city badges on the rentals hub — Tricity, Ludhiana, and Delhi are deepest." },
      { q: "How do leads arrive?", a: "Tenants contact you via WhatsApp or in-app chat from your listing pin." },
      { q: "Is posting free?", a: "Drafting is free; activation may follow in-app city policy for owners." },
    ],
    relatedLinks: [
      { label: "Download app", href: appPath("/download-app") },
      { label: "Rent without broker", href: appPath("/rent-without-broker") },
      { label: "Post on web", href: appPath("/post") },
    ],
  },
  "tenant-app": {
    slug: "tenant-app",
    title: "Tenant App — Find Rentals on Map | RentalPins",
    description:
      "Search rooms, PG, flats, and vehicles near you on Android — contact owners directly without broker fees in live Indian cities.",
    h1: "RentalPins for tenants",
    intro:
      "Discover rentals by location on the map, save searches for PG and flats, get alerts for new owner pins, and contact owners on WhatsApp without brokerage — same inventory as the RentalPins website.",
    benefits: [
      { title: "Map-first search", desc: "Pan, zoom, and filter by category on mobile." },
      { title: "Alerts", desc: "Saved search notifications for new matching pins." },
      { title: "Direct contact", desc: "WhatsApp, call, and in-app chat to owners." },
      { title: "No brokerage", desc: "Browse and inquire without tenant search commission." },
      { title: "Campus PG", desc: "CU, PAU, and IT Park belts on the same map." },
      { title: "Vehicles too", desc: "Bike and car rentals separate from property filters." },
    ],
    faqs: [
      { q: "Do I pay brokerage on the app?", a: "RentalPins does not charge tenants brokerage to browse or contact owners." },
      { q: "Can I save PG searches near campus?", a: "Yes — save map searches and get alerts when new PG pins appear." },
      { q: "Is the app only for flats?", a: "No — PG, houses, shops, vehicles, and equipment are all searchable." },
      { q: "Does GPS search work offline?", a: "You need connectivity for live pins; manual map pan works without GPS permission." },
    ],
    relatedLinks: [
      { label: "Rental app India", href: appPath("/rental-app-india") },
      { label: "PG for rent", href: appPath("/pg-for-rent") },
      { label: "Download app", href: appPath("/download-app") },
    ],
  },
  "rental-app-india": {
    slug: "rental-app-india",
    title: "Rental App India — Map-Based Property Search | RentalPins",
    description:
      "India-focused rental app for flats, PG, shops, offices, and vehicles — Ludhiana, Tricity, Delhi NCR, and live city hubs with owner-direct contact.",
    h1: "India's map-based rental app",
    intro:
      "Built for Indian cities with local area hubs, money-page rental guides, and no-broker owner contact — install on Android and search the same live map inventory as www.rentalpins.com.",
    benefits: [
      { title: "Indian cities", desc: "Ludhiana, Chandigarh Tricity, Delhi, and live hub badges." },
      { title: "PG & commercial", desc: "Property sub-types for every use case on one map." },
      { title: "Owner-direct", desc: "WhatsApp owners without mandatory broker layer." },
      { title: "Play Store", desc: "Install on Android today — same pins as web." },
      { title: "National funnels", desc: "Flats, houses, and PG landings link to app map." },
      { title: "City guides", desc: "1,500-word money pages sync with app search." },
    ],
    faqs: [
      { q: "Which cities are live?", a: "See city hubs on the website — live badges show active markets." },
      { q: "Is this different from NoBroker apps?", a: "RentalPins is map-native with multi-category inventory and city money-page guides." },
      { q: "Can students find PG near CU or PAU?", a: "Yes — filter PG on city maps; campus landings link to the same pins." },
      { q: "Do owners use the same app?", a: "Yes — one RentalPins Android app for posting and searching." },
    ],
    relatedLinks: [
      { label: "Download", href: appPath("/download-app") },
      { label: "Tenant app", href: appPath("/tenant-app") },
      { label: "Property owner app", href: appPath("/property-owner-app") },
      { label: "Rentals hub", href: appPath("/rentals") },
    ],
  },
};

export const COMPETITOR_PAGES: Record<string, MarketingPageConfig & { competitor: string; rows: { feature: string; rentalpins: string; other: string }[] }> = {
  "rentalpins-vs-nobroker": {
    slug: "rentalpins-vs-nobroker",
    competitor: "NoBroker",
    title: "RentalPins vs NoBroker — Map Rentals Without Broker",
    description: "Compare RentalPins and NoBroker for owner-direct rentals, map search, and listing fees.",
    h1: "RentalPins vs NoBroker",
    intro: "Both aim to reduce brokerage; RentalPins emphasizes map discovery and multi-category rentals beyond residential.",
    benefits: [
      { title: "Map-first UX", desc: "Browse owner pins by neighbourhood — core product, not a secondary filter." },
      { title: "Multi-category", desc: "Property, vehicles, furniture, and equipment on one map." },
      { title: "City hub SEO", desc: "Long-form Tricity, Ludhiana, and Delhi guides with live inventory." },
      { title: "Owner WhatsApp leads", desc: "Direct contact without broker unlock fees for tenants." },
    ],
    faqs: [
      { q: "Is RentalPins only for property?", a: "No — vehicles, furniture, machinery, and more are supported." },
      { q: "How does RentalPins compare for map search?", a: "Map pins are the primary discovery UX — not a list-first portal with optional map." },
      { q: "Which cities are deepest on RentalPins?", a: "Chandigarh Tricity, Mohali, Kharar, Ludhiana, and Delhi NCR — each has money-page guides." },
      { q: "Is tenant search free?", a: "Browsing and contacting owners is free — some owner listing plans may apply when publishing." },
    ],
    relatedLinks: [{ label: "Rent without broker", href: appPath("/rent-without-broker") }],
    rows: [
      { feature: "Map-first search", rentalpins: "Yes — core UX", other: "Limited map emphasis" },
      { feature: "Multi-category", rentalpins: "9 categories", other: "Primarily property" },
      { feature: "Owner contact", rentalpins: "WhatsApp, call, chat", other: "In-app contact" },
      { feature: "Free listing", rentalpins: "Supported cities", other: "Plan-based" },
    ],
  },
  "rentalpins-vs-magicbricks": {
    slug: "rentalpins-vs-magicbricks",
    competitor: "MagicBricks",
    title: "RentalPins vs MagicBricks — Owner Map Listings",
    description: "RentalPins map marketplace vs MagicBricks portal model for rentals in India.",
    h1: "RentalPins vs MagicBricks",
    intro: "MagicBricks is a broad real-estate portal; RentalPins focuses on live map pins and direct owner leads.",
    benefits: [
      { title: "Interactive map", desc: "Primary discovery — not list-scroll with map as add-on." },
      { title: "Owner-direct", desc: "Positioning for broker-free tenant contact in live hubs." },
      { title: "PG + commercial", desc: "Student PG, shops, offices, and warehouses on one platform." },
      { title: "Area pages", desc: "Locality hubs with rent context and live pins." },
    ],
    faqs: [
      { q: "Does RentalPins replace MagicBricks entirely?", a: "Many tenants use both — RentalPins excels at map-led owner contact in priority Indian cities." },
      { q: "Are agent listings mixed in?", a: "RentalPins is owner-direct focused — verify listing source on contact." },
      { q: "Can I search flats without broker?", a: "Yes — see flats-without-broker and city flat hubs linked from comparison pages." },
      { q: "Does RentalPins work on mobile?", a: "Yes — Android app and mobile web share the same map pins and owner contact flow." },
    ],
    relatedLinks: [{ label: "Flats without broker", href: appPath("/flats-without-broker") }],
    rows: [
      { feature: "Discovery", rentalpins: "Interactive map", other: "List + search portal" },
      { feature: "Broker model", rentalpins: "Owner-direct positioning", other: "Mixed agent listings" },
      { feature: "Categories", rentalpins: "Property + vehicles + gear", other: "Real estate focused" },
      { feature: "Mobile app", rentalpins: "Android + web", other: "Established apps" },
    ],
  },
  "rentalpins-vs-99acres": {
    slug: "rentalpins-vs-99acres",
    competitor: "99acres",
    title: "RentalPins vs 99acres — Compare Rental Platforms",
    description: "See how RentalPins map rentals compare to 99acres listings and search.",
    h1: "RentalPins vs 99acres",
    intro:
      "99acres offers wide inventory across projects and cities; RentalPins differentiates with geospatial browsing, OTP-verified contact, and deep Tricity, Ludhiana, and Delhi money-page guides.",
    benefits: [
      { title: "Map pins primary", desc: "Neighbourhood-led discovery vs project-first portal sorting." },
      { title: "Locality SEO", desc: "City + area money pages with 1,500-word guides in priority markets." },
      { title: "Vehicles & gear", desc: "Non-property rentals rare on traditional portals." },
      { title: "OTP-verified users", desc: "Phone-verified accounts reduce spam vs anonymous boards." },
    ],
    faqs: [
      { q: "Which platform has better map UX?", a: "RentalPins is built map-native; 99acres is list and project oriented." },
      { q: "Does RentalPins cover commercial rentals?", a: "Yes — shops, offices, warehouses, and industrial categories on the map." },
      { q: "Where is RentalPins strongest?", a: "Chandigarh Tricity, Ludhiana, and Delhi — deepest guides and inventory." },
      { q: "Is RentalPins free for tenants?", a: "Browsing and contacting owners is free on RentalPins — compare with portal subscription models on other property sites." },
    ],
    relatedLinks: [{ label: "Rental app India", href: appPath("/rental-app-india") }],
    rows: [
      { feature: "Map pins", rentalpins: "Primary", other: "Secondary" },
      { feature: "Local area SEO", rentalpins: "City + locality hubs", other: "Project/city pages" },
      { feature: "Vehicles & equipment", rentalpins: "Yes", other: "Rare" },
      { feature: "Owner OTP", rentalpins: "Yes", other: "Varies" },
    ],
  },
  "rentalpins-vs-housing": {
    slug: "rentalpins-vs-housing",
    competitor: "Housing.com",
    title: "RentalPins vs Housing.com — Rental Comparison",
    description: "RentalPins vs Housing.com for tenants and owners seeking broker-free map search.",
    h1: "RentalPins vs Housing.com",
    intro: "Housing.com is a major listings portal; RentalPins targets map-native discovery and multi-vertical rentals.",
    benefits: [
      { title: "Map + pins UX", desc: "Geospatial browse vs portal-first project feeds." },
      { title: "PG & commercial filters", desc: "Student PG and business categories alongside residential." },
      { title: "International hubs", desc: "London, Nairobi, Lagos plus Indian priority cities." },
      { title: "Free listing tiers", desc: "Owner posts in supported live cities on web and Android." },
    ],
    faqs: [
      { q: "Is Housing.com better for projects?", a: "Housing.com excels at project inventory — RentalPins excels at map-led owner rentals in live hubs." },
      { q: "Can tenants contact owners directly?", a: "Yes — WhatsApp and in-app chat from listing pins without mandatory broker layer." },
      { q: "Does RentalPins have an app?", a: "Yes — Android app with same map and listings as the website." },
      { q: "Which cities have money-page guides?", a: "Chandigarh Tricity, Mohali, Kharar, Ludhiana, and Delhi — each links to live map inventory." },
    ],
    relatedLinks: [{ label: "Download app", href: appPath("/download-app") }],
    rows: [
      { feature: "UX focus", rentalpins: "Map + pins", other: "Portal + projects" },
      { feature: "Commercial & PG", rentalpins: "Category filters", other: "Available" },
      { feature: "International hubs", rentalpins: "London, Nairobi, Lagos", other: "India-first" },
      { feature: "Listing cost", rentalpins: "Free tiers in live cities", other: "Package-based" },
    ],
  },
};

export const CATEGORY_LANDING_PAGES: Record<string, MarketingPageConfig> = {
  "flats-for-rent": {
    slug: "flats-for-rent",
    title: "Flats for Rent in India | RentalPins",
    description:
      "Find 1BHK, 2BHK and furnished flats for rent across Chandigarh Tricity, Ludhiana, Delhi, and top Indian cities without broker commission.",
    h1: "Flats for rent in India",
    intro:
      "Browse owner-listed flats on the RentalPins map and contact directly via WhatsApp — filter BHK, budget, and furnishing, then drill into priority city hubs for Tricity, Ludhiana, and Delhi inventory.",
    benefits: [
      { title: "BHK + budget filters", desc: "Compare 1BHK/2BHK with transparent pricing on the map." },
      { title: "Area-first map search", desc: "See inventory by neighbourhood before shortlisting." },
      { title: "No broker middleman", desc: "Talk to owners directly without search commission." },
      { title: "City funnel cards", desc: "Priority markets link to money-page guides and live flats hubs." },
      { title: "Flats without broker", desc: "National broker-free landing cross-linked." },
      { title: "Save searches", desc: "Alerts when new flat pins match your criteria." },
    ],
    faqs: [
      { q: "Can I search furnished flats only?", a: "Yes — use furnishing filters in map search and confirm appliances with owners." },
      { q: "Which cities have the deepest flat inventory?", a: "Chandigarh Tricity, Mohali, Kharar, Ludhiana, and Delhi — use city cards on this page." },
      { q: "Does RentalPins charge tenant brokerage?", a: "No search commission — message owners from listing pins." },
      { q: "How do national funnels link to city pages?", a: "Click a priority city card to open flats category pages under that hub with live map filters." },
    ],
    relatedLinks: [
      { label: "Flats in Chandigarh", href: appPath("/rentals/in/chandigarh/flats") },
      { label: "Flats in Ludhiana", href: appPath("/rentals/in/ludhiana/flats") },
      { label: "Flats without broker", href: appPath("/flats-without-broker") },
      { label: "Property without broker", href: appPath("/property-without-broker") },
    ],
  },
  "houses-for-rent": {
    slug: "houses-for-rent",
    title: "Houses for Rent Without Broker | RentalPins",
    description:
      "Find independent houses and villas for rent across India with direct owner contact and city money-page guides.",
    h1: "Houses and villas for rent",
    intro:
      "Discover house and villa rentals across city and locality hubs on RentalPins — filter houses category on the map, use national funnel city cards, and contact owners directly without brokerage.",
    benefits: [
      { title: "Family-friendly areas", desc: "Browse locality pages with neighbourhood context." },
      { title: "Villas included", desc: "Independent houses and villas under Property filters." },
      { title: "Owner-direct", desc: "WhatsApp owners from map pins." },
      { title: "City funnel", desc: "Chandigarh, Ludhiana, and Delhi house hubs linked." },
      { title: "House without broker", desc: "Broker-free national landing cross-linked." },
      { title: "Deposit checklist", desc: "Long-form guide sections on viewing safety." },
    ],
    faqs: [
      { q: "Are villas listed too?", a: "Yes — villas and independent houses are available under Property → Houses / Villas." },
      { q: "Which cities have house inventory?", a: "Chandigarh Tricity, Mohali, Ludhiana, and Delhi — see city cards below." },
      { q: "Can I compare houses in one budget?", a: "Pan the map, open pins for exact locality, then message multiple owners before visiting." },
    ],
    relatedLinks: [
      { label: "Houses in Chandigarh", href: appPath("/rentals/in/chandigarh/houses") },
      { label: "Houses in Mohali", href: appPath("/rentals/in/chandigarh/mohali/houses") },
      { label: "House without broker", href: appPath("/houses-without-broker") },
      { label: "Property without broker", href: appPath("/property-without-broker") },
    ],
  },
  "pg-for-rent": {
    slug: "pg-for-rent",
    title: "PG for Rent Near Colleges and IT Parks | RentalPins",
    description:
      "Find PG and hostel rentals near universities and office hubs with direct owner contact — CU, PAU, PEC, IT Park, and more.",
    h1: "PG and hostels for rent",
    intro:
      "Student and working-professional PG options mapped by locality — filter PG/Hostels on city hubs, use campus landings for CU and PAU, and message owners directly without broker fees on RentalPins.",
    benefits: [
      { title: "College proximity", desc: "Campus PG landings for CU, PAU, PEC, GNDEC, and LPU." },
      { title: "IT Park PG", desc: "Mohali Aerocity and IT Park inventory on the map." },
      { title: "Boys and girls PG", desc: "Confirm suitability with owners in first message." },
      { title: "Owner-direct", desc: "No brokerage to search or inquire." },
      { title: "PG near me", desc: "Location-based PG discovery linked." },
      { title: "Food-plan clarity", desc: "Compare meals, AC, and laundry costs upfront." },
    ],
    faqs: [
      { q: "Do you have boys and girls PG options?", a: "Yes — listings include both depending on owner preferences; confirm on WhatsApp." },
      { q: "Which campus pages exist?", a: "PG near CU, PAU, PEC, GNDEC, LPU, and CGC Landran — each links to live map inventory." },
      { q: "Can working professionals find PG near IT Park?", a: "Yes — filter Mohali map pins near IT Park and Aerocity." },
      { q: "How is PG pricing structured?", a: "Ask about meals, AC surcharges, and laundry in the first owner message." },
    ],
    relatedLinks: [
      { label: "PG near Chandigarh University", href: appPath("/pg-near-chandigarh-university") },
      { label: "PG near PAU", href: appPath("/pg-near-pau") },
      { label: "PG near me", href: appPath("/pg-near-me") },
      { label: "Rent without broker", href: appPath("/rent-without-broker") },
    ],
  },
  "shops-for-rent": {
    slug: "shops-for-rent",
    title: "Shops for Rent | Retail Space Without Broker",
    description:
      "Find retail shops and showrooms for rent in high-footfall zones across Chandigarh, Ludhiana, Delhi, and live Indian cities.",
    h1: "Shops and retail space for rent",
    intro:
      "Commercial shop and showroom rentals with area-level map visibility — filter retail commercial categories, compare footfall corridors, and contact owners directly on RentalPins.",
    benefits: [
      { title: "Commercial filters", desc: "Shop and showroom categories with map pin discovery." },
      { title: "Footfall context", desc: "Compare market streets before site visits." },
      { title: "Owner-direct", desc: "Negotiate rent and deposit with listing owners." },
      { title: "Commercial hub", desc: "Commercial-property-for-rent cross-linked." },
      { title: "Shops near me", desc: "Viewport search for nearby retail pins." },
      { title: "Visit checklist", desc: "Corner visibility and parking tips in guide sections." },
    ],
    faqs: [
      { q: "Can I find showroom space too?", a: "Yes — showroom listings are included under Property commercial sub-categories." },
      { q: "Which cities have retail inventory?", a: "Chandigarh Tricity, Ludhiana, and Delhi — pan city commercial maps." },
      { q: "Does RentalPins charge brokerage?", a: "No tenant search commission — contact owners from pins." },
    ],
    relatedLinks: [
      { label: "Commercial property", href: appPath("/commercial-property-for-rent") },
      { label: "Offices for rent", href: appPath("/offices-for-rent") },
      { label: "Shops near me", href: appPath("/shops-near-me") },
    ],
  },
  "offices-for-rent": {
    slug: "offices-for-rent",
    title: "Offices for Rent and Co-working Spaces | RentalPins",
    description:
      "Find office space and co-working rentals in Mohali IT Park, Chandigarh, Delhi, and live hubs with direct owner contact.",
    h1: "Office space for rent",
    intro:
      "Compare office and co-working options by location and access on the RentalPins map — filter commercial office categories, shortlist near IT Park or metro corridors, and message owners on WhatsApp.",
    benefits: [
      { title: "Business location fit", desc: "Choose based on commute, market access, and visibility." },
      { title: "Co-working desks", desc: "Small offices and co-working in one filter set." },
      { title: "Mohali IT Park", desc: "SAS Nagar office inventory linked." },
      { title: "Owner-direct", desc: "Skip broker middlemen on commercial search." },
      { title: "Offices near me", desc: "Location-based office discovery linked." },
      { title: "Parking + internet", desc: "Confirm specs with owners before token." },
    ],
    faqs: [
      { q: "Do you list co-working desks?", a: "Yes — co-working spaces are listed in office commercial categories." },
      { q: "Can startups search near Mohali IT Park?", a: "Yes — pan the Mohali map or use Mohali area commercial filters." },
      { q: "What should I confirm before leasing?", a: "Parking ratios, internet readiness, CAM, and society NOC with the owner." },
    ],
    relatedLinks: [
      { label: "Shops for rent", href: appPath("/shops-for-rent") },
      { label: "Mohali rentals", href: appPath("/rentals/in/chandigarh/mohali") },
      { label: "Offices near me", href: appPath("/offices-near-me") },
    ],
  },
  "warehouse-for-rent": {
    slug: "warehouse-for-rent",
    title: "Warehouse for Rent in India | RentalPins",
    description:
      "Find warehouses and storage spaces for rent in Ludhiana Focal Point, Tricity corridors, and industrial belts — owner-direct map search.",
    h1: "Warehouse for rent",
    intro:
      "Map-first industrial inventory for storage and logistics — browse warehouse, godown, and factory pins in Ludhiana, Mohali, Chandigarh region, and other live belts with direct owner contact on RentalPins.",
    benefits: [
      { title: "Industrial micro-markets", desc: "Explore proximity to highways, mandis, and freight hubs." },
      { title: "Owner-direct", desc: "Message warehouse owners on WhatsApp from map pins." },
      { title: "Ludhiana Focal Point", desc: "Dedicated warehouse landings for Punjab logistics belts." },
      { title: "Tricity corridors", desc: "Mohali and Chandigarh region storage inventory linked." },
      { title: "Site visit checklist", desc: "Long-form tips on ceiling height, loading, and deposits." },
      { title: "Godown + factory", desc: "Related industrial categories on the same map." },
    ],
    faqs: [
      { q: "Do you list godowns too?", a: "Yes, godown and warehouse listings are included under commercial industrial filters." },
      { q: "Which cities have warehouse inventory?", a: "Ludhiana Focal Point, Mohali, and Tricity corridors — see city industrial landings." },
      { q: "Are listings from owners?", a: "RentalPins is owner-direct focused — confirm specs with the listing owner before token." },
      { q: "Can I search warehouses near me?", a: "Yes — use warehouses-near-me or pan the map to your logistics anchor." },
    ],
    relatedLinks: [
      { label: "Warehouse Ludhiana", href: appPath("/warehouse-for-rent-ludhiana") },
      { label: "Warehouse Mohali", href: appPath("/warehouse-mohali") },
      { label: "Godown for rent", href: appPath("/godown-for-rent") },
      { label: "Industrial property", href: appPath("/industrial-property-for-rent") },
    ],
  },
  "factory-shed-for-rent": {
    slug: "factory-shed-for-rent",
    title: "Factory Shed for Rent | Industrial Leasing",
    description:
      "Browse factory sheds and industrial units for rent in Ludhiana Focal Point and Tricity belts with direct owner map search.",
    h1: "Factory shed for rent",
    intro:
      "Industrial supply for manufacturing and light processing — filter factory and shed commercial categories on Ludhiana and Tricity maps, confirm power load with owners, and skip broker fees on RentalPins.",
    benefits: [
      { title: "Industrial focus", desc: "Factory sheds, warehouses, and industrial inventory on one map." },
      { title: "Focal Point belt", desc: "Ludhiana logistics corridor pins linked." },
      { title: "Owner-direct", desc: "WhatsApp industrial owners from listing detail." },
      { title: "Site checklist", desc: "Floor load, shutter, and truck access tips." },
      { title: "Warehouse crossover", desc: "Storage units filtered separately when needed." },
      { title: "National industrial", desc: "Industrial-property-for-rent hub linked." },
    ],
    faqs: [
      { q: "Are heavy-use units available?", a: "Listings vary by belt — confirm floor load and power with owners on visit." },
      { q: "Which areas have factory sheds?", a: "Ludhiana Focal Point and Tricity industrial corridors — see city industrial landings." },
      { q: "Are listings owner-posted?", a: "RentalPins is owner-direct focused — message from map pins." },
    ],
    relatedLinks: [
      { label: "Industrial property", href: appPath("/industrial-property-for-rent") },
      { label: "Factory shed Ludhiana", href: appPath("/factory-shed-for-rent-ludhiana") },
      { label: "Warehouse for rent", href: appPath("/warehouse-for-rent") },
    ],
  },
  "commercial-property-for-rent": {
    slug: "commercial-property-for-rent",
    title: "Commercial Property for Rent | Offices, Shops, Warehouses",
    description:
      "Commercial rentals across shops, offices, warehouses, and industrial spaces with owner-direct map search in live Indian hubs.",
    h1: "Commercial property for rent",
    intro:
      "One hub for retail, office, warehouse, and industrial rental discovery — filter commercial sub-categories on city maps without mixing residential pins, then contact owners directly on RentalPins.",
    benefits: [
      { title: "Multiple commercial types", desc: "Shops, offices, co-working, warehouse, industrial units." },
      { title: "Category separation", desc: "Avoid residential noise with commercial filters." },
      { title: "Owner-direct", desc: "Negotiate CAM and deposit with listing owners." },
      { title: "City commercial belts", desc: "Tricity, Ludhiana, and Delhi maps linked." },
      { title: "Near-me commercial", desc: "Shops and offices near-me landings linked." },
      { title: "Industrial crossover", desc: "Warehouse and factory landings cross-linked." },
    ],
    faqs: [
      { q: "Can I compare different commercial types?", a: "Yes — use category and map filters; cross-link dedicated shop, office, and warehouse pages." },
      { q: "Does RentalPins list co-working?", a: "Yes — under office commercial categories on the map." },
      { q: "Which cities are strongest?", a: "Chandigarh Tricity, Ludhiana, and Delhi for commercial pin density." },
    ],
    relatedLinks: [
      { label: "Offices for rent", href: appPath("/offices-for-rent") },
      { label: "Shops for rent", href: appPath("/shops-for-rent") },
      { label: "Warehouse for rent", href: appPath("/warehouse-for-rent") },
    ],
  },
  "vehicles-for-rent": {
    slug: "vehicles-for-rent",
    title: "Vehicles for Rent | Cars, Bikes and Utility Rentals",
    description:
      "Find cars, bikes, and utility vehicle rentals directly from owners in Tricity, Ludhiana, Delhi, and live RentalPins cities.",
    h1: "Vehicles for rent",
    intro:
      "Non-property rentals are core to RentalPins — filter Vehicles for cars, bikes, and scooters on the city map, pair mobility with PG or flat search, and contact owners directly without broker fees.",
    benefits: [
      { title: "Short and long duration", desc: "Vehicle options for personal and business use." },
      { title: "Separate from property", desc: "Vehicle pins do not mix with housing filters." },
      { title: "Student mobility", desc: "Bike rentals near CU and PAU belts on the map." },
      { title: "Owner-direct", desc: "WhatsApp vehicle owners from listing pins." },
      { title: "Licence clarity", desc: "Confirm requirements in first message." },
      { title: "Equipment linked", desc: "Heavy gear rentals on same platform." },
    ],
    faqs: [
      { q: "Do you support bike and car rentals both?", a: "Yes — both are available under Vehicles category filters." },
      { q: "Can I rent a bike while PG hunting?", a: "Yes — filter property and vehicles on the same city map." },
      { q: "What should I confirm before hire?", a: "Licence rules, deposit refund, fuel policy, and insurance with the owner." },
    ],
    relatedLinks: [
      { label: "Equipment for rent", href: appPath("/equipment-for-rent") },
      { label: "PG for rent", href: appPath("/pg-for-rent") },
      { label: "Open map", href: appPath("/search") },
    ],
  },
  "equipment-for-rent": {
    slug: "equipment-for-rent",
    title: "Equipment for Rent | Machinery, Construction, Event Gear",
    description:
      "Find construction equipment, heavy machinery, furniture, and event gear rentals on the RentalPins map with owner-direct contact.",
    h1: "Equipment and machinery for rent",
    intro:
      "Industrial and project teams source JCBs, scaffolding, event gear, and furniture through map-based discovery — filter equipment categories separately from property, confirm operator terms with owners on RentalPins.",
    benefits: [
      { title: "Multi-vertical inventory", desc: "Construction, heavy machinery, event, and furniture equipment." },
      { title: "Industrial belts", desc: "Landran and Ludhiana equipment pins linked." },
      { title: "Owner-direct", desc: "Message equipment owners on WhatsApp." },
      { title: "Project planning", desc: "Pair with factory shed and warehouse search." },
      { title: "Spec clarity", desc: "Operator and transport terms in guide sections." },
      { title: "Vehicles linked", desc: "Mobility rentals on same platform." },
    ],
    faqs: [
      { q: "Is construction equipment listed?", a: "Yes — under Construction Equipment and Heavy Machinery categories." },
      { q: "Does equipment mix with flat search?", a: "No — filter equipment categories separately from Property on the map." },
      { q: "What should I verify before hire?", a: "Operator requirements, site transport, deposit, and maintenance terms with the owner." },
    ],
    relatedLinks: [
      { label: "Factory shed for rent", href: appPath("/factory-shed-for-rent") },
      { label: "Vehicles for rent", href: appPath("/vehicles-for-rent") },
      { label: "Industrial property", href: appPath("/industrial-property-for-rent") },
    ],
  },
};

export const STUDENT_RENTAL_PAGES: Record<string, MarketingPageConfig> = {
  "pg-near-chandigarh-university": {
    slug: "pg-near-chandigarh-university",
    title: "PG Near Chandigarh University — Map Search, List PG Free | RentalPins",
    description:
      "PG and hostels near Chandigarh University in Kharar — browse owner pins on the map or list your PG free. No broker search fee for students.",
    h1: "PG near Chandigarh University",
    intro:
      "Explore boys PG, girls PG, shared rooms, and student flats around CU on the Kharar map — compare Kharar town, Kharar–Landran road, and Sunny Enclave pins with direct owner contact on RentalPins.",
    benefits: [
      { title: "Campus-local map", desc: "Compare CU-belt PG clusters by rent, food plan, and walk time." },
      { title: "No broker search fee", desc: "Message PG owners on WhatsApp from listing pins." },
      { title: "Kharar area hub", desc: "Live PG inventory with links to the Kharar money-page rental guide." },
      { title: "Session alerts", desc: "Save map searches before CU intake weeks." },
      { title: "Blog: Kharar PG guide", desc: "Campus PG tips link back to live map inventory." },
      { title: "Shared flats option", desc: "Compare managed PG with group flats on the same map." },
    ],
    faqs: [
      { q: "Can I find shared rooms near CU?", a: "Yes — room and PG inventory includes shared options on the Kharar map." },
      { q: "Are girls PG options available?", a: "Yes, depending on listing availability and owner preference — confirm in your first message." },
      { q: "Does RentalPins charge brokerage for PG search?", a: "No — browse and contact owners directly from map pins." },
      { q: "Which areas are closest to CU?", a: "Kharar town, Kharar–Landran road, Sunny Enclave, and Gillco Valley — see the Kharar area page." },
    ],
    relatedLinks: [
      { label: "Rentals near CU", href: appPath("/rentals/chandigarh-university") },
      { label: "Kharar near CU", href: appPath("/rentals/kharar/chandigarh-university") },
      { label: "Kharar area hub", href: appPath("/rentals/kharar") },
      { label: "Mohali Phase 7", href: appPath("/rentals/mohali/phase-7") },
      { label: "PG for rent India", href: appPath("/pg-for-rent") },
    ],
  },
  "pg-near-cgc-landran": {
    slug: "pg-near-cgc-landran",
    title: "PG Near CGC Landran | RentalPins",
    description:
      "Student PG and flats near CGC Landran on the Kharar–Landran corridor — owner listings with map-first search.",
    h1: "PG near CGC Landran",
    intro:
      "Find boys PG, girls PG, and student flats near CGC Landran, IKGPTU, and Landran college belts — browse owner-posted inventory on the Landran and Kharar maps without broker commission on RentalPins.",
    benefits: [
      { title: "College-belt map", desc: "PG pins along Kharar–Landran road and Landran town." },
      { title: "Owner-direct", desc: "WhatsApp owners from listing detail without broker unlock fees." },
      { title: "Landran area context", desc: "Linked Tricity area pages with live PG filters." },
      { title: "Group flat option", desc: "Compare PG with shared flats for batchmate groups." },
      { title: "Session timing tips", desc: "Long-form guide sections for admission-week search." },
      { title: "Vehicle rentals", desc: "Pair PG pins with bike rentals on the same map." },
      { title: "Flats and hostel links", desc: "Cross-compare flats, hostels, and PG on linked CGC campus pages before session deposit." },
      { title: "List PG free", desc: "Owners and PG operators post at no listing fee and receive direct student inquiries on the map." },
    ],
    faqs: [
      { q: "Are girls PG options available near CGC?", a: "Yes, depending on listing availability and owner preference." },
      { q: "Does RentalPins cover Landran and Kharar?", a: "Yes — both area maps share Tricity PG inventory relevant to CGC students." },
      { q: "Can I find hostels as well as PG?", a: "Yes — filter PG/Hostels on the map for both managed PG and hostel-style listings." },
      { q: "How do I avoid broker duplicates?", a: "Message owners from RentalPins pins — broker reposts of owner PG photos are common near Landran colleges." },
      { q: "Where do CGC students compare PG, flats, and hostels?", a: "Use linked flats near CGC, hostel near CGC, and student accommodation pages alongside this PG landing on the same Kharar map." },
    ],
    relatedLinks: [
      { label: "Kharar area hub", href: appPath("/rentals/in/chandigarh/kharar") },
      { label: "Chandigarh Tricity hub", href: appPath(rentalCityPath("in", "chandigarh")) },
      { label: "PG for rent", href: appPath("/pg-for-rent") },
      { label: "PG near CU", href: appPath("/pg-near-chandigarh-university") },
      { label: "Flats near CGC", href: appPath("/flats-near-cgc-landran") },
      { label: "Hostel near CGC", href: appPath("/hostel-near-cgc-landran") },
      { label: "Student accommodation", href: appPath("/student-accommodation-near-cgc-landran") },
    ],
  },
  "flats-near-cgc-landran": {
    slug: "flats-near-cgc-landran",
    title: "Flats Near CGC Landran — Student Rentals | RentalPins",
    description:
      "Find flats and shared apartments near CGC Landran on the Kharar–Landran corridor. Browse owner map listings and list your flat free on RentalPins.",
    h1: "Flats near CGC Landran",
    intro:
      "Groups of CGC, IKGPTU, and Landran college students often prefer shared 2–3 BHK flats over managed PG rules. Compare owner-listed flats along Kharar–Landran road and Landran town on the RentalPins map — filter by budget, contact owners directly, and list your flat free if you are a landlord.",
    benefits: [
      { title: "Group-friendly flats", desc: "2–3 BHK options for batchmate groups splitting rent." },
      { title: "Map distance check", desc: "See how far each flat sits from CGC before visiting." },
      { title: "Owner-direct", desc: "Message owners on WhatsApp without broker search fees." },
      { title: "PG alternative", desc: "Compare flats with PG near CGC on the same map." },
      { title: "Kharar corridor", desc: "Linked to Kharar and Landran area rental hubs." },
      { title: "List your flat", desc: "Owners post free and reach student renters on the map." },
      { title: "Furnishing clarity", desc: "Confirm appliances and Wi‑Fi with owners before token." },
      { title: "Deposit checklist", desc: "Agree notice period and refund rules in writing on WhatsApp." },
    ],
    faqs: [
      { q: "Are furnished flats available near CGC Landran?", a: "Yes — many owner listings include basic furnishing. Confirm appliances and Wi‑Fi with the owner before token." },
      { q: "How many students typically share a flat?", a: "Most groups take 2–3 BHK with two to four occupants. Agree on rent split and house rules before signing." },
      { q: "Is PG or flat better near CGC?", a: "PG suits first-year students who want meals and fixed costs. Flats suit groups who cook together and want more privacy." },
      { q: "Can I list my flat near CGC for free?", a: "Yes — owners post on RentalPins at no listing fee in supported cities and receive direct tenant inquiries." },
    ],
    relatedLinks: [
      { label: "PG near CGC Landran", href: appPath("/pg-near-cgc-landran") },
      { label: "Hostel near CGC", href: appPath("/hostel-near-cgc-landran") },
      { label: "Student accommodation guide", href: appPath("/student-accommodation-near-cgc-landran") },
      { label: "Kharar rentals", href: appPath("/rentals/in/chandigarh/kharar") },
    ],
  },
  "hostel-near-cgc-landran": {
    slug: "hostel-near-cgc-landran",
    title: "Hostel Near CGC Landran — Student Housing | RentalPins",
    description:
      "Find hostels and managed student housing near CGC Landran. Map-based owner listings with direct contact on RentalPins.",
    h1: "Hostel near CGC Landran",
    intro:
      "Hostels and managed student housing along the Kharar–Landran belt serve CGC, IKGPTU, and nearby institutes. Browse PG/Hostel filters on the map, compare food plans, curfew rules, and room sharing with other students, then contact owners directly — or list your hostel beds free on RentalPins if you operate student housing near the college corridor.",
    benefits: [
      { title: "Campus-belt hostels", desc: "Inventory along Kharar–Landran road and Landran town." },
      { title: "Managed housing", desc: "Warden-run hostels alongside owner PG listings." },
      { title: "Food-plan compare", desc: "Ask owners about meals, curfew, and laundry upfront." },
      { title: "Direct contact", desc: "No brokerage to browse or inquire on RentalPins." },
      { title: "PG cross-link", desc: "Compare hostel with PG near CGC options." },
      { title: "List hostel beds", desc: "Operators post free and reach students on the map." },
      { title: "Curfew clarity", desc: "Confirm warden rules and guest policy before deposit." },
      { title: "Mess quality", desc: "Taste food on visit — hostel meals vary sharply near colleges." },
    ],
    faqs: [
      { q: "What is the difference between hostel and PG near CGC?", a: "Hostels often have stricter rules and batch-style management. PG may offer more flexible sharing and meal plans — confirm with each owner." },
      { q: "Are girls hostels listed near CGC?", a: "Yes — depending on live inventory. Filter PG/Hostels on the map and confirm suitability in your first message." },
      { q: "When should CGC students book hostel rooms?", a: "Start two to four weeks before session intake. Peak weeks fill popular corridors quickly." },
      { q: "How do I avoid broker duplicates?", a: "Shortlist on RentalPins and message owners from listing pins — broker reposts are common near college belts." },
      { q: "Can hostel operators list beds for free?", a: "Yes — hostel and PG operators post on RentalPins at no listing fee in supported cities and receive direct student inquiries from map search." },
    ],
    relatedLinks: [
      { label: "PG near CGC Landran", href: appPath("/pg-near-cgc-landran") },
      { label: "Flats near CGC", href: appPath("/flats-near-cgc-landran") },
      { label: "Student accommodation", href: appPath("/student-accommodation-near-cgc-landran") },
      { label: "Kharar area hub", href: appPath("/rentals/in/chandigarh/kharar") },
    ],
  },
  "student-accommodation-near-cgc-landran": {
    slug: "student-accommodation-near-cgc-landran",
    title: "Student Accommodation Near CGC Landran | RentalPins",
    description:
      "Compare PG, hostels, and shared flats near CGC Landran. Map-first student housing search with owner-direct contact on RentalPins.",
    h1: "Student accommodation near CGC Landran",
    intro:
      "CGC Landran students choose between PG, hostels, and shared flats depending on budget, food preferences, and roommate plans. RentalPins maps owner-posted inventory across the Kharar–Landran corridor so you compare options by location before visiting — owners can list PG, hostel beds, or flats free. Use linked campus pages below to compare PG near CGC, flats for groups, and hostel rules before session deposit.",
    benefits: [
      { title: "All student types", desc: "PG, hostel, room, and shared flat filters on one map." },
      { title: "Corridor context", desc: "Kharar–Landran road and adjoining sectors on the map." },
      { title: "Owner-direct", desc: "WhatsApp owners without broker search commission." },
      { title: "Compare before paying", desc: "Shortlist three pins and visit in daylight." },
      { title: "Linked campus pages", desc: "PG, flat, and hostel guides cross-linked." },
      { title: "Free owner listings", desc: "Landlords and PG operators post at no search fee to tenants." },
      { title: "Parent-friendly search", desc: "Shortlist map pins remotely before a single visit trip." },
      { title: "CGC cross-links", desc: "PG, flat, and hostel campus pages interlinked for comparison." },
    ],
    faqs: [
      { q: "What student accommodation is common near CGC?", a: "PG and hostels dominate the Kharar–Landran belt. Groups of friends often take shared flats in Kharar town or Landran sectors." },
      { q: "How far is CGC from Kharar town?", a: "Most students commute by auto or college bus from Kharar–Landran road corridors. Use map pins to judge walk or ride time before booking." },
      { q: "Can parents search accommodation remotely?", a: "Yes — shortlist pins on RentalPins, confirm photos and rules on video call, then visit before paying deposit." },
      { q: "Can I list student housing near CGC?", a: "Yes — PG owners, hostel operators, and flat landlords list free on RentalPins in live cities." },
      { q: "Should I compare PG, hostel, and flat on one map?", a: "Yes — filter each category on the Kharar map, shortlist three pins per type, then decide based on total monthly cost and house rules." },
    ],
    relatedLinks: [
      { label: "PG near CGC Landran", href: appPath("/pg-near-cgc-landran") },
      { label: "Flats near CGC", href: appPath("/flats-near-cgc-landran") },
      { label: "Hostel near CGC", href: appPath("/hostel-near-cgc-landran") },
      { label: "PG near Chandigarh University", href: appPath("/pg-near-chandigarh-university") },
    ],
  },
  "pg-near-pec": {
    slug: "pg-near-pec",
    title: "PG Near PEC Chandigarh | RentalPins",
    description:
      "PG and student accommodation near PEC Chandigarh — sector-wise map search with direct owner contact.",
    h1: "PG near PEC",
    intro:
      "Compare PG, rooms, and shared flats near PEC on the Chandigarh hub map — pan toward student sectors, filter PG/Hostels, and contact owners directly without brokerage on RentalPins.",
    benefits: [
      { title: "Sector-wise PG search", desc: "Map pins near PEC and Panjab University belts." },
      { title: "Direct owner contact", desc: "No middleman for student accommodation discovery." },
      { title: "PG vs flat guides", desc: "Blog tips for Chandigarh student housing decisions." },
      { title: "Tricity rental guide", desc: "Chandigarh money-page context for deposits and sectors." },
      { title: "Save searches", desc: "Monitor new PG posts before semester peaks." },
      { title: "Shared flat groups", desc: "Batchmate flats alongside managed PG on one map." },
    ],
    faqs: [
      { q: "Can I save searches for PG near PEC?", a: "Yes — save map searches and review new owner matches on RentalPins." },
      { q: "Are furnished rooms listed?", a: "Yes — filter furnishing tags and confirm appliance condition with owners before token." },
      { q: "Does RentalPins cover Mohali PG for PEC students?", a: "Yes — compare Chandigarh sectors and Mohali phases on linked Tricity maps when commute allows." },
      { q: "How is PG pricing structured near PEC?", a: "Confirm meals, AC, laundry, and Wi‑Fi in the first owner message — headline rent often excludes utilities." },
    ],
    relatedLinks: [
      { label: "Chandigarh rentals", href: appPath(rentalCityPath("in", "chandigarh")) },
      { label: "Tricity rental guide", href: appPath(`${rentalCityPath("in", "chandigarh")}#city-seo-content-heading`) },
      { label: "PG for rent", href: appPath("/pg-for-rent") },
      { label: "PG near CU", href: appPath("/pg-near-chandigarh-university") },
    ],
  },
  "pg-near-pau": {
    slug: "pg-near-pau",
    title: "PG Near PAU Ludhiana | RentalPins",
    description:
      "Student PG and flats near Punjab Agricultural University Ludhiana — owner-direct map search without broker fees.",
    h1: "PG near PAU",
    intro:
      "Accommodation options near Punjab Agricultural University on the Ludhiana map — filter PG/Hostels, compare university-belt pins, and message owners on WhatsApp without brokerage commission on RentalPins.",
    benefits: [
      { title: "PAU-belt map search", desc: "Discover nearby PG clusters with locality-level pins." },
      { title: "Owner-direct PG", desc: "Skip broker unlock fees on student inventory." },
      { title: "Ludhiana rental guide", desc: "Money-page context for deposits and transport." },
      { title: "Room-finding blog", desc: "Ludhiana tips link back to live PG pins." },
      { title: "Family flats too", desc: "Separate filters for flats when groups outgrow PG." },
      { title: "Session alerts", desc: "Save searches before PAU admission peaks." },
    ],
    faqs: [
      { q: "Do you have family rentals too near PAU?", a: "Yes — use flats and houses category filters on the Ludhiana map for family options." },
      { q: "Are boys and girls PG both listed?", a: "Yes — owners specify suitability in listing text; confirm in your first WhatsApp." },
      { q: "Which Ludhiana areas suit PAU students?", a: "Pan the Ludhiana map toward university belts and compare commute on pins before visiting." },
      { q: "Does RentalPins charge tenants brokerage?", a: "No search commission — contact owners from listing pins." },
    ],
    relatedLinks: [
      { label: "Ludhiana rentals", href: appPath(rentalCityPath("in", "ludhiana")) },
      { label: "Ludhiana rental guide", href: appPath(`${rentalCityPath("in", "ludhiana")}#city-seo-content-heading`) },
      { label: "PG for rent", href: appPath("/pg-for-rent") },
      { label: "PG near GNDEC", href: appPath("/pg-near-gndec") },
    ],
  },
  "pg-near-gndec": {
    slug: "pg-near-gndec",
    title: "PG Near GNDEC | RentalPins",
    description:
      "PG and room rentals near GNDEC Ludhiana with locality-level map filtering and direct owner contact.",
    h1: "PG near GNDEC",
    intro:
      "Find boys and girls PG, hostels, and shared rooms near GNDEC on the Ludhiana map — compare college-adjacent pins, confirm food plans with owners, and skip broker fees on RentalPins.",
    benefits: [
      { title: "GNDEC-focused search", desc: "PG/Hostels filters on the Ludhiana hub map." },
      { title: "Student categories", desc: "Rooms, PG, and shared flats in one inventory pool." },
      { title: "Locality map pins", desc: "Compare commute before paying session deposit." },
      { title: "Ludhiana guides", desc: "Money-page and blog tips link to live PG inventory." },
      { title: "Group flats", desc: "Batchmate shared flats alongside managed PG." },
      { title: "No broker layer", desc: "Owner WhatsApp leads from listing detail." },
    ],
    faqs: [
      { q: "Is there map search for areas near GNDEC?", a: "Yes — use the Ludhiana map with PG/Hostels filters and pan toward college belts." },
      { q: "Can I find single rooms as well as PG?", a: "Yes — room and PG categories cover both on the same map." },
      { q: "How do I compare PG total cost?", a: "Ask owners about meals, AC, laundry, and electricity in the first message — utilities often sit outside headline rent." },
      { q: "Are listings direct from owners?", a: "RentalPins is owner-direct focused — message from map pins rather than broker intermediaries." },
    ],
    relatedLinks: [
      { label: "Ludhiana rentals", href: appPath(rentalCityPath("in", "ludhiana")) },
      { label: "Ludhiana rental guide", href: appPath(`${rentalCityPath("in", "ludhiana")}#city-seo-content-heading`) },
      { label: "PG near PAU", href: appPath("/pg-near-pau") },
      { label: "PG for rent", href: appPath("/pg-for-rent") },
    ],
  },
  "pg-near-lpu": {
    slug: "pg-near-lpu",
    title: "PG Near LPU | RentalPins",
    description:
      "Find PG and student rentals near Lovely Professional University — owner listings with map-first search.",
    h1: "PG near LPU",
    intro:
      "Student PG, hostel, and room listings near LPU in the Phagwara corridor — browse owner-posted inventory on the Ludhiana regional map and contact directly without broker commission on RentalPins.",
    benefits: [
      { title: "LPU-adjacent map", desc: "PG pins near Phagwara and off-campus belts." },
      { title: "No broker", desc: "Owner listings and direct WhatsApp conversation." },
      { title: "Hostels and PG", desc: "PG/Hostels category covers both inventory types." },
      { title: "Group housing", desc: "Shared flats for batchmate groups on the same map." },
      { title: "Regional guides", desc: "Ludhiana hub guides for deposit and search workflow." },
      { title: "Mobility planning", desc: "Pair PG with bike rentals on RentalPins." },
    ],
    faqs: [
      { q: "Are hostels and PG both listed near LPU?", a: "Yes — PG/Hostels category covers both depending on owner listings." },
      { q: "Which city hub covers LPU area?", a: "Use the Ludhiana regional map and pan toward LPU-adjacent pins — Phagwara inventory appears on the same platform." },
      { q: "Can parents shortlist PG before visiting?", a: "Yes — map-shortlist three pins, confirm food and security on visit, then message owners from RentalPins." },
      { q: "How do I avoid broker fees near LPU?", a: "Contact owners from listing pins — broker reposts of owner PG photos are common on external boards." },
    ],
    relatedLinks: [
      { label: "PG for rent", href: appPath("/pg-for-rent") },
      { label: "Ludhiana rentals", href: appPath(rentalCityPath("in", "ludhiana")) },
      { label: "PG near PAU", href: appPath("/pg-near-pau") },
      { label: "PG near GNDEC", href: appPath("/pg-near-gndec") },
    ],
  },
};

/** High-impression apartment search queries from GSC (June 2026). */
export const APARTMENT_SEARCH_PAGES: Record<string, MarketingPageConfig> = {
  "apartment-rental-listings": {
    slug: "apartment-rental-listings",
    title: "Apartment Rental Listings – Browse Flats, Apartments & Houses Near You",
    description:
      "Browse apartment rental listings on RentalPins map — compare flats and houses by location, budget, and owner contact. List your property free.",
    h1: "Apartment rental listings",
    intro:
      "Apartment rental listings on RentalPins are owner-posted map pins — not broker boards. Compare flats, apartments, and houses by neighbourhood, open listing details for photos and rent, then contact owners directly. Property owners can list apartments free to reach renters already searching by area.",
    benefits: [
      { title: "Map-first listings", desc: "See apartment pins by area before shortlisting visits." },
      { title: "Owner-direct contact", desc: "Message owners on WhatsApp from listing pages." },
      { title: "BHK and budget filters", desc: "Narrow apartment search on the live map." },
      { title: "City flat hubs", desc: "Drill into Mohali, Delhi, Ludhiana, and Jaipur flat pages." },
      { title: "No search brokerage", desc: "Browse apartment listings without tenant commission." },
      { title: "Free owner posts", desc: "Landlords list apartments at no listing fee in live cities." },
    ],
    faqs: [
      { q: "How do apartment rental listings work on RentalPins?", a: "Owners post pins on the map with photos, rent, and location. You browse, compare nearby listings, and contact owners directly." },
      { q: "Are apartment listings broker-free?", a: "Many are owner-direct. RentalPins connects you to the lister without a search commission." },
      { q: "Which cities have apartment listings?", a: "Chandigarh Tricity, Mohali, Delhi, Ludhiana, Jaipur, and other live city hubs on RentalPins." },
      { q: "Can I list my apartment for rent?", a: "Yes — owners post free on RentalPins and appear in map search for their area." },
    ],
    relatedLinks: [
      { label: "Flats in Mohali", href: appPath("/rentals/in/chandigarh/mohali/flats") },
      { label: "Flats in Delhi", href: appPath("/rentals/in/delhi/flats") },
      { label: "Flats in Ludhiana", href: appPath("/rentals/in/ludhiana/flats") },
      { label: "Flats in Jaipur", href: appPath("/rentals/in/jaipur/flats") },
      { label: "Where to find apartments", href: appPath("/where-to-find-apartments") },
      { label: "Flats for rent", href: appPath("/flats-for-rent") },
    ],
  },
  "where-to-find-apartments": {
    slug: "where-to-find-apartments",
    title: "Where to Find Apartments for Rent in 2026",
    description:
      "Learn where to find apartments for rent — search by map location, compare listings, inspect details, and contact owners directly on RentalPins.",
    h1: "Where to find apartments for rent",
    intro:
      "The best place to find apartments for rent is a map that shows real owner listings in your target neighbourhood — not endless broker duplicates. On RentalPins, start with your city hub, filter flats and apartments, compare pins by budget and BHK, read listing details, then contact owners before visiting. Landlords can list apartments free to appear in the same search.",
    benefits: [
      { title: "Search by location", desc: "Pan the map to your sector, phase, or locality first." },
      { title: "Compare before visiting", desc: "Shortlist three to five apartment pins on the map." },
      { title: "Inspect listing details", desc: "Photos, rent, furnishing, and owner contact on each page." },
      { title: "Contact owners directly", desc: "WhatsApp or call from the listing — no broker unlock fee." },
      { title: "City-specific guides", desc: "Mohali, Delhi, Ludhiana, and Jaipur flat hubs linked." },
      { title: "List your apartment", desc: "Owners post free and reach renters searching by area." },
    ],
    faqs: [
      { q: "Where should I start looking for apartments?", a: "Open RentalPins map search, set your city or neighbourhood, and filter Property → Flats/Apartments." },
      { q: "How do I avoid broker-heavy apartment boards?", a: "Use owner-posted map pins and contact listers directly from RentalPins listing pages." },
      { q: "What should I check before paying deposit?", a: "Visit in person, confirm furnishing and utilities, verify owner identity, and compare at least three listings." },
      { q: "Can apartment owners list for free?", a: "Yes — RentalPins supports free owner listings in live cities with map-based discovery." },
    ],
    relatedLinks: [
      { label: "Apartment rental listings", href: appPath("/apartment-rental-listings") },
      { label: "Flats in Mohali", href: appPath("/rentals/in/chandigarh/mohali/flats") },
      { label: "Flats in Delhi", href: appPath("/rentals/in/delhi/flats") },
      { label: "Flats in Ludhiana", href: appPath("/rentals/in/ludhiana/flats") },
      { label: "Flats in Jaipur", href: appPath("/rentals/in/jaipur/flats") },
      { label: "Browse map", href: appPath("/search") },
    ],
  },
};

export const NEAR_ME_PAGES: Record<string, MarketingPageConfig> = {
  "rentals-near-me": {
    slug: "rentals-near-me",
    title: "Rentals Near Me | RentalPins",
    description:
      "Find property, PG, vehicles, and commercial rentals near your location with map-first search on RentalPins.",
    h1: "Rentals near me",
    intro:
      "Allow location access or pan the map to your area — discover nearby owner listings for flats, PG, houses, shops, offices, and vehicles without broker search fees on RentalPins.",
    benefits: [
      { title: "Location-aware search", desc: "GPS or manual map pan with viewport filters." },
      { title: "All categories", desc: "Property, PG, commercial, and vehicles on one map." },
      { title: "Owner-direct", desc: "WhatsApp owners from nearby pins." },
      { title: "City hub fallback", desc: "Drill into Tricity, Ludhiana, or Delhi guides when GPS is off." },
      { title: "Save searches", desc: "Alerts when new pins appear near your anchor." },
      { title: "Web + Android", desc: "Same inventory on mobile when on the ground." },
    ],
    faqs: [
      { q: "Do I need location permission?", a: "Permission helps, but you can search manually by panning the map to your area." },
      { q: "Does near-me work in all cities?", a: "Coverage is deepest in Chandigarh Tricity, Ludhiana, and Delhi — other areas may need wider panning." },
      { q: "Is tenant search free?", a: "Yes — browse and contact owners without brokerage commission." },
      { q: "Can I filter by category near me?", a: "Yes — use Property, PG, commercial, and vehicle filters on the map." },
    ],
    relatedLinks: [
      { label: "Open map", href: appPath("/search") },
      { label: "Rent without broker", href: appPath("/rent-without-broker") },
      { label: "Flats near me", href: appPath("/flats-near-me") },
    ],
  },
  "flats-near-me": {
    slug: "flats-near-me",
    title: "Flats Near Me | RentalPins",
    description: "Find flats and apartments near your current location with owner-direct map search.",
    h1: "Flats near me",
    intro:
      "Map-based nearby flat search with BHK and budget filters — contact verified owners on WhatsApp from pins around your location without broker commission on RentalPins.",
    benefits: [
      { title: "BHK filters", desc: "1BHK, 2BHK, and furnishing tags on the map." },
      { title: "Quick shortlist", desc: "Compare nearby pins before visiting." },
      { title: "Owner contact", desc: "One-tap WhatsApp from listing detail." },
      { title: "National funnel", desc: "Flats-for-rent links into the same inventory." },
      { title: "City guides", desc: "Money-page context for Tricity and Ludhiana flats." },
      { title: "Save searches", desc: "Monitor new flat pins near your anchor." },
    ],
    faqs: [
      { q: "Can I filter by BHK?", a: "Yes — use BHK and budget filters on the map search page." },
      { q: "Are furnished flats included?", a: "Yes — filter furnishing and confirm appliance condition with owners." },
      { q: "How is this different from flats-for-rent?", a: "Flats-for-rent is India-wide entry; flats-near-me emphasizes GPS or viewport proximity." },
    ],
    relatedLinks: [
      { label: "Flats for rent", href: appPath("/flats-for-rent") },
      { label: "Open map", href: appPath("/search") },
      { label: "Flats without broker", href: appPath("/flats-without-broker") },
    ],
  },
  "pg-near-me": {
    slug: "pg-near-me",
    title: "PG Near Me | RentalPins",
    description: "Find PG and hostel options near your current location with map-first owner contact.",
    h1: "PG near me",
    intro:
      "Discover nearby student and working-professional PG inventory — filter PG/Hostels on the map around your campus or office and message owners directly on RentalPins.",
    benefits: [
      { title: "Nearby-first", desc: "PG clusters around GPS or map viewport." },
      { title: "Boys and girls PG", desc: "Confirm suitability with owners in first message." },
      { title: "Campus landings", desc: "CU, PAU, PEC, and LPU guides link to live pins." },
      { title: "No broker fees", desc: "Owner-direct WhatsApp contact." },
      { title: "Food-plan clarity", desc: "Compare meals, AC, and laundry costs upfront." },
      { title: "Session alerts", desc: "Save searches before intake weeks." },
    ],
    faqs: [
      { q: "Can I find boys and girls PG separately?", a: "Yes — listings mention suitability where available; confirm with owners." },
      { q: "Does near-me PG include hostels?", a: "Yes — PG/Hostels category covers both on the map." },
      { q: "Which campus pages exist?", a: "PG near CU, PAU, PEC, GNDEC, LPU, and CGC Landran — each links to live inventory." },
    ],
    relatedLinks: [
      { label: "PG for rent", href: appPath("/pg-for-rent") },
      { label: "PG near CU", href: appPath("/pg-near-chandigarh-university") },
      { label: "Open map", href: appPath("/search") },
    ],
  },
  "shops-near-me": {
    slug: "shops-near-me",
    title: "Shops Near Me for Rent | RentalPins",
    description: "Find retail shops and showroom spaces near your location with commercial map filters.",
    h1: "Shops near me",
    intro:
      "Map retail inventory in high-footfall localities near you — filter shop and showroom commercial categories, compare corner visibility on pins, and contact owners directly on RentalPins.",
    benefits: [
      { title: "Retail map pins", desc: "Shops and showrooms near your viewport." },
      { title: "Footfall context", desc: "Compare clusters before site visits." },
      { title: "Owner-direct", desc: "Negotiate rent and deposit with listing owners." },
      { title: "Commercial hub", desc: "Shops-for-rent national entry linked." },
      { title: "Offices nearby", desc: "Cross-filter offices and co-working on same map." },
      { title: "Visit checklist", desc: "Long-form tips on visibility and parking." },
    ],
    faqs: [
      { q: "Are showroom listings included?", a: "Yes — shops and showrooms are both covered under commercial filters." },
      { q: "Can I search manually without GPS?", a: "Yes — pan the map to your market street or sector." },
      { q: "Do you cover Ludhiana and Tricity retail?", a: "Yes — commercial pins appear on city hub maps in live markets." },
    ],
    relatedLinks: [
      { label: "Shops for rent", href: appPath("/shops-for-rent") },
      { label: "Commercial property", href: appPath("/commercial-property-for-rent") },
      { label: "Open map", href: appPath("/search") },
    ],
  },
  "offices-near-me": {
    slug: "offices-near-me",
    title: "Offices Near Me for Rent | RentalPins",
    description: "Find office and co-working spaces near your location with map-first commercial search.",
    h1: "Offices near me",
    intro:
      "Discover business spaces with map-first search and direct owner leads — filter office and co-working categories near your commute anchor and message owners on WhatsApp without broker fees.",
    benefits: [
      { title: "Commute-aware", desc: "Offices near metro, IT Park, or sector belts." },
      { title: "Co-working included", desc: "Desks and small offices on same map." },
      { title: "Owner leads", desc: "Direct WhatsApp from commercial pins." },
      { title: "Mohali IT Park", desc: "Linked guides for SAS Nagar office search." },
      { title: "Parking + internet", desc: "Confirm specs with owners before token." },
      { title: "Save searches", desc: "Track new office pins near your anchor." },
    ],
    faqs: [
      { q: "Is co-working included?", a: "Yes — co-working listings are part of office commercial inventory." },
      { q: "Can startups search near Mohali IT Park?", a: "Yes — pan the Mohali map or use offices-for-rent with area context." },
      { q: "Are commercial brokers required?", a: "RentalPins connects you with owners directly from listing pins." },
    ],
    relatedLinks: [
      { label: "Offices for rent", href: appPath("/offices-for-rent") },
      { label: "Mohali rentals", href: appPath("/rentals/in/chandigarh/mohali") },
      { label: "Open map", href: appPath("/search") },
    ],
  },
  "warehouses-near-me": {
    slug: "warehouses-near-me",
    title: "Warehouses Near Me | RentalPins",
    description: "Find nearby warehouses, godowns, and industrial storage with map-first owner contact.",
    h1: "Warehouses near me",
    intro:
      "Discover industrial inventory near logistics hubs and highways — filter warehouse and godown categories around your viewport, confirm loading access with owners, and skip broker fees on RentalPins.",
    benefits: [
      { title: "Industrial corridors", desc: "Map-based sourcing near Focal Point and Tricity belts." },
      { title: "Godowns included", desc: "Storage and warehouse categories together." },
      { title: "Site visit tips", desc: "Ceiling height and truck access checklist in guide sections." },
      { title: "Ludhiana hub", desc: "Warehouse Ludhiana landing linked." },
      { title: "Owner-direct", desc: "Message industrial owners from pins." },
      { title: "Factory sheds", desc: "Related industrial categories on same map." },
    ],
    faqs: [
      { q: "Are godowns listed too?", a: "Yes — godowns are included in warehouse and industrial inventory." },
      { q: "Can I find Focal Point warehouses?", a: "Yes — use warehouse-for-rent-ludhiana or pan the Ludhiana industrial map." },
      { q: "What should I verify on visit?", a: "Ceiling height, floor load, shutter count, power, and truck turnaround — confirm with owners." },
    ],
    relatedLinks: [
      { label: "Warehouse for rent", href: appPath("/warehouse-for-rent") },
      { label: "Warehouse Ludhiana", href: appPath("/warehouse-for-rent-ludhiana") },
      { label: "Open map", href: appPath("/search") },
    ],
  },
};

export const INDUSTRIAL_PAGES: Record<string, MarketingPageConfig> = {
  "godown-for-rent": {
    slug: "godown-for-rent",
    title: "Godown for Rent in India | RentalPins",
    description:
      "Find godown and storage rentals in Ludhiana trade zones and industrial belts — owner-direct map search.",
    h1: "Godown for rent",
    intro:
      "Storage-focused listings for traders and distributors — browse godown and small warehouse pins on the Ludhiana and Tricity maps with direct owner contact without broker fees on RentalPins.",
    benefits: [
      { title: "Storage-first", desc: "Godowns and small warehouses on one map." },
      { title: "Trade corridors", desc: "Mandi-adjacent and highway belts." },
      { title: "Owner-direct", desc: "WhatsApp owners from industrial pins." },
      { title: "Ludhiana focus", desc: "Focal Point and Pakhowal logistics context." },
      { title: "Warehouse hub", desc: "Cross-link to warehouse-for-rent national page." },
      { title: "Visit checklist", desc: "Loading, shutter, and security tips in guide sections." },
    ],
    faqs: [
      { q: "How is this different from warehouse pages?", a: "Godown pages focus on smaller storage and trade-oriented units." },
      { q: "Which cities have godown inventory?", a: "Ludhiana industrial belts and Tricity corridors — pan city maps to confirm." },
      { q: "Are listings owner-posted?", a: "RentalPins is owner-direct focused — confirm specs before token." },
    ],
    relatedLinks: [
      { label: "Warehouse for rent", href: appPath("/warehouse-for-rent") },
      { label: "Industrial property", href: appPath("/industrial-property-for-rent") },
      { label: "Ludhiana rentals", href: appPath(rentalCityPath("in", "ludhiana")) },
    ],
  },
  "industrial-property-for-rent": {
    slug: "industrial-property-for-rent",
    title: "Industrial Property for Rent | RentalPins",
    description:
      "Find industrial property, factory sheds, and warehouses for lease with owner-direct map search across live belts.",
    h1: "Industrial property for rent",
    intro:
      "Industrial leasing for manufacturing and logistics — warehouses, godowns, factory sheds, and commercial industrial units on the Ludhiana, Mohali, and Tricity maps with WhatsApp owner contact on RentalPins.",
    benefits: [
      { title: "Factory + warehouse", desc: "Mixed industrial inventory in one place." },
      { title: "Ludhiana belts", desc: "Focal Point and logistics corridor pins." },
      { title: "Tricity storage", desc: "Mohali and Chandigarh region linked." },
      { title: "Owner-direct", desc: "No mandatory broker layer on search." },
      { title: "Site specs", desc: "Ceiling height, power load, and loading tips." },
      { title: "National entry", desc: "Warehouse-for-rent funnel linked." },
    ],
    faqs: [
      { q: "Do you cover Ludhiana industrial belts?", a: "Yes — Ludhiana has dedicated industrial-focused pages and Focal Point map inventory." },
      { q: "Can I compare warehouse vs factory shed?", a: "Yes — filter categories on the map or use linked industrial landings." },
      { q: "Are heavy-use units available?", a: "Listings vary by belt — confirm floor load and power with owners on visit." },
    ],
    relatedLinks: [
      { label: "Factory shed for rent", href: appPath("/factory-shed-for-rent") },
      { label: "Warehouse Ludhiana", href: appPath("/warehouse-for-rent-ludhiana") },
      { label: "Warehouse Mohali", href: appPath("/warehouse-mohali") },
    ],
  },
  "warehouse-for-rent-ludhiana": {
    slug: "warehouse-for-rent-ludhiana",
    title: "Warehouse for Rent Ludhiana | RentalPins",
    description:
      "Warehouse rental in Ludhiana Focal Point and logistics belts — owner-direct map search with site visit tips.",
    h1: "Warehouse for rent in Ludhiana",
    intro:
      "Discover storage spaces in Focal Point, Pakhowal Road corridors, and Ludhiana industrial belts — browse owner-posted warehouse and godown pins with direct WhatsApp contact on RentalPins.",
    benefits: [
      { title: "Focal Point corridor", desc: "Logistics and freight-oriented pins." },
      { title: "Owner WhatsApp", desc: "Direct industrial owner contact." },
      { title: "Ludhiana guide", desc: "Money-page industrial context linked." },
      { title: "Factory sheds", desc: "Related manufacturing units on same map." },
      { title: "Site checklist", desc: "Truck access and ceiling height tips." },
      { title: "Godown crossover", desc: "Smaller storage units filtered separately." },
    ],
    faqs: [
      { q: "Can I find nearby factory units too?", a: "Yes — related industrial categories are linked on the Ludhiana map." },
      { q: "Which Ludhiana areas are industrial?", a: "Focal Point and surrounding logistics belts are common demand zones." },
      { q: "Are listings broker-free to search?", a: "Tenants browse and message owners without search commission on RentalPins." },
    ],
    relatedLinks: [
      { label: "Ludhiana rentals", href: appPath(rentalCityPath("in", "ludhiana")) },
      { label: "Ludhiana rental guide", href: appPath(`${rentalCityPath("in", "ludhiana")}#city-seo-content-heading`) },
      { label: "Industrial property Ludhiana", href: appPath("/industrial-property-ludhiana") },
    ],
  },
  "factory-shed-for-rent-ludhiana": {
    slug: "factory-shed-for-rent-ludhiana",
    title: "Factory Shed for Rent Ludhiana | RentalPins",
    description:
      "Factory shed and industrial unit rentals in Ludhiana Focal Point — owner listings with map-first search.",
    h1: "Factory shed for rent in Ludhiana",
    intro:
      "Industrial units for production and warehouse-linked operations in Ludhiana — filter factory and shed commercial pins on the Focal Point map and contact owners directly on RentalPins.",
    benefits: [
      { title: "Manufacturing focus", desc: "Light and medium industrial units." },
      { title: "Focal Point belt", desc: "Cluster shortlist on one corridor day." },
      { title: "Power + load specs", desc: "Confirm with owners before token." },
      { title: "Owner-direct", desc: "WhatsApp from industrial listing pins." },
      { title: "Warehouse crossover", desc: "Storage units on linked map filters." },
      { title: "Ludhiana hub", desc: "City industrial landing linked." },
    ],
    faqs: [
      { q: "Are listings direct from owners?", a: "RentalPins is owner-direct focused — message from map pins." },
      { q: "Can I use this for warehouse storage too?", a: "Some sheds suit storage — confirm height and loading with owners." },
      { q: "What areas in Ludhiana?", a: "Focal Point and adjacent industrial corridors — see Ludhiana money-page guide." },
    ],
    relatedLinks: [
      { label: "Industrial property Ludhiana", href: appPath("/industrial-property-ludhiana") },
      { label: "Warehouse Ludhiana", href: appPath("/warehouse-for-rent-ludhiana") },
      { label: "Ludhiana rentals", href: appPath(rentalCityPath("in", "ludhiana")) },
    ],
  },
  "industrial-property-ludhiana": {
    slug: "industrial-property-ludhiana",
    title: "Industrial Property Ludhiana | RentalPins",
    description:
      "Industrial rentals in Ludhiana — warehouses, factory sheds, and godowns with owner-direct map search.",
    h1: "Industrial property in Ludhiana",
    intro:
      "One hub for Ludhiana industrial leasing intent — warehouses, godowns, and factory sheds on the Focal Point map with long-form site visit tips and direct owner contact on RentalPins.",
    benefits: [
      { title: "Combined inventory", desc: "Warehouse, godown, and factory on one map." },
      { title: "Focal Point anchor", desc: "Logistics belt shortlisting workflow." },
      { title: "Ludhiana guide", desc: "Money-page industrial sections linked." },
      { title: "Owner-direct", desc: "Skip broker unlock on industrial search." },
      { title: "National funnels", desc: "Warehouse-for-rent entry linked." },
      { title: "Visit checklist", desc: "Deposit and spec tips in guide sections." },
    ],
    faqs: [
      { q: "Which Ludhiana areas are industrial?", a: "Focal Point and surrounding belts are common demand zones." },
      { q: "Do you list residential too?", a: "Yes — Ludhiana city hub covers flats, PG, and industrial separately." },
      { q: "Can traders find godowns here?", a: "Yes — godown-for-rent and warehouse pages cross-link." },
    ],
    relatedLinks: [
      { label: "Warehouse Ludhiana", href: appPath("/warehouse-for-rent-ludhiana") },
      { label: "Factory shed Ludhiana", href: appPath("/factory-shed-for-rent-ludhiana") },
      { label: "Ludhiana rental guide", href: appPath(`${rentalCityPath("in", "ludhiana")}#city-seo-content-heading`) },
    ],
  },
  "warehouse-chandigarh": {
    slug: "warehouse-chandigarh",
    title: "Warehouse Chandigarh | RentalPins",
    description:
      "Warehouse and industrial storage in Chandigarh region and Tricity corridors — owner-direct map search.",
    h1: "Warehouse in Chandigarh region",
    intro:
      "Industrial inventory around Chandigarh, Mohali, and Panchkula logistics belts — browse warehouse and storage pins on Tricity maps with direct owner WhatsApp contact on RentalPins.",
    benefits: [
      { title: "Tricity logistics", desc: "Regional storage and distribution pins." },
      { title: "Mohali linked", desc: "Cross-compare SAS Nagar industrial inventory." },
      { title: "Owner-direct", desc: "Message owners from map pins." },
      { title: "Commercial filters", desc: "Warehouse and godown categories separated." },
      { title: "Tricity guide", desc: "Chandigarh money-page context linked." },
      { title: "National warehouse", desc: "Warehouse-for-rent India entry linked." },
    ],
    faqs: [
      { q: "Do you include Mohali inventory?", a: "Yes — nearby industrial areas are linked via warehouse-mohali and area maps." },
      { q: "Is this only large warehouses?", a: "Godowns and smaller storage units appear under related commercial filters." },
      { q: "Are tenants charged brokerage?", a: "No search commission — contact owners from RentalPins pins." },
    ],
    relatedLinks: [
      { label: "Warehouse Mohali", href: appPath("/warehouse-mohali") },
      { label: "Chandigarh hub", href: appPath(rentalCityPath("in", "chandigarh")) },
      { label: "Warehouse for rent", href: appPath("/warehouse-for-rent") },
    ],
  },
  "warehouse-mohali": {
    slug: "warehouse-mohali",
    title: "Warehouse Mohali | RentalPins",
    description:
      "Warehouse and storage rentals in Mohali SAS Nagar industrial corridors — owner-direct map search.",
    h1: "Warehouse in Mohali",
    intro:
      "Storage and industrial leasing across the Mohali belt — filter warehouse and godown commercial pins near IT Park corridors and distribution routes with direct owner contact on RentalPins.",
    benefits: [
      { title: "SAS Nagar belts", desc: "Distribution and local logistics pins." },
      { title: "Tricity compare", desc: "Weigh Mohali vs Chandigarh region storage." },
      { title: "Owner WhatsApp", desc: "Direct leads from industrial listings." },
      { title: "IT Park proximity", desc: "Useful for businesses near Mohali offices." },
      { title: "Site checklist", desc: "Loading bay and power tips in guides." },
      { title: "Linked hubs", desc: "Mohali area and warehouse Chandigarh pages." },
    ],
    faqs: [
      { q: "Can I compare with Chandigarh areas?", a: "Yes — linked city pages help compare nearby Tricity options." },
      { q: "Do you list factory sheds?", a: "Yes — related industrial categories on the Mohali map." },
      { q: "How do I shortlist quickly?", a: "Pan the Mohali map, open three pins, confirm truck access on WhatsApp before visits." },
    ],
    relatedLinks: [
      { label: "Mohali area page", href: appPath("/rentals/in/chandigarh/mohali") },
      { label: "Warehouse Chandigarh", href: appPath("/warehouse-chandigarh") },
      { label: "Industrial property", href: appPath("/industrial-property-for-rent") },
    ],
  },
};

import { buildPageMetadata } from "@/lib/seo/metadata";
import type { Metadata } from "next";
import { appPath } from "@/lib/config";
import { rentalCityPath } from "@/lib/cities-config";

export interface MarketingPageConfig {
  slug: string;
  title: string;
  description: string;
  h1: string;
  intro: string;
  benefits: { title: string; desc: string }[];
  faqs: { q: string; a: string }[];
  relatedLinks: { label: string; href: string }[];
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
      "RentalPins is a map-first rental marketplace where owners list property and tenants browse live pins — no brokerage commission to search or contact.",
    benefits: [
      { title: "Zero search brokerage", desc: "Browse and message owners without paying a broker to unlock listings." },
      { title: "Map discovery", desc: "See price pins by neighbourhood — faster than scrolling classified feeds." },
      { title: "OTP-verified users", desc: "Phone-verified accounts reduce spam vs anonymous boards." },
      { title: "Free owner listings", desc: "Post rentals on web or Android in supported cities." },
    ],
    faqs: [
      { q: "Is RentalPins completely free for tenants?", a: "Browsing and contacting owners is free. Some owner activation plans may apply when publishing — see in-app terms." },
      { q: "How is this different from broker-led portals?", a: "Listings are posted by owners; you contact them directly rather than through an intermediary." },
    ],
    relatedLinks: [
      { label: "Flats without broker", href: appPath("/flats-without-broker") },
      { label: "Map search", href: appPath("/search") },
      { label: "Ludhiana rentals", href: appPath(rentalCityPath("in", "ludhiana")) },
      { label: "Chandigarh rentals", href: appPath(rentalCityPath("in", "chandigarh")) },
    ],
  },
  "flats-without-broker": {
    slug: "flats-without-broker",
    title: "Flats for Rent Without Broker | RentalPins",
    description:
      "Find apartments and flats for rent without broker commission. Map search across India with direct owner contact.",
    h1: "Flats & apartments for rent without broker",
    intro: "Filter Property → Apartments / Flats on the RentalPins map and contact verified owners instantly.",
    benefits: [
      { title: "1–3 BHK filters", desc: "Narrow by budget, BHK, and furnishing on the map." },
      { title: "Area hubs", desc: "City and locality pages for Ludhiana, Tricity, Delhi NCR, and more." },
      { title: "Save searches", desc: "Get alerts when new flats match your criteria." },
      { title: "WhatsApp leads", desc: "One-tap owner contact from listing detail." },
    ],
    faqs: [
      { q: "Can I rent a furnished flat without broker?", a: "Yes — use furnishing filters and contact owners listed on the map." },
    ],
    relatedLinks: [
      { label: "Rent without broker", href: appPath("/rent-without-broker") },
      { label: "Houses without broker", href: appPath("/house-for-rent-without-broker") },
      { label: "Browse map", href: appPath("/search") },
    ],
  },
  "house-for-rent-without-broker": {
    slug: "house-for-rent-without-broker",
    title: "House for Rent Without Broker | RentalPins",
    description:
      "Independent houses and villas for rent without brokerage. Owner listings on an interactive map.",
    h1: "House for rent without broker",
    intro: "Discover independent houses and villas posted by owners — compare locations on the map before visiting.",
    benefits: [
      { title: "Villa & house category", desc: "Property sub-filters for houses and villas." },
      { title: "Family-friendly zones", desc: "Explore city area guides for residential belts." },
      { title: "Direct negotiation", desc: "Speak with owners — no mandatory broker layer." },
      { title: "Same app inventory", desc: "Web and Android share one listing pool." },
    ],
    faqs: [
      { q: "Are villas listed without broker?", a: "Owners can list villas under Property; browse and contact them on RentalPins." },
    ],
    relatedLinks: [
      { label: "Flats without broker", href: appPath("/flats-without-broker") },
      { label: "Mohali property", href: appPath("/property-without-broker-mohali") },
    ],
  },
  "property-without-broker-ludhiana": {
    slug: "property-without-broker-ludhiana",
    title: "Property for Rent in Ludhiana Without Broker | RentalPins",
    description:
      "Rooms, flats, PG, shops and commercial property in Ludhiana — direct owner contact, no broker.",
    h1: "Ludhiana property for rent without broker",
    intro: "RentalPins Ludhiana hub covers Model Town, Sarabha Nagar, Focal Point, Pakhowal Road and more.",
    benefits: [
      { title: "Ludhiana area pages", desc: "Deep links for major localities with live listings." },
      { title: "Student & family PG", desc: "PG and room filters for university belts." },
      { title: "Commercial belts", desc: "Shops and warehouses on industrial corridors." },
      { title: "Free post", desc: "Owners list from web or app." },
    ],
    faqs: [
      { q: "Which Ludhiana areas are live?", a: "Model Town, Sarabha Nagar, Pakhowal Road, BRS Nagar, Focal Point and the city hub." },
    ],
    relatedLinks: [
      { label: "Ludhiana rentals hub", href: appPath(rentalCityPath("in", "ludhiana")) },
      { label: "Rent without broker", href: appPath("/rent-without-broker") },
    ],
  },
  "property-without-broker-chandigarh": {
    slug: "property-without-broker-chandigarh",
    title: "Chandigarh Tricity Property Without Broker | RentalPins",
    description:
      "Rent in Chandigarh, Mohali, Panchkula, Zirakpur without broker. Map-based owner listings.",
    h1: "Chandigarh Tricity — no broker rentals",
    intro: "Browse Tricity sectors, Mohali phases, and Panchkula belts on one map.",
    benefits: [
      { title: "Tricity coverage", desc: "Chandigarh, Mohali, Panchkula, Zirakpur, Kharar hubs." },
      { title: "IT Park & Aerocity", desc: "Popular zones for working professionals." },
      { title: "Sector-wise search", desc: "Pan the map to Sector 17, 22, 35 and more." },
      { title: "Owner-first", desc: "List and receive WhatsApp leads." },
    ],
    faqs: [
      { q: "Does RentalPins cover Mohali and Panchkula?", a: "Yes — dedicated area pages under the Chandigarh Tricity hub." },
    ],
    relatedLinks: [
      { label: "Chandigarh hub", href: appPath(rentalCityPath("in", "chandigarh")) },
      { label: "Mohali without broker", href: appPath("/property-without-broker-mohali") },
    ],
  },
  "property-without-broker-mohali": {
    slug: "property-without-broker-mohali",
    title: "Mohali Property for Rent Without Broker | RentalPins",
    description:
      "Flats, PG, and offices in Mohali Phase 7–11, IT Park, Aerocity — direct owner listings.",
    h1: "Mohali rentals without broker",
    intro: "Mohali area hub includes phases, IT Park, Aerocity, and student-friendly PG inventory.",
    benefits: [
      { title: "Phase-wise map", desc: "Find pins across Phase 7, 9, 11 and Aerocity." },
      { title: "PG near IT Park", desc: "Filter PG/Hostels for professionals and students." },
      { title: "Office & co-working", desc: "Commercial sub-categories for businesses." },
      { title: "Tricity commute", desc: "Compare Mohali vs Chandigarh pins on one map." },
    ],
    faqs: [
      { q: "Best Mohali areas on RentalPins?", a: "Phase 7, Phase 11, Aerocity, and IT Park — see the Mohali area page." },
    ],
    relatedLinks: [
      { label: "Mohali area page", href: appPath("/rentals/in/chandigarh/mohali") },
      { label: "Chandigarh Tricity", href: appPath(rentalCityPath("in", "chandigarh")) },
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
    relatedLinks: [{ label: "Commercial property", href: appPath("/commercial-property-for-rent") }],
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
    intro: "Owner-direct Delhi rental discovery with map-based search and locality links.",
    benefits: [{ title: "Delhi localities", desc: "Mukherjee Nagar, GTB Nagar, Dwarka and more." }],
    faqs: [{ q: "Do you cover NCR too?", a: "Yes, Delhi and nearby hubs are available in rentals pages." }],
    relatedLinks: [{ label: "Delhi rentals", href: appPath("/rentals/in/delhi") }],
  },
};

export const APP_DOWNLOAD_PAGES: Record<string, MarketingPageConfig> = {
  "download-app": {
    slug: "download-app",
    title: "Download RentalPins App — Android Property & Rental Map",
    description:
      "Get the RentalPins Android app for map search, owner listings, WhatsApp leads, and free property posts.",
    h1: "Download the RentalPins app",
    intro: "Same live map and listings as the website — optimized for mobile alerts and posting on the go.",
    benefits: [
      { title: "Live map", desc: "Price pins, filters, and saved searches." },
      { title: "Post in minutes", desc: "Draft, verify OTP, activate plans." },
      { title: "Instant leads", desc: "WhatsApp and in-app chat notifications." },
      { title: "Multi-category", desc: "Property, vehicles, equipment and more." },
    ],
    faqs: [
      { q: "Is the app free?", a: "Download is free; listing activation follows city policy shown in-app." },
    ],
    relatedLinks: [
      { label: "Property owner app", href: appPath("/property-owner-app") },
      { label: "Tenant app", href: appPath("/tenant-app") },
      { label: "Web map", href: appPath("/search") },
    ],
  },
  "property-owner-app": {
    slug: "property-owner-app",
    title: "Property Owner App — List Rentals Free | RentalPins",
    description: "Android app for landlords and owners to post property, vehicles, and equipment on the map.",
    h1: "RentalPins for property owners",
    intro: "Publish listings, receive leads, and manage visibility from your phone.",
    benefits: [
      { title: "Free listing flow", desc: "Post drafts then activate when ready." },
      { title: "Map visibility", desc: "Pins appear alongside web traffic." },
      { title: "Lead tracking", desc: "WhatsApp and inquiry counters." },
      { title: "OTP trust", desc: "Verified renter conversations." },
    ],
    faqs: [{ q: "Can I manage listings on web too?", a: "Yes — www.rentalpins.com supports post, edit, and activate flows." }],
    relatedLinks: [{ label: "Download app", href: appPath("/download-app") }],
  },
  "tenant-app": {
    slug: "tenant-app",
    title: "Tenant App — Find Rentals on Map | RentalPins",
    description: "Search rooms, PG, flats, and vehicles near you. Contact owners without broker.",
    h1: "RentalPins for tenants",
    intro: "Discover rentals by location, save searches, and contact owners directly.",
    benefits: [
      { title: "Map-first search", desc: "Pan, zoom, and filter by category." },
      { title: "Alerts", desc: "Saved search notifications for new pins." },
      { title: "Direct contact", desc: "WhatsApp, call, chat." },
      { title: "Reviews", desc: "Listing reviews where enabled." },
    ],
    faqs: [{ q: "Do I pay brokerage on the app?", a: "RentalPins does not charge tenants brokerage to browse or contact owners." }],
    relatedLinks: [{ label: "Rental app India", href: appPath("/rental-app-india") }],
  },
  "rental-app-india": {
    slug: "rental-app-india",
    title: "Rental App India — Map-Based Property Search | RentalPins",
    description:
      "India-focused rental app for flats, PG, shops, offices, and vehicles. Ludhiana, Tricity, Delhi NCR, Mumbai and more.",
    h1: "India's map-based rental app",
    intro: "Built for Indian cities with local area hubs and no-broker owner contact.",
    benefits: [
      { title: "Indian cities", desc: "Ludhiana, Chandigarh Tricity, Delhi, Jaipur, Lucknow, Mumbai." },
      { title: "PG & commercial", desc: "Property sub-types for every use case." },
      { title: "Hindi-friendly UX", desc: "English UI with local city content." },
      { title: "Play Store", desc: "Install on Android today." },
    ],
    faqs: [{ q: "Which cities are live?", a: "See city hubs on the website — live badges show active markets." }],
    relatedLinks: [{ label: "Download", href: appPath("/download-app") }],
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
    benefits: [],
    faqs: [{ q: "Is RentalPins only for property?", a: "No — vehicles, furniture, machinery, and more are supported." }],
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
    benefits: [],
    faqs: [],
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
    intro: "99acres offers wide inventory; RentalPins differentiates with geospatial browsing and OTP-verified contact.",
    benefits: [],
    faqs: [],
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
    benefits: [],
    faqs: [],
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
    title: "Flats for Rent Without Broker | RentalPins",
    description: "Find 1BHK, 2BHK and furnished flats for rent across top Indian cities without broker commission.",
    h1: "Flats for rent without broker",
    intro: "Browse owner-listed flats on the RentalPins map and contact directly via WhatsApp or chat.",
    benefits: [
      { title: "BHK + budget filters", desc: "Compare 1BHK/2BHK with transparent pricing." },
      { title: "Area-first map search", desc: "See inventory by neighbourhood before shortlisting." },
      { title: "No broker middleman", desc: "Talk to owners directly." },
    ],
    faqs: [{ q: "Can I search furnished flats only?", a: "Yes, use furnishing filters in map search." }],
    relatedLinks: [{ label: "Rentals map", href: appPath("/search") }, { label: "Rent without broker", href: appPath("/rent-without-broker") }],
  },
  "houses-for-rent": {
    slug: "houses-for-rent",
    title: "Houses for Rent Without Broker | RentalPins",
    description: "Find independent houses and villas for rent across India with direct owner contact.",
    h1: "Houses and villas for rent",
    intro: "Discover house rentals across city and locality hubs on RentalPins.",
    benefits: [{ title: "Family-friendly areas", desc: "Browse locality pages with neighborhood context." }],
    faqs: [{ q: "Are villas listed too?", a: "Yes, villas and independent houses are available under Property." }],
    relatedLinks: [{ label: "House without broker", href: appPath("/houses-without-broker") }],
  },
  "pg-for-rent": {
    slug: "pg-for-rent",
    title: "PG for Rent Near Colleges and IT Parks | RentalPins",
    description: "Find PG and hostel rentals near universities and office hubs with direct owner contact.",
    h1: "PG and hostels for rent",
    intro: "Student and working-professional PG options mapped by locality.",
    benefits: [{ title: "College proximity", desc: "Quickly compare nearby PG options." }],
    faqs: [{ q: "Do you have boys and girls PG options?", a: "Yes, listings include both depending on owner preferences." }],
    relatedLinks: [{ label: "PG near Chandigarh University", href: appPath("/pg-near-chandigarh-university") }],
  },
  "shops-for-rent": {
    slug: "shops-for-rent",
    title: "Shops for Rent | Retail Space Without Broker",
    description: "Find retail shops and showrooms for rent in high-footfall zones across Indian cities.",
    h1: "Shops and retail space for rent",
    intro: "Commercial rentals with area-level visibility and direct owner discussions.",
    benefits: [{ title: "Commercial filters", desc: "Shop and showroom categories with map pin discovery." }],
    faqs: [{ q: "Can I find showroom space too?", a: "Yes, showroom listings are included under Property commercial sub-categories." }],
    relatedLinks: [{ label: "Commercial property", href: appPath("/commercial-property-for-rent") }],
  },
  "offices-for-rent": {
    slug: "offices-for-rent",
    title: "Offices for Rent and Co-working Spaces | RentalPins",
    description: "Find office space and co-working rentals with direct owner and operator listings.",
    h1: "Office space for rent",
    intro: "Compare office and co-working options by location and access.",
    benefits: [{ title: "Business location fit", desc: "Choose based on commute, market access, and visibility." }],
    faqs: [{ q: "Do you list co-working desks?", a: "Yes, co-working spaces are listed in office categories." }],
    relatedLinks: [{ label: "Shops for rent", href: appPath("/shops-for-rent") }],
  },
  "warehouse-for-rent": {
    slug: "warehouse-for-rent",
    title: "Warehouse for Rent in India | RentalPins",
    description: "Find warehouses and storage spaces for rent in industrial and logistics corridors.",
    h1: "Warehouse for rent",
    intro: "Map-first industrial inventory for storage and logistics use cases.",
    benefits: [{ title: "Industrial micro-markets", desc: "Explore proximity to highways, mandis, and freight hubs." }],
    faqs: [{ q: "Do you list godowns too?", a: "Yes, godown/warehouse listings are included." }],
    relatedLinks: [{ label: "Godown for rent", href: appPath("/godown-for-rent") }],
  },
  "factory-shed-for-rent": {
    slug: "factory-shed-for-rent",
    title: "Factory Shed for Rent | Industrial Leasing",
    description: "Browse factory sheds and industrial units for rent with direct owner contact.",
    h1: "Factory shed for rent",
    intro: "Industrial supply for manufacturing and light processing operations.",
    benefits: [{ title: "Industrial focus", desc: "Factory sheds, warehouses, and commercial industrial inventory." }],
    faqs: [{ q: "Are heavy-use units available?", a: "Listings vary by city and include industrial-ready spaces." }],
    relatedLinks: [{ label: "Industrial property", href: appPath("/industrial-property-for-rent") }],
  },
  "commercial-property-for-rent": {
    slug: "commercial-property-for-rent",
    title: "Commercial Property for Rent | Offices, Shops, Warehouses",
    description: "Commercial rentals across shops, offices, warehouses and industrial spaces.",
    h1: "Commercial property for rent",
    intro: "One hub for retail, office and industrial rental discovery.",
    benefits: [{ title: "Multiple commercial types", desc: "Shops, offices, co-working, warehouse, industrial units." }],
    faqs: [{ q: "Can I compare different commercial types?", a: "Yes, use category and map filters." }],
    relatedLinks: [{ label: "Offices for rent", href: appPath("/offices-for-rent") }],
  },
  "vehicles-for-rent": {
    slug: "vehicles-for-rent",
    title: "Vehicles for Rent | Cars, Bikes and Utility Rentals",
    description: "Find cars, bikes and utility vehicle rentals directly from owners and operators.",
    h1: "Vehicles for rent",
    intro: "Non-property rentals are core to RentalPins' multi-category marketplace.",
    benefits: [{ title: "Short and long duration", desc: "Vehicle options for personal and business use." }],
    faqs: [{ q: "Do you support bike and car rentals both?", a: "Yes, both are available in Vehicles." }],
    relatedLinks: [{ label: "Equipment for rent", href: appPath("/equipment-for-rent") }],
  },
  "equipment-for-rent": {
    slug: "equipment-for-rent",
    title: "Equipment for Rent | Machinery, Construction, Event Gear",
    description: "Find construction equipment, heavy machinery, furniture, and event equipment rentals.",
    h1: "Equipment and machinery for rent",
    intro: "Industrial and project teams can source equipment through map-based discovery.",
    benefits: [{ title: "Multi-vertical inventory", desc: "Construction, heavy machinery, event and furniture equipment." }],
    faqs: [{ q: "Is construction equipment listed?", a: "Yes, under Construction Equipment and Heavy Machinery." }],
    relatedLinks: [{ label: "Factory shed for rent", href: appPath("/factory-shed-for-rent") }],
  },
};

export const STUDENT_RENTAL_PAGES: Record<string, MarketingPageConfig> = {
  "pg-near-cgc-landran": { slug: "pg-near-cgc-landran", title: "PG Near CGC Landran | RentalPins", description: "Student PG and flats near CGC Landran with direct owner contact.", h1: "PG near CGC Landran", intro: "Find boys PG, girls PG, and student flats near CGC Landran.", benefits: [{ title: "Student-ready", desc: "PG and flat options close to campus." }], faqs: [{ q: "Are girls PG options available?", a: "Yes, depending on listing availability and owner preference." }], relatedLinks: [{ label: "PG for rent", href: appPath("/pg-for-rent") }] },
  "pg-near-chandigarh-university": { slug: "pg-near-chandigarh-university", title: "PG Near Chandigarh University | RentalPins", description: "PG, hostels, and student flats near Chandigarh University.", h1: "PG near Chandigarh University", intro: "Explore student accommodation around CU on map.", benefits: [{ title: "Campus-local map", desc: "Compare nearby clusters by rent and travel convenience." }], faqs: [{ q: "Can I find shared rooms?", a: "Yes, room and PG inventory includes shared options." }], relatedLinks: [{ label: "Mohali rentals", href: appPath("/rentals/in/chandigarh/mohali") }] },
  "pg-near-lpu": { slug: "pg-near-lpu", title: "PG Near LPU | RentalPins", description: "Find PG and student rentals near Lovely Professional University.", h1: "PG near LPU", intro: "Student rental listings near LPU with direct owner contact.", benefits: [{ title: "No broker", desc: "Owner listings and direct conversation." }], faqs: [{ q: "Are hostels and PG both listed?", a: "Yes, PG/Hostels category covers both." }], relatedLinks: [{ label: "PG for rent", href: appPath("/pg-for-rent") }] },
  "pg-near-gndec": { slug: "pg-near-gndec", title: "PG Near GNDEC | RentalPins", description: "PG and room rentals near GNDEC with locality-level filtering.", h1: "PG near GNDEC", intro: "Find boys/girls PG and shared rooms near GNDEC.", benefits: [{ title: "Student focus", desc: "Quick access to room and PG categories." }], faqs: [{ q: "Is there map search for nearby areas?", a: "Yes, use the map with locality filters." }], relatedLinks: [{ label: "Ludhiana rentals", href: appPath("/rentals/in/ludhiana") }] },
  "pg-near-pau": { slug: "pg-near-pau", title: "PG Near PAU Ludhiana | RentalPins", description: "Student PG and flats near PAU Ludhiana.", h1: "PG near PAU", intro: "Accommodation options near Punjab Agricultural University.", benefits: [{ title: "Area-level search", desc: "Discover nearby sectors and localities." }], faqs: [{ q: "Do you have family rentals too?", a: "Yes, use flats/houses categories for family options." }], relatedLinks: [{ label: "Flats for rent", href: appPath("/flats-for-rent") }] },
  "pg-near-pec": { slug: "pg-near-pec", title: "PG Near PEC Chandigarh | RentalPins", description: "PG and student accommodation near PEC Chandigarh.", h1: "PG near PEC", intro: "Compare PG, rooms, and flats near PEC on map.", benefits: [{ title: "Direct owner contact", desc: "No middleman for student accommodation discovery." }], faqs: [{ q: "Can I save searches?", a: "Yes, save map searches and review new matches." }], relatedLinks: [{ label: "Chandigarh rentals", href: appPath("/rentals/in/chandigarh") }] },
};

export const NEAR_ME_PAGES: Record<string, MarketingPageConfig> = {
  "rentals-near-me": { slug: "rentals-near-me", title: "Rentals Near Me | RentalPins", description: "Find rentals near your location using map-first search on RentalPins.", h1: "Rentals near me", intro: "Allow location access to discover nearby rental listings instantly.", benefits: [{ title: "Location-aware search", desc: "Use current location and map viewport filters." }], faqs: [{ q: "Do I need location permission?", a: "Permission helps, but you can search manually by area too." }], relatedLinks: [{ label: "Open map", href: appPath("/search") }] },
  "flats-near-me": { slug: "flats-near-me", title: "Flats Near Me | RentalPins", description: "Find flats and apartments near your current location.", h1: "Flats near me", intro: "Map-based nearby flat search with owner contact options.", benefits: [{ title: "Quick shortlist", desc: "Sort by location and budget." }], faqs: [{ q: "Can I filter by BHK?", a: "Yes, use filters on the map search page." }], relatedLinks: [{ label: "Flats for rent", href: appPath("/flats-for-rent") }] },
  "pg-near-me": { slug: "pg-near-me", title: "PG Near Me | RentalPins", description: "Find PG and hostel options near your current location.", h1: "PG near me", intro: "Discover nearby student and working-professional PG inventory.", benefits: [{ title: "Nearby-first", desc: "Search hostels and PG close to campus/work." }], faqs: [{ q: "Can I find boys and girls PG separately?", a: "Yes, listings mention suitability where available." }], relatedLinks: [{ label: "PG for rent", href: appPath("/pg-for-rent") }] },
  "shops-near-me": { slug: "shops-near-me", title: "Shops Near Me for Rent | RentalPins", description: "Find retail shops and showroom spaces near your location.", h1: "Shops near me", intro: "Map retail inventory in high-footfall localities near you.", benefits: [{ title: "Locality visibility", desc: "Compare commercial clusters quickly." }], faqs: [{ q: "Are showroom listings included?", a: "Yes, shops and showrooms are both covered." }], relatedLinks: [{ label: "Shops for rent", href: appPath("/shops-for-rent") }] },
  "offices-near-me": { slug: "offices-near-me", title: "Offices Near Me for Rent | RentalPins", description: "Find office and co-working spaces near your location.", h1: "Offices near me", intro: "Discover business spaces with map-first search and direct leads.", benefits: [{ title: "Commute-aware", desc: "Select spaces around transport corridors." }], faqs: [{ q: "Is co-working included?", a: "Yes, co-working listings are part of office inventory." }], relatedLinks: [{ label: "Offices for rent", href: appPath("/offices-for-rent") }] },
  "warehouses-near-me": { slug: "warehouses-near-me", title: "Warehouses Near Me | RentalPins", description: "Find nearby warehouses and industrial storage rentals.", h1: "Warehouses near me", intro: "Discover industrial inventory near logistics hubs and highways.", benefits: [{ title: "Industrial corridors", desc: "Map-based sourcing for warehouse demand." }], faqs: [{ q: "Are godowns listed too?", a: "Yes, godowns are included in warehouse inventory." }], relatedLinks: [{ label: "Warehouse for rent", href: appPath("/warehouse-for-rent") }] },
};

export const INDUSTRIAL_PAGES: Record<string, MarketingPageConfig> = {
  "godown-for-rent": { slug: "godown-for-rent", title: "Godown for Rent in India | RentalPins", description: "Find godown and storage rentals in industrial and trade zones.", h1: "Godown for rent", intro: "Storage-focused listings for traders and distributors.", benefits: [{ title: "Storage-first", desc: "Find industrial storage options quickly." }], faqs: [{ q: "How is this different from warehouse pages?", a: "Godown pages focus on smaller storage and trade-oriented units." }], relatedLinks: [{ label: "Warehouse for rent", href: appPath("/warehouse-for-rent") }] },
  "industrial-property-for-rent": { slug: "industrial-property-for-rent", title: "Industrial Property for Rent | RentalPins", description: "Find industrial property, factory sheds, and warehouses for lease.", h1: "Industrial property for rent", intro: "Industrial leasing pages for manufacturing and logistics operations.", benefits: [{ title: "Factory + warehouse", desc: "Mixed industrial inventory in one place." }], faqs: [{ q: "Do you cover Ludhiana industrial belts?", a: "Yes, Ludhiana has dedicated industrial-focused pages." }], relatedLinks: [{ label: "Factory shed for rent", href: appPath("/factory-shed-for-rent") }] },
  "warehouse-for-rent-ludhiana": { slug: "warehouse-for-rent-ludhiana", title: "Warehouse for Rent Ludhiana | RentalPins", description: "Warehouse rental opportunities in Ludhiana industrial zones.", h1: "Warehouse for rent in Ludhiana", intro: "Discover storage spaces in Focal Point and other logistics belts.", benefits: [{ title: "Ludhiana trade corridors", desc: "Industrial and transport-oriented locations." }], faqs: [{ q: "Can I find nearby factory units too?", a: "Yes, related industrial categories are linked." }], relatedLinks: [{ label: "Ludhiana rentals", href: appPath("/rentals/in/ludhiana") }] },
  "factory-shed-for-rent-ludhiana": { slug: "factory-shed-for-rent-ludhiana", title: "Factory Shed for Rent Ludhiana | RentalPins", description: "Factory shed and industrial unit rentals in Ludhiana.", h1: "Factory shed for rent in Ludhiana", intro: "Industrial units for production and warehouse-linked operations.", benefits: [{ title: "Manufacturing focus", desc: "Units suitable for light and medium operations." }], faqs: [{ q: "Are listings direct from owners?", a: "RentalPins is owner-direct focused." }], relatedLinks: [{ label: "Industrial property Ludhiana", href: appPath("/industrial-property-ludhiana") }] },
  "industrial-property-ludhiana": { slug: "industrial-property-ludhiana", title: "Industrial Property Ludhiana | RentalPins", description: "Industrial rentals in Ludhiana including warehouses and factory sheds.", h1: "Industrial property in Ludhiana", intro: "One hub for Ludhiana industrial leasing intent.", benefits: [{ title: "Combined inventory", desc: "Warehouse, godown, and factory categories in one page." }], faqs: [{ q: "Which Ludhiana areas are industrial?", a: "Focal Point and surrounding belts are common demand zones." }], relatedLinks: [{ label: "Warehouse Ludhiana", href: appPath("/warehouse-for-rent-ludhiana") }] },
  "warehouse-chandigarh": { slug: "warehouse-chandigarh", title: "Warehouse Chandigarh | RentalPins", description: "Warehouse and industrial storage opportunities in Chandigarh region.", h1: "Warehouse in Chandigarh region", intro: "Industrial inventory around Chandigarh and nearby hubs.", benefits: [{ title: "Regional logistics", desc: "Access to Tricity-linked warehouse spaces." }], faqs: [{ q: "Do you include Mohali inventory?", a: "Yes, nearby industrial areas are linked." }], relatedLinks: [{ label: "Warehouse Mohali", href: appPath("/warehouse-mohali") }] },
  "warehouse-mohali": { slug: "warehouse-mohali", title: "Warehouse Mohali | RentalPins", description: "Warehouse and storage rentals in Mohali and nearby corridors.", h1: "Warehouse in Mohali", intro: "Storage and industrial leasing across Mohali belt.", benefits: [{ title: "Tricity industrial demand", desc: "Suitable for distribution and local operations." }], faqs: [{ q: "Can I compare with Chandigarh areas?", a: "Yes, linked city pages help compare nearby options." }], relatedLinks: [{ label: "Chandigarh warehouse", href: appPath("/warehouse-chandigarh") }] },
};

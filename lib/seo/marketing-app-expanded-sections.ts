import type { MarketingSeoSection } from "@/lib/seo/marketing-pages";

const appSections = (
  audience: string,
  primaryUse: string,
  cityFocus: string
): MarketingSeoSection[] => [
  {
    title: "Why RentalPins uses a map-first Android app",
    paragraphs: [
      "The RentalPins Android app mirrors the live website map — price pins, category filters, and owner contact work the same whether you post or search from mobile.",
      `${primaryUse} — OTP-verified accounts reduce spam compared with anonymous classified boards where broker reposts dominate.`,
      "Install from Google Play, sign in with phone OTP, and access the same inventory pool as www.rentalpins.com without a separate broker layer.",
    ],
  },
  {
    title: "Features for owners and tenants on mobile",
    paragraphs: [
      "Owners draft listings, upload photos, set location pins, and activate plans when ready — leads arrive on WhatsApp and in-app chat from tenants browsing nearby.",
      "Tenants pan the map, filter PG, flats, houses, shops, vehicles, and equipment, save searches, and get alerts when new owner pins match criteria.",
      "Multi-category inventory matters in Indian cities — students may need a PG pin and a bike rental pin on the same map before move-in week.",
    ],
  },
  {
    title: cityFocus,
    paragraphs: [
      "Chandigarh Tricity, Mohali, Kharar, Ludhiana, and Delhi NCR carry the deepest guides and inventory — city hub pages link into the same pins the app displays.",
      "Campus PG landings, broker-free pages, and national funnels on the website cross-link to live map inventory the app opens directly.",
      "When you know your anchor city, open the city hub in-app or on web first — area filters reduce noise from incompatible suburbs on the wider map.",
    ],
  },
  {
    title: "Posting and managing listings from your phone",
    paragraphs: [
      "The post flow supports property, vehicles, furniture, equipment, and more — pick category, set pin location, add photos, and publish when activation is complete.",
      "Edit drafts, refresh photos after vacancy, and respond to inquiries quickly during peak session weeks — stale pins lose visibility to newer owner posts.",
      "Web and app share one account — owners can start a draft on mobile and finish on desktop, or manage leads from either surface.",
    ],
  },
  {
    title: "Searching without brokerage on the app",
    paragraphs: [
      "Tenants browse and contact owners without paying search brokerage — RentalPins connects you directly from listing detail via WhatsApp or in-app chat.",
      "Confirm listing pin accuracy on visit before token — mobile map search helps eliminate misleading titles before you travel to distant suburbs.",
      "Save searches for flats, PG, or commercial categories — alerts reduce daily classified scrolling when your move-in date is a few weeks away.",
    ],
  },
  {
    title: "Trust, OTP verification, and lead quality",
    paragraphs: [
      "Phone-verified accounts on RentalPins reduce anonymous spam — still confirm who holds keys and whether the unit matches the map pin before paying deposit.",
      "Owners see inquiry counters and can prioritize serious tenants who message with budget and move-in dates in the first WhatsApp.",
      "Listing reviews and profile signals where enabled help tenants shortlist — combine app search with city money-page guides for deposit checklists.",
    ],
  },
  {
    title: `Getting started with RentalPins for ${audience}`,
    paragraphs: [
      "Download from Google Play, allow location when searching nearby inventory, and link saved searches to your target city hub if GPS density is thin.",
      "Read linked city rental guides on the website for rent bands and locality context — then return to the app the same day to message owners from live pins.",
      "Use related app landings below for owner vs tenant workflows — each links back to the same RentalPins listing pool on web and Android.",
    ],
  },
];

/** Long-form sections for app download marketing landings. */
export const MARKETING_APP_EXTRA_SECTIONS: Record<string, MarketingSeoSection[]> = {
  "download-app": appSections(
    "owners and tenants",
    "One app covers map search, free listing drafts, WhatsApp leads, and saved-search alerts",
    "Priority Indian city hubs on the same map"
  ),
  "property-owner-app": appSections(
    "property owners",
    "Owners post flats, PG, houses, shops, vehicles, and equipment with map pins visible to web and app tenants",
    "List in Ludhiana, Tricity, Delhi, and other live cities from your phone"
  ).map((section, index) =>
    index === 2
      ? {
          ...section,
          title: "Owner listing visibility in live Indian cities",
          paragraphs: [
            "Owners in Ludhiana, Chandigarh Tricity, Mohali, and Delhi receive WhatsApp leads from tenants using web and app map search — one listing pool, two surfaces.",
            "Activation plans follow in-app city policy — tenants still browse and contact without brokerage commission when your pin is live.",
            "Accurate locality names and fresh photos after vacancy improve discovery in sector, phase, and belt search during peak rental weeks.",
          ],
        }
      : section
  ),
  "tenant-app": appSections(
    "tenants and students",
    "Tenants filter PG, flats, and vehicles on the map, save searches, and contact owners without broker unlock fees",
    "Student belts near CU, PAU, PEC, and IT Park on mobile map search"
  ).map((section, index) =>
    index === 2
      ? {
          ...section,
          title: "Student and professional tenant search on mobile",
          paragraphs: [
            "Students near CU, PAU, and coaching belts filter PG/Hostels on the app — campus landings on the website link to the same pins you open in mobile map view.",
            "Working tenants near Mohali IT Park compare PG and furnished flats with commute-first map panning — message owners with joining dates in the first WhatsApp.",
            "Pair tenant app search with city money-page guides for deposit safety — read on web, shortlist on app the same day.",
          ],
        }
      : section
  ),
  "rental-app-india": appSections(
    "India-wide renters and owners",
    "India-focused rental app with local city hubs, PG and commercial filters, and owner-direct contact across live markets",
    "Ludhiana, Tricity, Delhi NCR, and expanding city badges on one map platform"
  ).map((section, index) =>
    index === 2
      ? {
          ...section,
          title: "Indian city coverage and local area SEO",
          paragraphs: [
            "RentalPins ships deep content for Chandigarh Tricity, Mohali, Kharar, Ludhiana, and Delhi — money-page guides and app map pins stay in sync.",
            "National funnels for flats, houses, PG, and property-without-broker link into the same inventory the India rental app opens on Android.",
            "Live city badges on the website show active markets — install the app and pan to your hub when relocating within India.",
          ],
        }
      : section
  ),
};

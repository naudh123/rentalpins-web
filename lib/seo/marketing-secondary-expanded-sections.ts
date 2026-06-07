import type { MarketingSeoSection } from "@/lib/seo/marketing-pages";

const nearMeSections = (
  category: string,
  filterHint: string,
  nationalSlug: string
): MarketingSeoSection[] => [
  {
    title: `Using map search for ${category} near your location`,
    paragraphs: [
      "Open the RentalPins map and allow location access when prompted — pins cluster around your GPS position so you can compare nearby owner listings before visiting.",
      "If you prefer not to share location, pan manually to your campus, office, or neighbourhood and use viewport search — results stay tied to the map area you set.",
      `${filterHint} — category filters keep results aligned with what you actually plan to shortlist.`,
    ],
  },
  {
    title: "Near-me search vs scrolling classified boards",
    paragraphs: [
      "Classified feeds sort by repost date and broker duplicates — map pins show owner-posted inventory with location context on one screen.",
      "Open listing detail to compare price, furnishing notes, and exact pin position before messaging owners on WhatsApp or in-app chat.",
      "RentalPins does not charge tenants a search commission — contact owners directly from pins you discover near your location.",
    ],
  },
  {
    title: "When near-me results are thin",
    paragraphs: [
      "Inventory density varies by city — Chandigarh Tricity, Ludhiana, and Delhi NCR carry the deepest pin coverage; other areas may need wider map panning.",
      `Use the national ${nationalSlug} landing and city hub pages when you already know your target city — they link into the same live map inventory with area guides.`,
      "Save searches when your move-in date is a few weeks away — new owner posts appear as pins without repeating daily classified scrolling.",
    ],
  },
  {
    title: "Shortlisting and visiting nearby listings",
    paragraphs: [
      "Shortlist three to five nearby pins, message owners with your budget and move-in date, then schedule visits in one trip when possible.",
      "Confirm the unit matches the map pin before paying token — misleading titles are easier to eliminate when you compare pin accuracy first.",
      "Photograph existing wear at handover and clarify deposit refund rules with the owner directly — near-me discovery still needs standard rental safety steps.",
    ],
  },
  {
    title: "Linking near-me search to city guides",
    paragraphs: [
      "Priority city money-page guides cover rent bands, transport, and deposit checklists — read for context, then return to near-me map search the same day.",
      "Campus PG landings, broker-free pages, and national funnels all point back to live map inventory — use them when your anchor city is already decided.",
      "Web and Android share one listing pool — saved searches and owner contact work the same on mobile when you are on the ground shortlisting nearby pins.",
    ],
  },
  {
    title: "Saving time on nearby shortlists",
    paragraphs: [
      "Message three owners with the same move-in date and budget band instead of visiting random broker boards — coordinated inquiries get faster responses during peak weeks.",
      "Compare total monthly cost including maintenance, AC, meals, or parking before token — nearby pins with lower headline rent can cost more once utilities are included.",
      "Use related national and city links at the bottom of this page when near-me density is thin — they open the same map with pre-filtered city or category context.",
    ],
  },
  {
    title: "Mobile map search near your anchor",
    paragraphs: [
      "The RentalPins Android app uses the same pin pool as the website — enable location on mobile when you are on campus or a site visit corridor to refresh nearby results.",
      "Switch between PG, flat, shop, office, and vehicle filters without leaving the map — mixed category scrolling on classified apps wastes time when your intent is narrow.",
      "Owner WhatsApp replies often arrive faster when your first message includes map pin link, budget, and move-in week — near-me search works best with specific owner outreach.",
    ],
  },
];

const competitorSections = (competitor: string): MarketingSeoSection[] => [
  {
    title: `When RentalPins fits better than ${competitor}`,
    paragraphs: [
      `RentalPins is map-native — you discover owner listings by neighbourhood pins rather than scrolling ${competitor}'s portal-style feeds for generic city keywords.`,
      "Multi-category inventory includes vehicles, furniture, and equipment alongside property — useful when relocation involves more than a flat or PG alone.",
      "OTP-verified contact and WhatsApp leads reduce anonymous spam compared with open classified reposts common on large portals.",
    ],
  },
  {
    title: "Map-first discovery and city hub SEO",
    paragraphs: [
      "City and locality money pages on RentalPins combine long-form area guides with live map inventory — tenants read context, then shortlist pins immediately.",
      "Area pages under Chandigarh Tricity, Mohali, Kharar, Ludhiana, and Delhi inherit focused filters when your commute or campus anchor is fixed.",
      `${competitor} remains strong for broad inventory depth — RentalPins differentiates on geospatial browsing and owner-direct positioning in live Indian hubs.`,
    ],
  },
  {
    title: "Owner listing and tenant contact model",
    paragraphs: [
      "Owners post on RentalPins web or Android in supported cities and receive WhatsApp inquiries — tenants browse and message without mandatory broker unlock fees.",
      "Listing activation may apply for owners in some markets — tenants still search and contact without brokerage commission on RentalPins.",
      "Compare total cost including any owner plans versus tenant-side fees on other platforms when evaluating where to list or search.",
    ],
  },
  {
    title: "Practical search workflow on RentalPins",
    paragraphs: [
      "Start on a city hub or national funnel such as flats-for-rent or property-without-broker, then pan the map to your sector, phase, or locality.",
      "Use category filters for PG, flats, houses, shops, offices, and warehouses — mixed results waste time when your intent is already narrow.",
      "Save searches and review new pins during peak session or joining weeks — owner posts refresh faster than stale broker reposts on external boards.",
    ],
  },
  {
    title: "Choosing the right platform for your move",
    paragraphs: [
      `Use ${competitor} when you need nationwide project inventory or agent-led discovery — use RentalPins when map-led owner contact in Tricity, Ludhiana, or Delhi is the priority.`,
      "Many tenants cross-check both — shortlist on RentalPins for owner-direct pins, then verify availability on visit before paying token to anyone other than the listing owner.",
      "Download the RentalPins Android app for mobile alerts — same map and listings as the website when you are on the ground comparing nearby options.",
    ],
  },
  {
    title: "Student, PG, and commercial use cases",
    paragraphs: [
      "RentalPins PG landings for CU, PAU, PEC, and IT Park belts link into live hostel inventory — portals may list PG too, but map clustering by campus proximity is RentalPins' strength.",
      "Commercial tenants filtering shops, offices, or warehouses on the map avoid residential noise — category separation matters for retail and industrial shortlists.",
      "Vehicle and equipment rentals on RentalPins help relocations that need housing and mobility together — multi-category map search is uncommon on property-first portals.",
    ],
  },
  {
    title: "After you shortlist on RentalPins",
    paragraphs: [
      "Visit top map pins in one trip when geography allows — compare like-for-like units before paying token to brokers claiming the same photos on other boards.",
      "Read linked city money-page guides for deposit, transport, and locality context — comparison pages are starting points, not substitutes for area-specific checklists.",
      "Save your RentalPins search and return after reading guides — owner inventory on the map is the same pool linked from broker-free and campus PG landings.",
    ],
  },
];

const industrialSections = (
  place: string,
  belt: string,
  hubHref: string
): MarketingSeoSection[] => [
  {
    title: `Industrial and warehouse search in ${place}`,
    paragraphs: [
      `Filter commercial and industrial categories on the ${place} map — warehouses, godowns, factory sheds, and shops appear as owner-posted pins along ${belt}.`,
      "Logistics tenants should compare highway access, ceiling height, and loading bays on listing detail before site visits — headline rent hides utility differences.",
      "RentalPins connects you with owners directly — confirm truck access, power load, and compound security in the first WhatsApp message.",
    ],
  },
  {
    title: "Site visit checklist for industrial tenants",
    paragraphs: [
      "Shortlist three to five pins on one corridor day — drive time between Focal Point, industrial phases, or Tricity belts matters more than city-centre address prestige.",
      "Photograph shutter condition, floor wear, and meter readings at handover — industrial deposit disputes are easier to avoid with timestamped images.",
      "Ask whether rent includes CAM, property tax, or maintenance — industrial listings on RentalPins vary on what headline figures include.",
    ],
  },
  {
    title: "Warehouse vs godown vs factory shed",
    paragraphs: [
      "Godowns suit traders needing smaller storage; warehouses target logistics and distribution; factory sheds support light manufacturing — filter categories to match intent.",
      "Cross-link related industrial landings on RentalPins when your operation spans storage and production — each category inherits map filters for like-for-like inventory.",
      "Owners should note shutter count, floor load, and truck turnaround space in descriptions — tenants eliminate mismatched pins before visiting when specs are explicit.",
    ],
  },
  {
    title: "Owner-direct industrial leasing",
    paragraphs: [
      "Message owners from map pins rather than broker intermediaries — duplicate industrial listings of owner photos remain common on external classified boards.",
      "Confirm lease term, escalation clauses, and fit-out responsibility before token — owner agreements vary more than broker-standard templates in industrial belts.",
      "Free listing on RentalPins puts industrial pins on the same map tenants use for residential search — accurate belt names improve discovery in hub search.",
    ],
  },
  {
    title: "Linking industrial search to city guides",
    paragraphs: [
      `${hubHref} money-page and industrial landings link into the same live map inventory — read for belt context, then shortlist pins the same day.`,
      "National warehouse-for-rent and industrial-property pages entry into India-wide search — narrow to Ludhiana Focal Point or Tricity corridors once your logistics anchor is fixed.",
      "Save map searches when expansion timelines are four to six weeks out — fresh owner industrial posts appear without repeating broker-heavy classified scrolling.",
    ],
  },
  {
    title: "Industrial owners listing on RentalPins",
    paragraphs: [
      "Include ceiling height, floor load, shutter count, truck access, and compound security in listing text — logistics tenants eliminate mismatched pins before visiting when specs are explicit.",
      "Refresh photos after vacancy during peak trade season — active industrial pins with accurate belt names outperform stale classified reposts on external boards.",
      "Free listing on web or Android puts warehouse and factory inventory on the same map tenants use for residential search — industrial discovery improves when locality tags match Focal Point or Tricity belt names.",
    ],
  },
  {
    title: "Planning expansion timelines",
    paragraphs: [
      "Start industrial map search four to six weeks before lease expiry — Focal Point and Tricity belts tighten when multiple logistics tenants hunt the same corridor simultaneously.",
      "Negotiate fit-out, signage, and CAM separately from base rent with owners directly — industrial headline figures on boards often hide charges owners clarify on WhatsApp.",
      "Cross-link Ludhiana money-page industrial sections and warehouse city landings when your anchor belt is fixed — read context first, then message owners from live map pins the same week.",
    ],
  },
];

/** Long-form sections for near-me, competitor, and industrial marketing landings. */
export const MARKETING_SECONDARY_EXTRA_SECTIONS: Record<string, MarketingSeoSection[]> = {
  "rentals-near-me": nearMeSections(
    "rentals",
    "Filter Property, PG, vehicles, and commercial sub-categories on the map",
    "rent-without-broker"
  ),
  "flats-near-me": nearMeSections(
    "flats",
    "Filter Property → Apartments / Flats and set BHK plus budget before panning",
    "flats-for-rent"
  ),
  "pg-near-me": nearMeSections(
    "PG and hostels",
    "Filter PG/Hostels and confirm boys, girls, or co-ed suitability with owners",
    "pg-for-rent"
  ),
  "shops-near-me": nearMeSections(
    "shops and showrooms",
    "Filter Property commercial shop and showroom categories on the map",
    "shops-for-rent"
  ),
  "offices-near-me": nearMeSections(
    "offices and co-working",
    "Filter office and co-working commercial categories near transport corridors",
    "offices-for-rent"
  ),
  "warehouses-near-me": nearMeSections(
    "warehouses and godowns",
    "Filter warehouse, godown, and industrial commercial categories near highways",
    "warehouse-for-rent"
  ),
  "rentalpins-vs-nobroker": competitorSections("NoBroker"),
  "rentalpins-vs-magicbricks": competitorSections("MagicBricks"),
  "rentalpins-vs-99acres": competitorSections("99acres"),
  "rentalpins-vs-housing": competitorSections("Housing.com"),
  "warehouse-for-rent": industrialSections(
    "India",
    "Focal Point Ludhiana, Mohali industrial corridors, and Tricity logistics belts",
    "Ludhiana and Tricity city"
  ),
  "godown-for-rent": industrialSections(
    "India",
    "trade zones and mandi-adjacent storage belts",
    "Ludhiana industrial"
  ),
  "industrial-property-for-rent": industrialSections(
    "India",
    "manufacturing and logistics corridors",
    "priority city industrial"
  ),
  "warehouse-for-rent-ludhiana": industrialSections(
    "Ludhiana",
    "Focal Point and Pakhowal Road logistics belts",
    "Ludhiana city"
  ),
  "factory-shed-for-rent-ludhiana": industrialSections(
    "Ludhiana",
    "Focal Point industrial zones",
    "Ludhiana city"
  ),
  "industrial-property-ludhiana": industrialSections(
    "Ludhiana",
    "Focal Point, warehouses, and factory sheds",
    "Ludhiana city"
  ),
  "warehouse-chandigarh": industrialSections(
    "Chandigarh region",
    "Tricity logistics and storage corridors",
    "Chandigarh Tricity"
  ),
  "warehouse-mohali": industrialSections(
    "Mohali",
    "SAS Nagar industrial and distribution belts",
    "Mohali area"
  ),
};

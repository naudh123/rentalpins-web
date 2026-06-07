import type { MarketingSeoSection } from "@/lib/seo/marketing-pages";

const categorySections = (
  category: string,
  filterHint: string,
  cityExamples: string
): MarketingSeoSection[] => [
  {
    title: `Finding ${category} on the RentalPins map`,
    paragraphs: [
      `Open the RentalPins map, select your city hub, and ${filterHint} — owner-posted pins show price and location before you message anyone on WhatsApp.`,
      `Pan across ${cityExamples} to compare neighbourhood clusters — two listings with similar titles can differ sharply in rent once you see exact sector, phase, or belt on the pin.`,
      "RentalPins connects tenants with owners directly — no brokerage commission to browse, save searches, or inquire from listing detail.",
    ],
  },
  {
    title: "National funnel and city hub workflow",
    paragraphs: [
      "This national landing links into priority city cards for Chandigarh Tricity, Mohali, Kharar, Ludhiana, and Delhi — each card points to a money-page rental guide and live map inventory.",
      "Drill from India-wide entry into city category pages when your anchor is fixed — area filters reduce noise from incompatible suburbs on the wider city view.",
      "Blog guides and broker-free landings cross-link back to the same pin pool — read for deposit and locality context, then shortlist on the map the same day.",
    ],
  },
  {
    title: "Peak demand and budget planning",
    paragraphs: [
      "Session and joining-week peaks tighten supply — start map search two to four weeks before move-in and save searches to catch fresh owner posts.",
      "Compare total monthly cost including utilities, meals, parking, or furnishing surcharges — headline rent on boards often hides extras owners clarify directly.",
      "Message owners with exact joining dates and budget bands during peak weeks — coordinated inquiries get faster viewing slots than generic broker callbacks.",
    ],
  },
  {
    title: "Broker-free viewing checklist",
    paragraphs: [
      "Confirm the unit matches the map pin and who holds keys before token — broker reposts of owner photos remain common on external classified sites.",
      "Photograph existing wear at handover and share timestamped images on WhatsApp — deposit disputes are easier to avoid than resolve after move-out.",
      "Ask whether the owner expects an 11-month agreement or shorter lease — markets differ between student, family, and corporate inventory.",
    ],
  },
  {
    title: "Linking guides to live inventory",
    paragraphs: [
      "Money-page rental guides on city and area hubs cover rent bands, transport, and deposit norms — pair with this national category landing before contacting owners.",
      "Property-without-broker and category-specific broker landings link into the same map — use them as entry points, then narrow to your locality on pins.",
      "National funnel city grids on flats-for-rent and houses-for-rent surface top markets first — click through to category pages under each hub when ready.",
    ],
  },
  {
    title: "Saving searches and mobile map use",
    paragraphs: [
      "Save map searches on RentalPins to monitor new owner posts without daily classified scrolling — alerts help during tight session or corporate joining windows.",
      "Web and Android share one listing pool — enable location on mobile when visiting corridors to refresh nearby pins against your shortlist.",
      "Owner listings with fresh photos after vacancy regain visibility faster than stale pins left unchanged through peak demand weeks.",
    ],
  },
  {
    title: "Why map search beats portal scrolling",
    paragraphs: [
      "Portal feeds sort by repost date and broker duplicates — map pins cluster by neighbourhood so you compare like-for-like inventory geographically.",
      "OTP-verified accounts and direct owner WhatsApp contact reduce anonymous spam versus open boards where multiple brokers share the same photos.",
      "Multi-category RentalPins inventory lets you pair housing search with vehicles or equipment on one platform when relocation needs more than a single rental type.",
    ],
  },
];

function withPeakSection(
  sections: MarketingSeoSection[],
  title: string,
  paragraphs: string[]
): MarketingSeoSection[] {
  return sections.map((section, index) =>
    index === 2 ? { title, paragraphs } : section
  );
}

/** Long-form sections for national category funnel landings. */
export const MARKETING_CATEGORY_EXTRA_SECTIONS: Record<string, MarketingSeoSection[]> = {
  "flats-for-rent": withPeakSection(
    categorySections(
      "flats and apartments",
      "filter Property → Apartments / Flats with BHK, budget, and furnishing tags",
      "Chandigarh sectors, Mohali phases, Ludhiana Model Town, and Delhi belts"
    ),
    "Student, family, and corporate flat demand",
    [
      "Students near CU, PAU, and coaching belts often compare PG with shared flats — filter categories separately to compare total monthly cost.",
      "Families prefer Chandigarh sectors, Mohali Phase 9–11, and Ludhiana residential belts — flats category hubs under each city keep search scoped.",
      "Furnished flats move fastest before corporate joining dates — message owners with move-in week in the first WhatsApp during peak Tricity weeks.",
    ]
  ),
  "houses-for-rent": withPeakSection(
    categorySections(
      "houses and villas",
      "filter Property → Houses / Villas and compare pin clusters near schools and markets",
      "Chandigarh sectors, Mohali gated societies, Ludhiana Model Town, and Delhi Dwarka"
    ),
    "Family house and villa search by locality",
    [
      "School proximity, parking, and society maintenance matter more for houses than for student PG — pan the map around daily anchors before shortlisting.",
      "Villas often include garden and parking that flats hide in headline rent — open listing detail for break-up before visiting.",
      "Independent houses in Ludhiana and Tricity vary on utility quality — confirm water, power backup, and lane access on the first visit.",
    ]
  ),
  "pg-for-rent": withPeakSection(
    categorySections(
      "PG and hostels",
      "filter PG/Hostels and confirm boys, girls, or co-ed suitability with owners",
      "Kharar CU belt, Ludhiana PAU corridors, PEC sectors, and Mohali IT Park"
    ),
    "Campus PG and IT Park professional demand",
    [
      "Campus landings for CU, PAU, PEC, GNDEC, LPU, and CGC Landran link into live PG inventory — use them when your institute anchor is fixed.",
      "PG with meals suits first-year students; shared flats split better for stable groups — compare total cost including AC and laundry surcharges.",
      "Mohali IT Park professionals filter PG near Aerocity and Phase 7 — commute minutes often beat lowest headline PG rent alone.",
    ]
  ),
  "shops-for-rent": withPeakSection(
    categorySections(
      "shops and showrooms",
      "filter Property commercial shop and showroom categories on the city map",
      "Sector 35 Chandigarh markets, Ludhiana GT Road frontage, and Delhi retail belts"
    ),
    "Retail footfall, corner visibility, and parking",
    [
      "Shop tenants should evaluate corner visibility and customer parking from map pins — square footage alone misleads on retail performance.",
      "Showroom listings share commercial filters with shops — confirm ceiling height and frontage with owners before token.",
      "Compare three pins on one market street during a single site visit day — footfall context matters more than city-centre address prestige.",
    ]
  ),
  "offices-for-rent": withPeakSection(
    categorySections(
      "offices and co-working space",
      "filter office and co-working commercial categories near transport corridors",
      "Mohali IT Park, Chandigarh Sector 17 belts, and Delhi Jasola corridors"
    ),
    "Office fit for startups, SMEs, and co-working teams",
    [
      "Mohali IT Park and Aerocity teams often compare small offices with co-working desks — filter both under commercial office categories.",
      "Confirm parking ratios, internet readiness, and society NOC with owners — office listings vary on what headline rent includes.",
      "Shortlist near metro or Madhya Marg corridors when daily commute matters — map distance beats vague zone titles on classified boards.",
    ]
  ),
  "factory-shed-for-rent": withPeakSection(
    categorySections(
      "factory sheds and industrial units",
      "filter factory and industrial commercial categories on Ludhiana and Tricity maps",
      "Ludhiana Focal Point, Mohali industrial belts, and Tricity logistics corridors"
    ),
    "Manufacturing, logistics, and light industrial demand",
    [
      "Factory sheds suit production and assembly — confirm floor load, power connection, and shutter count with owners before token.",
      "Warehouse crossover listings appear on the same map — separate factory from storage intent with category filters early.",
      "Schedule Focal Point corridor visits in one day — highway access matters more than city-centre address labels for industrial tenants.",
    ]
  ),
  "commercial-property-for-rent": withPeakSection(
    categorySections(
      "commercial property",
      "filter shops, offices, warehouses, and industrial sub-categories without mixing residential pins",
      "Chandigarh Tricity markets, Ludhiana commercial roads, and Delhi business belts"
    ),
    "Shops, offices, warehouses, and industrial on one map",
    [
      "Retail, office, warehouse, and factory intents need separate filters — mixed commercial scrolling wastes time when your category is already narrow.",
      "Cross-link shops-for-rent, offices-for-rent, and warehouse landings when comparing commercial types — each inherits focused map filters.",
      "Owner-direct commercial leasing still requires site specs — confirm CAM, signage rights, and deposit refund rules in the first WhatsApp.",
    ]
  ),
  "vehicles-for-rent": withPeakSection(
    categorySections(
      "vehicles",
      "filter Vehicles for cars, bikes, and scooters separately from property pins",
      "Chandigarh Tricity, Ludhiana, and Delhi where mobility rentals cluster with student and professional demand"
    ),
    "Bikes, cars, and session-week mobility",
    [
      "Students in Kharar and Landran often pair a PG pin with a bike rental — plan housing and mobility on one RentalPins map before session start.",
      "Confirm licence requirements, deposit refund rules, and fuel policy with owners — vehicle terms vary more than standardized PG templates.",
      "Corporate relocations sometimes need a furnished flat and car rental the same week — filter both categories on the city hub map.",
    ]
  ),
  "equipment-for-rent": withPeakSection(
    categorySections(
      "equipment and machinery",
      "filter Construction Equipment, Heavy Machinery, Furniture, and Event categories",
      "Ludhiana industrial belts, Tricity project corridors, and Landran equipment inventory"
    ),
    "Construction, events, and industrial equipment",
    [
      "JCBs, scaffolding, and event gear sit in separate equipment categories — filter intent early to avoid unrelated pin noise on the map.",
      "Landran and Ludhiana industrial belts list heavy machinery alongside factory sheds — pair equipment pins with industrial property search when scaling sites.",
      "Confirm operator requirements, transport to site, and deposit terms with owners — equipment listings need explicit spec notes before hire.",
    ]
  ),
};

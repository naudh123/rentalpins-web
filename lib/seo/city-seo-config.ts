/**
 * Structured SEO copy for priority city/area money pages.
 * Edit entries here — target 1,000–1,500 words total per page over time.
 */
import { rentalAreaPath, rentalCityPath } from "@/lib/cities-config";
import { CITY_SEO_EXTRA_SECTIONS } from "@/lib/seo/city-seo-expanded-sections";

export interface CitySeoFaq {
  q: string;
  a: string;
}

export interface CitySeoBestArea {
  name: string;
  description: string;
  href?: string;
}

export interface CitySeoAverageRent {
  label: string;
  range: string;
  note?: string;
}

export interface CitySeoUniversity {
  name: string;
  description: string;
}

export interface CitySeoSection {
  title: string;
  paragraphs: string[];
}

export interface CitySEOConfig {
  /** Lookup key, e.g. in/chandigarh or in/chandigarh/mohali */
  key: string;
  placeName: string;
  intro: string[];
  bestAreas: CitySeoBestArea[];
  averageRent: CitySeoAverageRent[];
  universities: CitySeoUniversity[];
  transport: string[];
  sections?: CitySeoSection[];
  faq: CitySeoFaq[];
}

function wordCount(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

/** Approximate visible word count for a money-page SEO config. */
export function countCitySeoWords(config: CitySEOConfig): number {
  const chunks = [
    ...config.intro,
    ...config.bestAreas.flatMap((area) => [area.name, area.description]),
    ...config.averageRent.flatMap((row) => [row.label, row.range, row.note ?? ""]),
    ...config.universities.flatMap((uni) => [uni.name, uni.description]),
    ...config.transport,
    ...(config.sections ?? []).flatMap((section) => [
      section.title,
      ...section.paragraphs,
    ]),
    ...config.faq.flatMap((item) => [item.q, item.a]),
  ];
  return chunks.reduce((total, text) => total + wordCount(text), 0);
}

function key(country: string, city: string, area?: string): string {
  return area ? `${country}/${city}/${area}` : `${country}/${city}`;
}

const CITY_SEO_CONFIGS: Record<string, CitySEOConfig> = {
  [key("in", "chandigarh")]: {
    key: key("in", "chandigarh"),
    placeName: "Chandigarh Tricity",
    intro: [
      "Chandigarh Tricity is one of India's most searched rental markets — spanning Chandigarh sectors, Mohali phases, Panchkula blocks, Zirakpur, Kharar, and Landran. Tenants move across city boundaries daily for work, study, and lifestyle, so map-led discovery beats generic city-wide classifieds.",
      "RentalPins organizes Tricity inventory by locality and category. Browse rooms, PG, flats, houses, shops, offices, vehicles, and more on one live map — contact owners directly with no brokerage to search.",
      "This hub is the starting point for comparing micro-markets before you drill into Mohali, Kharar, or category pages such as flats and houses in Chandigarh.",
      "Whether you need a PG near Panjab University, a 2 BHK in Mohali Phase 11, or a shop in Sector 35, map-first search lets you compare owner-posted pins side by side — then message only the listings that match your commute and budget.",
      "Peak demand hits before university sessions and corporate transfer windows — saved searches on RentalPins help you monitor new Tricity pins in your target sector or phase without daily manual scrolling.",
    ],
    bestAreas: [
      {
        name: "Sector 17 & Sector 22",
        description:
          "Central Chandigarh sectors with strong transit, markets, and mixed residential demand — popular for working professionals and families.",
        href: rentalCityPath("in", "chandigarh"),
      },
      {
        name: "Mohali (Phase 7–11 & IT Park)",
        description:
          "Fast-growing apartment and PG market near IT corridors, airport road, and gated societies.",
        href: rentalAreaPath("in", "chandigarh", "mohali"),
      },
      {
        name: "Kharar & Landran",
        description:
          "Budget-friendly student belts near Chandigarh University with strong PG and room inventory.",
        href: rentalAreaPath("in", "chandigarh", "kharar"),
      },
      {
        name: "Panchkula sectors",
        description:
          "Planned family housing with green sectors and government-office proximity.",
        href: rentalAreaPath("in", "chandigarh", "panchkula"),
      },
      {
        name: "Zirakpur (VIP Road)",
        description:
          "Affordable apartments on the Ambala highway with quick Chandigarh access.",
        href: rentalAreaPath("in", "chandigarh", "zirakpur"),
      },
    ],
    averageRent: [
      { label: "PG / shared room", range: "₹4,000 – ₹10,000/mo", note: "Varies by food, AC, and sector" },
      { label: "1 BHK flat", range: "₹8,000 – ₹18,000/mo", note: "Higher in central sectors & Mohali societies" },
      { label: "2 BHK flat / house", range: "₹12,000 – ₹28,000/mo", note: "Furnishing and parking affect pricing" },
      { label: "Shop / small office", range: "₹15,000 – ₹60,000+/mo", note: "Footfall and road frontage drive rents" },
    ],
    universities: [
      {
        name: "Panjab University (PU)",
        description:
          "Drives PG and flat demand in Sector 14, 15, 25, and nearby student pockets across Chandigarh.",
      },
      {
        name: "PEC & CGC Landran belt",
        description:
          "Student flows extend into Landran, Kharar, and Mohali for affordable PG and shared flats.",
      },
      {
        name: "Chandigarh University (CU)",
        description:
          "Large student base in Kharar, Landran, and Mohali — PG near CU is a top search cluster.",
      },
    ],
    transport: [
      "Chandigarh has strong sector planning with quick access to inter-state bus terminals and the Tricity road network linking Mohali and Panchkula.",
      "Mohali IT Park and airport road corridors attract professionals who compare commute times across phases before signing rent.",
      "Kharar–Landran road and the Chandigarh–Ambala highway connect budget student hubs to central Tricity employment zones.",
      "Zirakpur VIP Road and Panchkula sectors attract families who work in Chandigarh or Mohali — compare commute on the map before choosing lowest headline rent alone.",
    ],
    faq: [
      {
        q: "How do I find rentals in Chandigarh without a broker?",
        a: "Open the RentalPins map for Chandigarh Tricity, filter by category and area, and contact owners directly — no brokerage to browse or inquire.",
      },
      {
        q: "Which Tricity areas are best for students?",
        a: "Kharar and Landran near Chandigarh University, Mohali IT Park belts, and Sector-adjacent PG clusters are the most searched student zones.",
      },
      {
        q: "Does RentalPins cover Mohali and Panchkula too?",
        a: "Yes — Tricity includes Mohali, Panchkula, Zirakpur, Kharar, Landran, and Banur with dedicated area pages and live listings.",
      },
      {
        q: "Can I list my property for free in Chandigarh?",
        a: "Yes. Owners post on RentalPins web or app; listings appear on the same map tenants use. Check the app for current city offers.",
      },
      {
        q: "What categories are available besides property?",
        a: "Vehicles, electronics, furniture, appliances, and equipment rentals are listed alongside property on the Tricity map.",
      },
      {
        q: "How do I compare Mohali and Chandigarh on one search?",
        a: "Open the Tricity hub map and pan between Mohali phases and Chandigarh sectors — use area pages and category filters to keep PG, flats, and commercial searches separated while you shortlist.",
      },
      {
        q: "When should I start searching for Tricity PG or flats?",
        a: "Begin two to four weeks before move-in or session start — peak weeks fill popular PG and furnished flats quickly across Kharar, Mohali, and central sectors.",
      },
    ],
  },

  [key("in", "chandigarh", "mohali")]: {
    key: key("in", "chandigarh", "mohali"),
    placeName: "Mohali",
    intro: [
      "Mohali is the fastest-growing Tricity market — driven by the IT Park, international airport, Aerocity, and phase-based residential societies. Professionals and students compare Phase 7, Phase 9, Phase 11, and IT-adjacent pockets before committing.",
      "RentalPins Mohali pages combine live listings, category shortcuts, and locality FAQs so you can evaluate apartments, PG, and office space on the map — not through broker-led feeds.",
      "Use this page when your search intent is specifically Mohali rather than broader Chandigarh sectors.",
      "Category pages for Mohali flats, houses, PG, and offices link back to live inventory here — useful when you already know property type and want locality-level depth.",
      "Corporate tenants and CU commuters both use this hub — filter PG versus society flats early so your shortlist matches house rules, food plans, and lease length you actually need.",
    ],
    bestAreas: [
      {
        name: "Phase 7 & Phase 9",
        description:
          "Established residential phases with strong flat inventory, family-friendly societies, and steady resale tenant demand.",
      },
      {
        name: "Phase 11 & Aerocity",
        description:
          "Newer developments popular with IT professionals, airport-linked commuters, and furnished corporate rentals.",
      },
      {
        name: "IT Park & Airport Road",
        description:
          "PG, co-working, and furnished flats for short commutes to major employment hubs and logistics corridors.",
      },
      {
        name: "Sunny Enclave & New Chandigarh",
        description:
          "Gated-community flats and houses with modern amenities at mid-to-premium rents compared with inner phases.",
      },
    ],
    averageRent: [
      { label: "PG near IT Park", range: "₹5,000 – ₹12,000/mo" },
      { label: "1 BHK flat", range: "₹10,000 – ₹20,000/mo" },
      { label: "2 BHK in society", range: "₹14,000 – ₹30,000/mo" },
      { label: "Co-working / small office", range: "₹8,000 – ₹40,000/mo" },
    ],
    universities: [
      {
        name: "Chandigarh University (nearby)",
        description: "Many students live in Mohali phases or commute from Kharar — PG demand spills into both markets.",
      },
      {
        name: "Coaching & professional institutes",
        description: "Tricity coaching belts support shared flats and PG around Phase 3B2 and central corridors.",
      },
    ],
    transport: [
      "Mohali phases connect to Chandigarh via Madhya Marg, airport road, and the Tricity bridge network.",
      "IT Park and Aerocity listings should be evaluated against peak-hour commute to your office, not just straight-line distance.",
      "Public transport and cab availability are strongest along Phase 5–11 spines and major market roads.",
      "Airport road traffic peaks during morning and evening office hours — weight peak-hour commute from your shortlisted phase before signing rent based on mid-day map distance alone.",
    ],
    faq: [
      {
        q: "What are the best areas to rent a flat in Mohali?",
        a: "Phase 7, Phase 9, Phase 11, and Aerocity are the most popular. Phase 3B2 and Phase 5 offer more affordable options with good IT Park connectivity.",
      },
      {
        q: "Is PG available near Mohali IT Park?",
        a: "Yes — browse PG and hostel pins near IT Park, Airport Road, and Phase 8 on the RentalPins map.",
      },
      {
        q: "Are there brokerage fees on RentalPins Mohali listings?",
        a: "No — RentalPins connects you directly with owners. There is no brokerage to search or contact.",
      },
      {
        q: "Can I rent office space in Mohali?",
        a: "Yes — co-working desks, private offices, and commercial units are listed near IT Park and Aerocity.",
      },
      {
        q: "How do I list property in Mohali?",
        a: "Post on RentalPins web or app; your pin goes live on the Mohali map for tenants searching by locality.",
      },
      {
        q: "Should I rent in Mohali or Chandigarh sectors?",
        a: "Compare both on the Tricity map — Mohali phases often offer larger flats at lower rent, while Chandigarh sectors suit tenants who prioritize central civic amenities.",
      },
      {
        q: "What should I verify before paying deposit in Mohali?",
        a: "Confirm maintenance, parking, power backup, society visitor rules, and deposit return terms — photograph existing damage at handover and share timestamped images with the owner on WhatsApp.",
      },
      {
        q: "Are furnished flats common near IT Park?",
        a: "Yes — furnished 1 BHK and corporate-friendly inventory is active near Aerocity and Phase 11; confirm lease minimums and what furniture is included before token payment.",
      },
      {
        q: "How do Mohali category pages help my search?",
        a: "Mohali flats, PG, houses, and office category hubs link to live map inventory filtered by property type — use them after you pick a phase on the area map.",
      },
    ],
  },

  [key("in", "chandigarh", "kharar")]: {
    key: key("in", "chandigarh", "kharar"),
    placeName: "Kharar",
    intro: [
      "Kharar is one of the most affordable Tricity belts — especially for Chandigarh University students and young professionals who want lower rents while staying connected to Mohali and Chandigarh.",
      "Demand concentrates on PG, shared rooms, and budget flats along Kharar town, Kharar–Landran road, Sunny Enclave, and Gillco Valley.",
      "RentalPins Kharar listings show exact map locations so you can compare walk-to-campus options versus highway-linked flats.",
      "If you are comparing CU-area PG with Mohali or Chandigarh sectors, open all three area maps and evaluate total monthly cost including food, commute, and furnishing.",
      "Kharar landlords who list exact distance to Chandigarh University gates and meal plans tend to receive fewer mismatched inquiries from parents and students.",
      "Girls PG and boys PG are separate search intents — use listing descriptions and map clusters to compare suitability, food plans, and security before paying session-start deposit.",
      "Landran road PG clusters fill quickly each July — start RentalPins map search early and message owners with confirmed CU admission dates.",
    ],
    bestAreas: [
      {
        name: "Kharar town core",
        description:
          "Dense PG and room inventory with markets and daily needs nearby — strongest walk-to-amenity options for budget renters.",
      },
      {
        name: "Kharar–Landran road",
        description:
          "Student corridor with hostels and flats serving CU and nearby institutes — highest turnover at session start.",
      },
      {
        name: "Sunny Enclave",
        description:
          "Gated flats and houses popular when groups want more space than town PG while staying CU-adjacent.",
      },
      {
        name: "Gillco Valley",
        description:
          "Residential projects with family and shared-flat demand — slightly quieter layouts than main road PG belts.",
      },
    ],
    averageRent: [
      { label: "PG / hostel (CU belt)", range: "₹3,500 – ₹8,000/mo" },
      { label: "Shared room", range: "₹2,500 – ₹6,000/mo" },
      { label: "1 BHK flat", range: "₹6,000 – ₹12,000/mo" },
      { label: "2 BHK flat", range: "₹9,000 – ₹18,000/mo" },
    ],
    universities: [
      {
        name: "Chandigarh University",
        description: "Primary demand driver — most Kharar PG searches reference CU proximity.",
      },
      {
        name: "Nearby coaching & skill institutes",
        description: "Support year-round PG turnover along Landran and Kharar road belts.",
      },
    ],
    transport: [
      "Kharar connects to Mohali and Chandigarh via Kharar–Landran road and the Ambala highway.",
      "Students often use bikes or shared cabs — factor commute time when choosing PG off the main road.",
      "Bus and auto connectivity is strongest through Kharar town and major junctions toward Landran.",
      "Many CU students split 2 BHK flats in Sunny Enclave or Gillco Valley — confirm owner occupancy limits and utility sharing rules before coordinating a group inquiry.",
    ],
    faq: [
      {
        q: "Is PG available near Chandigarh University in Kharar?",
        a: "Yes — multiple PG and hostel listings appear near CU, Kharar–Landran road, and surrounding sectors on the live map.",
      },
      {
        q: "What is the average rent for a room in Kharar?",
        a: "Rooms typically range from ₹3,000 to ₹8,000/month depending on furnishing, food, and distance from CU.",
      },
      {
        q: "Are furnished flats available in Kharar?",
        a: "Yes — 1 BHK and 2 BHK furnished options exist in Kharar town, Sunny Enclave, and Gillco Valley.",
      },
      {
        q: "How far is Kharar from Mohali IT Park?",
        a: "Roughly 20–35 minutes by road depending on phase and traffic — many renters compare both markets on RentalPins.",
      },
      {
        q: "Can owners list PG in Kharar for free?",
        a: "Yes — post on RentalPins; student-facing inventory in Kharar converts quickly when priced and located accurately on the map.",
      },
      {
        q: "How do I compare Kharar PG options before session start?",
        a: "Filter PG pins on the Kharar map, save three to five options, and message owners with your move-in date — compare food plans and walk time to CU before visiting.",
      },
      {
        q: "Is a shared flat cheaper than PG for CU students?",
        a: "Groups of three or four friends often lower per-person cost in 2 BHK flats — but budget for furnishing, utilities, and cooking; compare both paths on the Kharar map for your group size.",
      },
      {
        q: "What hidden costs should CU students watch in Kharar PG?",
        a: "Ask whether electricity, Wi‑Fi, laundry, and AC are included — effective monthly rent can exceed the advertised figure when add-ons are billed separately.",
      },
      {
        q: "Can parents compare Kharar PG on the map before visiting?",
        a: "Yes — save three to five PG pins near CU on RentalPins, message owners with your child's move-in date, and visit shortlisted options in one trip during admission week.",
      },
    ],
  },

  [key("in", "ludhiana")]: {
    key: key("in", "ludhiana"),
    placeName: "Ludhiana",
    intro: [
      "Ludhiana combines strong residential demand with active commercial and industrial leasing — from Model Town and BRS Nagar to Focal Point and Pakhowal Road.",
      "RentalPins Ludhiana hub maps owner-direct property, vehicles, and equipment so tenants can compare localities before contacting — without paying brokerage to search.",
      "Use area pages such as Model Town for premium residential intent and Focal Point for warehouse and industrial searches.",
      "Ludhiana tenants searching without brokers benefit from filtering map pins by locality first — Model Town, BRS Nagar, and Pakhowal Road rents differ even for similar BHK sizes.",
      "Industrial tenants should compare Focal Point pins against Pakhowal Road commercial stock when highway access matters more than central city address.",
      "Wholesale and manufacturing employers often house staff near Focal Point while managers choose Model Town or Sarabha Nagar — map pins help both groups shortlist without broker markup.",
      "Saved searches on the Ludhiana hub help tenants track new owner posts in Model Town or Focal Point during peak leasing weeks without daily classified scrolling.",
    ],
    bestAreas: [
      {
        name: "Model Town & BRS Nagar",
        description: "Premium residential belts with family housing and established amenities.",
        href: rentalAreaPath("in", "ludhiana", "model-town"),
      },
      {
        name: "Sarabha Nagar & Pakhowal Road",
        description: "Mixed residential and commercial corridors with steady flat demand.",
      },
      {
        name: "Focal Point & industrial belts",
        description: "Warehouse, factory shed, and logistics-linked commercial inventory.",
        href: rentalAreaPath("in", "ludhiana", "focal-point"),
      },
      {
        name: "PAU & GT Road corridors",
        description: "Student and family rentals near Punjab Agricultural University and transit spines.",
      },
    ],
    averageRent: [
      { label: "PG / room", range: "₹3,000 – ₹8,000/mo" },
      { label: "1 BHK flat", range: "₹7,000 – ₹15,000/mo" },
      { label: "2 BHK house / flat", range: "₹10,000 – ₹22,000/mo" },
      { label: "Shop / office", range: "₹12,000 – ₹50,000+/mo" },
    ],
    universities: [
      {
        name: "Punjab Agricultural University (PAU)",
        description: "Drives PG and flat demand in PAU-adjacent localities and Sarabha Nagar corridors.",
      },
      {
        name: "GNDEC & LPU (regional draw)",
        description: "Some Ludhiana renters also supply student housing linked to nearby institute belts.",
      },
    ],
    transport: [
      "Ferozepur Road, GT Road, and Pakhowal Road are major rental corridors — commute and market access define pricing.",
      "Industrial tenants prioritize highway and logistics access in Focal Point and surrounding belts.",
      "City bus and auto networks radiate from central markets — map pins help validate exact street-level convenience.",
      "PAU session start fills PG belts quickly — message Ludhiana owners with move-in date and budget band rather than passive browsing during peak weeks.",
    ],
    faq: [
      {
        q: "How do I find rentals in Ludhiana without a broker?",
        a: "Use the RentalPins Ludhiana map, filter by category and locality, and message owners directly.",
      },
      {
        q: "Which Ludhiana areas are best for families?",
        a: "Model Town, BRS Nagar, and Sarabha Nagar are popular for family flats and independent houses.",
      },
      {
        q: "Does RentalPins list warehouses in Ludhiana?",
        a: "Yes — industrial and warehouse inventory is listed under property sub-categories and dedicated industrial landing pages.",
      },
      {
        q: "What rent should I expect for a 2 BHK in Ludhiana?",
        a: "Typically ₹10,000–₹22,000/month depending on locality, furnishing, and parking — compare nearby map pins for accuracy.",
      },
      {
        q: "Can I list my Ludhiana property for free?",
        a: "Yes — owners publish on RentalPins web or app; listings sync to the same map used by local tenants.",
      },
      {
        q: "How do I compare Ludhiana localities before visiting?",
        a: "Open the Ludhiana hub map, filter by property type, and save pins in Model Town, Sarabha Nagar, or Focal Point — then message owners to confirm furnishing, parking, and deposit before site visits.",
      },
      {
        q: "Where should industrial tenants search in Ludhiana?",
        a: "Start with Focal Point and Pakhowal Road map pins — confirm ceiling height, power load, loading access, and highway proximity with owners before paying commercial token money.",
      },
      {
        q: "Are PAU-area PG and family flats mixed in search results?",
        a: "Use PG/Hostels versus flats filters on the Ludhiana map — mixing categories wastes time when student PG and family housing needs are clearly different.",
      },
      {
        q: "Does RentalPins link warehouse pages to Ludhiana inventory?",
        a: "Yes — warehouse, factory shed, and industrial landing pages connect back to live commercial pins on the Ludhiana map for owner-direct inquiries.",
      },
    ],
  },

  [key("in", "delhi")]: {
    key: key("in", "delhi"),
    placeName: "Delhi NCR",
    intro: [
      "Delhi rental demand is highly locality-segmented — student zones like Mukherjee Nagar and GTB Nagar behave differently from family belts like Dwarka and Rohini, and from mixed hubs like Jasola and Saket.",
      "RentalPins Delhi hub links city-wide search to locality pages so you can compare PG, flats, houses, shops, and offices with map context — not generic NCR feeds.",
      "Start here, then open the locality that matches your commute, budget, and property type.",
      "Delhi listings span PG rooms, builder floors, society flats, and commercial units — category filters prevent wasting time on irrelevant property types while you explore each locality map.",
      "Tenants comparing Dwarka and Rohini should open both locality maps on RentalPins and save pins in each belt before committing to a broker-led shortlist.",
      "Coaching-hub PG and family flats should never share one unfiltered shortlist — category separation on the Delhi map saves hours during peak admission and transfer seasons.",
      "Saved searches on locality maps help you catch new Dwarka or Rohini owner posts during peak transfer season without repeating NCR-wide keyword searches.",
    ],
    bestAreas: [
      {
        name: "Dwarka",
        description: "Planned sub-city with metro access and strong family apartment demand.",
        href: rentalAreaPath("in", "delhi", "dwarka"),
      },
      {
        name: "Rohini",
        description: "Large residential zone with relatively affordable flat and PG inventory.",
        href: rentalAreaPath("in", "delhi", "rohini"),
      },
      {
        name: "Mukherjee Nagar & GTB Nagar",
        description: "Coaching-belt PG and room clusters with high student turnover.",
      },
      {
        name: "Jasola & Saket",
        description: "Mixed professional and family demand near metro and office corridors.",
      },
    ],
    averageRent: [
      { label: "PG / shared room", range: "₹6,000 – ₹15,000/mo", note: "Central belts cost more" },
      { label: "1 BHK flat", range: "₹12,000 – ₹25,000/mo" },
      { label: "2 BHK flat", range: "₹18,000 – ₹40,000/mo" },
      { label: "Shop / office (local)", range: "₹20,000 – ₹1,00,000+/mo" },
    ],
    universities: [
      {
        name: "DU North Campus belt",
        description: "Mukherjee Nagar, Vijay Nagar, and GTB Nagar serve North Campus student housing.",
      },
      {
        name: "South Campus & Jasola corridors",
        description: "Professional and student demand near South Delhi metro-linked neighbourhoods.",
      },
    ],
    transport: [
      "Delhi Metro remains the primary commute anchor — prioritize listings within practical station access for your daily route.",
      "Outer areas like Dwarka and Rohini offer better rent-to-space ratios with metro and road connectivity.",
      "Coaching belts trade lower room rents for higher density — inspect listings on the map for exact block context.",
      "Summer heat and monsoon traffic amplify Delhi commute pain — evaluate pins along your actual daily route, not straight-line distance from office or campus.",
    ],
    faq: [
      {
        q: "How do I find no-broker rentals in Delhi?",
        a: "Browse RentalPins Delhi locality maps and contact OTP-verified owners directly — no brokerage to search.",
      },
      {
        q: "Which Delhi areas are best for PG near coaching institutes?",
        a: "Mukherjee Nagar, GTB Nagar, and adjacent North Campus pockets have the densest PG inventory.",
      },
      {
        q: "Is Dwarka good for family rentals?",
        a: "Yes — Dwarka is a planned sub-city with metro access and strong family apartment stock.",
      },
      {
        q: "Does RentalPins cover NCR localities?",
        a: "Delhi hub pages cover major localities; use area links for Dwarka, Rohini, and other indexed neighbourhoods.",
      },
      {
        q: "Can I list a flat in Delhi on RentalPins?",
        a: "Yes — owners post via web or app; listings appear on the Delhi map for tenants searching by area and category.",
      },
      {
        q: "How do I avoid broker markup in Delhi rentals?",
        a: "Use RentalPins locality maps to contact owners directly — the same units brokers show often appear as owner-posted pins without commission or duplicate listing fees.",
      },
      {
        q: "What deposit norms should I expect in Delhi?",
        a: "Many owners ask for one to three months' rent as security plus advance — confirm refund rules, painting charges, and notice period before transferring token money.",
      },
      {
        q: "Is Dwarka or Rohini better for metro-linked family flats?",
        a: "Both offer strong family inventory with metro access — open each locality map, save three to five pins per belt, and compare commute to your workplace before deciding on headline rent alone.",
      },
      {
        q: "Should coaching students use PG filters only in Delhi?",
        a: "Yes — when you need Mukherjee Nagar or GTB Nagar PG, filter PG/Hostels on the Delhi map so independent flats and commercial pins do not clutter your shortlist.",
      },
    ],
  },
};

export function getCitySeoConfig(
  countrySlug: string,
  citySlug: string,
  areaSlug?: string
): CitySEOConfig | null {
  const lookup = areaSlug
    ? key(countrySlug, citySlug, areaSlug)
    : key(countrySlug, citySlug);
  const base = CITY_SEO_CONFIGS[lookup];
  if (!base) return null;

  const sections = CITY_SEO_EXTRA_SECTIONS[lookup];
  return sections ? { ...base, sections } : base;
}

export function listCitySeoConfigKeys(): string[] {
  return Object.keys(CITY_SEO_CONFIGS);
}

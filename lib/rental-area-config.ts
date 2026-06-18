import { mapSearchUrl } from "@/lib/map-search-url";
import { appPath } from "@/lib/config";
import { JAIPUR_GSC_PAGES } from "@/lib/seo/jaipur-gsc-config";

export interface RentalAreaFaq {
  q: string;
  a: string;
}

export interface RentalAreaNearbyLink {
  hubSlug: string;
  areaSlug?: string;
  label: string;
}

export interface RentalAreaPageConfig {
  /** URL hub segment, e.g. mohali, delhi */
  hubSlug: string;
  /** URL sub-area segment when not a hub page */
  areaSlug?: string;
  /** data-city value for CTA tracking */
  citySlug: string;
  cityLabel: string;
  areaName: string;
  title: string;
  metaDescription: string;
  h1: string;
  intro: string;
  rentalTypes: string[];
  nearbyAreas: RentalAreaNearbyLink[];
  faqs: RentalAreaFaq[];
  mapCenter: { lat: number; lng: number; zoom: number };
  placeQuery: string;
  /** Existing canonical /rentals/in/... path for cross-link */
  legacyAreaPath?: string;
}

export const INDIAN_RENTAL_GROWTH_NOTICE =
  "RentalPins is growing listings in this area. You can browse nearby rentals on the map or list your property free.";

/** Hub slugs that use short /rentals/{hub} URLs (middleware must not legacy-redirect these). */
export const INDIAN_GSC_HUB_SLUGS = [
  "mohali",
  "kharar",
  "zirakpur",
  "delhi",
  "chandigarh-university",
  "jaipur",
] as const;

export type IndianGscHubSlug = (typeof INDIAN_GSC_HUB_SLUGS)[number];

type PageKey = string;

function key(hub: string, area?: string): PageKey {
  return area ? `${hub}/${area}` : hub;
}

const PAGES: Record<PageKey, RentalAreaPageConfig> = {
  mohali: {
    hubSlug: "mohali",
    citySlug: "mohali",
    cityLabel: "Mohali",
    areaName: "Mohali",
    title: "Flats for Rent in Mohali — Map Search, No Broker | RentalPins",
    metaDescription:
      "Find flats for rent in Mohali on the map — Phase 7, Sector 70, IT Park and Aerocity. Browse owner listings or list your Mohali property free. No broker search fee.",
    h1: "Rent in Mohali",
    intro:
      "Mohali is one of the busiest rental markets in Chandigarh Tricity — popular with IT professionals, families and students. Search flats for rent in Mohali, PG near IT Park, independent houses and rooms across phases and sectors on the RentalPins map with direct owner contact.",
    rentalTypes: [
      "Flats and apartments for rent",
      "PG and hostels",
      "Independent houses and villas",
      "Rooms for working professionals",
    ],
    nearbyAreas: [
      { hubSlug: "mohali", areaSlug: "phase-7", label: "Phase 7 Mohali" },
      { hubSlug: "mohali", areaSlug: "sector-70", label: "Sector 70" },
      { hubSlug: "kharar", label: "Kharar" },
      { hubSlug: "zirakpur", label: "Zirakpur" },
    ],
    faqs: [
      {
        q: "How do I find flats for rent in Mohali without a broker?",
        a: "Open the RentalPins map centred on Mohali, filter by flats or PG, and message owners directly from listing pins. There is no tenant search commission.",
      },
      {
        q: "Which Mohali areas are best for families?",
        a: "Phase 7, Phase 9, Phase 11 and Aerocity are commonly searched for family flats. Sector 70 and nearby belts suit mixed professional demand.",
      },
      {
        q: "Is PG available near Mohali IT Park?",
        a: "Yes — owners list PG and shared rooms near IT Park, Airport Road and Phase 8. Use PG filters on the map to shortlist.",
      },
      {
        q: "Can I list my property in Mohali for free?",
        a: "Yes. Owners can post flats, PG, houses and rooms through the RentalPins listing flow at no search fee to tenants.",
      },
      {
        q: "What if I do not see many pins in Mohali yet?",
        a: "Inventory grows as owners list. Browse nearby phases and sectors on the map or list your property to appear when tenants search.",
      },
    ],
    mapCenter: { lat: 30.7046, lng: 76.7179, zoom: 12 },
    placeQuery: "Mohali, Punjab",
    legacyAreaPath: "/rentals/in/chandigarh/mohali",
  },
  "mohali/sector-70": {
    hubSlug: "mohali",
    areaSlug: "sector-70",
    citySlug: "mohali",
    cityLabel: "Mohali",
    areaName: "Sector 70, Mohali",
    title: "Flat for Rent in Sector 70 Mohali — Map Search | RentalPins",
    metaDescription:
      "Flat for rent in Sector 70 Mohali — 2 BHK flats, PG and rooms on the owner map. Browse Sector 70 rentals or list your property free on RentalPins.",
    h1: "Rent in Sector 70, Mohali",
    intro:
      "Sector 70 Mohali attracts tenants looking for mid-budget flats, shared apartments and family homes with good connectivity toward Chandigarh and the airport corridor. Use RentalPins to browse Sector 70 listings on the map or list your property for tenants searching this sector.",
    rentalTypes: [
      "2 BHK and 3 BHK flats",
      "Rooms on rent",
      "PG for students and professionals",
      "Builder floors and houses",
    ],
    nearbyAreas: [
      { hubSlug: "mohali", areaSlug: "sector-67", label: "Sector 67" },
      { hubSlug: "mohali", areaSlug: "phase-7", label: "Phase 7" },
      { hubSlug: "mohali", label: "All Mohali" },
      { hubSlug: "zirakpur", label: "Zirakpur" },
    ],
    faqs: [
      {
        q: "What rentals are common in Sector 70 Mohali?",
        a: "Tenants typically search for 2–3 BHK flats, shared rooms and PG options with road links toward Zirakpur and central Mohali.",
      },
      {
        q: "How do I search Sector 70 on the map?",
        a: "Use Browse Rentals on Map — the view opens centred on Sector 70 so you can pan and filter by flat, PG or house.",
      },
      {
        q: "Are Sector 70 listings owner-direct?",
        a: "RentalPins connects you to owners who posted the pin. There is no brokerage charge to browse or message.",
      },
      {
        q: "Can owners list a Sector 70 flat for free?",
        a: "Yes. Post your flat or PG with accurate Sector 70 locality detail so map search surfaces your pin.",
      },
      {
        q: "What if inventory looks thin?",
        a: "Browse neighbouring Sector 67 and Phase 7 on the map, or list early while tenant demand in Sector 70 is growing.",
      },
    ],
    mapCenter: { lat: 30.6795, lng: 76.7355, zoom: 14 },
    placeQuery: "Sector 70, Mohali",
    legacyAreaPath: "/rentals/in/chandigarh/mohali",
  },
  "mohali/sector-67": {
    hubSlug: "mohali",
    areaSlug: "sector-67",
    citySlug: "mohali",
    cityLabel: "Mohali",
    areaName: "Sector 67, Mohali",
    title: "Flat for Rent in Sector 67 Mohali — No Broker | RentalPins",
    metaDescription:
      "Flat for rent in Sector 67 Mohali — affordable flats, PG and shared rooms on the map. Contact owners directly or list your Sector 67 property free.",
    h1: "Flat for rent in Sector 67, Mohali",
    intro:
      "Sector 67 Mohali is searched for affordable flats, shared rooms and PG options close to Zirakpur and inner Mohali corridors. RentalPins helps tenants compare owner-posted pins and helps landlords list Sector 67 property without broker middlemen.",
    rentalTypes: [
      "Flats and 1–2 BHK apartments",
      "PG and paying guest rooms",
      "Shared flats for professionals",
      "Independent portions",
    ],
    nearbyAreas: [
      { hubSlug: "mohali", areaSlug: "sector-70", label: "Sector 70" },
      { hubSlug: "mohali", areaSlug: "phase-7", label: "Phase 7" },
      { hubSlug: "mohali", label: "All Mohali" },
      { hubSlug: "zirakpur", label: "Zirakpur" },
    ],
    faqs: [
      {
        q: "Is Sector 67 good for budget flats?",
        a: "Many tenants shortlist Sector 67 for relatively affordable flats compared with inner Phase belts — compare pins on the map before visiting.",
      },
      {
        q: "How do I find a flat for rent in Sector 67?",
        a: "Open the map centred on Sector 67, filter Property → flats, and message owners from pins that match your budget.",
      },
      {
        q: "Do brokers list on RentalPins?",
        a: "Owners and authorised listers post directly. Tenants do not pay a search commission to RentalPins.",
      },
      {
        q: "Can I list PG in Sector 67?",
        a: "Yes. Use the PG category and mention food plan, sharing and exact street or sector context in the description.",
      },
      {
        q: "Nearby areas to try on the map?",
        a: "Sector 70, Phase 7 and Zirakpur are one tap away on linked area pages if Sector 67 inventory is still growing.",
      },
    ],
    mapCenter: { lat: 30.691, lng: 76.726, zoom: 14 },
    placeQuery: "Sector 67, Mohali",
    legacyAreaPath: "/rentals/in/chandigarh/mohali",
  },
  "mohali/phase-7": {
    hubSlug: "mohali",
    areaSlug: "phase-7",
    citySlug: "mohali",
    cityLabel: "Mohali",
    areaName: "Phase 7, Mohali",
    title: "Flats for Rent in Phase 7 Mohali — Owner Map Listings | RentalPins",
    metaDescription:
      "Flats for rent in Phase 7 Mohali — family apartments, PG and furnished flats on the map. Browse Phase 7 owner pins or list your flat free on RentalPins.",
    h1: "Flats for rent in Phase 7, Mohali",
    intro:
      "Phase 7 Mohali is among the most searched family and professional rental belts in the Tricity — gated societies, furnished flats and PG options near daily commute corridors. Browse Phase 7 listings on RentalPins or list your flat for tenants already searching this phase.",
    rentalTypes: [
      "Furnished and semi-furnished flats",
      "Family 2 BHK and 3 BHK homes",
      "PG near Phase 7 societies",
      "Rooms for IT Park commuters",
    ],
    nearbyAreas: [
      { hubSlug: "mohali", areaSlug: "sector-70", label: "Sector 70" },
      { hubSlug: "mohali", label: "All Mohali" },
      { hubSlug: "kharar", label: "Kharar" },
      { hubSlug: "chandigarh-university", label: "Near CU" },
    ],
    faqs: [
      {
        q: "Why is Phase 7 popular for flats?",
        a: "Strong society inventory, family-friendly layout and connectivity toward Chandigarh and IT Park make Phase 7 a top flat-search cluster.",
      },
      {
        q: "How do I compare Phase 7 flats on RentalPins?",
        a: "Open the map centred on Phase 7, filter flats, and open pins to compare rent, furnishing notes and exact society names.",
      },
      {
        q: "Are furnished flats listed?",
        a: "Owners disclose furnishing in listings. Filter and read descriptions before scheduling visits.",
      },
      {
        q: "Can students find PG near Phase 7?",
        a: "Some PG inventory appears near Phase belts — also check Kharar and CU-area pages if campus commute matters.",
      },
      {
        q: "How do owners list in Phase 7?",
        a: "Use List Your Property Free, drop the pin accurately in Phase 7 and include society and phase in the title.",
      },
    ],
    mapCenter: { lat: 30.7075, lng: 76.801, zoom: 14 },
    placeQuery: "Phase 7, Mohali",
    legacyAreaPath: "/rentals/in/chandigarh/mohali",
  },
  kharar: {
    hubSlug: "kharar",
    citySlug: "kharar",
    cityLabel: "Kharar",
    areaName: "Kharar",
    title: "Rent in Kharar — PG, Flats & Rooms Near CU | RentalPins",
    metaDescription:
      "Rent in Kharar — PG, hostels, flats and rooms for students and professionals. Affordable rentals near Chandigarh University on the RentalPins map.",
    h1: "Rent in Kharar",
    intro:
      "Kharar is the affordable rental gateway to Chandigarh Tricity — especially for Chandigarh University students and young professionals. Search PG near CU, hostels in Kharar, student flats and rooms on rent across Kharar town and the Landran corridor on RentalPins.",
    rentalTypes: [
      "PG and hostels near CU",
      "Student flats and shared rooms",
      "Affordable 1–2 BHK rentals",
      "Bikes and scooters on rent",
    ],
    nearbyAreas: [
      { hubSlug: "kharar", areaSlug: "chandigarh-university", label: "Near CU campus" },
      { hubSlug: "chandigarh-university", label: "PG near CU" },
      { hubSlug: "mohali", label: "Mohali" },
      { hubSlug: "zirakpur", label: "Zirakpur" },
    ],
    faqs: [
      {
        q: "Is Kharar good for PG near Chandigarh University?",
        a: "Yes. Kharar town and the Kharar–Landran road belt carry heavy PG and hostel demand from CU students — filter PG on the map.",
      },
      {
        q: "What is affordable rent in Kharar?",
        a: "Budget varies by food plan, AC and walk distance to campus. Compare multiple owner pins on the map before paying deposit.",
      },
      {
        q: "Can I find hostels in Kharar?",
        a: "Owners list PG and hostel-style rooms. Read listing detail for curfew, meals and sharing.",
      },
      {
        q: "How do I list PG in Kharar?",
        a: "Post free through RentalPins with accurate Kharar locality names and distance cues to CU or Kharar bus stand.",
      },
      {
        q: "Should I also check the CU-specific page?",
        a: "Yes — use the Chandigarh University area page for campus-adjacent PG and student flat searches.",
      },
    ],
    mapCenter: { lat: 30.746, lng: 76.6486, zoom: 13 },
    placeQuery: "Kharar, Punjab",
    legacyAreaPath: "/rentals/in/chandigarh/kharar",
  },
  "kharar/chandigarh-university": {
    hubSlug: "kharar",
    areaSlug: "chandigarh-university",
    citySlug: "kharar",
    cityLabel: "Kharar",
    areaName: "Chandigarh University area",
    title: "PG Near Chandigarh University — Hostels & Flats in Kharar | RentalPins",
    metaDescription:
      "PG near Chandigarh University, hostels in Kharar and student flats on the CU belt. Browse affordable rentals on the map — contact owners directly.",
    h1: "PG near Chandigarh University",
    intro:
      "Students and parents search PG near Chandigarh University, hostels in Kharar and affordable flats within a short commute of campus. RentalPins maps owner-posted pins along the Kharar–Landran corridor so you can compare food plans, sharing and walk distance before messaging landlords.",
    rentalTypes: [
      "Boys and girls PG near CU",
      "Hostels and shared dorm-style rooms",
      "Student flats and paying guest",
      "Single and double occupancy rooms",
    ],
    nearbyAreas: [
      { hubSlug: "chandigarh-university", label: "CU rentals hub" },
      { hubSlug: "kharar", label: "All Kharar" },
      { hubSlug: "mohali", label: "Mohali" },
      { hubSlug: "mohali", areaSlug: "phase-7", label: "Phase 7" },
    ],
    faqs: [
      {
        q: "How close can I find PG to Chandigarh University?",
        a: "Listings along Kharar–Landran road and nearby sectors vary in walk and ride time — check each pin's location on the map.",
      },
      {
        q: "What should I ask a PG owner near CU?",
        a: "Confirm food plan, deposit refund, AC charges, curfew and whether the listing is girls-only or boys-only before visiting.",
      },
      {
        q: "Are hostels in Kharar listed here?",
        a: "Owners post PG and hostel-style accommodation. Use filters and keywords on the map to narrow results.",
      },
      {
        q: "Can families rent flats near CU?",
        a: "Some flats suit student groups or family stays — filter flats on the map and read furnishing and lease notes.",
      },
      {
        q: "I'm a PG owner near campus — how do I list?",
        a: "List Your Property Free with CU/Kharar locality in the title so students find your pin in PG searches.",
      },
    ],
    mapCenter: { lat: 30.741, lng: 76.688, zoom: 14 },
    placeQuery: "Chandigarh University, Kharar",
    legacyAreaPath: "/rentals/in/chandigarh/kharar",
  },
  "chandigarh-university": {
    hubSlug: "chandigarh-university",
    citySlug: "kharar",
    cityLabel: "Kharar / CU",
    areaName: "Chandigarh University",
    title: "PG Near Chandigarh University — Rooms & Hostels | RentalPins",
    metaDescription:
      "PG near Chandigarh University and affordable student rooms in Kharar. Map search for hostels, PG and flats — no broker fee to tenants.",
    h1: "PG near Chandigarh University",
    intro:
      "This hub targets tenants searching PG near Chandigarh University, hostel stays and budget flats around the CU campus belt. RentalPins connects students with owner-posted listings in Kharar and Landran — browse on the map and message landlords directly.",
    rentalTypes: [
      "PG near CU campus",
      "Hostels in Kharar",
      "Shared flats for students",
      "Rooms on rent",
    ],
    nearbyAreas: [
      { hubSlug: "kharar", areaSlug: "chandigarh-university", label: "CU area (Kharar)" },
      { hubSlug: "kharar", label: "Kharar town" },
      { hubSlug: "mohali", label: "Mohali" },
      { hubSlug: "zirakpur", label: "Zirakpur" },
    ],
    faqs: [
      {
        q: "Where do CU students usually rent?",
        a: "Kharar town, Kharar–Landran road and nearby belts carry most PG and hostel inventory within commute of campus.",
      },
      {
        q: "How is this page different from the Kharar CU sub-page?",
        a: "Both focus on campus-adjacent demand. Use the map CTAs — they open similar CU-centred search views.",
      },
      {
        q: "Can I find affordable PG without brokers?",
        a: "Yes. RentalPins is owner-direct discovery — compare pins and contact only shortlisted landlords.",
      },
      {
        q: "When do listings peak for CU?",
        a: "Demand rises before academic sessions. Save map searches and check back as owners publish new pins.",
      },
      {
        q: "I'm an owner — should I list now?",
        a: "Yes. Early listings capture session-start searches for PG near Chandigarh University.",
      },
    ],
    mapCenter: { lat: 30.741, lng: 76.688, zoom: 14 },
    placeQuery: "Chandigarh University, Punjab",
    legacyAreaPath: "/rentals/in/chandigarh/kharar",
  },
  zirakpur: {
    hubSlug: "zirakpur",
    citySlug: "zirakpur",
    cityLabel: "Zirakpur",
    areaName: "Zirakpur",
    title: "House for Rent in Zirakpur — Flats, PG & Rooms | RentalPins",
    metaDescription:
      "House for rent in Zirakpur, flats and PG near Chandigarh border. Browse owner listings on the map — families and professionals welcome.",
    h1: "House for rent in Zirakpur",
    intro:
      "Zirakpur sits on the Chandigarh–Punjab border with strong demand for houses, builder floors, flats and PG from families and commuters. Search house on rent in Zirakpur, apartments and rooms across Gazipur, Baltana and highway belts on RentalPins with direct owner contact.",
    rentalTypes: [
      "Independent houses and builder floors",
      "Flats and apartments",
      "PG and shared rooms",
      "Family 2 BHK and 3 BHK homes",
    ],
    nearbyAreas: [
      { hubSlug: "mohali", areaSlug: "sector-70", label: "Sector 70 Mohali" },
      { hubSlug: "mohali", label: "Mohali" },
      { hubSlug: "kharar", label: "Kharar" },
      { hubSlug: "delhi", label: "Delhi rentals" },
    ],
    faqs: [
      {
        q: "Is Zirakpur good for family houses?",
        a: "Many families choose Zirakpur for larger homes and relative value versus inner Chandigarh — compare house pins on the map.",
      },
      {
        q: "How do I find a house for rent in Zirakpur?",
        a: "Open the Zirakpur map view, filter houses or flats, and shortlist owner pins with accurate society or locality names.",
      },
      {
        q: "Are PG options available in Zirakpur?",
        a: "Yes — PG and room inventory appears near highway and society clusters. Filter PG/Hostels on the map.",
      },
      {
        q: "Can I commute to Chandigarh from Zirakpur rentals?",
        a: "Many tenants do. Check each pin's location relative to your daily route before finalising.",
      },
      {
        q: "How do owners list in Zirakpur?",
        a: "Use List Your Property Free with Zirakpur locality detail in the title and description.",
      },
    ],
    mapCenter: { lat: 30.6434, lng: 76.8085, zoom: 13 },
    placeQuery: "Zirakpur, Punjab",
    legacyAreaPath: "/rentals/in/chandigarh/zirakpur",
  },
  delhi: {
    hubSlug: "delhi",
    citySlug: "delhi",
    cityLabel: "Delhi",
    areaName: "Delhi",
    title: "Apartments for Rent in Delhi — PG, Flats & Rooms | RentalPins",
    metaDescription:
      "Apartments for rent in Delhi — student PG in North Campus belts, family flats in Dwarka and rooms across Delhi localities. Browse the map on RentalPins.",
    h1: "Apartments for rent in Delhi",
    intro:
      "Delhi rental demand spans student PG in Mukherjee Nagar and GTB Nagar, family apartments in Dwarka, and shared flats near Hudson Lane. RentalPins maps owner-posted pins across these high-intent localities — browse apartments for rent in Delhi without paying broker search fees.",
    rentalTypes: [
      "Apartments and flats for families",
      "PG and student rooms",
      "Coaching-hub rentals",
      "Builder floors and independent homes",
    ],
    nearbyAreas: [
      { hubSlug: "delhi", areaSlug: "mukherjee-nagar", label: "Mukherjee Nagar" },
      { hubSlug: "delhi", areaSlug: "gtb-nagar", label: "GTB Nagar" },
      { hubSlug: "delhi", areaSlug: "dwarka", label: "Dwarka" },
      { hubSlug: "delhi", areaSlug: "hudson-lane", label: "Hudson Lane" },
    ],
    faqs: [
      {
        q: "Which Delhi areas are on RentalPins?",
        a: "This hub links to Mukherjee Nagar, GTB Nagar, Dwarka, Hudson Lane and the wider Delhi map for owner-posted inventory.",
      },
      {
        q: "How do I find apartments for rent in Delhi?",
        a: "Open the Delhi map, set your locality and filter flats or PG depending on student versus family needs.",
      },
      {
        q: "Is PG available without brokers?",
        a: "Owners post PG and rooms directly. Message from the pin — RentalPins does not charge tenants a search commission.",
      },
      {
        q: "Dwarka vs North Campus for rentals?",
        a: "Dwarka suits family metro-linked flats; Mukherjee Nagar and GTB Nagar suit coaching and university student PG.",
      },
      {
        q: "What if my locality has few pins?",
        a: "Browse adjacent areas on the map or list your property free while Delhi inventory grows.",
      },
    ],
    mapCenter: { lat: 28.6139, lng: 77.209, zoom: 11 },
    placeQuery: "Delhi, India",
    legacyAreaPath: "/rentals/in/delhi",
  },
  "delhi/mukherjee-nagar": {
    hubSlug: "delhi",
    areaSlug: "mukherjee-nagar",
    citySlug: "delhi",
    cityLabel: "Delhi",
    areaName: "Mukherjee Nagar",
    title: "PG in Mukherjee Nagar — Flats & Student Rooms | RentalPins",
    metaDescription:
      "PG in Mukherjee Nagar, flats and student rooms near North Campus coaching belt. Browse owner listings on the map — direct contact on RentalPins.",
    h1: "PG in Mukherjee Nagar",
    intro:
      "Mukherjee Nagar is one of Delhi's densest student rental markets — UPSC coaching hubs, shared PG and flats for aspirants and university students. Find PG in Mukherjee Nagar, single rooms and shared flats on the RentalPins map with owner-direct messaging.",
    rentalTypes: [
      "PG for students and aspirants",
      "Shared flats and rooms",
      "Single occupancy rooms",
      "Coaching-adjacent rentals",
    ],
    nearbyAreas: [
      { hubSlug: "delhi", areaSlug: "gtb-nagar", label: "GTB Nagar" },
      { hubSlug: "delhi", areaSlug: "hudson-lane", label: "Hudson Lane" },
      { hubSlug: "delhi", label: "All Delhi" },
      { hubSlug: "delhi", areaSlug: "dwarka", label: "Dwarka" },
    ],
    faqs: [
      {
        q: "Is Mukherjee Nagar only for PG?",
        a: "PG dominates demand, but shared flats and single rooms are also listed — filter on the map by property type.",
      },
      {
        q: "How do I compare PG in Mukherjee Nagar?",
        a: "Open pins on the map and compare food plan, sharing, AC and deposit terms before visiting.",
      },
      {
        q: "Are flats in Mukherjee Nagar available?",
        a: "Yes — some flats suit student groups. Use flat filters and read occupancy rules in listings.",
      },
      {
        q: "Can PG owners list for free?",
        a: "Yes. Accurate Mukherjee Nagar addressing in your title helps coaching-belt tenants find your pin.",
      },
      {
        q: "Nearby student areas?",
        a: "GTB Nagar and Hudson Lane are linked below for cross-neighbourhood map search.",
      },
    ],
    mapCenter: { lat: 28.7007, lng: 77.2059, zoom: 14 },
    placeQuery: "Mukherjee Nagar, Delhi",
    legacyAreaPath: "/rentals/in/delhi/mukherjee-nagar",
  },
  "delhi/gtb-nagar": {
    hubSlug: "delhi",
    areaSlug: "gtb-nagar",
    citySlug: "delhi",
    cityLabel: "Delhi",
    areaName: "GTB Nagar",
    title: "PG & Flats in GTB Nagar — Student Rentals Delhi | RentalPins",
    metaDescription:
      "Rent in GTB Nagar near North Campus — PG, rooms and shared flats for students. Map search with direct owner contact on RentalPins.",
    h1: "Rent in GTB Nagar",
    intro:
      "GTB Nagar sits in Delhi's North Campus student belt with steady demand for PG, shared flats and single rooms. Tenants searching GTB Nagar rentals can browse owner pins on RentalPins and contact landlords without broker search fees.",
    rentalTypes: [
      "PG near North Campus",
      "Shared student flats",
      "Single and double rooms",
      "Coaching commuter rentals",
    ],
    nearbyAreas: [
      { hubSlug: "delhi", areaSlug: "mukherjee-nagar", label: "Mukherjee Nagar" },
      { hubSlug: "delhi", areaSlug: "hudson-lane", label: "Hudson Lane" },
      { hubSlug: "delhi", label: "All Delhi" },
      { hubSlug: "delhi", areaSlug: "dwarka", label: "Dwarka" },
    ],
    faqs: [
      {
        q: "Who rents in GTB Nagar?",
        a: "Most demand comes from Delhi University students and coaching aspirants seeking walkable PG and shared rooms.",
      },
      {
        q: "How do I find PG in GTB Nagar?",
        a: "Use Browse Rentals on Map with PG filters centred on GTB Nagar.",
      },
      {
        q: "Are brokers involved?",
        a: "RentalPins focuses on owner-posted discovery. Tenants message listers directly from map pins.",
      },
      {
        q: "Can I list a GTB Nagar PG?",
        a: "Yes — list free and include food, gender policy and nearest gate landmarks.",
      },
      {
        q: "Also check Mukherjee Nagar?",
        a: "Yes — many tenants compare both belts before choosing a PG.",
      },
    ],
    mapCenter: { lat: 28.6982, lng: 77.2058, zoom: 14 },
    placeQuery: "GTB Nagar, Delhi",
    legacyAreaPath: "/rentals/in/delhi/gtb-nagar",
  },
  "delhi/dwarka": {
    hubSlug: "delhi",
    areaSlug: "dwarka",
    citySlug: "delhi",
    cityLabel: "Delhi",
    areaName: "Dwarka",
    title: "Flats for Rent in Dwarka — Family Apartments Delhi | RentalPins",
    metaDescription:
      "Flats for rent in Dwarka — family apartments, builder floors and metro-linked homes. Browse Dwarka rentals on the map with direct owner contact.",
    h1: "Flats for rent in Dwarka",
    intro:
      "Dwarka is a planned West Delhi sub-city popular with families seeking metro-linked apartments, builder floors and gated society flats. Search flats for rent in Dwarka on RentalPins, compare owner pins by sector and message landlords directly.",
    rentalTypes: [
      "Family 2 BHK and 3 BHK flats",
      "Builder floors and apartments",
      "Society flats near metro",
      "Spacious homes for long-term lease",
    ],
    nearbyAreas: [
      { hubSlug: "delhi", label: "All Delhi" },
      { hubSlug: "delhi", areaSlug: "mukherjee-nagar", label: "Mukherjee Nagar" },
      { hubSlug: "delhi", areaSlug: "gtb-nagar", label: "GTB Nagar" },
      { hubSlug: "mohali", label: "Mohali" },
    ],
    faqs: [
      {
        q: "Is Dwarka good for family flats?",
        a: "Yes — planned sectors, metro access and society inventory make Dwarka a top family rental belt in Delhi.",
      },
      {
        q: "How do I search Dwarka by sector?",
        a: "Pan the Dwarka-centred map and read society or sector names on each owner pin.",
      },
      {
        q: "Are PG options common in Dwarka?",
        a: "Dwarka is mainly family flat demand; student PG is denser in North Campus belts linked on this page.",
      },
      {
        q: "Do owners pay to list in Dwarka?",
        a: "Listing is free for owners during growth — tenants browse without search commission.",
      },
      {
        q: "Society charges and rent?",
        a: "Owners should disclose society move-in rules in the listing; confirm fees before signing.",
      },
    ],
    mapCenter: { lat: 28.5921, lng: 77.046, zoom: 13 },
    placeQuery: "Dwarka, Delhi",
    legacyAreaPath: "/rentals/in/delhi/dwarka",
  },
  "delhi/hudson-lane": {
    hubSlug: "delhi",
    areaSlug: "hudson-lane",
    citySlug: "delhi",
    cityLabel: "Delhi",
    areaName: "Hudson Lane",
    title: "PG & Rooms in Hudson Lane — Student Rentals Delhi | RentalPins",
    metaDescription:
      "PG and shared flats in Hudson Lane near North Campus. Student rooms on rent — browse the map and contact owners on RentalPins.",
    h1: "PG and rooms in Hudson Lane",
    intro:
      "Hudson Lane is a classic Delhi University student rental pocket — PG, shared flats and single rooms with strong food and café footfall. Find Hudson Lane PG and student rooms on the RentalPins map with direct owner contact.",
    rentalTypes: [
      "PG and paying guest rooms",
      "Shared flats for students",
      "Single occupancy near North Campus",
      "Short-stay friendly rooms",
    ],
    nearbyAreas: [
      { hubSlug: "delhi", areaSlug: "gtb-nagar", label: "GTB Nagar" },
      { hubSlug: "delhi", areaSlug: "mukherjee-nagar", label: "Mukherjee Nagar" },
      { hubSlug: "delhi", label: "All Delhi" },
      { hubSlug: "delhi", areaSlug: "dwarka", label: "Dwarka" },
    ],
    faqs: [
      {
        q: "What rentals are popular on Hudson Lane?",
        a: "PG and shared flats for students dominate — compare food plans and curfew on owner pins.",
      },
      {
        q: "How close is Hudson Lane to North Campus?",
        a: "It is a core student belt — still verify exact walking distance per listing on the map.",
      },
      {
        q: "Can I find a single room in Hudson Lane?",
        a: "Yes when owners publish room inventory. Filter and message from pins.",
      },
      {
        q: "Listing a Hudson Lane PG?",
        a: "Post free with Hudson Lane in the title and clear gender and food policies.",
      },
      {
        q: "Also search GTB Nagar?",
        a: "Many students compare Hudson Lane, GTB Nagar and Mukherjee Nagar together.",
      },
    ],
    mapCenter: { lat: 28.6964, lng: 77.205, zoom: 15 },
    placeQuery: "Hudson Lane, Delhi",
    legacyAreaPath: "/rentals/in/delhi/hudson-lane",
  },
  ...JAIPUR_GSC_PAGES,
};

export const INDIAN_GSC_PAGE_KEYS = Object.keys(PAGES);

export function getIndianRentalPageConfig(
  hubSlug: string,
  areaSlug?: string
): RentalAreaPageConfig | null {
  return PAGES[key(hubSlug, areaSlug)] ?? null;
}

export function indianRentalPagePath(hubSlug: string, areaSlug?: string): string {
  return areaSlug ? `/rentals/${hubSlug}/${areaSlug}` : `/rentals/${hubSlug}`;
}

/** True when pathname is a short GSC hub or sub-area (not /rentals/in/...). */
export function isIndianGscRentalPath(pathname: string): boolean {
  const segments = pathname.split("/").filter(Boolean);
  if (segments[0] !== "rentals" || segments.length < 2 || segments.length > 3) {
    return false;
  }
  const hub = segments[1];
  if (!INDIAN_GSC_HUB_SLUGS.includes(hub as IndianGscHubSlug)) {
    return false;
  }
  if (segments.length === 2) {
    return Boolean(PAGES[hub]);
  }
  return Boolean(PAGES[key(hub, segments[2])]);
}

export function getIndianGscSitemapPaths(): string[] {
  return INDIAN_GSC_PAGE_KEYS.map((k) => {
    const slash = k.indexOf("/");
    if (slash === -1) return indianRentalPagePath(k);
    return indianRentalPagePath(k.slice(0, slash), k.slice(slash + 1));
  });
}

export function indianRentalMapHref(config: RentalAreaPageConfig): string {
  const { lat, lng, zoom } = config.mapCenter;
  const keywords = config.rentalTypes.some((t) => /pg|hostel/i.test(t))
    ? "PG flat room"
    : "flat PG room";
  const path = mapSearchUrl(
    lat,
    lng,
    zoom,
    undefined,
    "Property",
    undefined,
    keywords,
    config.placeQuery
  );
  return appPath(path);
}

export function indianRentalPostHref(): string {
  return appPath("/post");
}

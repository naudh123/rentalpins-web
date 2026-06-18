import type { RentalAreaPageConfig } from "@/lib/rental-area-config";

type JaipurGscKey =
  | "jaipur"
  | "jaipur/malviya-nagar"
  | "jaipur/vaishali-nagar"
  | "jaipur/mansarovar"
  | "jaipur/jagatpura"
  | "jaipur/c-scheme"
  | "jaipur/raja-park"
  | "jaipur/sitapura"
  | "jaipur/tonk-road"
  | "jaipur/bani-park"
  | "jaipur/vidhyadhar-nagar";

function link(hubSlug: string, areaSlug: string, label: string) {
  return { hubSlug, areaSlug, label };
}

function hubLink(label: string) {
  return { hubSlug: "jaipur", label };
}

/** Short /rentals/jaipur/* GSC landing configs — canonical inventory at /rentals/in/jaipur/… */
export const JAIPUR_GSC_PAGES: Record<JaipurGscKey, RentalAreaPageConfig> = {
  jaipur: {
    hubSlug: "jaipur",
    citySlug: "jaipur",
    cityLabel: "Jaipur",
    areaName: "Jaipur",
    title: "Flats for Rent in Jaipur — PG, Rooms & Map Search | RentalPins",
    metaDescription:
      "Find flats for rent in Jaipur — Malviya Nagar, Vaishali Nagar, Mansarovar, Jagatpura, C-Scheme and more. Browse owner listings on the map without broker search fees.",
    h1: "Rent in Jaipur",
    intro:
      "Jaipur is one of Rajasthan's busiest rental markets — students and IT professionals in Malviya Nagar and Jagatpura, families in Vaishali Nagar and Mansarovar, and premium central demand in C-Scheme and Raja Park. Search flats, PG, rooms and houses across Pink City localities on the RentalPins map with direct owner contact.",
    rentalTypes: [
      "Flats and apartments for rent",
      "PG and hostels for students",
      "Independent houses and builder floors",
      "Rooms for working professionals",
      "Shops and office space on main corridors",
    ],
    nearbyAreas: [
      link("jaipur", "malviya-nagar", "Malviya Nagar"),
      link("jaipur", "vaishali-nagar", "Vaishali Nagar"),
      link("jaipur", "mansarovar", "Mansarovar"),
      link("jaipur", "jagatpura", "Jagatpura"),
      link("jaipur", "c-scheme", "C-Scheme"),
      link("jaipur", "sitapura", "Sitapura"),
    ],
    faqs: [
      {
        q: "How do I find flats for rent in Jaipur without a broker?",
        a: "Open the RentalPins Jaipur map, filter by flats or PG, and message owners directly from listing pins. There is no tenant search commission.",
      },
      {
        q: "Which Jaipur areas are best for students?",
        a: "Malviya Nagar, Jagatpura and Sitapura see high PG and room demand near colleges and IT corridors. Compare pins on the map before visiting.",
      },
      {
        q: "Which areas suit family flats in Jaipur?",
        a: "Vaishali Nagar, Mansarovar and Vidhyadhar Nagar are popular for gated societies and builder floors. C-Scheme and Raja Park skew premium central.",
      },
      {
        q: "Is PG available near Sitapura and Jagatpura?",
        a: "Yes — owners list PG and shared rooms near Sitapura industrial belt and Jagatpura IT corridors. Use PG filters on the map.",
      },
      {
        q: "Can I list my Jaipur property for free?",
        a: "Yes. Owners post flats, PG, houses and rooms through RentalPins at no search fee to tenants.",
      },
    ],
    mapCenter: { lat: 26.9124, lng: 75.7873, zoom: 12 },
    placeQuery: "Jaipur, Rajasthan",
    legacyAreaPath: "/rentals/in/jaipur",
  },
  "jaipur/malviya-nagar": {
    hubSlug: "jaipur",
    areaSlug: "malviya-nagar",
    citySlug: "jaipur",
    cityLabel: "Jaipur",
    areaName: "Malviya Nagar",
    title: "PG & Flats in Malviya Nagar Jaipur — Map Search | RentalPins",
    metaDescription:
      "PG in Malviya Nagar Jaipur, flats and rooms near MNIT and WTP. Browse owner listings on the map — direct contact on RentalPins.",
    h1: "Rent in Malviya Nagar, Jaipur",
    intro:
      "Malviya Nagar combines universities, coaching institutes and IT offices — huge demand for PG, single rooms and compact flats along JLN Marg and Airport Road. Find PG in Malviya Nagar, 1 BHK flats and shared apartments on the RentalPins map.",
    rentalTypes: ["PG and paying guest rooms", "1 BHK and 2 BHK flats", "Shared flats for students", "Rooms for professionals"],
    nearbyAreas: [
      link("jaipur", "jagatpura", "Jagatpura"),
      link("jaipur", "mansarovar", "Mansarovar"),
      link("jaipur", "c-scheme", "C-Scheme"),
      hubLink("All Jaipur"),
    ],
    faqs: [
      { q: "Is Malviya Nagar good for PG near MNIT?", a: "Yes — many owners list PG and rooms walking distance to MNIT and WTP. Filter PG on the map centred on Malviya Nagar." },
      { q: "How do I compare Malviya Nagar flats?", a: "Open pins on the map and compare furnishing, parking and deposit terms before site visits." },
      { q: "Are brokers involved?", a: "RentalPins focuses on owner-posted discovery. Message listers directly from map pins." },
      { q: "Nearby areas to try?", a: "Jagatpura and Mansarovar are linked below for cross-neighbourhood search." },
    ],
    mapCenter: { lat: 26.8554, lng: 75.8094, zoom: 14 },
    placeQuery: "Malviya Nagar, Jaipur",
    legacyAreaPath: "/rentals/in/jaipur/malviya-nagar",
  },
  "jaipur/vaishali-nagar": {
    hubSlug: "jaipur",
    areaSlug: "vaishali-nagar",
    citySlug: "jaipur",
    cityLabel: "Jaipur",
    areaName: "Vaishali Nagar",
    title: "Flat for Rent in Vaishali Nagar Jaipur — No Broker | RentalPins",
    metaDescription:
      "Flat for rent in Vaishali Nagar Jaipur — 2 BHK society flats, builder floors and family homes. Map search with owner-direct contact.",
    h1: "Flats for rent in Vaishali Nagar, Jaipur",
    intro:
      "Vaishali Nagar is among Jaipur's strongest family rental belts — gated societies, wide roads and 2–3 BHK apartments near Nirman Nagar and Queens Road. Browse Vaishali Nagar flats on the RentalPins map or list your property for tenants searching this locality.",
    rentalTypes: ["2 BHK and 3 BHK society flats", "Builder floors", "Family independent houses", "Premium PG pockets"],
    nearbyAreas: [
      link("jaipur", "mansarovar", "Mansarovar"),
      link("jaipur", "vidhyadhar-nagar", "Vidhyadhar Nagar"),
      link("jaipur", "c-scheme", "C-Scheme"),
      hubLink("All Jaipur"),
    ],
    faqs: [
      { q: "Why is Vaishali Nagar popular for rentals?", a: "Gated communities, schools and retail make it a top family choice with steady flat demand year-round." },
      { q: "What rent band for 2 BHK in Vaishali Nagar?", a: "Compare nearby map pins — furnishing and society amenities move rents significantly within the same sector." },
      { q: "Can owners list society flats?", a: "Yes — include tower, block and parking details in your listing for faster tenant shortlisting." },
    ],
    mapCenter: { lat: 26.8829, lng: 75.7885, zoom: 14 },
    placeQuery: "Vaishali Nagar, Jaipur",
    legacyAreaPath: "/rentals/in/jaipur/vaishali-nagar",
  },
  "jaipur/mansarovar": {
    hubSlug: "jaipur",
    areaSlug: "mansarovar",
    citySlug: "jaipur",
    cityLabel: "Jaipur",
    areaName: "Mansarovar",
    title: "Flat & PG in Mansarovar Jaipur — Map Rentals | RentalPins",
    metaDescription:
      "Flat for rent Mansarovar Jaipur — affordable PG, 1–2 BHK flats on New Sanganer Road. Owner map search on RentalPins.",
    h1: "Rent in Mansarovar, Jaipur",
    intro:
      "Mansarovar is Jaipur's largest planned residential zone — dense supply of flats, PG and family homes at multiple price points along New Sanganer Road and Shanthi Nagar. Search Mansarovar rentals on the map with direct owner messaging.",
    rentalTypes: ["1 BHK and 2 BHK flats", "PG and shared rooms", "Builder floors", "Family portions"],
    nearbyAreas: [
      link("jaipur", "vaishali-nagar", "Vaishali Nagar"),
      link("jaipur", "malviya-nagar", "Malviya Nagar"),
      link("jaipur", "tonk-road", "Tonk Road"),
      hubLink("All Jaipur"),
    ],
    faqs: [
      { q: "Is Mansarovar budget-friendly?", a: "Many tenants shortlist Mansarovar for value versus inner C-Scheme — compare pins across blocks on the map." },
      { q: "PG or flat in Mansarovar?", a: "Use category filters — PG clusters differ from family flat pockets even within Mansarovar." },
    ],
    mapCenter: { lat: 26.8908, lng: 75.7671, zoom: 14 },
    placeQuery: "Mansarovar, Jaipur",
    legacyAreaPath: "/rentals/in/jaipur/mansarovar",
  },
  "jaipur/jagatpura": {
    hubSlug: "jaipur",
    areaSlug: "jagatpura",
    citySlug: "jaipur",
    cityLabel: "Jaipur",
    areaName: "Jagatpura",
    title: "Flat & PG in Jagatpura Jaipur — IT Corridor Rentals | RentalPins",
    metaDescription:
      "Flat Jagatpura Jaipur — PG and apartments near Sitapura IT belt and colleges. Browse owner listings on the map.",
    h1: "Rent in Jagatpura, Jaipur",
    intro:
      "Jagatpura links Sitapura industry, colleges and newer apartment towers — ideal for IT professionals and students. Find flats and PG in Jagatpura on RentalPins with map-based shortlisting.",
    rentalTypes: ["Apartments near IT corridor", "PG for students", "Shared professional flats", "Small office units"],
    nearbyAreas: [
      link("jaipur", "sitapura", "Sitapura"),
      link("jaipur", "malviya-nagar", "Malviya Nagar"),
      link("jaipur", "tonk-road", "Tonk Road"),
      hubLink("All Jaipur"),
    ],
    faqs: [
      { q: "Is Jagatpura good for IT renters?", a: "Yes — many listings target Sitapura and Jagatpura IT workforce with PG and 1–2 BHK options." },
      { q: "How far is Sitapura from Jagatpura?", a: "Check each pin on the map — micro-locations vary; commute time matters more than area name alone." },
    ],
    mapCenter: { lat: 26.8267, lng: 75.8777, zoom: 14 },
    placeQuery: "Jagatpura, Jaipur",
    legacyAreaPath: "/rentals/in/jaipur/jagatpura",
  },
  "jaipur/c-scheme": {
    hubSlug: "jaipur",
    areaSlug: "c-scheme",
    citySlug: "jaipur",
    cityLabel: "Jaipur",
    areaName: "C-Scheme",
    title: "Flat for Rent C Scheme Jaipur — Central Rentals | RentalPins",
    metaDescription:
      "Flat C Scheme Jaipur — premium apartments near MI Road and Ashok Nagar. Map search with direct owner contact.",
    h1: "Rent in C-Scheme, Jaipur",
    intro:
      "C-Scheme and MI Road — premium central Jaipur with apartments, offices and short-stay demand near Statue Circle. Browse C-Scheme flats on the RentalPins map.",
    rentalTypes: ["Premium apartments", "Builder floors", "Office-linked rentals", "Service-style units"],
    nearbyAreas: [
      link("jaipur", "raja-park", "Raja Park"),
      link("jaipur", "bani-park", "Bani Park"),
      link("jaipur", "malviya-nagar", "Malviya Nagar"),
      hubLink("All Jaipur"),
    ],
    faqs: [
      { q: "Is C-Scheme expensive?", a: "Central Jaipur commands premium rents — compare multiple pins before committing to advance." },
      { q: "Offices near C-Scheme?", a: "Some listings target MI Road professionals — filter property type on the map." },
    ],
    mapCenter: { lat: 26.9155, lng: 75.8069, zoom: 14 },
    placeQuery: "C Scheme, Jaipur",
    legacyAreaPath: "/rentals/in/jaipur/c-scheme",
  },
  "jaipur/raja-park": {
    hubSlug: "jaipur",
    areaSlug: "raja-park",
    citySlug: "jaipur",
    cityLabel: "Jaipur",
    areaName: "Raja Park",
    title: "PG & Flat in Raja Park Jaipur — Map Search | RentalPins",
    metaDescription:
      "PG Raja Park Jaipur, flats and rooms in central colonies. Owner-direct map rentals on RentalPins.",
    h1: "Rent in Raja Park, Jaipur",
    intro:
      "Raja Park and nearby colonies — strong PG, room and family flat demand with quick access to central Jaipur offices and markets.",
    rentalTypes: ["PG and rooms", "Family flats", "Shared apartments", "Builder floors"],
    nearbyAreas: [
      link("jaipur", "c-scheme", "C-Scheme"),
      link("jaipur", "bani-park", "Bani Park"),
      link("jaipur", "malviya-nagar", "Malviya Nagar"),
      hubLink("All Jaipur"),
    ],
    faqs: [
      { q: "Who rents in Raja Park?", a: "Mix of students, working professionals and families — filter PG vs flats on the map." },
    ],
    mapCenter: { lat: 26.9059, lng: 75.8192, zoom: 14 },
    placeQuery: "Raja Park, Jaipur",
    legacyAreaPath: "/rentals/in/jaipur/raja-park",
  },
  "jaipur/sitapura": {
    hubSlug: "jaipur",
    areaSlug: "sitapura",
    citySlug: "jaipur",
    cityLabel: "Jaipur",
    areaName: "Sitapura",
    title: "PG & Room Rent Sitapura Jaipur — Budget Rentals | RentalPins",
    metaDescription:
      "PG Sitapura Jaipur, rooms and budget flats near industrial and college belt. Map search on RentalPins.",
    h1: "Rent in Sitapura, Jaipur",
    intro:
      "Sitapura hosts industry, logistics and education — high volume of budget PG, rooms and shared flats for workers and students.",
    rentalTypes: ["Budget PG", "Shared rooms", "Worker housing", "Budget flats"],
    nearbyAreas: [
      link("jaipur", "jagatpura", "Jagatpura"),
      link("jaipur", "tonk-road", "Tonk Road"),
      link("jaipur", "malviya-nagar", "Malviya Nagar"),
      hubLink("All Jaipur"),
    ],
    faqs: [
      { q: "Is Sitapura only budget PG?", a: "PG dominates but some flats appear — use filters and read listing details on each pin." },
    ],
    mapCenter: { lat: 26.7758, lng: 75.8456, zoom: 14 },
    placeQuery: "Sitapura, Jaipur",
    legacyAreaPath: "/rentals/in/jaipur/sitapura",
  },
  "jaipur/tonk-road": {
    hubSlug: "jaipur",
    areaSlug: "tonk-road",
    citySlug: "jaipur",
    cityLabel: "Jaipur",
    areaName: "Tonk Road",
    title: "Flat on Tonk Road Jaipur — Durgapura Rentals | RentalPins",
    metaDescription:
      "Flat Tonk Road Jaipur — apartments and shops along Durgapura and Pratap Nagar corridor. Owner map listings.",
    h1: "Rent on Tonk Road, Jaipur",
    intro:
      "Tonk Road and Durgapura belt — apartments, retail frontages and family housing along Jaipur's south corridor.",
    rentalTypes: ["Corridor flats", "Shops on rent", "Family homes", "PG pockets"],
    nearbyAreas: [
      link("jaipur", "malviya-nagar", "Malviya Nagar"),
      link("jaipur", "mansarovar", "Mansarovar"),
      link("jaipur", "jagatpura", "Jagatpura"),
      hubLink("All Jaipur"),
    ],
    faqs: [
      { q: "Shops on Tonk Road?", a: "Some commercial inventory appears under property sub-categories — filter on the map." },
    ],
    mapCenter: { lat: 26.8434, lng: 75.7936, zoom: 14 },
    placeQuery: "Tonk Road, Jaipur",
    legacyAreaPath: "/rentals/in/jaipur/tonk-road",
  },
  "jaipur/bani-park": {
    hubSlug: "jaipur",
    areaSlug: "bani-park",
    citySlug: "jaipur",
    cityLabel: "Jaipur",
    areaName: "Bani Park",
    title: "Flat Bani Park Jaipur — Station Area Rentals | RentalPins",
    metaDescription:
      "Flat Bani Park Jaipur — service apartments and homes near railway station. Map search with owner contact.",
    h1: "Rent in Bani Park, Jaipur",
    intro:
      "Bani Park — heritage stays, service apartments and residential rentals near Jaipur railway station and Civil Lines.",
    rentalTypes: ["Service apartments", "Family flats", "Guest-house style units", "Mid-premium homes"],
    nearbyAreas: [
      link("jaipur", "c-scheme", "C-Scheme"),
      link("jaipur", "raja-park", "Raja Park"),
      link("jaipur", "vidhyadhar-nagar", "Vidhyadhar Nagar"),
      hubLink("All Jaipur"),
    ],
    faqs: [
      { q: "Good for short stays?", a: "Some listings suit transit tenants — confirm lease duration with owners before advance." },
    ],
    mapCenter: { lat: 26.9319, lng: 75.7897, zoom: 14 },
    placeQuery: "Bani Park, Jaipur",
    legacyAreaPath: "/rentals/in/jaipur/bani-park",
  },
  "jaipur/vidhyadhar-nagar": {
    hubSlug: "jaipur",
    areaSlug: "vidhyadhar-nagar",
    citySlug: "jaipur",
    cityLabel: "Jaipur",
    areaName: "Vidhyadhar Nagar",
    title: "Flat Vidhyadhar Nagar Jaipur — Family Rentals | RentalPins",
    metaDescription:
      "Flat for rent Vidhyadhar Nagar Jaipur — planned sectors, society flats and family homes. Owner map search.",
    h1: "Rent in Vidhyadhar Nagar, Jaipur",
    intro:
      "Vidhyadhar Nagar is a major planned residential belt in north Jaipur — popular for society flats, builder floors and family tenants seeking newer infrastructure.",
    rentalTypes: ["Society 2–3 BHK flats", "Builder floors", "Family independent houses", "PG in sector pockets"],
    nearbyAreas: [
      link("jaipur", "vaishali-nagar", "Vaishali Nagar"),
      link("jaipur", "bani-park", "Bani Park"),
      link("jaipur", "mansarovar", "Mansarovar"),
      hubLink("All Jaipur"),
    ],
    faqs: [
      { q: "Why choose Vidhyadhar Nagar?", a: "Planned sectors, wider roads and newer societies attract families comparing value versus Vaishali Nagar." },
      { q: "How do I search by sector?", a: "Pan the map over Vidhyadhar Nagar and read locality names in listing titles before visiting." },
    ],
    mapCenter: { lat: 26.9981, lng: 75.786, zoom: 14 },
    placeQuery: "Vidhyadhar Nagar, Jaipur",
    legacyAreaPath: "/rentals/in/jaipur/vidhyadhar-nagar",
  },
};

export const JAIPUR_GSC_LINKS = [
  { label: "Jaipur rentals hub", href: "/rentals/jaipur" },
  { label: "Malviya Nagar", href: "/rentals/jaipur/malviya-nagar" },
  { label: "Vaishali Nagar", href: "/rentals/jaipur/vaishali-nagar" },
  { label: "Mansarovar", href: "/rentals/jaipur/mansarovar" },
  { label: "Jagatpura", href: "/rentals/jaipur/jagatpura" },
  { label: "C-Scheme", href: "/rentals/jaipur/c-scheme" },
  { label: "Raja Park", href: "/rentals/jaipur/raja-park" },
  { label: "Sitapura", href: "/rentals/jaipur/sitapura" },
  { label: "Tonk Road", href: "/rentals/jaipur/tonk-road" },
  { label: "Bani Park", href: "/rentals/jaipur/bani-park" },
  { label: "Vidhyadhar Nagar", href: "/rentals/jaipur/vidhyadhar-nagar" },
  { label: "Canonical Jaipur map hub", href: "/rentals/in/jaipur" },
] as const;

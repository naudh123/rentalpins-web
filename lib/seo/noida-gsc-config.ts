import type { RentalAreaPageConfig } from "@/lib/rental-area-config";

type NoidaGscKey =
  | "noida"
  | "noida/sector-62"
  | "noida/sector-18"
  | "noida/sector-50"
  | "noida/sector-76"
  | "noida/sector-137"
  | "noida/sector-15"
  | "noida/sector-128"
  | "noida/greater-noida"
  | "noida/noida-extension"
  | "noida/sector-45";

function link(hubSlug: string, areaSlug: string, label: string) {
  return { hubSlug, areaSlug, label };
}

function hubLink(label: string) {
  return { hubSlug: "noida", label };
}

/** Short /rentals/noida/* GSC landing configs — canonical inventory at /rentals/in/noida/… */
export const NOIDA_GSC_PAGES: Record<NoidaGscKey, RentalAreaPageConfig> = {
  noida: {
    hubSlug: "noida",
    citySlug: "noida",
    cityLabel: "Noida",
    areaName: "Noida",
    title: "Flats for Rent in Noida — PG, Rooms & Map Search | RentalPins",
    metaDescription:
      "Find flats for rent in Noida — Sector 62, Sector 18, Sector 50, Sector 137, Greater Noida and more. Browse owner listings on the map without broker search fees.",
    h1: "Rent in Noida",
    intro:
      "Noida is one of Delhi NCR's busiest rental markets — IT professionals in Sector 62 and 137, metro-linked families in Sector 18 and 50, and value seekers in Greater Noida and Noida Extension. Search flats, PG, rooms and society apartments across Noida sectors on the RentalPins map with direct owner contact.",
    rentalTypes: [
      "Flats and society apartments for rent",
      "PG and hostels for students and professionals",
      "Builder floors and independent houses",
      "Office and co-working along expressway corridors",
      "Rooms for working professionals near metro",
    ],
    nearbyAreas: [
      link("noida", "sector-62", "Sector 62"),
      link("noida", "sector-18", "Sector 18"),
      link("noida", "sector-50", "Sector 50"),
      link("noida", "sector-137", "Sector 137"),
      link("noida", "greater-noida", "Greater Noida"),
      link("noida", "noida-extension", "Noida Extension"),
    ],
    faqs: [
      {
        q: "How do I find flats for rent in Noida without a broker?",
        a: "Open the RentalPins Noida map, filter by flats or PG, and message owners directly from listing pins. There is no tenant search commission.",
      },
      {
        q: "Which Noida sectors are best for IT professionals?",
        a: "Sector 62, Sector 128 and Sector 137 see high demand near IT parks and expressway offices. Compare pins on the map before visiting.",
      },
      {
        q: "Which sectors suit family flats in Noida?",
        a: "Sector 50, Sector 76, Sector 15 and central Noida societies are popular for family tenants. Noida Extension offers newer society stock at competitive rents.",
      },
      {
        q: "Is PG available near Sector 62 and Sector 18 metro?",
        a: "Yes — owners list PG and shared rooms near both Blue Line corridors. Use PG filters on the map centred on your sector.",
      },
      {
        q: "Can I list my Noida property for free?",
        a: "Yes. Owners post flats, PG, houses and rooms through RentalPins at no search fee to tenants.",
      },
    ],
    mapCenter: { lat: 28.5355, lng: 77.391, zoom: 12 },
    placeQuery: "Noida, Uttar Pradesh",
    legacyAreaPath: "/rentals/in/noida",
  },
  "noida/sector-62": {
    hubSlug: "noida",
    areaSlug: "sector-62",
    citySlug: "noida",
    cityLabel: "Noida",
    areaName: "Sector 62",
    title: "PG & Flats in Sector 62 Noida — Map Search | RentalPins",
    metaDescription:
      "PG in Sector 62 Noida, flats and rooms near IT parks and NH-24. Browse owner listings on the map — direct contact on RentalPins.",
    h1: "Rent in Sector 62, Noida",
    intro:
      "Sector 62 is Noida's busiest IT and PG belt — dense supply of flats, shared apartments and paying guest rooms near offices, hospitals and metro. Find PG in Sector 62, 1–2 BHK flats and co-living on the RentalPins map.",
    rentalTypes: ["PG and paying guest rooms", "1 BHK and 2 BHK flats", "Shared apartments for professionals", "Small office pockets"],
    nearbyAreas: [
      link("noida", "sector-18", "Sector 18"),
      link("noida", "sector-50", "Sector 50"),
      link("noida", "sector-128", "Sector 128"),
      hubLink("All Noida"),
    ],
    faqs: [
      { q: "Is Sector 62 good for PG near IT offices?", a: "Yes — many owners list PG and rooms walking distance to Sector 62 IT parks. Filter PG on the map centred on Sector 62." },
      { q: "How do I compare Sector 62 flats?", a: "Open pins on the map and compare furnishing, parking and maintenance before site visits." },
      { q: "Are brokers involved?", a: "RentalPins focuses on owner-posted discovery. Message listers directly from map pins." },
    ],
    mapCenter: { lat: 28.627, lng: 77.3649, zoom: 14 },
    placeQuery: "Sector 62, Noida",
    legacyAreaPath: "/rentals/in/noida/sector-62",
  },
  "noida/sector-18": {
    hubSlug: "noida",
    areaSlug: "sector-18",
    citySlug: "noida",
    cityLabel: "Noida",
    areaName: "Sector 18",
    title: "Flat & PG in Sector 18 Noida — Metro Map Rentals | RentalPins",
    metaDescription:
      "Flat for rent Sector 18 Noida — PG, rooms and family flats near Atta Market and metro. Owner map search on RentalPins.",
    h1: "Rent in Sector 18, Noida",
    intro:
      "Sector 18 combines Noida's top commercial market with Blue Line metro access — popular for PG, rooms and family flats near Atta Market and central Noida corridors.",
    rentalTypes: ["PG and shared rooms", "1–3 BHK flats", "Builder floors", "Shops on commercial spine"],
    nearbyAreas: [
      link("noida", "sector-15", "Sector 15"),
      link("noida", "sector-50", "Sector 50"),
      link("noida", "sector-62", "Sector 62"),
      hubLink("All Noida"),
    ],
    faqs: [
      { q: "Why is Sector 18 popular for rentals?", a: "Metro, retail and mature housing stock create year-round demand for PG and family flats." },
      { q: "What rent band for 2 BHK in Sector 18?", a: "Compare nearby map pins — furnishing and society amenities move rents within the same sector." },
    ],
    mapCenter: { lat: 28.5708, lng: 77.3261, zoom: 14 },
    placeQuery: "Sector 18, Noida",
    legacyAreaPath: "/rentals/in/noida/sector-18",
  },
  "noida/sector-50": {
    hubSlug: "noida",
    areaSlug: "sector-50",
    citySlug: "noida",
    cityLabel: "Noida",
    areaName: "Sector 50",
    title: "Flat for Rent Sector 50 Noida — Map Search | RentalPins",
    metaDescription:
      "Flat for rent Sector 50 Noida — society flats, PG and family homes near central Noida metro. Owner-direct map search.",
    h1: "Flats for rent in Sector 50, Noida",
    intro:
      "Sector 50 sits in central Noida with metro access and established societies — steady demand for 2–3 BHK flats and PG near Sector 51 and 34 corridors.",
    rentalTypes: ["2 BHK and 3 BHK society flats", "PG pockets", "Builder floors", "Family portions"],
    nearbyAreas: [
      link("noida", "sector-45", "Sector 45"),
      link("noida", "sector-18", "Sector 18"),
      link("noida", "sector-76", "Sector 76"),
      hubLink("All Noida"),
    ],
    faqs: [
      { q: "Is Sector 50 good for families?", a: "Yes — established societies and metro access make it a common family shortlist in central Noida." },
      { q: "How do I filter PG vs flats?", a: "Use category filters on the Sector 50 map so PG results do not clutter family flat searches." },
    ],
    mapCenter: { lat: 28.5745, lng: 77.356, zoom: 14 },
    placeQuery: "Sector 50, Noida",
    legacyAreaPath: "/rentals/in/noida/sector-50",
  },
  "noida/sector-76": {
    hubSlug: "noida",
    areaSlug: "sector-76",
    citySlug: "noida",
    cityLabel: "Noida",
    areaName: "Sector 76",
    title: "Flat & PG in Sector 76 Noida — Noida West | RentalPins",
    metaDescription:
      "Flat for rent Sector 76 Noida — Aqua Line metro, society flats and PG in Noida West. Map search with owner contact.",
    h1: "Rent in Sector 76, Noida",
    intro:
      "Sector 76 anchors the Noida West belt with Aqua Line metro — popular for family flats and professional PG near Sector 77–78 corridors.",
    rentalTypes: ["Society 2–3 BHK flats", "PG for professionals", "Builder floors", "New society inventory"],
    nearbyAreas: [
      link("noida", "noida-extension", "Noida Extension"),
      link("noida", "sector-50", "Sector 50"),
      link("noida", "sector-137", "Sector 137"),
      hubLink("All Noida"),
    ],
    faqs: [
      { q: "Is Sector 76 metro-linked?", a: "Aqua Line stations serve Noida West — verify pin distance to your station on the map before paying advance." },
      { q: "Compare with Noida Extension?", a: "Both belts offer society flats — pan the map between Sector 76 and Noida Extension pins for value comparison." },
    ],
    mapCenter: { lat: 28.6045, lng: 77.387, zoom: 14 },
    placeQuery: "Sector 76, Noida",
    legacyAreaPath: "/rentals/in/noida/sector-76",
  },
  "noida/sector-137": {
    hubSlug: "noida",
    areaSlug: "sector-137",
    citySlug: "noida",
    cityLabel: "Noida",
    areaName: "Sector 137",
    title: "Flat for Rent Sector 137 Noida — Expressway | RentalPins",
    metaDescription:
      "Flat for rent Sector 137 Noida — expressway corridor flats and PG near metro and IT workforce. Owner map search.",
    h1: "Rent in Sector 137, Noida",
    intro:
      "Sector 137 along the Noida–Greater Noida Expressway sees strong IT and workforce rental demand — flats and PG near metro and office clusters.",
    rentalTypes: ["1–3 BHK flats", "PG for IT workforce", "Expressway society apartments", "Furnished professional units"],
    nearbyAreas: [
      link("noida", "sector-128", "Sector 128"),
      link("noida", "greater-noida", "Greater Noida"),
      link("noida", "sector-62", "Sector 62"),
      hubLink("All Noida"),
    ],
    faqs: [
      { q: "Who rents in Sector 137?", a: "IT professionals and expressway commuters dominate — compare furnished vs semi-furnished pins on the map." },
      { q: "Is commute to Delhi feasible?", a: "Many tenants use metro and expressway links — validate your office commute from map pin location before signing." },
    ],
    mapCenter: { lat: 28.5022, lng: 77.4118, zoom: 14 },
    placeQuery: "Sector 137, Noida",
    legacyAreaPath: "/rentals/in/noida/sector-137",
  },
  "noida/sector-15": {
    hubSlug: "noida",
    areaSlug: "sector-15",
    citySlug: "noida",
    cityLabel: "Noida",
    areaName: "Sector 15",
    title: "Flat for Rent Sector 15 Noida — Old Noida | RentalPins",
    metaDescription:
      "Flat for rent Sector 15 Noida — established blocks, family flats and PG in old Noida. Browse owner listings on the map.",
    h1: "Rent in Sector 15, Noida",
    intro:
      "Sector 15 is among older planned Noida sectors with mature housing stock — family flats, builder floors and PG near central markets and metro.",
    rentalTypes: ["Family flats", "Builder floors", "PG rooms", "Independent portions"],
    nearbyAreas: [
      link("noida", "sector-18", "Sector 18"),
      link("noida", "sector-50", "Sector 50"),
      link("noida", "sector-45", "Sector 45"),
      hubLink("All Noida"),
    ],
    faqs: [
      { q: "Why choose Sector 15?", a: "Mature infrastructure and central Noida access attract long-stay family tenants." },
      { q: "How do I shortlist faster?", a: "Filter flats category and compare pins in Sector 15 versus Sector 18 for metro convenience." },
    ],
    mapCenter: { lat: 28.585, lng: 77.3115, zoom: 14 },
    placeQuery: "Sector 15, Noida",
    legacyAreaPath: "/rentals/in/noida/sector-15",
  },
  "noida/sector-128": {
    hubSlug: "noida",
    areaSlug: "sector-128",
    citySlug: "noida",
    cityLabel: "Noida",
    areaName: "Sector 128",
    title: "Flat for Rent Sector 128 Noida — Jaypee Wish Town | RentalPins",
    metaDescription:
      "Flat for rent Sector 128 Noida — Jaypee Greens, expressway societies and premium flats. Owner map search on RentalPins.",
    h1: "Rent in Sector 128, Noida",
    intro:
      "Sector 128 and Jaypee Wish Town belt — premium societies and expressway-linked flats popular with NCR professionals.",
    rentalTypes: ["Premium society flats", "Serviced apartments", "2–3 BHK furnished units", "IT-professional PG pockets"],
    nearbyAreas: [
      link("noida", "sector-137", "Sector 137"),
      link("noida", "sector-62", "Sector 62"),
      link("noida", "sector-50", "Sector 50"),
      hubLink("All Noida"),
    ],
    faqs: [
      { q: "Is Sector 128 premium vs Sector 62?", a: "Generally yes for society stock — compare map pins across both belts for rent-to-amenity fit." },
      { q: "What should owners highlight?", a: "Society name, tower, parking and furnishing — premium tenants eliminate vague pins quickly." },
    ],
    mapCenter: { lat: 28.535, lng: 77.365, zoom: 14 },
    placeQuery: "Sector 128, Noida",
    legacyAreaPath: "/rentals/in/noida/sector-128",
  },
  "noida/greater-noida": {
    hubSlug: "noida",
    areaSlug: "greater-noida",
    citySlug: "noida",
    cityLabel: "Noida",
    areaName: "Greater Noida",
    title: "Flat & PG in Greater Noida — Map Rentals | RentalPins",
    metaDescription:
      "Flat for rent Greater Noida — Knowledge Park, Pari Chowk and planned sectors. Affordable PG and society flats on the map.",
    h1: "Rent in Greater Noida",
    intro:
      "Greater Noida offers planned sectors, universities and industrial belts — affordable flats, PG and family homes across Knowledge Park and Pari Chowk corridors.",
    rentalTypes: ["Society flats", "Student PG", "Family independent houses", "Workforce rooms"],
    nearbyAreas: [
      link("noida", "sector-137", "Sector 137"),
      link("noida", "noida-extension", "Noida Extension"),
      link("noida", "sector-62", "Sector 62"),
      hubLink("All Noida"),
    ],
    faqs: [
      { q: "Is Greater Noida cheaper than central Noida?", a: "Often yes for similar BHK — compare map pins across sectors before paying token." },
      { q: "Good for students?", a: "Knowledge Park and university belts see strong PG demand each academic year." },
    ],
    mapCenter: { lat: 28.4744, lng: 77.504, zoom: 12 },
    placeQuery: "Greater Noida, Uttar Pradesh",
    legacyAreaPath: "/rentals/in/noida/greater-noida",
  },
  "noida/noida-extension": {
    hubSlug: "noida",
    areaSlug: "noida-extension",
    citySlug: "noida",
    cityLabel: "Noida",
    areaName: "Noida Extension",
    title: "Flat for Rent Noida Extension — Greater Noida West | RentalPins",
    metaDescription:
      "Flat for rent Noida Extension — Gaur City, new societies and PG in Greater Noida West. Owner map search.",
    h1: "Rent in Noida Extension",
    intro:
      "Noida Extension (Greater Noida West) — high-volume new society flats and PG at competitive rents along Gaur City and metro corridors.",
    rentalTypes: ["New society 2–3 BHK", "PG and co-living", "Builder floors", "Family flats"],
    nearbyAreas: [
      link("noida", "sector-76", "Sector 76"),
      link("noida", "greater-noida", "Greater Noida"),
      link("noida", "sector-137", "Sector 137"),
      hubLink("All Noida"),
    ],
    faqs: [
      { q: "What is Noida Extension?", a: "Greater Noida West — dense new society development with value rents versus central Noida." },
      { q: "How do I verify society location?", a: "Use map pins and listing titles — Extension micro-markets differ block to block." },
    ],
    mapCenter: { lat: 28.613, lng: 77.42, zoom: 13 },
    placeQuery: "Noida Extension, Uttar Pradesh",
    legacyAreaPath: "/rentals/in/noida/noida-extension",
  },
  "noida/sector-45": {
    hubSlug: "noida",
    areaSlug: "sector-45",
    citySlug: "noida",
    cityLabel: "Noida",
    areaName: "Sector 45",
    title: "Flat for Rent Sector 45 Noida — Central Noida | RentalPins",
    metaDescription:
      "Flat for rent Sector 45 Noida — family flats and builder floors in central Noida. Browse owner listings on the map.",
    h1: "Rent in Sector 45, Noida",
    intro:
      "Sector 45 and nearby central Noida pockets — established family rental demand with schools and markets within short drives.",
    rentalTypes: ["Family 2–3 BHK flats", "Builder floors", "PG pockets", "Independent homes"],
    nearbyAreas: [
      link("noida", "sector-50", "Sector 50"),
      link("noida", "sector-15", "Sector 15"),
      link("noida", "sector-18", "Sector 18"),
      hubLink("All Noida"),
    ],
    faqs: [
      { q: "Who rents in Sector 45?", a: "Families and long-stay professionals seeking central Noida convenience without expressway-belt premiums." },
      { q: "Compare with Sector 50?", a: "Both are central belts — pan the map between pins to compare rent and society amenities." },
    ],
    mapCenter: { lat: 28.554, lng: 77.352, zoom: 14 },
    placeQuery: "Sector 45, Noida",
    legacyAreaPath: "/rentals/in/noida/sector-45",
  },
};

export const NOIDA_GSC_LINKS = [
  { label: "Noida rentals hub", href: "/rentals/noida" },
  { label: "Sector 62", href: "/rentals/noida/sector-62" },
  { label: "Sector 18", href: "/rentals/noida/sector-18" },
  { label: "Sector 50", href: "/rentals/noida/sector-50" },
  { label: "Sector 76", href: "/rentals/noida/sector-76" },
  { label: "Sector 137", href: "/rentals/noida/sector-137" },
  { label: "Sector 15", href: "/rentals/noida/sector-15" },
  { label: "Sector 128", href: "/rentals/noida/sector-128" },
  { label: "Greater Noida", href: "/rentals/noida/greater-noida" },
  { label: "Noida Extension", href: "/rentals/noida/noida-extension" },
  { label: "Sector 45", href: "/rentals/noida/sector-45" },
  { label: "Canonical Noida map hub", href: "/rentals/in/noida" },
] as const;

import { mapSearchUrl } from "@/lib/map-search-url";
import { appPath } from "@/lib/config";

export interface CommercialLondonFaq {
  q: string;
  a: string;
}

export interface CommercialLondonAreaConfig {
  slug: string;
  locationName: string;
  title: string;
  metaDescription: string;
  h1: string;
  intro: string;
  propertyTypes: string[];
  nearbyAreas: string[];
  faqs: CommercialLondonFaq[];
  mapCenter: { lat: number; lng: number; zoom: number };
  placeQuery: string;
}

export interface CommercialLondonHubConfig {
  slug: "london";
  locationName: string;
  title: string;
  metaDescription: string;
  h1: string;
  intro: string;
  propertyTypes: string[];
  featuredAreas: string[];
  faqs: CommercialLondonFaq[];
  mapCenter: { lat: number; lng: number; zoom: number };
  placeQuery: string;
}

export const COMMERCIAL_LONDON_OPENING_NOTICE =
  "RentalPins is opening commercial listings in London. Property owners and agents can list early for free.";

export const COMMERCIAL_LONDON_AREA_SLUGS = [
  "hackney",
  "islington",
  "camden",
  "shoreditch",
  "southwark",
  "tower-hamlets",
  "westminster",
  "canary-wharf",
] as const;

export type CommercialLondonAreaSlug = (typeof COMMERCIAL_LONDON_AREA_SLUGS)[number];

const AREA: Record<CommercialLondonAreaSlug, CommercialLondonAreaConfig> = {
  hackney: {
    slug: "hackney",
    locationName: "Hackney",
    title: "Commercial Property to Rent in Hackney | RentalPins",
    metaDescription:
      "Offices, shops and commercial space to rent in Hackney, East London. List your commercial property free on RentalPins or browse the map as inventory opens.",
    h1: "Commercial property to rent in Hackney",
    intro:
      "Hackney combines creative studio demand, high-street retail and flexible office space across Dalston, London Fields and the City fringe. RentalPins is a map-first marketplace where owners and agents can list offices, shops and small commercial units with direct tenant contact — no broker search fees.",
    propertyTypes: [
      "Offices and studio workspace",
      "Retail shops and high-street units",
      "Café, restaurant and hospitality premises",
      "Light industrial and storage yards",
    ],
    nearbyAreas: ["shoreditch", "tower-hamlets", "islington", "camden"],
    mapCenter: { lat: 51.545, lng: -0.055, zoom: 13 },
    placeQuery: "Hackney, London, UK",
    faqs: [
      {
        q: "Can I list commercial property in Hackney on RentalPins?",
        a: "Yes. Owners and agents can list offices, shops and other commercial units for free while we open the London commercial catalogue.",
      },
      {
        q: "What commercial types are common in Hackney?",
        a: "Tenants typically search for creative offices, retail on busy high streets, food and beverage units, and small workshop or storage space near transport links.",
      },
      {
        q: "How do tenants browse Hackney commercial rentals?",
        a: "Use Browse Commercial Rentals on Map to open the RentalPins map centred on Hackney. Filter by property type and message owners directly when listings are live.",
      },
      {
        q: "Does RentalPins charge brokerage to tenants?",
        a: "RentalPins does not charge tenants a search commission. You shortlist on the map and contact owners or listing agents directly.",
      },
      {
        q: "Is inventory available in Hackney right now?",
        a: "London commercial inventory is opening area by area. If the map is thin, owners can still list early so your property appears as soon as the hub goes live.",
      },
    ],
  },
  islington: {
    slug: "islington",
    locationName: "Islington",
    title: "Commercial Property to Let in Islington | RentalPins",
    metaDescription:
      "Commercial property to let in Islington — offices, shops and professional space near Angel and Upper Street. List free or browse commercial rentals on the map.",
    h1: "Commercial property to let in Islington",
    intro:
      "Islington draws professional services, independent retail and food-led high-street demand around Angel, Upper Street and the City fringe. RentalPins helps owners list commercial property to let with map pins, clear pricing context and direct enquiries from tenants.",
    propertyTypes: [
      "Professional offices and consulting suites",
      "High-street shops to let",
      "Restaurant and takeaway units",
      "Medical and clinic rooms",
    ],
    nearbyAreas: ["camden", "hackney", "shoreditch", "westminster"],
    mapCenter: { lat: 51.5362, lng: -0.1033, zoom: 13 },
    placeQuery: "Islington, London, UK",
    faqs: [
      {
        q: "What does ‘commercial property to let in Islington’ include?",
        a: "It covers offices, retail shops, hospitality units and other business premises advertised directly by owners or authorised agents on RentalPins.",
      },
      {
        q: "Who should list on this Islington page?",
        a: "Landlords, property owners and agents with commercial units in Islington can list early for free before tenant campaigns scale.",
      },
      {
        q: "How is Islington different from residential search on RentalPins?",
        a: "This hub focuses on business premises — offices, shops and commercial space — rather than flats or PG inventory in India hubs.",
      },
      {
        q: "Can I target Angel and Upper Street specifically?",
        a: "When you list, use accurate street and locality names in the title and description so map search and area pages surface your pin to relevant tenants.",
      },
      {
        q: "When will tenants see my Islington listing?",
        a: "New owner listings publish through the standard post flow. Tenants browsing the London map will see live pins as commercial inventory grows.",
      },
    ],
  },
  camden: {
    slug: "camden",
    locationName: "Camden",
    title: "Shops to Let in Camden & Commercial Property | RentalPins",
    metaDescription:
      "Shops to let in Camden and wider commercial property to rent across NW1. List your retail or office unit free on RentalPins or browse the London commercial map.",
    h1: "Shops to let in Camden",
    intro:
      "Camden’s footfall-driven high streets and mixed office corridors suit independent retail, food brands and creative businesses. If you are marketing shops to let in Camden or broader commercial space in NW1, RentalPins gives you a map pin, direct tenant messaging and no tenant search commission.",
    propertyTypes: [
      "Shops to let on high-footfall streets",
      "Market and arcade retail units",
      "Offices near Camden Town and Kings Cross",
      "Workshop and studio commercial space",
    ],
    nearbyAreas: ["islington", "westminster", "hackney", "shoreditch"],
    mapCenter: { lat: 51.539, lng: -0.1426, zoom: 13 },
    placeQuery: "Camden, London, UK",
    faqs: [
      {
        q: "Can I advertise shops to let in Camden only?",
        a: "Yes. Select the appropriate commercial category when posting and describe the unit as a shop, showroom or retail space with accurate Camden locality names.",
      },
      {
        q: "Do you list Camden Market units?",
        a: "Owners with authorised lettings in Camden can list any commercial unit they control. Use precise location detail so tenants understand access and trading context.",
      },
      {
        q: "How do tenants contact shop landlords?",
        a: "Tenants browse the map, open your pin and contact you via in-app chat or WhatsApp depending on how you publish the listing.",
      },
      {
        q: "Is there a fee to list a Camden shop?",
        a: "Listing commercial property on RentalPins is free for owners during the London validation phase.",
      },
      {
        q: "What if no Camden shops appear on the map yet?",
        a: "Inventory is still opening. This page explains the market and invites owners to list early; tenants can still browse the map for live pins elsewhere in London.",
      },
    ],
  },
  shoreditch: {
    slug: "shoreditch",
    locationName: "Shoreditch",
    title: "Office to Rent in Shoreditch | Commercial Space | RentalPins",
    metaDescription:
      "Office to rent in Shoreditch — creative workspace, retail and commercial property near Old Street and the City fringe. List free on RentalPins.",
    h1: "Office to rent in Shoreditch",
    intro:
      "Shoreditch remains one of London’s most searched creative office markets, with demand for fitted workspace, ground-floor retail and flexible floors near Old Street and Boxpark. RentalPins is onboarding commercial landlords and agents who want map-visible offices to rent in Shoreditch with direct tenant contact.",
    propertyTypes: [
      "Creative offices and fitted workspace",
      "Ground-floor retail and showroom units",
      "Restaurant and bar commercial leases",
      "Studio and maker space",
    ],
    nearbyAreas: ["hackney", "tower-hamlets", "canary-wharf", "islington"],
    mapCenter: { lat: 51.526, lng: -0.078, zoom: 14 },
    placeQuery: "Shoreditch, London, UK",
    faqs: [
      {
        q: "What office sizes work best in Shoreditch?",
        a: "Listings range from small creative studios to multi-desk floors. Include square footage, fit-out, meeting room count and nearest station in your description.",
      },
      {
        q: "Can agents list multiple Shoreditch offices?",
        a: "Authorised agents can post each distinct unit separately with accurate pricing and location pins on the map.",
      },
      {
        q: "How do tenants search ‘office to rent Shoreditch’?",
        a: "They land on this page from search, open the map centred on Shoreditch and filter commercial property types before messaging owners.",
      },
      {
        q: "Does RentalPins replace a traditional agent?",
        a: "No. RentalPins is a discovery layer. Agents and owners still negotiate lease terms directly with tenants.",
      },
      {
        q: "Is Shoreditch inventory live today?",
        a: "We are validating London commercial demand. List early if you have offices to rent; tenants see live pins as soon as they are published.",
      },
    ],
  },
  southwark: {
    slug: "southwark",
    locationName: "Southwark",
    title: "Commercial Property to Rent in Southwark | RentalPins",
    metaDescription:
      "Commercial property to rent in Southwark — offices, shops and business space near London Bridge and Borough. Owners list free on RentalPins.",
    h1: "Commercial property to rent in Southwark",
    intro:
      "Southwark links London Bridge, Borough and the South Bank with steady demand for offices, hospitality units and retail serving workers and residents. RentalPins is opening a commercial catalogue for Southwark where owners publish map pins and tenants browse without paying search brokerage.",
    propertyTypes: [
      "Offices near London Bridge and Borough",
      "Hospitality and restaurant premises",
      "Retail units on local high streets",
      "Storage and light industrial near main roads",
    ],
    nearbyAreas: ["westminster", "tower-hamlets", "canary-wharf", "shoreditch"],
    mapCenter: { lat: 51.5035, lng: -0.0865, zoom: 13 },
    placeQuery: "Southwark, London, UK",
    faqs: [
      {
        q: "What tenants search for in Southwark?",
        a: "Common queries include offices near London Bridge, restaurant space around Borough and retail serving commuter footfall.",
      },
      {
        q: "Can I list a single Southwark shop or office?",
        a: "Yes. Each unit should be a separate listing with its own map pin, rent guidance and contact channel.",
      },
      {
        q: "How does RentalPins handle lease terms?",
        a: "RentalPins does not set lease templates. Owners disclose term, deposit and rent in the listing and negotiate directly.",
      },
      {
        q: "Will this page show live Southwark listings?",
        a: "When owners publish active listings, they appear on the map. This landing page does not display static or estimated inventory counts.",
      },
      {
        q: "Is Southwark part of the wider London commercial hub?",
        a: "Yes. Browse the London commercial hub and linked area pages for neighbouring markets such as Westminster and Tower Hamlets.",
      },
    ],
  },
  "tower-hamlets": {
    slug: "tower-hamlets",
    locationName: "Tower Hamlets",
    title: "Commercial Property to Rent in Tower Hamlets | RentalPins",
    metaDescription:
      "Commercial property to rent in Tower Hamlets — offices, shops and business space across Whitechapel, Bethnal Green and the Isle of Dogs corridor.",
    h1: "Commercial property to rent in Tower Hamlets",
    intro:
      "Tower Hamlets spans Whitechapel, Bethnal Green, Poplar and the Isle of Dogs, mixing creative offices, retail and logistics-friendly commercial space. RentalPins connects owners listing commercial property to rent in Tower Hamlets with tenants who prefer map-first shortlisting.",
    propertyTypes: [
      "Offices in Whitechapel and Bethnal Green",
      "Retail on local high streets",
      "Workshops and light industrial units",
      "Ground-floor commercial near Canary Wharf commute",
    ],
    nearbyAreas: ["shoreditch", "hackney", "canary-wharf", "southwark"],
    mapCenter: { lat: 51.52, lng: -0.029, zoom: 12 },
    placeQuery: "Tower Hamlets, London, UK",
    faqs: [
      {
        q: "Does Tower Hamlets include Canary Wharf?",
        a: "Canary Wharf has its own RentalPins commercial page for docklands office demand. This hub covers the wider borough including Whitechapel and Bethnal Green.",
      },
      {
        q: "What should owners include in a Tower Hamlets listing?",
        a: "State the locality, nearest station, use class context, approximate size and whether the unit is fitted or shell.",
      },
      {
        q: "Can warehouses be listed here?",
        a: "Light industrial, storage and small warehouse-style units can be listed under commercial property categories with accurate descriptions.",
      },
      {
        q: "How do tenants browse Tower Hamlets?",
        a: "Use the map CTA on this page to open RentalPins centred on Tower Hamlets and filter by offices, shops or industrial sub-types.",
      },
      {
        q: "Is listing free for commercial owners?",
        a: "Yes during the London validation phase. Owners and agents can list commercial property without a tenant search fee on RentalPins.",
      },
    ],
  },
  westminster: {
    slug: "westminster",
    locationName: "Westminster",
    title: "Commercial Property to Rent in Westminster | RentalPins",
    metaDescription:
      "Commercial property to rent in Westminster — offices, retail and hospitality space in central London. List your unit free on RentalPins.",
    h1: "Commercial property to rent in Westminster",
    intro:
      "Westminster concentrates premium office, retail and hospitality demand around Victoria, Soho and the West End. RentalPins gives owners a map-first channel to list commercial property to rent in Westminster and receive direct tenant enquiries without paying portal brokerage on the tenant side.",
    propertyTypes: [
      "Central London offices",
      "West End retail and showroom units",
      "Hospitality and leisure premises",
      "Professional services suites",
    ],
    nearbyAreas: ["camden", "southwark", "islington", "shoreditch"],
    mapCenter: { lat: 51.4975, lng: -0.1357, zoom: 13 },
    placeQuery: "Westminster, London, UK",
    faqs: [
      {
        q: "Is Westminster suitable for small offices?",
        a: "Yes. List suites with realistic square footage and station access. Tenants often filter central London maps by budget and size.",
      },
      {
        q: "Can retail brands list West End shops?",
        a: "Authorised owners and agents can list shops and showrooms with street-level detail and footfall context in the description.",
      },
      {
        q: "How is Westminster different from India hubs on RentalPins?",
        a: "This page is UK commercial validation only. India residential and PG hubs remain on /rentals/in/... routes unchanged.",
      },
      {
        q: "Do you verify Westminster listings?",
        a: "Owners publish through the standard post flow. RentalPins does not claim third-party verification beyond what the owner discloses.",
      },
      {
        q: "What if the Westminster map looks empty?",
        a: "We are opening inventory gradually. Owners can list early; tenants should check back as commercial pins go live.",
      },
    ],
  },
  "canary-wharf": {
    slug: "canary-wharf",
    locationName: "Canary Wharf",
    title: "Office & Commercial Property in Canary Wharf | RentalPins",
    metaDescription:
      "Office and commercial property around Canary Wharf and the Isle of Dogs. List docklands business space free or browse the RentalPins map.",
    h1: "Commercial property in Canary Wharf",
    intro:
      "Canary Wharf and the Isle of Dogs attract finance, professional services and ground-floor retail serving the docklands workforce. RentalPins is validating demand for office and commercial property in Canary Wharf with map pins, direct messaging and free owner listings.",
    propertyTypes: [
      "Docklands offices and fitted floors",
      "Co-working and flexible workspace",
      "Ground-floor retail and services",
      "Storage and light logistics units",
    ],
    nearbyAreas: ["tower-hamlets", "southwark", "shoreditch", "hackney"],
    mapCenter: { lat: 51.5054, lng: -0.0235, zoom: 14 },
    placeQuery: "Canary Wharf, London, UK",
    faqs: [
      {
        q: "Can I list an office in Canary Wharf?",
        a: "Yes. Post through the commercial listing flow with accurate docklands location detail and rent expectations.",
      },
      {
        q: "Do tenants pay fees to contact owners?",
        a: "RentalPins does not charge tenants a search commission for browsing or messaging owners.",
      },
      {
        q: "How does Canary Wharf relate to Tower Hamlets?",
        a: "Canary Wharf is a major commercial cluster within Tower Hamlets. We maintain separate landing pages because search demand differs.",
      },
      {
        q: "What keywords does this page target?",
        a: "Office and commercial property searches around Canary Wharf, Isle of Dogs and docklands commute corridors.",
      },
      {
        q: "When will map results appear?",
        a: "As owners publish live listings. This page does not display estimated availability — only real map pins count.",
      },
    ],
  },
};

export const COMMERCIAL_LONDON_AREAS: CommercialLondonAreaConfig[] =
  COMMERCIAL_LONDON_AREA_SLUGS.map((slug) => AREA[slug]);

export const COMMERCIAL_LONDON_HUB: CommercialLondonHubConfig = {
  slug: "london",
  locationName: "London",
  title: "Commercial Property to Rent in London | Offices, Shops & Warehouses | RentalPins",
  metaDescription:
    "Commercial property to rent in London — offices, shops to let and warehouse space across Hackney, Shoreditch, Camden and more. Owners list free on RentalPins.",
  h1: "Commercial property to rent in London",
  intro:
    "RentalPins is validating map-first commercial search in London. Target corridors include offices in Shoreditch and Canary Wharf, shops to let in Camden, and warehouse-style space across inner London boroughs. Owners and agents can list commercial property free; tenants browse the map and contact landlords directly.",
  propertyTypes: [
    "Offices and flexible workspace",
    "Shops and high-street retail",
    "Restaurants, cafés and hospitality",
    "Warehouses, storage and light industrial",
  ],
  featuredAreas: [...COMMERCIAL_LONDON_AREA_SLUGS],
  mapCenter: { lat: 51.5074, lng: -0.1278, zoom: 11 },
  placeQuery: "London, UK",
  faqs: [
    {
      q: "What is RentalPins offering in London?",
      a: "A map-first commercial property channel where owners list offices, shops and warehouse-style units and tenants browse without paying search brokerage.",
    },
    {
      q: "Which London areas have dedicated pages?",
      a: "We publish area hubs for Hackney, Islington, Camden, Shoreditch, Southwark, Tower Hamlets, Westminster and Canary Wharf based on organic search demand.",
    },
    {
      q: "Can I list warehouse to rent in London?",
      a: "Yes. Use the commercial or industrial categories in the post flow and place the pin accurately with size, access and loading details.",
    },
    {
      q: "Does RentalPins replace estate agents?",
      a: "No. RentalPins is a discovery and contact layer. Lease negotiation stays between owner or agent and tenant.",
    },
    {
      q: "Why might the London map look quiet?",
      a: "We are opening inventory gradually. Owners can list early for free while we validate commercial demand from search and campaigns.",
    },
    {
      q: "Will India rental pages change?",
      a: "No. Existing /rentals/in/... hubs, blog routes and the app iframe are unchanged. UK commercial pages live under /commercial/london only.",
    },
  ],
};

export function getCommercialLondonArea(
  slug: string
): CommercialLondonAreaConfig | null {
  if (!COMMERCIAL_LONDON_AREA_SLUGS.includes(slug as CommercialLondonAreaSlug)) {
    return null;
  }
  return AREA[slug as CommercialLondonAreaSlug];
}

export function commercialLondonAreaPath(slug: string): string {
  return `/commercial/london/${slug}`;
}

export function commercialLondonHubPath(): string {
  return "/commercial/london";
}

/** Map deep-link for UK commercial browse CTA. */
export function commercialLondonMapHref(
  config: CommercialLondonHubConfig | CommercialLondonAreaConfig
): string {
  const { lat, lng, zoom } = config.mapCenter;
  const path = mapSearchUrl(
    lat,
    lng,
    zoom,
    undefined,
    "Property",
    undefined,
    "commercial office shop warehouse",
    config.placeQuery
  );
  return appPath(path);
}

export function commercialLondonPostHref(): string {
  return appPath("/post");
}

export function getCommercialLondonSitemapPaths(): string[] {
  return [
    commercialLondonHubPath(),
    ...COMMERCIAL_LONDON_AREA_SLUGS.map((slug) => commercialLondonAreaPath(slug)),
  ];
}

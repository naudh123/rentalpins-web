/** Homepage copy — honest, SEO-friendly, owner-listing focused. */

export const HOME_HERO = {
  eyebrow: "Map-first rentals · India & global hubs",
  headline: "Discover rentals on the map.",
  headlineAccent: "List your property with confidence.",
  subhead:
    "Flats, PG, houses, shops, offices and warehouses — owner-direct on one live map. Browse without broker fees. Owners post free on web or Android.",
} as const;

export const HOME_PLATFORM_PILLS = [
  { label: "Listing fee", value: "Free" },
  { label: "Rental categories", value: "9" },
  { label: "Owner contact", value: "Direct" },
] as const;

export const HOME_OWNER_VALUE = {
  title: "Why owners list on RentalPins",
  subtitle:
    "A calmer alternative to classified spam — your pin sits where renters already search on the map.",
  benefits: [
    {
      title: "Free to list",
      desc: "Post flats, PG, hostels, shops, offices, warehouses and more at no listing charge on supported cities.",
    },
    {
      title: "Direct renter inquiries",
      desc: "Tenants message you on WhatsApp, call, or chat from your listing pin — no unlock fee to search.",
    },
    {
      title: "Map-based discovery",
      desc: "Your property appears on the same interactive map renters use on the website and Android app.",
    },
    {
      title: "Housing & commercial",
      desc: "List residential inventory alongside shops, offices, co-working units and warehouse space in one flow.",
    },
    {
      title: "Web or app",
      desc: "Sign in with Google on the web, drop a map pin, add photos, and manage listings from the RentalPins app.",
    },
    {
      title: "Growing city hubs",
      desc: "Live in Chandigarh Tricity, Delhi, Ludhiana, Jaipur, Lucknow, Mumbai and more — with new areas added regularly.",
    },
  ],
} as const;

export const HOME_LISTING_STEPS = {
  title: "List your property in three steps",
  subtitle: "Most owners complete a first draft in a few minutes.",
  steps: [
    {
      step: "01",
      title: "Sign in & choose category",
      desc: "Use Google sign-in, pick Property, PG, commercial or another category, and open the post listing flow.",
    },
    {
      step: "02",
      title: "Pin location & add details",
      desc: "Place your listing on the map, upload photos, set rent, and write a clear title with society or sector context.",
    },
    {
      step: "03",
      title: "Go live on the map",
      desc: "Publish your listing — renters browsing your city see your pin in search results and can contact you directly.",
    },
  ],
} as const;

export const HOME_PROPERTY_TYPES = {
  title: "What you can list",
  types: [
    { label: "Flats & apartments", href: "/rentals/in/chandigarh/mohali/flats" },
    { label: "Houses & villas", href: "/rentals/in/chandigarh/mohali/houses" },
    { label: "PG & hostels", href: "/rentals/in/chandigarh/mohali/pg" },
    { label: "Shops & retail", href: "/rentals/in/chandigarh/mohali/shops" },
    { label: "Offices", href: "/rentals/in/chandigarh/mohali/offices" },
    { label: "Warehouses", href: "/rentals/in/chandigarh/mohali/warehouses" },
    { label: "Commercial units", href: "/rentals/in/chandigarh/mohali/commercial" },
    { label: "Vehicles & equipment", href: "/search?category=Vehicles" },
  ],
} as const;

export const HOME_RENTER_SECTION = {
  title: "For renters",
  subtitle: "Browse owner-posted pins — no broker search commission.",
  steps: [
    { step: "1", title: "Open the map", desc: "Pan to your city, phase, or sector and explore price pins in real time." },
    { step: "2", title: "Filter & shortlist", desc: "Narrow by category, budget, and area before you schedule visits." },
    { step: "3", title: "Contact the owner", desc: "Message on WhatsApp or chat from the listing — deal directly." },
  ],
} as const;

export const HOME_SEO_LINKS = {
  title: "Popular rental guides",
  links: [
    { label: "Mohali rentals", href: "/rentals/mohali" },
    { label: "Sector 70 Mohali", href: "/rentals/mohali/sector-70" },
    { label: "Delhi flats", href: "/rentals/in/delhi/flats" },
    { label: "PG near CU", href: "/pg-near-chandigarh-university" },
    { label: "Rent without broker", href: "/rent-without-broker" },
    { label: "List property free", href: "/post" },
  ],
} as const;

export const HOME_FAQS = [
  {
    q: "Is it free to list property on RentalPins?",
    a: "Yes — owners can post flats, PG, houses, shops, offices and warehouses on supported cities at no listing fee. Renters browse and contact owners without a search commission.",
  },
  {
    q: "How do I list my flat or PG on RentalPins?",
    a: "Sign in with Google, open Post listing, drop your pin on the map, add photos and rent details, then publish. Your listing appears in map search for that area.",
  },
  {
    q: "Who can list on RentalPins?",
    a: "Property owners, PG and hostel operators, shop and office owners, warehouse landlords, brokers with owner authorisation, and vehicle or equipment rental businesses.",
  },
  {
    q: "How do renters find my listing?",
    a: "Renters open the RentalPins map, filter by category and area, and tap your pin. Listings also surface on city and area SEO pages for local search.",
  },
  {
    q: "Which cities are live on RentalPins?",
    a: "Chandigarh Tricity, Ludhiana, Delhi, Jaipur, Lucknow, Mumbai, London, Nairobi, and Lagos — with Mohali, Kharar, and Delhi area guides on the site.",
  },
  {
    q: "Can I manage listings from the Android app?",
    a: "Yes. The same Google account works on the web and RentalPins Android app — edit photos, location and availability from either.",
  },
] as const;

export const HOME_FINAL_CTA = {
  title: "Ready to list or browse?",
  subtitle:
    "Free listing for owners. Map-first search for renters. No broker commission to discover or post.",
} as const;

/** Patterns we avoid on the homepage (no fake social proof). */
export const HOME_FORBIDDEN_CLAIMS =
  /\b(thousands of tenants|millions of users|guaranteed leads|10,000\+|25,000\+|50,000\+|95%\+ verified)\b/i;

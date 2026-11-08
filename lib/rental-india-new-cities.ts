// New India city + area marketing pages (Nov 2026). Map cells live in area-config-new-cities.ts.
// Cities chosen where RentalPins already had live listings but no city page:
// Bengaluru, Gurugram, Hyderabad, Kolkata, Ghaziabad, Pune, Patna, Indore, Bhopal.
import type { AreaConfig, CityConfig } from "./rental-city-config-types";

const PROPERTY = { name: "Property", color: "#7B1FA2", icon: "🏠" };
const VEHICLES = { name: "Vehicles", color: "#1976D2", icon: "🚗" };
const OFFICE = { name: "Office Space", color: "#FF8F00", icon: "💼" };
const ELECTRONICS = { name: "Electronics & Gadgets", color: "#FF8F00", icon: "💻" };

/** City-wide area page (first area of each city): every listing in the city on one map. */
function metroArea(city: string, slug: string, coordinates: { lat: number; lng: number }, belts: string[]): AreaConfig {
  return {
    slug,
    name: `${city} Metro`,
    tagline: belts.join(" · "),
    badge: `${city.toUpperCase()} — CITY WIDE`,
    primaryFocus: "All categories",
    heroDescription: `Browse every rental listing across ${city} on one map — flats, PG, rooms, offices and vehicles — and contact owners directly.`,
    coordinates,
    popularAreas: belts,
    topCategories: [
      { ...PROPERTY, desc: `Flats, PG and rooms across ${city}.` },
      { ...VEHICLES, desc: "Cars, bikes and scooters on rent." },
    ],
    popularSearches: [`Flat for rent ${city}`, `PG in ${city}`, `Room for rent ${city}`, `Rent without broker ${city}`],
    faqs: [
      { q: `How do I find a rental in ${city} without a broker?`, a: `Open the ${city} map on RentalPins, filter by budget and type, and contact the owner directly from the listing. There is no brokerage on RentalPins.` },
      { q: `Can I list my ${city} property for free?`, a: "Yes. Post your flat, PG, room or office from the website or the RentalPins app and renters can reach you directly." },
    ],
    ctaHeading: `Renting out in ${city}?`,
    ctaBody: "List your property on RentalPins and reach renters directly.",
  };
}

/** A locality page with its own wording. */
function locality(
  city: string,
  a: {
    slug: string;
    name: string;
    tagline: string;
    focus: string;
    hero: string;
    coordinates: { lat: number; lng: number };
    nearby: string[];
    searches: string[];
    faqs: { q: string; a: string }[];
  }
): AreaConfig {
  return {
    slug: a.slug,
    name: a.name,
    tagline: a.tagline,
    badge: `${city.toUpperCase()} — ${a.name.toUpperCase()}`,
    primaryFocus: a.focus,
    heroDescription: a.hero,
    coordinates: a.coordinates,
    popularAreas: a.nearby,
    topCategories: [
      { ...PROPERTY, desc: `Flats, PG and rooms in and around ${a.name}.` },
      { ...VEHICLES, desc: "Bikes and cars for the daily commute." },
    ],
    popularSearches: a.searches,
    faqs: a.faqs,
    ctaHeading: `Own a property in ${a.name}?`,
    ctaBody: "List it on RentalPins and get enquiries from renters directly.",
  };
}

const NO_BROKER_FAQ = (city: string) => ({
  q: `Does RentalPins charge brokerage in ${city}?`,
  a: "No. Renters contact owners directly from each listing, and owners can list for free.",
});

export const NEW_INDIA_CITIES: CityConfig[] = [
  // ─── Bengaluru ─────────────────────────────────────────────────────────────
  {
    countrySlug: "in",
    slug: "bengaluru",
    name: "Bengaluru",
    country: "India",
    tagline: "BTM Layout · Koramangala · HSR Layout · Whitefield · Hebbal · JP Nagar",
    badge: "NOW LIVE — BENGALURU",
    heroDescription:
      "Find flats, PG, shared rooms and co-living on rent across Bengaluru — from Koramangala and HSR Layout to Whitefield and Hebbal — on one live map. Contact owners directly on RentalPins.",
    coordinates: { lat: 12.9716, lng: 77.5946 },
    popularAreas: ["BTM Layout", "Koramangala", "HSR Layout", "Whitefield", "Hebbal", "JP Nagar", "Marathahalli", "Bellandur", "Electronic City", "Indiranagar"],
    topCategories: [
      { ...PROPERTY, desc: "PG, shared flats, 1–3 BHK apartments and independent houses near Bengaluru's tech corridors." },
      { ...VEHICLES, desc: "Bikes and scooters for the Outer Ring Road commute." },
      { ...ELECTRONICS, desc: "Laptops, appliances and furniture on rent for new joiners." },
    ],
    popularSearches: [
      "PG in BTM Layout", "Flat for rent Koramangala", "1 BHK HSR Layout", "PG near Whitefield ITPL",
      "Room for rent Hebbal", "2 BHK JP Nagar", "Flat near Manyata Tech Park", "Rent without broker Bengaluru",
    ],
    faqs: [
      { q: "Which Bengaluru areas are popular with IT professionals?", a: "Koramangala, HSR Layout, BTM Layout and Bellandur suit people working on Outer Ring Road; Whitefield and Marathahalli suit ITPL; Hebbal suits Manyata Tech Park." },
      { q: "Are PG and shared flats easy to find in Bengaluru?", a: "Yes. BTM Layout, Koramangala and HSR Layout have many PG and shared-flat listings; use the map's PG filter to compare them by distance to your office." },
      NO_BROKER_FAQ("Bengaluru"),
    ],
    ctaHeading: "Have a flat or PG to rent in Bengaluru?",
    ctaBody: "List it on RentalPins and reach renters across BTM Layout, Koramangala, HSR Layout and Whitefield.",
    status: "live",
    areas: [
      metroArea("Bengaluru", "bengaluru-metro", { lat: 12.9716, lng: 77.5946 }, ["South Bengaluru", "Outer Ring Road", "Whitefield", "North Bengaluru"]),
      locality("Bengaluru", {
        slug: "btm-layout", name: "BTM Layout", tagline: "Silk Board · Madiwala · BTM 2nd Stage", focus: "PG and shared rooms",
        hero: "BTM Layout is one of Bengaluru's busiest PG and shared-room areas, close to Silk Board, Koramangala and HSR Layout. Browse live listings and contact owners directly.",
        coordinates: { lat: 12.9166, lng: 77.6101 }, nearby: ["Madiwala", "Koramangala", "HSR Layout", "JP Nagar"],
        searches: ["PG in BTM Layout", "Room for rent BTM 2nd Stage", "1 BHK BTM Layout", "Ladies PG BTM Layout"],
        faqs: [{ q: "Is BTM Layout good for PG accommodation?", a: "Yes. It has a large supply of PG and shared rooms for students and professionals, with quick access to Koramangala and Outer Ring Road." }, NO_BROKER_FAQ("BTM Layout")],
      }),
      locality("Bengaluru", {
        slug: "whitefield", name: "Whitefield", tagline: "ITPL · Hoodi · Kadugodi · Brookefield", focus: "Flats near IT parks",
        hero: "Rent flats, PG and rooms in Whitefield near ITPL and the eastern IT parks. Compare listings on the map and contact owners without a broker.",
        coordinates: { lat: 12.9698, lng: 77.75 }, nearby: ["Hoodi", "Brookefield", "Kadugodi", "Marathahalli"],
        searches: ["Flat for rent Whitefield", "PG near ITPL", "2 BHK Whitefield", "Room for rent Hoodi"],
        faqs: [{ q: "Which parts of Whitefield are close to ITPL?", a: "Hoodi, Brookefield and the area around ITPL Main Road are closest; use the map to check walking or metro distance to your office." }, NO_BROKER_FAQ("Whitefield")],
      }),
      locality("Bengaluru", {
        slug: "koramangala", name: "Koramangala", tagline: "Blocks 1–8 · Sony World · Forum", focus: "Flats and PG",
        hero: "Find flats, PG and shared rooms in Koramangala, Bengaluru's startup hub. Browse live listings by block and contact owners directly.",
        coordinates: { lat: 12.9352, lng: 77.6245 }, nearby: ["BTM Layout", "HSR Layout", "Ejipura", "Indiranagar"],
        searches: ["Flat for rent Koramangala", "PG in Koramangala", "1 BHK Koramangala 5th Block", "Shared flat Koramangala"],
        faqs: [{ q: "Is Koramangala good for working professionals?", a: "Yes. It is close to many startup offices and Outer Ring Road, with plenty of cafés, gyms and shared-flat options." }, NO_BROKER_FAQ("Koramangala")],
      }),
      locality("Bengaluru", {
        slug: "hebbal", name: "Hebbal", tagline: "Manyata Tech Park · Hebbal Lake · Airport Road", focus: "Flats near Manyata",
        hero: "Rent flats and PG in Hebbal near Manyata Tech Park and the airport road. Compare live listings on the map and contact owners directly.",
        coordinates: { lat: 13.0358, lng: 77.597 }, nearby: ["Nagawara", "RT Nagar", "Sahakar Nagar", "Yelahanka"],
        searches: ["Flat near Manyata Tech Park", "PG in Hebbal", "2 BHK Hebbal", "Room for rent Nagawara"],
        faqs: [{ q: "Why do people rent in Hebbal?", a: "It is close to Manyata Tech Park and on the way to the airport, so it suits people working in North Bengaluru." }, NO_BROKER_FAQ("Hebbal")],
      }),
      locality("Bengaluru", {
        slug: "hsr-layout", name: "HSR Layout", tagline: "Sectors 1–7 · Agara · Outer Ring Road", focus: "Flats and PG",
        hero: "Find flats, PG and independent floors in HSR Layout, close to Outer Ring Road and Koramangala. Browse live listings and contact owners directly.",
        coordinates: { lat: 12.9116, lng: 77.6474 }, nearby: ["Koramangala", "BTM Layout", "Bellandur", "Agara"],
        searches: ["Flat for rent HSR Layout", "PG in HSR Layout", "2 BHK HSR Sector 2", "Independent floor HSR Layout"],
        faqs: [{ q: "Is HSR Layout good for families?", a: "Yes. Its planned sectors have parks and independent floors as well as apartments, with good access to Outer Ring Road." }, NO_BROKER_FAQ("HSR Layout")],
      }),
    ],
  },

  // ─── Gurugram ──────────────────────────────────────────────────────────────
  {
    countrySlug: "in",
    slug: "gurugram",
    name: "Gurugram",
    country: "India",
    tagline: "Sushant Lok · Golf Course Road · Sohna Road · Palam Vihar · Sector 14 · Sector 56",
    badge: "NOW LIVE — GURUGRAM",
    heroDescription:
      "Find flats, builder floors, PG and office space on rent across Gurugram — from Sushant Lok and Golf Course Road to Sohna Road and Palam Vihar — on one live map. Contact owners directly on RentalPins.",
    coordinates: { lat: 28.4595, lng: 77.0266 },
    popularAreas: ["Sushant Lok", "Golf Course Road", "Sohna Road", "Palam Vihar", "Sector 14", "Sector 56", "DLF Phase 3", "Cyber City", "MG Road"],
    topCategories: [
      { ...PROPERTY, desc: "Society flats, builder floors and PG near Gurugram's offices and metro lines." },
      { ...OFFICE, desc: "Office and retail space on Golf Course Road, MG Road and Sohna Road." },
      { ...VEHICLES, desc: "Cars and bikes for the Delhi–Gurugram commute." },
    ],
    popularSearches: [
      "Flat for rent Sushant Lok", "PG in Gurugram", "Builder floor Palam Vihar", "2 BHK Sohna Road",
      "Flat near Cyber City", "Office space Golf Course Road", "Room for rent Sector 14 Gurugram", "Rent without broker Gurugram",
    ],
    faqs: [
      { q: "Which Gurugram areas are close to Cyber City and the metro?", a: "Sushant Lok, DLF Phase 3 and the MG Road area are close to Cyber City and the Yellow Line and Rapid Metro." },
      { q: "Are builder floors common in Gurugram?", a: "Yes. Palam Vihar, Sushant Lok and the older sectors have many independent builder floors alongside society flats." },
      NO_BROKER_FAQ("Gurugram"),
    ],
    ctaHeading: "Renting out a flat or floor in Gurugram?",
    ctaBody: "List it on RentalPins and reach renters across Sushant Lok, Golf Course Road, Sohna Road and more.",
    status: "live",
    areas: [
      metroArea("Gurugram", "gurugram-metro", { lat: 28.4595, lng: 77.0266 }, ["Old Gurugram", "Golf Course Road", "Sohna Road", "Dwarka Expressway"]),
      locality("Gurugram", {
        slug: "sushant-lok", name: "Sushant Lok", tagline: "Phases 1–3 · MG Road · Galleria", focus: "Flats and builder floors",
        hero: "Rent flats, builder floors and PG in Sushant Lok, close to MG Road, Galleria Market and Cyber City. Browse live listings and contact owners directly.",
        coordinates: { lat: 28.4636, lng: 77.0757 }, nearby: ["DLF Phase 4", "MG Road", "Sector 43", "Golf Course Road"],
        searches: ["Flat for rent Sushant Lok", "Builder floor Sushant Lok Phase 1", "PG Sushant Lok", "2 BHK near Galleria"],
        faqs: [{ q: "Is Sushant Lok well connected?", a: "Yes. It is close to MG Road metro, Golf Course Road and Cyber City, which makes it popular with office-goers." }, NO_BROKER_FAQ("Sushant Lok")],
      }),
      locality("Gurugram", {
        slug: "golf-course-road", name: "Golf Course Road", tagline: "Sectors 42–54 · Rapid Metro · DLF towers", focus: "Apartments and offices",
        hero: "Find apartments, serviced flats and office space on Golf Course Road, Gurugram. Compare live listings along the Rapid Metro and contact owners directly.",
        coordinates: { lat: 28.4503, lng: 77.099 }, nearby: ["Sector 43", "Sector 53", "Sector 54", "Sushant Lok"],
        searches: ["Flat for rent Golf Course Road", "3 BHK Golf Course Road", "Office space Golf Course Road", "Serviced apartment Gurugram"],
        faqs: [{ q: "What kind of rentals are on Golf Course Road?", a: "Mostly high-rise society apartments and office space, served by the Rapid Metro." }, NO_BROKER_FAQ("Golf Course Road")],
      }),
      locality("Gurugram", {
        slug: "sohna-road", name: "Sohna Road", tagline: "Sectors 47–49 · Subhash Chowk · Badshahpur", focus: "Society flats",
        hero: "Rent society flats and builder floors on Sohna Road, Gurugram. Browse live listings from Subhash Chowk to Badshahpur and contact owners directly.",
        coordinates: { lat: 28.4089, lng: 77.042 }, nearby: ["Sector 48", "Sector 49", "Sector 47", "Badshahpur"],
        searches: ["Flat for rent Sohna Road", "2 BHK Sector 48 Gurugram", "Builder floor Sohna Road", "Room for rent Sector 49"],
        faqs: [{ q: "Is Sohna Road good for families?", a: "Yes. It has many gated societies with schools and markets nearby, at rents often below Golf Course Road." }, NO_BROKER_FAQ("Sohna Road")],
      }),
      locality("Gurugram", {
        slug: "palam-vihar", name: "Palam Vihar", tagline: "Blocks A–J · Dwarka Expressway · Delhi border", focus: "Independent floors",
        hero: "Find independent floors, flats and rooms in Palam Vihar near the Delhi border and Dwarka Expressway. Browse live listings and contact owners directly.",
        coordinates: { lat: 28.5065, lng: 77.0367 }, nearby: ["Sector 22", "Sector 23", "Dwarka", "Dwarka Expressway"],
        searches: ["Floor for rent Palam Vihar", "2 BHK Palam Vihar", "Room for rent Palam Vihar", "Independent house Palam Vihar"],
        faqs: [{ q: "Why rent in Palam Vihar?", a: "It is a settled residential colony with independent floors and quick road access to Dwarka and the airport." }, NO_BROKER_FAQ("Palam Vihar")],
      }),
      locality("Gurugram", {
        slug: "sector-14-gurugram", name: "Sector 14, Gurugram", tagline: "Old Gurugram · Sector 14 Market · Huda City Centre road", focus: "Rooms, PG and shops",
        hero: "Rent rooms, PG, flats and shops in Sector 14 and old Gurugram. Browse live listings around Sector 14 Market and contact owners directly.",
        coordinates: { lat: 28.471, lng: 77.043 }, nearby: ["Sector 15", "Sector 17", "Old Gurugram", "Sector 31"],
        searches: ["Room for rent Sector 14 Gurugram", "PG Sector 14", "Shop for rent Sector 14 Market", "1 BHK old Gurugram"],
        faqs: [{ q: "What rentals are common in Sector 14?", a: "Rooms, PG and independent floors, plus shops around Sector 14 Market." }, NO_BROKER_FAQ("Sector 14")],
      }),
      locality("Gurugram", {
        slug: "sector-56-gurugram", name: "Sector 56, Gurugram", tagline: "Golf Course Extension · Rapid Metro Sector 55–56", focus: "Society flats",
        hero: "Find society flats and PG in Sector 56, Gurugram, near Golf Course Extension Road and the Rapid Metro. Contact owners directly on RentalPins.",
        coordinates: { lat: 28.422, lng: 77.108 }, nearby: ["Sector 55", "Sector 57", "Golf Course Extension", "Sector 54"],
        searches: ["Flat for rent Sector 56 Gurugram", "2 BHK Sector 56", "PG near Sector 55–56 metro", "Flat Golf Course Extension"],
        faqs: [{ q: "Is Sector 56 near the metro?", a: "Yes. The Sector 55–56 Rapid Metro station serves it, with Golf Course Road a short ride away." }, NO_BROKER_FAQ("Sector 56")],
      }),
    ],
  },

  // ─── Hyderabad ─────────────────────────────────────────────────────────────
  {
    countrySlug: "in",
    slug: "hyderabad",
    name: "Hyderabad",
    country: "India",
    tagline: "Kondapur · Madhapur · HITEC City · Gachibowli · Kukatpally · Secunderabad",
    badge: "NOW LIVE — HYDERABAD",
    heroDescription:
      "Find flats, PG and rooms on rent across Hyderabad — from Kondapur and Madhapur near HITEC City to Kukatpally and Secunderabad — on one live map. Contact owners directly on RentalPins.",
    coordinates: { lat: 17.385, lng: 78.4867 },
    popularAreas: ["Kondapur", "Madhapur", "HITEC City", "Gachibowli", "Kukatpally", "Secunderabad", "Banjara Hills", "Ameerpet"],
    topCategories: [
      { ...PROPERTY, desc: "Flats, gated-community apartments and PG near HITEC City and the Financial District." },
      { ...VEHICLES, desc: "Bikes and cars for the IT corridor commute." },
      { ...OFFICE, desc: "Office and co-working space in Madhapur and HITEC City." },
    ],
    popularSearches: [
      "Flat for rent Kondapur", "PG in Madhapur", "PG near HITEC City", "2 BHK Gachibowli",
      "Room for rent Kukatpally", "Flat Secunderabad", "Gated community flat Hyderabad", "Rent without broker Hyderabad",
    ],
    faqs: [
      { q: "Where do IT professionals rent in Hyderabad?", a: "Kondapur, Madhapur and Gachibowli are closest to HITEC City and the Financial District; Kukatpally is popular for its metro connection." },
      { q: "Are gated-community flats common in Hyderabad?", a: "Yes. The western IT corridor has many gated communities alongside independent houses and PG." },
      NO_BROKER_FAQ("Hyderabad"),
    ],
    ctaHeading: "Have a flat or PG to rent in Hyderabad?",
    ctaBody: "List it on RentalPins and reach renters across Kondapur, Madhapur, Gachibowli and more.",
    status: "live",
    areas: [
      metroArea("Hyderabad", "hyderabad-metro", { lat: 17.385, lng: 78.4867 }, ["HITEC City corridor", "Kukatpally", "Secunderabad", "Old City"]),
      locality("Hyderabad", {
        slug: "kondapur", name: "Kondapur", tagline: "Botanical Garden · Kothaguda · HITEC City", focus: "Flats near HITEC City",
        hero: "Rent flats, PG and rooms in Kondapur, a short ride from HITEC City and Gachibowli. Browse live listings and contact owners directly.",
        coordinates: { lat: 17.47, lng: 78.3637 }, nearby: ["Madhapur", "Gachibowli", "Kothaguda", "Miyapur"],
        searches: ["Flat for rent Kondapur", "PG in Kondapur", "2 BHK Kondapur", "Room near Botanical Garden"],
        faqs: [{ q: "Why rent in Kondapur?", a: "It sits between HITEC City and Gachibowli, with many apartments and PG at rents often below Madhapur." }, NO_BROKER_FAQ("Kondapur")],
      }),
      locality("Hyderabad", {
        slug: "madhapur", name: "Madhapur", tagline: "HITEC City · Durgam Cheruvu · Cyber Towers", focus: "PG and flats",
        hero: "Find PG, flats and office space in Madhapur, at the heart of HITEC City. Compare live listings on the map and contact owners directly.",
        coordinates: { lat: 17.4483, lng: 78.3915 }, nearby: ["HITEC City", "Jubilee Hills", "Kondapur", "Gachibowli"],
        searches: ["PG in Madhapur", "PG near HITEC City", "Flat for rent Madhapur", "Office space Madhapur"],
        faqs: [{ q: "Is Madhapur close to the metro?", a: "Yes. The HITEC City and Durgam Cheruvu metro stations serve Madhapur." }, NO_BROKER_FAQ("Madhapur")],
      }),
    ],
  },

  // ─── Kolkata ───────────────────────────────────────────────────────────────
  {
    countrySlug: "in",
    slug: "kolkata",
    name: "Kolkata",
    country: "India",
    tagline: "Salt Lake · New Town · Garia · Park Street · Ballygunge · Behala",
    badge: "NOW LIVE — KOLKATA",
    heroDescription:
      "Find flats, PG and rooms on rent across Kolkata — from Salt Lake and New Town to Garia and South Kolkata — on one live map. Contact owners directly on RentalPins.",
    coordinates: { lat: 22.5726, lng: 88.3639 },
    popularAreas: ["Salt Lake", "New Town", "Garia", "Park Street", "Ballygunge", "Behala", "Dum Dum", "Tollygunge"],
    topCategories: [
      { ...PROPERTY, desc: "Flats, PG and rooms near Salt Lake Sector V and across South Kolkata." },
      { ...OFFICE, desc: "Office space in Salt Lake Sector V and New Town." },
      { ...VEHICLES, desc: "Cars and bikes on rent." },
    ],
    popularSearches: [
      "Flat for rent Salt Lake", "PG near Sector V", "Flat New Town Kolkata", "Room for rent Garia",
      "1 BHK South Kolkata", "PG for students Kolkata", "Office space Salt Lake", "Rent without broker Kolkata",
    ],
    faqs: [
      { q: "Where do IT professionals rent in Kolkata?", a: "Salt Lake and New Town are closest to Sector V and the New Town IT hubs." },
      { q: "Which Kolkata areas suit students?", a: "Garia, Jadavpur and parts of South Kolkata have many PG and room listings near colleges and the metro." },
      NO_BROKER_FAQ("Kolkata"),
    ],
    ctaHeading: "Have a flat or PG to rent in Kolkata?",
    ctaBody: "List it on RentalPins and reach renters across Salt Lake, New Town and South Kolkata.",
    status: "live",
    areas: [
      metroArea("Kolkata", "kolkata-metro", { lat: 22.5726, lng: 88.3639 }, ["Salt Lake and New Town", "Central Kolkata", "South Kolkata", "North Kolkata"]),
      locality("Kolkata", {
        slug: "salt-lake", name: "Salt Lake", tagline: "Bidhannagar · Sector V · City Centre", focus: "Flats, PG and offices",
        hero: "Rent flats, PG and office space in Salt Lake (Bidhannagar), close to Sector V. Browse live listings and contact owners directly.",
        coordinates: { lat: 22.58, lng: 88.415 }, nearby: ["Sector V", "New Town", "Kestopur", "Lake Town"],
        searches: ["Flat for rent Salt Lake", "PG near Sector V", "Office space Salt Lake", "1 BHK Salt Lake"],
        faqs: [{ q: "Is Salt Lake good for working near Sector V?", a: "Yes. Most of Salt Lake is a short ride from Sector V, and the East–West Metro serves the area." }, NO_BROKER_FAQ("Salt Lake")],
      }),
    ],
  },

  // ─── Ghaziabad ─────────────────────────────────────────────────────────────
  {
    countrySlug: "in",
    slug: "ghaziabad",
    name: "Ghaziabad",
    country: "India",
    tagline: "Indirapuram · Vaishali · Raj Nagar Extension · Crossings Republik · Kaushambi",
    badge: "NOW LIVE — GHAZIABAD",
    heroDescription:
      "Find flats, rooms and PG on rent across Ghaziabad — Indirapuram, Vaishali, Raj Nagar Extension and Crossings Republik — on one live map. Contact owners directly on RentalPins.",
    coordinates: { lat: 28.6692, lng: 77.4538 },
    popularAreas: ["Indirapuram", "Vaishali", "Raj Nagar Extension", "Crossings Republik", "Kaushambi", "Vasundhara"],
    topCategories: [
      { ...PROPERTY, desc: "Society flats, builder floors and PG close to Delhi and Noida." },
      { ...VEHICLES, desc: "Cars and bikes for the Delhi–NCR commute." },
      { ...OFFICE, desc: "Shops and office space in Ghaziabad's markets." },
    ],
    popularSearches: [
      "Flat for rent Indirapuram", "Room for rent Vaishali", "2 BHK Raj Nagar Extension", "Flat Crossings Republik",
      "PG near Vaishali metro", "Builder floor Ghaziabad", "1 BHK Kaushambi", "Rent without broker Ghaziabad",
    ],
    faqs: [
      { q: "Which Ghaziabad areas are close to Delhi?", a: "Indirapuram, Vaishali and Kaushambi border East Delhi and are served by the Blue Line metro." },
      { q: "Is Raj Nagar Extension good for families?", a: "It has many newer gated societies at rents usually below the areas next to Delhi." },
      NO_BROKER_FAQ("Ghaziabad"),
    ],
    ctaHeading: "Renting out a flat in Ghaziabad?",
    ctaBody: "List it on RentalPins and reach renters across Indirapuram, Vaishali and Raj Nagar Extension.",
    status: "live",
    areas: [
      metroArea("Ghaziabad", "ghaziabad-metro", { lat: 28.6692, lng: 77.4538 }, ["Trans-Hindon", "Raj Nagar Extension", "NH-24 corridor", "Old Ghaziabad"]),
    ],
  },

  // ─── Pune ──────────────────────────────────────────────────────────────────
  {
    countrySlug: "in",
    slug: "pune",
    name: "Pune",
    country: "India",
    tagline: "Hinjewadi · Kharadi · Wakad · Baner · Viman Nagar · Kothrud",
    badge: "NOW LIVE — PUNE",
    heroDescription:
      "Find flats, PG and rooms on rent across Pune — from Hinjewadi and Wakad to Kharadi and Viman Nagar — on one live map. Contact owners directly on RentalPins.",
    coordinates: { lat: 18.5204, lng: 73.8567 },
    popularAreas: ["Hinjewadi", "Kharadi", "Wakad", "Baner", "Viman Nagar", "Kothrud", "Hadapsar", "Magarpatta"],
    topCategories: [
      { ...PROPERTY, desc: "Flats, PG and shared rooms near Pune's IT parks and colleges." },
      { ...VEHICLES, desc: "Bikes and scooters for the Hinjewadi and Kharadi commute." },
      { ...ELECTRONICS, desc: "Appliances and furniture on rent for students and new joiners." },
    ],
    popularSearches: [
      "Flat for rent Hinjewadi", "PG in Hinjewadi", "PG near Kharadi EON IT Park", "2 BHK Wakad",
      "Room for rent Baner", "Flat Viman Nagar", "PG for students Pune", "Rent without broker Pune",
    ],
    faqs: [
      { q: "Where do IT professionals rent in Pune?", a: "Hinjewadi, Wakad and Baner suit the Hinjewadi IT Park; Kharadi and Viman Nagar suit EON IT Park and the airport side." },
      { q: "Which Pune areas suit students?", a: "Kothrud, Deccan and the areas around university campuses have many PG and shared-room listings." },
      NO_BROKER_FAQ("Pune"),
    ],
    ctaHeading: "Have a flat or PG to rent in Pune?",
    ctaBody: "List it on RentalPins and reach renters across Hinjewadi, Wakad, Kharadi and more.",
    status: "live",
    areas: [
      metroArea("Pune", "pune-metro", { lat: 18.5204, lng: 73.8567 }, ["West Pune IT belt", "East Pune", "Central Pune", "Pimpri-Chinchwad"]),
      locality("Pune", {
        slug: "hinjewadi", name: "Hinjewadi", tagline: "Phases 1–3 · Rajiv Gandhi Infotech Park · Maan", focus: "Flats and PG near IT Park",
        hero: "Rent flats, PG and rooms in Hinjewadi, home to the Rajiv Gandhi Infotech Park. Browse live listings and contact owners directly.",
        coordinates: { lat: 18.5913, lng: 73.7389 }, nearby: ["Wakad", "Baner", "Maan", "Marunji"],
        searches: ["Flat for rent Hinjewadi", "PG in Hinjewadi Phase 1", "2 BHK Hinjewadi", "Room near Rajiv Gandhi Infotech Park"],
        faqs: [{ q: "Which side of Hinjewadi is best for renting?", a: "Phase 1 and the Wakad side are closest to most offices and shops; Phases 2 and 3 suit people working further inside the park." }, NO_BROKER_FAQ("Hinjewadi")],
      }),
    ],
  },

  // ─── Patna ─────────────────────────────────────────────────────────────────
  {
    countrySlug: "in",
    slug: "patna",
    name: "Patna",
    country: "India",
    tagline: "Bailey Road · Patliputra · Boring Road · Kankarbagh · Rajendra Nagar",
    badge: "NOW LIVE — PATNA",
    heroDescription:
      "Find flats, rooms and PG on rent across Patna — Bailey Road, Patliputra, Boring Road and Kankarbagh — on one live map. Contact owners directly on RentalPins.",
    coordinates: { lat: 25.5941, lng: 85.1376 },
    popularAreas: ["Bailey Road", "Patliputra", "Boring Road", "Kankarbagh", "Rajendra Nagar", "Ashok Rajpath"],
    topCategories: [
      { ...PROPERTY, desc: "Flats, rooms and PG for families, students and coaching aspirants." },
      { ...OFFICE, desc: "Shops and office space on Boring Road and Bailey Road." },
      { ...VEHICLES, desc: "Cars and bikes on rent." },
    ],
    popularSearches: [
      "Flat for rent Bailey Road", "Room for rent Boring Road", "PG for students Patna", "Flat Patliputra Colony",
      "Room Kankarbagh", "PG near Ashok Rajpath", "2 BHK Patna", "Rent without broker Patna",
    ],
    faqs: [
      { q: "Which Patna areas suit students?", a: "Boring Road, Kankarbagh and the Ashok Rajpath belt have many rooms and PG close to coaching centres and colleges." },
      { q: "Where do families rent in Patna?", a: "Patliputra Colony, Bailey Road and Rajendra Nagar are popular for flats and independent houses." },
      NO_BROKER_FAQ("Patna"),
    ],
    ctaHeading: "Have a room or flat to rent in Patna?",
    ctaBody: "List it on RentalPins and reach renters across Bailey Road, Boring Road and Kankarbagh.",
    status: "live",
    areas: [
      metroArea("Patna", "patna-metro", { lat: 25.5941, lng: 85.1376 }, ["West Patna", "Central Patna", "Kankarbagh", "Danapur"]),
      locality("Patna", {
        slug: "bailey-road", name: "Bailey Road", tagline: "Raja Bazar · Shastri Nagar · Danapur road", focus: "Flats and offices",
        hero: "Rent flats, rooms and office space along Bailey Road, Patna. Browse live listings and contact owners directly.",
        coordinates: { lat: 25.609, lng: 85.08 }, nearby: ["Shastri Nagar", "Raja Bazar", "Patliputra", "Danapur"],
        searches: ["Flat for rent Bailey Road", "Office space Bailey Road", "2 BHK Bailey Road", "Room for rent Shastri Nagar"],
        faqs: [{ q: "Is Bailey Road well connected?", a: "Yes. It runs across west Patna towards Danapur, with offices, hospitals and markets along the road." }, NO_BROKER_FAQ("Bailey Road")],
      }),
      locality("Patna", {
        slug: "patliputra", name: "Patliputra", tagline: "Patliputra Colony · Pataliputra station", focus: "Flats and houses",
        hero: "Find flats and independent houses in Patliputra Colony, one of Patna's planned residential areas. Contact owners directly on RentalPins.",
        coordinates: { lat: 25.623, lng: 85.096 }, nearby: ["Boring Road", "Bailey Road", "Rajeev Nagar", "Kurji"],
        searches: ["Flat for rent Patliputra Colony", "House for rent Patliputra", "2 BHK Patliputra", "Room Patliputra"],
        faqs: [{ q: "Why rent in Patliputra?", a: "It is a quieter planned colony with independent houses, close to Boring Road and Pataliputra Junction." }, NO_BROKER_FAQ("Patliputra")],
      }),
      locality("Patna", {
        slug: "kankarbagh", name: "Kankarbagh", tagline: "Lohia Nagar · Patrakar Nagar · Rajendra Nagar", focus: "Rooms and PG",
        hero: "Rent rooms, PG and flats in Kankarbagh, a large residential area popular with students. Browse live listings and contact owners directly.",
        coordinates: { lat: 25.594, lng: 85.159 }, nearby: ["Rajendra Nagar", "Lohia Nagar", "Patrakar Nagar", "Bahadurpur"],
        searches: ["Room for rent Kankarbagh", "PG Kankarbagh", "Flat Kankarbagh", "Student room Rajendra Nagar"],
        faqs: [{ q: "Is Kankarbagh good for students?", a: "Yes. It has many rooms and PG close to coaching centres in Rajendra Nagar and the Ashok Rajpath area." }, NO_BROKER_FAQ("Kankarbagh")],
      }),
      locality("Patna", {
        slug: "boring-road", name: "Boring Road", tagline: "Boring Canal Road · coaching belt · markets", focus: "Rooms, PG and shops",
        hero: "Find rooms, PG, flats and shops on Boring Road, Patna's busy coaching and shopping street. Contact owners directly on RentalPins.",
        coordinates: { lat: 25.612, lng: 85.11 }, nearby: ["Patliputra", "SK Puri", "Boring Canal Road", "Ashiana Nagar"],
        searches: ["Room for rent Boring Road", "PG Boring Road", "Shop for rent Boring Road", "Flat SK Puri"],
        faqs: [{ q: "What rentals are common on Boring Road?", a: "Rooms and PG for coaching students, flats in the side lanes, and shops along the main road." }, NO_BROKER_FAQ("Boring Road")],
      }),
    ],
  },

  // ─── Indore ────────────────────────────────────────────────────────────────
  {
    countrySlug: "in",
    slug: "indore",
    name: "Indore",
    country: "India",
    tagline: "Vijay Nagar · Palasia · AB Road · Bhawarkuan · Rau",
    badge: "NOW LIVE — INDORE",
    heroDescription:
      "Find flats, PG and rooms on rent across Indore — Vijay Nagar, Palasia, AB Road and Bhawarkuan — on one live map. Contact owners directly on RentalPins.",
    coordinates: { lat: 22.7196, lng: 75.8577 },
    popularAreas: ["Vijay Nagar", "Palasia", "AB Road", "Bhawarkuan", "Rau", "Super Corridor"],
    topCategories: [
      { ...PROPERTY, desc: "Flats, PG and rooms for students and professionals." },
      { ...OFFICE, desc: "Office and retail space on AB Road and in Vijay Nagar." },
      { ...VEHICLES, desc: "Cars and bikes on rent." },
    ],
    popularSearches: [
      "Flat for rent Vijay Nagar", "PG in Indore", "PG near Bhawarkuan", "Flat Palasia",
      "Office space AB Road", "Room for rent Indore", "2 BHK Vijay Nagar", "Rent without broker Indore",
    ],
    faqs: [
      { q: "Which Indore areas suit students?", a: "Bhawarkuan and the areas near coaching institutes and DAVV campuses have many PG and room listings." },
      { q: "Where do professionals rent in Indore?", a: "Vijay Nagar and the AB Road corridor are close to offices, malls and the Super Corridor." },
      NO_BROKER_FAQ("Indore"),
    ],
    ctaHeading: "Have a flat or PG to rent in Indore?",
    ctaBody: "List it on RentalPins and reach renters across Vijay Nagar, Palasia and Bhawarkuan.",
    status: "live",
    areas: [
      metroArea("Indore", "indore-metro", { lat: 22.7196, lng: 75.8577 }, ["AB Road corridor", "Central Indore", "Bhawarkuan", "Super Corridor"]),
      locality("Indore", {
        slug: "vijay-nagar-indore", name: "Vijay Nagar", tagline: "AB Road · Scheme 54 · C21 Mall", focus: "Flats, PG and offices",
        hero: "Rent flats, PG and office space in Vijay Nagar, Indore's commercial hub on AB Road. Browse live listings and contact owners directly.",
        coordinates: { lat: 22.753, lng: 75.894 }, nearby: ["Scheme 54", "Scheme 78", "AB Road", "Super Corridor"],
        searches: ["Flat for rent Vijay Nagar", "PG Vijay Nagar Indore", "Office space Vijay Nagar", "2 BHK Scheme 54"],
        faqs: [{ q: "Why rent in Vijay Nagar?", a: "It is Indore's busiest commercial area, with offices, malls and many flats and PG nearby." }, NO_BROKER_FAQ("Vijay Nagar")],
      }),
      locality("Indore", {
        slug: "palasia", name: "Palasia", tagline: "New Palasia · Old Palasia · 56 Dukan", focus: "Flats and shops",
        hero: "Find flats, shops and office space in Palasia, central Indore. Browse live listings and contact owners directly on RentalPins.",
        coordinates: { lat: 22.724, lng: 75.884 }, nearby: ["New Palasia", "Old Palasia", "Geeta Bhawan", "Saket Nagar"],
        searches: ["Flat for rent Palasia", "Shop for rent New Palasia", "Office space Palasia", "1 BHK Old Palasia"],
        faqs: [{ q: "What rentals are common in Palasia?", a: "Flats in residential lanes, plus shops and offices around New Palasia and 56 Dukan." }, NO_BROKER_FAQ("Palasia")],
      }),
    ],
  },

  // ─── Bhopal ────────────────────────────────────────────────────────────────
  {
    countrySlug: "in",
    slug: "bhopal",
    name: "Bhopal",
    country: "India",
    tagline: "MP Nagar · Arera Colony · Kolar Road · Indrapuri · Hoshangabad Road",
    badge: "NOW LIVE — BHOPAL",
    heroDescription:
      "Find flats, rooms and PG on rent across Bhopal — MP Nagar, Arera Colony, Kolar Road and Indrapuri — on one live map. Contact owners directly on RentalPins.",
    coordinates: { lat: 23.2599, lng: 77.4126 },
    popularAreas: ["MP Nagar", "Arera Colony", "Kolar Road", "Indrapuri", "Hoshangabad Road", "Shahpura"],
    topCategories: [
      { ...PROPERTY, desc: "Flats, rooms and PG for students, families and government staff." },
      { ...OFFICE, desc: "Office and shop space in MP Nagar." },
      { ...VEHICLES, desc: "Cars and bikes on rent." },
    ],
    popularSearches: [
      "Flat for rent MP Nagar", "Room for rent Bhopal", "PG for students Bhopal", "Flat Arera Colony",
      "2 BHK Kolar Road", "PG near Indrapuri", "Office space MP Nagar", "Rent without broker Bhopal",
    ],
    faqs: [
      { q: "Which Bhopal areas suit students?", a: "Indrapuri, Ayodhya Bypass and areas near engineering colleges have many rooms and PG." },
      { q: "Where do families rent in Bhopal?", a: "Arera Colony, Shahpura and Kolar Road are popular for flats and independent houses." },
      NO_BROKER_FAQ("Bhopal"),
    ],
    ctaHeading: "Have a room or flat to rent in Bhopal?",
    ctaBody: "List it on RentalPins and reach renters across MP Nagar, Arera Colony and Kolar Road.",
    status: "live",
    areas: [
      metroArea("Bhopal", "bhopal-metro", { lat: 23.2599, lng: 77.4126 }, ["New Bhopal", "Old City", "Kolar Road", "Hoshangabad Road"]),
    ],
  },
];

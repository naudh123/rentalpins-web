const fs = require("fs");
const path = require("path");

const root = process.cwd();
const areaConfigPath = path.join(root, "lib", "area-config.ts");
const citiesConfigPath = path.join(root, "lib", "cities-config.ts");

function fail(msg) {
  console.error(`❌ ${msg}`);
  process.exit(1);
}

function backupFile(filePath) {
  const backupPath = `${filePath}.bak`;
  if (!fs.existsSync(backupPath)) {
    fs.copyFileSync(filePath, backupPath);
    console.log(`🛟 Backup created: ${path.basename(backupPath)}`);
  }
}

function ensureFile(filePath) {
  if (!fs.existsSync(filePath)) {
    fail(`Missing file: ${filePath}`);
  }
}

const delhiAreasBlock = `
// ─── Delhi ───────────────────────────────────────────────────────────────────

export const DELHI_AREAS: AreaConfig[] = [
  {
    slug: "delhi",
    name: "Delhi",
    city: "Delhi",
    geohashPrefixes: ["ttn", "ttq", "tts"],
    center: { lat: 28.6139, lng: 77.2090 },
    radiusKm: 30,
    description: "Browse rental listings across Delhi — PG, rooms, flats, vehicles and more.",
  },
  {
    slug: "mukherjee-nagar",
    name: "Mukherjee Nagar",
    city: "Delhi",
    geohashPrefixes: ["tts5", "tts7", "ttse"],
    center: { lat: 28.7007, lng: 77.2059 },
    radiusKm: 3,
    description: "Find PG, rooms and rentals in Mukherjee Nagar — Delhi's top student and UPSC hub.",
  },
  {
    slug: "gtb-nagar",
    name: "GTB Nagar",
    city: "Delhi",
    geohashPrefixes: ["tts5", "tts7"],
    center: { lat: 28.6982, lng: 77.2058 },
    radiusKm: 2.5,
    description: "Explore rentals in GTB Nagar near Delhi University North Campus.",
  },
  {
    slug: "hudson-lane",
    name: "Hudson Lane",
    city: "Delhi",
    geohashPrefixes: ["tts5", "tts7"],
    center: { lat: 28.6964, lng: 77.2050 },
    radiusKm: 2,
    description: "Browse PGs, rooms and flats in Hudson Lane — popular student hotspot.",
  },
  {
    slug: "dwarka",
    name: "Dwarka",
    city: "Delhi",
    geohashPrefixes: ["ttnq", "ttnr", "ttnw"],
    center: { lat: 28.5921, lng: 77.0460 },
    radiusKm: 8,
    description: "Find rental properties in Dwarka — flats, homes and more.",
  },
  {
    slug: "rohini",
    name: "Rohini",
    city: "Delhi",
    geohashPrefixes: ["ttnh", "ttnj", "ttnn"],
    center: { lat: 28.7494, lng: 77.0562 },
    radiusKm: 7,
    description: "Explore rentals in Rohini — affordable housing and family homes.",
  },
  {
    slug: "jasola",
    name: "Jasola",
    city: "Delhi",
    geohashPrefixes: ["ttq4", "ttq5"],
    center: { lat: 28.5450, lng: 77.2910 },
    radiusKm: 4,
    description: "Find rentals in Jasola — office-linked and residential demand hub.",
  },
  {
    slug: "sarita-vihar",
    name: "Sarita Vihar",
    city: "Delhi",
    geohashPrefixes: ["ttq4", "ttq5"],
    center: { lat: 28.5315, lng: 77.2913 },
    radiusKm: 4,
    description: "Browse rentals in Sarita Vihar — flats, PGs and family homes.",
  },
];

`;

const delhiCityBlock = `
  {
    slug: "delhi",
    name: "Delhi",
    country: "India",
    tagline: "Mukherjee Nagar · GTB Nagar · Hudson Lane · Dwarka · Rohini · Jasola · Sarita Vihar",
    badge: "NOW LIVE — DELHI",
    heroDescription:
      "Browse PG, rooms, flats, vehicles and more on rent across Delhi — including student hubs, family neighbourhoods and office-linked rental corridors — all on one live map.",
    coordinates: { lat: 28.6139, lng: 77.2090 },
    popularAreas: [
      "Mukherjee Nagar", "GTB Nagar", "Hudson Lane", "Dwarka",
      "Rohini", "Jasola", "Sarita Vihar", "North Campus",
      "Kamla Nagar", "NSP", "South East Delhi", "West Delhi"
    ],
    topCategories: [
      { name: "Property", color: "#7B1FA2", icon: "🏠", desc: "Rooms, PG, apartments, builder floors, houses and shops across Delhi." },
      { name: "Vehicles", color: "#1976D2", icon: "🚗", desc: "Cars, bikes and scooters on rent across key Delhi neighbourhoods." },
      { name: "Office Space", color: "#FF8F00", icon: "💼", desc: "Office, retail and co-working options in professional and mixed-use corridors." },
    ],
    popularSearches: [
      "PG in Mukherjee Nagar", "Room for rent in GTB Nagar",
      "PG in Hudson Lane", "Flat for rent in Dwarka",
      "Apartment for rent in Rohini", "Flats in Jasola",
      "Rental homes in Sarita Vihar", "Delhi rentals without broker",
      "PG near North Campus", "Family rental homes in Delhi"
    ],
    faqs: [
      { q: "Which are the best rental areas in Delhi?", a: "Popular Delhi rental areas include Mukherjee Nagar, GTB Nagar, Hudson Lane, Dwarka, Rohini, Jasola and Sarita Vihar." },
      { q: "Can I find PG and room rentals in Delhi on RentalPins?", a: "Yes. RentalPins helps users discover PG, rooms, flats and more across Delhi on the live map and contact owners directly." },
      { q: "Is it free to list rentals in Delhi on RentalPins?", a: "You can check the current listing offer inside the RentalPins app. Availability of free or paid plans may vary by area and time." },
    ],
    ctaHeading: "Have something to rent in Delhi?",
    ctaBody: "List your property, PG, room, vehicle or office space on RentalPins and reach renters across Delhi faster.",
    status: "live",
    areas: [
      {
        slug: "mukherjee-nagar",
        name: "Mukherjee Nagar",
        tagline: "UPSC · PG · Rooms · Student Rentals",
        badge: "NOW LIVE — MUKHERJEE NAGAR",
        primaryFocus: "PG, rooms and student rentals",
        heroDescription: "Discover PG, rooms, flats and rentals in Mukherjee Nagar — one of Delhi's strongest student and UPSC coaching markets.",
        coordinates: { lat: 28.7007, lng: 77.2059 },
        popularAreas: ["Batra Cinema", "Nehru Vihar", "Vijay Nagar", "North Campus"],
        topCategories: [
          { name: "Property", color: "#7B1FA2", icon: "🏠", desc: "PG, rooms, shared flats and student-focused rentals in Mukherjee Nagar." },
          { name: "Furniture", color: "#5D4037", icon: "🛋️", desc: "Beds, desks and room furniture packages for students and working renters." },
          { name: "Vehicles", color: "#1976D2", icon: "🚗", desc: "Bikes and scooters for commuting around North Delhi." },
        ],
        popularSearches: [
          "PG in Mukherjee Nagar", "Room for rent in Mukherjee Nagar",
          "Student room Mukherjee Nagar", "Shared flat Mukherjee Nagar"
        ],
        faqs: [
          { q: "Is Mukherjee Nagar good for PG rentals?", a: "Yes. Mukherjee Nagar is one of Delhi's most active PG and student rental areas because of coaching demand and proximity to North Campus." },
        ],
        ctaHeading: "Have something to rent in Mukherjee Nagar?",
        ctaBody: "List your PG, room or flat and reach students and UPSC aspirants across Mukherjee Nagar.",
      },
      {
        slug: "gtb-nagar",
        name: "GTB Nagar",
        tagline: "North Campus · PG · Rooms · Flats",
        badge: "NOW LIVE — GTB NAGAR",
        primaryFocus: "PG, flats and rooms",
        heroDescription: "Browse PG, rooms and flats in GTB Nagar near Delhi University North Campus.",
        coordinates: { lat: 28.6982, lng: 77.2058 },
        popularAreas: ["North Campus", "Kamla Nagar", "Hudson Lane"],
        topCategories: [
          { name: "Property", color: "#7B1FA2", icon: "🏠", desc: "PG, rooms and apartments near GTB Nagar metro and North Campus." },
          { name: "Vehicles", color: "#1976D2", icon: "🚗", desc: "Daily commute options for students and working renters." },
          { name: "Furniture", color: "#5D4037", icon: "🛋️", desc: "Rental furniture for rooms, PG and small flats." },
        ],
        popularSearches: [
          "PG in GTB Nagar", "Room for rent in GTB Nagar",
          "Flat in GTB Nagar", "North Campus rentals"
        ],
        faqs: [
          { q: "Is GTB Nagar good for students?", a: "Yes. GTB Nagar is a major student rental area due to its metro access and closeness to North Campus." },
        ],
        ctaHeading: "Have something to rent in GTB Nagar?",
        ctaBody: "List your PG, room or flat and connect with renters in GTB Nagar.",
      },
      {
        slug: "hudson-lane",
        name: "Hudson Lane",
        tagline: "Student Hotspot · Shared Flats · PG",
        badge: "NOW LIVE — HUDSON LANE",
        primaryFocus: "PG, shared flats and rooms",
        heroDescription: "Find PG, shared flats and room rentals in Hudson Lane near North Campus.",
        coordinates: { lat: 28.6964, lng: 77.2050 },
        popularAreas: ["GTB Nagar", "Kamla Nagar", "North Campus"],
        topCategories: [
          { name: "Property", color: "#7B1FA2", icon: "🏠", desc: "PG, shared flats and student rentals in Hudson Lane." },
          { name: "Furniture", color: "#5D4037", icon: "🛋️", desc: "Beds, study tables and room essentials on rent." },
          { name: "Vehicles", color: "#1976D2", icon: "🚗", desc: "Scooters and bikes for short-distance mobility." },
        ],
        popularSearches: [
          "PG in Hudson Lane", "Room in Hudson Lane",
          "Shared flat Hudson Lane", "Student rentals Hudson Lane"
        ],
        faqs: [
          { q: "What kind of rentals are popular in Hudson Lane?", a: "Hudson Lane is best known for PG, shared flats and student rooms because of demand from Delhi University students." },
        ],
        ctaHeading: "Have something to rent in Hudson Lane?",
        ctaBody: "List your PG, room or flat and reach student renters searching Hudson Lane.",
      },
      {
        slug: "dwarka",
        name: "Dwarka",
        tagline: "Family Homes · Apartments · Builder Floors",
        badge: "NOW LIVE — DWARKA",
        primaryFocus: "Apartments and family homes",
        heroDescription: "Explore flats, builder floors and family rentals in Dwarka — one of West Delhi's strongest rental markets.",
        coordinates: { lat: 28.5921, lng: 77.0460 },
        popularAreas: ["Sector 6", "Sector 10", "Sector 12", "Sector 14", "Sector 21"],
        topCategories: [
          { name: "Property", color: "#7B1FA2", icon: "🏠", desc: "Apartments, builder floors and family homes across Dwarka sectors." },
          { name: "Vehicles", color: "#1976D2", icon: "🚗", desc: "Cars and bikes for daily commuting in West Delhi." },
          { name: "Furniture", color: "#5D4037", icon: "🛋️", desc: "Home furniture and appliances for family moves." },
        ],
        popularSearches: [
          "Flat for rent in Dwarka", "Dwarka rental homes",
          "2 BHK in Dwarka", "Builder floor Dwarka"
        ],
        faqs: [
          { q: "Is Dwarka good for family rentals?", a: "Yes. Dwarka is a planned West Delhi sub-city with strong family demand, metro access and a large apartment stock." },
        ],
        ctaHeading: "Have something to rent in Dwarka?",
        ctaBody: "List your apartment, floor or home in Dwarka and reach family renters faster.",
      },
      {
        slug: "rohini",
        name: "Rohini",
        tagline: "Affordable Homes · Apartments · Rooms",
        badge: "NOW LIVE — ROHINI",
        primaryFocus: "Family and working rentals",
        heroDescription: "Browse affordable apartments, builder floors and rentals across Rohini.",
        coordinates: { lat: 28.7494, lng: 77.0562 },
        popularAreas: ["Sector 3", "Sector 7", "Sector 9", "Sector 13", "Sector 24"],
        topCategories: [
          { name: "Property", color: "#7B1FA2", icon: "🏠", desc: "Apartments, rooms and homes in Rohini's residential sectors." },
          { name: "Vehicles", color: "#1976D2", icon: "🚗", desc: "Cars and bikes for renters and daily commuters." },
          { name: "Home Appliances", color: "#00695C", icon: "🍳", desc: "Appliances for home setup and relocations." },
        ],
        popularSearches: [
          "Flat for rent in Rohini", "Apartment in Rohini",
          "Room for rent in Rohini", "Affordable rentals Rohini"
        ],
        faqs: [
          { q: "Is Rohini a good area for affordable rentals?", a: "Yes. Rohini is one of Delhi's large residential zones with relatively affordable rental options and broad housing stock." },
        ],
        ctaHeading: "Have something to rent in Rohini?",
        ctaBody: "List your room, flat or home in Rohini and reach renters looking for affordable options.",
      },
      {
        slug: "jasola",
        name: "Jasola",
        tagline: "Professional Rentals · Apartments · Metro Access",
        badge: "NOW LIVE — JASOLA",
        primaryFocus: "Flats and professional rentals",
        heroDescription: "Find rentals in Jasola with strong access to offices, hospitals and metro routes.",
        coordinates: { lat: 28.5450, lng: 77.2910 },
        popularAreas: ["Jasola Vihar", "Apollo", "Okhla", "Noida Link"],
        topCategories: [
          { name: "Property", color: "#7B1FA2", icon: "🏠", desc: "Flats, apartments and rooms for professionals and families in Jasola." },
          { name: "Office Space", color: "#FF8F00", icon: "💼", desc: "Commercial and office rental options in mixed-use corridors." },
          { name: "Vehicles", color: "#1976D2", icon: "🚗", desc: "Transport options for daily commuting around South East Delhi." },
        ],
        popularSearches: [
          "Flat for rent in Jasola", "Apartments Jasola",
          "Rental flats Jasola", "Jasola rooms for rent"
        ],
        faqs: [
          { q: "Is Jasola good for professionals?", a: "Yes. Jasola is well positioned for professional and mixed household rentals due to metro access and connectivity to offices and hospitals." },
        ],
        ctaHeading: "Have something to rent in Jasola?",
        ctaBody: "List your flat, room or office space in Jasola and connect with renters faster.",
      },
      {
        slug: "sarita-vihar",
        name: "Sarita Vihar",
        tagline: "Family Housing · Apartments · South East Delhi",
        badge: "NOW LIVE — SARITA VIHAR",
        primaryFocus: "Apartments and family rentals",
        heroDescription: "Explore rentals in Sarita Vihar with strong connectivity to Jasola and Noida.",
        coordinates: { lat: 28.5315, lng: 77.2913 },
        popularAreas: ["Pocket A", "Pocket B", "Pocket C", "Jasola"],
        topCategories: [
          { name: "Property", color: "#7B1FA2", icon: "🏠", desc: "Family apartments, homes and flats in Sarita Vihar." },
          { name: "Vehicles", color: "#1976D2", icon: "🚗", desc: "Cars and bikes for daily commute and local mobility." },
          { name: "Furniture", color: "#5D4037", icon: "🛋️", desc: "Furniture options for home setup and relocation." },
        ],
        popularSearches: [
          "Flat for rent in Sarita Vihar", "Apartment Sarita Vihar",
          "Family home Sarita Vihar", "Rental homes Sarita Vihar"
        ],
        faqs: [
          { q: "Is Sarita Vihar suitable for families?", a: "Yes. Sarita Vihar is known for stable family housing demand and access to Jasola, South East Delhi and Noida corridors." },
        ],
        ctaHeading: "Have something to rent in Sarita Vihar?",
        ctaBody: "List your flat or home in Sarita Vihar and reach family renters across the area.",
      }
    ],
  },
`;

// ── If the old broken patch was applied, restore from backup first ─────────────
function maybeRestoreFromBackup(filePath) {
  const backupPath = `${filePath}.bak`;
  if (fs.existsSync(backupPath)) {
    fs.copyFileSync(backupPath, filePath);
    console.log(`♻️  Restored ${path.basename(filePath)} from backup before repatching`);
  }
}

function patchAreaConfig() {
  ensureFile(areaConfigPath);
  backupFile(areaConfigPath);

  let text = fs.readFileSync(areaConfigPath, "utf8");

  // ── 1. Insert DELHI_AREAS BEFORE ALL_AREAS (fixes the ReferenceError) ────────
  if (!text.includes("export const DELHI_AREAS: AreaConfig[]")) {
    const allAreasMarker = "export const ALL_AREAS:";
    const insertPos = text.indexOf(allAreasMarker);
    if (insertPos === -1) {
      fail("Could not find ALL_AREAS declaration in lib/area-config.ts");
    }
    text = text.slice(0, insertPos) + delhiAreasBlock + text.slice(insertPos);
    console.log("  → Inserted DELHI_AREAS block before ALL_AREAS");
  } else {
    console.log("  → DELHI_AREAS block already present, skipping insert");
  }

  // ── 2. Spread DELHI_AREAS into ALL_AREAS ──────────────────────────────────────
  const allAreasRegex = /export const ALL_AREAS: AreaConfig\[] = \[(.*?)\];/s;
  if (!allAreasRegex.test(text)) {
    fail("Could not find ALL_AREAS array in lib/area-config.ts");
  }
  text = text.replace(allAreasRegex, (match, inner) => {
    if (inner.includes("...DELHI_AREAS")) return match;
    return `export const ALL_AREAS: AreaConfig[] = [${inner.trim()}, ...DELHI_AREAS];`;
  });

  // ── 3. Add getAreaConfig lookup for delhi ─────────────────────────────────────
  if (!text.includes(`if (citySlug === "delhi")`)) {
    const ludhianaLine = `if (citySlug === "ludhiana")   return LUDHIANA_AREAS[0];`;
    if (!text.includes(ludhianaLine)) {
      fail('Expected anchor line not found: if (citySlug === "ludhiana")   return LUDHIANA_AREAS[0];');
    }
    text = text.replace(
      ludhianaLine,
      `${ludhianaLine}\n  if (citySlug === "delhi")      return DELHI_AREAS[0];`
    );
  }

  fs.writeFileSync(areaConfigPath, text, "utf8");
  console.log("✅ Patched lib/area-config.ts");
}

function patchCitiesConfig() {
  ensureFile(citiesConfigPath);
  backupFile(citiesConfigPath);

  let text = fs.readFileSync(citiesConfigPath, "utf8");

  if (text.includes(`slug: "delhi"`)) {
    console.log("ℹ️  Delhi city config already exists in lib/cities-config.ts — skipping");
    return;
  }

  const ncrBlockStart = `  {\n    slug: "ncr",`;
  if (!text.includes(ncrBlockStart)) {
    fail('Could not find NCR block start in lib/cities-config.ts');
  }

  text = text.replace(ncrBlockStart, `${delhiCityBlock}\n  {\n    slug: "ncr",`);

  fs.writeFileSync(citiesConfigPath, text, "utf8");
  console.log("✅ Patched lib/cities-config.ts");
}

console.log("🔄 Restoring from backups (if present) to ensure a clean patch...");
maybeRestoreFromBackup(areaConfigPath);
maybeRestoreFromBackup(citiesConfigPath);

patchAreaConfig();
patchCitiesConfig();

console.log("");
console.log("🎉 Delhi launch pages added successfully.");
console.log("Created routes:");
console.log("   /rentals/delhi");
console.log("   /rentals/delhi/mukherjee-nagar");
console.log("   /rentals/delhi/gtb-nagar");
console.log("   /rentals/delhi/hudson-lane");
console.log("   /rentals/delhi/dwarka");
console.log("   /rentals/delhi/rohini");
console.log("   /rentals/delhi/jasola");
console.log("   /rentals/delhi/sarita-vihar");
console.log("");
console.log("Next steps:");
console.log("   1. npm run dev");
console.log("   2. Test: http://localhost:3000/rentals/delhi");
console.log("   3. Test: http://localhost:3000/rentals/delhi/mukherjee-nagar");

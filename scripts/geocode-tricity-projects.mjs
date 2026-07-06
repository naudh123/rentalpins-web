/**
 * Geocode Tricity catalog projects via Google Geocoding API.
 * Reads addresses from tricity-catalog.ts and writes tricity-coordinates.ts.
 *
 * Usage: node scripts/geocode-tricity-projects.mjs
 */
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const CATALOG = path.join(ROOT, "lib/builders/tricity-catalog.ts");
const OUT = path.join(ROOT, "lib/builders/tricity-coordinates.ts");
const ENV = path.join(ROOT, ".env.local");

function loadMapsKey() {
  if (!fs.existsSync(ENV)) throw new Error("Missing .env.local");
  const line = fs
    .readFileSync(ENV, "utf8")
    .split("\n")
    .find((l) => l.startsWith("NEXT_PUBLIC_GOOGLE_MAPS_API_KEY="));
  const key = line?.split("=").slice(1).join("=").trim();
  if (!key) throw new Error("NEXT_PUBLIC_GOOGLE_MAPS_API_KEY not set");
  return key;
}

function parseProjects(src) {
  const projects = [];
  const blocks = src.split(/\n  \{\n    builderSlug:/).slice(1);
  for (const block of blocks) {
    const slug = block.match(/\n    slug: "([^"]+)"/)?.[1];
    const name = block.match(/\n    name: "([^"]+)"/)?.[1];
    const city = block.match(/\n    city: "([^"]+)"/)?.[1];
    const address = block.match(/\n    address: "([^"]+)"/)?.[1];
    const state = block.match(/\n    state: "([^"]+)"/)?.[1] ?? "Punjab";
    if (!slug || !name) continue;
    projects.push({ slug, name, city, address, state });
  }
  return projects;
}

/** Manual overrides when geocoder returns city centre instead of project gate. */
const QUERY_OVERRIDES = {
  "jubilee-city-gardens": "Jubilee City Garden Sector 116 Mohali Punjab",
  "medallion-aeropark": "Medallion Aeropark Dayalpura Mohali Punjab",
  "the-medallion-sector-82a": "The Medallion Sector 82A Mohali Punjab",
  "dlf-hyde-park-estate": "DLF Hyde Park Estate Mullanpur New Chandigarh",
  "gmada-ecocity-new-chandigarh": "GMADA EcoCity Mullanpur New Chandigarh",
  "gmada-aerocity-mohali": "GMADA Aerocity Sector 82 Mohali Airport Road",
  "sbp-city-of-dreams": "SBP City of Dreams Highland Marg Zirakpur",
  "omaxe-new-chandigarh": "Omaxe New Chandigarh Mullanpur",
  "godrej-tricity-heights": "Godrej Tricity Heights Sector 66 Mohali",
  "gillco-valley": "Gillco Valley Kharar Mohali",
  "sunny-enclave-kharar": "Sunny Enclave Sector 125 Kharar",
  "emaar-mohali-hills": "Emaar Mohali Hills Sector 105 Mohali",
  "tdi-city-mohali": "TDI City Sector 117 Airport Road Mohali",
  "jubilee-techyards": "Jubilee Techyards Sector 102A Mohali",
  "homeland-global-park": "Homeland Global Park Sector 75 Mohali",
  "bestech-business-tower": "Bestech Business Tower Sector 66 Mohali",
  "mk-technology-park": "MK Technology Park Tangori Landran Banur Road Mohali",
  "sbp-siel-industrial-estate": "SBP SIEL Industrial Estate Rajpura NH-44 Punjab",
  "sbp-industrial-park-tepla": "SBP Industrial Park Tepla Road Banur Punjab",
  "alc-crosswalk": "ALC Crosswalk Bassi Pathana Fatehgarh Sahib",
  "sbp-rio-one": "SBP RIO ONE VIP Road Zirakpur",
  "sbp-city-square": "SBP City Square Sector 127 Landran Kharar Highway Mohali",
  "ats-casa-espana": "ATS Casa Espana Sector 121 Mohali",
  "homeland-regalia": "Homeland Regalia Sector 77 Mohali",
  "beverly-golf-avenue": "Beverly Golf Avenue Sector 65 Mohali",
  "ansal-api-sector-115": "Ansal API Sector 115 Mohali",
  "abc-greens-mohali": "ABC Greens Sector 82 JLPL Mohali",
};

/** Pin-exact coordinates when geocoder returns a nearby landmark or city centre. */
const MANUAL_COORDINATE_OVERRIDES = {
  "velora-urbano": { lat: 30.58444, lng: 76.749588, query: "Velora Urbano Patiala Highway Banur Mohali" },
  "the-residency-mohali": { lat: 30.63755, lng: 76.757978, query: "The Residency Mohali Nadar Properties Azizpur" },
  "ananta-aspire": { lat: 30.655851, lng: 76.736928, query: "Ananta Aspire Sector 82 Mohali" },
  "gillco-meraqui": { lat: 30.730839, lng: 76.675647, query: "Gillco Meraqui Sector 99 Mohali" },
  "gillco-parkhills": { lat: 30.731971, lng: 76.673829, query: "Gillco Parkhills Sector 99 Mohali" },
  "alc-crosswalk": { lat: 30.686119, lng: 76.40424, query: "ALC Crosswalk Bassi Pathana Fatehgarh Sahib" },
  "7c-aerotro-homes": { lat: 30.5782, lng: 76.6625, query: "7C Aerotro Homes Landran Mohali" },
  "gmada-aerocity-mohali": { lat: 30.6542, lng: 76.7785, query: "GMADA Aerocity Sector 82 Mohali Airport Road" },
  "homeland-heights": { lat: 30.692641, lng: 76.710562, query: "Homeland Heights Sector 77 Mohali" },
  "affinity-belgravia": { lat: 30.692676, lng: 76.704777, query: "Affinity Belgravia Sector 77 Mohali" },
  "medallion-nova": { lat: 30.676838, lng: 76.735913, query: "Medallion Nova Sector 82 Mohali" },
};

function buildQuery(p) {
  if (QUERY_OVERRIDES[p.slug]) return QUERY_OVERRIDES[p.slug];
  if (p.address && p.city) return `${p.address}, ${p.city}, ${p.state}, India`;
  if (p.name && p.city) return `${p.name}, ${p.city}, ${p.state}, India`;
  return `${p.name}, Chandigarh Tricity, India`;
}

async function geocode(query, key) {
  const url = new URL("https://maps.googleapis.com/maps/api/geocode/json");
  url.searchParams.set("address", query);
  url.searchParams.set("key", key);
  url.searchParams.set("region", "in");
  const res = await fetch(url);
  const data = await res.json();
  if (data.status !== "OK" || !data.results?.[0]) {
    return { ok: false, status: data.status, query };
  }
  const { lat, lng } = data.results[0].geometry.location;
  const loc = data.results[0].geometry.location_type;
  return { ok: true, lat, lng, loc, formatted: data.results[0].formatted_address, query };
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function main() {
  const key = loadMapsKey();
  const src = fs.readFileSync(CATALOG, "utf8");
  const projects = parseProjects(src);
  const coords = {};
  const failures = [];

  for (const p of projects) {
    const manual = MANUAL_COORDINATE_OVERRIDES[p.slug];
    if (manual) {
      coords[p.slug] = { ...manual };
      console.log(`MANUAL ${p.slug}: ${manual.lat}, ${manual.lng}`);
      continue;
    }
    const query = buildQuery(p);
    const result = await geocode(query, key);
    await sleep(120);
    if (result.ok) {
      coords[p.slug] = {
        lat: Math.round(result.lat * 1e6) / 1e6,
        lng: Math.round(result.lng * 1e6) / 1e6,
        query: result.query,
        formatted: result.formatted,
        precision: result.loc,
      };
      console.log(`OK ${p.slug}: ${result.lat}, ${result.lng} (${result.loc})`);
    } else {
      failures.push({ slug: p.slug, query, status: result.status });
      console.warn(`FAIL ${p.slug}: ${result.status} — ${query}`);
    }
  }

  const lines = [
    "/**",
    " * Verified WGS84 coordinates for Tricity builder projects.",
    " * Generated by scripts/geocode-tricity-projects.mjs — re-run after address changes.",
    " */",
    "",
    "export interface ProjectCoordinates {",
    "  lat: number;",
    "  lng: number;",
    "  /** Geocode query used (debug). */",
    "  query?: string;",
    "}",
    "",
    "export const TRICITY_PROJECT_COORDINATES: Record<string, ProjectCoordinates> = {",
  ];

  for (const [slug, c] of Object.entries(coords)) {
    lines.push(
      `  "${slug}": { lat: ${c.lat}, lng: ${c.lng}, query: ${JSON.stringify(c.query)} },`
    );
  }
  lines.push("};", "");
  lines.push("export function catalogCoordinates(");
  lines.push("  slug: string,");
  lines.push("  fallback?: { latitude?: number; longitude?: number }");
  lines.push("): { latitude: number; longitude: number } | null {");
  lines.push("  const hit = TRICITY_PROJECT_COORDINATES[slug];");
  lines.push("  if (hit) return { latitude: hit.lat, longitude: hit.lng };");
  lines.push("  if (fallback?.latitude != null && fallback?.longitude != null) {");
  lines.push("    return { latitude: fallback.latitude, longitude: fallback.longitude };");
  lines.push("  }");
  lines.push("  return null;");
  lines.push("}", "");

  fs.writeFileSync(OUT, lines.join("\n"));
  console.log(`\nWrote ${Object.keys(coords).length} coords → ${OUT}`);
  if (failures.length) {
    console.log("Failures:", failures);
    process.exitCode = 1;
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

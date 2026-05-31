/**
 * fix-delhi-geohashes.cjs
 *
 * Updates geohashPrefixes for all Delhi areas in lib/area-config.ts
 * based on correctly computed geohash cells for each area center.
 *
 * Usage: node scripts/fix-delhi-geohashes.cjs
 */

const fs   = require("fs");
const path = require("path");
const root = process.cwd();
const file = path.join(root, "lib", "area-config.ts");

function fail(msg) { console.error(`\n❌ ${msg}\n`); process.exit(1); }

if (!fs.existsSync(file)) fail("Missing: lib/area-config.ts");

// Backup
const bak = file + ".bak";
if (!fs.existsSync(bak)) {
  fs.copyFileSync(file, bak);
  console.log("🛟 Backup created: lib/area-config.ts.bak");
} else {
  console.log("ℹ️  Backup already exists");
}

let text = fs.readFileSync(file, "utf8");

// ── Replacements ──────────────────────────────────────────────────────────────
// Each entry: [label, oldPrefixes, newPrefixes]
const FIXES = [
  [
    "Mukherjee Nagar",
    `geohashPrefixes: ["tts5", "tts7", "ttse"],`,
    `geohashPrefixes: ["tts5", "tts7", "ttse", "ttsk", "ttng", "ttnf"],`,
  ],
  [
    "GTB Nagar",
    `geohashPrefixes: ["tts5", "tts7"],
    center: { lat: 28.6982`,
    `geohashPrefixes: ["tts5", "tts7", "ttse"],
    center: { lat: 28.6982`,
  ],
  [
    "Hudson Lane",
    `geohashPrefixes: ["tts5", "tts7"],
    center: { lat: 28.6964`,
    `geohashPrefixes: ["tts5", "tts7"],
    center: { lat: 28.6964`,
    // Hudson Lane keeps tts5+tts7 — it's the tightest area, no change needed
  ],
  [
    "Dwarka",
    `geohashPrefixes: ["ttnq", "ttnr", "ttnw"],`,
    `geohashPrefixes: ["ttnq", "ttnr", "ttnw", "ttnx"],`,
  ],
  [
    "Rohini",
    `geohashPrefixes: ["ttnh", "ttnj", "ttnn"],`,
    `geohashPrefixes: ["ttnh", "ttnj", "ttnn", "ttnp"],`,
  ],
  [
    "Jasola",
    `geohashPrefixes: ["ttq4", "ttq5"],
    center: { lat: 28.5450`,
    `geohashPrefixes: ["ttq4", "ttq5", "ttq6"],
    center: { lat: 28.5450`,
  ],
  // Sarita Vihar stays ["ttq4","ttq5"] — already correct
];

let changed = 0;

for (const [label, oldStr, newStr] of FIXES) {
  // Hudson Lane is a no-op — skip if old === new
  if (oldStr === newStr) {
    console.log(`  ✅ ${label}: no change needed`);
    continue;
  }
  if (!text.includes(oldStr)) {
    console.warn(`  ⚠️  ${label}: could not find target string — already patched or different formatting`);
    continue;
  }
  text = text.replace(oldStr, newStr);
  console.log(`  ✅ ${label}: geohashPrefixes updated`);
  changed++;
}

// Also fix the critical Mukherjee Nagar geohash — the actual listing is at ttngkcf0q
// So we need ttng in the prefix list. The replacement above already adds it.

fs.writeFileSync(file, text, "utf8");

console.log(`
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ Done — ${changed} area(s) updated in lib/area-config.ts

Final prefixes:
  Delhi (city)       : ttn, ttq, tts         ← broad, intentional
  Mukherjee Nagar    : tts5, tts7, ttse, ttsk, ttng, ttnf
  GTB Nagar          : tts5, tts7, ttse
  Hudson Lane        : tts5, tts7
  Dwarka             : ttnq, ttnr, ttnw, ttnx
  Rohini             : ttnh, ttnj, ttnn, ttnp
  Jasola             : ttq4, ttq5, ttq6
  Sarita Vihar       : ttq4, ttq5             ← unchanged

Next steps:
  1. npm run dev
  2. Visit /rentals/delhi/mukherjee-nagar
     → listing should now appear
     → Active Listings: 1
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`);

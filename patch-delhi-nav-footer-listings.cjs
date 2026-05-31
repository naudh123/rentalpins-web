/**
 * patch-delhi-nav-footer-listings.cjs
 *
 * Written against the EXACT content of your local files.
 *
 * Patches 4 files:
 *
 *  1. app/rentals-shared/AreaClient.tsx
 *     a. NAV_CITIES: replace NCR Delhi (no spokes) with live Delhi + 7 area spokes
 *     b. Mobile menu: add Delhi + area links after Ludhiana block
 *     c. Footer CITIES links: add Delhi after Ludhiana
 *     d. Stats: replace value: "Growing" with listingsCount
 *     e. Export: add listingsCount prop
 *
 *  2. app/HomePageClient.tsx
 *     a. NAV_CITIES: same Delhi replacement (this file has its own copy)
 *     b. Mobile menu: add Delhi links
 *     c. Footer CITIES: add Delhi
 *
 *  3. app/rentals/[city]/page.tsx
 *     - Pass listingsCount={listings.length} to <AreaClient />
 *
 *  4. app/rentals/[city]/[area]/page.tsx
 *     - Pass listingsCount={listings.length} to <AreaClient />
 */

const fs   = require("fs");
const path = require("path");
const root = process.cwd();

const FILES = {
  areaClient: path.join(root, "app", "rentals-shared", "AreaClient.tsx"),
  homeClient: path.join(root, "app", "HomePageClient.tsx"),
  cityPage:   path.join(root, "app", "rentals", "[city]", "page.tsx"),
  areaPage:   path.join(root, "app", "rentals", "[city]", "[area]", "page.tsx"),
};

// ── Helpers ───────────────────────────────────────────────────────────────────
function fail(msg) {
  console.error(`\n❌ ${msg}\n`);
  process.exit(1);
}

function backup(filePath) {
  const bak = filePath + ".bak";
  if (!fs.existsSync(bak)) {
    fs.copyFileSync(filePath, bak);
    console.log(`  🛟 Backup → ${path.relative(root, bak)}`);
  } else {
    console.log(`  ℹ️  Backup already exists`);
  }
}

function read(filePath) {
  if (!fs.existsSync(filePath)) fail(`Missing: ${path.relative(root, filePath)}`);
  return fs.readFileSync(filePath, "utf8");
}

function write(filePath, content) {
  fs.writeFileSync(filePath, content, "utf8");
}

function exact(content, oldStr, newStr, label) {
  if (!content.includes(oldStr)) {
    fail(
      `Could not find target for: ${label}\n` +
      `Expected to find exactly:\n---\n${oldStr}\n---`
    );
  }
  return content.replace(oldStr, newStr);
}

// ── Shared replacement strings ────────────────────────────────────────────────

// NAV_CITIES entry
const OLD_NAV_NCR  = `  { hub: "NCR Delhi", href: "/rentals/ncr", spokes: [] },`;
const NEW_NAV_DELHI = `  {
    hub: "Delhi",
    href: "/rentals/delhi",
    spokes: [
      { label: "Mukherjee Nagar", href: "/rentals/delhi/mukherjee-nagar" },
      { label: "GTB Nagar",       href: "/rentals/delhi/gtb-nagar" },
      { label: "Hudson Lane",     href: "/rentals/delhi/hudson-lane" },
      { label: "Dwarka",          href: "/rentals/delhi/dwarka" },
      { label: "Rohini",          href: "/rentals/delhi/rohini" },
      { label: "Jasola",          href: "/rentals/delhi/jasola" },
      { label: "Sarita Vihar",    href: "/rentals/delhi/sarita-vihar" },
    ],
  },`;

// ─────────────────────────────────────────────────────────────────────────────
// 1. AreaClient.tsx  (your actual local version)
// ─────────────────────────────────────────────────────────────────────────────
console.log("\n🔧 Patching app/rentals-shared/AreaClient.tsx...");
backup(FILES.areaClient);
let ac = read(FILES.areaClient);

// 1a. NAV_CITIES — replace NCR Delhi with live Delhi
if (ac.includes('hub: "Delhi"')) {
  console.log("  ℹ️  NAV_CITIES Delhi already present — skipping 1a");
} else {
  ac = exact(ac, OLD_NAV_NCR, NEW_NAV_DELHI, "AreaClient NAV_CITIES NCR→Delhi");
  console.log("  ✅ 1a: NAV_CITIES updated — Delhi replaces NCR Delhi");
}

// 1b. Mobile menu — add Delhi links after Ludhiana/Sarabha Nagar
// Exact text from your local file:
const OLD_AC_MOBILE = `            ["  Sarabha Nagar", "/rentals/ludhiana/sarabha-nagar"],
          ] as const).map`;
const NEW_AC_MOBILE = `            ["  Sarabha Nagar", "/rentals/ludhiana/sarabha-nagar"],
            ["Delhi", "/rentals/delhi"],
            ["  Mukherjee Nagar", "/rentals/delhi/mukherjee-nagar"],
            ["  GTB Nagar", "/rentals/delhi/gtb-nagar"],
            ["  Hudson Lane", "/rentals/delhi/hudson-lane"],
            ["  Dwarka", "/rentals/delhi/dwarka"],
            ["  Rohini", "/rentals/delhi/rohini"],
          ] as const).map`;

if (ac.includes('"Delhi", "/rentals/delhi"') && ac.includes('"  Dwarka"')) {
  console.log("  ℹ️  Mobile menu Delhi already present — skipping 1b");
} else {
  ac = exact(ac, OLD_AC_MOBILE, NEW_AC_MOBILE, "AreaClient mobile menu Delhi links");
  console.log("  ✅ 1b: Mobile menu updated — Delhi + areas added");
}

// 1c. Footer CITIES col — add Delhi after Ludhiana
// Exact text from your local file:
const OLD_AC_FOOTER = `        { label: "Ludhiana", href: "/rentals/ludhiana" },
      ],
    },
    {
      title: "COMPANY",`;
const NEW_AC_FOOTER = `        { label: "Ludhiana", href: "/rentals/ludhiana" },
        { label: "Delhi", href: "/rentals/delhi" },
        { label: "Mukherjee Nagar", href: "/rentals/delhi/mukherjee-nagar" },
        { label: "GTB Nagar", href: "/rentals/delhi/gtb-nagar" },
        { label: "Dwarka", href: "/rentals/delhi/dwarka" },
        { label: "Rohini", href: "/rentals/delhi/rohini" },
      ],
    },
    {
      title: "COMPANY",`;

if (ac.includes('{ label: "Delhi", href: "/rentals/delhi" }')) {
  console.log("  ℹ️  Footer CITIES Delhi already present — skipping 1c");
} else {
  ac = exact(ac, OLD_AC_FOOTER, NEW_AC_FOOTER, "AreaClient footer CITIES col");
  console.log("  ✅ 1c: Footer CITIES updated — Delhi + areas added");
}

// 1d. Stats — replace hardcoded "Growing" with listingsCount
// Exact text from your local file:
const OLD_STATS = `            { label: "Active Listings", value: "Growing" },`;
const NEW_STATS = `            { label: "Active Listings", value: listingsCount.toString() },`;

if (ac.includes("listingsCount.toString()")) {
  console.log("  ℹ️  Stats already uses listingsCount — skipping 1d");
} else {
  ac = exact(ac, OLD_STATS, NEW_STATS, "AreaClient stats Active Listings");
  console.log("  ✅ 1d: Stats — Active Listings now uses real count");
}

// 1e. Export signature — add listingsCount prop (optional, defaults to 0)
const OLD_EXPORT = `export default function AreaClient({ area }: { area: AreaData }) {`;
const NEW_EXPORT = `export default function AreaClient({
  area,
  listingsCount = 0,
}: {
  area: AreaData;
  listingsCount?: number;
}) {`;

if (ac.includes("listingsCount?:") || ac.includes("listingsCount =")) {
  console.log("  ℹ️  listingsCount prop already present — skipping 1e");
} else {
  ac = exact(ac, OLD_EXPORT, NEW_EXPORT, "AreaClient export signature");
  console.log("  ✅ 1e: Export signature updated — listingsCount prop added");
}

write(FILES.areaClient, ac);
console.log("  💾 Saved AreaClient.tsx");

// ─────────────────────────────────────────────────────────────────────────────
// 2. HomePageClient.tsx  (has its own separate NAV_CITIES + mobile menu + footer)
// ─────────────────────────────────────────────────────────────────────────────
console.log("\n🔧 Patching app/HomePageClient.tsx...");
backup(FILES.homeClient);
let hc = read(FILES.homeClient);

// 2a. NAV_CITIES
if (hc.includes('hub: "Delhi"')) {
  console.log("  ℹ️  NAV_CITIES Delhi already present — skipping 2a");
} else {
  hc = exact(hc, OLD_NAV_NCR, NEW_NAV_DELHI, "HomePageClient NAV_CITIES NCR→Delhi");
  console.log("  ✅ 2a: NAV_CITIES updated");
}

// 2b. Mobile menu — HomePageClient uses a slightly different mobile array
// Check which pattern exists and handle both
const HC_MOBILE_OLD_V1 = `            ["  Sarabha Nagar", "/rentals/ludhiana/sarabha-nagar"],
          ] as const).map`;
const HC_MOBILE_OLD_V2 = `            ["  Sarabha Nagar", "/rentals/ludhiana/sarabha-nagar"],
          ] as [string, string][]).map`;
// Also check the pattern from the version we read earlier (12-space indent)
const HC_MOBILE_OLD_V3 = `            ["  Sarabha Nagar", "/rentals/ludhiana/sarabha-nagar"],
        ] as const).map`;

const DELHI_MOBILE_LINES = `            ["Delhi", "/rentals/delhi"],
            ["  Mukherjee Nagar", "/rentals/delhi/mukherjee-nagar"],
            ["  GTB Nagar", "/rentals/delhi/gtb-nagar"],
            ["  Hudson Lane", "/rentals/delhi/hudson-lane"],
            ["  Dwarka", "/rentals/delhi/dwarka"],
            ["  Rohini", "/rentals/delhi/rohini"],`;

if (hc.includes('"Delhi", "/rentals/delhi"') && hc.includes('"  Dwarka"')) {
  console.log("  ℹ️  Mobile menu Delhi already present — skipping 2b");
} else if (hc.includes(HC_MOBILE_OLD_V1)) {
  hc = hc.replace(HC_MOBILE_OLD_V1,
    `            ["  Sarabha Nagar", "/rentals/ludhiana/sarabha-nagar"],\n${DELHI_MOBILE_LINES}\n          ] as const).map`
  );
  console.log("  ✅ 2b: Mobile menu updated (v1 pattern)");
} else if (hc.includes(HC_MOBILE_OLD_V2)) {
  hc = hc.replace(HC_MOBILE_OLD_V2,
    `            ["  Sarabha Nagar", "/rentals/ludhiana/sarabha-nagar"],\n${DELHI_MOBILE_LINES}\n          ] as [string, string][]).map`
  );
  console.log("  ✅ 2b: Mobile menu updated (v2 pattern)");
} else if (hc.includes(HC_MOBILE_OLD_V3)) {
  hc = hc.replace(HC_MOBILE_OLD_V3,
    `            ["  Sarabha Nagar", "/rentals/ludhiana/sarabha-nagar"],\n${DELHI_MOBILE_LINES}\n        ] as const).map`
  );
  console.log("  ✅ 2b: Mobile menu updated (v3 pattern)");
} else {
  console.warn("  ⚠️  Could not auto-patch HomePageClient mobile menu.");
  console.warn('     Manually add Delhi links after ["  Sarabha Nagar", "/rentals/ludhiana/sarabha-nagar"],');
}

// 2c. Footer CITIES — HomePageClient uses a different footer structure
// Exact text from the version we read:
const HC_FOOTER_OLD = `{ label: "Ludhiana", href: "/rentals/ludhiana" },
    ]},`;
const HC_FOOTER_NEW = `{ label: "Ludhiana", href: "/rentals/ludhiana" },
      { label: "Delhi", href: "/rentals/delhi" },
    ]},`;

if (hc.includes('{ label: "Delhi", href: "/rentals/delhi" }')) {
  console.log("  ℹ️  Footer CITIES Delhi already present — skipping 2c");
} else if (hc.includes(HC_FOOTER_OLD)) {
  hc = hc.replace(HC_FOOTER_OLD, HC_FOOTER_NEW);
  console.log("  ✅ 2c: Footer CITIES updated");
} else {
  console.warn("  ⚠️  Could not auto-patch HomePageClient footer CITIES.");
  console.warn('     Manually add { label: "Delhi", href: "/rentals/delhi" } to the CITIES links array in Footer().');
}

write(FILES.homeClient, hc);
console.log("  💾 Saved HomePageClient.tsx");

// ─────────────────────────────────────────────────────────────────────────────
// 3. app/rentals/[city]/page.tsx
// ─────────────────────────────────────────────────────────────────────────────
console.log("\n🔧 Patching app/rentals/[city]/page.tsx...");
backup(FILES.cityPage);
let cp = read(FILES.cityPage);

const OLD_CITY = `      <AreaClient area={areaData} />`;
const NEW_CITY = `      <AreaClient area={areaData} listingsCount={listings.length} />`;

if (cp.includes("listingsCount={listings.length}")) {
  console.log("  ℹ️  Already passes listingsCount — skipping");
} else {
  cp = exact(cp, OLD_CITY, NEW_CITY, "[city]/page.tsx AreaClient prop");
  console.log("  ✅ listingsCount={listings.length} added to <AreaClient />");
}
write(FILES.cityPage, cp);
console.log("  💾 Saved [city]/page.tsx");

// ─────────────────────────────────────────────────────────────────────────────
// 4. app/rentals/[city]/[area]/page.tsx
// ─────────────────────────────────────────────────────────────────────────────
console.log("\n🔧 Patching app/rentals/[city]/[area]/page.tsx...");
backup(FILES.areaPage);
let ap = read(FILES.areaPage);

const OLD_AREA = `      <AreaClient area={areaData} />`;
const NEW_AREA = `      <AreaClient area={areaData} listingsCount={listings.length} />`;

if (ap.includes("listingsCount={listings.length}")) {
  console.log("  ℹ️  Already passes listingsCount — skipping");
} else {
  ap = exact(ap, OLD_AREA, NEW_AREA, "[area]/page.tsx AreaClient prop");
  console.log("  ✅ listingsCount={listings.length} added to <AreaClient />");
}
write(FILES.areaPage, ap);
console.log("  💾 Saved [city]/[area]/page.tsx");

// ─────────────────────────────────────────────────────────────────────────────
console.log(`
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎉  All patches applied.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Next steps:
  1. npm run dev
  2. Cities dropdown  → Delhi with 7 area links
  3. Mobile menu      → Delhi + Mukherjee Nagar, GTB Nagar,
                        Hudson Lane, Dwarka, Rohini
  4. Footer           → Delhi + area links
  5. /rentals/delhi/mukherjee-nagar → Active Listings: 1
  6. /rentals/delhi/dwarka          → Active Listings: 0
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`);

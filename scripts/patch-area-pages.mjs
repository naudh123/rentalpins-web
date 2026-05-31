// scripts/patch-area-pages.mjs
// Run: node scripts/patch-area-pages.mjs
//
// This script automatically patches all area page.tsx files to add
// the ListingsGrid with server-side Firestore fetch.
// Safe to run multiple times — skips already-patched files.

import { readFileSync, writeFileSync, existsSync } from "fs";
import { resolve } from "path";

const ROOT = resolve(".");

// ─── All pages to patch ──────────────────────────────────────────────────────
const PAGES = [
  // Chandigarh sub-areas (use AreaClient)
  {
    file: "app/rentals/chandigarh/mohali/page.tsx",
    citySlug: "chandigarh", areaSlug: "mohali", areaName: "Mohali",
    type: "area",
  },
  {
    file: "app/rentals/chandigarh/panchkula/page.tsx",
    citySlug: "chandigarh", areaSlug: "panchkula", areaName: "Panchkula",
    type: "area",
  },
  {
    file: "app/rentals/chandigarh/zirakpur/page.tsx",
    citySlug: "chandigarh", areaSlug: "zirakpur", areaName: "Zirakpur",
    type: "area",
  },
  {
    file: "app/rentals/chandigarh/landran/page.tsx",
    citySlug: "chandigarh", areaSlug: "landran", areaName: "Landran",
    type: "area",
  },
  // Ludhiana sub-areas (use AreaClient)
  {
    file: "app/rentals/ludhiana/sarabha-nagar/page.tsx",
    citySlug: "ludhiana", areaSlug: "sarabha-nagar", areaName: "Sarabha Nagar",
    type: "area",
  },
  {
    file: "app/rentals/ludhiana/model-town/page.tsx",
    citySlug: "ludhiana", areaSlug: "model-town", areaName: "Model Town",
    type: "area",
  },
  {
    file: "app/rentals/ludhiana/pakhowal-road/page.tsx",
    citySlug: "ludhiana", areaSlug: "pakhowal-road", areaName: "Pakhowal Road",
    type: "area",
  },
  {
    file: "app/rentals/ludhiana/brs-nagar/page.tsx",
    citySlug: "ludhiana", areaSlug: "brs-nagar", areaName: "BRS Nagar",
    type: "area",
  },
  {
    file: "app/rentals/ludhiana/focal-point/page.tsx",
    citySlug: "ludhiana", areaSlug: "focal-point", areaName: "Focal Point",
    type: "area",
  },
  // City-level pages
  {
    file: "app/rentals/chandigarh/page.tsx",
    citySlug: "chandigarh", areaSlug: null, areaName: "Chandigarh Tricity",
    type: "city",
  },
  {
    file: "app/rentals/ludhiana/page.tsx",
    citySlug: "ludhiana", areaSlug: null, areaName: "Ludhiana",
    type: "city",
  },
];

const IMPORTS_TO_ADD = `import { fetchAreaListings } from "@/lib/listings";
import { getAreaConfig } from "@/lib/area-config";
import ListingsGrid from "@/components/ListingsGrid";`;

let patched = 0;
let skipped = 0;
let errors = 0;

for (const page of PAGES) {
  const filePath = resolve(ROOT, page.file);

  if (!existsSync(filePath)) {
    console.log(`⚠️  SKIP (not found): ${page.file}`);
    skipped++;
    continue;
  }

  let content = readFileSync(filePath, "utf-8");

  // Skip if already patched
  if (content.includes("fetchAreaListings")) {
    console.log(`✅ SKIP (already patched): ${page.file}`);
    skipped++;
    continue;
  }

  try {
    // ── Step 1: Add imports after the last existing import line ──
    const importLines = content.split("\n");
    let lastImportIndex = -1;
    for (let i = 0; i < importLines.length; i++) {
      if (importLines[i].trim().startsWith("import ")) {
        lastImportIndex = i;
      }
    }
    if (lastImportIndex === -1) {
      console.log(`❌ ERROR (no imports found): ${page.file}`);
      errors++;
      continue;
    }
    importLines.splice(lastImportIndex + 1, 0, IMPORTS_TO_ADD);
    content = importLines.join("\n");

    // ── Step 2: Build the getAreaConfig call ──
    const configCall = page.areaSlug
      ? `getAreaConfig("${page.citySlug}", "${page.areaSlug}")`
      : `getAreaConfig("${page.citySlug}")`;

    // ── Step 3: Replace the default export function ──
    // Match: export default function XxxPage() {
    //          return <AreaClient ... /> or <ChandigarhClient ... />
    //        }
    // Also match: export default function XxxPage() {\n  return <...>;\n}

    // Pattern for AreaClient pages (sub-areas)
    const areaPattern = /export\s+default\s+function\s+(\w+)\(\)\s*\{[\s\S]*?return\s+<AreaClient\s+area=\{areaData\}\s*\/>;[\s\S]*?\}/;

    // Pattern for ChandigarhClient page
    const cityPatternCHD = /export\s+default\s+function\s+(\w+)\(\)\s*\{[\s\S]*?return\s+<ChandigarhClient\s+cityData=\{cityData\}\s*\/>;[\s\S]*?\}/;

    // Pattern for Ludhiana or other city pages using AreaClient
    const cityPatternArea = /export\s+default\s+function\s+(\w+)\(\)\s*\{[\s\S]*?return\s+<AreaClient\s+area=\{areaData\}\s*\/>;[\s\S]*?\}/;

    let matched = false;

    if (page.type === "city" && page.citySlug === "chandigarh") {
      // Chandigarh main page uses ChandigarhClient
      const match = content.match(cityPatternCHD);
      if (match) {
        const funcName = match[1];
        const replacement = `export default async function ${funcName}() {
  const area = ${configCall};
  const listings = area ? await fetchAreaListings(area, 20) : [];

  return (
    <>
      <ListingsGrid listings={listings} areaName="${page.areaName}" />
      <ChandigarhClient cityData={cityData} />
    </>
  );
}`;
        content = content.replace(cityPatternCHD, replacement);
        matched = true;
      }
    }

    if (!matched) {
      // All other pages use AreaClient
      const match = content.match(areaPattern);
      if (match) {
        const funcName = match[1];
        const replacement = `export default async function ${funcName}() {
  const area = ${configCall};
  const listings = area ? await fetchAreaListings(area, 20) : [];

  return (
    <>
      <ListingsGrid listings={listings} areaName="${page.areaName}" />
      <AreaClient area={areaData} />
    </>
  );
}`;
        content = content.replace(areaPattern, replacement);
        matched = true;
      }
    }

    if (!matched) {
      console.log(`❌ ERROR (couldn't match export pattern): ${page.file}`);
      console.log(`   → You may need to patch this file manually.`);
      errors++;
      continue;
    }

    // ── Step 4: Write the patched file ──
    writeFileSync(filePath, content, "utf-8");
    console.log(`✅ PATCHED: ${page.file} → areaName="${page.areaName}"`);
    patched++;

  } catch (err) {
    console.log(`❌ ERROR: ${page.file} → ${err.message}`);
    errors++;
  }
}

console.log(`\n${"═".repeat(50)}`);
console.log(`Done! ${patched} patched, ${skipped} skipped, ${errors} errors`);
if (errors > 0) {
  console.log(`\n⚠️  Files with errors need manual patching.`);
  console.log(`   See the Kharar page as a reference template.`);
}
if (patched > 0) {
  console.log(`\n🚀 Now test: npm run dev`);
  console.log(`   Then check each area page in browser.`);
}

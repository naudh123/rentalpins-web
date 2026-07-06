#!/usr/bin/env node
/**
 * Seed ABC Developers sample data (dev only).
 * Usage: npm run seed:builders
 */

import { config } from "dotenv";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
config({ path: resolve(__dirname, "../.env.local") });

async function main() {
  const { seedBuilderSampleData } = await import("../lib/builders/seed-sample-data.ts");
  const result = await seedBuilderSampleData("cli-seed");
  console.log(result.message);
  console.log("\nPublic URLs:");
  for (const [key, url] of Object.entries(result.urls)) {
    console.log(`  ${key}: http://127.0.0.1:3000${url}`);
  }
}

main().catch((err) => {
  console.error("Seed failed:", err.message || err);
  process.exit(1);
});

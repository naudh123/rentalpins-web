#!/usr/bin/env node
/**
 * Validates required env vars before deploy.
 * Usage: node scripts/check-env.mjs [--production]
 */

import fs from "node:fs";
import path from "node:path";

const isProd = process.argv.includes("--production");

const required = [
  "NEXT_PUBLIC_FIREBASE_API_KEY",
  "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN",
  "NEXT_PUBLIC_FIREBASE_PROJECT_ID",
  "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET",
  "NEXT_PUBLIC_FIREBASE_APP_ID",
  "NEXT_PUBLIC_GOOGLE_MAPS_API_KEY",
  "FIREBASE_PROJECT_ID",
  "FIREBASE_CLIENT_EMAIL",
  "FIREBASE_PRIVATE_KEY",
];

const prodChecks = [
  () =>
    process.env.NEXT_PUBLIC_DEPLOY_ENV !== "production"
      ? "NEXT_PUBLIC_DEPLOY_ENV should be 'production' for production cutover"
      : null,
  () =>
    process.env.NEXT_PUBLIC_SHOW_STAGING_BANNER === "true"
      ? "Remove NEXT_PUBLIC_SHOW_STAGING_BANNER on production"
      : null,
  () =>
    process.env.NEXT_PUBLIC_BASE_PATH
      ? "NEXT_PUBLIC_BASE_PATH must be unset on production root deploy"
      : null,
  () =>
    process.env.NEXT_PUBLIC_REQUIRE_PHONE_VERIFICATION !== "true"
      ? "Set NEXT_PUBLIC_REQUIRE_PHONE_VERIFICATION=true before production"
      : null,
  () =>
    !process.env.NEXT_PUBLIC_SITE_URL?.trim()
      ? "Set NEXT_PUBLIC_SITE_URL for correct canonicals/metadata"
      : null,
  () =>
    !process.env.CRON_SECRET?.trim()
      ? "Set CRON_SECRET — saved-search alerts cron returns 401 without it"
      : null,
];

function loadEnvLocal() {
  const envPath = path.join(process.cwd(), ".env.local");
  if (!fs.existsSync(envPath)) return;
  const text = fs.readFileSync(envPath, "utf8");
  for (const line of text.split("\n")) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const i = t.indexOf("=");
    if (i < 0) continue;
    const key = t.slice(0, i).trim();
    let val = t.slice(i + 1).trim();
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    if (!process.env[key]) process.env[key] = val;
  }
}

loadEnvLocal();

const missing = required.filter((k) => !process.env[k]?.trim());
const warnings = [];

if (isProd) {
  for (const fn of prodChecks) {
    const msg = fn();
    if (msg) warnings.push(msg);
  }
} else if (process.env.NEXT_PUBLIC_BASE_PATH === "/staging") {
  console.log("Staging base path detected — OK for hosted staging.");
}

if (missing.length) {
  console.error("Missing required environment variables:\n");
  for (const k of missing) console.error(`  - ${k}`);
  console.error("\nCopy .env.example → .env.local and fill values.");
  process.exit(1);
}

if (warnings.length) {
  console.warn("Production warnings:\n");
  for (const w of warnings) console.warn(`  ⚠ ${w}`);
  process.exit(1);
}

console.log(isProd ? "Production env check passed." : "Env check passed.");

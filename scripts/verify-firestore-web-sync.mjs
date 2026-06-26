#!/usr/bin/env node
/**
 * Ensures web Firestore additions are merged into rentit_clean (source of truth).
 * Usage: node scripts/verify-firestore-web-sync.mjs
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const webRoot = path.join(__dirname, "..");
const rentitRoot = path.join(webRoot, "..", "rentit_clean");

function readJson(p) {
  return JSON.parse(fs.readFileSync(p, "utf8"));
}

function indexKey(entry) {
  return `${entry.collectionGroup}|${entry.fields.map((f) => `${f.fieldPath}:${f.order}`).join(",")}`;
}

const additionsPath = path.join(webRoot, "firestore.indexes.web-additions.json");
const rentitIndexesPath = path.join(rentitRoot, "firestore.indexes.json");
const rentitRulesPath = path.join(rentitRoot, "firestore.rules");

if (!fs.existsSync(additionsPath)) {
  console.error("Missing firestore.indexes.web-additions.json");
  process.exit(1);
}
if (!fs.existsSync(rentitIndexesPath)) {
  console.error("Missing rentit_clean/firestore.indexes.json — clone rentit_clean sibling app");
  process.exit(1);
}

const additions = readJson(additionsPath);
const rentitIndexes = readJson(rentitIndexesPath);
const rentitKeys = new Set(rentitIndexes.indexes.map(indexKey));

const missing = additions.indexes.filter((entry) => !rentitKeys.has(indexKey(entry)));
if (missing.length) {
  console.error("Firestore index sync FAILED — missing in rentit_clean:");
  for (const m of missing) {
    console.error(`  - ${m.collectionGroup} (${m.fields.map((f) => f.fieldPath).join(", ")})`);
  }
  process.exit(1);
}

const rulesText = fs.readFileSync(rentitRulesPath, "utf8");
const requiredRules = [
  "saved_searches",
  "search_alerts",
  "listing_reviews",
  "buyer_requirements",
  "agent_conversations",
];
const missingRules = requiredRules.filter((name) => !rulesText.includes(`/${name}/`));
if (missingRules.length) {
  console.error("Firestore rules sync FAILED — missing collections in rentit_clean:");
  for (const name of missingRules) console.error(`  - ${name}`);
  process.exit(1);
}

console.log("Firestore web sync OK — indexes and rules present in rentit_clean.");

#!/usr/bin/env node
/**
 * Seed RentalPins platform sales desk builder (rentalpins-desk).
 * Usage: npm run seed:platform-builder
 */

import fs from "node:fs";
import path from "node:path";
import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getFirestore, FieldValue } from "firebase-admin/firestore";

const PLATFORM_SLUG = "rentalpins-desk";
const PLATFORM_PHONE = "9915061640";

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

const serviceAccount = {
  projectId: process.env.FIREBASE_PROJECT_ID || "rent-it-dev-6bcfd",
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL || "",
  privateKey: (process.env.FIREBASE_PRIVATE_KEY || "").replace(/\\n/g, "\n"),
};

if (!getApps().length) {
  if (serviceAccount.clientEmail && serviceAccount.privateKey) {
    initializeApp({ credential: cert(serviceAccount) });
  } else {
    initializeApp({ projectId: serviceAccount.projectId });
  }
}

const db = getFirestore();

const existingSnap = await db
  .collection("builders")
  .where("slug", "==", PLATFORM_SLUG)
  .limit(1)
  .get();

if (!existingSnap.empty) {
  const doc = existingSnap.docs[0];
  await doc.ref.update({
    status: "published",
    leadRouting: "platform",
    phone: PLATFORM_PHONE,
    whatsapp: PLATFORM_PHONE,
    email: "admin@rentalpins.com",
    updatedAt: FieldValue.serverTimestamp(),
  });
  console.log("Platform builder already exists — updated routing.");
  console.log(`  builderId: ${doc.id}`);
  console.log(`  slug: ${PLATFORM_SLUG}`);
  process.exit(0);
}

const now = FieldValue.serverTimestamp();
const ref = db.collection("builders").doc();

await ref.set({
  name: "RentalPins Sales Desk",
  slug: PLATFORM_SLUG,
  description:
    "RentalPins concierge desk — coordinates site visits, brochures, and builder callbacks for Tricity new-launch and buy-side project enquiries.",
  logoUrl: null,
  coverImageUrl: null,
  phone: PLATFORM_PHONE,
  whatsapp: PLATFORM_PHONE,
  email: "admin@rentalpins.com",
  website: "https://www.rentalpins.com",
  address: "Chandigarh Tricity",
  city: "Mohali",
  state: "Punjab",
  country: "India",
  reraNumber: null,
  establishedYear: null,
  socialLinks: {},
  galleryUrls: [],
  team: [],
  status: "published",
  isFeatured: true,
  builderPlan: "premium",
  planStatus: "active",
  planStartDate: now,
  planEndDate: null,
  featuredUntil: null,
  maxProjects: 50,
  maxLeads: 5000,
  allowedModules: ["profile", "microsite", "crm"],
  viewCount: 0,
  enquiryCount: 0,
  createdAt: now,
  updatedAt: now,
  createdBy: "cli-seed-platform",
  ownerUserId: null,
  leadRouting: "platform",
  source: "web",
});

console.log("Platform builder created.");
console.log(`  builderId: ${ref.id}`);
console.log(`  slug: ${PLATFORM_SLUG}`);

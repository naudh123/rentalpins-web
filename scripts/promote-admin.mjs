#!/usr/bin/env node
/**
 * Promote a Firebase Auth user to admin (dev/local).
 * Usage: node scripts/promote-admin.mjs naudhji@gmail.com
 */

import fs from "node:fs";
import path from "node:path";
import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore, FieldValue } from "firebase-admin/firestore";

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

const email = process.argv[2];
if (!email) {
  console.error("Usage: node scripts/promote-admin.mjs <email>");
  process.exit(1);
}

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

const auth = getAuth();
const db = getFirestore();

try {
  const user = await auth.getUserByEmail(email);
  await db.collection("users").doc(user.uid).set(
    {
      role: "admin",
      email,
      updatedAt: FieldValue.serverTimestamp(),
    },
    { merge: true }
  );
  console.log(`Promoted ${email} (uid: ${user.uid}) to admin.`);
  console.log("Sign in at http://127.0.0.1:3000/auth/login then open /admin/builders");
} catch (err) {
  const code = err && typeof err === "object" && "code" in err ? err.code : "";
  if (code === "auth/user-not-found") {
    console.error(`No Firebase user for ${email}. Sign in once in the app first, then re-run.`);
  } else {
    console.error("Failed:", err.message || err);
  }
  process.exit(1);
}

import { adminDb } from "../lib/firebase-admin.ts";

const sessionId = process.argv[2];
if (!sessionId) {
  console.error("Usage: npx tsx --env-file=.env.local scripts/check-agent-session.mjs <sessionId>");
  process.exit(1);
}

const doc = await adminDb.collection("agent_conversations").doc(sessionId).get();
console.log(JSON.stringify({ exists: doc.exists, ...doc.data() }, null, 2));

if (doc.data()?.leadId) {
  const lead = await adminDb.collection("project_leads").doc(doc.data().leadId).get();
  console.log("LEAD:", JSON.stringify(lead.data(), null, 2));
}

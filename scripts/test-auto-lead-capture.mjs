/**
 * One-off live test: auto-lead from chat messages (phone + budget merged across turns).
 * Usage: node --env-file=.env.local scripts/test-auto-lead-capture.mjs
 */
import { saveAgentConversation } from "../lib/agent/conversations.ts";

const sessionId = `auto-lead-test-${Date.now()}`;

const messages = [
  {
    id: "u1",
    role: "user",
    parts: [
      {
        type: "text",
        text: "Compare Gillco Valley vs Ansal API Sector 115 under ₹90 lakh",
      },
    ],
  },
  {
    id: "a1",
    role: "assistant",
    parts: [
      {
        type: "text",
        text: "Here is a comparison... Please share name, mobile, and budget for callback.",
      },
    ],
  },
  {
    id: "u2",
    role: "user",
    parts: [{ type: "text", text: "Rahul, 9876543210" }],
  },
];

const result = await saveAgentConversation({
  sessionId,
  surface: "project",
  transactionType: "sale",
  messages,
  citySlug: "mohali",
  projectName: "Gillco Valley vs Ansal API Sector 115",
});

console.log(JSON.stringify({ sessionId, ...result }, null, 2));

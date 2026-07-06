/**
 * Live chat test: Gillco vs Ansal + contact details in one message.
 * Usage: npx tsx scripts/test-agent-chat-lead.mjs
 */
const sessionId = `chat-lead-test-${Date.now()}`;

const messages = [
  {
    id: "u1",
    role: "user",
    parts: [
      {
        type: "text",
        text: "Compare Gillco Valley vs Ansal API Sector 115. My budget is under ₹90 lakh. Name Rahul, mobile 9876543210.",
      },
    ],
  },
];

const res = await fetch("http://127.0.0.1:3000/api/agent/chat", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    messages,
    sessionId,
    surface: "project",
    transactionType: "sale",
    citySlug: "mohali",
  }),
});

if (!res.ok) {
  console.error("Chat failed:", res.status, await res.text());
  process.exit(1);
}

const text = await res.text();
const toolCalls = [...text.matchAll(/"toolName":"([^"]+)"/g)].map((m) => m[1]);
const captureCalled = toolCalls.includes("captureConversationLead");
const hasLeadSaved = /Lead registered|captureConversationLead/.test(text);

console.log(
  JSON.stringify(
    {
      sessionId,
      captureToolCalled: captureCalled,
      toolsSeen: [...new Set(toolCalls)],
      responseLength: text.length,
      snippet: text.slice(-800),
    },
    null,
    2
  )
);

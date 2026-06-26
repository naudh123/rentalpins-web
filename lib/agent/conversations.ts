import { FieldValue } from "firebase-admin/firestore";
import type { UIMessage } from "ai";
import { adminDb } from "@/lib/firebase-admin";
import type { AgentSurface } from "./types";
import {
  buildConversationSummary,
  extractMapPathFromMessages,
  extractToolsFromMessages,
  hashAgentClientKey,
  scoreAgentConversation,
  serializeAgentTranscript,
} from "./lead-scoring";
import { sendShowcaseLeadEmail, shouldNotifyShowcaseLead } from "./showcase-lead-email";

const COLLECTION = "agent_conversations";

export interface SaveAgentConversationInput {
  sessionId: string;
  ipHash?: string;
  userId?: string;
  surface: AgentSurface;
  transactionType: "rent" | "sale";
  messages: UIMessage[];
  handoffInterest?: string;
  handoffSummary?: string;
}

export interface SaveAgentConversationResult {
  saved: boolean;
  notified: boolean;
}

export async function saveAgentConversation(
  input: SaveAgentConversationInput
): Promise<SaveAgentConversationResult> {
  const sessionId = input.sessionId.trim();
  if (!sessionId) return { saved: false, notified: false };

  const toolsUsed = extractToolsFromMessages(input.messages);
  const lead = scoreAgentConversation({
    messages: input.messages,
    toolsUsed,
    surface: input.surface,
  });
  const interest = input.handoffInterest ?? lead.interest ?? null;
  const userMessageCount = input.messages.filter((m) => m.role === "user").length;
  const summary = buildConversationSummary(input.messages);
  const mapPath = extractMapPathFromMessages(input.messages);

  const docRef = adminDb.collection(COLLECTION).doc(sessionId);
  const existing = await docRef.get();
  const alreadyNotified = Boolean(existing.data()?.notifiedAt);

  await docRef.set(
    {
      sessionId,
      ipHash: input.ipHash ?? null,
      userId: input.userId ?? null,
      surface: input.surface,
      transactionType: input.transactionType,
      messageCount: input.messages.length,
      userMessageCount,
      intentScore: lead.score,
      intentSignals: lead.signals,
      highIntent: lead.highIntent,
      interest: interest,
      toolsUsed,
      summary,
      mapPath,
      transcript: serializeAgentTranscript(input.messages),
      updatedAt: FieldValue.serverTimestamp(),
      ...(existing.exists ? {} : { createdAt: FieldValue.serverTimestamp() }),
    },
    { merge: true }
  );

  let notified = false;
  if (
    shouldNotifyShowcaseLead({
      surface: input.surface,
      highIntent: lead.highIntent,
      alreadyNotified,
    })
  ) {
    const result = await sendShowcaseLeadEmail({
      sessionId,
      surface: input.surface,
      lead: { ...lead, interest: interest ?? lead.interest },
      toolsUsed,
      summary,
      mapPath,
      messages: input.messages,
    });

    if (result.success) {
      await docRef.set({ notifiedAt: FieldValue.serverTimestamp() }, { merge: true });
      notified = true;
    }
  }

  return { saved: true, notified };
}

export function hashIpForAgent(clientKey: string): string {
  return hashAgentClientKey(clientKey);
}

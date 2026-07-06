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
import {
  sendProjectAgentConversationEmail,
  shouldNotifyProjectAgentConversation,
} from "./project-agent-lead-email";
import { extractContactFromMessages, hasMinimumLeadContact } from "./contact-extraction";
import { persistConversationLead } from "./persist-conversation-lead";

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
  projectId?: string | null;
  projectName?: string | null;
  citySlug?: string | null;
  projectSlug?: string | null;
}

export interface SaveAgentConversationResult {
  saved: boolean;
  notified: boolean;
  leadCreated?: boolean;
  leadId?: string;
}

const LEAD_TOOLS = new Set([
  "captureConversationLead",
  "submitProjectEnquiry",
  "scheduleSiteVisit",
]);

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
  const hadLead = Boolean(existing.data()?.leadId);

  let leadCreated = false;
  let leadId: string | undefined = existing.data()?.leadId as string | undefined;

  if (
    input.surface === "project" &&
    !hadLead &&
    !toolsUsed.some((t) => LEAD_TOOLS.has(t))
  ) {
    const contact = extractContactFromMessages(input.messages);
    if (hasMinimumLeadContact(contact)) {
      const result = await persistConversationLead({
        sessionId,
        projectId: input.projectId,
        citySlug: input.citySlug,
        projectSlug: input.projectSlug,
        projectName: input.projectName,
        messages: input.messages,
        contact,
        source: "project_agent_auto",
      }).catch((err) => {
        console.error("[agent/conversations] auto lead failed", err);
        return { created: false as const };
      });
      if (result.created && result.leadId) {
        leadCreated = true;
        leadId = result.leadId;
      }
    }
  }

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
      projectId: input.projectId ?? null,
      projectName: input.projectName ?? null,
      citySlug: input.citySlug ?? null,
      projectSlug: input.projectSlug ?? null,
      leadId: leadId ?? null,
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
  } else if (
    shouldNotifyProjectAgentConversation({
      surface: input.surface,
      highIntent: lead.highIntent,
      alreadyNotified,
      toolsUsed,
    })
  ) {
    const result = await sendProjectAgentConversationEmail({
      sessionId,
      projectName: input.projectName,
      lead: { ...lead, interest: interest ?? lead.interest },
      toolsUsed,
      summary,
      messages: input.messages,
    });
    if (result.success) {
      await docRef.set({ notifiedAt: FieldValue.serverTimestamp() }, { merge: true });
      notified = true;
    }
  }

  return { saved: true, notified, leadCreated, leadId };
}

export function hashIpForAgent(clientKey: string): string {
  return hashAgentClientKey(clientKey);
}

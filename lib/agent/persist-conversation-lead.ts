import type { UIMessage } from "ai";
import { adminDb } from "@/lib/firebase-admin";
import { createLead } from "@/lib/builders/builders-server";
import { sendProjectLeadEmail } from "@/lib/builders/project-lead-email";
import {
  extractContactFromMessages,
  hasMinimumLeadContact,
  normalizeIndianPhone,
  type ExtractedContact,
} from "@/lib/agent/contact-extraction";
import { resolveLeadProjectContext } from "@/lib/agent/project-lead-resolver";
import {
  buildConversationSummary,
  serializeAgentTranscript,
} from "@/lib/agent/lead-scoring";
import type { CreateLeadInput } from "@/lib/types/builder-microsite";

const CONVERSATIONS_COL = "agent_conversations";

export interface PersistConversationLeadInput {
  sessionId: string;
  projectId?: string | null;
  citySlug?: string | null;
  projectSlug?: string | null;
  projectName?: string | null;
  messages: UIMessage[];
  /** Explicit contact from agent tool — overrides extraction */
  contact?: Partial<ExtractedContact> & { name?: string; phone?: string; email?: string };
  interestedProjectName?: string | null;
  source?: "project_agent" | "project_agent_auto";
  /** Extra note when saving from the quick-register form (no chat transcript). */
  note?: string | null;
}

export interface PersistConversationLeadResult {
  created: boolean;
  leadId?: string;
  reason?: string;
}

function buildLeadName(contact: ExtractedContact): string {
  if (contact.name?.trim()) return contact.name.trim();
  return "AI chat lead";
}

function buildLeadEmail(contact: ExtractedContact): string {
  if (contact.email?.trim()) return contact.email.trim().toLowerCase();
  return "pending@rentalpins.com";
}

export async function persistConversationLead(
  input: PersistConversationLeadInput
): Promise<PersistConversationLeadResult> {
  const sessionId = input.sessionId.trim();
  if (!sessionId) return { created: false, reason: "missing_session" };

  const convRef = adminDb.collection(CONVERSATIONS_COL).doc(sessionId);
  const existing = await convRef.get();
  if (existing.data()?.leadId) {
    return { created: false, reason: "already_converted", leadId: existing.data()?.leadId as string };
  }

  const extracted = extractContactFromMessages(input.messages);
  const contact: ExtractedContact = {
    ...extracted,
    ...input.contact,
  };

  if (!hasMinimumLeadContact(contact)) {
    return { created: false, reason: "no_contact" };
  }

  const phone = normalizeIndianPhone(contact.phone ?? "");
  if (!phone) return { created: false, reason: "invalid_phone" };

  const ctx = await resolveLeadProjectContext({
    projectId: input.projectId,
    citySlug: input.citySlug,
    projectSlug: input.projectSlug,
    interestedProjectName: input.interestedProjectName ?? input.projectName,
  });

  if (!ctx) return { created: false, reason: "no_builder_context" };

  const summary = buildConversationSummary(input.messages);
  const transcript = serializeAgentTranscript(input.messages, 4000);

  const leadInput: CreateLeadInput = {
    builderId: ctx.builderId,
    projectId: ctx.projectId ?? undefined,
    source: input.source ?? "project_agent",
    name: buildLeadName(contact),
    phone,
    email: buildLeadEmail(contact),
    message: [
      input.note?.trim() ? input.note.trim() : null,
      contact.budgetRange ? `Budget: ${contact.budgetRange}` : null,
      summary ? `Chat summary: ${summary}` : null,
      input.interestedProjectName ? `Interested in: ${input.interestedProjectName}` : null,
      ctx.projectName ? `Project context: ${ctx.projectName}` : null,
      transcript ? `\n--- Transcript ---\n${transcript}` : null,
    ]
      .filter(Boolean)
      .join("\n")
      .slice(0, 8000),
    budgetRange: contact.budgetRange,
    buyingTimeline: contact.buyingTimeline,
    purchasePurpose: contact.purchasePurpose,
    hearAboutUs: "Project AI concierge",
  };

  const leadId = await createLead(leadInput);

  void sendProjectLeadEmail({
    leadId,
    input: leadInput,
    projectName: ctx.projectName ?? input.projectName,
    builderName: ctx.builderName,
    citySlug: ctx.citySlug,
  }).catch(console.error);

  await convRef.set({ leadId, leadCreatedAt: new Date().toISOString() }, { merge: true });

  return { created: true, leadId };
}

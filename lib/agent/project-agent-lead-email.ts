import type { UIMessage } from "ai";
import { siteUrl, appPath } from "@/lib/config";
import { PLATFORM_SALES_PHONE } from "@/lib/builders/project-contact";
import {
  getAgentEmailFrom,
  getAgentLeadNotificationEmail,
  getResendApiKey,
  isAgentEmailConfigured,
} from "@/lib/agent/email-env";
import type { AgentLeadScore } from "@/lib/agent/lead-scoring";

export interface ProjectAgentConversationEmailInput {
  sessionId: string;
  projectName?: string | null;
  lead: AgentLeadScore;
  toolsUsed: string[];
  summary: string | null;
  messages: UIMessage[];
}

export function shouldNotifyProjectAgentConversation(params: {
  surface: string;
  highIntent: boolean;
  alreadyNotified: boolean;
  toolsUsed: string[];
}): boolean {
  if (params.alreadyNotified || params.surface !== "project") return false;
  if (!isAgentEmailConfigured()) return false;
    if (params.toolsUsed.includes("submitProjectEnquiry")) return false;
  if (params.toolsUsed.includes("captureConversationLead")) return false;
  return (
    params.highIntent ||
    params.toolsUsed.includes("scheduleSiteVisit") ||
    params.toolsUsed.includes("connectToSales")
  );
}

export async function sendProjectAgentConversationEmail(
  data: ProjectAgentConversationEmailInput
): Promise<{ success: boolean; error?: string }> {
  if (!isAgentEmailConfigured()) {
    return { success: false, error: "Email not configured." };
  }

  const subject = `Hot project AI lead${data.projectName ? `: ${data.projectName}` : ""} (score ${data.lead.score})`;
  const adminUrl = `${siteUrl}${appPath("/admin/project-leads")}`;
  const text = [
    "High-intent Project Concierge conversation",
    `Project: ${data.projectName ?? "Projects directory"}`,
    `Score: ${data.lead.score}`,
    `Signals: ${data.lead.signals.join(", ")}`,
    `Tools: ${data.toolsUsed.join(", ")}`,
    `Summary: ${data.summary ?? "—"}`,
    `Session: ${data.sessionId}`,
    `Call back: +91 ${PLATFORM_SALES_PHONE}`,
    adminUrl,
  ].join("\n");

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${getResendApiKey()}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: getAgentEmailFrom(),
        to: [getAgentLeadNotificationEmail()],
        subject,
        text,
      }),
    });
    if (!response.ok) {
      return { success: false, error: `Resend ${response.status}` };
    }
    return { success: true };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Send failed",
    };
  }
}

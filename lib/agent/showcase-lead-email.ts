import type { UIMessage } from "ai";
import { siteUrl, appPath } from "@/lib/config";
import {
  getAgentEmailFrom,
  getAgentLeadNotificationEmail,
  getResendApiKey,
  isAgentEmailConfigured,
} from "./email-env";
import type { AgentSurface } from "./types";
import type { AgentLeadScore } from "./lead-scoring";

export interface ShowcaseLeadEmailInput {
  sessionId: string;
  surface: AgentSurface;
  lead: AgentLeadScore;
  toolsUsed: string[];
  summary: string | null;
  mapPath: string | null;
  messages: UIMessage[];
}

export function shouldNotifyShowcaseLead(params: {
  surface: AgentSurface;
  highIntent: boolean;
  alreadyNotified: boolean;
}): boolean {
  return (
    params.surface === "showcase" &&
    params.highIntent &&
    !params.alreadyNotified &&
    isAgentEmailConfigured()
  );
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function transcriptEntries(messages: UIMessage[]): { role: string; text: string }[] {
  return messages
    .map((message) => {
      const text = message.parts
        .filter((p) => p.type === "text" && "text" in p && p.text)
        .map((p) => (p as { text: string }).text)
        .join("");
      return { role: message.role, text: text.trim() };
    })
    .filter((e) => e.text.length > 0)
    .slice(-6);
}

function buildShowcaseLeadEmailHtml(data: ShowcaseLeadEmailInput): string {
  const timestamp = new Date().toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    dateStyle: "full",
    timeStyle: "short",
  });
  const adminUrl = `${siteUrl}${appPath("/admin/agent")}`;

  const transcriptHtml = transcriptEntries(data.messages)
    .map(
      (entry) => `
        <tr>
          <td style="padding:8px 0;border-bottom:1px solid #e8ecf0;">
            <span style="color:#1E3A6E;font-size:11px;font-weight:700;text-transform:uppercase;">${escapeHtml(entry.role)}</span><br>
            <span style="color:#334155;font-size:14px;line-height:1.5;">${escapeHtml(entry.text)}</span>
          </td>
        </tr>`
    )
    .join("");

  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#f4f6f8;font-family:system-ui,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:32px 16px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border:1px solid #e2e8f0;border-radius:12px;overflow:hidden;">
          <tr>
            <td style="padding:24px 28px;background:#1E3A6E;">
              <h1 style="margin:0;color:#ffffff;font-size:20px;">High-intent PropTech showcase lead</h1>
              <p style="margin:8px 0 0;color:#D4AF37;font-size:12px;letter-spacing:0.12em;text-transform:uppercase;">RentalPins /developers agent</p>
            </td>
          </tr>
          <tr>
            <td style="padding:28px;">
              <p style="margin:0 0 16px;color:#64748b;font-size:13px;">A visitor on the developer showcase engaged deeply with the property agent.</p>
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding:10px 0;border-bottom:1px solid #e8ecf0;">
                    <span style="color:#94a3b8;font-size:11px;text-transform:uppercase;">Intent score</span><br>
                    <span style="color:#0D7C4A;font-size:24px;font-weight:700;">${data.lead.score}</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding:10px 0;border-bottom:1px solid #e8ecf0;">
                    <span style="color:#94a3b8;font-size:11px;text-transform:uppercase;">Interest</span><br>
                    <span style="color:#1E3A6E;font-size:16px;">${escapeHtml(data.lead.interest ?? "PropTech development")}</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding:10px 0;border-bottom:1px solid #e8ecf0;">
                    <span style="color:#94a3b8;font-size:11px;text-transform:uppercase;">Signals</span><br>
                    <span style="color:#334155;font-size:14px;">${escapeHtml(data.lead.signals.join(", ") || "—")}</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding:10px 0;border-bottom:1px solid #e8ecf0;">
                    <span style="color:#94a3b8;font-size:11px;text-transform:uppercase;">Tools used</span><br>
                    <span style="color:#334155;font-size:14px;">${escapeHtml(data.toolsUsed.join(", ") || "—")}</span>
                  </td>
                </tr>
                ${
                  data.mapPath
                    ? `<tr><td style="padding:10px 0;border-bottom:1px solid #e8ecf0;"><span style="color:#94a3b8;font-size:11px;text-transform:uppercase;">Map path</span><br><span style="color:#334155;font-size:14px;">${escapeHtml(data.mapPath)}</span></td></tr>`
                    : ""
                }
                <tr>
                  <td style="padding:12px 0;border-bottom:1px solid #e8ecf0;">
                    <span style="color:#94a3b8;font-size:11px;text-transform:uppercase;">Summary</span><br>
                    <p style="margin:8px 0 0;color:#334155;font-size:15px;line-height:1.6;">${escapeHtml(data.summary ?? "—")}</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding:12px 0 0;">
                    <span style="color:#94a3b8;font-size:11px;text-transform:uppercase;">Recent transcript</span>
                    <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:8px;">${transcriptHtml}</table>
                  </td>
                </tr>
              </table>
              <p style="margin:24px 0 0;">
                <a href="${adminUrl}" style="display:inline-block;background:#1E3A6E;color:#ffffff;text-decoration:none;padding:12px 20px;border-radius:8px;font-weight:600;font-size:14px;">View agent metrics</a>
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding:16px 28px;background:#f8fafc;border-top:1px solid #e2e8f0;">
              <p style="margin:0;color:#94a3b8;font-size:11px;">Session ${escapeHtml(data.sessionId)} · ${timestamp}</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export async function sendShowcaseLeadEmail(
  data: ShowcaseLeadEmailInput
): Promise<{ success: boolean; error?: string }> {
  if (!isAgentEmailConfigured()) {
    return { success: false, error: "Agent email not configured." };
  }

  const subject = `PropTech showcase lead (score ${data.lead.score}): ${data.lead.interest ?? "RentalPins platform"}`;
  const html = buildShowcaseLeadEmailHtml(data);
  const text = [
    "High-intent RentalPins showcase agent conversation",
    `Score: ${data.lead.score}`,
    `Interest: ${data.lead.interest ?? "PropTech development"}`,
    `Signals: ${data.lead.signals.join(", ")}`,
    `Summary: ${data.summary ?? "—"}`,
    `Session: ${data.sessionId}`,
    `Admin: ${siteUrl}${appPath("/admin/agent")}`,
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
        html,
        text,
      }),
    });

    if (!response.ok) {
      const body = await response.text();
      console.error("[agent/email] Resend error:", response.status, body);
      return { success: false, error: `Resend ${response.status}` };
    }

    return { success: true };
  } catch (err) {
    console.error("[agent/email] send failed:", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "Send failed",
    };
  }
}

import { siteUrl, appPath } from "@/lib/config";
import { PLATFORM_SALES_PHONE } from "@/lib/builders/project-contact";
import { whatsappLink } from "@/lib/builders/format";
import type { CreateLeadInput } from "@/lib/types/builder-microsite";
import {
  getAgentEmailFrom,
  getAgentLeadNotificationEmail,
  getResendApiKey,
  isAgentEmailConfigured,
} from "@/lib/agent/email-env";

export interface ProjectLeadEmailContext {
  leadId: string;
  input: CreateLeadInput;
  projectName?: string | null;
  builderName?: string | null;
  citySlug?: string | null;
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function fieldRow(label: string, value: string | null | undefined): string {
  if (!value?.trim()) return "";
  return `<tr>
    <td style="padding:6px 0;color:#6b7a99;font-size:12px;width:140px;vertical-align:top;">${escapeHtml(label)}</td>
    <td style="padding:6px 0;color:#0f1c35;font-size:14px;">${escapeHtml(value.trim())}</td>
  </tr>`;
}

function buildProjectLeadEmailHtml(ctx: ProjectLeadEmailContext): string {
  const { input } = ctx;
  const timestamp = new Date().toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    dateStyle: "full",
    timeStyle: "short",
  });
  const adminUrl = `${siteUrl}${appPath("/admin/project-leads")}`;
  const projectLabel = ctx.projectName ?? "General enquiry";
  const leadWa = whatsappLink(
    input.phone,
    `Hi ${input.name}, thanks for your interest in ${projectLabel} on RentalPins.`
  );

  const detailRows = [
    fieldRow("Name", input.name),
    fieldRow("Phone", input.phone),
    fieldRow("Email", input.email),
    fieldRow("Project", ctx.projectName),
    fieldRow("Builder", ctx.builderName),
    fieldRow("City", ctx.citySlug),
    fieldRow("Source", input.source),
    fieldRow("Budget", input.budgetRange),
    fieldRow("Timeline", input.buyingTimeline),
    fieldRow("Size / type", input.preferredSize),
    fieldRow("Purpose", input.purchasePurpose),
    fieldRow("Heard about us", input.hearAboutUs),
    fieldRow("Visit date", input.preferredVisitDate),
    fieldRow("Message", input.message),
  ].join("");

  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#f4f6f8;font-family:system-ui,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:32px 16px;">
    <tr><td align="center">
      <table width="100%" style="max-width:560px;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(15,28,53,0.08);">
        <tr><td style="background:#1e3a6e;padding:24px 28px;">
          <p style="margin:0;color:#c9a227;font-size:11px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;">New project lead</p>
          <h1 style="margin:8px 0 0;color:#fff;font-size:22px;font-weight:700;">${escapeHtml(projectLabel)}</h1>
          <p style="margin:8px 0 0;color:rgba(255,255,255,0.75);font-size:13px;">${escapeHtml(timestamp)} IST</p>
        </td></tr>
        <tr><td style="padding:28px;">
          <table width="100%" cellpadding="0" cellspacing="0">${detailRows}</table>
          <p style="margin:24px 0 12px;font-size:13px;color:#6b7a99;">Quick actions</p>
          <p style="margin:0 0 8px;">
            <a href="tel:+91${PLATFORM_SALES_PHONE}" style="color:#1e3a6e;font-weight:600;">Platform line: +91 ${PLATFORM_SALES_PHONE}</a>
          </p>
          <p style="margin:0 0 8px;">
            <a href="tel:+91${input.phone.replace(/\D/g, "").slice(-10)}" style="color:#1e3a6e;font-weight:600;">Call lead: ${escapeHtml(input.phone)}</a>
          </p>
          <p style="margin:0 0 8px;">
            <a href="${leadWa}" style="color:#15803d;font-weight:600;">WhatsApp lead</a>
          </p>
          <p style="margin:0;">
            <a href="mailto:${escapeHtml(input.email ?? "")}" style="color:#1e3a6e;font-weight:600;">Email lead</a>
          </p>
          <p style="margin:28px 0 0;">
            <a href="${adminUrl}" style="display:inline-block;background:#c9a227;color:#0f1c35;text-decoration:none;font-weight:700;font-size:14px;padding:12px 24px;border-radius:999px;">View in admin →</a>
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

function buildProjectLeadEmailText(ctx: ProjectLeadEmailContext): string {
  const { input } = ctx;
  const lines = [
    "New RentalPins project lead",
    `Project: ${ctx.projectName ?? "—"}`,
    `Builder: ${ctx.builderName ?? "—"}`,
    `Name: ${input.name}`,
    `Phone: ${input.phone}`,
    `Email: ${input.email}`,
    `Source: ${input.source}`,
    input.budgetRange ? `Budget: ${input.budgetRange}` : null,
    input.buyingTimeline ? `Timeline: ${input.buyingTimeline}` : null,
    input.message ? `Message: ${input.message}` : null,
    "",
    `Admin: ${siteUrl}${appPath("/admin/project-leads")}`,
    `Platform sales: +91 ${PLATFORM_SALES_PHONE}`,
  ].filter(Boolean);
  return lines.join("\n");
}

export function isProjectLeadEmailConfigured(): boolean {
  return isAgentEmailConfigured();
}

/** Notify admin@rentalpins.com (or LEAD_NOTIFICATION_EMAIL) for every project lead. */
export async function sendProjectLeadEmail(
  ctx: ProjectLeadEmailContext
): Promise<{ success: boolean; error?: string }> {
  if (!isProjectLeadEmailConfigured()) {
    console.warn(
      "[project-leads/email] RESEND_API_KEY or LEAD_NOTIFICATION_EMAIL not set — lead saved but not emailed."
    );
    return { success: false, error: "Email not configured." };
  }

  const to = getAgentLeadNotificationEmail();
  const subject = `New lead: ${ctx.projectName ?? "Project enquiry"} — ${ctx.input.name}`;

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${getResendApiKey()}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: getAgentEmailFrom(),
        to: [to],
        replyTo: ctx.input.email?.trim() || undefined,
        subject,
        html: buildProjectLeadEmailHtml(ctx),
        text: buildProjectLeadEmailText(ctx),
      }),
    });

    if (!response.ok) {
      const body = await response.text();
      console.error("[project-leads/email] Resend error:", response.status, body);
      return { success: false, error: `Resend ${response.status}` };
    }

    return { success: true };
  } catch (err) {
    console.error("[project-leads/email] send failed:", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "Send failed",
    };
  }
}

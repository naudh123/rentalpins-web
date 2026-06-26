function cleanEnv(value: string | undefined, fallback = ""): string {
  return (value ?? fallback).replace(/^\uFEFF/, "").trim();
}

function firstEnv(...keys: string[]): string {
  for (const key of keys) {
    const value = cleanEnv(process.env[key]);
    if (value) return value;
  }
  return "";
}

export function getResendApiKey(): string {
  return cleanEnv(process.env.RESEND_API_KEY);
}

/** Inbox for high-intent showcase agent leads (same env as RudderTech contact form). */
export function getAgentLeadNotificationEmail(): string {
  return (
    firstEnv("LEAD_NOTIFICATION_EMAIL", "AGENT_LEAD_NOTIFICATION_EMAIL") ||
    "admin@rentalpins.com"
  );
}

export function getAgentEmailFrom(): string {
  return (
    firstEnv("EMAIL_FROM", "AGENT_EMAIL_FROM") ||
    "RentalPins <onboarding@resend.dev>"
  );
}

export function isAgentEmailConfigured(): boolean {
  return Boolean(getResendApiKey() && getAgentLeadNotificationEmail());
}

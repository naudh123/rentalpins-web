import type { UIMessage } from "ai";

function getMessageText(parts: { type: string; text?: string }[]): string {
  return parts
    .filter((part) => part.type === "text" && part.text)
    .map((part) => part.text)
    .join("");
}

export interface ExtractedContact {
  name?: string;
  phone?: string;
  email?: string;
  budgetRange?: string;
  buyingTimeline?: string;
  purchasePurpose?: string;
}

const PHONE_RE = /(?:\+91[\s-]?)?(?:0)?([6-9]\d{9})\b/g;
const EMAIL_RE = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi;
const BUDGET_RE =
  /(?:under\s*(?:₹|rs\.?\s*)?|(?:₹|rs\.?\s*)?)(\d+(?:\.\d+)?)\s*(lakh|lac|crore|cr|k)\b|(?:₹|rs\.?\s*)?\d+(?:\.\d+)?\s*(?:lakh|lac|crore|cr)\b/gi;
const TIMELINE_RE =
  /\b(within\s+\d+\s+months?|next\s+month|this\s+month|ready\s+to\s+buy|immediate|3\s*-\s*6\s+months?|1\s*-\s*2\s+years?)\b/gi;

export function normalizeIndianPhone(raw: string): string | null {
  const digits = raw.replace(/\D/g, "");
  const ten = digits.length >= 10 ? digits.slice(-10) : digits;
  return /^[6-9]\d{9}$/.test(ten) ? ten : null;
}

function extractName(text: string): string | undefined {
  const patterns = [
    /(?:my name is|i am|i'm|this is|name[:\s-]+)\s*([A-Za-z][A-Za-z\s'.-]{1,40})/i,
    /^([A-Za-z][A-Za-z\s'.-]{1,30})\s*,\s*(?:\+91|91)?[6-9]\d{9}/,
    /^([A-Za-z][A-Za-z\s'.-]{1,30})\s+(?:\+91|91)?[6-9]\d{9}/,
    /(?:^|[,\n])\s*([A-Za-z]{2,25})\s*,\s*[6-9]/,
  ];
  for (const re of patterns) {
    const m = text.match(re);
    const name = m?.[1]?.trim().replace(/\s+/g, " ");
    if (name && name.length >= 2 && !/^(hi|hello|yes|no|ok)$/i.test(name)) {
      return name.split(" ").slice(0, 3).join(" ");
    }
  }
  return undefined;
}

function extractBudget(text: string): string | undefined {
  const under = text.match(
    /under\s*(?:₹|rs\.?\s*)?(\d+(?:\.\d+)?)\s*(lakh|lac|crore|cr|k)/i
  );
  if (under) {
    return `under ${under[1]} ${under[2].replace(/lac/i, "lakh")}`;
  }
  const band = text.match(
    /(?:budget|have|₹|rs\.?\s*)(\d+(?:\.\d+)?)\s*(lakh|lac|crore|cr|k)/i
  );
  if (band) {
    return `₹${band[1]} ${band[2].replace(/lac/i, "lakh")}`;
  }
  const any = text.match(/(?:₹|rs\.?\s*)?\d+(?:\.\d+)?\s*(?:lakh|lac|crore|cr)\b/i);
  return any?.[0]?.replace(/lac/i, "lakh");
}

export function extractContactFromText(text: string): ExtractedContact {
  const result: ExtractedContact = {};

  const emails = text.match(EMAIL_RE);
  if (emails?.[0]) result.email = emails[0].toLowerCase();

  const phoneMatches = [...text.matchAll(PHONE_RE)];
  for (const match of phoneMatches) {
    const normalized = normalizeIndianPhone(match[1] ?? match[0]);
    if (normalized) {
      result.phone = normalized;
      break;
    }
  }

  const name = extractName(text);
  if (name) result.name = name;

  const budget = extractBudget(text);
  if (budget) result.budgetRange = budget;

  const timeline = text.match(TIMELINE_RE);
  if (timeline?.[0]) result.buyingTimeline = timeline[0];

  if (/\b(invest|investment|rental yield)\b/i.test(text)) {
    result.purchasePurpose = "investment";
  } else if (/\b(self[- ]?use|end[- ]?user|live in|family home)\b/i.test(text)) {
    result.purchasePurpose = "self-use";
  }

  return result;
}

export function mergeExtractedContacts(parts: ExtractedContact[]): ExtractedContact {
  const merged: ExtractedContact = {};
  for (const part of parts) {
    if (part.name && !merged.name) merged.name = part.name;
    if (part.phone && !merged.phone) merged.phone = part.phone;
    if (part.email && !merged.email) merged.email = part.email;
    if (part.budgetRange && !merged.budgetRange) merged.budgetRange = part.budgetRange;
    if (part.buyingTimeline && !merged.buyingTimeline) merged.buyingTimeline = part.buyingTimeline;
    if (part.purchasePurpose && !merged.purchasePurpose) merged.purchasePurpose = part.purchasePurpose;
  }
  return merged;
}

export function extractContactFromMessages(messages: UIMessage[]): ExtractedContact {
  const userTexts = messages
    .filter((m) => m.role === "user")
    .map((m) => getMessageText(m.parts))
    .filter(Boolean);

  const parts = userTexts.map(extractContactFromText);
  return mergeExtractedContacts(parts);
}

/** Phone + budget from chat is enough to auto-save (name defaults in persist layer). */
export function hasMinimumLeadContact(contact: ExtractedContact): boolean {
  return Boolean(normalizeIndianPhone(contact.phone ?? "") && contact.budgetRange?.trim());
}

export function hasCompleteLeadFields(contact: ExtractedContact): boolean {
  return Boolean(
    contact.phone &&
      contact.budgetRange &&
      (contact.name || contact.email)
  );
}

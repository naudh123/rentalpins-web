import { describe, expect, it } from "vitest";
import {
  extractContactFromText,
  extractContactFromMessages,
  hasCompleteLeadFields,
  hasMinimumLeadContact,
  normalizeIndianPhone,
} from "@/lib/agent/contact-extraction";

describe("contact extraction", () => {
  it("extracts phone and email from user text", () => {
    const contact = extractContactFromText(
      "I'm Rahul, my email is rahul.test@gmail.com and phone 9876543210"
    );
    expect(contact.phone).toBe("9876543210");
    expect(contact.email).toBe("rahul.test@gmail.com");
    expect(contact.name).toBe("Rahul");
  });

  it("extracts comma-separated name and phone", () => {
    const contact = extractContactFromText("Rahul, 9876543210");
    expect(contact.name).toBe("Rahul");
    expect(contact.phone).toBe("9876543210");
  });

  it("extracts under-X-lakh budget", () => {
    const contact = extractContactFromText("Compare Gillco vs Ansal under ₹90 lakh");
    expect(contact.budgetRange).toBe("under 90 lakh");
  });

  it("normalizes +91 phone numbers", () => {
    expect(normalizeIndianPhone("+91 99150 61640")).toBe("9915061640");
  });

  it("extracts budget from messages", () => {
    const contact = extractContactFromMessages([
      {
        id: "1",
        role: "user",
        parts: [{ type: "text", text: "Budget is 80 lakh in Mohali" }],
      },
    ]);
    expect(contact.budgetRange?.toLowerCase()).toContain("80 lakh");
  });

  it("merges budget from earlier message with phone in later message", () => {
    const contact = extractContactFromMessages([
      {
        id: "1",
        role: "user",
        parts: [{ type: "text", text: "under 90 lakh — Gillco vs Ansal" }],
      },
      {
        id: "2",
        role: "user",
        parts: [{ type: "text", text: "Rahul, 9876543210" }],
      },
    ]);
    expect(contact.phone).toBe("9876543210");
    expect(contact.name).toBe("Rahul");
    expect(contact.budgetRange).toBe("under 90 lakh");
    expect(hasMinimumLeadContact(contact)).toBe(true);
    expect(hasCompleteLeadFields(contact)).toBe(true);
  });
});

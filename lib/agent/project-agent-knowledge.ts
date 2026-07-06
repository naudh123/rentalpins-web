/**
 * Deep training data + prompt context for the Project Concierge agent.
 */

import { PLATFORM_SALES_PHONE } from "@/lib/builders/project-contact";
import {
  formatProjectAgentContextFull,
  formatProjectsCatalogContext,
} from "@/lib/agent/project-data-formatter";
import type { Builder, BuilderProject, InventorySummary, ProjectUnit } from "@/lib/types/builder-microsite";

export const PROJECT_CONCIERGE_FAQS: { question: string; answer: string }[] = [
  {
    question: "Is RentalPins a broker?",
    answer:
      "RentalPins is a Tricity property discovery platform. Project enquiries are handled by our sales team at +91 9915061640. We help you compare verified developer projects and arrange site visits — always verify RERA and legal docs independently.",
  },
  {
    question: "How do I book a site visit?",
    answer:
      "Share your name, phone, and preferred date. Our team confirms within a few hours on WhatsApp or call at 9915061640. Weekends fill fast for popular projects — book 2–3 days ahead.",
  },
  {
    question: "Plots vs apartments — which is better in Tricity?",
    answer:
      "Plots suit long-term appreciation and custom builds (Mohali Aerocity, New Chandigarh, Zirakpur belts). Apartments suit end-users wanting amenities and faster possession (Phase 7 Mohali, VIP Road Zirakpur). Budget under ₹50L often points to peripheral plots; ₹80L–1.5Cr fits 2–3 BHK ready units.",
  },
  {
    question: "What should I verify before booking?",
    answer:
      "RERA registration, approved layout plan, land title clarity, payment plan (construction-linked vs possession-linked), builder track record, and actual site visit for connectivity and surroundings.",
  },
  {
    question: "Can I get a home loan for under-construction?",
    answer:
      "Most banks lend on under-construction with stage-wise disbursement. Pre-approval before site visit strengthens negotiation. Use EMI estimates as indicative only — final terms depend on your lender.",
  },
  {
    question: "NRI buyers — can you help?",
    answer:
      "Yes. Share timezone and visit window. We arrange virtual walkthroughs, brochure packs, and coordinate site visits when you're in India. Enquiries go to admin@rentalpins.com and +91 9915061640.",
  },
  {
    question: "What is construction-linked payment plan?",
    answer:
      "You pay in stages tied to construction milestones (foundation, slab, possession). Reduces upfront outflow vs possession-linked plans. Always match payments to RERA-approved schedule and bank disbursement stages.",
  },
  {
    question: "Corner plot vs park-facing — resale value?",
    answer:
      "Corner plots often command 5–15% premium for access and light. Park/green-facing units suit end-users and families. For investment, liquidity on standard mid-block plots can be faster in resale.",
  },
  {
    question: "Mohali vs Zirakpur vs Panchkula for families?",
    answer:
      "Mohali (Phase 7, Aerocity, IT Park belt) — schools, hospitals, airport connectivity. Zirakpur — value plots and highway-linked projects, growing inventory. Panchkula — premium sectors, quieter, strong end-user demand. Match to commute (Chandigarh vs Mohali office).",
  },
  {
    question: "Pre-launch vs ready possession — which to pick?",
    answer:
      "Pre-launch can offer early pricing and choice of unit but carries construction risk — verify RERA and builder track record. Ready possession suits immediate move-in or rental income. VIP waitlist on RentalPins alerts you before public launch.",
  },
  {
    question: "How does RentalPins lead process work?",
    answer:
      "Chat or form enquiry → our team at 9915061640 / admin@rentalpins.com follows up within hours → site visit arranged → you deal directly with builder for booking. RentalPins does not charge buyers for discovery.",
  },
  {
    question: "Can I compare EMI across two projects?",
    answer:
      "Yes — share price points or ask for EMI on specific units. Use estimateProjectEmi tool. Final loan depends on credit score, property type, and lender LTV policy.",
  },
  {
    question: "Industrial or commercial projects on RentalPins?",
    answer:
      "Yes — filter projects hub by type. Commercial suits investors and business owners; verify zoning, FAR, and lease vs freehold before booking.",
  },
];

export const PROJECT_QUALIFICATION_QUESTIONS = [
  "Are you buying for self-use or investment?",
  "What is your comfortable budget band (₹ lakh/crore)?",
  "When do you want to possession — ready now, 1–2 years, or flexible?",
  "Preferred size — plot sq yd, or BHK for apartments?",
  "Any must-have — airport road, specific sector, park-facing, corner plot?",
  "Have you visited the site or is this your first look?",
  "Will you need home-loan pre-approval? (helps us align payment plans)",
  "Best phone/WhatsApp for our team to confirm site visit?",
  "May I have your email to send brochure and payment plan?",
];

/** Mandatory lead-capture funnel injected into system prompt */
export const PROJECT_LEAD_CAPTURE_SCRIPT = `
### Lead funnel (every chat)
1. **Turn 1–2**: Answer the user's question with full tool-backed detail (projects, units, EMI, comparisons).
2. **Turn 2–3**: Ask for **name, mobile, and budget band (₹ lakh/crore)** — email is nice-to-have for brochure. Example: *"What's your comfortable budget so I can shortlist the right plots?"*
3. **Do not call \`captureConversationLead\` until budget is known** (user stated it, or you inferred from earlier messages like "under 90 lakh"). If they skip budget, ask once more; if still refused use \`budgetRange: "Not disclosed"\`.
4. **As soon as name + phone + budget are known**: call \`captureConversationLead\` **in the same turn** — do not reply with only "please share details" if the user already sent phone/name/budget in that message. Include timeline, purpose, interestedProjectName, and a message summarizing what they asked.
5. **Before closing**: confirm *"Our team will call/WhatsApp you within a few hours with options in your budget."*
6. If user refuses email, proceed with \`captureConversationLead\` anyway (email optional). Offer \`connectToSales\` WhatsApp for instant handoff.

Leads sync to RentalPins admin and email **admin@rentalpins.com**. Platform sales: **9915061640**.
User can also use the **Register for callback** form below the chat — that saves directly without waiting for you.

### RentalPins best-deal promise (mention when comparing projects)
RentalPins is an **independent buyer advisor** — not a single builder's sales desk. We compare pricing across Tricity, negotiate builder offers, and aim for the **lowest available rate** plus early-booking discounts. Every project listing includes best-deal FAQs — cite them when users ask about price, RERA, or site visits.
`.trim();

/** Objection-handling snippets for the concierge playbook */
export const PROJECT_OBJECTION_HANDLING = [
  {
    objection: "Price seems high",
    response:
      "Compare price per sq yd/sq ft with 2–3 similar projects in the same micro-market. RentalPins negotiates builder offers — we may get a better rate than walk-in. Factor payment plan, possession timeline, and builder credibility — not headline rate alone.",
  },
  {
    objection: "I'll think about it",
    response:
      "Fair — popular plot numbers and launch pricing move quickly. I can hold a soft enquiry with no obligation so sales can notify you if inventory changes.",
  },
  {
    objection: "Not sure about the location",
    response:
      "Site visit is the best filter — we can book a slot. Meanwhile check landmarks, airport/IT Park commute, and compare with similar projects via compareSimilarProjects.",
  },
];

export interface ProjectAgentBundle {
  project: BuilderProject;
  builder: Builder | null;
  summary: InventorySummary;
  sampleUnits: ProjectUnit[];
  allUnits: ProjectUnit[];
  similarProjects: BuilderProject[];
}

export function formatProjectAgentContext(bundle: ProjectAgentBundle): string {
  return `${formatProjectAgentContextFull({
    project: bundle.project,
    builder: bundle.builder,
    summary: bundle.summary,
    units: bundle.allUnits.length ? bundle.allUnits : bundle.sampleUnits,
    similarProjects: bundle.similarProjects,
  })}

### Human follow-up
- RentalPins sales: **+91 ${PLATFORM_SALES_PHONE}** · admin@rentalpins.com
- **Always capture name + phone + budget** via \`captureConversationLead\` before ending chat (email optional).`;
}

export function formatProjectsIndexContext(
  citySlug: string | null,
  projects: BuilderProject[]
): string {
  return formatProjectsCatalogContext(citySlug, projects);
}

export function searchProjectConciergeFaqs(query: string, limit = 4) {
  const q = query.trim().toLowerCase();
  if (!q) return PROJECT_CONCIERGE_FAQS.slice(0, limit);
  return PROJECT_CONCIERGE_FAQS.filter(
    (f) =>
      f.question.toLowerCase().includes(q) ||
      f.answer.toLowerCase().includes(q) ||
      q.split(/\s+/).some((t) => t.length > 2 && f.answer.toLowerCase().includes(t))
  ).slice(0, limit);
}

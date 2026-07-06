/**
 * SEO + lead-conversion copy for all Tricity catalog projects.
 * Applied at seed time to every project — descriptions, FAQs, keywords, and meta tags.
 */

import { formatPriceRange, formatSizeRange } from "@/lib/builders/format";
import type { ProjectFaq } from "@/lib/types/builder-microsite";
import type { TricityProjectEntry } from "@/lib/builders/tricity-catalog";

export const RENTALPINS_DEAL_MARKER = "RentalPins — Best Deal Guarantee";

const PLATFORM_PHONE = "9915061640";

const CITY_SEO_ALIASES: Record<string, string[]> = {
  mohali: ["Mohali", "SAS Nagar", "GMADA Mohali", "Chandigarh Tricity", "Aerocity Mohali"],
  zirakpur: ["Zirakpur", "Chandigarh Tricity", "Patiala Highway", "Zirakpur plots"],
  kharar: ["Kharar", "Mohali district", "Chandigarh Tricity", "Landran Road"],
  landran: ["Landran", "Mohali", "Chandigarh Tricity", "IT City corridor"],
  banur: ["Banur", "Mohali", "Chandigarh Tricity"],
  panchkula: ["Panchkula", "Haryana", "Chandigarh Tricity", "Pinjore Hills"],
};

const TYPE_SEO: Record<
  TricityProjectEntry["projectType"],
  { label: string; keywords: string[]; buyerIntent: string }
> = {
  plots: {
    label: "Plots",
    keywords: [
      "residential plots",
      "RERA plots",
      "freehold plots",
      "plot for sale",
      "investment plots",
      "corner plot",
      "GMADA approved plots",
    ],
    buyerIntent: "plot buyers and land investors",
  },
  apartments: {
    label: "Apartments",
    keywords: ["flats for sale", "apartments", "2 BHK", "3 BHK", "ready to move flats"],
    buyerIntent: "home buyers seeking ready apartments",
  },
  villas: {
    label: "Villas",
    keywords: ["villas for sale", "independent villas", "luxury villas", "gated villa community"],
    buyerIntent: "families seeking independent villas",
  },
  commercial: {
    label: "Commercial",
    keywords: ["SCO plots", "commercial property", "retail shops", "office space", "commercial investment"],
    buyerIntent: "commercial investors and business owners",
  },
  industrial: {
    label: "Industrial",
    keywords: ["industrial plots", "warehouse", "factory land", "industrial park", "SBP industrial"],
    buyerIntent: "industrial and warehouse investors",
  },
  farmhouse: {
    label: "Farmhouse",
    keywords: ["farmhouse", "farm land", "weekend home", "countryside property"],
    buyerIntent: "farmhouse and weekend-home buyers",
  },
  "mixed-use": {
    label: "Mixed use",
    keywords: ["mixed use township", "residential commercial", "integrated township"],
    buyerIntent: "mixed-use township buyers",
  },
};

const PLATFORM_KEYWORDS = [
  "RentalPins",
  "best deal Tricity property",
  "lowest price guarantee",
  "property advisor Mohali",
  "compare projects Chandigarh Tricity",
  "site visit booking",
  "builder negotiation",
  "early booking discount",
  "Tricity real estate",
  "buy property Mohali Zirakpur Kharar",
  "RERA approved projects",
  "investment property Punjab",
  "AI property concierge",
];

export interface ProjectSeoBundle {
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string[];
  description: string;
  faqs: ProjectFaq[];
  /** Short snippet for AI search / agent ranking context */
  aiSearchSnippet: string;
}

function projectTypeLabel(type: TricityProjectEntry["projectType"]): string {
  return TYPE_SEO[type]?.label ?? "Property";
}

function statusLabel(status: TricityProjectEntry["status"]): string {
  if (status === "ready") return "ready possession";
  if (status === "ongoing") return "under construction";
  if (status === "upcoming") return "pre-launch";
  return "limited inventory";
}

function dedupeKeywords(words: string[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const w of words) {
    const key = w.toLowerCase().trim();
    if (!key || seen.has(key)) continue;
    seen.add(key);
    out.push(w.trim());
  }
  return out;
}

function buildKeywords(entry: TricityProjectEntry, builderName: string): string[] {
  const typeInfo = TYPE_SEO[entry.projectType];
  const cityAliases = CITY_SEO_ALIASES[entry.citySlug] ?? [entry.city, "Chandigarh Tricity"];
  const priceBand = formatPriceRange(entry.priceMin ?? null, entry.priceMax ?? null);

  return dedupeKeywords([
    entry.name,
    `${entry.name} ${entry.city}`,
    `${entry.name} best deal`,
    `${entry.name} price`,
    `${entry.name} RERA`,
    builderName,
    `${builderName} ${entry.city}`,
    `${builderName} projects`,
    ...cityAliases,
    ...cityAliases.map((c) => `${typeInfo.label.toLowerCase()} in ${c}`),
    ...typeInfo.keywords.map((k) => `${k} ${entry.city}`),
    `${entry.projectType} ${entry.citySlug}`,
    `${entry.status} ${entry.projectType} ${entry.city}`,
    priceBand !== "Price on request" ? `${entry.name} ${priceBand}` : `${entry.name} price list`,
    "best deal Mohali plots",
    "best deal Zirakpur property",
    "compare Gillco DLF Omaxe Mohali",
    ...PLATFORM_KEYWORDS,
    entry.reraNumber ? `RERA ${entry.reraNumber}` : "RERA approved Punjab",
    entry.address ? `${entry.name} ${entry.address}` : null,
    "book site visit Mohali",
    "property enquiry Tricity",
    "lowest plot rate Mohali",
    "payment plan plots Punjab",
  ].filter((x): x is string => Boolean(x)));
}

function buildDealParagraph(
  entry: TricityProjectEntry,
  builderName: string
): string {
  const typeInfo = TYPE_SEO[entry.projectType];
  const price = formatPriceRange(entry.priceMin ?? null, entry.priceMax ?? null);
  const size = formatSizeRange(entry.sizeMin ?? null, entry.sizeMax ?? null, entry.sizeUnit ?? "sq-yd");
  const rera = entry.reraNumber
    ? `RERA registered (${entry.reraNumber}).`
    : "Verify RERA registration before booking.";
  const payment = entry.paymentPlan
    ? `Payment plan: ${entry.paymentPlan}.`
    : "Flexible payment plans available on enquiry.";

  return [
    `### ${RENTALPINS_DEAL_MARKER}`,
    `**Get the best deal on ${entry.name}** — RentalPins is your independent Tricity property advisor. We compare ${builderName} pricing with similar ${entry.projectType} in ${entry.city}, negotiate builder offers, and help ${typeInfo.buyerIntent} secure the **lowest available rate**, early-booking discounts, and priority plot selection.`,
    `**Price:** ${price} · **Sizes:** ${size} · **Status:** ${statusLabel(entry.status)} · ${rera}`,
    payment,
    `**Why enquire through RentalPins?** Side-by-side project comparison · Free site-visit coordination · Brochure & payment-plan delivery · Direct callback from our sales desk (+91 ${PLATFORM_PHONE}) · No obligation quote in your budget band.`,
    `Enquire now for exclusive launch pricing on ${entry.name} — we respond within a few hours with options matched to your budget.`,
  ].join("\n\n");
}

function mergeDescription(base: string, dealBlock: string): string {
  const trimmed = base.trim();
  if (trimmed.includes(RENTALPINS_DEAL_MARKER)) return trimmed;
  return `${trimmed}\n\n${dealBlock}`;
}

function normalizeQuestion(q: string): string {
  return q.toLowerCase().replace(/\s+/g, " ").trim();
}

function buildDealFaqs(entry: TricityProjectEntry, builderName: string): ProjectFaq[] {
  const price = formatPriceRange(entry.priceMin ?? null, entry.priceMax ?? null);
  const size = formatSizeRange(entry.sizeMin ?? null, entry.sizeMax ?? null, entry.sizeUnit ?? "sq-yd");
  const typeLabel = projectTypeLabel(entry.projectType).toLowerCase();

  return [
    {
      question: `Will RentalPins get me the best deal on ${entry.name}?`,
      answer: `Yes. RentalPins independently compares ${entry.name} with similar ${typeLabel} in ${entry.city}, negotiates with ${builderName} for the lowest available rate, and flags early-booking discounts. Call +91 ${PLATFORM_PHONE} or enquire online — we shortlist options in your budget with no obligation.`,
    },
    {
      question: `What is the price of ${entry.name}?`,
      answer: `${entry.name} is priced ${price}${size !== "—" ? ` for sizes ${size}` : ""}. Final plot/unit rates depend on size, facing, and inventory. RentalPins shares the latest price list and any active builder offers when you enquire.`,
    },
    {
      question: `Is ${entry.name} RERA approved?`,
      answer: entry.reraNumber
        ? `Yes — ${entry.name} is registered under RERA ${entry.reraNumber}. Always verify on the Punjab/Haryana RERA portal before payment. RentalPins only lists published developer projects.`
        : `${entry.name} is listed on RentalPins with builder disclosures. Confirm the latest RERA registration number with our team (+91 ${PLATFORM_PHONE}) before booking.`,
    },
    {
      question: `How do I book a site visit to ${entry.name}?`,
      answer: `Enquire on RentalPins with your name, mobile, and budget. Our team coordinates a free site visit to ${entry.name} in ${entry.city}, shares brochure & payment plan, and follows up on WhatsApp at +91 ${PLATFORM_PHONE}.`,
    },
    {
      question: `Why buy ${entry.name} through RentalPins instead of going direct to ${builderName}?`,
      answer: `RentalPins gives you an independent comparison across Tricity projects, budget-matched shortlists, and negotiated builder pricing — so you see if ${entry.name} is truly the best deal for your needs. One enquiry covers multiple options; our AI concierge and sales desk work for the buyer, not a single builder.`,
    },
    {
      question: `What amenities and location advantages does ${entry.name} offer?`,
      answer:
        entry.amenities.length > 0
          ? `${entry.name} offers ${entry.amenities.slice(0, 6).join(", ")}${entry.amenities.length > 6 ? ", and more" : ""}.${entry.nearbyLandmarks?.length ? ` Nearby: ${entry.nearbyLandmarks.slice(0, 3).join("; ")}.` : ""} Ask RentalPins for a location brief tailored to your commute and investment goals.`
          : `Contact RentalPins for the full amenity list, master plan, and location brief for ${entry.name} in ${entry.city}.`,
    },
    {
      question: `Is ${entry.name} good for investment or self-use?`,
      answer: `${entry.name} suits both end-users and investors in ${entry.city}'s ${entry.projectType} market. RentalPins compares rental yield, appreciation corridors, and payment plans so you can decide based on your timeline — enquire with your budget for a personalised recommendation.`,
    },
  ];
}

function mergeFaqs(existing: ProjectFaq[] | undefined, generated: ProjectFaq[]): ProjectFaq[] {
  const seen = new Set<string>();
  const out: ProjectFaq[] = [];
  for (const faq of [...(existing ?? []), ...generated]) {
    const key = normalizeQuestion(faq.question);
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(faq);
  }
  return out;
}

export function buildProjectSeoBundle(
  entry: TricityProjectEntry,
  builderName: string
): ProjectSeoBundle {
  const typeLabel = projectTypeLabel(entry.projectType);
  const price = formatPriceRange(entry.priceMin ?? null, entry.priceMax ?? null);
  const dealBlock = buildDealParagraph(entry, builderName);
  const description = mergeDescription(entry.description, dealBlock);
  const faqs = mergeFaqs(entry.faqs, buildDealFaqs(entry, builderName));
  const seoKeywords = buildKeywords(entry, builderName);

  const seoTitle = `${entry.name} Best Deal — ${typeLabel} in ${entry.city}`;
  const seoDescription = [
    `Best deal on ${entry.name} by ${builderName} in ${entry.city}.`,
    price !== "Price on request" ? `${price}.` : "",
    entry.reraNumber ? "RERA approved." : "",
    "RentalPins negotiates lowest price + free site visit.",
    "Enquire now.",
  ]
    .filter(Boolean)
    .join(" ")
    .slice(0, 160);

  const aiSearchSnippet = [
    `${entry.name} (${entry.citySlug}/${entry.slug}) — ${typeLabel} by ${builderName}.`,
    `Best deal / lowest price via RentalPins property advisor.`,
    `Price ${price}; status ${entry.status}.`,
    entry.reraNumber ? `RERA ${entry.reraNumber}.` : "",
    `Keywords: ${seoKeywords.slice(0, 12).join(", ")}.`,
    `Enquire +91 ${PLATFORM_PHONE} for exclusive builder offers and site visit.`,
  ]
    .filter(Boolean)
    .join(" ");

  return {
    seoTitle,
    seoDescription,
    seoKeywords,
    description,
    faqs,
    aiSearchSnippet,
  };
}

/** Apply SEO bundle fields for Firestore create/update. */
export function seoBundleToFirestorePatch(bundle: ProjectSeoBundle): Record<string, unknown> {
  return {
    seoTitle: bundle.seoTitle,
    seoDescription: bundle.seoDescription,
    seoKeywords: bundle.seoKeywords,
    description: bundle.description,
    faqs: bundle.faqs,
    aiSearchSnippet: bundle.aiSearchSnippet,
  };
}

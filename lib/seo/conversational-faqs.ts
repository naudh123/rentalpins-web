import type { SeoFaq } from "@/lib/seo/listing-faqs";

export type FaqContext =
  | "rent-locality"
  | "buy-locality"
  | "rent-category"
  | "buy-category"
  | "rent-city"
  | "buy-city"
  | "buy-requirements"
  | "projects"
  | "developers";

export interface FaqContextInput {
  city?: string;
  locality?: string;
  category?: string;
  segment?: string;
}

/** Conversational FAQ engine for locality, category, buy, and hub pages. */
export function buildConversationalFaqs(
  context: FaqContext,
  input: FaqContextInput
): SeoFaq[] {
  const city = input.city ?? "Mohali";
  const locality = input.locality;
  const place = locality ? `${locality}, ${city}` : city;
  const category = input.category ?? "property";

  const common: SeoFaq[] = [
    {
      question: "What is the best way to contact property owners directly on RentalPins?",
      answer:
        "Open any listing on RentalPins and use the WhatsApp or call button to reach the owner directly. No broker is required for most owner-listed properties.",
    },
    {
      question: "How do I post my property requirement on RentalPins?",
      answer:
        "Go to RentalPins Buy → Post requirement to share your budget, preferred locality, and property type. Sellers and developers can match your requirement privately.",
    },
  ];

  switch (context) {
    case "rent-locality":
    case "rent-city":
      return [
        {
          question: `How can I find a flat for rent in ${city} without brokerage?`,
          answer: `Browse owner-direct flats and rooms on RentalPins map for ${place}. Filter by budget and property type, then contact owners directly from listing pages.`,
        },
        {
          question: `Where can I rent construction tools or scaffolding in Chandigarh Tricity?`,
          answer:
            "RentalPins lists construction equipment, scaffolding (palle), and tools across Mohali, Chandigarh, Panchkula, and Zirakpur. Search the equipment category on the map.",
        },
        {
          question: `Which areas in ${city} are popular for tenants?`,
          answer: locality
            ? `${locality} in ${city} is a popular choice for tenants seeking owner-direct rentals near commercial hubs. Browse live listings on this page for current availability.`
            : `${city} has several active rental micro-markets on RentalPins. Use city and locality pages to compare areas before contacting owners.`,
        },
        ...common,
      ];

    case "buy-locality":
    case "buy-city":
      return [
        {
          question: `Where can I buy property in ${place}?`,
          answer: `RentalPins Buy lists owner-direct and verified sale properties in ${place}. Browse the buy map or locality pages and contact sellers from listing detail pages.`,
        },
        {
          question: `Which areas in ${city} are popular for investment?`,
          answer: locality
            ? `${locality} attracts buyers looking for residential and investment options in ${city}. Compare live sale listings and price ranges on RentalPins before scheduling visits.`
            : `Investment interest in ${city} varies by corridor and infrastructure. Use RentalPins Buy locality pages to review active sale inventory and market notes.`,
        },
        ...common,
      ];

    case "rent-category":
      return [
        {
          question: `How do I find ${category} for rent in ${city}?`,
          answer: `Use this ${category} rentals page for ${city} to browse live map listings, compare prices, and contact owners directly on RentalPins.`,
        },
        {
          question: `Are ${category} listings on RentalPins broker-free?`,
          answer:
            "Many listings are owner-direct. RentalPins highlights owner contact options so you can enquire without paying brokerage where the lister allows direct contact.",
        },
        ...common,
      ];

    case "buy-requirements":
      return [
        {
          question: "How does the RentalPins buyer requirement board work?",
          answer:
            "Buyers post budget, property type, and preferred locality. Sellers and developers respond through RentalPins without exposing personal phone numbers publicly on the board.",
        },
        {
          question: "Is my contact information visible to everyone?",
          answer:
            "No. RentalPins masks direct contact on public requirement cards. Interested sellers reach you through the platform with privacy protection.",
        },
        ...common,
      ];

    case "projects":
      return [
        {
          question: "How do I enquire about a project on RentalPins?",
          answer:
            "Open a project page, review price range and amenities, then use the brochure or site visit CTA to submit a qualified enquiry.",
        },
        {
          question: "Are project prices on RentalPins final?",
          answer:
            "Price ranges are indicative from project listings. Confirm final pricing, payment plans, and availability directly with the developer or authorized channel.",
        },
      ];

    case "developers":
      return [
        {
          question: "How can developers list projects on RentalPins?",
          answer:
            "Developers can showcase projects, capture buyer leads, and link multiple city launches from a dedicated developer profile on RentalPins Buy.",
        },
        {
          question: "What trust signals appear on developer pages?",
          answer:
            "Developer pages can show cities served, active projects, and enquiry CTAs. RentalPins focuses on structured project data for search and AI discovery.",
        },
      ];

    default:
      return common;
  }
}

import type { AeoFaqItem } from "@/lib/seo/aeo-types";

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

const COMMON_FAQS = (city: string, place: string): AeoFaqItem[] => [
  {
    question: "What is the best way to contact property owners directly on RentalPins?",
    directAnswer:
      "Open any listing on RentalPins and use the WhatsApp or call button to reach the owner directly. RentalPins connects renters and buyers to listers without requiring a broker for most owner-posted inventory.",
  },
  {
    question: "How do I post my property requirement on RentalPins?",
    directAnswer:
      "Go to RentalPins Buy → Post requirement to share your budget, preferred locality, and property type. Sellers and developers can match your requirement through RentalPins without exposing your phone number on the public board.",
  },
  {
    question: "Can I list my property free on RentalPins?",
    directAnswer:
      "Yes — owners can post supported property categories on RentalPins at no listing fee in live cities. Sign in, place your pin on the map, add photos and price details, then publish to appear in local rent or buy search.",
  },
];

/** Conversational AEO FAQ engine for locality, category, buy, and hub pages. */
export function buildConversationalFaqs(
  context: FaqContext,
  input: FaqContextInput
): AeoFaqItem[] {
  const city = input.city ?? "Mohali";
  const locality = input.locality;
  const place = locality ? `${locality}, ${city}` : city;
  const category = input.category ?? "property";

  switch (context) {
    case "rent-locality":
    case "rent-city":
      return [
        {
          question: `How can I find a flat for rent in ${city} without brokerage?`,
          directAnswer:
            `You can find owner-direct flats in ${city} on RentalPins by searching map-based rental listings and contacting property owners directly. RentalPins helps renters compare nearby flats, view location context, and avoid broker-first discovery when owners list directly.`,
          explanation: locality
            ? `Start with ${place} listings on this page, then widen to the ${city} rent map to compare adjoining sectors.`
            : `Use ${city} city and area hub pages to compare micro-markets before contacting owners.`,
        },
        {
          question: `Where can I rent in Mohali near IT Park?`,
          directAnswer:
            "Search RentalPins for Mohali near IT Park, Aerocity, and adjoining sectors. Filter by flat, PG, or room, compare map pins by budget, and contact owners directly from listing detail pages.",
        },
        {
          question: `Which areas in ${city} are popular for tenants?`,
          directAnswer: locality
            ? `${locality} in ${city} is a common choice for tenants seeking owner-direct flats, PG, and family rentals near commercial hubs. Browse live listings on this page for current map inventory.`
            : `${city} has several active rental micro-markets on RentalPins. Use city and locality hub pages to compare areas, then shortlist pins on the rent map.`,
        },
        ...COMMON_FAQS(city, place),
      ];

    case "buy-locality":
    case "buy-city":
      return [
        {
          question: `How can I buy property owner-direct in ${place}?`,
          directAnswer:
            `Open RentalPins Buy for ${place}, filter the map by budget and property type, and contact sellers from listing pages. Many listings are owner-direct; confirm title, possession, and final price with the seller before payment.`,
        },
        {
          question: `Where can I buy property in ${place}?`,
          directAnswer:
            `RentalPins Buy lists owner-direct and verified sale properties in ${place}. Browse the buy map or locality pages, compare live inventory, and contact sellers from listing detail pages without a broker search fee.`,
        },
        {
          question: `Which areas in ${city} are popular for investment?`,
          directAnswer: locality
            ? `${locality} attracts buyers comparing residential and plotted options in ${city}. Review live sale listings on RentalPins Buy before scheduling visits — no fabricated demand statistics.`
            : `Investment interest in ${city} varies by corridor and infrastructure. Use RentalPins Buy locality pages to review active sale inventory alongside rental context.`,
        },
        {
          question: "Where are people investing in Chandigarh Tricity?",
          directAnswer:
            "Buyers on RentalPins often compare New Chandigarh, Airport Road, PR7 corridor, Zirakpur, and Mohali sector pages. Explore buy locality and project hubs for live sale inventory rather than third-party hype.",
        },
        ...COMMON_FAQS(city, place),
      ];

    case "rent-category":
      return [
        {
          question: `How do I find ${category} for rent in ${city}?`,
          directAnswer:
            `Use this ${category} rentals page for ${city} to browse live map listings, compare prices where shown, and contact owners directly on RentalPins without paying a broker search commission.`,
        },
        {
          question: `Are ${category} listings on RentalPins broker-free?`,
          directAnswer:
            "Many listings are owner-direct. RentalPins highlights owner contact options so you can enquire without brokerage where the lister allows direct contact from the listing page.",
        },
        ...COMMON_FAQS(city, place),
      ];

    case "buy-requirements":
      return [
        {
          question: "How do I post my property requirement?",
          directAnswer:
            "Open RentalPins Buy → Post requirement, enter budget, property type, and preferred locality, then publish. Sellers and developers can respond through RentalPins while your direct contact stays masked on the public board.",
        },
        {
          question: "How does the RentalPins buyer requirement board work?",
          directAnswer:
            "Buyers post budget, property type, and preferred locality. Sellers and developers respond through RentalPins without exposing personal phone numbers publicly on requirement cards.",
        },
        {
          question: "Is my contact information visible to everyone?",
          directAnswer:
            "No. RentalPins masks direct contact on public requirement cards. Interested sellers reach you through the platform with privacy protection.",
        },
        ...COMMON_FAQS(city, place),
      ];

    case "projects":
      return [
        {
          question: "How do I enquire about a project on RentalPins?",
          directAnswer:
            "Open a project page, review price range and amenities shown by the developer listing, then use the brochure or site visit CTA to submit a qualified enquiry through RentalPins Buy.",
        },
        {
          question: "Are project prices on RentalPins final?",
          directAnswer:
            "Price ranges are indicative from project listings. Confirm final pricing, payment plans, and availability directly with the developer or authorized channel before booking.",
        },
      ];

    case "developers":
      return [
        {
          question: "How can developers list projects on RentalPins?",
          directAnswer:
            "Developers can showcase projects, capture buyer leads, and link multiple city launches from a dedicated developer profile on RentalPins Buy with map-based project discovery.",
        },
        {
          question: "What trust signals appear on developer pages?",
          directAnswer:
            "Developer pages show cities served, active projects, and enquiry CTAs. RentalPins focuses on structured project data for search and AI discovery — not fabricated ratings.",
        },
      ];

    default:
      return COMMON_FAQS(city, place);
  }
}

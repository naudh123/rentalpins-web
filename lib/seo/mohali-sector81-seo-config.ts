export type MohaliCampusId = "isb" | "iiser" | "jlpl";

export interface MohaliCampusPgConfig {
  id: MohaliCampusId;
  slug: string;
  institutionName: string;
  placeName: string;
  browseHref: string;
  placeQuery: string;
  rentRange: string;
  demandProfile: "student" | "corporate" | "mixed";
  introArea: string;
  commuteNote: string;
  safetyNote: string;
  pgFilterLinks: { label: string; href: string }[];
  extraFaqs: { question: string; answer: string }[];
  nearbyRelatedSlugs: string[];
  nearbyLandmarks: string[];
  crossLinksTitle: string;
  industrialTraining: {
    title: string;
    paragraphs: string[];
    checklist: string[];
  };
}

export const MOHALI_SECTOR81_CROSS_LINKS = [
  { label: "PG near ISB Mohali", href: "/pg-near-isb-mohali" },
  { label: "PG near IISER Mohali", href: "/pg-near-iiser-mohali" },
  { label: "Sector 81 Mohali", href: "/cities/mohali/sector-81-mohali" },
  { label: "Chilla Mohali", href: "/cities/mohali/chilla-mohali" },
  { label: "JLPL industrial area", href: "/accommodation-near-jlpl-industrial-area" },
  { label: "Mohali rentals hub", href: "/rentals/mohali" },
  { label: "Sector 70 Mohali", href: "/rentals/mohali/sector-70" },
  { label: "Phase 7 Mohali", href: "/rentals/mohali/phase-7" },
] as const;

const SHARED_CHECKLIST = [
  "Confirm boys, girls or co-ed suitability with the owner.",
  "Compare Sector 81 walk time vs Chilla rent savings on the map.",
  "Inspect mess quality, bathroom sharing ratio and ventilation.",
  "Agree deposit refund rules and photograph room condition at handover.",
  "Message owners from RentalPins pins — avoid broker unlock fees.",
];

const INDUSTRIAL_TRAINING_CHECKLIST = [
  "Tell owners your industrial training start and end dates in the first WhatsApp.",
  "Ask if the PG accepts 3–6 month stays and pro-rata deposit refund if training ends early.",
  "Prioritise Chilla and Sector 81 fringe pins if your plant sits inside JLPL Industrial Area.",
  "Confirm mess timings align with factory shift hours — many trainees leave before hostel breakfast.",
  "Budget for bike or shared auto commute if your training site is not walkable from the room.",
  "For girls trainees, confirm curfew, visitor rules, and whether the building allows late shifts.",
];

const BASE_INDUSTRIAL_TRAINING = {
  title: "Industrial training students — housing near JLPL & Sector 81",
  paragraphs: [
    "Every year, engineering, diploma, and ITI students come to Mohali for industrial training at JLPL Industrial Area plants, logistics units, and adjoining factories. Most outstation trainees rent PG or shared rooms in Chilla, Sector 81 fringe, and Purv Marg pockets rather than near the IISER or ISB campuses.",
    "Training batches usually need 3–6 month stays with flexible move-in around college schedules — confirm session dates, notice period, and deposit refund with owners before paying advance rent.",
    "Budget PG with meals often beats cooking in a flat for short training stints — compare total monthly cost including commute, laundry, and Wi‑Fi on the Mohali map before shortlisting.",
  ],
  checklist: INDUSTRIAL_TRAINING_CHECKLIST,
};

export const MOHALI_CAMPUS_CONFIGS: Record<MohaliCampusId, MohaliCampusPgConfig> = {
  isb: {
    id: "isb",
    slug: "pg-near-isb-mohali",
    institutionName: "Indian School of Business (ISB)",
    placeName: "Sector 81 / ISB Mohali",
    browseHref: "/rentals/mohali",
    placeQuery: "ISB Mohali, Sector 81",
    rentRange: "₹10,000–₹28,000",
    demandProfile: "mixed",
    introArea: "ISB Mohali",
    commuteNote:
      "ISB students, visiting fellows, and industrial training trainees in the JLPL belt often rent in Sector 81, Sector 80, and along Purv Marg — compare map pin distance to your campus or training plant, not vague 'near ISB' titles.",
    safetyNote:
      "For girls PG and shared flats, confirm curfew, visitor rules and building security. Visit shortlisted pins in daylight before paying advance rent.",
    pgFilterLinks: [
      { label: "PG near ISB", href: "/pg-near-isb-mohali" },
      { label: "PG near IISER", href: "/pg-near-iiser-mohali" },
      { label: "Sector 81 Mohali", href: "/cities/mohali/sector-81-mohali" },
      { label: "Sector 80 Mohali", href: "/cities/mohali/sector-80-mohali" },
      { label: "Chilla Mohali", href: "/cities/mohali/chilla-mohali" },
      { label: "Furnished flats", href: "/rentals/in/chandigarh/mohali/flats" },
      { label: "AC PG", href: "/rentals/in/chandigarh/mohali/pg" },
      { label: "Food included PG", href: "/rentals/mohali" },
      { label: "Single room PG", href: "/rentals/mohali" },
      { label: "PG near IT Park", href: "/rentals/mohali" },
      { label: "Industrial training PG", href: "/accommodation-near-jlpl-industrial-area" },
      { label: "JLPL area rentals", href: "/accommodation-near-jlpl-industrial-area" },
    ],
    extraFaqs: [
      {
        question: "What is the average rent near ISB Mohali?",
        answer:
          "Typical PG and flat rent near ISB in Sector 81 ranges from ₹10,000–₹28,000/month depending on furnishing, AC, and food plan. Browse live Mohali map pins for current owner prices.",
      },
      {
        question: "Which areas are closest to ISB Mohali?",
        answer:
          "Sector 81, Sector 80, and Purv Marg belts are most searched — confirm auto or walk time on the map pin before paying deposit.",
      },
      {
        question: "Are furnished flats available near ISB?",
        answer:
          "Yes — many owner listings include basic furnishing. Confirm appliances, Wi‑Fi, and society rules with the owner before token.",
      },
      {
        question: "Can IISER students also use ISB-belt PG inventory?",
        answer:
          "Yes — Sector 81 inventory overlaps for ISB and IISER commuters. Compare pins by exact sector and daily commute on one Mohali map.",
      },
      {
        question: "Do students coming for industrial training near JLPL stay in this belt?",
        answer:
          "Yes — training students from engineering and diploma colleges commonly rent PG in Chilla and Sector 81 fringe near JLPL plants. Use the JLPL accommodation page and filter Mohali map pins by commute to your training site.",
      },
    ],
    nearbyRelatedSlugs: [
      "iiser-mohali",
      "sector-81-mohali",
      "sector-80-mohali",
      "chilla-mohali",
      "jlpl-industrial-area-mohali",
    ],
    nearbyLandmarks: ["IISER Mohali", "Sector 81", "Chilla", "JLPL Industrial Area"],
    crossLinksTitle: "ISB / Sector 81 belt — browse & list",
    industrialTraining: {
      ...BASE_INDUSTRIAL_TRAINING,
      paragraphs: [
        ...BASE_INDUSTRIAL_TRAINING.paragraphs,
        "Some ISB visitors and short-term programme participants also cross-shop JLPL-belt PG when their placement or project sits in the industrial corridor — compare both Knowledge City and Chilla pins on one map.",
      ],
    },
  },
  iiser: {
    id: "iiser",
    slug: "pg-near-iiser-mohali",
    institutionName: "IISER Mohali",
    placeName: "Sector 81 / IISER Mohali",
    browseHref: "/rentals/mohali",
    placeQuery: "IISER Mohali, Sector 81",
    rentRange: "₹8,000–₹18,000",
    demandProfile: "student",
    introArea: "IISER Mohali",
    commuteNote:
      "IISER students and research interns typically rent in Sector 81 and Chilla — industrial training students from other colleges often choose the same belt for JLPL plant commutes. Compare map pin distance to campus or your training gate.",
    safetyNote:
      "For girls PG and hostels, confirm curfew, warden contact, and security. Parents should visit shortlisted pins in one trip before semester deposit.",
    pgFilterLinks: [
      { label: "Boys PG near IISER", href: "/pg-near-iiser-mohali" },
      { label: "Girls PG near IISER", href: "/pg-near-iiser-mohali" },
      { label: "Hostels near IISER", href: "/pg-near-iiser-mohali" },
      { label: "Sector 81 Mohali", href: "/cities/mohali/sector-81-mohali" },
      { label: "Chilla Mohali", href: "/cities/mohali/chilla-mohali" },
      { label: "PG near ISB", href: "/pg-near-isb-mohali" },
      { label: "AC PG", href: "/rentals/in/chandigarh/mohali/pg" },
      { label: "Food included PG", href: "/rentals/mohali" },
      { label: "Double sharing PG", href: "/rentals/mohali" },
      { label: "Flats near IISER", href: "/rentals/in/chandigarh/mohali/flats" },
      { label: "Industrial training housing", href: "/accommodation-near-jlpl-industrial-area" },
      { label: "JLPL area PG", href: "/accommodation-near-jlpl-industrial-area" },
    ],
    extraFaqs: [
      {
        question: "What is the average PG rent near IISER Mohali?",
        answer:
          "Typical PG rent near IISER in Sector 81 and Chilla ranges from ₹8,000–₹18,000/month depending on sharing, AC, and food plan. Browse live Mohali map pins for current owner prices.",
      },
      {
        question: "Which areas are best for IISER students?",
        answer:
          "Sector 81 (campus belt), Chilla, and Sector 80 are common — confirm walk or auto time on the map pin before session deposit.",
      },
      {
        question: "Is food included in PG rent near IISER?",
        answer:
          "Many owners offer mess plans — confirm meals, laundry, Wi‑Fi and AC surcharges in your first WhatsApp before paying advance.",
      },
      {
        question: "Is Sector 81 safe for girls PG near IISER?",
        answer:
          "Shortlist girls PG with curfew and security rules, visit in daylight, and confirm warden or caretaker presence before paying semester deposit.",
      },
      {
        question: "Can industrial training students stay near IISER Sector 81?",
        answer:
          "Yes — many training students posted at JLPL Industrial Area rent PG in Chilla and Sector 81 fringe while attending plants nearby. Confirm 3–6 month stay rules with owners before deposit.",
      },
    ],
    nearbyRelatedSlugs: [
      "isb-mohali",
      "sector-81-mohali",
      "chilla-mohali",
      "jlpl-industrial-area-mohali",
    ],
    nearbyLandmarks: ["ISB Mohali", "Sector 81", "Chilla", "The Dugout Arena"],
    crossLinksTitle: "IISER / Sector 81 belt — browse & list",
    industrialTraining: BASE_INDUSTRIAL_TRAINING,
  },
  jlpl: {
    id: "jlpl",
    slug: "accommodation-near-jlpl-industrial-area",
    institutionName: "JLPL Industrial Area",
    placeName: "JLPL Industrial Area, Mohali",
    browseHref: "/rentals/mohali",
    placeQuery: "JLPL Industrial Area, Mohali",
    rentRange: "₹6,000–₹15,000",
    demandProfile: "mixed",
    introArea: "JLPL Industrial Area",
    commuteNote:
      "Industrial training students, factory staff, and professionals rent in Chilla, Sector 81 fringe, and JLPL-adjacent grids — compare map pin distance to your training plant or office gate.",
    safetyNote:
      "Inspect street access, building security, and water supply. Confirm electricity billing and notice period before paying token.",
    pgFilterLinks: [
      { label: "PG for industrial training", href: "/accommodation-near-jlpl-industrial-area" },
      { label: "Rooms near JLPL", href: "/accommodation-near-jlpl-industrial-area" },
      { label: "PG in Chilla", href: "/cities/mohali/chilla-mohali" },
      { label: "Sector 81 rentals", href: "/cities/mohali/sector-81-mohali" },
      { label: "PG near IISER", href: "/pg-near-iiser-mohali" },
      { label: "PG near ISB", href: "/pg-near-isb-mohali" },
      { label: "Mohali flats", href: "/rentals/in/chandigarh/mohali/flats" },
      { label: "Commercial rentals", href: "/rentals/in/chandigarh/mohali/commercial" },
    ],
    extraFaqs: [
      {
        question: "What rent should I budget near JLPL Industrial Area?",
        answer:
          "Typical room and PG rent near JLPL ranges from ₹6,000–₹15,000/month depending on sharing and utilities. Browse live Mohali map pins for current owner prices.",
      },
      {
        question: "Which localities are closest to JLPL?",
        answer:
          "Chilla, Sector 81 fringe, and Purv Marg-adjacent pockets are commonly searched — confirm commute on the map pin before deposit.",
      },
      {
        question: "Are family flats available near JLPL?",
        answer:
          "Yes — filter flats and independent houses on the Mohali map. Confirm society rules for bachelor tenants if applicable.",
      },
      {
        question: "I am an industrial training student — which PG is best near JLPL?",
        answer:
          "Start with Chilla and Sector 81 fringe pins closest to your plant on the map. Confirm 3–6 month stay, mess timings for shift work, and deposit refund before paying advance.",
      },
      {
        question: "Do training students from other cities find PG here easily?",
        answer:
          "Yes — JLPL belt sees seasonal demand when colleges send training batches. Save map searches two weeks before arrival and message owners with exact training dates.",
      },
    ],
    nearbyRelatedSlugs: ["chilla-mohali", "sector-81-mohali", "iiser-mohali", "isb-mohali"],
    nearbyLandmarks: ["Chilla", "Sector 81", "IISER Mohali", "Punjab Timbers & Plywood"],
    crossLinksTitle: "JLPL belt — browse & list",
    industrialTraining: {
      title: "Industrial training students near JLPL Industrial Area",
      paragraphs: [
        "JLPL Industrial Area is one of the main destinations for engineering, diploma, and ITI industrial training in Mohali. Outstation students typically rent budget PG or shared rooms in Chilla, Sector 81 fringe, and Purv Marg-adjacent lanes within auto or bike distance of their assigned plant.",
        "Training stays are usually 3–6 months — ask owners upfront about short-term rent, session deposit, and whether meals can be packed for early-morning shifts. Many PG owners in this belt are used to trainee batches from Punjab and neighbouring states.",
        "Girls trainees should shortlist PG with clear curfew and security rules, and visit with parents or college coordinators before paying advance. Boys batches often share triple rooms to split rent during training period.",
        "Compare JLPL-belt PG with Sector 81 student inventory only if your training site is walkable — otherwise prioritise map distance to the factory gate over headline rent alone.",
      ],
      checklist: INDUSTRIAL_TRAINING_CHECKLIST,
    },
  },
};

export { SHARED_CHECKLIST as MOHALI_CAMPUS_CHECKLIST };

export const MOHALI_CAMPUS_AI_QUESTIONS: Record<MohaliCampusId, string[]> = {
  isb: [
    "Which PG is best near ISB Sector 81?",
    "Do industrial training students stay in this belt?",
    "Is Chilla cheaper than Sector 81 for JLPL trainees?",
    "Are furnished flats available near ISB?",
    "Can I get a short-term PG for 3–6 months?",
    "How far is JLPL from Sector 81 on the map?",
    "Does RentalPins charge brokerage near ISB?",
  ],
  iiser: [
    "Which PG is best for girls near IISER?",
    "Can industrial training students find PG near Sector 81?",
    "Is food included in PG rent near IISER?",
    "Is Chilla safe for training students commuting to JLPL?",
    "Can I get a 3–6 month PG stay for training?",
    "What is average PG rent near IISER Mohali?",
    "Should I choose PG or hostel near IISER?",
  ],
  jlpl: [
    "Which PG is best for industrial training near JLPL?",
    "Can I get a 3–6 month PG stay for training?",
    "Is Chilla cheaper than Sector 81 for trainees?",
    "Is food included in PG rent near JLPL?",
    "Is this area safe for girls on industrial training?",
    "How far is JLPL from Sector 81 on the map?",
    "Should I choose PG or a shared room for training?",
  ],
};

export function campusIdFromSlug(slug: string): MohaliCampusId | null {
  if (slug === "pg-near-isb-mohali") return "isb";
  if (slug === "pg-near-iiser-mohali") return "iiser";
  if (slug === "accommodation-near-jlpl-industrial-area") return "jlpl";
  return null;
}

/** Area-config slug for campus-adjacent live listing fetch. */
export function mohaliCampusListingsAreaSlug(campus: MohaliCampusId): string {
  return campus === "jlpl" ? "chilla-mohali" : "sector-81-mohali";
}

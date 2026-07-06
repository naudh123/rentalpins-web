/**
 * Property sale agreements, deeds, ownership transfer & precautions — agent training.
 * RentalPins guides; qualified advocates execute registration (not legal advice).
 */

export type TransactionStage =
  | "overview"
  | "pre-deal"
  | "sale-agreement"
  | "sale-deed"
  | "transfer"
  | "post-registry"
  | "precautions"
  | "rentalpins";

export interface PropertyTransactionGuide {
  id: string;
  title: string;
  stage: TransactionStage;
  summary: string;
  steps: string[];
  keyDocuments: string[];
  precautions: string[];
  tricityNotes: string[];
  rentalPinsGuidance: string;
  tags: string[];
}

export const PROPERTY_TRANSACTION_GUIDES: PropertyTransactionGuide[] = [
  {
    id: "rentalpins-transaction-support",
    title: "How RentalPins guides you through sale agreements, deeds & transfer",
    stage: "rentalpins",
    summary:
      "RentalPins is your Tricity property discovery and transaction-guidance platform — map-first owner-direct buy/rent, AI advisor for step-by-step explainers on agreements, deeds, precautions, and due diligence checklists. We connect buyers with sellers; we do not register deeds or certify title.",
    steps: [
      "Discover owner-direct sale listings on the buy map (/buy/search) or projects hub",
      "Use Ask AI / Property Advisor to ask how sale agreements work, what a sale deed contains, or what to verify before token",
      "Follow curated checklists (title, society NOC, EC, site visits) — agent calls searchPropertyTransactionGuides",
      "Message seller from listing detail; negotiate terms with your advocate drafting documents",
      "Engage a local property lawyer/advocates for Agreement to Sell and Sale Deed drafting + SRO registration",
    ],
    keyDocuments: [
      "RentalPins does not hold your deed — your advocate prepares ATS and sale deed",
      "Use agent guidance list to request documents from seller before token",
    ],
    precautions: [
      "RentalPins AI is guidance, not a law firm — always use a qualified advocate for Punjab/Haryana/UT registration",
      "Never pay full consideration before verifying title and registration timeline in writing",
    ],
    tricityNotes: [
      "Tricity spans Chandigarh UT, Punjab (Mohali/Kharar), and Haryana (Panchkula/Zirakpur) — stamp duty and registration rules differ by state",
      "Agent can explain process; advocate confirms current stamp duty and jurisdiction (SRO Mohali, Panchkula, Chandigarh)",
    ],
    rentalPinsGuidance:
      "Tell users: 'RentalPins guides you end-to-end on discovery and what to check — sale agreement steps, sale deed registration, ownership transfer precautions. For drafting and registry, we recommend a Tricity property advocate; our AI walks you through questions to ask and documents to collect.'",
    tags: ["rentalpins", "guide", "support", "advisor", "ask ai", "platform"],
  },
  {
    id: "ownership-transfer-overview",
    title: "How property ownership is transferred in India (Tricity resale flow)",
    stage: "overview",
    summary:
      "Ownership transfer for resale property typically flows: token → Agreement to Sell (ATS) → due diligence → Sale Deed execution → Stamp duty + Registration at Sub-Registrar (SRO) → Physical possession → Society/RWA transfer (flats) or Mutation in revenue records (plots).",
    steps: [
      "1. Token / earnest money with written receipt and refund terms",
      "2. Agreement to Sell (ATS) — price, timeline, forfeiture, seller documents promised",
      "3. Buyer's advocate verifies title chain, EC, dues, approvals",
      "4. Sale Deed drafted — buyer & seller (or POA holder) sign before SRO",
      "5. Pay stamp duty + registration fee; SRO registers deed — buyer becomes recorded owner",
      "6. Handover possession, keys, original documents",
      "7. Society NOC & transfer (apartments) OR Mutation / Intkal (plots/land)",
    ],
    keyDocuments: [
      "Title chain (prior sale deeds / allotment)",
      "Encumbrance Certificate (EC)",
      "Property tax receipts",
      "Society NOC & no-dues (flats)",
      "Approved building plan / OC-CC (where applicable)",
      "Seller ID & photo; buyer PAN for registry",
    ],
    precautions: [
      "Transfer is complete only after registered Sale Deed — ATS alone does not pass title",
      "Match seller on deed with seller on RentalPins listing",
    ],
    tricityNotes: [
      "Mohali/Kharar registrations often at SAS Nagar district SROs; Panchkula at Haryana SRO; Chandigarh UT has separate registry offices",
      "GMADA plotted sectors may need development charge receipts at transfer",
    ],
    rentalPinsGuidance:
      "Use buildMapSearch to shortlist; then searchPropertyTransactionGuides for each stage. Offer /blog/property-due-diligence-checklist-tricity-buyers via searchKnowledge.",
    tags: ["ownership transfer", "registry", "sale deed", "process", "overview"],
  },
  {
    id: "sale-agreement-ats",
    title: "Sale Agreement / Agreement to Sell (ATS) — how it is made",
    stage: "sale-agreement",
    summary:
      "An Agreement to Sell (ATS) is a contract before the final Sale Deed — it binds seller to sell and buyer to buy on agreed terms, timeline, and document delivery. Usually stamped (lower duty than deed) and often notarized or registered depending on state practice and lender requirement.",
    steps: [
      "Buyer & seller agree price, payment schedule, possession date, and inclusions (fixtures, parking)",
      "Advocate drafts ATS referencing property description (survey/khasra, flat no., society, sector)",
      "Attach list of documents seller will deliver before deed (title chain, NOC, tax receipts)",
      "Define token adjustment, balance payment at registration, and penalty for default",
      "Sign with witnesses; pay stamp duty as applicable; optional registration for stronger enforceability",
    ],
    keyDocuments: [
      "Draft ATS with property schedule",
      "Seller title copies attached as annexures",
      "Payment receipts for token",
      "PAN of parties for TDS if applicable (high-value transactions)",
    ],
    precautions: [
      "Never sign blank ATS or vague property description — flat/plot boundaries must match registry records",
      "Include exit clause if title defect found during diligence",
      "Verify signatory is owner or valid registered POA — not plain GPA from abroad without adjudication",
    ],
    tricityNotes: [
      "Builder sales use builder-format ATS with RERA annexures — resale uses owner ATS via advocate",
      "Society flats: ATS should mention seller will obtain NOC before deed date",
    ],
    rentalPinsGuidance:
      "Explain ATS concepts; recommend advocate drafting. RentalPins does not generate ATS — agent provides checklist of clauses to insist on.",
    tags: ["sale agreement", "agreement to sell", "ats", "contract", "token"],
  },
  {
    id: "sale-deed-conveyance",
    title: "Sale Deed — drafting, stamp duty & registration",
    stage: "sale-deed",
    summary:
      "The Sale Deed (Conveyance Deed) is the instrument that transfers ownership — executed on stamp paper of requisite value, signed before the Sub-Registrar Office (SRO), and registered under the Registration Act. This is the legal milestone of ownership change.",
    steps: [
      "Advocate prepares Sale Deed after diligence clears — exact seller/buyer names, consideration, property description",
      "Calculate stamp duty + registration charges (Punjab/Haryana/UT rates — verify current notification)",
      "Book SRO appointment; parties (or registered POA holders) appear with ID",
      "Pay stamp duty (e-Stamp / SHCIL as per state); execute deed; biometrics & photos at SRO",
      "Registered deed returned — buyer should collect certified copies and original",
    ],
    keyDocuments: [
      "Final Sale Deed on stamp paper",
      "Prior title deeds shown at SRO",
      "EC, tax receipts, society NOC (flats)",
      "Passport photos, PAN, Aadhaar of parties",
      "Witness IDs",
    ],
    precautions: [
      "Consideration in deed must match actual payment trail — bank transfers preferred over cash",
      "Read deed aloud at SRO — verify flat/plot number, area, and boundary before signing",
      "Do not allow seller to keep original registered deed — buyer must receive it",
    ],
    tricityNotes: [
      "Stamp duty differs: Punjab (Mohali/Kharar), Haryana (Panchkula/Zirakpur), Chandigarh UT — agent must not quote exact % without 'verify current rate'",
      "Women co-owners may get stamp duty concessions in some states — confirm with advocate at time of deed",
    ],
    rentalPinsGuidance:
      "Guide on what a sale deed contains and registration steps; direct user to Tricity advocate for drafting. searchPropertyTransactionGuides + legal disclaimer.",
    tags: ["sale deed", "conveyance", "stamp duty", "registration", "sro", "registry"],
  },
  {
    id: "title-due-diligence",
    title: "Title verification & encumbrance — before token or deed",
    stage: "precautions",
    summary:
      "Buyer's advocate verifies the seller owns what they claim to sell — chain of title for 12–30 years, no mortgage/litigation on EC, matching revenue/plot records for land, and society records for flats.",
    steps: [
      "Collect prior sale deeds, allotment letter (GMADA/builder), or inheritance succession docs",
      "Apply Encumbrance Certificate from Sub-Registrar for property period",
      "Check property tax paid-up receipts and any municipal dues",
      "For flats: society share certificate, transfer register entry, no-dues",
      "Lawyer issues title opinion — proceed to ATS/deed only if clear (or defects remedied)",
    ],
    keyDocuments: ["Sale deed chain", "EC", "Khatauni/Jamabandi (plots/rural fringe)", "Allotment/CLU (GMADA)", "Probate/succession if inherited"],
    precautions: [
      "RentalPins listings are not title-verified — always independent lawyer check",
      "Joint family property needs all co-owner signatures",
      "Pending litigation — stay away unless lawyer structured settlement",
    ],
    tricityNotes: [
      "GMADA plots: match sector/allotment with physical site — fringe CLU plots need conversion proof",
      "Resale flats in Phase societies: check RWA transfer rules and parking allotment letter",
    ],
    rentalPinsGuidance:
      "Emphasize RentalPins discovers owners; buyer's advocate verifies title. Point to due diligence FAQ and blog checklist.",
    tags: ["title", "due diligence", "encumbrance", "ec", "lawyer", "verification"],
  },
  {
    id: "society-flat-transfer",
    title: "Apartment / society ownership transfer (NOC & internal records)",
    stage: "transfer",
    summary:
      "After registered Sale Deed, flats in cooperative/RWA societies need internal transfer — seller obtains NOC/no-dues, buyer pays transfer fee, share certificate updated, and maintenance account shifted.",
    steps: [
      "Buyer submits registered deed copy to society/RWA",
      "Seller clears maintenance & penalty dues; obtains NOC for transfer",
      "Pay society transfer charges as per bylaws",
      "Share certificate / membership updated in buyer name",
      "Lift access, parking sticker, and utility connections transferred",
    ],
    keyDocuments: ["Registered sale deed", "Society NOC", "No-dues certificate", "Share certificate", "Building plan approval copy"],
    precautions: [
      "Some societies restrict resale until possession + 1 year — check bylaws",
      "Pending litigation between seller and society blocks clean transfer",
      "Verify parking is legally allotted not just 'used'",
    ],
    tricityNotes: [
      "Phase 7/9/11 and VIP Road high-rises have formal transfer offices — factor 2–4 weeks after registry",
      "Under-construction: transfer may be builder endorsement on agreement until OC",
    ],
    rentalPinsGuidance:
      "Agent explains society transfer is post-registry step; RentalPins listing detail helps contact seller early about NOC timeline.",
    tags: ["society", "noc", "rwa", "apartment", "flat", "transfer", "phase"],
  },
  {
    id: "plot-mutation-gmada",
    title: "Plot / land — mutation & revenue records after registry",
    stage: "post-registry",
    summary:
      "For plots and independent houses, after Sale Deed registration the buyer applies for Mutation (Intkal) in revenue records and updates property tax in MC/GMADA name — proves ownership for utilities and future sale.",
    steps: [
      "Submit registered deed copy to tehsil/ MC / GMADA mutation window",
      "Pay mutation fee; revenue patwari updates records",
      "Apply property tax name change in MC Mohali / Panchkula / relevant authority",
      "For GMADA allottees: update GMADA records if procedure requires",
      "Retain mutation order for future sale chain",
    ],
    keyDocuments: ["Registered sale deed", "Previous jamabandi/mutation", "ID proof", "Affidavit as required"],
    precautions: [
      "Registry without mutation causes pain on next sale — complete within months",
      "Agricultural land requires CLU before residential use — mutation alone insufficient",
    ],
    tricityNotes: [
      "Kurali/Banur/outer belts: confirm CLU + registry both in order for mutation",
      "Chandigarh UT plots rare — mostly leasehold/resale flats with UT transfer rules",
    ],
    rentalPinsGuidance:
      "Explain mutation as buyer's post-registry task; recommend advocate handles with registry packet.",
    tags: ["mutation", "intkal", "plot", "gmada", "revenue", "property tax"],
  },
  {
    id: "token-money-precautions",
    title: "Token money & payment safety precautions",
    stage: "precautions",
    summary:
      "Token secures the deal before ATS — must be documented with clear refund/forfeit rules. Prefer bank transfer; avoid large cash; never pay majority consideration before registration except structured construction-linked payments for RERA projects.",
    steps: [
      "Issue token via cheque/UPI with written receipt naming property",
      "ATS should state token adjustable against consideration; refund if seller cannot deliver clean title",
      "Stage payments: token → ATS signing → pre-registration balance → remaining at SRO",
      "For builder: pay only to RERA escrow / designated account per agreement",
    ],
    keyDocuments: ["Token receipt", "ATS payment schedule", "Bank transfer proofs"],
    precautions: [
      "Cash beyond legal limits creates tax and enforceability issues",
      "No token to third party without verifying they are owner or authorized",
      "Beware pressure to 'pay today or lose deal' without document review",
    ],
    tricityNotes: ["Owner-direct RentalPins deals still need written token terms — platform does not hold escrow for resale"],
    rentalPinsGuidance:
      "RentalPins connects buyer & seller; payment terms are between parties with advocate-drafted ATS. Agent warns on token best practices.",
    tags: ["token", "payment", "precautions", "cash", "bank transfer", "escrow"],
  },
  {
    id: "power-of-attorney-risks",
    title: "Power of Attorney (POA) — when seller signs through attorney",
    stage: "precautions",
    summary:
      "If seller cannot appear at SRO, a registered Power of Attorney may authorize another to sign — GPA from abroad or old unregistered POAs are high risk. Buyer's advocate must verify POA is specific, registered, and not revoked.",
    steps: [
      "Ask why seller uses POA — legitimate if NRI or unwell with registered specific POA",
      "Verify POA registered at SRO and mentions this property and sale power",
      "Confirm donor (owner) is alive and has not revoked POA",
      "Prefer seller personal appearance at registration when possible",
    ],
    keyDocuments: ["Registered POA original", "Owner ID proof", "Revocation check affidavit"],
    precautions: [
      "General POA for 'all properties' is a red flag for resale purchase",
      "Litigation over POA validity can void buyer's title years later",
    ],
    tricityNotes: ["NRIs selling Tricity flats often use POA — extra lawyer scrutiny standard in Mohali/Panchkula practice"],
    rentalPinsGuidance:
      "Flag POA deals for mandatory advocate review; RentalPins does not validate POA authenticity.",
    tags: ["power of attorney", "poa", "nri", "precautions", "seller"],
  },
  {
    id: "builder-rera-transfer",
    title: "Under-construction & RERA projects — agreement & transfer",
    stage: "sale-agreement",
    summary:
      "Buying from builder on /projects uses Builder-Buyer Agreement (BBA) under RERA — not a simple owner ATS. Transfer before possession needs builder NOC, assignment deed, and RERA compliance; stamp duty on UDS/construction linked agreement.",
    steps: [
      "Verify RERA registration on state portal — match project on RentalPins",
      "Review BBA payment plan, possession date, penalty clauses, and escrow account",
      "On resale of under-construction unit: builder assignment/transfer fee + NOC",
      "At possession: OC/CC, final registry of UDS or conveyance as applicable",
    ],
    keyDocuments: ["RERA cert", "BBA", "Allotment letter", "Payment receipts to escrow", "Builder NOC for assignment"],
    precautions: [
      "Do not pay builder outside RERA-designated account",
      "Delay possession — check RERA compensation clauses",
      "Resale assignment without builder NOC is void against builder",
    ],
    tricityNotes: [
      "Tricity projects on RentalPins /buy/projects — agent uses searchProjects + transaction guide",
      "Mix of Punjab RERA (PBRERA) projects across Mohali/Zirakpur/Kharar belts",
    ],
    rentalPinsGuidance:
      "RentalPins projects hub + Project Concierge for builder enquiries; separate guide from owner resale ATS/deed flow.",
    tags: ["rera", "builder", "under construction", "bba", "assignment", "project"],
  },
  {
    id: "tds-and-tax-notes",
    title: "TDS on property & basic tax notes (buyer/seller awareness)",
    stage: "precautions",
    summary:
      "High-value property sales may trigger TDS u/s 194-IA (buyer deducts and deposits if consideration exceeds statutory threshold), capital gains for seller, and GST generally not on ready resale flats (may apply on under-construction builder sales). Agent explains awareness only — CA handles filing.",
    steps: [
      "Ask advocate/CA if TDS deduction applies to your deal value",
      "Buyer obtain TDS certificate if deducted",
      "Seller plan capital gains with CA before pricing",
      "Keep all payment proofs for IT scrutiny",
    ],
    keyDocuments: ["PAN of parties", "Form 26QB / TDS challan if applicable", "Sale deed consideration figure"],
    precautions: ["Do not skip TDS when legally required — buyer can face penalty", "Under-reporting consideration in deed is illegal"],
    tricityNotes: ["Same rules apply across Tricity; threshold and rates are central — verify current Finance Act"],
    rentalPinsGuidance:
      "Mention tax topics exist; refer to CA. RentalPins does not provide tax filing services.",
    tags: ["tds", "tax", "capital gains", "194-ia", "precautions"],
  },
];

function guideBlob(g: PropertyTransactionGuide): string {
  return [
    g.id,
    g.title,
    g.stage,
    g.summary,
    ...g.steps,
    ...g.keyDocuments,
    ...g.precautions,
    ...g.tricityNotes,
    g.rentalPinsGuidance,
    ...g.tags,
  ]
    .join(" ")
    .toLowerCase();
}

export function searchPropertyTransactionGuides(
  query: string,
  limit = 4
): PropertyTransactionGuide[] {
  const q = query.trim().toLowerCase();
  if (!q) {
    return [
      PROPERTY_TRANSACTION_GUIDES.find((g) => g.id === "rentalpins-transaction-support")!,
      PROPERTY_TRANSACTION_GUIDES.find((g) => g.id === "ownership-transfer-overview")!,
      ...PROPERTY_TRANSACTION_GUIDES.filter(
        (g) => g.id !== "rentalpins-transaction-support" && g.id !== "ownership-transfer-overview"
      ).slice(0, 2),
    ].slice(0, limit);
  }

  const scored = PROPERTY_TRANSACTION_GUIDES.map((guide) => {
    let score = 0;
    const blob = guideBlob(guide);
    if (guide.id.includes(q) || blob.includes(q)) score += 4;
    for (const token of q.split(/\s+/)) {
      if (token.length > 2 && blob.includes(token)) score += 1;
    }
    if (/\bsale agreement|agreement to sell|ats\b/i.test(q) && guide.stage === "sale-agreement") score += 6;
    if (/\bsale deed|registry|registration|sro\b/i.test(q) && guide.stage === "sale-deed") score += 6;
    if (/\btransfer|ownership|mutation|noc\b/i.test(q) && (guide.stage === "transfer" || guide.stage === "overview"))
      score += 4;
    if (/\bprecaution|token|fraud|poa\b/i.test(q) && guide.stage === "precautions") score += 4;
    if (/\brentalpins|guide|help\b/i.test(q) && guide.stage === "rentalpins") score += 5;
    return { guide, score };
  });

  return scored
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((s) => s.guide);
}

export function formatTransactionGuide(g: PropertyTransactionGuide): Record<string, unknown> {
  return {
    id: g.id,
    title: g.title,
    stage: g.stage,
    summary: g.summary,
    steps: g.steps,
    keyDocuments: g.keyDocuments,
    precautions: g.precautions,
    tricityNotes: g.tricityNotes,
    rentalPinsGuidance: g.rentalPinsGuidance,
    tags: g.tags,
    disclaimer:
      "Educational guidance from RentalPins AI — not legal advice. Engage a qualified property advocate for drafting and registration.",
  };
}

export function formatPropertyTransactionBrief(): string {
  return `## Sale agreements, deeds & ownership transfer (use \`searchPropertyTransactionGuides\`)
**RentalPins guides you** on discovery + what to check at each step; **your advocate** drafts ATS/Sale Deed and registers at SRO.
1. **Flow:** Token → Agreement to Sell → title diligence → Sale Deed → stamp duty & SRO registration → possession → Society NOC (flats) / Mutation (plots).
2. **Sale Agreement (ATS):** Contract before deed — price, timeline, documents; advocate-drafted; RentalPins explains clauses, does not generate ATS.
3. **Sale Deed:** Registered conveyance at Sub-Registrar — ownership legally transfers; verify stamp duty for Punjab/Haryana/UT with advocate.
4. **Precautions:** EC & title chain, society NOC, token receipts, bank payments, POA scrutiny, no full payment before clean title.
5. **RentalPins role:** Buy map owner-direct, Ask AI walkthrough, due diligence checklists, blog/searchKnowledge depth — not a law firm, not title insurer.
Always add: recommend Tricity property lawyer for execution; never invent stamp duty rates.`;
}

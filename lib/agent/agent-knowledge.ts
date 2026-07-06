/**
 * Structured agent training data — FAQs, qualification playbooks, routing, and handoffs.
 * Pattern aligned with RudderTech agent-knowledge (keyword search + rule-based routing).
 */

import { appPath } from "@/lib/config";
import type { AgentSurface } from "./types";

export interface AgentKnowledgeEntry {
  id: string;
  category: string;
  title: string;
  content: string;
  url?: string;
  tags: string[];
  /** Boost in search when matched */
  priority?: boolean;
}

export const agentKnowledgeCategories = [
  "platform",
  "rent",
  "buy",
  "invest",
  "due-diligence",
  "objections",
  "qualification",
  "developer",
  "student",
  "legal",
] as const;

export const agentFaqs: AgentKnowledgeEntry[] = [
  {
    id: "platform-owner-direct",
    category: "platform",
    title: "Is RentalPins brokerage-free for tenants and buyers?",
    content:
      "RentalPins is map-first owner-direct discovery. Tenants browse rent and buy inventory without a tenant-side search commission. Buyers message sellers from map pins. Sellers activate listings via Razorpay — there is no paywall to search. Always verify title, society NOC, and possession on site before paying token money.",
    url: "/about",
    tags: ["platform", "brokerage", "fees", "owner-direct"],
    priority: true,
  },
  {
    id: "platform-vs-portals",
    category: "objections",
    title: "How is RentalPins different from 99acres or MagicBricks?",
    content:
      "National portals optimize for broker inventory and lead resale. RentalPins is Tricity-first with a live map, semantic NL filters, dual rent/buy themes, buyer requirements board, projects hub, and AI agents trained on local guides — not generic nationwide spam leads. Best for users who want map context and owner-direct messaging in Chandigarh Tricity.",
    tags: ["objections", "competitors", "99acres", "magicbricks", "broker"],
    priority: true,
  },
  {
    id: "platform-ai-agent",
    category: "platform",
    title: "What can the RentalPins AI property agent do?",
    content:
      "The agent compares Tricity areas, builds filtered map URLs from plain English, samples live listings, searches buy projects and guides, answers FAQs, estimates affordability, and routes buyers to post requirements. On /developers it explains the white-label PropTech stack Rudder Tech builds. It does not replace legal, tax, or home-loan advice.",
    url: "/advisor",
    tags: ["ai", "agent", "advisor", "copilot"],
  },
  {
    id: "rent-pg-students",
    category: "student",
    title: "PG and hostels near Chandigarh University",
    content:
      "Heavy PG demand sits on the Kharar–Landran corridor and Kharar town. Use rent map with PG filters, or search rent guides for Kharar and Chandigarh University area. Compare food plan, AC, curfew, and walk distance before paying deposit. Parents should visit once before long-term booking.",
    url: "/rentals/kharar",
    tags: ["pg", "hostel", "student", "cu", "kharar", "chandigarh university"],
    priority: true,
  },
  {
    id: "rent-mohali-professionals",
    category: "rent",
    title: "Best Mohali areas for working professionals",
    content:
      "IT Park, Aerocity, Phase 7, Phase 8, and Sector 70 are commonly searched for furnished flats and PG. Airport Road corridor suits frequent flyers. Use rent map filters for furnished, parking, and budget. Cross-check society maintenance and power backup on listing detail.",
    url: "/rentals/mohali",
    tags: ["mohali", "rent", "it park", "aerocity", "phase 7", "professional"],
  },
  {
    id: "buy-mohali-family",
    category: "buy",
    title: "Mohali buy corridors for end-user families",
    content:
      "Phase 7, Phase 9, Phase 11, Sector 70, and Aerocity attract family end-users. New Chandigarh sectors suit newer inventory and plotted growth. Compare resale liquidity vs greenfield appreciation. Use buy map with BHK and budget filters, then read area guide FAQs before site visits.",
    url: "/buy/mohali",
    tags: ["mohali", "buy", "family", "3bhk", "phase"],
    priority: true,
  },
  {
    id: "buy-zirakpur-invest",
    category: "invest",
    title: "Zirakpur vs Mohali for rental yield",
    content:
      "Zirakpur VIP Road and Gazipur belts see strong commuter rental demand from Chandigarh. Mohali IT Park and Aerocity command premium rents from professionals. Yield depends on all-in cost (stamp, GST on under-construction, maintenance). Compare live rent pins near your target buy micro-market before assuming ROI.",
    url: "/buy/zirakpur",
    tags: ["zirakpur", "mohali", "invest", "yield", "rental", "roi"],
    priority: true,
  },
  {
    id: "outer-kurali-banur-belt",
    category: "buy",
    title: "Kurali, Banur, and Kharar–Banur GMADA belt — who should buy or rent?",
    content:
      "Kurali (northwest of Kharar on NH-205) suits budget plot buyers and GMADA expressway townships. Banur and Kharar–Banur Road suit affordable plots and student-adjacent rent near Chitkara/Landran. GMADA sectors 115/127 sit mid-corridor with mixed premium and entry projects. Use searchTricityAreas for profiles, then buy map with corridor-centred search. Verify layout approval and road access on site.",
    url: "/buy/kharar",
    tags: ["kurali", "banur", "gmada", "plots", "outer", "kharar", "buy", "invest"],
    priority: true,
  },
  {
    id: "outer-chunni-rajpura",
    category: "student",
    title: "Jhanjeri, Chunni, Rajpura, and Banur — Landran–Chunni student belt",
    content:
      "Jhanjeri on Landran–Chunni road is an emerging student hub with growing PG/hostel inventory between Landran and Chunni — popular for CU, CGC Landran, and Chitkara-belt students seeking newer options below Kharar town rents. Chunni Kalan, Rajpura, and Banur form the budget fringe further east/south. Compare food plan, curfew, and campus ride time on the rent map. Use searchTricityAreas for Jhanjeri/Chunni profiles and map centres.",
    tags: [
      "jhanjeri",
      "chunni",
      "chunni kalan",
      "landran chunni",
      "rajpura",
      "banur",
      "chitkara",
      "pg",
      "student",
      "outer",
    ],
    priority: true,
  },
  {
    id: "outer-derabassi-lalru",
    category: "rent",
    title: "Derabassi and Lalru — NH corridor worker and entry buy market",
    content:
      "Derabassi (Dera Bassi) on the Ambala–Chandigarh NH suits budget flats for industrial workers and entry buyers who accept highway commute. Lalru is industrial fringe beyond Derabassi — worker rooms, not family premium. Compare with Zirakpur if Chandigarh commute matters. Use rent/buy map centred on Derabassi via buildMapSearch after searchTricityAreas.",
    tags: ["derabassi", "dera bassi", "lalru", "nh", "affordable", "outer", "rent", "buy"],
  },
  {
    id: "buy-due-diligence",
    category: "due-diligence",
    title: "Buyer due diligence checklist (Tricity resale)",
    content:
      "Verify: sale deed chain, encumbrance certificate, society NOC/transfer rules, outstanding dues, approved building plans, RERA registration for projects, and actual carpet vs super area. For under-construction — escrow, milestone-linked payments, and possession timeline in writing. Use buyer requirements board if no exact listing match.",
    url: "/blog/buy",
    tags: ["due diligence", "rera", "legal", "buyer", "checklist"],
    priority: true,
  },
  {
    id: "buy-requirements-board",
    category: "buy",
    title: "How does the buyer requirements board work?",
    content:
      "Buyers post structured demand (city, budget, BHK, notes) on /buy/requirements/post after sign-in. Sellers and owners browse active demand on /buy/requirements. The agent can draft a requirement summary — user must sign in to publish. Good when map search has no exact match yet.",
    url: "/buy/requirements",
    tags: ["buyer", "requirement", "demand", "board"],
  },
  {
    id: "sell-list-property",
    category: "buy",
    title: "How do owners list for sale on RentalPins?",
    content:
      "Owners post at /buy/post with map pin, photos, price, and BHK. Listing activation uses Razorpay. Accurate society, phase, and sector in the title improves map discovery. AI listing improve helps polish descriptions. Resale and project inventory both appear on the gold buy map.",
    url: "/buy/post",
    tags: ["sell", "list", "owner", "post"],
  },
  {
    id: "invest-tricity-framework",
    category: "invest",
    title: "How to pick the best Tricity investment (yield vs appreciation)",
    content:
      "First qualify: monthly yield goal vs 5–10 year appreciation, budget in lakh, and tenant type (professional, student PG, family). Yield leaders: Mohali Aerocity/Phase belts (professionals), Zirakpur VIP (commuters), Kharar–CU and Jhanjeri (student PG if compliant). Appreciation/long-hold: New Chandigarh plots, Kurali–Banur GMADA. Under ₹40L → outer plots/fringe flats; ₹40–90L → 2 BHK Zirakpur/Phase 9; ₹1Cr+ → Aerocity/Phase 7/projects. Always cross-check buy map sale pins AND rent map comps — use searchTricityInvestments tool. Never guarantee ROI.",
    url: "/buy/mohali-investment-guide",
    tags: ["invest", "yield", "appreciation", "tricity", "framework", "best investment"],
    priority: true,
  },
  {
    id: "invest-budget-bands-tricity",
    category: "invest",
    title: "Tricity investment by budget band (indicative)",
    content:
      "Under ₹40L: Kurali/Banur GMADA plots, Jhanjeri/Derabassi fringe flats, Kharar resale 1–2 BHK — higher diligence, slower liquidity. ₹40–90L: Zirakpur VIP 2 BHK, Mohali Phase 9/11 resale, Kharar investor flats — balanced yield and exit. ₹90L–₹1Cr: Phase 7, Aerocity entry, Panchkula sectors. ₹1Cr+: Aerocity premium, New Chandigarh plots/villas, top projects on /projects. Filter live buy map — bands shift with inventory.",
    tags: ["invest", "budget", "40 lakh", "90 lakh", "1 crore", "tricity"],
    priority: true,
  },
  {
    id: "invest-student-vs-professional",
    category: "invest",
    title: "Student PG yield vs professional rental yield in Tricity",
    content:
      "Professional yield: furnish 2 BHK in Aerocity, Phase 7/9, or VIP Zirakpur — fewer tenants, higher ticket, society rules simpler. Student PG yield: Kharar town, Jhanjeri/Landran–Chunni, Banur/Chitkara belt — higher gross potential per sq ft but needs PG operator model, RWA compliance, and session vacancy planning. Compare rent map PG density before buying. searchTricityInvestments returns playbooks for both.",
    tags: ["invest", "pg", "student", "professional", "yield", "kharar", "jhanjeri", "aerocity"],
    priority: true,
  },
  {
    id: "planning-it-park-vs-it-city",
    category: "buy",
    title: "Mohali IT Park vs IT City — critical difference for buyers",
    content:
      "Mohali IT Park (Rajiv Gandhi Technology Park) is the legacy STPI tech campus belt near Sector 67 / Phase 11 with Infosys, DLF IT Park — office campuses. IT City Mohali is GMADA's Sector 82A/83 Alpha/JLPL belt near Aerocity and airport — residential plots and towers. Professionals often work in IT Park but buy/rent in Phase 7/9, Aerocity, or IT City residential. Agents must clarify commute vs purchase zone; use searchTricityPlanning.",
    tags: ["it park", "it city", "jlpl", "sector 82", "aerocity", "stpi", "planning"],
    priority: true,
  },
  {
    id: "planning-psiec-industrial",
    category: "buy",
    title: "PSIEC industrial estates vs residential buying",
    content:
      "PSIEC (Punjab Small Industries & Export Corporation) develops industrial focal points and estates — e.g. SIEL Rajpura NH-44, Tepla Road Banur, MK Technology Park Landran–Banur. These are for MSME, warehouse, and manufacturing — not family residential. Do not confuse with Ludhiana locality name 'Focal Point'. Residential investors should use GMADA/MC residential sectors instead. searchTricityPlanning for estate examples.",
    tags: ["psiec", "industrial", "warehouse", "siel", "rajpura", "banur", "planning"],
    priority: true,
  },
  {
    id: "planning-mc-limits-gmada",
    category: "due-diligence",
    title: "MC limits vs GMADA fringe — what buyers must verify",
    content:
      "Inside MC Chandigarh/Mohali/Panchkula/Kharar/Zirakpur limits: municipal property tax, bylaws, and utilities apply. Outside MC on GMADA or panchayat fringe (Jhanjeri, Chunni, Kurali extensions): CLU and layout approval matter more. Ask seller which MC or authority sanctions building plans. Cheap plotted deals often sit outside MC — not automatically illegal but higher diligence. searchTricityPlanning for MC limits topic.",
    tags: ["mc limits", "municipal corporation", "gmada", "clu", "planning", "due diligence"],
    priority: true,
  },
  {
    id: "planning-mixed-use-sco",
    category: "buy",
    title: "Mixed-use townships and SCO plots in Tricity",
    content:
      "Mixed-use RERA projects combine residential with commercial SCO/high-street (Velora Urbano Banur, TDI City, Emaar Hills, Homeland Sector 75, VIP Zirakpur retail). Verify commercial unit is legally demarcated in RERA — not a ground-floor flat converted to shop. SCO investors check FAR, parking, and MC trade licence path. searchTricityPlanning mixed-use topic.",
    tags: ["mixed use", "sco", "commercial", "township", "planning", "rera"],
  },
  {
    id: "invest-new-chandigarh",
    category: "invest",
    title: "New Chandigarh sectors — growth vs liquidity",
    content:
      "New Chandigarh (sectors 115–120 belt) offers newer inventory and infrastructure growth but thinner resale depth than established Phase 7/11. Compare project towers on /buy/projects with live resale comps on the buy map. Investors should model 5–7 year horizon and tenant profile (family vs student).",
    url: "/buy/mohali/new-chandigarh",
    tags: ["new chandigarh", "invest", "sector 115", "growth"],
  },
  {
    id: "objection-broker-needed",
    category: "objections",
    title: "Do I still need a broker on RentalPins?",
    content:
      "Many owners list directly. You may still want a lawyer for deed review or a valuer for large transactions. RentalPins does not block broker-assisted deals — it removes the platform-imposed search commission. For society transfer, use RWA guidelines and advocate for registration.",
    tags: ["objections", "broker", "lawyer"],
  },
  {
    id: "qualify-rent-vs-buy",
    category: "qualification",
    title: "Qualification: rent vs buy decision framework",
    content:
      "Ask: (1) tenure in Tricity — under 2 years often favours rent; (2) stable income for EMI + maintenance; (3) down payment ready; (4) family schooling and commute anchors. Renters → rent map + rent guides. Buyers → area compare + buy map. Investors → yield compare + projects hub.",
    tags: ["qualification", "rent", "buy", "framework"],
    priority: true,
  },
  {
    id: "qualify-budget-bands",
    category: "qualification",
    title: "Typical Tricity budget bands (indicative, verify on map)",
    content:
      "Rent: PG ₹5k–15k; 1–2 BHK ₹12k–35k depending on furnishing and micro-market. Buy resale: entry 2 BHK ~₹35L–55L in peripheral belts; ₹60L–1.2Cr in prime Mohali/Panchkula sectors; premium Aerocity higher. Always filter live map — these bands shift with inventory.",
    tags: ["qualification", "budget", "lakh", "rent", "price"],
    priority: true,
  },
  {
    id: "developer-white-label",
    category: "developer",
    title: "White-label PropTech — what Rudder Tech ships",
    content:
      "RentalPins is the reference build: dual rent/buy maps, Google Maps + Places, Firebase auth and Firestore, Razorpay monetization, buyer requirements, projects hub, AI property agent (tools + lead scoring), Flutter mobile parity, SEO hub pages, and admin analytics. Custom branding, regions, and modules per client.",
    url: "/developers",
    tags: ["developer", "white-label", "proptech", "rudder"],
    priority: true,
  },
  {
    id: "developer-pricing-tiers",
    category: "developer",
    title: "PropTech build engagement models (indicative)",
    content:
      "Discovery sprint (2–4 weeks): scope map UX, data model, and AI agent modules. MVP portal (8–12 weeks): branded maps + listing flows + auth. Enterprise program: multi-city, CRM hooks, custom agent tools, mobile apps, analytics. Book strategy call at Rudder Tech for firm quotes — mention RentalPins showcase.",
    url: "/developers#contact",
    tags: ["developer", "pricing", "mvp", "enterprise", "budget"],
    priority: true,
  },
  {
    id: "developer-ai-module",
    category: "developer",
    title: "AI agent module for real estate portals",
    content:
      "Includes: curated knowledge over hubs/projects/blog, tool-calling (map search, listings, compare), lead scoring, Firestore conversation logging, email alerts on high intent, admin metrics dashboard, and Flutter non-streaming turn API. Can extend with RAG over your inventory CMS and CRM handoff.",
    url: "/developers",
    tags: ["developer", "ai", "agent", "rag", "leads"],
  },
  {
    id: "legal-disclaimer",
    category: "legal",
    title: "Legal and financial disclaimer",
    content:
      "RentalPins AI guides discovery and explains sale agreements, deeds, transfer steps, and precautions — but is not a law firm. Engage a qualified Tricity property advocate for ATS/sale deed drafting, stamp duty, and Sub-Registrar registration. Title verification, RERA, and tax (TDS/capital gains) require lawyers and CAs. Verify all prices on live map pins.",
    tags: ["legal", "disclaimer", "advice", "sale deed", "sale agreement"],
  },
  {
    id: "txn-rentalpins-guidance",
    category: "legal",
    title: "Does RentalPins help with sale agreements and sale deeds?",
    content:
      "Yes — RentalPins guides you: find owner-direct listings on the buy map, use Ask AI for step-by-step explainers on Agreement to Sell, Sale Deed registration, society NOC, mutation, and token precautions. We provide due diligence checklists and blog resources. Your advocate drafts and registers documents at SRO — RentalPins does not execute registry or certify title. Use searchPropertyTransactionGuides in chat.",
    url: "/blog/property-due-diligence-checklist-tricity-buyers",
    tags: ["sale agreement", "sale deed", "transfer", "rentalpins", "guide", "legal", "registry"],
    priority: true,
  },
  {
    id: "txn-sale-agreement-steps",
    category: "legal",
    title: "How is a sale agreement (Agreement to Sell) made?",
    content:
      "After token, a property advocate drafts the Agreement to Sell (ATS) with price, payment schedule, possession date, and documents seller must deliver. It is stamped and signed by both parties — it commits to the future Sale Deed but does not alone transfer ownership. RentalPins AI explains typical clauses and precautions; advocate drafts the actual ATS. Never sign without property schedule matching registry records.",
    tags: ["sale agreement", "ats", "agreement to sell", "token", "legal"],
    priority: true,
  },
  {
    id: "txn-sale-deed-registration",
    category: "legal",
    title: "How is a sale deed written and registered?",
    content:
      "After title diligence, advocate drafts the Sale Deed with buyer/seller names, consideration, and property description on stamp paper. Parties appear at Sub-Registrar Office (SRO), pay stamp duty and registration fee (Punjab/Haryana/UT rates — verify current), execute deed, and receive registered copy — this transfers legal ownership. RentalPins guides the process; SRO registration is done by your advocate, not the platform.",
    tags: ["sale deed", "registration", "sro", "stamp duty", "registry", "conveyance"],
    priority: true,
  },
  {
    id: "txn-ownership-transfer-precautions",
    category: "legal",
    title: "Ownership transfer precautions for Tricity buyers",
    content:
      "Before token: verify title chain, Encumbrance Certificate, society NOC path, property tax, and seller ID matches listing. At ATS: clear payment schedule and refund if title fails. At deed: bank payments, read deed at SRO, collect original registered deed. After registry: society transfer (flats) or mutation (plots). Beware unregistered POA sellers and industrial-zoned plots sold as residential. RentalPins lists owners — your lawyer verifies title.",
    url: "/blog/property-due-diligence-checklist-tricity-buyers",
    tags: ["ownership transfer", "precautions", "due diligence", "noc", "mutation", "buyer"],
    priority: true,
  },
  {
    id: "map-nl-search",
    category: "platform",
    title: "Natural language map search",
    content:
      "Users can type plain English on the advisor, map copilot, or agent chat — e.g. '3BHK under 80 lakh Phase 7 with parking'. The agent calls buildMapSearch which parses filters and returns a deep link to /buy/search or /search with query params applied.",
    tags: ["map", "nl", "search", "filters", "ai"],
  },
  {
    id: "mobile-flutter",
    category: "platform",
    title: "Flutter mobile app parity",
    content:
      "RentalPins Flutter app shares Firebase project with web — same listings, auth, and property agent via /api/agent/turn. Developers evaluating white-label should ask about App Store / Play release and push notification hooks.",
    tags: ["flutter", "mobile", "app"],
  },
];

function scoreKnowledgeEntry(entry: AgentKnowledgeEntry, query: string): number {
  const q = query.trim().toLowerCase();
  if (!q) return entry.priority ? 2 : 1;

  let score = 0;
  const blob = `${entry.title} ${entry.content} ${entry.tags.join(" ")} ${entry.category}`.toLowerCase();

  if (entry.priority) score += 2;
  if (blob.includes(q)) score += 4;
  for (const token of q.split(/\s+/)) {
    if (token.length > 2 && blob.includes(token)) score += 1;
    if (entry.tags.some((t) => t.includes(token) || token.includes(t))) score += 2;
  }
  return score;
}

export function searchAgentFaqs(query: string, limit = 5): AgentKnowledgeEntry[] {
  const q = query.trim();
  if (!q) {
    return agentFaqs.filter((e) => e.priority).slice(0, limit);
  }

  return agentFaqs
    .map((entry) => ({ entry, score: scoreKnowledgeEntry(entry, q) }))
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((s) => s.entry);
}

export interface PropertyPathRecommendation {
  intent: "rent" | "buy" | "invest" | "sell" | "developer" | "explore";
  primaryPath: string;
  secondaryPaths: { label: string; path: string }[];
  nextStep: string;
  qualificationQuestions: string[];
  reasoning: string;
}

export function recommendPropertyPath(params: {
  need: string;
  budget?: string;
  timeline?: string;
  areas?: string[];
  surface?: AgentSurface;
}): PropertyPathRecommendation {
  const need = params.need.toLowerCase();
  const budget = (params.budget ?? "").toLowerCase();
  const combined = `${need} ${budget}`;

  const isRent =
    /\b(rent|rental|pg|hostel|lease|tenant|furnished monthly|₹\s*\d+k\s*per month)\b/i.test(combined) &&
    !/\b(buy|purchase|sale|invest|crore)\b/i.test(need);
  const isSell = /\b(sell|list my|post property|owner listing)\b/i.test(need);
  const isInvest = /\b(invest|investment|roi|yield|appreciation|portfolio)\b/i.test(combined);
  const isDeveloper =
    /\b(white.?label|build.*platform|proptech|portal|developer client|our brokerage|our brand)\b/i.test(
      need
    ) || params.surface === "showcase";

  if (isDeveloper) {
    return {
      intent: "developer",
      primaryPath: appPath("/developers#contact"),
      secondaryPaths: [
        { label: "Platform overview", path: appPath("/developers") },
        { label: "Live buy map demo", path: appPath("/buy/search") },
        { label: "AI advisor demo", path: appPath("/advisor") },
      ],
      nextStep:
        "Book a Rudder Tech strategy call to scope white-label maps, AI agents, and mobile parity for your market.",
      qualificationQuestions: [
        "Which cities or regions do you operate in?",
        "Rent only, buy only, or dual marketplace?",
        "Do you need Flutter apps and seller monetization?",
        "Timeline and budget band for MVP vs enterprise?",
      ],
      reasoning:
        "User signals PropTech platform / white-label intent — route to developer showcase and Rudder Tech contact.",
    };
  }

  if (isSell) {
    return {
      intent: "sell",
      primaryPath: appPath("/buy/post"),
      secondaryPaths: [
        { label: "Buy map (see comps)", path: appPath("/buy/search") },
        { label: "Buyer demand board", path: appPath("/buy/requirements") },
      ],
      nextStep: "List with accurate map pin and photos; check active buyer requirements for your micro-market.",
      qualificationQuestions: [
        "Resale flat, plot, or project unit?",
        "Society and sector for map discovery?",
        "Expected price band in lakh?",
      ],
      reasoning: "Seller intent — list on buy side and cross-check buyer demand.",
    };
  }

  if (isRent) {
    return {
      intent: "rent",
      primaryPath: appPath("/search"),
      secondaryPaths: [
        { label: "Mohali rent guide", path: appPath("/rentals/mohali") },
        { label: "PG near CU", path: appPath("/rentals/kharar") },
        { label: "Rent blog guides", path: appPath("/blog") },
      ],
      nextStep: "Open rent map with NL filters, then message owners directly from pins.",
      qualificationQuestions: [
        "PG, flat, or independent house?",
        "Furnished vs semi-furnished and monthly budget?",
        "Commute anchor (IT Park, CU, Chandigarh sector)?",
      ],
      reasoning: "Rental intent — prioritize rent map and Tricity rent guides.",
    };
  }

  if (isInvest) {
    return {
      intent: "invest",
      primaryPath: appPath("/buy/search"),
      secondaryPaths: [
        { label: "Compare areas", path: appPath("/advisor") },
        { label: "Projects hub", path: appPath("/buy/projects") },
        { label: "Zirakpur buy guide", path: appPath("/buy/zirakpur") },
      ],
      nextStep: "Compare 2–3 micro-markets, sample live listings, then read project investment notes.",
      qualificationQuestions: [
        "Rental yield vs capital appreciation horizon?",
        "Budget in lakh and preferred BHK?",
        "Ready possession vs under-construction tolerance?",
      ],
      reasoning: "Investment intent — combine area compare, live comps, and projects hub.",
    };
  }

  const isBuy =
    /\b(buy|purchase|bhk|flat|plot|villa|crore|lakh|possession|ready to move)\b/i.test(combined) ||
    !isRent;

  if (isBuy) {
    return {
      intent: "buy",
      primaryPath: appPath("/buy/search"),
      secondaryPaths: [
        { label: "Post buyer requirement", path: appPath("/buy/requirements/post") },
        { label: "Area guides", path: appPath("/buy/mohali") },
        { label: "Due diligence blog", path: appPath("/blog/buy") },
      ],
      nextStep: "Filter buy map by budget and BHK, then compare 2 areas if undecided.",
      qualificationQuestions: [
        "End-user or investor?",
        "Budget ceiling in lakh?",
        "Preferred hubs: Mohali, Zirakpur, Kharar, Panchkula?",
        "Timeline for possession?",
      ],
      reasoning: "Buy intent — map search plus optional buyer requirement if no exact match.",
    };
  }

  return {
    intent: "explore",
    primaryPath: appPath("/advisor"),
    secondaryPaths: [
      { label: "Rent map", path: appPath("/search") },
      { label: "Buy map", path: appPath("/buy/search") },
      { label: "For developers", path: appPath("/developers") },
    ],
    nextStep: "Clarify rent vs buy vs invest, then use the matching map and area tools.",
    qualificationQuestions: [
      "Are you looking to rent, buy, or invest in Tricity?",
      "Which areas matter for commute or family?",
      "Approximate budget?",
    ],
    reasoning: "Intent unclear — start advisor qualification flow.",
  };
}

export interface DeveloperOffering {
  productName: string;
  referenceUrl: string;
  modules: { name: string; description: string }[];
  engagementTiers: { tier: string; scope: string; timeline: string }[];
  differentiators: string[];
  contactEmail: string;
}

export function getDeveloperOffering(): DeveloperOffering {
  return {
    productName: "RentalPins PropTech OS (white-label)",
    referenceUrl: appPath("/developers"),
    modules: [
      { name: "Dual marketplace maps", description: "Rent (silver) + buy (gold) with Google Maps, clusters, NL filters" },
      { name: "Listing monetization", description: "Owner post flows, Razorpay activation, AI listing improve" },
      { name: "Buyer demand", description: "Requirements board connecting buyers and sellers" },
      { name: "Projects hub", description: "Developer-branded project pages and inventory" },
      { name: "AI property agent", description: "Multi-surface chat, tools, lead scoring, admin metrics, email alerts" },
      { name: "Mobile parity", description: "Flutter iOS/Android on shared Firebase backend" },
      { name: "SEO hub fabric", description: "City, area, rent/buy spokes for organic acquisition" },
    ],
    engagementTiers: [
      { tier: "Discovery sprint", scope: "UX, data model, agent tools scope, integration map", timeline: "2–4 weeks" },
      { tier: "MVP portal", scope: "Branded maps, auth, listings, one AI surface", timeline: "8–12 weeks" },
      { tier: "Enterprise program", scope: "Multi-city, CRM, custom agent RAG, analytics, app store release", timeline: "3–9 months" },
    ],
    differentiators: [
      "Live reference product — not slides",
      "PhD founder-led architecture on complex map + Firebase systems",
      "Agent stack with measurable lead scoring already in production",
    ],
    contactEmail: "admin@rentalpins.com",
  };
}

export function buildContactHandoff(params: {
  surface: AgentSurface;
  interest?: string;
  summary: string;
  company?: string;
}): { contactUrl: string; message: string } {
  const encoded = encodeURIComponent(params.summary.slice(0, 500));
  const interest = params.interest ?? (params.surface === "showcase" ? "proptech" : "property-inquiry");

  if (params.surface === "showcase") {
    const qs = new URLSearchParams({ interest, message: params.summary.slice(0, 500) });
    if (params.company) qs.set("company", params.company);
    return {
      contactUrl: `https://rudder.tech/contact?${qs.toString()}`,
      message:
        "I've prepared a strategy call request with your PropTech requirements. Continue to Rudder Tech contact to complete details.",
    };
  }

  if (params.surface === "project") {
    const waText = encodeURIComponent(
      `Hi RentalPins, I was chatting with the project AI concierge. ${params.summary.slice(0, 400)}`
    );
    return {
      contactUrl: `https://wa.me/919915061640?text=${waText}`,
      message:
        "Continue on WhatsApp with our sales team at +91 9915061640 — I've included your conversation summary.",
    };
  }

  return {
    contactUrl: `${appPath("/developers#contact")}?interest=${encodeURIComponent(interest)}&summary=${encoded}`,
    message:
      "For dedicated follow-up, email admin@rentalpins.com or use the developer contact section with your summary.",
  };
}

export interface AffordabilityEstimate {
  maxAffordablePriceInr: number | null;
  maxAffordablePriceLakh: number | null;
  estimatedEmiInr: number | null;
  assumptions: string[];
  disclaimer: string;
}

/** Rule-of-thumb affordability — not a loan offer. */
export function estimateAffordability(params: {
  monthlyIncome?: number;
  existingEmi?: number;
  downPaymentLakh?: number;
  loanTenureYears?: number;
  interestRatePercent?: number;
  targetPriceLakh?: number;
}): AffordabilityEstimate {
  const tenure = params.loanTenureYears ?? 20;
  const rate = (params.interestRatePercent ?? 8.5) / 100 / 12;
  const months = tenure * 12;
  const assumptions: string[] = [
    `Loan tenure ${tenure} years, indicative rate ${params.interestRatePercent ?? 8.5}% p.a.`,
    "Banks often cap EMI at ~40–50% of net monthly income — using 45% here.",
  ];

  let maxAffordablePriceInr: number | null = null;
  let estimatedEmiInr: number | null = null;

  if (params.monthlyIncome && params.monthlyIncome > 0) {
    const availableEmi = Math.max(0, params.monthlyIncome * 0.45 - (params.existingEmi ?? 0));
    if (rate > 0) {
      const maxLoan = (availableEmi * (Math.pow(1 + rate, months) - 1)) / (rate * Math.pow(1 + rate, months));
      const down = (params.downPaymentLakh ?? 0) * 100_000;
      maxAffordablePriceInr = Math.round(maxLoan + down);
      assumptions.push(`Net income ₹${params.monthlyIncome.toLocaleString("en-IN")}, available EMI ~₹${Math.round(availableEmi).toLocaleString("en-IN")}`);
    }
  }

  if (params.targetPriceLakh && params.targetPriceLakh > 0) {
    const price = params.targetPriceLakh * 100_000;
    const down = (params.downPaymentLakh ?? 0) * 100_000;
    const principal = Math.max(0, price - down);
    if (rate > 0 && principal > 0) {
      estimatedEmiInr = Math.round(
        (principal * rate * Math.pow(1 + rate, months)) / (Math.pow(1 + rate, months) - 1)
      );
      assumptions.push(`Target price ₹${params.targetPriceLakh}L, down payment ₹${params.downPaymentLakh ?? 0}L`);
    }
  }

  return {
    maxAffordablePriceInr,
    maxAffordablePriceLakh:
      maxAffordablePriceInr != null ? Math.round(maxAffordablePriceInr / 100_000) : null,
    estimatedEmiInr,
    assumptions,
    disclaimer:
      "Indicative only — not a loan approval. Confirm eligibility, stamp duty, and processing fees with your lender.",
  };
}

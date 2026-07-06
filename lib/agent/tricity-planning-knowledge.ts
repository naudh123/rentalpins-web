/**
 * Tricity urban planning, land-use, and authority knowledge for AI agents.
 * Master plan, MC limits, residential / mixed-use / industrial, IT Park vs IT City, PSIEC.
 */

export type PlanningCategory =
  | "master-plan"
  | "mc-limits"
  | "residential"
  | "mixed-use"
  | "industrial"
  | "it-park"
  | "psiec"
  | "commercial";

export interface TricityPlanningTopic {
  id: string;
  title: string;
  category: PlanningCategory;
  authority: string;
  summary: string;
  whatItMeansForBuyers: string;
  tricityExamples: string[];
  keyDistinctions: string[];
  verifyChecklist: string[];
  redFlags: string[];
  relatedAreaSlugs: string[];
  tags: string[];
}

export const TRICITY_PLANNING_TOPICS: TricityPlanningTopic[] = [
  {
    id: "gmada-master-plan",
    title: "GMADA master plan (Mohali / SAS Nagar / New Chandigarh)",
    category: "master-plan",
    authority: "GMADA (Greater Mohali Area Development Authority)",
    summary:
      "GMADA prepares and notifies master plans and sector layouts for SAS Nagar (Mohali), New Chandigarh (Mullanpur), Aerocity, EcoCity, and extension sectors beyond core MC limits — defining road widths, land-use zones, and plotted vs institutional belts.",
    whatItMeansForBuyers:
      "Buyers should confirm a plot or project sits in a GMADA-notified sector with approved layout plan — not just broker 'master plan' marketing. GMADA townships (Aerocity, EcoCity, Sector 116/115 belts) have planned infrastructure; fringe village extensions may lack the same CLU clarity.",
    tricityExamples: [
      "GMADA Aerocity — 1,000-acre airport-adjacent township",
      "EcoCity New Chandigarh / Mullanpur master plan",
      "Sector 115/116/127 Kharar–Banur GMADA belts",
      "Sector 82A / 83 IT City GMADA sectors",
      "Kurali–Banur GMADA expressway plotted sectors",
    ],
    keyDistinctions: [
      "GMADA master plan ≠ builder's marketing master-plan PDF on /projects",
      "GMADA sectors use sector numbers (e.g. 82A, 116) — different from old 'Phase' nomenclature in some belts",
      "New Chandigarh is GMADA-planned; many outer villages are panchayat or CLU-dependent",
    ],
    verifyChecklist: [
      "Ask for GMADA allotment / layout plan reference",
      "Match sector number on sale deed with GMADA notified map",
      "Check development charges paid status for plotted schemes",
      "Site-visit internal road width vs master plan claims",
    ],
    redFlags: [
      "Seller cannot show GMADA or CLU approval for plotted land",
      "Marketing uses 'master plan' but sector is outside notified GMADA layout",
      "Agricultural land sold as 'residential plot' without conversion proof",
    ],
    relatedAreaSlugs: ["mohali", "aerocity", "new-chandigarh", "kharar-banur-gmada", "kurali"],
    tags: ["gmada", "master plan", "sector", "mullanpur", "aerocity", "layout"],
  },
  {
    id: "chandigarh-master-plan",
    title: "Chandigarh master plan & sector grid",
    category: "master-plan",
    authority: "Chandigarh Administration / MC Chandigarh",
    summary:
      "Chandigarh follows the original Le Corbusier sector grid — strict land-use per sector (residential, commercial, institutional, industrial in designated sectors). Building bylaws and MC limits are tightly enforced compared to GMADA fringe.",
    whatItMeansForBuyers:
      "Chandigarh resale is premium with strong planning discipline — commercial use in residential sectors is restricted. Most new supply for investors is on Tricity periphery (Mohali/Zirakpur) rather than new Chandigarh sectors.",
    tricityExamples: [
      "Sector 17 commercial hub",
      "Sector 22/35 residential",
      "Industrial Area Phase I & II (designated industrial sectors)",
      "Manimajra (MC Chandigarh extension belt)",
    ],
    keyDistinctions: [
      "Chandigarh UT planning ≠ GMADA Mohali planning — different authorities and bylaws",
      "No new plotted 'sectors' inside UT — mostly resale and redevelopment",
    ],
    verifyChecklist: [
      "Confirm sector and sub-sector use class",
      "Society/RWA transfer rules for resale flats",
      "MC Chandigarh property tax and building plan approval",
    ],
    redFlags: ["Broker claims commercial shop in strictly residential sector without MC approval"],
    relatedAreaSlugs: ["chandigarh"],
    tags: ["chandigarh", "master plan", "sector", "le corbusier", "mc chandigarh"],
  },
  {
    id: "panchkula-hsvp-master-plan",
    title: "Panchkula / HSVP (HUDA) planned sectors",
    category: "master-plan",
    authority: "HSVP (Haryana Shahari Vikas Pradhikaran) / MC Panchkula",
    summary:
      "Panchkula uses HSVP (formerly HUDA) sector planning for residential and commercial grids — mature sectors with established MC services, distinct from GMADA Mohali extension belts.",
    whatItMeansForBuyers:
      "End-user family buyers often prefer HSVP sectors for Chandigarh adjacency; investors cross-check HSVP allotment vs private colony layouts on Pinjore fringe.",
    tricityExamples: ["Sector 20 Panchkula", "Sector 5/9 commercial belts", "Pinjore hills fringe"],
    keyDistinctions: ["HSVP Panchkula ≠ GMADA Mohali — different state planning departments"],
    verifyChecklist: ["HSVP allotment letter", "MC Panchkula building plan sanction", "Transfer NOC"],
    redFlags: ["Private colony on agricultural land without HSVP/CLU"],
    relatedAreaSlugs: ["panchkula", "pinjore"],
    tags: ["panchkula", "huda", "hsvp", "master plan", "sector"],
  },
  {
    id: "mc-limits-overview",
    title: "Municipal Corporation (MC) limits — what changes inside vs outside",
    category: "mc-limits",
    authority: "MC Chandigarh · MC Mohali (SAS Nagar) · MC Panchkula · MC Kharar · MC Zirakpur",
    summary:
      "MC limits define which municipal body provides water/sewer, property tax, building bye-law enforcement, and trade licences. Outside MC limits, GMADA/panchayat/CLU rules may apply — common confusion on Kharar–Banur, Kurali, and New Chandigarh fringes.",
    whatItMeansForBuyers:
      "Always ask: Is this property inside MC limits or GMADA/panchayat fringe? Affects resale liquidity, utility connections, change of land use, and whether 'residential' marketing matches lawful use.",
    tricityExamples: [
      "MC Mohali — Phase 7/9/11, many Aerocity-adjacent sectors",
      "MC Kharar — Kharar town core",
      "MC Zirakpur — VIP Road societies",
      "Outside MC — many GMADA extension sectors, Jhanjeri, Chunni, Siswan fringes",
    ],
    keyDistinctions: [
      "Inside MC ≠ automatically GMADA-approved plotted sector (both checks needed)",
      "Outside MC is not always illegal — but diligence on CLU and layout is stricter",
      "Industrial plots inside PSIEC estates are outside typical residential MC housing stock",
    ],
    verifyChecklist: [
      "Property tax bill issuing authority (MC name)",
      "Building plan sanctioning authority",
      "Water/sewer connection source (MC vs borewell/tanker dependency)",
      "Seller disclosure of MC vs panchayat jurisdiction",
    ],
    redFlags: [
      "Residential flat listing in clearly industrial-zoned PSIEC plot",
      "No MC or GMADA building approval for constructed property",
    ],
    relatedAreaSlugs: ["mohali", "kharar", "zirakpur", "panchkula", "chandigarh"],
    tags: ["mc limits", "municipal corporation", "property tax", "bylaws", "jurisdiction"],
  },
  {
    id: "residential-zoning-gmada",
    title: "Residential zoning — GMADA sectors, phases, and plotted colonies",
    category: "residential",
    authority: "GMADA · MC Mohali · private colonisers (RERA where applicable)",
    summary:
      "Residential land use covers GMADA-notified housing sectors, apartment phases (Phase 7–11), and RERA-registered townships. Tricity 'Phase' belts in Mohali are largely residential society stock; GMADA sectors 115+ are often plotted residential with optional SCO strips.",
    whatItMeansForBuyers:
      "Match product to use: apartment resale in Phase belts vs plotted registry in GMADA sectors vs independent house in MC Kharar. Student PG demand is residential use but society bylaws may restrict multi-tenant.",
    tricityExamples: [
      "Phase 7/9/11 Mohali — apartment societies",
      "GMADA Aerocity / EcoCity residential plots",
      "Kharar town independent houses",
      "Zirakpur VIP high-rise residential",
    ],
    keyDistinctions: [
      "Residential ≠ PG-allowed — check RWA bylaws",
      "Plotted residential requires construction before rental yield",
    ],
    verifyChecklist: ["RERA reg for projects", "RWA PG policy", "Registry land use class on deed"],
    redFlags: ["PG operator buying in society with explicit single-family deed restriction"],
    relatedAreaSlugs: ["mohali", "kharar", "zirakpur", "panchkula"],
    tags: ["residential", "phase", "gmada", "plots", "apartment", "pg"],
  },
  {
    id: "mixed-use-townships",
    title: "Mixed-use zoning — SCO, high-street, residential + commercial",
    category: "mixed-use",
    authority: "GMADA · RERA Punjab · MC (for operational trade licences)",
    summary:
      "Mixed-use townships combine residential plots/flats with commercial SCO (Shop-Cum-Office), high-street retail, and sometimes hospitality — common on Patiala Highway, Airport Road, Sector 74–75, VIP Road, and Emaar/Jubilee-style townships.",
    whatItMeansForBuyers:
      "Mixed-use suits investors wanting retail frontage plus housing, or end-users living above owned shop. Verify GMADA/RERA commercial component is legally demarcated — not ground-floor residential converted ad hoc.",
    tricityExamples: [
      "Velora Urbano — Patiala Highway Banur belt (plots + SCO)",
      "TDI City Sector 117 — residential + SCO",
      "Homeland Global Park Sector 75 — retail + office + serviced residences",
      "SBP Rio ONE Zirakpur — commercial mixed-use",
      "Emaar Mohali Hills — mixed plots + commercial centre",
    ],
    keyDistinctions: [
      "Mixed-use RERA project ≠ illegal residential shop conversion",
      "SCO units often command corner premiums — check FAR and parking loading",
    ],
    verifyChecklist: [
      "RERA project type (mixed-use in registration)",
      "Separate commercial vs residential unit numbers",
      "MC trade licence path for intended business",
    ],
    redFlags: ["Ground-floor flat operated as shop without commercial unit classification"],
    relatedAreaSlugs: ["mohali", "zirakpur", "banur", "kharar-banur-gmada"],
    tags: ["mixed use", "sco", "commercial", "township", "retail", "high street"],
  },
  {
    id: "industrial-zoning-tricity",
    title: "Industrial areas — warehouses, factories, logistics (non-residential)",
    category: "industrial",
    authority: "PSIEC · GMADA industrial belts · Punjab Pollution Control · MC (limited)",
    summary:
      "Industrial-zoned land is for manufacturing, warehousing, logistics, and MSME — on corridors like Derabassi NH, Lalru, Landran–Banur (Tangori), Rajpura NH-44, Tepla Banur, and JLPL industrial belt near IT City. Residential living here is usually worker housing, not family premium stock.",
    whatItMeansForBuyers:
      "Do not buy industrial plots for family housing unless CLU and building plan explicitly allow residential (rare). Warehouse investors verify truck access, power load, and pollution consent. Map listings tagged 'commercial' or 'warehouse' belong here.",
    tricityExamples: [
      "Derabassi / Lalru Ambala–Chandigarh industrial corridor",
      "JLPL Industrial Area near IT City Sector 83",
      "Landran–Banur Tangori industrial parks",
      "Rajpura NH-44 industrial belt",
    ],
    keyDistinctions: [
      "Industrial ≠ IT Park (tech office SEZ) ≠ residential Phase flat",
      "Red-zone / green-zone industrial classification affects permitted industry type",
    ],
    verifyChecklist: [
      "Zoning certificate or CLU for intended activity",
      "Pollution NOC if manufacturing",
      "Truck access and ceiling height for warehouse",
    ],
    redFlags: [
      "Broker sells industrial plot as 'cheap residential plot'",
      "Residential family in heavy-truck corridor without understanding noise/pollution",
    ],
    relatedAreaSlugs: ["derabassi", "lalru", "landran", "rajpura", "banur"],
    tags: ["industrial", "warehouse", "factory", "logistics", "derabassi", "lalru"],
  },
  {
    id: "psiec-industrial-estates",
    title: "PSIEC industrial focal points & estates",
    category: "psiec",
    authority: "PSIEC (Punjab Small Industries & Export Corporation)",
    summary:
      "PSIEC develops and manages industrial focal points and integrated industrial estates across Punjab — including Tricity-adjacent belts on Rajpura NH-44 (SIEL), Tepla Road Banur, and partner parks on Landran–Banur corridor. Not the same as Ludhiana's locality name 'Focal Point'.",
    whatItMeansForBuyers:
      "PSIEC / notified industrial estate plots suit MSME, warehousing, and manufacturing buyers — with estate-level infrastructure. Residential investors should not confuse PSIEC estate addresses with GMADA residential sectors.",
    tricityExamples: [
      "SBP SIEL Industrial Estate — Rajpura NH-44 (~400+ acres, Red Zone plots)",
      "SBP Industrial Park — Tepla Road, Banur (manufacturing, cold storage, logistics)",
      "MK Technology Park — Tangori, Landran–Banur Road (green industries, warehousing)",
      "Mahakali / Alexan industrial parks on Landran–Banur corridor",
    ],
    keyDistinctions: [
      "PSIEC estate = industrial land use by design",
      "Ludhiana 'Focal Point' is a locality name — not every 'focal point' listing is PSIEC",
      "PSIEC ≠ GMADA residential township",
    ],
    verifyChecklist: [
      "Allotment from PSIEC or estate developer with industrial use rights",
      "Estate bylaws on sub-letting and change of activity",
      "RERA registration for marketed industrial parks (where applicable)",
    ],
    redFlags: ["Residential brochure for plot inside Red Zone industrial estate"],
    relatedAreaSlugs: ["rajpura", "banur", "landran", "derabassi"],
    tags: ["psiec", "industrial estate", "focal point", "siel", "rajpura", "banur", "msme"],
  },
  {
    id: "mohali-it-park-legacy",
    title: "Mohali IT Park (Rajiv Gandhi Technology Park — legacy STPI belt)",
    category: "it-park",
    authority: "STPI / GMADA · MC Mohali fringe",
    summary:
      "The original Mohali IT Park (Rajiv Gandhi Chandigarh Technology Park) hosts STPI-registered tech campuses — Infosys, Quark, DLF IT Park, near Sector 67 / Phase 11 / Phase 8 belt. This is office/tech campus zoning, not the same as nearby residential Phase societies or GMADA IT City plots.",
    whatItMeansForBuyers:
      "Tech professionals often live in Phase 7/9 or Aerocity and work in IT Park — when user says 'near IT Park', clarify office commute vs buying inside campus (generally institutional, not open residential market). Rent demand spills into Phase and Aerocity residential.",
    tricityExamples: [
      "DLF IT Park Mohali",
      "Infosys / Quark campuses",
      "Sector 67 / Phase 11 IT Park corridor residential spillover",
      "Bestech Business Tower Sector 66 — commercial/office near IT Park gateway",
    ],
    keyDistinctions: [
      "IT Park (legacy STPI campuses) ≠ IT City Mohali (JLPL Sector 82/83 master plan)",
      "Residential listings 'near IT Park' are usually Phase/Aerocity — not inside STPI campus",
    ],
    verifyChecklist: [
      "Clarify user means office location vs residential purchase",
      "Map search centred on Phase 7/9 or Sector 66–67 for 'IT Park commute'",
    ],
    redFlags: ["Confusing IT Park office campus with IT City plotted sectors"],
    relatedAreaSlugs: ["mohali", "aerocity"],
    tags: ["it park", "stpi", "tech park", "infosys", "dlf", "phase 11", "sector 67"],
  },
  {
    id: "it-city-mohali-jlpl",
    title: "IT City Mohali (JLPL / Sector 82–83 GMADA belt)",
    category: "it-park",
    authority: "GMADA IT City master plan · JLPL Industrial Area adjacency",
    summary:
      "IT City Mohali is GMADA's planned extension near Aerocity and airport — Sector 82A, 83 Alpha, JLPL IT City Road, with residential plots, luxury towers (Medallion 82A), and adjacency to JLPL industrial/logistics belt. Marketing often says 'IT City' or 'Aerocity' interchangeably — precision matters.",
    whatItMeansForBuyers:
      "IT City suits premium residential and plotted buyers wanting airport + tech corridor address — distinct from older IT Park campuses 6–10 km away. Verify GMADA IT City sector allotment vs private builder project inside the belt.",
    tricityExamples: [
      "GMADA IT City Sector 82A plots",
      "The Medallion Sector 82-A — luxury residential towers",
      "STJ The Pinnacle Sector 83 Alpha opposite Plaksha University",
      "Jubilee Techyards Sector 102A — integrated IT park township on NH-205A",
      "Smart City / 7C projects on Landran–Banur near IT City",
    ],
    keyDistinctions: [
      "IT City Mohali (Sector 82/83) ≠ Mohali IT Park (STPI Phase 8/11 campuses)",
      "JLPL Industrial Area is industrial/logistics — adjacent but different land use",
      "Aerocity GMADA township overlaps marketing with IT City corridor",
    ],
    verifyChecklist: [
      "Sector number (82A, 83 Alpha, 102A) on RERA and registry",
      "GMADA IT City master plan reference for plotted schemes",
      "Commute time to actual office (IT Park vs IT City vs Chandigarh)",
    ],
    redFlags: ["Listing says 'IT Park' but pin is in Kharar town or Chunni — wrong corridor"],
    relatedAreaSlugs: ["aerocity", "mohali", "landran", "kharar-banur-gmada"],
    tags: ["it city", "jlpl", "sector 82", "sector 83", "aerocity", "gmada", "airport road"],
  },
  {
    id: "commercial-sco-highstreet",
    title: "Commercial zoning — SCO, offices, retail (without residential)",
    category: "commercial",
    authority: "GMADA · MC · RERA commercial projects",
    summary:
      "Pure commercial stock includes SCO plots, high-street retail, Grade-A offices, and shops — Sector 74–75 Homeland, Bestech Sector 66, VIP Road Zirakpur retail, and ground commercial in mixed townships. Due diligence on trade licence, fire NOC, and frontage.",
    whatItMeansForBuyers:
      "Commercial buyers on RentalPins Buy map should filter Property → Shops/Showroom/Office — verify approved use on building plan. Residential tenants searching 'shop on rent' belong on commercial categories, not flat filters.",
    tricityExamples: [
      "Homeland Global Park Sector 75",
      "Bestech Business Tower Sector 66",
      "VIP Road Zirakpur commercial",
      "SCO strips in TDI City, Jubilee, Velora Urbano",
    ],
    keyDistinctions: ["Commercial unit ≠ residential flat registry class"],
    verifyChecklist: ["Approved commercial use", "Fire NOC for occupied retail", "Parking and loading"],
    redFlags: ["Residential deed used for full commercial operations without CLU"],
    relatedAreaSlugs: ["mohali", "zirakpur"],
    tags: ["commercial", "sco", "office", "shop", "retail", "showroom"],
  },
  {
    id: "clu-change-of-land-use",
    title: "CLU (change of land use) — when agricultural or industrial becomes residential",
    category: "master-plan",
    authority: "GMADA · Deputy Commissioner office · PSIEC (industrial)",
    summary:
      "Fringe Tricity deals often hinge on CLU — converting agricultural or designated land to residential/commercial. GMADA-notified sectors usually have pre-set use; village extensions (Chunni, parts of Jhanjeri) may need CLU proof.",
    whatItMeansForBuyers:
      "If price is 'too cheap' for plotted residential, assume CLU risk until seller produces conversion order. Agents should recommend lawyer review — not approve CLU validity themselves.",
    tricityExamples: [
      "Kurali/Banur fringe plots",
      "Chunni Kalan village extensions",
      "Industrial plot conversions (rare, high scrutiny)",
    ],
    keyDistinctions: ["GMADA sector residential allotment ≠ automatic CLU (use may be pre-approved in layout)"],
    verifyChecklist: ["CLU order copy", "Lawyer title opinion", "No pending acquisition/litigation"],
    redFlags: ["Oral assurance of 'CLU in process' without document at token time"],
    relatedAreaSlugs: ["kurali", "banur", "chunni", "jhanjeri"],
    tags: ["clu", "change of land use", "agricultural", "conversion", "legal"],
  },
];

function topicBlob(t: TricityPlanningTopic): string {
  return [
    t.id,
    t.title,
    t.category,
    t.authority,
    t.summary,
    t.whatItMeansForBuyers,
    ...t.tricityExamples,
    ...t.keyDistinctions,
    ...t.tags,
  ]
    .join(" ")
    .toLowerCase();
}

export function searchTricityPlanning(query: string, limit = 4): TricityPlanningTopic[] {
  const q = query.trim().toLowerCase();
  if (!q) return TRICITY_PLANNING_TOPICS.slice(0, limit);

  const scored = TRICITY_PLANNING_TOPICS.map((topic) => {
    let score = 0;
    const blob = topicBlob(topic);
    if (topic.id.includes(q) || q.includes(topic.id.replace(/-/g, " "))) score += 8;
    if (topic.title.toLowerCase().includes(q)) score += 6;
    if (blob.includes(q)) score += 3;
    for (const token of q.split(/\s+/)) {
      if (token.length > 2 && blob.includes(token)) score += 1;
    }
    if (/\bpsiec\b/i.test(q) && topic.category === "psiec") score += 6;
    if (/\bit park\b/i.test(q) && topic.category === "it-park") score += 5;
    if (/\bit city\b/i.test(q) && topic.id.includes("it-city")) score += 6;
    if (/\bmc limit|municipal/i.test(q) && topic.category === "mc-limits") score += 6;
    if (/\bmixed.?use/i.test(q) && topic.category === "mixed-use") score += 6;
    if (/\bindustrial/i.test(q) && (topic.category === "industrial" || topic.category === "psiec"))
      score += 4;
    if (/\bmaster plan/i.test(q) && topic.category === "master-plan") score += 4;
    return { topic, score };
  });

  return scored
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((s) => s.topic);
}

export function getTricityPlanningTopic(id: string): TricityPlanningTopic | null {
  const key = id.trim().toLowerCase();
  return TRICITY_PLANNING_TOPICS.find((t) => t.id === key) ?? null;
}

export function formatPlanningTopic(t: TricityPlanningTopic): Record<string, unknown> {
  return {
    id: t.id,
    title: t.title,
    category: t.category,
    authority: t.authority,
    summary: t.summary,
    whatItMeansForBuyers: t.whatItMeansForBuyers,
    tricityExamples: t.tricityExamples,
    keyDistinctions: t.keyDistinctions,
    verifyChecklist: t.verifyChecklist,
    redFlags: t.redFlags,
    relatedAreaSlugs: t.relatedAreaSlugs,
    tags: t.tags,
  };
}

export function formatTricityPlanningBrief(): string {
  return `## Planning & land-use (use \`searchTricityPlanning\` for depth)
- **Master plan:** GMADA (Mohali, Aerocity, EcoCity, sector layouts), Chandigarh sector grid, HSVP Panchkula.
- **MC limits:** MC Chandigarh / Mohali / Panchkula / Kharar / Zirakpur — property tax, bylaws, utilities; fringe GMADA/panchayat outside core MC.
- **Residential:** Phase apartments, GMADA plotted sectors, townships (RERA).
- **Mixed use:** SCO + residential townships (Velora, TDI, Emaar Hills, Homeland Sector 75).
- **Industrial:** Derabassi, Lalru, JLPL, Landran–Banur Tangori — not family housing zones.
- **PSIEC:** Industrial estates (SIEL Rajpura NH-44, Tepla Banur, partner parks) — MSME/warehouse, ≠ Ludhiana 'Focal Point' locality name.
- **IT Park vs IT City:** Legacy STPI campuses (Infosys/DLF Phase 8/11 belt) ≠ GMADA IT City Sector 82/83 near Aerocity — clarify user commute vs purchase zone.
- **CLU:** Fringe plots need change-of-land-use proof — recommend lawyer, never approve yourself.`;
}

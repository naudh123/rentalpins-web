/**
 * Curated Tricity locality intelligence for AI agents — core hubs + outer belts
 * (Kurali, Banur, Chunni, Rajpura, Derabassi, Landran, etc.).
 */

export type TricityZone = "core" | "outer" | "fringe";

export interface TricityAreaProfile {
  slug: string;
  name: string;
  aliases: string[];
  zone: TricityZone;
  district: string;
  parentHub: "chandigarh" | "mohali" | "kharar" | "panchkula" | "zirakpur";
  summary: string;
  commuteAnchors: string[];
  rentNote?: string;
  buyNote?: string;
  investNote?: string;
  priceBands?: { rent?: string; buy?: string };
  mapCenter: { lat: number; lng: number };
  mapZoom?: number;
  paths: { rent?: string; buy?: string; guide?: string };
  faqs: { q: string; a: string }[];
  tags: string[];
}

export const TRICITY_AREA_PROFILES: TricityAreaProfile[] = [
  {
    slug: "chandigarh",
    name: "Chandigarh",
    aliases: ["chd", "city beautiful", "union territory"],
    zone: "core",
    district: "Chandigarh UT",
    parentHub: "chandigarh",
    summary:
      "Planned union-territory city — premium rent, strong end-user buy in select sectors, limited new supply.",
    commuteAnchors: ["Sector 17", "Sector 34", "IT Park Mohali", "PGIMER", "Panjab University"],
    rentNote: "Sectors 15–22, 34–35, 46–47 popular for working tenants; strict society rules.",
    buyNote: "Resale in older sectors; new supply mostly in Tricity periphery.",
    priceBands: { rent: "₹12k–₹45k/mo flats", buy: "₹80L–₹3Cr+ resale sectors" },
    mapCenter: { lat: 30.7333, lng: 76.7794 },
    mapZoom: 12,
    paths: { rent: "/search", buy: "/buy/search", guide: "/rentals/in/chandigarh" },
    faqs: [
      {
        q: "Chandigarh vs Mohali for rent?",
        a: "Chandigarh sectors cost more but offer planned infrastructure; Mohali/Aerocity suits IT Park commuters at lower rent.",
      },
    ],
    tags: ["chandigarh", "sector", "premium", "rent", "buy"],
  },
  {
    slug: "mohali",
    name: "Mohali (SAS Nagar)",
    aliases: ["sas nagar", "sahibzada ajit singh nagar"],
    zone: "core",
    district: "Mohali",
    parentHub: "mohali",
    summary:
      "Primary IT and airport corridor — Phase belts, Aerocity, IT Park, and family society flats dominate rent and buy.",
    commuteAnchors: ["IT Park", "Airport", "Aerocity", "Phase 7", "Sector 70", "VR Punjab"],
    rentNote: "Phase 7/8/9, Sector 70, Aerocity for furnished professional flats.",
    buyNote: "Phase 7/9/11, Aerocity, New Chandigarh for end-users and investors.",
    investNote: "IT Park proximity drives professional rent; verify society liquidity before resale assumptions.",
    priceBands: { rent: "₹10k–₹35k/mo 2BHK", buy: "₹45L–₹1.5Cr+ 2–3 BHK" },
    mapCenter: { lat: 30.7046, lng: 76.7179 },
    paths: { rent: "/search", buy: "/buy/mohali", guide: "/rentals/mohali" },
    faqs: [
      {
        q: "Best Mohali phases for families?",
        a: "Phase 7, 9, and 11 are mature family belts with schools and market access — compare on buy map with BHK filter.",
      },
    ],
    tags: ["mohali", "phase", "it park", "aerocity", "family"],
  },
  {
    slug: "kharar",
    name: "Kharar",
    aliases: ["kharar town", "kharar city"],
    zone: "core",
    district: "Mohali",
    parentHub: "kharar",
    summary:
      "Affordable gateway town — Chandigarh University student PG capital plus spillover flats for budget renters.",
    commuteAnchors: ["Chandigarh University", "Kharar bus stand", "Landran road", "Kurali road"],
    rentNote: "Dense PG/hostel inventory; verify food plan and campus distance.",
    buyNote: "Entry flats and plots on Kharar–Kurali and Kharar–Banur corridors.",
    investNote: "Student rental yield on PG if compliant; flat liquidity varies by society.",
    priceBands: { rent: "₹4k–₹18k/mo PG–flat", buy: "₹25L–₹80L entry bands" },
    mapCenter: { lat: 30.746, lng: 76.6486 },
    paths: { rent: "/search", buy: "/buy/kharar", guide: "/rentals/kharar" },
    faqs: [
      {
        q: "Kharar vs Landran for CU students?",
        a: "Kharar town has more PG with meals; Landran suits CGC and CU belt with slightly quieter inventory.",
      },
    ],
    tags: ["kharar", "cu", "pg", "student", "affordable"],
  },
  {
    slug: "zirakpur",
    name: "Zirakpur",
    aliases: ["vip road zirakpur", "gazipur"],
    zone: "core",
    district: "Mohali",
    parentHub: "zirakpur",
    summary:
      "Chandigarh commuter market on VIP Road — mix of high-rise societies, shops, and investor flats.",
    commuteAnchors: ["VIP Road", "Chandigarh", "Patiala Highway", "Gazipur chowk"],
    rentNote: "Popular for Chandigarh workers seeking lower rent with highway access.",
    buyNote: "VIP Road projects and resale societies; compare with Mohali prime on budget.",
    investNote: "Commuter rental demand; factor traffic and highway noise at lower floors.",
    priceBands: { rent: "₹8k–₹28k/mo", buy: "₹35L–₹1.2Cr" },
    mapCenter: { lat: 30.6434, lng: 76.8085 },
    paths: { rent: "/search", buy: "/buy/zirakpur", guide: "/rentals/zirakpur" },
    faqs: [
      {
        q: "Zirakpur vs Mohali for buy?",
        a: "Zirakpur often offers lower entry than prime Mohali with Chandigarh commute — check project delivery and resale comps.",
      },
    ],
    tags: ["zirakpur", "vip road", "commuter", "invest"],
  },
  {
    slug: "panchkula",
    name: "Panchkula",
    aliases: ["pkl", "haryana tricity"],
    zone: "core",
    district: "Panchkula",
    parentHub: "panchkula",
    summary:
      "Established Haryana planned city — family end-user sectors, Pinjore hills spillover, Chandigarh adjacency.",
    commuteAnchors: ["Sector 20 Panchkula", "Mansa Devi", "Chandigarh", "Pinjore"],
    rentNote: "Mature sectors with steady family tenant demand.",
    buyNote: "Strong end-user resale in established sectors; Elevate-style new supply on periphery.",
    priceBands: { rent: "₹10k–₹30k/mo", buy: "₹50L–₹1.5Cr+" },
    mapCenter: { lat: 30.6942, lng: 76.8606 },
    paths: { rent: "/search", buy: "/buy/panchkula", guide: "/rentals/panchkula" },
    faqs: [
      {
        q: "Panchkula vs Mohali?",
        a: "Panchkula suits Haryana-preference end-users near Chandigarh; Mohali leads IT/airport corridor demand.",
      },
    ],
    tags: ["panchkula", "family", "end-user"],
  },
  {
    slug: "landran",
    name: "Landran",
    aliases: ["landran road", "cgc landran", "tangori"],
    zone: "outer",
    district: "Mohali",
    parentHub: "kharar",
    summary:
      "Kharar–Banur corridor junction — CGC Landran, student PG, industrial plots, and GMADA sector spillover.",
    commuteAnchors: ["CGC Landran", "Chandigarh University", "Jhanjeri", "Banur road", "Sector 112"],
    rentNote: "Student PG and hostels for CGC/CU; Jhanjeri on Landran–Chunni road is a fast-growing alternative to Kharar town.",
    buyNote: "Plots and independent homes on Landran–Banur Road; industrial land separate segment.",
    priceBands: { rent: "₹5.5k–₹14k/mo PG–flat", buy: "₹20L–₹70L plots/flats" },
    mapCenter: { lat: 30.6649, lng: 76.7652 },
    paths: {
      rent: "/search",
      buy: "/buy/kharar",
      guide: "/rentals/in/chandigarh/landran",
    },
    faqs: [
      {
        q: "PG near CGC Landran?",
        a: "Filter PG on rent map centred on Landran — compare food, curfew, and ride time to CGC gates.",
      },
      {
        q: "Landran vs Banur?",
        a: "Landran is mid-corridor toward Kharar; Banur is further east toward Rajpura/Chitkara belt.",
      },
      {
        q: "Landran vs Jhanjeri for students?",
        a: "Jhanjeri on Landran–Chunni road has newer PG clusters and college adjacency; Landran town is closer to CGC gates.",
      },
    ],
    tags: ["landran", "cgc", "student", "banur road", "jhanjeri", "outer"],
  },
  {
    slug: "jhanjeri",
    name: "Jhanjeri",
    aliases: [
      "jhanjeri village",
      "landran chunni road",
      "landran-chunni road",
      "jhanjeri mohali",
    ],
    zone: "outer",
    district: "Mohali",
    parentHub: "kharar",
    summary:
      "Rising student hub on Landran–Chunni road — new PG/hostel belts, college spillover, and affordable flats between Landran and Chunni.",
    commuteAnchors: [
      "Landran",
      "Chunni Kalan",
      "Banur",
      "CGC Landran",
      "Chandigarh University",
      "Chitkara belt",
    ],
    rentNote:
      "Fast-growing PG and hostel inventory for CU, CGC, and Chitkara-belt students — compare food plan, security, and ride time before deposit.",
    buyNote:
      "Entry flats and village-extension plots along the corridor; newer societies appearing as student demand grows.",
    investNote:
      "Student rental yield potential if compliant PG — verify society rules and college commute before assuming occupancy.",
    priceBands: { rent: "₹5k–₹13k/mo PG–flat", buy: "₹18L–₹45L" },
    mapCenter: { lat: 30.591, lng: 76.734 },
    mapZoom: 12,
    paths: {
      rent: "/search",
      buy: "/buy/kharar/banur",
      guide: "/rentals/in/chandigarh/landran",
    },
    faqs: [
      {
        q: "Why is Jhanjeri popular with students?",
        a: "Landran–Chunni road links CGC, CU, and Chitkara belts — Jhanjeri offers newer PG at lower rent than Kharar town with improving road connectivity.",
      },
      {
        q: "Jhanjeri vs Kharar town for PG?",
        a: "Kharar town has the densest CU PG market; Jhanjeri suits students who want quieter/newer inventory and accept a short ride to campus.",
      },
      {
        q: "Jhanjeri vs Chunni Kalan?",
        a: "Jhanjeri is mid-corridor with growing organised PG; Chunni is further east and usually cheaper but with longer rides to CU/CGC.",
      },
    ],
    tags: ["jhanjeri", "student", "pg", "hostel", "landran", "chunni", "outer"],
  },
  {
    slug: "banur",
    name: "Banur",
    aliases: ["banur town", "banur road", "kharar banur road"],
    zone: "outer",
    district: "Mohali",
    parentHub: "kharar",
    summary:
      "Eastern Kharar–Banur GMADA belt — affordable plots, independent homes, Chitkara/Rajpura adjacency.",
    commuteAnchors: ["Chitkara University", "Rajpura", "Landran", "Patiala Highway", "Tepla industrial"],
    rentNote: "Budget PG and flats for Chitkara/Rajpura students; lower than Kharar town.",
    buyNote: "GMADA plotted sectors on Kharar–Banur Road; verify layout approval and road width.",
    investNote: "Entry plots for long hold; liquidity slower than prime Mohali.",
    priceBands: { rent: "₹5.5k–₹12k/mo", buy: "₹18L–₹55L plots" },
    mapCenter: { lat: 30.553, lng: 76.718 },
    paths: {
      rent: "/search",
      buy: "/buy/kharar/banur",
      guide: "/rentals/in/chandigarh/banur",
    },
    faqs: [
      {
        q: "Banur vs Kharar town for rent?",
        a: "Banur is cheaper and quieter but farther from CU; Kharar town has highest PG density.",
      },
      {
        q: "Is Banur good for plot buyers?",
        a: "Yes for budget GMADA belts — site-visit road access, water, and encumbrance before token.",
      },
    ],
    tags: ["banur", "gmada", "plots", "chitkara", "outer", "student"],
  },
  {
    slug: "kurali",
    name: "Kurali",
    aliases: ["kurali town", "kharar kurali road", "kurali bypass", "nh-205 kurali"],
    zone: "outer",
    district: "Mohali",
    parentHub: "kharar",
    summary:
      "Northwest growth belt from Kharar — NH-205 / GMADA Expressway plotted townships and affordable flats.",
    commuteAnchors: ["Kharar", "Ropar", "GMADA Expressway", "Kurali Bypass"],
    rentNote: "Limited PG vs Kharar; some flats for factory/commuter workers on bypass.",
    buyNote: "Strong plotted township activity (100–150 sq yd bands); Amayra-style gated layouts on bypass.",
    investNote: "Highway-facing plots for long-term; student yield weaker than Kharar–Landran.",
    priceBands: { rent: "₹6k–₹15k/mo", buy: "₹22L–₹65L plots/flats" },
    mapCenter: { lat: 30.754, lng: 76.637 },
    paths: {
      rent: "/search",
      buy: "/buy/kharar/kharar-to-kurali",
      guide: "/buy/kharar/kharar-to-kurali",
    },
    faqs: [
      {
        q: "Kurali vs Kharar for buy?",
        a: "Kurali offers lower plot entry northwest of Kharar; Kharar town has better rent liquidity for flats.",
      },
      {
        q: "What is on Kurali Bypass?",
        a: "NH-205 plotted townships and highway retail — popular for budget plot buyers from Tricity.",
      },
    ],
    tags: ["kurali", "plots", "gmada", "expressway", "outer", "buy"],
  },
  {
    slug: "siswan",
    name: "Siswan (Kurali–Siswan belt)",
    aliases: ["siswan", "kurali siswan", "kurali to siswan"],
    zone: "fringe",
    district: "Mohali / Ropar fringe",
    parentHub: "kharar",
    summary:
      "Rural–urban fringe beyond Kurali — larger plots, farmhouse land, lowest entry in northwest Tricity.",
    commuteAnchors: ["Kurali", "Kharar", "Siswan village belt"],
    rentNote: "Sparse rental — mostly farmhouse caretaker or rural rooms.",
    buyNote: "Farmhouse and large parcel buyers; verify agricultural vs converted title.",
    investNote: "Speculative land play only — slow liquidity, legal diligence critical.",
    priceBands: { buy: "₹15L–₹45L+ land parcels" },
    mapCenter: { lat: 30.78, lng: 76.62 },
    mapZoom: 11,
    paths: { rent: "/search", buy: "/buy/kharar/kurali-to-siswan" },
    faqs: [
      {
        q: "Who should buy on Kurali–Siswan road?",
        a: "Plot/farmhouse buyers with long horizon — not short-term flip or student rental yield.",
      },
    ],
    tags: ["siswan", "kurali", "farmhouse", "plots", "fringe"],
  },
  {
    slug: "chunni",
    name: "Chunni Kalan",
    aliases: ["chunni", "chunni kalan", "chunni majra", "chuni"],
    zone: "outer",
    district: "Patiala / Mohali fringe",
    parentHub: "kharar",
    summary:
      "Village belt on Landran–Chunni road toward Rajpura — budget rent, plotted growth; Jhanjeri mid-corridor is the faster-growing student hub.",
    commuteAnchors: ["Rajpura", "Banur", "Jhanjeri", "Chitkara", "Patiala NH-64"],
    rentNote:
      "Very budget PG/rooms east of Jhanjeri for Chitkara/Rajpura students; compare ride time vs Jhanjeri/Landran PG clusters.",
    buyNote: "Affordable independent plots and village-extension homes — verify panchayat/GMADA status.",
    priceBands: { rent: "₹4k–₹9k/mo", buy: "₹15L–₹40L" },
    mapCenter: { lat: 30.52, lng: 76.68 },
    mapZoom: 12,
    paths: { rent: "/search", buy: "/buy/kharar/banur" },
    faqs: [
      {
        q: "Chunni area — good for students?",
        a: "Budget option east of Jhanjeri on Landran–Chunni road — compare ride time to Chitkara/Rajpura vs newer PG in Jhanjeri or Landran.",
      },
      {
        q: "Chunni vs Jhanjeri?",
        a: "Jhanjeri is the active student hub mid-corridor; Chunni is cheaper fringe farther toward Rajpura.",
      },
      {
        q: "Chunni vs Banur?",
        a: "Banur has more GMADA structure; Chunni is cheaper fringe with village-extension inventory.",
      },
    ],
    tags: ["chunni", "chunni kalan", "jhanjeri", "banur", "rajpura", "budget", "outer", "student"],
  },
  {
    slug: "rajpura",
    name: "Rajpura",
    aliases: ["rajpura town", "nh-44 rajpura", "chitkara belt"],
    zone: "outer",
    district: "Patiala",
    parentHub: "kharar",
    summary:
      "Patiala-district industrial and university town — Chitkara University, NH-44 logistics, budget student rent.",
    commuteAnchors: ["Chitkara University", "NH-44", "Banur", "Patiala"],
    rentNote: "PG clusters for Chitkara students in Rajpura and Banur belt.",
    buyNote: "Independent homes and plots; industrial belts separate from residential.",
    priceBands: { rent: "₹6k–₹12k/mo PG", buy: "₹25L–₹60L" },
    mapCenter: { lat: 30.48, lng: 76.6 },
    mapZoom: 12,
    paths: { rent: "/search", guide: "/cities/rajpura" },
    faqs: [
      {
        q: "PG near Chitkara Rajpura?",
        a: "Search rent map around Rajpura and Banur — compare boys/girls PG with food and Wi‑Fi on listing detail.",
      },
    ],
    tags: ["rajpura", "chitkara", "student", "nh-44", "outer"],
  },
  {
    slug: "derabassi",
    name: "Derabassi (Dera Bassi)",
    aliases: ["dera bassi", "derabassi", "lalru derabassi", "ambala highway"],
    zone: "outer",
    district: "Mohali / Patiala fringe",
    parentHub: "mohali",
    summary:
      "Ambala–Chandigarh NH corridor industrial hub — affordable flats, worker rent, plotted belts toward Lalru.",
    commuteAnchors: ["Zirakpur", "Lalru", "Ambala Highway", "Industrial estates"],
    rentNote: "Budget flats for factory and warehouse workers; limited premium inventory.",
    buyNote: "Entry flats and plots on NH corridor; verify industrial zoning vs residential.",
    priceBands: { rent: "₹6k–₹16k/mo", buy: "₹22L–₹55L" },
    mapCenter: { lat: 30.587, lng: 76.843 },
    mapZoom: 12,
    paths: { rent: "/search", buy: "/buy/zirakpur" },
    faqs: [
      {
        q: "Derabassi vs Zirakpur?",
        a: "Zirakpur suits Chandigarh commuters; Derabassi is cheaper NH industrial corridor with longer city commute.",
      },
    ],
    tags: ["derabassi", "dera bassi", "lalru", "industrial", "outer", "affordable"],
  },
  {
    slug: "lalru",
    name: "Lalru",
    aliases: ["lalru industrial", "lalru derabassi belt"],
    zone: "fringe",
    district: "Mohali fringe",
    parentHub: "mohali",
    summary:
      "Industrial and warehousing belt on Ambala–Chandigarh axis — worker housing and plotted fringe beyond Derabassi.",
    commuteAnchors: ["Derabassi", "Ambala Highway", "Zirakpur"],
    rentNote: "Worker rooms and basic flats; not a student or premium market.",
    buyNote: "Industrial-adjacent plots — strict use and title checks.",
    priceBands: { rent: "₹5k–₹12k/mo", buy: "₹18L–₹45L" },
    mapCenter: { lat: 30.568, lng: 76.875 },
    mapZoom: 11,
    paths: { rent: "/search" },
    faqs: [
      {
        q: "Is Lalru good for residential buy?",
        a: "Only if employed locally — industrial noise and zoning matter; families usually prefer Zirakpur or Derabassi town.",
      },
    ],
    tags: ["lalru", "derabassi", "industrial", "fringe"],
  },
  {
    slug: "new-chandigarh",
    name: "New Chandigarh (Mullanpur)",
    aliases: ["mullanpur", "new chd", "mullanpur garibdas"],
    zone: "outer",
    district: "Mohali",
    parentHub: "mohali",
    summary:
      "Greenfield premium belt north of Chandigarh — plotted sectors, villas, golf-course adjacency, slower but upscale growth.",
    commuteAnchors: ["Sector 36 Chandigarh", "PGIMER", "Airport road", "Kharar"],
    rentNote: "Limited but growing furnished inventory in new societies.",
    buyNote: "Plotted and villa projects from premium builders; end-user and long-hold investors.",
    priceBands: { rent: "₹15k–₹40k/mo", buy: "₹60L–₹2Cr+" },
    mapCenter: { lat: 30.765, lng: 76.745 },
    paths: { rent: "/search", buy: "/buy/mohali" },
    faqs: [
      {
        q: "New Chandigarh vs Aerocity?",
        a: "New Chandigarh is greenfield plotted/villa; Aerocity is airport–IT adjacent flats with faster rental demand.",
      },
    ],
    tags: ["new chandigarh", "mullanpur", "plots", "premium", "outer"],
  },
  {
    slug: "aerocity",
    name: "Mohali Aerocity",
    aliases: ["aerocity mohali", "airport road mohali", "it city mohali"],
    zone: "outer",
    district: "Mohali",
    parentHub: "mohali",
    summary:
      "Airport and IT City corridor — premium furnished rent, professional tenants, strong resale in gated towers.",
    commuteAnchors: ["Airport", "IT City", "VR Punjab", "Sector 82–82"],
    rentNote: "Top Tricity rent for furnished 2–3 BHK near airport and IT.",
    buyNote: "Resale towers and new launches; compare with Phase 7 on all-in cost.",
    priceBands: { rent: "₹18k–₹45k/mo", buy: "₹55L–₹1.8Cr" },
    mapCenter: { lat: 30.667, lng: 76.741 },
    paths: { rent: "/search", buy: "/buy/mohali" },
    faqs: [
      {
        q: "Aerocity for IT professionals?",
        a: "Yes — closest premium belt to IT City and airport; use furnished filter on rent map.",
      },
    ],
    tags: ["aerocity", "airport", "it city", "professional", "premium"],
  },
  {
    slug: "pinjore",
    name: "Pinjore",
    aliases: ["pinjore hills", "kalka pinjore", "panchkula pinjore"],
    zone: "outer",
    district: "Panchkula",
    parentHub: "panchkula",
    summary:
      "Hills and Kalka–Shimla highway belt — quieter rent, villa/plot buyers, weekend-home segment.",
    commuteAnchors: ["Panchkula", "Kalka", "Shimla highway", "Pinjore gardens"],
    rentNote: "Lower density; some family homes and hillside flats.",
    buyNote: "Plots and villas with view premium; check slope and water access.",
    priceBands: { rent: "₹8k–₹20k/mo", buy: "₹35L–₹1Cr" },
    mapCenter: { lat: 30.797, lng: 76.918 },
    mapZoom: 12,
    paths: { rent: "/search", buy: "/buy/panchkula" },
    faqs: [
      {
        q: "Pinjore vs Panchkula sectors?",
        a: "Panchkula sectors suit daily Chandigarh commute; Pinjore suits hillside preference and lower density.",
      },
    ],
    tags: ["pinjore", "hills", "panchkula", "villa", "outer"],
  },
  {
    slug: "kharar-banur-gmada",
    name: "Kharar–Banur Road (GMADA belt)",
    aliases: ["sector 115", "sector 127", "gmada banur road", "emaar mohali hills belt"],
    zone: "outer",
    district: "Mohali",
    parentHub: "kharar",
    summary:
      "High-growth GMADA sector strip between Kharar and Banur — sectors 115/127, plotted townships, mid-corridor flats.",
    commuteAnchors: ["Kharar", "Landran", "Banur", "Sector 115", "Sector 127"],
    rentNote: "Growing flat inventory in new societies along highway.",
    buyNote: "Mix of premium hills-facing projects and affordable GMADA plots.",
    priceBands: { rent: "₹8k–₹22k/mo", buy: "₹30L–₹1.2Cr" },
    mapCenter: { lat: 30.656, lng: 76.681 },
    paths: { rent: "/search", buy: "/buy/kharar/kharar-banur-road" },
    faqs: [
      {
        q: "GMADA sectors on Banur road — safe to buy?",
        a: "Verify GMADA allotment, development charges, and builder track record — belt is active but uneven quality.",
      },
    ],
    tags: ["gmada", "banur road", "sector 115", "sector 127", "outer"],
  },
];

function profileBlob(p: TricityAreaProfile): string {
  return [
    p.slug,
    p.name,
    ...p.aliases,
    p.summary,
    p.district,
    p.parentHub,
    p.commuteAnchors.join(" "),
    p.rentNote ?? "",
    p.buyNote ?? "",
    p.investNote ?? "",
    p.priceBands?.rent ?? "",
    p.priceBands?.buy ?? "",
    p.tags.join(" "),
    p.faqs.map((f) => `${f.q} ${f.a}`).join(" "),
  ]
    .join(" ")
    .toLowerCase();
}

/** Keyword + alias search for agent tools. */
export function searchTricityAreas(query: string, limit = 4): TricityAreaProfile[] {
  const q = query.trim().toLowerCase();
  if (!q) {
    return TRICITY_AREA_PROFILES.filter((p) => p.zone !== "core").slice(0, limit);
  }

  const scored = TRICITY_AREA_PROFILES.map((profile) => {
    let score = 0;
    const blob = profileBlob(profile);
    if (profile.slug === q || profile.name.toLowerCase() === q) score += 8;
    for (const alias of profile.aliases) {
      if (alias === q || q.includes(alias) || alias.includes(q)) score += 6;
    }
    if (blob.includes(q)) score += 3;
    for (const token of q.split(/\s+/)) {
      if (token.length > 2 && blob.includes(token)) score += 1;
    }
    return { profile, score };
  });

  return scored
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((s) => s.profile);
}

export function getTricityArea(slug: string): TricityAreaProfile | null {
  const key = slug.trim().toLowerCase();
  return TRICITY_AREA_PROFILES.find((p) => p.slug === key) ?? null;
}

/** Compact briefing injected into every agent system prompt. */
export function formatTricityAreaKnowledgeBrief(): string {
  const outer = TRICITY_AREA_PROFILES.filter((p) => p.zone !== "core");
  const lines = outer.map(
    (p) =>
      `- **${p.name}** (${p.zone}): ${p.summary} Rent: ${p.priceBands?.rent ?? "sparse/varies"}. Buy: ${p.priceBands?.buy ?? "plots/flats vary"}.`
  );
  return `## Tricity geography (always use \`searchTricityAreas\` for locality depth)
**Core hubs:** Chandigarh, Mohali, Kharar, Zirakpur, Panchkula — prime rent/buy liquidity.
**Outer & fringe belts** (Kurali, Banur, Chunni, Rajpura, Landran, Derabassi, Lalru, Siswan, New Chandigarh, Aerocity, Pinjore, GMADA Banur road):
${lines.join("\n")}
When users name an outer village or road, call \`searchTricityAreas\` then \`buildMapSearch\` centred on returned mapCenter. Do not guess prices — cite priceBands as indicative only.`;
}

/** Full profile text for tool responses. */
export function formatTricityAreaProfile(p: TricityAreaProfile): Record<string, unknown> {
  return {
    slug: p.slug,
    name: p.name,
    zone: p.zone,
    district: p.district,
    parentHub: p.parentHub,
    summary: p.summary,
    commuteAnchors: p.commuteAnchors,
    rentNote: p.rentNote,
    buyNote: p.buyNote,
    investNote: p.investNote,
    priceBands: p.priceBands,
    mapCenter: p.mapCenter,
    mapZoom: p.mapZoom ?? 12,
    paths: p.paths,
    faqs: p.faqs,
    tags: p.tags,
  };
}

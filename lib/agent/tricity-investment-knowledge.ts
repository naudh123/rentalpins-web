/**
 * Tricity investment playbooks for AI agents — yield, appreciation, budget bands.
 * Indicative only; agents must cross-check live map inventory and avoid invented ROI.
 */

export type InvestmentStrategy =
  | "rental-yield"
  | "capital-appreciation"
  | "plot-long-hold"
  | "student-yield"
  | "end-user-liquidity"
  | "project-entry"
  | "mixed";

export interface TricityInvestmentPlaybook {
  id: string;
  title: string;
  strategy: InvestmentStrategy;
  areas: string[];
  budgetBand: string;
  horizon: string;
  bestFor: string;
  thesis: string;
  tenantOrBuyerProfile: string;
  indicativeRentOrResale: string;
  strengths: string[];
  risks: string[];
  dueDiligence: string[];
  mapSearchTip: string;
  guidePaths: string[];
  tags: string[];
}

export const TRICITY_INVESTMENT_PLAYBOOKS: TricityInvestmentPlaybook[] = [
  {
    id: "mohali-professional-yield",
    title: "Mohali professional rental yield (IT Park / Aerocity / Phase belts)",
    strategy: "rental-yield",
    areas: ["mohali", "aerocity", "Phase 7", "Phase 9", "Phase 11", "Sector 70", "IT Park"],
    budgetBand: "₹55L–₹1.5Cr ready resale or near-possession",
    horizon: "3–7 years",
    bestFor: "Investors targeting furnished family/professional tenants with stable EMI coverage",
    thesis:
      "IT Park, Aerocity, and mature Phase societies attract working tenants willing to pay premium for furnishing, parking, and gated security — strongest recurring rent demand in Tricity.",
    tenantOrBuyerProfile: "IT professionals, airport corridor staff, nuclear families",
    indicativeRentOrResale:
      "Furnished 2 BHK often ₹18k–₹35k/mo in prime belts — verify live rent pins near target society before underwriting",
    strengths: [
      "Deep tenant pool from IT City and airport corridor",
      "Resale liquidity better than greenfield fringe",
      "Furnished premium vs unfurnished",
    ],
    risks: [
      "Oversupply in certain towers can extend vacancy",
      "Society maintenance and property tax eat into net yield",
      "Under-construction GST and delay risk if buying pre-possession",
    ],
    dueDiligence: [
      "Sample rent comps on /search centred on society",
      "Check society NOC, transfer charges, and parking allotment",
      "Model net yield after maintenance, tax, and 1-month vacancy buffer",
    ],
    mapSearchTip:
      "Buy map: /buy/mohali with BHK + budget filters; rent map: centre on Aerocity or Phase 7 for comps",
    guidePaths: ["/buy/mohali-investment-guide", "/buy/mohali", "/rentals/mohali"],
    tags: ["mohali", "aerocity", "it park", "phase 7", "yield", "professional", "invest"],
  },
  {
    id: "zirakpur-commuter-yield",
    title: "Zirakpur VIP Road commuter rental yield",
    strategy: "rental-yield",
    areas: ["zirakpur", "VIP Road", "Gazipur", "Patiala Highway"],
    budgetBand: "₹35L–₹90L entry 2–3 BHK",
    horizon: "3–6 years",
    bestFor: "Investors wanting lower entry than prime Mohali with Chandigarh commuter footfall",
    thesis:
      "VIP Road and Gazipur belts capture Chandigarh workers who trade commute time for lower all-in cost — steady rental if society quality and highway noise are acceptable.",
    tenantOrBuyerProfile: "Young professionals, small families commuting to Chandigarh sectors",
    indicativeRentOrResale: "2 BHK often ₹10k–₹22k/mo — compare furnished vs unfurnished on rent map",
    strengths: ["Lower ticket size vs Aerocity/Phase 7", "High commuter demand", "Active resale market on VIP"],
    risks: ["Highway noise and traffic at lower floors", "Project delivery quality varies", "Tenant churn in commuter segment"],
    dueDiligence: [
      "Visit at peak traffic hours",
      "Compare society maintenance vs rent achieved on map pins",
      "Prefer completed towers with proven occupancy",
    ],
    mapSearchTip: "Centre buy/rent map on Zirakpur; filter 2 BHK under budget on /buy/zirakpur",
    guidePaths: ["/buy/zirakpur-investment-guide", "/buy/zirakpur", "/rentals/zirakpur"],
    tags: ["zirakpur", "vip road", "commuter", "yield", "invest", "affordable"],
  },
  {
    id: "kharar-cu-pg-yield",
    title: "Kharar–CU student PG yield corridor",
    strategy: "student-yield",
    areas: ["kharar", "chandigarh university", "Landran road", "Sunny Enclave"],
    budgetBand: "₹25L–₹70L (flat for PG conversion) or operating PG business",
    horizon: "2–5 years (session-cycle driven)",
    bestFor: "Investors comfortable with student housing ops and compliance",
    thesis:
      "Chandigarh University drives year-round PG demand in Kharar town and Landran road — highest tenant density in Tricity student segment if food/curfew model is managed.",
    tenantOrBuyerProfile: "CU undergrad and postgrad students; parents booking annually",
    indicativeRentOrResale:
      "PG beds ₹5k–₹12k/mo per student — multi-tenant gross can exceed single-family rent but needs active management",
    strengths: ["Strong seasonal demand", "Lower flat entry vs Mohali prime", "Walkable clusters in Kharar town"],
    risks: [
      "Regulatory and society restrictions on PG",
      "Session vacancies and summer gaps",
      "Higher wear-and-tear and operator effort",
    ],
    dueDiligence: [
      "Confirm society/RWA allows PG or multi-tenant",
      "Inspect fire safety and occupancy limits",
      "Compare PG pin density on rent map before buying",
    ],
    mapSearchTip: "Rent map PG filter near Kharar; buy map for 2–3 BHK near CU on /buy/kharar",
    guidePaths: ["/buy/kharar-investment-guide", "/rentals/kharar", "/buy/kharar", "/rentals/chandigarh-university"],
    tags: ["kharar", "cu", "pg", "student", "yield", "invest"],
  },
  {
    id: "jhanjeri-student-emerging",
    title: "Jhanjeri / Landran–Chunni emerging student hub",
    strategy: "student-yield",
    areas: ["jhanjeri", "landran", "chunni", "Landran–Chunni road", "CGC Landran"],
    budgetBand: "₹18L–₹45L flats or small PG assets",
    horizon: "3–6 years (corridor still maturing)",
    bestFor: "Investors betting on growing college belt before full pricing parity with Kharar town",
    thesis:
      "Landran–Chunni road links CGC, CU, and Chitkara belts — Jhanjeri is adding organised PG and flats at rents below Kharar town with rising occupancy as colleges expand.",
    tenantOrBuyerProfile: "CGC/CU/Chitkara-belt students; budget-conscious parents",
    indicativeRentOrResale: "PG ₹5k–₹13k/mo; flats ₹8k–₹16k/mo — rising as corridor develops",
    strengths: ["Lower entry than Kharar town", "Newer PG inventory", "Multi-college catchment"],
    risks: ["Infrastructure still catching up", "Liquidity thinner than established sectors", "Distance to some campuses"],
    dueDiligence: [
      "Ride-time test to target colleges",
      "Prefer road-front societies with power backup",
      "Track PG pin growth on map year over year",
    ],
    mapSearchTip: "Centre rent map between Landran and Jhanjeri; buy on /buy/kharar/banur corridor pages",
    guidePaths: ["/rentals/in/chandigarh/landran", "/buy/kharar"],
    tags: ["jhanjeri", "landran", "chunni", "student", "pg", "emerging", "invest"],
  },
  {
    id: "new-chandigarh-appreciation",
    title: "New Chandigarh / Mullanpur plotted appreciation",
    strategy: "capital-appreciation",
    areas: ["new-chandigarh", "mullanpur", "Sector 115", "Airport Road north"],
    budgetBand: "₹60L–₹2Cr+ plots and villas",
    horizon: "7–12 years",
    bestFor: "Patient capital seeking greenfield upside over immediate yield",
    thesis:
      "New Chandigarh and Mullanpur offer premium plotted and villa inventory north of Chandigarh — appreciation tied to infrastructure rollout and upscale end-user migration, not short-term rent.",
    tenantOrBuyerProfile: "End-user families and long-hold plot buyers",
    indicativeRentOrResale: "Rental stock limited; resale liquidity building slower than Phase 7",
    strengths: ["Greenfield premium positioning", "Plotted flexibility", "Adjoins Chandigarh planning ethos"],
    risks: ["Thin resale depth vs established Mohali", "Infrastructure timing risk", "Higher ticket and longer hold"],
    dueDiligence: [
      "Verify GMADA/builder layout and development charges",
      "Compare airport road connectivity vs marketing claims",
      "Use buy map + /buy/new-chandigarh-investment-guide",
    ],
    mapSearchTip: "Buy map Mohali hub + New Chandigarh corridor filters; read investment guide before token",
    guidePaths: ["/buy/new-chandigarh-investment-guide", "/buy/mohali/new-chandigarh", "/projects"],
    tags: ["new chandigarh", "mullanpur", "plots", "appreciation", "premium", "invest"],
  },
  {
    id: "kurali-banur-plot-entry",
    title: "Kurali / Banur / GMADA belt budget plot entry",
    strategy: "plot-long-hold",
    areas: ["kurali", "banur", "kharar-banur-gmada", "Sector 115", "Sector 127"],
    budgetBand: "₹18L–₹55L plotted (100–150 sq yd bands common)",
    horizon: "5–10 years",
    bestFor: "First-time investors with modest budget accepting slower liquidity",
    thesis:
      "Northwest Kurali bypass and east Kharar–Banur GMADA sectors offer Tricity's lowest formal plot entry — upside from highway and township development, not monthly rent.",
    tenantOrBuyerProfile: "Plot end-users, custom-build investors, long-hold land buyers",
    indicativeRentOrResale: "Minimal rental until built — resale depends on road and services arrival",
    strengths: ["Lowest formal plot tickets near Tricity", "GMADA and township branding on corridors", "Multiple builder layouts on Banur road"],
    risks: ["Legal title and conversion diligence critical", "Slow resale if infrastructure lags", "Not suitable for yield-focused investors"],
    dueDiligence: [
      "Site visit for road, water, and encumbrance",
      "Prefer RERA-registered township phases where applicable",
      "Avoid agricultural-title promises without lawyer sign-off",
    ],
    mapSearchTip: "Buy map: /buy/kharar/kharar-to-kurali, /buy/kharar/banur, /buy/kharar/kharar-banur-road",
    guidePaths: ["/buy/kharar", "/buy/kharar/kharar-to-kurali", "/buy/kharar/banur"],
    tags: ["kurali", "banur", "gmada", "plots", "budget", "appreciation", "invest"],
  },
  {
    id: "panchkula-stable-enduser",
    title: "Panchkula established sector end-user + stable resale",
    strategy: "end-user-liquidity",
    areas: ["panchkula", "Pinjore", "Sector 20", "Mansa Devi belt"],
    budgetBand: "₹50L–₹1.5Cr+ resale flats",
    horizon: "5+ years hold",
    bestFor: "Conservative investors prioritising resale depth and family tenants over max yield",
    thesis:
      "Mature Panchkula sectors behave like stability plays — family end-user demand supports resale even if gross rental yield trails Aerocity or VIP Road.",
    tenantOrBuyerProfile: "Government, healthcare, and Chandigarh-adjacent families",
    indicativeRentOrResale: "2–3 BHK rent moderate vs Mohali IT belts; resale turnover steady in prime sectors",
    strengths: ["Planned city legacy", "Family tenant quality", "Chandigarh adjacency"],
    risks: ["Lower yield vs Mohali IT corridor", "Older stock may need renovation", "Pinjore hills segment is niche"],
    dueDiligence: ["Check sector transfer rules", "Compare rent pins on map for target sector", "Factor renovation into yield math"],
    mapSearchTip: "Buy map /buy/panchkula; rent comps on /search near Sector 20",
    guidePaths: ["/buy/panchkula", "/rentals/panchkula"],
    tags: ["panchkula", "stable", "family", "resale", "invest"],
  },
  {
    id: "projects-rera-entry",
    title: "Tricity builder projects — pre-launch and under-construction entry",
    strategy: "project-entry",
    areas: ["mohali", "zirakpur", "kharar", "new-chandigarh", "projects hub"],
    budgetBand: "₹40L–₹2Cr+ depending on typology (plot vs tower)",
    horizon: "Possession-linked (2–5 years typical)",
    bestFor: "Buyers wanting new stock, payment plans, and project amenities",
    thesis:
      "RentalPins projects hub lists curated Tricity launches — entry during pre-launch or construction-linked plans can beat resale if builder delivers on time; cross-check RERA and compare with resale on buy map.",
    tenantOrBuyerProfile: "End-users and investors seeking new inventory",
    indicativeRentOrResale: "Post-possession rent depends on micro-market — always sample rent map near project pin",
    strengths: ["Payment plan flexibility", "New amenities and RERA framework", "AI concierge + site visit on /projects"],
    risks: ["Construction delay", "GST on under-construction", "Actual rent may lag brochure assumptions"],
    dueDiligence: [
      "Verify RERA registration on project page",
      "Compare possession timeline with resale comps",
      "Use estimateAffordability + live rent sample before booking",
    ],
    mapSearchTip: "Browse /projects and /buy/projects; sampleListings on buy map near project coordinates",
    guidePaths: ["/projects", "/buy/projects", "/buy/search"],
    tags: ["projects", "rera", "pre-launch", "builder", "invest", "new launch"],
  },
  {
    id: "budget-invest-under-40L",
    title: "Best Tricity entry under ₹40 lakh",
    strategy: "mixed",
    areas: ["kurali", "banur", "derabassi", "kharar", "jhanjeri"],
    budgetBand: "Under ₹40L",
    horizon: "5–8 years",
    bestFor: "First-time investors with limited capital",
    thesis:
      "Under ₹40L in Tricity usually means outer plots (Kurali, Banur GMADA), fringe flats (Derabassi, Jhanjeri), or older 1–2 BHK resale in Kharar — yield vs appreciation trade-off; plots appreciate slowly with higher legal diligence, flats may yield if tenant demand exists.",
    tenantOrBuyerProfile: "Budget end-users, student PG operators, industrial corridor workers",
    indicativeRentOrResale: "Flats ₹6k–₹14k/mo on fringe; plots have no rent until built",
    strengths: ["Accessible ticket", "Multiple corridors to diversify", "Student/worker demand on fringe"],
    risks: ["Liquidity and legal risk highest in this band", "Avoid purely speculative agricultural fringe", "Resale can take longer"],
    dueDiligence: [
      "Never skip title review on plots",
      "Prefer areas with live rent pins proving demand",
      "Use searchTricityAreas for corridor profile before buying",
    ],
    mapSearchTip: "Buy map priceMax filter; compare Kurali, Banur, Kharar resale pins side by side",
    guidePaths: ["/buy/kharar", "/buy/zirakpur", "/property-market-insights/chandigarh-tricity"],
    tags: ["under 40 lakh", "budget", "entry", "plots", "invest", "affordable"],
  },
  {
    id: "mid-invest-40-90L",
    title: "Mid-ticket Tricity investment ₹40L–₹90 lakh",
    strategy: "mixed",
    areas: ["zirakpur", "mohali", "kharar", "panchkula", "Phase 9", "Phase 11"],
    budgetBand: "₹40L–₹90L",
    horizon: "3–7 years",
    bestFor: "Investors wanting balance of yield and resale liquidity",
    thesis:
      "The ₹40–90L band is Tricity's sweet spot — 2 BHK resale in Zirakpur or Phase 9/11 Mohali, or investor flats in Kharar near CU. Compare gross rent on map vs EMI using affordability tool.",
    tenantOrBuyerProfile: "Commuters, small families, CU-adjacent tenants",
    indicativeRentOrResale: "2 BHK rent roughly ₹10k–₹25k/mo depending on belt and furnishing",
    strengths: ["Better liquidity than sub-₹40L fringe plots", "Multiple yield strategies", "Strong map inventory"],
    risks: ["Wrong micro-market choice hurts both yield and exit", "Furnishing capex for premium rent"],
    dueDiligence: [
      "compareAreas on mohali vs zirakpur vs kharar",
      "sampleListings + rent comps in same bounds",
      "Model EMI at current rates",
    ],
    mapSearchTip: "Use buildMapSearch on buy map with budget + BHK; compare at least two hubs before deciding",
    guidePaths: ["/buy/mohali-investment-guide", "/buy/zirakpur", "/buy/kharar"],
    tags: ["40 lakh", "90 lakh", "mid budget", "2bhk", "invest", "yield"],
  },
  {
    id: "premium-invest-above-1cr",
    title: "Premium Tricity investment above ₹1 crore",
    strategy: "mixed",
    areas: ["aerocity", "Phase 7", "new-chandigarh", "chandigarh sectors", "panchkula premium"],
    budgetBand: "₹1Cr+",
    horizon: "5–10 years",
    bestFor: "High-ticket end-users and investors prioritising quality and liquidity",
    thesis:
      "Above ₹1Cr targets Aerocity towers, Phase 7 premium resale, New Chandigarh plots/villas, or select Chandigarh sectors — lower gross yield but stronger brand, tenant quality, and exit to end-users.",
    tenantOrBuyerProfile: "Senior professionals, NRIs, upscale families",
    indicativeRentOrResale: "Premium 2–3 BHK rent ₹22k–₹45k+; sector resale depth varies",
    strengths: ["Best tenant quality", "Strongest end-user resale in prime pockets", "Project and resale choice"],
    risks: ["Higher capital at risk", "Stamp duty and registration impact yields", "Premium towers can be supply-heavy"],
    dueDiligence: [
      "Lawyer review for resale; RERA for projects",
      "Compare all-in cost vs rent achieved on map",
      "Check NOC and parking for Chandigarh/resale societies",
    ],
    mapSearchTip: "Buy map Aerocity/Phase filters; projects hub for new premium launches",
    guidePaths: ["/buy/mohali-investment-guide", "/buy/new-chandigarh-investment-guide", "/projects"],
    tags: ["1 crore", "premium", "aerocity", "phase 7", "invest", "luxury"],
  },
  {
    id: "chitkara-belt-budget-yield",
    title: "Banur / Rajpura / Chunni Chitkara-belt budget yield",
    strategy: "student-yield",
    areas: ["banur", "rajpura", "chunni", "chitkara"],
    budgetBand: "₹18L–₹50L",
    horizon: "3–6 years",
    bestFor: "Budget investors targeting Chitkara University tenant pool",
    thesis:
      "East of Kharar, Banur and Rajpura belts serve Chitkara students at lower ticket than CU corridor — PG and shared flats can cash-flow if commute and food model work.",
    tenantOrBuyerProfile: "Chitkara students; budget PG operators",
    indicativeRentOrResale: "PG ₹5k–₹11k/mo; flats ₹7k–₹14k/mo",
    strengths: ["Low entry", "Dedicated university demand", "Less competition than Kharar town PG"],
    risks: ["Longer commutes", "Fringe infrastructure", "Lower appreciation than GMADA belts"],
    dueDiligence: ["Map pin distance to Chitkara", "Visit Banur/Rajpura night safety and road lighting", "Society PG rules"],
    mapSearchTip: "Rent map around Banur and Rajpura; buy on /buy/kharar/banur",
    guidePaths: ["/rentals/in/chandigarh/banur", "/buy/kharar/banur"],
    tags: ["chitkara", "banur", "rajpura", "chunni", "student", "budget", "invest"],
  },
];

function playbookBlob(p: TricityInvestmentPlaybook): string {
  return [
    p.id,
    p.title,
    p.strategy,
    p.areas.join(" "),
    p.budgetBand,
    p.horizon,
    p.bestFor,
    p.thesis,
    p.tenantOrBuyerProfile,
    p.indicativeRentOrResale,
    p.strengths.join(" "),
    p.risks.join(" "),
    p.tags.join(" "),
  ]
    .join(" ")
    .toLowerCase();
}

export function searchTricityInvestments(
  query: string,
  limit = 4
): TricityInvestmentPlaybook[] {
  const q = query.trim().toLowerCase();
  if (!q) return TRICITY_INVESTMENT_PLAYBOOKS.slice(0, limit);

  const scored = TRICITY_INVESTMENT_PLAYBOOKS.map((playbook) => {
    let score = 0;
    const blob = playbookBlob(playbook);
    if (playbook.id.includes(q) || q.includes(playbook.id)) score += 8;
    if (blob.includes(q)) score += 4;
    for (const token of q.split(/\s+/)) {
      if (token.length > 2 && blob.includes(token)) score += 1;
    }
    if (/\b(under|below)\s*40/i.test(q) && playbook.id.includes("under-40")) score += 6;
    if (/\b40.*90|mid/i.test(q) && playbook.id.includes("40-90")) score += 6;
    if (/(1\s*cr|crore|above\s*1)/i.test(q) && playbook.id.includes("above-1cr")) score += 6;
    if (/\b(yield|rental|roi)\b/i.test(q) && playbook.strategy.includes("yield")) score += 3;
    if (/\b(appreciation|plot|long)\b/i.test(q) && /appreciation|plot/.test(playbook.strategy)) score += 3;
    return { playbook, score };
  });

  return scored
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((s) => s.playbook);
}

export function matchInvestmentsByCriteria(opts: {
  budgetLakh?: number;
  strategy?: InvestmentStrategy;
  horizonYears?: number;
}): TricityInvestmentPlaybook[] {
  const { budgetLakh, strategy, horizonYears } = opts;
  let pool = [...TRICITY_INVESTMENT_PLAYBOOKS];

  if (strategy) {
    pool = pool.filter((p) => p.strategy === strategy || p.strategy === "mixed");
  }

  if (budgetLakh != null) {
    if (budgetLakh < 40) pool = pool.filter((p) => p.id.includes("under-40") || p.strategy === "plot-long-hold" || p.strategy === "student-yield");
    else if (budgetLakh <= 90) pool = pool.filter((p) => p.id.includes("40-90") || p.id.includes("under-40") || p.strategy === "rental-yield");
    else pool = pool.filter((p) => p.id.includes("above-1cr") || p.id.includes("40-90") || p.strategy === "capital-appreciation");
  }

  if (horizonYears != null && horizonYears < 5) {
    pool = pool.filter((p) => p.strategy === "rental-yield" || p.strategy === "student-yield" || p.strategy === "mixed");
  }

  return pool.slice(0, 4);
}

export function formatInvestmentPlaybook(p: TricityInvestmentPlaybook): Record<string, unknown> {
  return {
    id: p.id,
    title: p.title,
    strategy: p.strategy,
    areas: p.areas,
    budgetBand: p.budgetBand,
    horizon: p.horizon,
    bestFor: p.bestFor,
    thesis: p.thesis,
    tenantOrBuyerProfile: p.tenantOrBuyerProfile,
    indicativeRentOrResale: p.indicativeRentOrResale,
    strengths: p.strengths,
    risks: p.risks,
    dueDiligence: p.dueDiligence,
    mapSearchTip: p.mapSearchTip,
    guidePaths: p.guidePaths,
    tags: p.tags,
  };
}

/** Injected into agent system prompt — investment decision framework. */
export function formatTricityInvestmentBrief(): string {
  return `## Tricity investment framework (use \`searchTricityInvestments\` — never invent ROI %)
1. **Qualify:** yield vs appreciation | budget (₹ lakh) | horizon (years) | self-use vs pure invest | tenant type (professional / student / family).
2. **Cross-check:** buy map sale comps + rent map tenant demand in same micro-market (\`sampleListings\`, \`buildMapSearch\`).
3. **Yield plays:** Mohali Aerocity/Phase belts (professional), Zirakpur VIP (commuter), Kharar–CU + Jhanjeri (student PG).
4. **Appreciation plays:** New Chandigarh/Mullanpur plots, Kurali–Banur GMADA belts (5–10 yr hold, slow liquidity).
5. **Budget entry:** Under ₹40L → outer plots/fringe flats; ₹40–90L → 2 BHK Zirakpur/Phase 9/Kharar; ₹1Cr+ → Aerocity, Phase 7, premium projects.
6. **Projects:** /projects hub for RERA launches — compare with resale before token.
7. **Disclaimer:** cite indicative bands only; past rent ≠ future returns; not legal/tax advice.`;
}

export interface InvestPulseSection {
  heading: string;
  body: string;
  links?: { label: string; href: string }[];
}

export interface InvestPulseReport {
  id: string;
  quarter: string;
  title: string;
  publishedAt: string;
  summary: string;
  sections: InvestPulseSection[];
}

/** Static investor briefing — update quarterly; no fabricated market statistics. */
export const INVEST_PULSE_REPORTS: InvestPulseReport[] = [
  {
    id: "2026-q2-tricity",
    quarter: "Q2 2026",
    title: "Tricity Invest Pulse — yield corridors & project entry",
    publishedAt: "2026-04-01",
    summary:
      "Professional yield remains concentrated around Mohali IT Park and Aerocity; commuter yield on Zirakpur VIP Road; student PG demand anchored at Kharar–CU and emerging Jhanjeri. New Chandigarh and Kurali–Banur GMADA belts suit longer appreciation holds — verify every price on live maps.",
    sections: [
      {
        heading: "Yield corridors in focus",
        body:
          "Mohali Phase belts and Aerocity continue to attract furnished family and IT tenants. Zirakpur VIP offers lower entry with commuter trade-offs. Kharar–CU and Jhanjeri corridors reward operators who can run PG or multi-tenant models — confirm society rules before buying.",
        links: [
          { label: "Mohali investment guide", href: "/buy/mohali-investment-guide" },
          { label: "Zirakpur guide", href: "/buy/zirakpur-investment-guide" },
          { label: "Kharar guide", href: "/buy/kharar-investment-guide" },
        ],
      },
      {
        heading: "Appreciation & plot belts",
        body:
          "New Chandigarh and GMADA sectors along Kurali–Banur suit 5–10+ year holds. Liquidity is slower than prime Mohali — budget for longer exit timelines and full CLU/title diligence with your advocate.",
        links: [
          { label: "New Chandigarh guide", href: "/buy/new-chandigarh-investment-guide" },
          { label: "Kurali–Banur guide", href: "/buy/kurali-banur-investment-guide" },
        ],
      },
      {
        heading: "Project entry checklist",
        body:
          "RERA registration, builder track record, payment plan stress-test (use EMI + yield calculator), and possession timeline risk remain the top filters for pre-launch entry. Never pay booking amount without verifying RERA ID on the state portal.",
        links: [
          { label: "Browse projects", href: "/invest/projects" },
          { label: "Transaction guides", href: "/invest/advisor" },
        ],
      },
      {
        heading: "How to underwrite on RentalPins",
        body:
          "1) Shortlist on buy map → 2) Open rent comps for same viewport → 3) Run yield calculator → 4) Compare areas → 5) Post investor requirement or enquire on projects. Ask AI for playbooks — it will not invent ROI figures.",
        links: [
          { label: "Yield calculator", href: "/invest/calculator" },
          { label: "Compare areas", href: "/invest/compare" },
        ],
      },
    ],
  },
];

export function getLatestInvestPulse(): InvestPulseReport {
  return INVEST_PULSE_REPORTS[0]!;
}

export function getInvestPulseById(id: string): InvestPulseReport | undefined {
  return INVEST_PULSE_REPORTS.find((r) => r.id === id);
}

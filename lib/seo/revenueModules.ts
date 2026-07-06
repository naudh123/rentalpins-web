export type RevenueAudience = "owner" | "broker" | "pg_owner" | "builder" | "services";

export type RevenueCta = {
  id: string;
  audience: RevenueAudience;
  label: string;
  description: string;
  href: string;
  variant?: "primary" | "secondary";
};

const OWNER_CTAS: RevenueCta[] = [
  { id: "post-free", audience: "owner", label: "Post your rental free", description: "List flats, houses or rooms and reach tenants on the map.", href: "/post", variant: "primary" },
  { id: "boost", audience: "owner", label: "Boost your listing", description: "Get more visibility when tenants search your area.", href: "/post/boost", variant: "secondary" },
  { id: "verified-owner", audience: "owner", label: "Get verified owner badge", description: "Build trust with phone-verified profile and faster replies.", href: "/post", variant: "secondary" },
  { id: "more-calls", audience: "owner", label: "Get more tenant calls", description: "Fresh photos and accurate map pins improve inquiry rates.", href: "/post", variant: "secondary" },
  { id: "feature-top", audience: "owner", label: "Feature your property on top", description: "Promoted pins appear higher in map results.", href: "/post/boost", variant: "secondary" },
];

const BROKER_CTAS: RevenueCta[] = [
  { id: "broker-sub", audience: "broker", label: "Broker subscription", description: "Manage leads and listings from one dashboard.", href: "/property-owner-app", variant: "secondary" },
  { id: "lead-dash", audience: "broker", label: "Lead dashboard", description: "Track inquiries from map pins in your territories.", href: "/profile", variant: "secondary" },
  { id: "broker-premium", audience: "broker", label: "Premium visibility", description: "Stand out in competitive micro-markets.", href: "/post/boost", variant: "secondary" },
  { id: "verified-broker", audience: "broker", label: "Verified broker profile", description: "Phone-verified accounts reduce spam for tenants.", href: "/post", variant: "secondary" },
];

const PG_OWNER_CTAS: RevenueCta[] = [
  { id: "add-pg", audience: "pg_owner", label: "Add your PG", description: "Reach students near universities and colleges.", href: "/list-pg", variant: "primary" },
  { id: "promote-boys", audience: "pg_owner", label: "Promote boys PG", description: "Tag suitability and food plans in your listing.", href: "/list-pg", variant: "secondary" },
  { id: "promote-girls", audience: "pg_owner", label: "Promote girls PG", description: "Highlight security and curfew rules for parents.", href: "/list-pg", variant: "secondary" },
  { id: "student-leads", audience: "pg_owner", label: "Get student leads", description: "Session-start peaks drive map searches — list before intake.", href: "/list-pg", variant: "secondary" },
];

const BUILDER_CTAS: RevenueCta[] = [
  { id: "featured-project", audience: "builder", label: "Featured project page", description: "Showcase new launches to buyers and renters.", href: "/projects", variant: "secondary" },
  { id: "society-dash", audience: "builder", label: "Society rental dashboard", description: "Aggregate society-level rental inventory.", href: "/developers", variant: "secondary" },
  { id: "building-sponsor", audience: "builder", label: "Building profile sponsorship", description: "Sponsor building pages in high-demand corridors.", href: "/contact", variant: "secondary" },
];

const SERVICE_CTAS: RevenueCta[] = [
  { id: "rent-agreement", audience: "services", label: "Rent agreement", description: "Draft Punjab/Haryana rent agreements with clarity on deposit terms.", href: "/guides/rent-agreement-punjab", variant: "secondary" },
  { id: "tenant-verify", audience: "services", label: "Tenant verification", description: "Verify tenants before handover.", href: "/contact", variant: "secondary" },
  { id: "police-verify", audience: "services", label: "Police verification", description: "Tenant police verification support for owners.", href: "/contact", variant: "secondary" },
  { id: "packers", audience: "services", label: "Packers and movers", description: "Plan your move when shifting PG or flat.", href: "/contact", variant: "secondary" },
  { id: "cleaning", audience: "services", label: "Cleaning", description: "Deep clean before move-in or after vacating.", href: "/contact", variant: "secondary" },
  { id: "broadband", audience: "services", label: "Broadband", description: "Wi‑Fi setup for students and working tenants.", href: "/contact", variant: "secondary" },
  { id: "cctv", audience: "services", label: "CCTV", description: "Security cameras for PG and society gates.", href: "/contact", variant: "secondary" },
  { id: "interior", audience: "services", label: "Interior services", description: "Furnishing and modular kitchen for rental units.", href: "/contact", variant: "secondary" },
  { id: "pm", audience: "services", label: "Property management", description: "End-to-end rent collection and maintenance.", href: "/contact", variant: "secondary" },
];

export function getRevenueCtasForPage(opts?: {
  isStudentArea?: boolean;
  isSociety?: boolean;
  maxItems?: number;
}): RevenueCta[] {
  const max = opts?.maxItems ?? 8;
  const pool: RevenueCta[] = [
    OWNER_CTAS[0]!,
    ...(opts?.isStudentArea ? [PG_OWNER_CTAS[0]!, PG_OWNER_CTAS[3]!] : []),
    OWNER_CTAS[1]!,
    SERVICE_CTAS[0]!,
    BROKER_CTAS[0]!,
    ...(opts?.isSociety ? [BUILDER_CTAS[0]!] : []),
    SERVICE_CTAS[5]!,
    PG_OWNER_CTAS[1]!,
    OWNER_CTAS[2]!,
  ];
  const seen = new Set<string>();
  return pool.filter((c) => {
    if (seen.has(c.id)) return false;
    seen.add(c.id);
    return true;
  }).slice(0, max);
}

export const ALL_REVENUE_MODULES = {
  owner: OWNER_CTAS,
  broker: BROKER_CTAS,
  pg_owner: PG_OWNER_CTAS,
  builder: BUILDER_CTAS,
  services: SERVICE_CTAS,
};

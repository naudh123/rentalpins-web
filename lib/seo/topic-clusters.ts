/** Topic cluster architecture for internal linking and GEO entity graphs. */

export interface TopicClusterLink {
  label: string;
  href: string;
  description?: string;
}

export interface TopicCluster {
  id: string;
  name: string;
  hubPath: string;
  links: TopicClusterLink[];
}

export const MOHALI_PROPERTY_CLUSTER: TopicCluster = {
  id: "mohali-property",
  name: "Mohali property",
  hubPath: "/rentals/in/chandigarh/mohali",
  links: [
    { label: "Mohali rentals", href: "/rentals/in/chandigarh/mohali", description: "Map-based owner-direct rentals" },
    { label: "Mohali flats", href: "/rentals/in/chandigarh/mohali/flats", description: "Flat and apartment rentals" },
    { label: "Mohali PG", href: "/rentals/in/chandigarh/mohali/pg", description: "PG and shared accommodation" },
    { label: "Mohali buy property", href: "/buy/mohali", description: "Properties for sale" },
    { label: "Mohali investment guide", href: "/buy/mohali-investment-guide", description: "Buyer and investor context" },
    { label: "Mohali market insights", href: "/rental-market-insights/mohali", description: "Rental market overview" },
  ],
};

export const CHANDIGARH_TRICITY_CLUSTER: TopicCluster = {
  id: "chandigarh-tricity",
  name: "Chandigarh Tricity",
  hubPath: "/rentals/in/chandigarh",
  links: [
    { label: "Chandigarh Tricity rentals", href: "/rentals/in/chandigarh" },
    { label: "Mohali", href: "/rentals/in/chandigarh/mohali" },
    { label: "Panchkula", href: "/rentals/in/chandigarh/panchkula" },
    { label: "Zirakpur", href: "/rentals/in/chandigarh/zirakpur" },
    { label: "New Chandigarh", href: "/rentals/in/chandigarh/new-chandigarh" },
    { label: "Airport Road", href: "/buy/mohali/airport-road" },
    { label: "PR7 Corridor", href: "/buy/mohali/pr7-corridor" },
    { label: "Tricity market insights", href: "/property-market-insights/chandigarh-tricity" },
  ],
};

export const BUYER_REQUIREMENT_CLUSTER: TopicCluster = {
  id: "buyer-requirements",
  name: "Buyer requirements",
  hubPath: "/buy/requirements",
  links: [
    { label: "Post requirement", href: "/buy/requirements" },
    { label: "Browse buyer demand", href: "/buy/requirements/chandigarh" },
    { label: "Developers", href: "/developers" },
    { label: "List property for sale", href: "/buy/post" },
    { label: "Buy map search", href: "/buy/search" },
  ],
};

export const INVESTMENT_CLUSTER: TopicCluster = {
  id: "investment",
  name: "Investment intelligence",
  hubPath: "/property-market-insights/chandigarh-tricity",
  links: [
    { label: "New Chandigarh investment", href: "/buy/new-chandigarh-investment-guide" },
    { label: "Mohali PR7", href: "/buy/mohali/pr7-corridor" },
    { label: "Airport Road", href: "/buy/mohali/airport-road" },
    { label: "Commercial property", href: "/rentals/in/chandigarh/commercial" },
    { label: "New projects", href: "/projects" },
    { label: "Mohali investment guide", href: "/buy/mohali-investment-guide" },
  ],
};

export const TOPIC_CLUSTERS: TopicCluster[] = [
  MOHALI_PROPERTY_CLUSTER,
  CHANDIGARH_TRICITY_CLUSTER,
  BUYER_REQUIREMENT_CLUSTER,
  INVESTMENT_CLUSTER,
];

export function getTopicCluster(id: string): TopicCluster | undefined {
  return TOPIC_CLUSTERS.find((c) => c.id === id);
}

export function clustersForPlace(placeSlug: string): TopicCluster[] {
  const slug = placeSlug.toLowerCase();
  const matches: TopicCluster[] = [];
  if (slug.includes("mohali")) matches.push(MOHALI_PROPERTY_CLUSTER);
  if (
    slug.includes("chandigarh") ||
    slug.includes("panchkula") ||
    slug.includes("zirakpur") ||
    slug.includes("tricity")
  ) {
    matches.push(CHANDIGARH_TRICITY_CLUSTER);
  }
  matches.push(BUYER_REQUIREMENT_CLUSTER, INVESTMENT_CLUSTER);
  return [...new Map(matches.map((c) => [c.id, c])).values()];
}

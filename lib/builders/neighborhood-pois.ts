export type PoiCategory = "connectivity" | "education" | "healthcare" | "retail" | "recreation" | "other";

export interface NeighborhoodPoi {
  label: string;
  category: PoiCategory;
}

const CATEGORY_RULES: { category: PoiCategory; pattern: RegExp }[] = [
  { category: "connectivity", pattern: /airport|highway|nh-|expressway|metro|road|it city|gmada|sector \d+/i },
  { category: "education", pattern: /school|college|university|institute|academy/i },
  { category: "healthcare", pattern: /hospital|clinic|medical|medicity|health/i },
  { category: "retail", pattern: /mall|market|shopping|retail|commercial|hub/i },
  { category: "recreation", pattern: /park|golf|club|garden|lake|stadium|green/i },
];

export function categorizeLandmark(label: string): PoiCategory {
  for (const { category, pattern } of CATEGORY_RULES) {
    if (pattern.test(label)) return category;
  }
  return "other";
}

export function landmarksToPois(landmarks: string[]): NeighborhoodPoi[] {
  return landmarks.map((label) => ({
    label,
    category: categorizeLandmark(label),
  }));
}

export const POI_CATEGORY_LABELS: Record<PoiCategory, string> = {
  connectivity: "Connectivity",
  education: "Education",
  healthcare: "Healthcare",
  retail: "Shopping & retail",
  recreation: "Parks & recreation",
  other: "Nearby",
};

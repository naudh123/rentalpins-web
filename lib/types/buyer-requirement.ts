/** Buyer demand posted on the RentalPins Buy requirement board. */

export type BuyerRequirementPurpose = "Self use" | "Investment" | "Both";

export type InvestorHoldPeriod =
  | "Under 3 years"
  | "3–5 years"
  | "5–10 years"
  | "10+ years";

export type InvestorTargetYield =
  | "Any"
  | "4–6% net"
  | "6–8% net"
  | "8%+ net"
  | "Appreciation focus";

export type InvestorTenantType =
  | "Any"
  | "Family / professional"
  | "Student / PG"
  | "Commercial tenant";

export interface BuyerRequirement {
  id: string;
  userId: string;
  propertyType: string;
  budgetMin: number | null;
  budgetMax: number | null;
  /** Display label e.g. "₹50L – ₹80L" */
  budgetLabel: string;
  city: string;
  locality: string;
  timeline: string;
  purpose: BuyerRequirementPurpose;
  /** Investor-only fields (optional for legacy rows). */
  holdPeriod?: InvestorHoldPeriod | null;
  targetYield?: InvestorTargetYield | null;
  tenantType?: InvestorTenantType | null;
  notes: string | null;
  isActive: boolean;
  source: "web";
  createdAtMs: number;
  updatedAtMs: number;
}

export interface CreateBuyerRequirementInput {
  propertyType: string;
  budgetMin: number | null;
  budgetMax: number | null;
  city: string;
  locality: string;
  timeline: string;
  purpose: BuyerRequirementPurpose;
  holdPeriod?: InvestorHoldPeriod;
  targetYield?: InvestorTargetYield;
  tenantType?: InvestorTenantType;
  notes?: string;
}

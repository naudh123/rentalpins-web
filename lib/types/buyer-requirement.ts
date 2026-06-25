/** Buyer demand posted on the RentalPins Buy requirement board. */

export type BuyerRequirementPurpose = "Self use" | "Investment" | "Both";

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
  notes?: string;
}

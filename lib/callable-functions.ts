"use client";

import { callHttpsFunction, type CallHttpsFunctionOptions } from "@/lib/firebase-callable";

export const CALLABLE_REGION_US = "us-central1";
export const CALLABLE_REGION_ASIA = "asia-south1";

const PAYMENT_OPTS: CallHttpsFunctionOptions = {
  timeoutMs: 90_000,
  refreshAuthToken: true,
};

const AI_SEARCH_OPTS: CallHttpsFunctionOptions = {
  timeoutMs: 35_000,
  refreshAuthToken: true,
  allowAnonymous: true,
};

export interface RazorpayOrderResult {
  orderId: string;
  key: string;
  totalAmount: number;
  currency: string;
}

export interface PayPalOrderResult {
  approvalUrl: string;
}

export function createRazorpayOrderForListing(
  data: Record<string, unknown>
): Promise<RazorpayOrderResult> {
  return callHttpsFunction<RazorpayOrderResult>(
    "createRazorpayOrderForListing",
    data,
    CALLABLE_REGION_US,
    PAYMENT_OPTS
  );
}

export function createPayPalOrderForListing(
  data: Record<string, unknown>
): Promise<PayPalOrderResult> {
  return callHttpsFunction<PayPalOrderResult>(
    "createPayPalOrder",
    data,
    CALLABLE_REGION_US,
    PAYMENT_OPTS
  );
}

export function parseSearchQueryCallable(
  data: Record<string, unknown>
): Promise<Record<string, unknown>> {
  return callHttpsFunction<Record<string, unknown>>(
    "parseSearchQuery",
    data,
    CALLABLE_REGION_ASIA,
    AI_SEARCH_OPTS
  );
}

export function restoreListingForEditing(listingId: string): Promise<{ success?: boolean }> {
  return callHttpsFunction<{ success?: boolean }>(
    "restoreListingForEditing",
    { listingId },
    CALLABLE_REGION_US,
    PAYMENT_OPTS
  );
}

export interface MarkListingClosedOptions {
  listingId: string;
  reason?: "rented" | "sold";
  leaseEndAtMs?: number;
}

export function markListingAsClosed(
  options: MarkListingClosedOptions
): Promise<{ success?: boolean }> {
  return callHttpsFunction<{ success?: boolean }>(
    "markListingAsClosed",
    {
      listingId: options.listingId,
      reason: options.reason ?? "rented",
      ...(options.leaseEndAtMs != null ? { leaseEndAtMs: options.leaseEndAtMs } : {}),
    },
    CALLABLE_REGION_US,
    PAYMENT_OPTS
  );
}

/** @deprecated Use markListingAsClosed */
export function markListingAsRented(listingId: string): Promise<{ success?: boolean }> {
  return markListingAsClosed({ listingId, reason: "rented" });
}

export function archiveListingByOwner(listingId: string): Promise<{ success?: boolean }> {
  return callHttpsFunction<{ success?: boolean }>(
    "archiveListingByOwner",
    { listingId },
    CALLABLE_REGION_US,
    PAYMENT_OPTS
  );
}

export function finalizeBoost(data: {
  listingId: string;
  boostPlanId: string;
}): Promise<Record<string, unknown>> {
  return callHttpsFunction<Record<string, unknown>>(
    "finalizeBoost",
    data,
    CALLABLE_REGION_ASIA,
    PAYMENT_OPTS
  );
}

export function createRazorpayOrderForCredits(data: {
  productId: string;
}): Promise<RazorpayOrderResult & { credits?: number }> {
  return callHttpsFunction(
    "createRazorpayOrderForCredits",
    data,
    CALLABLE_REGION_US,
    PAYMENT_OPTS
  );
}

export function verifyAndAddCredits(data: {
  orderId: string;
  productId: string;
}): Promise<{ success?: boolean; creditsAdded?: number }> {
  return callHttpsFunction(
    "verifyAndAddCredits",
    data,
    CALLABLE_REGION_US,
    PAYMENT_OPTS
  );
}

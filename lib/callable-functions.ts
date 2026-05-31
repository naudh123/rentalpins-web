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

import { describe, expect, it } from "vitest";
import {
  listingMatchesTransaction,
  parseTransactionType,
} from "@/lib/transaction-type";

describe("transaction-type", () => {
  it("defaults missing values to rent", () => {
    expect(parseTransactionType(undefined)).toBe("rent");
    expect(parseTransactionType("rent")).toBe("rent");
    expect(parseTransactionType("sale")).toBe("sale");
  });

  it("filters rent and sale listings", () => {
    expect(listingMatchesTransaction(undefined, "rent")).toBe(true);
    expect(listingMatchesTransaction("rent", "rent")).toBe(true);
    expect(listingMatchesTransaction("sale", "rent")).toBe(false);
    expect(listingMatchesTransaction("sale", "sale")).toBe(true);
    expect(listingMatchesTransaction(undefined, "sale")).toBe(false);
  });
});

/** Rent vs sale listing mode — add-only Firestore field (default rent). */

export const TRANSACTION_TYPES = ["rent", "sale"] as const;
export type TransactionType = (typeof TRANSACTION_TYPES)[number];

export const DEFAULT_TRANSACTION_TYPE: TransactionType = "rent";

export function parseTransactionType(raw: unknown): TransactionType {
  return raw === "sale" ? "sale" : "rent";
}

/** Legacy listings without the field are treated as rent. */
export function listingMatchesTransaction(
  listingTransaction: TransactionType | undefined,
  filter: TransactionType
): boolean {
  const actual = listingTransaction ?? "rent";
  return actual === filter;
}

export function isSaleTransaction(t: TransactionType | undefined): boolean {
  return t === "sale";
}

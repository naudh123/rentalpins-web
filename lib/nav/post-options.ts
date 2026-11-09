/** The three things an owner can post — shown by the global "Post" chooser. */

export type PostIntent = "rent" | "sell" | "invest";

export interface PostOption {
  intent: PostIntent;
  /** App-relative path (wrap with appPath before linking). */
  href: string;
  title: string;
  description: string;
  /** Short tag shown on the card. */
  badge: string;
}

export const POST_OPTIONS: readonly PostOption[] = [
  {
    intent: "rent",
    href: "/post",
    title: "Rent out",
    description: "Flat, house, PG, room or commercial space for monthly rent.",
    badge: "Owners",
  },
  {
    intent: "sell",
    href: "/buy/post",
    title: "Sell",
    description: "List a flat, house, plot or commercial property for sale.",
    badge: "Owners",
  },
  {
    intent: "invest",
    href: "/projects/post",
    title: "Invest",
    description: "List a new project for investors and buyers, and get verified leads.",
    badge: "Developers",
  },
] as const;

/** Every route that belongs to a posting flow (used for the nav button's active state). */
const POST_FLOW_PREFIXES = ["/post", "/buy/post", "/projects/post"] as const;

export function isPostFlowPath(normalizedPathname: string | null): boolean {
  if (!normalizedPathname) return false;
  return POST_FLOW_PREFIXES.some(
    (p) => normalizedPathname === p || normalizedPathname.startsWith(`${p}/`)
  );
}

/** Which option the user is already on, so the chooser can mark it. */
export function currentPostIntent(normalizedPathname: string | null): PostIntent | null {
  if (!normalizedPathname) return null;
  for (const option of POST_OPTIONS) {
    if (normalizedPathname === option.href || normalizedPathname.startsWith(`${option.href}/`)) {
      return option.intent;
    }
  }
  return null;
}

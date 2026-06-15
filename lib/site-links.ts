import { appPath } from "./config";

export const PLAY_STORE_URL =
  "https://play.google.com/store/apps/details?id=com.rentit_clean.rentit";

export const SOCIAL_LINKS = [
  { label: "Facebook", href: "https://www.facebook.com/rentalpins", abbr: "f" },
  { label: "Instagram", href: "https://www.instagram.com/rentalpins/", abbr: "ig" },
  { label: "X", href: "https://x.com/rentalpins", abbr: "X" },
] as const;

export const LEGAL_LINKS = [
  { label: "Privacy Policy", href: appPath("/privacy-policy") },
  { label: "Terms of Service", href: appPath("/terms") },
  { label: "Refund Policy", href: appPath("/refund-policy") },
  { label: "Delete Account", href: appPath("/delete-account") },
] as const;

export const COMPANY_LINKS = [
  { label: "About", href: appPath("/about") },
  { label: "Contact", href: appPath("/contact") },
  { label: "Blog", href: appPath("/blog") },
  { label: "Write blog", href: appPath("/blog/write") },
] as const;

export const EXPLORE_LINKS = [
  { label: "Map search", href: appPath("/search") },
  { label: "Browse by city", href: appPath("/rentals") },
  { label: "Post a listing", href: appPath("/post") },
  { label: "Sign in", href: appPath("/auth/login") },
  { label: "Get Android App", href: PLAY_STORE_URL, external: true },
] as const;

export const BUY_EXPLORE_LINKS = [
  { label: "Buy map", href: appPath("/buy/search") },
  { label: "Mohali for sale", href: appPath("/buy/mohali") },
  { label: "Kharar for sale", href: appPath("/buy/kharar") },
  { label: "List for sale", href: appPath("/buy/post") },
  { label: "Rentals map", href: appPath("/search") },
] as const;

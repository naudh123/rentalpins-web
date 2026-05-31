/** Official RentalPins brand colours (logo). */
export const BRAND = {
  navy: "#1E3A6E",
  navyDark: "#0F2554",
  orange: "#E8501A",
  orangeHover: "#D34415",
  white: "#FFFFFF",
  bg: "#F8FAFC",
  surface: "#FFFFFF",
  text: "#0F1C35",
  muted: "#6B7A99",
  border: "#DDE3F0",
  /** @deprecated use `orange` — kept for marketing/AreaClient */
  accent: "#E8501A",
  accentLight: "#FF7A45",
  /** @deprecated use `navy` */
  primary: "#1E3A6E",
} as const;

export const UI = {
  shadowCard: "0 12px 40px -12px rgba(30, 58, 110, 0.12)",
  shadowDropdown: "0 24px 64px -12px rgba(30, 58, 110, 0.16)",
  shadowSoft: "0 4px 20px rgba(15, 28, 53, 0.06)",
  shadowOrange: "0 8px 24px -6px rgba(232, 80, 26, 0.35)",
} as const;

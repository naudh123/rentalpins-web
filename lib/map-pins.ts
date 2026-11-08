/** Price labels and custom marker icons for map pins. */

import { formatListingPrice, effectiveListingPrice } from "@/lib/listing-price";
import type { MapPinLabelTier } from "@/lib/map-zoom-tier";

/** Rent map pins — production navy. Sale map pins — amber (see --brand-amber). */
export const MAP_PIN_NAVY = "#1E3A6E";
export const MAP_PIN_NAVY_DARK = "#0F2554";
export const MAP_PIN_NAVY_HIGHLIGHT = "#2A4F8F";
export const MAP_PIN_ORANGE = "#E8501A";
export const MAP_PIN_ORANGE_DARK = "#D34415";
export const MAP_PIN_AMBER = "#fbb316";
export const MAP_PIN_AMBER_DARK = "#e5a010";

export const MAP_PIN_PALETTE = {
  rent: {
    fill: MAP_PIN_NAVY,
    fillDark: MAP_PIN_NAVY_DARK,
    highlightFill: MAP_PIN_NAVY_HIGHLIGHT,
    accent: MAP_PIN_ORANGE,
    accentDark: MAP_PIN_ORANGE_DARK,
    textOnFill: "#ffffff",
    textPromoted: MAP_PIN_NAVY,
  },
  sale: {
    fill: MAP_PIN_AMBER,
    fillDark: MAP_PIN_AMBER_DARK,
    navy: MAP_PIN_NAVY,
    navyDark: MAP_PIN_NAVY_DARK,
    textOnFill: MAP_PIN_NAVY,
    textOnNavy: "#ffffff",
    textPromoted: MAP_PIN_NAVY,
  },
} as const;

export interface PriceMarkerStyle {
  selected?: boolean;
  highlighted?: boolean;
  promoted?: boolean;
  /** Gold palette for sale listings on map. */
  sale?: boolean;
}

export function resolveMapPinColors(style: PriceMarkerStyle): {
  bg: string;
  stroke: string;
  text: string;
} {
  const { selected = false, highlighted = false, promoted = false, sale = false } = style;

  if (sale) {
    const p = MAP_PIN_PALETTE.sale;
    if (promoted) {
      return { bg: "#ffffff", stroke: p.fill, text: p.textPromoted };
    }
    if (selected || highlighted) {
      return { bg: p.fill, stroke: p.navy, text: p.textOnFill };
    }
    return { bg: p.fill, stroke: p.fillDark, text: p.textOnFill };
  }

  const p = MAP_PIN_PALETTE.rent;
  if (promoted) {
    return { bg: "#ffffff", stroke: p.accent, text: p.textPromoted };
  }
  if (selected) {
    return { bg: p.accent, stroke: p.accentDark, text: p.textOnFill };
  }
  if (highlighted) {
    return { bg: p.highlightFill, stroke: p.accent, text: p.textOnFill };
  }
  return { bg: p.fill, stroke: p.fillDark, text: p.textOnFill };
}

function isSalePinListing(listing: {
  transactionType?: string;
  priceUnit?: string;
}): boolean {
  if (listing.transactionType === "sale") return true;
  return (listing.priceUnit ?? "").trim().toLowerCase() === "total";
}

export function formatMapPinLabel(
  listing: {
    price: number;
    homeIso?: string | null;
    category?: string;
    priceUnit?: string;
    transactionType?: string;
  },
  labelTier: MapPinLabelTier
): string {
  const priceInput = {
    price: listing.price,
    priceUnit: listing.priceUnit,
    category: listing.category,
    transactionType: listing.transactionType,
    homeIso: listing.homeIso ?? undefined,
  };

  const sale = isSalePinListing(listing);
  const price = effectiveListingPrice(priceInput);

  if (price <= 0) return "Ask";

  return formatPinPrice(price, listing.homeIso ?? undefined, {
    category: listing.category,
    priceUnit: listing.priceUnit,
    transactionType: sale ? "sale" : listing.transactionType,
  });
}

export function formatPinPrice(
  price: number,
  homeIso?: string,
  opts?: {
    category?: string;
    priceUnit?: string;
    transactionType?: string;
  }
): string {
  if (price <= 0) return "Ask";
  const sale =
    opts?.transactionType === "sale" ||
    (opts?.priceUnit ?? "").trim().toLowerCase() === "total";
  if (opts?.category) {
    return formatListingPrice(
      {
        price,
        priceUnit: opts.priceUnit,
        category: opts.category,
        transactionType: sale ? "sale" : opts.transactionType,
        homeIso,
      },
      { compact: true, sale }
    );
  }
  const locale = homeIso === "IN" ? "en-IN" : undefined;
  if (price >= 10_000_000) {
    return `${(price / 10_000_000).toFixed(1)}Cr`;
  }
  if (price >= 100_000) {
    return `${Math.round(price / 100_000)}L`;
  }
  if (price >= 1000) {
    return `${Math.round(price / 1000)}k`;
  }
  return price.toLocaleString(locale, { maximumFractionDigits: 0 });
}

const PIN_SHADOW_FILTER = `<filter id="pinShadow" x="-30%" y="-20%" width="160%" height="160%">
  <feDropShadow dx="0" dy="1.5" stdDeviation="1.5" flood-color="#0F2554" flood-opacity="0.35"/>
</filter>`;

function escapeXml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function pillMarkerSvg(opts: {
  label: string;
  w: number;
  h: number;
  bg: string;
  stroke: string;
  text: string;
  strokeWidth: number;
}): string {
  const { label, w, h, bg, stroke, text, strokeWidth } = opts;
  const bodyH = 22;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h + 8}" viewBox="0 0 ${w} ${h + 8}">
  <defs>${PIN_SHADOW_FILTER}</defs>
  <g filter="url(#pinShadow)">
    <rect x="1" y="1" width="${w - 2}" height="${bodyH}" rx="11" fill="${bg}" stroke="${stroke}" stroke-width="${strokeWidth}"/>
    <text x="${w / 2}" y="15" text-anchor="middle" font-family="Arial,Helvetica,sans-serif" font-size="11" font-weight="400" fill="${text}">${escapeXml(label)}</text>
    <path d="M${w / 2 - 5} 23 L${w / 2 + 5} 23 L${w / 2} ${h + 6} Z" fill="${bg}" stroke="${stroke}" stroke-width="1"/>
  </g>
</svg>`;
}

export function buildPriceMarkerIcon(
  priceLabel: string,
  style: PriceMarkerStyle,
  googleMaps: typeof google.maps
): google.maps.Icon {
  const { selected = false, highlighted = false, promoted = false } = style;
  const { bg, stroke, text } = resolveMapPinColors(style);
  const strokeWidth = selected ? 2.5 : highlighted || promoted ? 2 : 1.5;
  const baseW = Math.min(92, Math.max(48, priceLabel.length * 7.5 + 22));
  const w = selected ? baseW + 4 : baseW;
  const h = selected ? 32 : 30;

  const svg = pillMarkerSvg({
    label: priceLabel,
    w,
    h,
    bg,
    stroke,
    text,
    strokeWidth,
  });

  return {
    url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`,
    scaledSize: new googleMaps.Size(w, h + 8),
    anchor: new googleMaps.Point(w / 2, h + 8),
  };
}

const dotIconCache = new Map<string, google.maps.Icon>();

/** Zillow-style small dot used for every listing at city zoom (price shows when selected). */
export function buildDotMarkerIcon(
  style: PriceMarkerStyle,
  googleMaps: typeof google.maps
): google.maps.Icon {
  const { bg } = resolveMapPinColors({ promoted: false, sale: style.sale });
  const fill = style.promoted ? MAP_PIN_ORANGE : bg;
  const cacheKey = fill;
  const cached = dotIconCache.get(cacheKey);
  if (cached) return cached;
  const size = 14;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <circle cx="7" cy="7" r="5.5" fill="${fill}" stroke="#ffffff" stroke-width="1.5"/>
</svg>`;
  const icon = {
    url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`,
    scaledSize: new googleMaps.Size(size, size),
    anchor: new googleMaps.Point(size / 2, size / 2),
  };
  dotIconCache.set(cacheKey, icon);
  return icon;
}

const hoverRingCache = new Map<string, google.maps.Icon>();

/** Lightweight ring shown under list-hovered pins (no price-pill SVG rebuild). */
export function buildHoverRingIcon(
  googleMaps: typeof google.maps,
  sale = false
): google.maps.Icon {
  const stroke = sale ? MAP_PIN_PALETTE.sale.fill : MAP_PIN_PALETTE.rent.fill;
  const cacheKey = sale ? "sale" : "rent";
  const cached = hoverRingCache.get(cacheKey);
  if (cached) return cached;

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40">
  <circle cx="20" cy="20" r="15" fill="none" stroke="${stroke}" stroke-width="2.5" opacity="0.9"/>
</svg>`;
  const icon = {
    url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`,
    scaledSize: new googleMaps.Size(40, 40),
    anchor: new googleMaps.Point(20, 36),
  };
  hoverRingCache.set(cacheKey, icon);
  return icon;
}

/** Zillow-style building pin — "N units" when zoomed in. */
export function buildUnitCountMarkerIcon(
  count: number,
  style: PriceMarkerStyle,
  googleMaps: typeof google.maps
): google.maps.Icon {
  const { selected = false, highlighted = false } = style;
  const { bg, stroke, text } = resolveMapPinColors(style);
  const label = count === 1 ? "1 unit" : `${count} units`;
  const strokeWidth = selected ? 2.5 : highlighted ? 2 : 1.5;
  const baseW = Math.min(96, Math.max(52, label.length * 7 + 24));
  const w = selected ? baseW + 4 : baseW;
  const h = selected ? 32 : 30;

  const svg = pillMarkerSvg({
    label,
    w,
    h,
    bg,
    stroke,
    text,
    strokeWidth,
  });

  return {
    url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`,
    scaledSize: new googleMaps.Size(w, h + 8),
    anchor: new googleMaps.Point(w / 2, h + 8),
  };
}

/** Price labels and custom marker icons for map pins. */

export function formatPinPrice(price: number, homeIso?: string): string {
  if (price <= 0) return "Ask";
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

export interface PriceMarkerStyle {
  selected?: boolean;
  highlighted?: boolean;
  promoted?: boolean;
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
  fontWeight?: number;
}): string {
  const { label, w, h, bg, stroke, text, strokeWidth, fontWeight = 600 } = opts;
  const bodyH = 22;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h + 8}" viewBox="0 0 ${w} ${h + 8}">
  <defs>${PIN_SHADOW_FILTER}</defs>
  <g filter="url(#pinShadow)">
    <rect x="1" y="1" width="${w - 2}" height="${bodyH}" rx="11" fill="${bg}" stroke="${stroke}" stroke-width="${strokeWidth}"/>
    <text x="${w / 2}" y="15" text-anchor="middle" font-family="system-ui,sans-serif" font-size="11" font-weight="${fontWeight}" fill="${text}">${escapeXml(label)}</text>
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

  const bg = selected
    ? "#E8501A"
    : highlighted
      ? "#2A4F8F"
      : promoted
        ? "#ffffff"
        : "#1E3A6E";
  const stroke = selected
    ? "#D34415"
    : highlighted
      ? "#E8501A"
      : promoted
        ? "#E8501A"
        : "#0F2554";
  const text = selected || highlighted ? "#ffffff" : promoted ? "#1E3A6E" : "#ffffff";
  const strokeWidth = selected ? 2.5 : highlighted || promoted ? 2 : 1.5;
  const baseW = Math.min(88, Math.max(44, priceLabel.length * 7 + 20));
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

let cachedHoverRingIcon: google.maps.Icon | undefined;

/** Lightweight ring shown under list-hovered pins (no price-pill SVG rebuild). */
export function buildHoverRingIcon(
  googleMaps: typeof google.maps
): google.maps.Icon {
  if (cachedHoverRingIcon) return cachedHoverRingIcon;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40">
  <circle cx="20" cy="20" r="15" fill="none" stroke="#E8501A" stroke-width="2.5" opacity="0.9"/>
</svg>`;
  cachedHoverRingIcon = {
    url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`,
    scaledSize: new googleMaps.Size(40, 40),
    anchor: new googleMaps.Point(20, 36),
  };
  return cachedHoverRingIcon;
}

/** Zillow-style building pin — "N units" when zoomed in. */
export function buildUnitCountMarkerIcon(
  count: number,
  style: PriceMarkerStyle,
  googleMaps: typeof google.maps
): google.maps.Icon {
  const { selected = false, highlighted = false } = style;
  const label = count === 1 ? "1 unit" : `${count} units`;
  const bg = selected ? "#E8501A" : highlighted ? "#2A4F8F" : "#1E3A6E";
  const stroke = selected ? "#D34415" : highlighted ? "#E8501A" : "#0F2554";
  const text = "#ffffff";
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
    fontWeight: 700,
  });

  return {
    url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`,
    scaledSize: new googleMaps.Size(w, h + 8),
    anchor: new googleMaps.Point(w / 2, h + 8),
  };
}

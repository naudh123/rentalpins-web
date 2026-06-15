/** New Chandigarh (Mullanpur) GMADA sector buy pages — mohali hub. */

export const NEW_CHANDIGARH_SECTOR_NUMBERS = [
  105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120,
] as const;

export type NewChandigarhSectorNumber = (typeof NEW_CHANDIGARH_SECTOR_NUMBERS)[number];

export function newChandigarhSectorSlug(sector: number): string {
  return `new-chandigarh-sector-${sector}`;
}

export const NEW_CHANDIGARH_BUY_SECTOR_KEYS = NEW_CHANDIGARH_SECTOR_NUMBERS.map(
  (n) => `mohali/${newChandigarhSectorSlug(n)}` as const
);

/** Approximate Mullanpur grid centres for map-first sale search. */
function ncSectorMapCenter(sector: number): { lat: number; lng: number } {
  const anchors: Record<number, { lat: number; lng: number }> = {
    105: { lat: 30.752, lng: 76.632 },
    108: { lat: 30.758, lng: 76.642 },
    110: { lat: 30.762, lng: 76.652 },
    112: { lat: 30.766, lng: 76.658 },
    115: { lat: 30.768, lng: 76.648 },
    117: { lat: 30.772, lng: 76.655 },
    118: { lat: 30.776, lng: 76.662 },
    120: { lat: 30.78, lng: 76.668 },
  };
  if (anchors[sector]) return anchors[sector]!;

  const idx = sector - 105;
  const row = Math.floor(idx / 4);
  const col = idx % 4;
  return {
    lat: 30.752 - row * 0.0035 + col * 0.001,
    lng: 76.632 + col * 0.005 + row * 0.002,
  };
}

function adjacentNcSectors(sector: number): { hubSlug: string; areaSlug: string; label: string }[] {
  const idx = NEW_CHANDIGARH_SECTOR_NUMBERS.indexOf(sector as NewChandigarhSectorNumber);
  const links: { hubSlug: string; areaSlug: string; label: string }[] = [
    { hubSlug: "mohali", areaSlug: "new-chandigarh", label: "New Chandigarh hub" },
  ];
  if (idx > 0) {
    const prev = NEW_CHANDIGARH_SECTOR_NUMBERS[idx - 1]!;
    links.push({
      hubSlug: "mohali",
      areaSlug: newChandigarhSectorSlug(prev),
      label: `Sector ${prev}`,
    });
  }
  if (idx >= 0 && idx < NEW_CHANDIGARH_SECTOR_NUMBERS.length - 1) {
    const next = NEW_CHANDIGARH_SECTOR_NUMBERS[idx + 1]!;
    links.push({
      hubSlug: "mohali",
      areaSlug: newChandigarhSectorSlug(next),
      label: `Sector ${next}`,
    });
  }
  links.push({ hubSlug: "mohali", areaSlug: "sector-88", label: "Sector 88" });
  return links;
}

export function buildNewChandigarhSectorPage(sector: number) {
  const areaSlug = newChandigarhSectorSlug(sector);
  const center = ncSectorMapCenter(sector);

  return {
    hubSlug: "mohali",
    areaSlug,
    slug: areaSlug,
    listingAreaSlug: "mohali",
    cityName: "Mohali",
    areaName: `Sector ${sector}, New Chandigarh`,
    placeQuery: `Sector ${sector}, New Chandigarh Mullanpur`,
    eyebrow: "RentalPins Buy · New Chandigarh",
    headline: `Property for sale in Sector ${sector}, New Chandigarh`,
    subhead: `Mullanpur GMADA Sector ${sector} — owner-direct plots, villas, and society flats on the sale map.`,
    mapCenter: center,
    mapZoom: 14,
    nearbyBuyAreas: adjacentNcSectors(sector),
    highlights: [
      {
        title: "Mullanpur master plan",
        desc: `Sector ${sector} is part of the New Chandigarh plotted and villa belt north of GMADA Mohali.`,
      },
      {
        title: "Premium inventory",
        desc: "Compare plotted, villa, and society resale pins before site visits.",
      },
      {
        title: "Owner-direct",
        desc: "Message sellers from map pins — verify title and development charges.",
      },
    ],
    faqs: [
      {
        q: `Why buy in Sector ${sector} New Chandigarh?`,
        a: "Larger plot sizes and master-planned layout vs inner Mohali — factor commute and infrastructure maturity.",
      },
      {
        q: `What is listed in Sector ${sector}?`,
        a: "Plots, villas, and some society flats — filter Property on the sale map.",
      },
      {
        q: `How do I list in Sector ${sector}?`,
        a: `Post List for sale with Sector ${sector}, New Chandigarh, and society name in the title.`,
      },
    ],
  };
}

export function buildAllNewChandigarhSectorPages() {
  const pages: Record<string, ReturnType<typeof buildNewChandigarhSectorPage>> = {};
  for (const sector of NEW_CHANDIGARH_SECTOR_NUMBERS) {
    const key = `mohali/${newChandigarhSectorSlug(sector)}`;
    pages[key] = buildNewChandigarhSectorPage(sector);
  }
  return pages;
}

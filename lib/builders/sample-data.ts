/** Development-only sample data for builder microsites module. */

export const SAMPLE_BUILDER = {
  name: "ABC Developers",
  slug: "abc-developers",
  description:
    "ABC Developers is a trusted name in Mohali real estate with over 15 years of experience delivering premium plotted developments and residential projects across the Tricity region.",
  logoUrl: "https://placehold.co/200x200/1E3A6E/FFFFFF?text=ABC",
  coverImageUrl: "https://placehold.co/1200x400/1E3A6E/E8501A?text=ABC+Developers",
  phone: "+91 98765 43210",
  whatsapp: "+91 98765 43210",
  email: "info@abcdevelopers.in",
  website: "https://abcdevelopers.in",
  address: "SCO 45, Phase 7, Mohali",
  city: "Mohali",
  state: "Punjab",
  reraNumber: "PBRERA-SAS81-PR1234",
  establishedYear: 2010,
  socialLinks: {
    facebook: "https://facebook.com/abcdevelopers",
    instagram: "https://instagram.com/abcdevelopers",
  },
  galleryUrls: [
    "https://placehold.co/800x600/E8501A/FFFFFF?text=Project+1",
    "https://placehold.co/800x600/1E3A6E/FFFFFF?text=Project+2",
    "https://placehold.co/800x600/16a34a/FFFFFF?text=Site+Visit",
  ],
};

export const SAMPLE_PROJECT = {
  name: "ABC Greens Mohali",
  slug: "abc-greens-mohali",
  citySlug: "mohali",
  description:
    "ABC Greens Mohali is a premium plotted development spread across 25 acres with wide roads, lush green parks, and world-class amenities. Located in the heart of Mohali with excellent connectivity to Chandigarh and the airport.",
  projectType: "plots" as const,
  status: "ongoing" as const,
  reraNumber: "PBRERA-SAS81-PR5678",
  address: "Sector 82, JLPL, Mohali",
  city: "Mohali",
  state: "Punjab",
  latitude: 30.7046,
  longitude: 76.7179,
  totalArea: "25 Acres",
  priceMin: 95_00_000,
  priceMax: 1_35_00_000,
  sizeMin: 200,
  sizeMax: 500,
  sizeUnit: "sq-yd" as const,
  possessionDate: "2027-03-31",
  amenities: [
    "24×7 Security",
    "Underground Electricity",
    "Wide Internal Roads",
    "Central Park",
    "Clubhouse",
    "Rainwater Harvesting",
    "Street Lighting",
    "Gated Community",
  ],
  galleryUrls: [
    "https://placehold.co/1200x600/16a34a/FFFFFF?text=ABC+Greens+Hero",
    "https://placehold.co/800x600/1E3A6E/FFFFFF?text=Master+Plan",
    "https://placehold.co/800x600/E8501A/FFFFFF?text=Site+Progress",
  ],
  brochureUrl: "https://placehold.co/800x1100/1E3A6E/FFFFFF?text=Brochure+PDF",
  paymentPlan:
    "10% booking amount at the time of booking. 40% within 60 days. Balance on possession.",
  faqs: [
    {
      question: "Is ABC Greens RERA approved?",
      answer: "Yes, ABC Greens Mohali is registered under PBRERA-SAS81-PR5678.",
    },
    {
      question: "What plot sizes are available?",
      answer: "Plot sizes range from 200 sq yd to 500 sq yd.",
    },
    {
      question: "When is possession expected?",
      answer: "Expected possession is March 2027.",
    },
  ],
  nearbyLandmarks: [
    "Mohali International Airport — 8 km",
    "ISB Mohali — 5 km",
    "Fortis Hospital — 6 km",
  ],
  masterPlanImageUrl: "https://placehold.co/1200x800/f5f2ec/1E3A6E?text=Master+Plan",
};

export const SAMPLE_PLOTS = [
  {
    plotNumber: "101",
    size: 250,
    sizeUnit: "sq-yd" as const,
    facing: "East",
    price: 1_15_00_000,
    status: "available" as const,
    hotspots: { default: { xPercent: 22, yPercent: 35 } },
  },
  {
    plotNumber: "102",
    size: 300,
    sizeUnit: "sq-yd" as const,
    facing: "Park Facing",
    isParkFacing: true,
    price: 1_35_00_000,
    status: "reserved" as const,
    hotspots: { default: { xPercent: 38, yPercent: 42 } },
  },
  {
    plotNumber: "103",
    size: 200,
    sizeUnit: "sq-yd" as const,
    facing: "North",
    price: 95_00_000,
    status: "sold" as const,
    hotspots: { default: { xPercent: 55, yPercent: 38 } },
  },
  {
    plotNumber: "104",
    size: 500,
    sizeUnit: "sq-yd" as const,
    facing: "West",
    isCorner: true,
    price: null,
    status: "coming-soon" as const,
    hotspots: { default: { xPercent: 72, yPercent: 55 } },
  },
];

export const SAMPLE_MASTER_PLAN = {
  defaultImageUrl: "https://placehold.co/1200x800/f5f2ec/1E3A6E?text=Master+Plan",
  angles: [
    {
      id: "default",
      label: "2D Plan",
      imageUrl: "https://placehold.co/1200x800/f5f2ec/1E3A6E?text=2D+Plan",
    },
    {
      id: "angle1",
      label: "Aerial View 1",
      imageUrl: "https://placehold.co/1200x800/e8ecf4/1E3A6E?text=Aerial+1",
    },
  ],
};

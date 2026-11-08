import type { SeoEntity, SeoFaqItem, SeoPageType } from "@/lib/seo/seoTypes";

function e(partial: SeoEntity): SeoEntity {
  return partial;
}

// ─── Universities ────────────────────────────────────────────────────────────

const UNIVERSITIES: SeoEntity[] = [
  e({
    id: "uni-chandigarh-university",
    type: "university",
    name: "Chandigarh University",
    slug: "chandigarh-university",
    city: "Kharar",
    state: "Punjab",
    country: "India",
    latitude: 30.9648,
    longitude: 76.7264,
    areaSlug: "kharar",
    browseHref: "/rentals/kharar/chandigarh-university",
    rentRange: "₹5,000–₹14,000",
    demandProfile: "student",
    propertyTypes: ["PG", "Hostel", "Flats", "Rooms"],
    nearbyLandmarks: ["Sector 123 Kharar", "Sector 125 Kharar", "Sunny Enclave", "Landran"],
    relatedSlugs: ["kharar", "landran", "mohali", "sector-123-kharar"],
    priority: 0.9,
    indexable: true,
  }),
  e({
    id: "uni-chitkara",
    type: "university",
    name: "Chitkara University",
    slug: "chitkara-university",
    city: "Rajpura",
    state: "Punjab",
    country: "India",
    latitude: 30.5167,
    longitude: 76.6597,
    areaSlug: "chandigarh",
    browseHref: "/rentals/in/chandigarh/pg",
    rentRange: "₹6,000–₹12,000",
    demandProfile: "student",
    propertyTypes: ["PG", "Hostel", "Flats", "Rooms"],
    nearbyLandmarks: ["Rajpura", "Banur", "Landran"],
    relatedSlugs: ["rajpura", "banur-chitkara-belt", "landran", "cgc-landran"],
    priority: 0.8,
    indexable: true,
  }),
  e({
    id: "uni-lpu",
    type: "university",
    name: "Lovely Professional University",
    slug: "lovely-professional-university",
    city: "Phagwara",
    state: "Punjab",
    country: "India",
    areaSlug: "ludhiana",
    browseHref: "/rentals/in/ludhiana",
    rentRange: "₹5,500–₹11,000",
    demandProfile: "student",
    propertyTypes: ["PG", "Hostel", "Flats"],
    relatedSlugs: ["ludhiana"],
    priority: 0.8,
    indexable: true,
  }),
  e({
    id: "uni-panjab",
    type: "university",
    name: "Panjab University",
    slug: "panjab-university",
    city: "Chandigarh",
    state: "Chandigarh",
    country: "India",
    latitude: 30.7661,
    longitude: 76.7712,
    areaSlug: "chandigarh",
    browseHref: "/rentals/in/chandigarh/pg",
    rentRange: "₹7,000–₹18,000",
    demandProfile: "student",
    propertyTypes: ["PG", "Flats", "Rooms", "Hostels"],
    nearbyLandmarks: ["Sector 14", "Sector 15", "Sector 16", "PGI Chandigarh"],
    relatedSlugs: [
      "sector-14-chandigarh",
      "sector-15-chandigarh",
      "sector-16-chandigarh",
      "sector-17-chandigarh",
      "pgi-chandigarh",
    ],
    priority: 0.82,
    indexable: true,
  }),
  e({
    id: "uni-punjabi-patiala",
    type: "university",
    name: "Punjabi University Patiala",
    slug: "punjabi-university-patiala",
    city: "Patiala",
    state: "Punjab",
    country: "India",
    rentRange: "₹4,500–₹10,000",
    demandProfile: "student",
    propertyTypes: ["PG", "Hostel", "Flats"],
    priority: 0.65,
    indexable: true,
  }),
  e({
    id: "uni-thapar",
    type: "university",
    name: "Thapar Institute Patiala",
    slug: "thapar-institute-patiala",
    city: "Patiala",
    state: "Punjab",
    country: "India",
    rentRange: "₹5,000–₹12,000",
    demandProfile: "student",
    propertyTypes: ["PG", "Hostel", "Flats"],
    priority: 0.68,
    indexable: true,
  }),
  e({
    id: "uni-cgc-landran",
    type: "university",
    name: "CGC Landran",
    slug: "cgc-landran",
    city: "Landran",
    state: "Punjab",
    country: "India",
    areaSlug: "landran",
    browseHref: "/rentals/in/chandigarh/landran",
    rentRange: "₹5,000–₹12,000",
    demandProfile: "student",
    propertyTypes: ["PG", "Hostel", "Flats"],
    relatedSlugs: ["landran", "kharar"],
    priority: 0.82,
    indexable: true,
  }),
  e({
    id: "uni-rayat-bahra",
    type: "university",
    name: "Rayat Bahra University",
    slug: "rayat-bahra-university",
    city: "Mohali",
    state: "Punjab",
    country: "India",
    areaSlug: "mohali",
    browseHref: "/rentals/mohali",
    rentRange: "₹6,000–₹13,000",
    demandProfile: "student",
    propertyTypes: ["PG", "Flats"],
    priority: 0.6,
    indexable: true,
  }),
  e({
    id: "uni-dav-chandigarh",
    type: "university",
    name: "DAV College Chandigarh",
    slug: "dav-college-chandigarh",
    city: "Chandigarh",
    state: "Chandigarh",
    country: "India",
    areaSlug: "chandigarh",
    browseHref: "/rentals/in/chandigarh",
    rentRange: "₹7,000–₹16,000",
    demandProfile: "student",
    propertyTypes: ["PG", "Flats", "Rooms"],
    priority: 0.62,
    indexable: true,
  }),
];

// ─── Cities & localities ─────────────────────────────────────────────────────

const CITIES: SeoEntity[] = [
  e({ id: "city-kharar", type: "city", name: "Kharar", slug: "kharar", city: "Kharar", state: "Punjab", country: "India", areaSlug: "kharar", browseHref: "/rentals/kharar", rentRange: "₹6,000–₹18,000", demandProfile: "mixed", propertyTypes: ["PG", "Flats", "Houses"], priority: 0.85, indexable: true }),
  e({ id: "city-landran", type: "city", name: "Landran", slug: "landran", city: "Landran", state: "Punjab", country: "India", areaSlug: "landran", browseHref: "/rentals/in/chandigarh/landran", rentRange: "₹5,500–₹14,000", demandProfile: "student", propertyTypes: ["PG", "Hostel", "Flats"], priority: 0.78, indexable: true }),
  e({ id: "city-mohali", type: "city", name: "Mohali", slug: "mohali", city: "Mohali", state: "Punjab", country: "India", areaSlug: "mohali", browseHref: "/rentals/mohali", rentRange: "₹8,000–₹25,000", demandProfile: "corporate", propertyTypes: ["Flats", "PG", "Offices"], priority: 0.88, indexable: true, relatedSlugs: ["isb-mohali", "iiser-mohali", "sector-81-mohali"] }),
  e({ id: "city-zirakpur", type: "city", name: "Zirakpur", slug: "zirakpur", city: "Zirakpur", state: "Punjab", country: "India", areaSlug: "zirakpur", browseHref: "/rentals/zirakpur", rentRange: "₹7,000–₹20,000", demandProfile: "family", propertyTypes: ["Flats", "PG"], priority: 0.8, indexable: true }),
  e({ id: "city-panchkula", type: "city", name: "Panchkula", slug: "panchkula", city: "Panchkula", state: "Haryana", country: "India", areaSlug: "panchkula", browseHref: "/rentals/in/chandigarh/panchkula", rentRange: "₹8,000–₹22,000", demandProfile: "family", propertyTypes: ["Flats", "Houses"], priority: 0.75, indexable: true }),
  e({ id: "city-chandigarh", type: "city", name: "Chandigarh", slug: "chandigarh", city: "Chandigarh", state: "Chandigarh", country: "India", areaSlug: "chandigarh", browseHref: "/rentals/in/chandigarh", rentRange: "₹10,000–₹30,000", demandProfile: "mixed", propertyTypes: ["Flats", "PG", "Rooms"], priority: 0.86, indexable: true }),
  e({ id: "city-ludhiana", type: "city", name: "Ludhiana", slug: "ludhiana", city: "Ludhiana", state: "Punjab", country: "India", areaSlug: "ludhiana", browseHref: "/rentals/in/ludhiana", rentRange: "₹7,000–₹22,000", demandProfile: "mixed", propertyTypes: ["Flats", "PG", "Commercial"], priority: 0.84, indexable: true }),
  e({ id: "city-rajpura", type: "city", name: "Rajpura", slug: "rajpura", city: "Rajpura", state: "Punjab", country: "India", areaSlug: "chandigarh", browseHref: "/rentals/in/chandigarh/pg", rentRange: "₹6,000–₹12,000", demandProfile: "student", propertyTypes: ["PG", "Flats", "Rooms"], relatedSlugs: ["chitkara-university"], priority: 0.72, indexable: true }),
];

const LOCALITIES: SeoEntity[] = [
  e({ id: "loc-sector-70-mohali", type: "locality", name: "Sector 70 Mohali", slug: "sector-70", parentSlug: "mohali", city: "Mohali", state: "Punjab", country: "India", areaSlug: "mohali", browseHref: "/rentals/mohali/sector-70", rentRange: "₹9,000–₹22,000", demandProfile: "corporate", propertyTypes: ["Flats", "PG"], priority: 0.72, indexable: true }),
  e({ id: "loc-sector-68-mohali", type: "locality", name: "Sector 68 Mohali", slug: "sector-68", parentSlug: "mohali", city: "Mohali", state: "Punjab", country: "India", areaSlug: "mohali", browseHref: "/rentals/mohali", rentRange: "₹8,500–₹20,000", demandProfile: "family", propertyTypes: ["Flats"], priority: 0.68, indexable: true }),
  e({ id: "loc-sector-123-kharar", type: "locality", name: "Sector 123 Kharar", slug: "sector-123-kharar", parentSlug: "kharar", city: "Kharar", state: "Punjab", country: "India", areaSlug: "kharar", browseHref: "/rentals/kharar", rentRange: "₹5,500–₹12,000", demandProfile: "student", propertyTypes: ["PG", "Flats"], relatedSlugs: ["chandigarh-university"], priority: 0.74, indexable: true }),
  e({ id: "loc-sector-125-kharar", type: "locality", name: "Sector 125 Kharar", slug: "sector-125-kharar", parentSlug: "kharar", city: "Kharar", state: "Punjab", country: "India", areaSlug: "kharar", browseHref: "/rentals/kharar", rentRange: "₹5,000–₹11,000", demandProfile: "student", propertyTypes: ["PG"], relatedSlugs: ["chandigarh-university"], priority: 0.72, indexable: true }),
  e({ id: "loc-sunny-enclave", type: "locality", name: "Sunny Enclave", slug: "sunny-enclave", parentSlug: "kharar", city: "Kharar", state: "Punjab", country: "India", areaSlug: "kharar", browseHref: "/rentals/kharar", rentRange: "₹7,000–₹16,000", demandProfile: "family", propertyTypes: ["Flats", "PG"], priority: 0.7, indexable: true }),
  e({ id: "loc-sarabha-nagar", type: "locality", name: "Sarabha Nagar", slug: "sarabha-nagar", parentSlug: "ludhiana", city: "Ludhiana", state: "Punjab", country: "India", areaSlug: "sarabha-nagar", browseHref: "/rentals/in/ludhiana/sarabha-nagar", rentRange: "₹12,000–₹28,000", demandProfile: "family", propertyTypes: ["Flats", "Houses"], priority: 0.7, indexable: true }),
  e({ id: "loc-model-town", type: "locality", name: "Model Town Ludhiana", slug: "model-town", parentSlug: "ludhiana", city: "Ludhiana", state: "Punjab", country: "India", areaSlug: "model-town", browseHref: "/rentals/in/ludhiana/model-town", rentRange: "₹10,000–₹24,000", demandProfile: "family", propertyTypes: ["Flats"], priority: 0.68, indexable: true }),
  e({ id: "loc-brs-nagar", type: "locality", name: "BRS Nagar", slug: "brs-nagar", parentSlug: "ludhiana", city: "Ludhiana", state: "Punjab", country: "India", areaSlug: "brs-nagar", browseHref: "/rentals/in/ludhiana/brs-nagar", rentRange: "₹11,000–₹26,000", demandProfile: "family", propertyTypes: ["Flats", "Houses"], priority: 0.66, indexable: true }),
  e({ id: "loc-pakhowal-road", type: "locality", name: "Pakhowal Road", slug: "pakhowal-road", parentSlug: "ludhiana", city: "Ludhiana", state: "Punjab", country: "India", areaSlug: "pakhowal-road", browseHref: "/rentals/in/ludhiana/pakhowal-road", rentRange: "₹9,000–₹22,000", demandProfile: "mixed", propertyTypes: ["Flats", "PG"], priority: 0.65, indexable: true }),
  e({ id: "loc-focal-point", type: "locality", name: "Focal Point Ludhiana", slug: "focal-point", parentSlug: "ludhiana", city: "Ludhiana", state: "Punjab", country: "India", areaSlug: "focal-point", browseHref: "/rentals/in/ludhiana/focal-point", rentRange: "₹6,000–₹15,000", demandProfile: "corporate", propertyTypes: ["Rooms", "Commercial"], priority: 0.6, indexable: true }),
  e({ id: "loc-sector-14-chd", type: "locality", name: "Sector 14 Chandigarh", slug: "sector-14-chandigarh", parentSlug: "chandigarh", city: "Chandigarh", state: "Chandigarh", country: "India", areaSlug: "chandigarh", browseHref: "/rentals/in/chandigarh/pg", rentRange: "₹8,000–₹18,000", demandProfile: "student", propertyTypes: ["PG", "Rooms", "Flats"], relatedSlugs: ["panjab-university"], priority: 0.76, indexable: true }),
  e({ id: "loc-sector-15-chd", type: "locality", name: "Sector 15 Chandigarh", slug: "sector-15-chandigarh", parentSlug: "chandigarh", city: "Chandigarh", state: "Chandigarh", country: "India", areaSlug: "chandigarh", browseHref: "/rentals/in/chandigarh/pg", rentRange: "₹7,500–₹16,000", demandProfile: "student", propertyTypes: ["PG", "Flats", "Rooms"], relatedSlugs: ["panjab-university"], priority: 0.74, indexable: true }),
  e({ id: "loc-sector-16-chd", type: "locality", name: "Sector 16 Chandigarh", slug: "sector-16-chandigarh", parentSlug: "chandigarh", city: "Chandigarh", state: "Chandigarh", country: "India", areaSlug: "chandigarh", browseHref: "/rentals/in/chandigarh/pg", rentRange: "₹7,000–₹15,000", demandProfile: "student", propertyTypes: ["PG", "Rooms"], relatedSlugs: ["panjab-university"], priority: 0.72, indexable: true }),
  e({ id: "loc-sector-17-chd", type: "locality", name: "Sector 17 Chandigarh", slug: "sector-17-chandigarh", parentSlug: "chandigarh", city: "Chandigarh", state: "Chandigarh", country: "India", areaSlug: "chandigarh", browseHref: "/rentals/in/chandigarh/pg", rentRange: "₹7,000–₹16,000", demandProfile: "student", propertyTypes: ["PG", "Flats"], relatedSlugs: ["panjab-university"], priority: 0.7, indexable: true }),
  e({ id: "loc-rajpura-town", type: "locality", name: "Rajpura Town", slug: "rajpura-town", parentSlug: "rajpura", city: "Rajpura", state: "Punjab", country: "India", areaSlug: "chandigarh", browseHref: "/rentals/in/chandigarh/pg", rentRange: "₹6,000–₹11,000", demandProfile: "student", propertyTypes: ["PG", "Rooms"], relatedSlugs: ["chitkara-university"], priority: 0.7, indexable: true }),
  e({ id: "loc-banur-chitkara", type: "locality", name: "Banur", slug: "banur-chitkara-belt", parentSlug: "chandigarh", city: "Banur", state: "Punjab", country: "India", areaSlug: "chandigarh", browseHref: "/rentals/in/chandigarh/banur", rentRange: "₹5,500–₹10,000", demandProfile: "student", propertyTypes: ["PG", "Flats"], relatedSlugs: ["chitkara-university"], priority: 0.68, indexable: true }),
  e({ id: "loc-sector-81-mohali", type: "locality", name: "Sector 81 Mohali", slug: "sector-81-mohali", parentSlug: "mohali", city: "Mohali", state: "Punjab", country: "India", areaSlug: "mohali", browseHref: "/rentals/mohali", rentRange: "₹8,000–₹22,000", demandProfile: "mixed", propertyTypes: ["PG", "Flats", "Rooms"], relatedSlugs: ["isb-mohali", "iiser-mohali"], priority: 0.75, indexable: true }),
  e({ id: "loc-sector-80-mohali", type: "locality", name: "Sector 80 Mohali", slug: "sector-80-mohali", parentSlug: "mohali", city: "Mohali", state: "Punjab", country: "India", areaSlug: "mohali", browseHref: "/rentals/mohali", rentRange: "₹8,000–₹20,000", demandProfile: "mixed", propertyTypes: ["PG", "Flats"], relatedSlugs: ["isb-mohali", "iiser-mohali"], priority: 0.72, indexable: true }),
  e({ id: "loc-chilla-mohali", type: "locality", name: "Chilla Mohali", slug: "chilla-mohali", parentSlug: "mohali", city: "Mohali", state: "Punjab", country: "India", areaSlug: "mohali", browseHref: "/rentals/mohali", rentRange: "₹6,000–₹14,000", demandProfile: "mixed", propertyTypes: ["PG", "Rooms", "Flats"], relatedSlugs: ["jlpl-industrial-area-mohali", "iiser-mohali"], priority: 0.7, indexable: true }),
];

const LANDMARKS: SeoEntity[] = [
  e({ id: "lm-fortis-mohali", type: "landmark", name: "Fortis Hospital Mohali", slug: "fortis-mohali", city: "Mohali", state: "Punjab", country: "India", areaSlug: "mohali", browseHref: "/rentals/mohali", rentRange: "₹9,000–₹22,000", demandProfile: "family", propertyTypes: ["Flats", "PG"], priority: 0.65, indexable: true }),
  e({ id: "lm-pgi", type: "landmark", name: "PGI Chandigarh", slug: "pgi-chandigarh", city: "Chandigarh", state: "Chandigarh", country: "India", areaSlug: "chandigarh", browseHref: "/rentals/in/chandigarh", rentRange: "₹8,000–₹20,000", demandProfile: "mixed", propertyTypes: ["Flats", "PG", "Rooms"], priority: 0.7, indexable: true }),
  e({ id: "lm-elante", type: "landmark", name: "Elante Mall", slug: "elante-mall", city: "Chandigarh", state: "Chandigarh", country: "India", areaSlug: "chandigarh", browseHref: "/rentals/in/chandigarh", rentRange: "₹10,000–₹28,000", demandProfile: "family", propertyTypes: ["Flats"], priority: 0.62, indexable: true }),
  e({ id: "lm-isbt-43", type: "landmark", name: "ISBT Sector 43", slug: "isbt-sector-43", city: "Chandigarh", state: "Chandigarh", country: "India", areaSlug: "chandigarh", browseHref: "/rentals/in/chandigarh", priority: 0.58, indexable: true }),
  e({ id: "lm-railway", type: "landmark", name: "Chandigarh Railway Station", slug: "chandigarh-railway-station", city: "Chandigarh", state: "Chandigarh", country: "India", areaSlug: "chandigarh", browseHref: "/rentals/in/chandigarh", priority: 0.58, indexable: true }),
  e({ id: "lm-mohali-airport", type: "landmark", name: "Mohali Airport", slug: "mohali-airport", city: "Mohali", state: "Punjab", country: "India", areaSlug: "mohali", browseHref: "/rentals/mohali", priority: 0.6, indexable: true }),
  e({ id: "lm-infosys-chd", type: "landmark", name: "Infosys Chandigarh", slug: "infosys-chandigarh", city: "Chandigarh", state: "Chandigarh", country: "India", areaSlug: "chandigarh", browseHref: "/rentals/in/chandigarh", demandProfile: "corporate", propertyTypes: ["Flats", "PG"], priority: 0.64, indexable: true }),
  e({ id: "lm-it-park", type: "landmark", name: "IT Park Chandigarh", slug: "it-park-chandigarh", city: "Chandigarh", state: "Chandigarh", country: "India", areaSlug: "chandigarh", browseHref: "/rentals/in/chandigarh", demandProfile: "corporate", propertyTypes: ["Flats", "PG"], priority: 0.66, indexable: true }),
  e({ id: "lm-isb-mohali", type: "landmark", name: "ISB Mohali", slug: "isb-mohali", city: "Mohali", state: "Punjab", country: "India", areaSlug: "mohali", browseHref: "/rentals/mohali", rentRange: "₹10,000–₹28,000", demandProfile: "mixed", propertyTypes: ["PG", "Flats", "Rooms"], relatedSlugs: ["iiser-mohali", "sector-81-mohali"], priority: 0.74, indexable: true }),
  e({ id: "lm-iiser-mohali", type: "landmark", name: "IISER Mohali", slug: "iiser-mohali", city: "Mohali", state: "Punjab", country: "India", areaSlug: "mohali", browseHref: "/rentals/mohali", rentRange: "₹8,000–₹18,000", demandProfile: "student", propertyTypes: ["PG", "Hostels", "Flats"], relatedSlugs: ["isb-mohali", "sector-81-mohali", "chilla-mohali"], priority: 0.76, indexable: true }),
  e({ id: "lm-jlpl-mohali", type: "landmark", name: "JLPL Industrial Area", slug: "jlpl-industrial-area-mohali", city: "Mohali", state: "Punjab", country: "India", areaSlug: "mohali", browseHref: "/rentals/mohali", rentRange: "₹6,000–₹15,000", demandProfile: "mixed", propertyTypes: ["Rooms", "PG", "Flats"], relatedSlugs: ["chilla-mohali", "sector-81-mohali", "iiser-mohali", "isb-mohali"], priority: 0.68, indexable: true }),
];

const ROADS: SeoEntity[] = [
  e({ id: "road-airport-mohali", type: "road", name: "Airport Road Mohali", slug: "airport-road-mohali", city: "Mohali", state: "Punjab", country: "India", areaSlug: "mohali", browseHref: "/rentals/mohali", priority: 0.62, indexable: true }),
  e({ id: "road-landran", type: "road", name: "Landran Road", slug: "landran-road", city: "Kharar", state: "Punjab", country: "India", areaSlug: "landran", browseHref: "/rentals/in/chandigarh/landran", relatedSlugs: ["chandigarh-university", "cgc-landran"], priority: 0.68, indexable: true }),
  e({ id: "road-kharar", type: "road", name: "Kharar Road", slug: "kharar-road", city: "Kharar", state: "Punjab", country: "India", areaSlug: "kharar", browseHref: "/rentals/kharar", priority: 0.65, indexable: true }),
  e({ id: "road-vip-zirakpur", type: "road", name: "VIP Road Zirakpur", slug: "vip-road-zirakpur", city: "Zirakpur", state: "Punjab", country: "India", areaSlug: "zirakpur", browseHref: "/rentals/zirakpur", priority: 0.6, indexable: true }),
  e({ id: "road-pr7", type: "road", name: "PR7 Road", slug: "pr7-road", city: "Mohali", state: "Punjab", country: "India", areaSlug: "mohali", browseHref: "/rentals/mohali", priority: 0.58, indexable: true }),
  e({ id: "road-pakhowal", type: "road", name: "Pakhowal Road", slug: "pakhowal-road-ludhiana", city: "Ludhiana", state: "Punjab", country: "India", areaSlug: "pakhowal-road", browseHref: "/rentals/in/ludhiana/pakhowal-road", priority: 0.62, indexable: true }),
];

const SOCIETIES: SeoEntity[] = [
  e({ id: "soc-dlf-valley", type: "society", name: "DLF Valley", slug: "dlf-valley", city: "Mohali", state: "Punjab", country: "India", areaSlug: "mohali", browseHref: "/rentals/mohali", propertyTypes: ["Flats"], priority: 0.55, indexable: true }),
];

const GUIDES: SeoEntity[] = [
  e({ id: "guide-rent-agreement", type: "guide", name: "Rent Agreement Punjab", slug: "rent-agreement-punjab", state: "Punjab", country: "India", priority: 0.7, indexable: true }),
  e({ id: "guide-pg-safety-cu", type: "guide", name: "PG Safety Guide Near Chandigarh University", slug: "pg-safety-near-chandigarh-university", city: "Kharar", state: "Punjab", country: "India", relatedSlugs: ["chandigarh-university"], priority: 0.72, indexable: true }),
];

const COMPARISONS: SeoEntity[] = [
  e({ id: "cmp-mohali-zirakpur", type: "comparison", name: "Mohali vs Zirakpur", slug: "mohali-vs-zirakpur", state: "Punjab", country: "India", relatedSlugs: ["mohali", "zirakpur"], priority: 0.68, indexable: true }),
  e({ id: "cmp-pg-flat-cu", type: "comparison", name: "PG vs Flat Near Chandigarh University", slug: "pg-vs-flat-near-chandigarh-university", city: "Kharar", state: "Punjab", country: "India", relatedSlugs: ["chandigarh-university"], priority: 0.7, indexable: true }),
];

const TOOLS: SeoEntity[] = [
  e({ id: "tool-rent-calculator", type: "calculator", name: "Rent Calculator", slug: "rent-calculator", country: "India", priority: 0.75, indexable: true }),
];

export const SEO_ENTITIES: SeoEntity[] = [
  ...UNIVERSITIES,
  ...CITIES,
  ...LOCALITIES,
  ...LANDMARKS,
  ...ROADS,
  ...SOCIETIES,
  ...GUIDES,
  ...COMPARISONS,
  ...TOOLS,
];

const ENTITY_BY_KEY = new Map<string, SeoEntity>();
for (const entity of SEO_ENTITIES) {
  ENTITY_BY_KEY.set(`${entity.type}:${entity.slug}`, entity);
  ENTITY_BY_KEY.set(entity.slug, entity);
}

export function getSeoEntity(slug: string, type?: SeoPageType): SeoEntity | undefined {
  if (type) return ENTITY_BY_KEY.get(`${type}:${slug}`);
  return ENTITY_BY_KEY.get(slug);
}

export function getSeoEntitiesByType(type: SeoPageType): SeoEntity[] {
  return SEO_ENTITIES.filter((e) => e.type === type);
}

export function getUniversitySubPage(
  universitySlug: string,
  subType: "university_pg" | "university_hostel" | "university_flat"
): SeoEntity | undefined {
  const base = getSeoEntity(universitySlug, "university");
  if (!base) return undefined;
  const suffix = subType === "university_pg" ? "pg" : subType === "university_hostel" ? "hostel" : "flats";
  return {
    ...base,
    id: `${base.id}-${suffix}`,
    type: subType,
    slug: universitySlug,
    parentSlug: universitySlug,
  };
}

export function seoEntityPath(entity: SeoEntity): string {
  switch (entity.type) {
    case "university":
      return `/universities/${entity.slug}`;
    case "university_pg":
      return `/universities/${entity.slug}/pg`;
    case "university_hostel":
      return `/universities/${entity.slug}/hostel`;
    case "university_flat":
      return `/universities/${entity.slug}/flats`;
    case "city":
      return `/cities/${entity.slug}`;
    case "locality":
      return `/cities/${entity.parentSlug}/${entity.slug}`;
    case "landmark":
      return `/landmarks/${entity.slug}`;
    case "road":
      return `/roads/${entity.slug}`;
    case "society":
      return `/societies/${entity.slug}`;
    case "building":
      return `/buildings/${entity.slug}`;
    case "builder":
      return `/builders/${entity.slug}`;
    case "comparison":
      return `/compare/${entity.slug}`;
    case "guide":
      return `/guides/${entity.slug}`;
    case "calculator":
      return `/tools/${entity.slug}`;
    default:
      return `/`;
  }
}

export function shouldIndexSeoPage(entity: SeoEntity, listingCount: number): boolean {
  if (!entity.indexable) return false;
  if (listingCount > 0) return true;
  if (entity.type === "guide" || entity.type === "calculator" || entity.type === "comparison")
    return true;
  return false;
}

export function buildSeoIntro(entity: SeoEntity, listingCount: number): string {
  const place = entity.city ?? entity.name;
  const types = entity.propertyTypes?.join(", ") ?? "rentals";
  const rent = entity.rentRange ? ` Typical rent: ${entity.rentRange}/month.` : "";
  const nearby =
    entity.nearbyLandmarks?.length ?
      ` Nearby areas include ${entity.nearbyLandmarks.slice(0, 4).join(", ")}.`
    : "";
  const inventory =
    listingCount > 0 ?
      ` ${listingCount} live listing${listingCount === 1 ? "" : "s"} on RentalPins right now.`
    : " Browse the map or save a search for new owner posts.";

  if (entity.type === "university_pg") {
    return `Find PGs near ${entity.name} for boys, girls and students looking for food, WiFi, AC rooms, sharing rooms and direct owner contact. RentalPins helps you compare nearby PGs around ${place}.${nearby}${rent}${inventory}`;
  }
  if (entity.type === "university_hostel") {
    return `Browse hostels near ${entity.name} with managed security, mess plans and student-friendly rules. Compare ${types} on the map around ${place}.${rent}${inventory}`;
  }
  if (entity.type === "university_flat") {
    return `Find shared flats and apartments near ${entity.name} for student groups and professionals. Compare ${types} around ${place} with map-first search and owner contact.${rent}${inventory}`;
  }
  if (entity.type === "comparison") {
    return `Compare rent, commute, lifestyle and rental inventory between ${entity.name.replace(" vs ", " and ")} on RentalPins. Use this guide before shortlisting areas on the map.`;
  }
  if (entity.type === "guide") {
    return `Practical rental guide for ${entity.name}. Steps, documents, safety tips and links to live inventory on RentalPins.`;
  }
  if (entity.type === "calculator") {
    return `Estimate monthly rent, deposit and move-in costs with the RentalPins rent calculator. Plan your budget before contacting owners.`;
  }

  return `Find ${types} in ${entity.name}, ${place}. RentalPins map search connects you with verified owners — no broker search fee.${rent}${nearby}${inventory}`;
}

export function buildSeoTitle(entity: SeoEntity): string {
  switch (entity.type) {
    case "university_pg":
      return `PG Near ${entity.name} | Boys & Girls PG, Food, WiFi`;
    case "university_hostel":
      return `Hostels Near ${entity.name} | Student Housing`;
    case "university_flat":
      return `Flats Near ${entity.name} | Shared Apartments`;
    case "university":
      return `Rentals Near ${entity.name} | PG, Flats & Hostels`;
    case "city":
      return `Rentals in ${entity.name} | Flats, PG & Houses`;
    case "locality":
      return `Rentals in ${entity.name} | ${entity.city}`;
    case "landmark":
      return `Rentals Near ${entity.name} | ${entity.city}`;
    case "road":
      return `Rentals on ${entity.name} | ${entity.city}`;
    case "society":
      return `${entity.name} Rentals | ${entity.city}`;
    case "comparison":
      return `${entity.name} — Rental Comparison`;
    case "guide":
      return `${entity.name} — Rental Guide`;
    case "calculator":
      return `${entity.name} — RentalPins`;
    default:
      return `${entity.name} Rentals`;
  }
}

export function buildSeoDescription(entity: SeoEntity, listingCount: number): string {
  const base = buildSeoIntro(entity, listingCount).slice(0, 155);
  return base.length < buildSeoIntro(entity, listingCount).length ? `${base}…` : base;
}

export function buildSeoFaqs(entity: SeoEntity, listingCount: number): SeoFaqItem[] {
  const place = entity.city ?? entity.name;
  const faqs: SeoFaqItem[] = [
    {
      question: `What is the average rent in ${entity.name}?`,
      answer: entity.rentRange ?
        `Typical rent near ${entity.name} is ${entity.rentRange}/month depending on PG, flat type and furnishing. Browse live pins on RentalPins for current owner prices.`
      : `Rent varies by property type and furnishing. Use the RentalPins map to compare live owner listings in ${place}.`,
    },
    {
      question: `Does RentalPins charge brokerage in ${place}?`,
      answer: "No — tenants browse and message owners directly from map pins without paying a broker search fee.",
    },
  ];

  if (entity.demandProfile === "student") {
    faqs.push({
      question: `Is ${entity.name} good for students?`,
      answer: `Yes — ${place} has strong student rental demand with PG, hostel and shared flat options. Compare food plans, sharing layout and commute on the map before visiting.`,
    });
  }

  if (listingCount === 0) {
    faqs.push({
      question: `Why are there few listings for ${entity.name} right now?`,
      answer: "Inventory grows as owners list. Save a map search, browse nearby areas, or list your property free to appear when tenants search.",
    });
  }

  if (entity.type === "university_pg") {
    faqs.push({
      question: "Is food included in PG rent?",
      answer: "Many PG owners offer mess plans — confirm meals, AC surcharges and laundry in your first WhatsApp message before paying deposit.",
    });
    faqs.push({
      question: "Is this area safe for girls?",
      answer: "Shortlist girls PG with curfew and security rules, visit in daylight, and confirm warden or caretaker presence before session deposit.",
    });
  }

  return faqs.slice(0, 6);
}

export function getProgrammaticSeoSitemapPaths(): { path: string; priority: number; entity: SeoEntity }[] {
  const paths: { path: string; priority: number; entity: SeoEntity }[] = [];

  for (const uni of UNIVERSITIES) {
    paths.push({ path: seoEntityPath(uni), priority: uni.priority ?? 0.7, entity: uni });
    for (const sub of ["university_pg", "university_hostel", "university_flat"] as const) {
      const subEntity = getUniversitySubPage(uni.slug, sub);
      if (subEntity && shouldIndexSeoPage(subEntity, 1)) {
        paths.push({ path: seoEntityPath(subEntity), priority: (uni.priority ?? 0.7) - 0.05, entity: subEntity });
      }
    }
  }

  for (const city of CITIES) {
    paths.push({ path: seoEntityPath(city), priority: city.priority ?? 0.7, entity: city });
  }

  for (const loc of LOCALITIES) {
    paths.push({ path: seoEntityPath(loc), priority: loc.priority ?? 0.65, entity: loc });
  }

  for (const entity of [...LANDMARKS, ...ROADS, ...SOCIETIES, ...GUIDES, ...COMPARISONS, ...TOOLS]) {
    const pseudoCount =
      entity.type === "guide" || entity.type === "comparison" || entity.type === "calculator" ? 1 : 0;
    if (shouldIndexSeoPage(entity, pseudoCount)) {
      paths.push({ path: seoEntityPath(entity), priority: entity.priority ?? 0.6, entity });
    }
  }

  return paths;
}

"use client";
import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { BRAND, UI } from "@/lib/brand";
import { appPath } from "@/lib/config";
import { mapSearchUrl } from "@/lib/map-search-url";
import ListPropertyCTA from "@/components/seo/ListPropertyCTA";
import SupplyAudienceSection from "@/components/seo/SupplyAudienceSection";
import AreaSupplyDemandSection from "@/components/seo/AreaSupplyDemandSection";
import StickySeoCTA from "@/components/seo/StickySeoCTA";
import MohaliGscHubLinks from "@/components/seo/MohaliGscHubLinks";

// ─── URLs (SINGLE SOURCE — change here, changes everywhere) ──────────────────
const PLAY_URL =
  "https://play.google.com/store/apps/details?id=com.rentit_clean.rentit";

const PATHS = {
  home: appPath("/"),
  search: appPath("/search"),
  post: appPath("/post"),
  rentals: appPath("/rentals"),
  login: appPath("/auth/login"),
  blog: appPath("/blog"),
  about: appPath("/about"),
  contact: appPath("/contact"),
  privacy: appPath("/privacy-policy"),
  terms: appPath("/terms"),
  refund: appPath("/refund-policy"),
} as const;

// ─── Types ────────────────────────────────────────────────────────────────────
export interface AreaData {
  name: string;
  slug: string;
  parentCity: string;   // "" for city hub pages
  parentSlug: string;   // "" for city hub pages
  /** Country URL segment (in, uk, ke, ng) — always set for rental paths */
  parentCountrySlug: string;
  country: string;
  tagline: string;
  badge: string;
  primaryFocus: string;
  heroDescription: string;
  coordinates: { lat: number; lng: number };
  popularAreas: string[];
  topCategories: { name: string; color: string; icon: string; desc: string }[];
  popularSearches: string[];
  spokeLinks: { label: string; href: string }[];
  faqs: { q: string; a: string }[];
  ctaHeading: string;
  ctaBody: string;
}

interface LongFormSection {
  title: string;
  paragraphs: string[];
}

const FOCUSED_LONGFORM_OVERRIDES: Record<string, LongFormSection[]> = {
  chandigarh: [
    {
      title: "Chandigarh Tricity rental overview (Chandigarh, Mohali, Panchkula)",
      paragraphs: [
        "Chandigarh Tricity behaves like one integrated rental economy. Tenant movement between Chandigarh sectors, Mohali phases, and Panchkula blocks is high because work, study, and lifestyle hubs overlap across the three cities.",
        "On RentalPins, this creates a strong use case for map-led comparison. A renter searching in Sector 22 may still find a better value option in Mohali Phase 7 or Panchkula with comparable commute and amenities.",
        "For owners, Tricity demand is highly intent-driven. Listings with clear location naming, realistic pricing, and fast response times usually outperform generic city-level classifieds.",
      ],
    },
    {
      title: "Student and professional demand in Tricity",
      paragraphs: [
        "Tricity demand is split between students, early-career professionals, and families relocating for work. PG and room demand remains strong near coaching belts, IT corridors, and transit-friendly sectors.",
        "Professionals often prioritize commute-to-office and weekend accessibility, while students optimize for affordability and social infrastructure. This is why locality-level map filtering gives better outcomes than broad keyword search.",
        "RentalPins supports this behavior through city -> locality -> category navigation, helping users find practical fits quickly.",
      ],
    },
  ],
  ludhiana: [
    {
      title: "Ludhiana rental market structure",
      paragraphs: [
        "Ludhiana has a mixed rental profile with strong residential demand and active commercial-industrial leasing. Localities such as Model Town, BRS Nagar, Pakhowal Road, and Focal Point serve different renter intents and price bands.",
        "Residential demand is led by families and working professionals, while industrial and trade-linked requirements create sustained demand for shops, offices, warehouses, and utility spaces.",
        "For search quality, map-level discovery is critical in Ludhiana because location context often matters more than headline listing text.",
      ],
    },
    {
      title: "Ludhiana rent behavior and conversion drivers",
      paragraphs: [
        "Rent movements in Ludhiana are influenced by locality reputation, access to main roads, and furnishing quality. Similar unit sizes can vary significantly in rent when connectivity and neighborhood infrastructure differ.",
        "Tenants generally convert faster when listing details include exact locality context, multiple photos, and transparent pricing terms. Owners who update stale listings and respond quickly also see stronger lead quality.",
        "RentalPins pages for Ludhiana are designed to capture this high-intent demand with local SEO plus category cross-linking.",
      ],
    },
  ],
  delhi: [
    {
      title: "Delhi rental segmentation by locality",
      paragraphs: [
        "Delhi demand is highly locality-segmented. Student-heavy zones such as Mukherjee Nagar and GTB Nagar behave differently from family-driven belts like Dwarka and Rohini, and from mixed commercial-residential pockets like Jasola.",
        "This segmentation makes locality-first search essential. Users often shortlist multiple adjacent neighborhoods to optimize rent, commute, and livability rather than searching city-wide.",
        "RentalPins supports this with direct links between city and locality hubs, improving long-tail discovery and conversion.",
      ],
    },
    {
      title: "Delhi commercial and shared-accommodation opportunity",
      paragraphs: [
        "Beyond flats and houses, Delhi has steady demand for PG, co-living style rooms, office spaces, and small commercial units. Demand concentration follows education corridors, metro access, and business zones.",
        "For owners, visibility on map with clear transport relevance tends to improve inquiry quality. For tenants, map filters reduce noise and help compare similar options faster.",
        "This page architecture is built to rank for hyperlocal intent and reduce search friction for both sides of the marketplace.",
      ],
    },
  ],
  "chandigarh/mohali": [
    {
      title: "Mohali as a high-growth Tricity micro-market",
      paragraphs: [
        "Mohali is one of the fastest-moving Tricity rental markets due to IT growth, airport-linked development, and strong student/professional migration. Phase-based micro-markets have distinct rent and inventory patterns.",
        "Demand is typically strongest in Phase clusters, Aerocity, and IT-adjacent pockets where transport convenience and lifestyle infrastructure are balanced.",
        "RentalPins locality pages for Mohali help users compare these micro-zones rather than treating Mohali as one uniform market.",
      ],
    },
    {
      title: "Mohali PG, flats, and office demand",
      paragraphs: [
        "PG and room demand remains active around IT and education belts, while flat demand is led by professionals and families seeking managed societies with predictable commute routes.",
        "Small office and co-working requirements are also rising in Mohali. Businesses evaluate visibility, parking, and corridor access before finalizing.",
        "Direct owner discovery with map context improves decision quality and shortens the search-to-inquiry cycle.",
      ],
    },
  ],
  "ludhiana/model-town": [
    {
      title: "Model Town locality dynamics",
      paragraphs: [
        "Model Town remains one of Ludhiana's premium and high-demand residential localities, with balanced access to schools, healthcare, shopping streets, and daily-use amenities.",
        "Demand typically comes from families, professionals, and long-stay tenants seeking established neighborhood quality and predictable civic infrastructure.",
        "As a result, listing quality and location precision matter heavily here—renters compare nearby streets and blocks before contacting.",
      ],
    },
    {
      title: "Model Town rent trend behavior",
      paragraphs: [
        "Rent levels in Model Town are often above city averages for comparable unit sizes because neighborhood reputation, connectivity, and amenities are stronger than many peripheral areas.",
        "Furnished homes, gated units, and better-maintained properties command premium pricing, while older inventory competes through value pricing.",
        "For both tenants and owners, locality-level benchmark comparison on map is the most reliable way to estimate practical pricing.",
      ],
    },
  ],
  "chandigarh/kharar": [
    {
      title: "Kharar rental demand and affordability profile",
      paragraphs: [
        "Kharar is one of the most price-sensitive yet high-demand Tricity belts, especially for students and early-career renters who want better value while staying connected to Chandigarh and Mohali.",
        "Inventory in Kharar spans budget rooms, PG options, apartments, and selected commercial spaces. Search behavior typically prioritizes affordability + commute rather than premium amenity spend.",
        "RentalPins locality pages help users compare Kharar pockets with nearby options before contacting owners.",
      ],
    },
    {
      title: "Kharar connectivity and growth corridors",
      paragraphs: [
        "Kharar's growth is tied to education corridors and Tricity commuting routes. Renters often shortlist by road connectivity and practical travel time to colleges, offices, and market zones.",
        "Owners with precise locality tags and transparent pricing tend to see better-quality leads because Kharar users actively compare alternatives in nearby areas.",
        "For operators and owners, map-context listing visibility is a major conversion advantage in this micro-market.",
      ],
    },
  ],
  "chandigarh/panchkula": [
    {
      title: "Panchkula residential preference patterns",
      paragraphs: [
        "Panchkula demand is anchored by family and long-stay renters seeking organized sectors, predictable infrastructure, and proximity to Chandigarh workplaces.",
        "Compared with central Chandigarh, Panchkula can offer a different value/space mix, so renters frequently compare multiple sectors before final decision.",
        "RentalPins supports this with locality-level exploration and direct owner communication.",
      ],
    },
    {
      title: "Panchkula price behavior and livability factors",
      paragraphs: [
        "Rents in Panchkula vary by sector maturity, furnishing level, and access to schools, hospitals, and daily retail. Similar layouts may price differently due to micro-location comfort.",
        "Map-led comparison helps renters separate premium-value inventory from over-priced outliers.",
        "Owners can improve conversion by adding complete media and exact locality naming for faster tenant trust.",
      ],
    },
  ],
  "chandigarh/zirakpur": [
    {
      title: "Zirakpur as a commuter rental hotspot",
      paragraphs: [
        "Zirakpur attracts high commuter demand due to highway access, airport linkage, and proximity to Chandigarh and Mohali. It is often used as a value alternative by working professionals.",
        "Inventory includes apartments, PG, and mixed-use commercial supply, making category-based filtering essential for efficient discovery.",
        "RentalPins locality pages improve this experience by combining map context with direct owner lead paths.",
      ],
    },
    {
      title: "Zirakpur conversion drivers for renters and owners",
      paragraphs: [
        "Renters in Zirakpur usually optimize for commute predictability and unit quality at a practical budget. Map-level location clarity is often a deciding factor.",
        "Owners who price near active inventory and provide clear transit relevance generally see faster inquiry response.",
        "Zirakpur remains a strong growth locality for both residential and mixed commercial intent.",
      ],
    },
  ],
  "chandigarh/landran": [
    {
      title: "Landran student and transit-oriented rental demand",
      paragraphs: [
        "Landran demand is strongly influenced by nearby colleges and student accommodation patterns, with steady requirement for PG, rooms, and budget flats.",
        "Because renters often evaluate multiple nearby pockets, locality-level comparison and map navigation materially improve search quality.",
        "RentalPins pages for Landran are designed to capture this hyperlocal demand with direct owner contact paths.",
      ],
    },
    {
      title: "Landran pricing and neighborhood comparison",
      paragraphs: [
        "Price movement in Landran is typically shaped by property condition, furnishing, and travel convenience toward Mohali/Chandigarh work and study zones.",
        "Users should compare nearby localities before finalizing because small distance changes can produce meaningful rent differences.",
        "Owners can improve lead quality by keeping location and amenity details complete and current.",
      ],
    },
  ],
  "ludhiana/sarabha-nagar": [
    {
      title: "Sarabha Nagar premium rental positioning",
      paragraphs: [
        "Sarabha Nagar is one of Ludhiana's premium residential zones with strong demand from higher-income tenants and families seeking neighborhood quality.",
        "Inventory often competes on quality, maintenance, and livability signals rather than only headline rent.",
        "RentalPins locality discovery helps renters compare premium options with transparent location context.",
      ],
    },
    {
      title: "Sarabha Nagar pricing and tenant intent",
      paragraphs: [
        "Rent behavior in Sarabha Nagar reflects locality prestige, access to quality social infrastructure, and unit readiness.",
        "Tenants in this zone typically prefer complete listing media and trusted owner interaction before visits.",
        "Owners who present detailed listing data tend to convert faster in this high-intent locality.",
      ],
    },
  ],
  "ludhiana/pakhowal-road": [
    {
      title: "Pakhowal Road rental demand mix",
      paragraphs: [
        "Pakhowal Road serves mixed residential and lifestyle demand, attracting professionals and families who prioritize convenience and connectivity.",
        "This locality often sees healthy movement in flats, independent homes, and nearby commercial support inventory.",
        "Locality-first map browsing helps users compare price-quality trade-offs across adjacent belts.",
      ],
    },
    {
      title: "Pakhowal Road livability and conversion cues",
      paragraphs: [
        "Access to schools, healthcare, and daily markets strongly influences conversion in this area. Micro-location factors can materially shift rent expectations.",
        "Renters usually shortlist by commute comfort and neighborhood profile before contacting owners.",
        "Owners should align pricing with nearby active listings to reduce inquiry drop-off.",
      ],
    },
  ],
  "ludhiana/brs-nagar": [
    {
      title: "BRS Nagar family and long-stay demand",
      paragraphs: [
        "BRS Nagar is a stable residential locality with steady long-stay demand from families and professionals.",
        "Renter priorities include safety, infrastructure quality, and predictable daily-life convenience.",
        "RentalPins helps users compare BRS Nagar with nearby localities through area-level internal links and map views.",
      ],
    },
    {
      title: "BRS Nagar rent behavior and inventory quality",
      paragraphs: [
        "Rent outcomes in BRS Nagar depend heavily on property condition, furnishing readiness, and exact neighborhood position.",
        "Even similarly sized homes can show pricing spread due to building quality and accessibility differences.",
        "Detailed listing presentation improves trust and contact conversion in this segment.",
      ],
    },
  ],
  "ludhiana/focal-point": [
    {
      title: "Focal Point industrial rental opportunity",
      paragraphs: [
        "Focal Point is one of Ludhiana's key industrial belts, with active demand for warehouses, industrial sheds, and utility-linked commercial space.",
        "Business tenants here focus on logistics convenience, access roads, and operational suitability rather than purely residential amenities.",
        "RentalPins supports this by linking industrial intent pages to locality inventory discovery.",
      ],
    },
    {
      title: "Focal Point commercial conversion factors",
      paragraphs: [
        "Industrial and trade demand converts faster when listings clearly define space type, access context, and practical use details.",
        "For tenants, map-based distance and corridor awareness reduce mismatch risk before calls and site visits.",
        "For owners, transparent pricing and category clarity improve lead quality in this high-intent industrial zone.",
      ],
    },
  ],
  "delhi/mukherjee-nagar": [
    {
      title: "Mukherjee Nagar student rental intensity",
      paragraphs: [
        "Mukherjee Nagar is one of Delhi's most concentrated student and coaching-linked rental localities, with recurring demand for PG, rooms, and shared accommodation.",
        "Inventory movement is fast, so tenants usually shortlist quickly based on budget, distance, and basic amenity fit.",
        "RentalPins locality pages improve this by combining map context with direct owner contact options.",
      ],
    },
    {
      title: "Mukherjee Nagar pricing and occupancy behavior",
      paragraphs: [
        "Rent levels in Mukherjee Nagar are sensitive to exact lane proximity, furnishing quality, and occupancy-friendly features.",
        "Students compare multiple nearby options in short cycles; listing freshness and clarity strongly affect conversion.",
        "Owners can improve occupancy velocity through complete listing details and responsive communication.",
      ],
    },
  ],
  "delhi/dwarka": [
    {
      title: "Dwarka family and professional rental profile",
      paragraphs: [
        "Dwarka demand is led by families and professionals looking for planned sectors, broad road connectivity, and relatively structured residential ecosystems.",
        "Compared with central belts, Dwarka often competes on livability and planned infrastructure while remaining commuter-relevant.",
        "RentalPins enables sector/locality-level comparison so renters can identify the right fit before outreach.",
      ],
    },
    {
      title: "Dwarka rent trends and decision criteria",
      paragraphs: [
        "Dwarka pricing is shaped by sector desirability, unit condition, and convenience access to metro and arterial routes.",
        "Tenants typically evaluate schools, healthcare, and daily retail proximity alongside rent before finalizing.",
        "For owners, accurate locality tagging plus practical amenity details improves conversion confidence.",
      ],
    },
  ],
  "jaipur/malviya-nagar": [
    {
      title: "Malviya Nagar rental demand fundamentals",
      paragraphs: [
        "Malviya Nagar is one of Jaipur's most searched rental localities, drawing demand from families, students, and professionals due to connectivity and mature social infrastructure.",
        "Renter preference here often balances livability and commute practicality, with strong movement in flats, independent portions, and long-stay family inventory.",
        "RentalPins locality pages help users compare Malviya Nagar with nearby Jaipur belts before contacting owners.",
      ],
    },
    {
      title: "Malviya Nagar pricing and conversion behavior",
      paragraphs: [
        "Rent variation in Malviya Nagar is influenced by micro-location, furnishing, and building quality. Similar unit sizes can have meaningful pricing spread across internal pockets.",
        "Tenants typically convert faster on listings with complete photos, exact location details, and clear terms.",
        "Owners can improve lead quality by keeping inventory updated and pricing close to active neighborhood benchmarks.",
      ],
    },
  ],
  "jaipur/vaishali-nagar": [
    {
      title: "Vaishali Nagar family-centric rental profile",
      paragraphs: [
        "Vaishali Nagar has strong family and professional demand, supported by broad roads, retail access, and a comparatively planned residential character.",
        "Inventory includes apartments and independent homes, with renters prioritizing neighborhood comfort and daily-life convenience.",
        "RentalPins map-led search helps compare value options within Vaishali Nagar and nearby high-demand Jaipur areas.",
      ],
    },
    {
      title: "Vaishali Nagar rent trends and locality fit",
      paragraphs: [
        "Pricing in Vaishali Nagar depends on block-level accessibility, property condition, and amenity quality.",
        "Long-stay renters usually shortlist by school, market, and commute factors alongside rent.",
        "Detailed owner listings with clear locality relevance generally produce higher trust and better inquiry conversion.",
      ],
    },
  ],
  "jaipur/mansarovar": [
    {
      title: "Mansarovar scale and rental liquidity",
      paragraphs: [
        "Mansarovar is one of Jaipur's largest and most liquid residential markets, with steady demand across budget, mid-segment, and family rental categories.",
        "The locality's scale creates multiple micro-markets, so area-level comparison is essential for finding practical rent-to-amenity value.",
        "RentalPins enables this through locality-first pages and internal links to related categories.",
      ],
    },
    {
      title: "Mansarovar decision drivers for tenants",
      paragraphs: [
        "Tenants in Mansarovar usually evaluate commute convenience, property upkeep, and neighborhood services before finalizing.",
        "Price outcomes vary by internal pocket and building quality even when apartment configurations look similar.",
        "Owners who provide complete unit details and transparent pricing tend to receive higher-intent leads.",
      ],
    },
  ],
  "jaipur/jagatpura": [
    {
      title: "Jagatpura student and emerging-professional demand",
      paragraphs: [
        "Jagatpura is a high-growth Jaipur locality with consistent demand from students and early-career professionals due to education proximity and expanding residential supply.",
        "Rental movement is active in PG, rooms, and apartment categories, making category filters highly useful.",
        "RentalPins helps renters quickly compare Jagatpura options against nearby alternatives on map.",
      ],
    },
    {
      title: "Jagatpura rent behavior and inventory quality",
      paragraphs: [
        "Rent in Jagatpura is shaped by property age, furnishing quality, and local connectivity to study/work corridors.",
        "Tenants frequently evaluate value-oriented options first, then trade up based on amenity fit.",
        "Owners improve conversion by adding precise location context and clear move-in readiness details.",
      ],
    },
  ],
  "jaipur/c-scheme": [
    {
      title: "C-Scheme premium central-market dynamics",
      paragraphs: [
        "C-Scheme operates as one of Jaipur's premium central belts, with demand from professionals and businesses seeking central accessibility and established neighborhood quality.",
        "Compared with peripheral locations, C-Scheme often commands higher rent due to location prestige and commercial relevance.",
        "RentalPins locality pages support faster fit-checking between premium listings and practical alternatives.",
      ],
    },
    {
      title: "C-Scheme commercial and residential conversion cues",
      paragraphs: [
        "Both residential and commercial tenants in C-Scheme prioritize access, upkeep, and location credibility.",
        "Listings with complete photos, transparent pricing, and detailed address context convert more efficiently.",
        "Owners can capture higher-intent demand by presenting space-use clarity and realistic price positioning.",
      ],
    },
  ],
  "lucknow/gomti-nagar": [
    {
      title: "Gomti Nagar high-demand urban rental profile",
      paragraphs: [
        "Gomti Nagar is one of Lucknow's most active rental hubs, attracting families, professionals, and students due to modern infrastructure and strong connectivity.",
        "Inventory spans apartments, independent homes, and mixed commercial demand, requiring locality + category comparison for best outcomes.",
        "RentalPins pages for Gomti Nagar support direct owner discovery with map-aware decision flow.",
      ],
    },
    {
      title: "Gomti Nagar rent trend and selection behavior",
      paragraphs: [
        "Rent levels in Gomti Nagar vary by sector maturity, furnishing level, and travel convenience to work and education nodes.",
        "Tenants generally prioritize neighborhood quality and practical commute over headline listing claims.",
        "Owners who align pricing with nearby active stock usually see faster and cleaner conversion cycles.",
      ],
    },
  ],
  "lucknow/indira-nagar-lucknow": [
    {
      title: "Indira Nagar rental stability and demand depth",
      paragraphs: [
        "Indira Nagar has durable demand from families and long-stay renters looking for established infrastructure and neighborhood familiarity.",
        "The area supports multiple property types, with demand distributed across apartments and independent units.",
        "RentalPins helps users compare Indira Nagar options against nearby Lucknow localities through connected local pages.",
      ],
    },
    {
      title: "Indira Nagar pricing and livability priorities",
      paragraphs: [
        "Pricing in Indira Nagar reflects micro-location convenience, unit condition, and social-infrastructure access.",
        "Family tenants often rank safety, schools, and healthcare proximity as core decision factors.",
        "Listings that clearly communicate these strengths tend to produce higher-quality inquiries.",
      ],
    },
  ],
  "lucknow/aliganj": [
    {
      title: "Aliganj residential demand characteristics",
      paragraphs: [
        "Aliganj remains a preferred residential locality in Lucknow, especially for tenants seeking balanced rent, accessibility, and neighborhood maturity.",
        "Demand is steady across family rentals and professional households, with strong importance placed on practical everyday convenience.",
        "RentalPins locality navigation helps users identify suitable micro-pockets in and around Aliganj quickly.",
      ],
    },
    {
      title: "Aliganj rent behavior and listing performance",
      paragraphs: [
        "Rent differences in Aliganj are often driven by property maintenance, furnishing readiness, and exact lane-level location.",
        "Tenants compare multiple nearby properties before decision, so complete listing detail is critical.",
        "Owners can improve lead conversion by providing clear amenity visibility and realistic rent expectations.",
      ],
    },
  ],
  "lucknow/hazratganj": [
    {
      title: "Hazratganj central-location rental opportunity",
      paragraphs: [
        "Hazratganj's central positioning creates demand from professionals and businesses that value city-core access and prestige.",
        "Rental requirements here include both residential convenience and commercial suitability depending on user intent.",
        "RentalPins supports this by linking category pathways and map-driven locality discovery.",
      ],
    },
    {
      title: "Hazratganj premium pricing and tenant intent",
      paragraphs: [
        "Premium central localities like Hazratganj generally show pricing lift due to accessibility, visibility, and neighborhood brand value.",
        "Tenants prioritize exact location utility, quality signals, and trustworthiness of listing information.",
        "Owners with transparent details and accurate property categorization typically get stronger inquiry quality.",
      ],
    },
  ],
  "lucknow/aashiana": [
    {
      title: "Aashiana family-led rental demand",
      paragraphs: [
        "Aashiana attracts family-led demand in Lucknow because of relatively calm residential pockets and daily-use convenience.",
        "Renter behavior is typically long-stay oriented, with emphasis on neighborhood comfort and reliable local services.",
        "RentalPins locality pages help compare Aashiana with adjacent areas for better rent-value decisions.",
      ],
    },
    {
      title: "Aashiana rent trends and conversion factors",
      paragraphs: [
        "Rent in Aashiana is influenced by property upkeep, local access roads, and furnishing status.",
        "Tenants evaluate practical fit first, then negotiate based on condition and location specifics.",
        "Owners can improve conversion by showing complete unit information and quick response availability.",
      ],
    },
  ],
  "mumbai/powai": [
    {
      title: "Powai premium mixed-demand rental hub",
      paragraphs: [
        "Powai is one of Mumbai's high-intent rental localities with strong demand from professionals, students, and corporate tenants due to business proximity and lifestyle infrastructure.",
        "Inventory includes premium apartments, gated-community units, and shared accommodation options, creating clear segmentation by budget and amenity depth.",
        "RentalPins helps users compare Powai micro-pockets with nearby alternatives using locality-first navigation and map context.",
      ],
    },
    {
      title: "Powai pricing behavior and tenant conversion",
      paragraphs: [
        "Rent in Powai varies significantly based on tower quality, view, furnishing level, and exact access corridors.",
        "Tenants usually prioritize commute and building standards before shortlisting, especially in mid-to-premium ranges.",
        "Owners improve lead quality by publishing complete amenities, realistic pricing, and precise location details.",
      ],
    },
  ],
  "mumbai/andheri-west": [
    {
      title: "Andheri West rental liquidity and demand profile",
      paragraphs: [
        "Andheri West is a highly liquid Mumbai rental market with steady movement from working professionals, media-sector tenants, and short-to-medium stay renters.",
        "Strong local commerce and connectivity create persistent demand across apartments, shared units, and selective commercial spaces.",
        "RentalPins locality pages support faster discovery by connecting area context with category-specific inventory browsing.",
      ],
    },
    {
      title: "Andheri West rent trends and shortlist behavior",
      paragraphs: [
        "Pricing in Andheri West reflects building age, transport relevance, and internal street-level livability differences.",
        "Renter decisions are often time-sensitive, so listing clarity and move-in readiness significantly affect conversion.",
        "Owners can reduce lead friction through transparent terms and regularly refreshed listing media.",
      ],
    },
  ],
  "mumbai/bandra-west": [
    {
      title: "Bandra West premium demand concentration",
      paragraphs: [
        "Bandra West remains one of Mumbai's most premium and reputation-driven rental localities, attracting high-intent tenants across residential and lifestyle-oriented categories.",
        "Demand emphasizes neighborhood brand value, convenience, and quality of inventory over low headline pricing.",
        "RentalPins helps compare premium-fit options by surfacing locality-relevant inventory in a structured flow.",
      ],
    },
    {
      title: "Bandra West pricing premium and conversion cues",
      paragraphs: [
        "Rent bands in Bandra West typically carry premium spread due to location prestige, building quality, and social infrastructure access.",
        "Tenants expect strong listing trust signals including complete photos, clear terms, and accurate location context.",
        "Owners with detailed and transparent listing information usually attract better-qualified inquiries.",
      ],
    },
  ],
  "mumbai/goregaon": [
    {
      title: "Goregaon balanced affordability and access profile",
      paragraphs: [
        "Goregaon serves a broad renter base seeking a balance between affordability, urban connectivity, and practical daily convenience.",
        "Inventory mix spans apartments and family rentals, with user intent distributed across mid-segment and value-focused options.",
        "RentalPins locality pages help renters compare Goregaon choices with adjacent corridors before outreach.",
      ],
    },
    {
      title: "Goregaon rent variation and decision factors",
      paragraphs: [
        "Rent movement in Goregaon is influenced by exact micro-location, building condition, and commute relevance to employment hubs.",
        "Tenants evaluate price-quality trade-offs carefully, especially where similar layouts show different maintenance standards.",
        "Owners can improve conversion by aligning rent expectations with nearby active inventory and clear listing details.",
      ],
    },
  ],
  "mumbai/vashi": [
    {
      title: "Vashi commuter-driven rental opportunity",
      paragraphs: [
        "Vashi attracts strong commuter-led demand from professionals and families who want Navi Mumbai connectivity with practical rental options.",
        "Demand includes apartments and mixed-use inventory, where transport convenience and neighborhood services heavily influence final choice.",
        "RentalPins supports Vashi discovery with map-first comparison and direct owner lead pathways.",
      ],
    },
    {
      title: "Vashi pricing behavior and inventory performance",
      paragraphs: [
        "Rent levels in Vashi vary by sector-level accessibility, building upkeep, and local amenity concentration.",
        "Tenants generally shortlist quickly when listings clearly communicate unit condition and location strengths.",
        "Owners who keep listings updated and responsive usually convert inquiries at a better rate.",
      ],
    },
  ],
  "delhi/gtb-nagar": [
    {
      title: "GTB Nagar student and shared-living demand",
      paragraphs: [
        "GTB Nagar has high recurring rental demand tied to student and young professional populations, especially in PG, rooms, and shared accommodation segments.",
        "Fast turnover makes locality-level comparison essential for renters evaluating budget, proximity, and livability.",
        "RentalPins helps streamline this with direct owner options and map-context shortlisting.",
      ],
    },
    {
      title: "GTB Nagar occupancy dynamics and pricing",
      paragraphs: [
        "Pricing in GTB Nagar depends on lane-level location, occupancy-friendly amenities, and furnishing quality.",
        "Tenants usually compare multiple properties quickly, rewarding listings that provide complete details upfront.",
        "Owners can improve occupancy velocity through transparent pricing and frequent listing freshness updates.",
      ],
    },
  ],
  "delhi/hudson-lane": [
    {
      title: "Hudson Lane high-intent student-professional pocket",
      paragraphs: [
        "Hudson Lane combines student demand with urban lifestyle pull, creating a competitive rental pocket for rooms, PG, and compact apartments.",
        "Location convenience and neighborhood activity levels are central to tenant decisions in this micro-market.",
        "RentalPins locality pages help users compare Hudson Lane options with adjacent Delhi demand zones.",
      ],
    },
    {
      title: "Hudson Lane rent behavior and listing quality signals",
      paragraphs: [
        "Rent outcomes in Hudson Lane are sensitive to exact placement, unit condition, and practical move-in readiness.",
        "Tenants prioritize trustworthy listing information because decision cycles are often short.",
        "Owners who provide complete visual and amenity context generally see stronger inquiry quality.",
      ],
    },
  ],
  "delhi/rohini": [
    {
      title: "Rohini family-led rental demand structure",
      paragraphs: [
        "Rohini is a major Delhi residential cluster with steady family and long-stay professional demand supported by planned sector development.",
        "Renter preference often centers on school access, neighborhood infrastructure, and commute practicality.",
        "RentalPins helps users navigate Rohini's large sector spread through area-first discovery and related links.",
      ],
    },
    {
      title: "Rohini pricing spread and conversion criteria",
      paragraphs: [
        "Rent variation in Rohini reflects sector desirability, property age, and furnishing standards.",
        "Tenants compare multiple sector options before finalizing, making complete listing detail crucial.",
        "Owners can improve conversion by highlighting locality-specific strengths and realistic rent positioning.",
      ],
    },
  ],
  "delhi/jasola": [
    {
      title: "Jasola mixed residential-commercial demand",
      paragraphs: [
        "Jasola has mixed demand from professionals and business users due to its strategic location and access to key employment corridors.",
        "Rental interest spans apartments, office-oriented spaces, and practical commute-driven housing choices.",
        "RentalPins supports faster fit analysis by linking locality pages with relevant category pathways.",
      ],
    },
    {
      title: "Jasola rent profile and practical shortlisting",
      paragraphs: [
        "Pricing in Jasola is influenced by building quality, transport access, and use-case suitability.",
        "Tenants value clarity on exact location and space type to avoid mismatch during visits.",
        "Owners can strengthen lead quality by defining inventory purpose and amenity context clearly.",
      ],
    },
  ],
  "delhi/sarita-vihar": [
    {
      title: "Sarita Vihar livability-focused rental demand",
      paragraphs: [
        "Sarita Vihar attracts families and professionals looking for relatively stable residential surroundings with strong connectivity to South and South-East Delhi corridors.",
        "Demand patterns emphasize everyday convenience, neighborhood reliability, and commute balance over speculative premium.",
        "RentalPins locality pages help users compare Sarita Vihar with adjacent options before owner contact.",
      ],
    },
    {
      title: "Sarita Vihar pricing and tenant decision behavior",
      paragraphs: [
        "Rent levels in Sarita Vihar vary by block-level accessibility, property condition, and furnishing status.",
        "Tenants typically shortlist based on practical fit and local services, then evaluate rent competitiveness.",
        "Owners gain better conversion when listings communicate accurate locality context and complete unit details.",
      ],
    },
  ],
  "london/camden": [
    {
      title: "Camden rental demand and lifestyle pull",
      paragraphs: [
        "Camden sees consistently strong rental demand from students, young professionals, and creative-sector tenants due to central access and vibrant neighborhood identity.",
        "Demand includes flats, shared accommodation, and compact premium units, with renter decisions shaped by commute speed and local livability.",
        "RentalPins locality pages make Camden comparisons faster by combining area context with direct listing discovery.",
      ],
    },
    {
      title: "Camden pricing dynamics and conversion cues",
      paragraphs: [
        "Rent in Camden carries a central-location premium and varies by street-level access, building quality, and furnishing standards.",
        "Tenants move quickly in this market, so complete listing information and accurate locality details are essential.",
        "Owners improve lead quality by maintaining current inventory details and realistic pricing expectations.",
      ],
    },
  ],
  "london/shoreditch": [
    {
      title: "Shoreditch professional and creative renter demand",
      paragraphs: [
        "Shoreditch attracts high-intent professionals and creative tenants who prioritize connectivity, lifestyle access, and neighborhood energy.",
        "Rental demand spans modern apartments and shared options, with strong interest in commute-efficient locations.",
        "RentalPins helps users compare Shoreditch inventory with nearby London submarkets through locality-first navigation.",
      ],
    },
    {
      title: "Shoreditch rent positioning and shortlist behavior",
      paragraphs: [
        "Pricing in Shoreditch reflects micro-location appeal, building spec, and proximity to business and transit corridors.",
        "Tenants generally shortlist faster when listings clearly communicate condition, terms, and exact position.",
        "Owners can increase conversion by emphasizing practical fit and transparent listing quality signals.",
      ],
    },
  ],
  "london/westminster": [
    {
      title: "Westminster premium central rental profile",
      paragraphs: [
        "Westminster remains one of London's most premium central rental zones with demand from professionals, diplomats, and long-stay international tenants.",
        "Inventory quality and location prestige drive pricing, while convenience to core city corridors drives sustained intent.",
        "RentalPins locality pages support targeted comparison between premium central options and nearby alternatives.",
      ],
    },
    {
      title: "Westminster pricing premium and trust signals",
      paragraphs: [
        "Rent bands in Westminster are usually elevated due to centrality, building standards, and neighborhood brand value.",
        "Tenants in this segment prioritize listing credibility, full visuals, and clear terms before outreach.",
        "Owners who provide complete and transparent details often attract more qualified leads.",
      ],
    },
  ],
  "london/canary-wharf": [
    {
      title: "Canary Wharf corporate-led rental demand",
      paragraphs: [
        "Canary Wharf has strong professional and corporate-led rental demand, particularly for apartments that optimize commute and building amenities.",
        "Renter intent is typically practical and time-sensitive, with emphasis on transit proximity and unit readiness.",
        "RentalPins helps users evaluate Canary Wharf options using locality context and category-focused pathways.",
      ],
    },
    {
      title: "Canary Wharf rent behavior and conversion factors",
      paragraphs: [
        "Pricing in Canary Wharf varies by tower quality, amenity package, and walking-distance convenience to major office clusters.",
        "Tenants shortlist quickly when listings highlight practical details such as furnishings, policies, and move-in timelines.",
        "Owners can improve conversion velocity through precise listing detail and responsive lead handling.",
      ],
    },
  ],
  "london/kensington-chelsea": [
    {
      title: "Kensington & Chelsea high-premium demand pattern",
      paragraphs: [
        "Kensington & Chelsea is a high-premium London rental market with demand from affluent residents and international long-stay tenants.",
        "Neighborhood prestige, property quality, and lifestyle access shape both discovery behavior and rent expectations.",
        "RentalPins locality pages help compare premium inventory while preserving neighborhood-level relevance.",
      ],
    },
    {
      title: "Kensington & Chelsea pricing and lead quality",
      paragraphs: [
        "Rent outcomes here are driven by property specification, exact locality context, and building reputation.",
        "Tenants in this segment expect complete listing accuracy before progressing to viewings.",
        "Owners who present full details and realistic positioning tend to receive stronger, better-matched inquiries.",
      ],
    },
  ],
  "nairobi/westlands": [
    {
      title: "Westlands mixed residential-commercial rental hub",
      paragraphs: [
        "Westlands is one of Nairobi's most active mixed-use rental hubs, attracting professionals, expats, and business-linked tenants.",
        "Demand spans residential apartments and office-adjacent living options, with high priority on convenience and security.",
        "RentalPins locality pages help users compare Westlands inventory with nearby Nairobi demand corridors.",
      ],
    },
    {
      title: "Westlands pricing behavior and conversion drivers",
      paragraphs: [
        "Rent variation in Westlands reflects building quality, access routes, and amenity depth.",
        "Tenants generally convert faster when listings provide clear location context and complete property detail.",
        "Owners can improve lead quality with transparent pricing and current listing media.",
      ],
    },
  ],
  "nairobi/kilimani": [
    {
      title: "Kilimani urban rental demand fundamentals",
      paragraphs: [
        "Kilimani maintains strong rental demand from professionals and students seeking central access and active neighborhood infrastructure.",
        "Inventory includes apartments and shared options, with demand sensitive to commute efficiency and property condition.",
        "RentalPins helps users filter Kilimani options quickly through locality-first navigation and map context.",
      ],
    },
    {
      title: "Kilimani pricing spread and tenant priorities",
      paragraphs: [
        "Pricing in Kilimani varies by exact pocket, furnishing level, and building amenities.",
        "Tenants prioritize safety, accessibility, and value-fit before contacting owners.",
        "Owners can improve conversion by aligning rents with active nearby supply and publishing complete listing details.",
      ],
    },
  ],
  "nairobi/karen": [
    {
      title: "Karen low-density premium rental character",
      paragraphs: [
        "Karen is a premium, low-density Nairobi locality favored by families and long-stay tenants who value space, privacy, and neighborhood quality.",
        "Demand often focuses on villas and larger homes, with strong importance placed on security and environment quality.",
        "RentalPins locality pages support better matching by surfacing Karen-specific inventory context.",
      ],
    },
    {
      title: "Karen rent behavior and listing trust factors",
      paragraphs: [
        "Rent bands in Karen are driven by plot scale, property condition, and exact access convenience to key roads and services.",
        "Tenants in this segment evaluate listing trust and detail depth before scheduling visits.",
        "Owners can increase inquiry quality by clearly communicating property size, amenities, and maintenance readiness.",
      ],
    },
  ],
  "nairobi/upper-hill": [
    {
      title: "Upper Hill corporate corridor rental opportunity",
      paragraphs: [
        "Upper Hill is a major corporate corridor, generating professional rental demand focused on commute efficiency and secure housing.",
        "Renter intent includes apartments and business-adjacent accommodation with strong preference for reliable access.",
        "RentalPins helps users compare Upper Hill options against nearby neighborhoods through connected locality links.",
      ],
    },
    {
      title: "Upper Hill pricing and practical shortlisting",
      paragraphs: [
        "Pricing in Upper Hill depends on building quality, transport convenience, and perceived neighborhood value.",
        "Tenants favor listings that clearly present access, amenities, and readiness for move-in.",
        "Owners improve conversion by maintaining accurate details and quick response quality.",
      ],
    },
  ],
  "nairobi/parklands": [
    {
      title: "Parklands residential and professional demand mix",
      paragraphs: [
        "Parklands has stable demand from families and professionals due to central accessibility, healthcare proximity, and established neighborhood infrastructure.",
        "Inventory movement is consistent across apartments and family-oriented rentals with varied budget segments.",
        "RentalPins locality pages help users evaluate Parklands value against adjacent Nairobi localities.",
      ],
    },
    {
      title: "Parklands rent trends and listing performance",
      paragraphs: [
        "Rent in Parklands varies by building upkeep, exact location, and amenity availability.",
        "Tenants typically compare multiple nearby properties before decision, making listing quality signals important.",
        "Owners can improve conversion by offering complete media, clear terms, and transparent pricing.",
      ],
    },
  ],
  "lagos/lekki": [
    {
      title: "Lekki peninsula rental demand and inventory mix",
      paragraphs: [
        "Lekki is one of Lagos's highest-intent rental corridors, with strong demand for new-build apartments, duplexes, and short-let flats across Phase 1, Ikate, and the Ajah extension.",
        "Tenants typically evaluate service charges, estate rules, and commute to Island workplaces before shortlisting, making exact locality context essential.",
        "RentalPins helps users compare Lekki micro-pockets with nearby alternatives using map-first discovery and direct lister contact.",
      ],
    },
    {
      title: "Lekki pricing behavior and conversion factors",
      paragraphs: [
        "Rent in Lekki varies by phase, building quality, furnishing, and proximity to key arteries such as the Lekki-Epe expressway.",
        "Short-let and long-stay demand often move at different price bands even within the same estate, so category filters improve fit quality.",
        "Owners can improve inquiry quality by stating service charge terms, furnishing status, and realistic move-in timelines upfront.",
      ],
    },
  ],
  "lagos/ikeja": [
    {
      title: "Ikeja mainland premium rental profile",
      paragraphs: [
        "Ikeja attracts professionals and business tenants seeking mainland convenience, especially around GRA, Allen Avenue, and Adeniyi Jones corridors.",
        "Inventory spans flats, mini flats, and selective commercial frontages, with demand shaped by access to airports, business districts, and daily services.",
        "RentalPins locality pages support faster comparison between Ikeja pockets and adjacent mainland options.",
      ],
    },
    {
      title: "Ikeja rent trends and tenant shortlist behavior",
      paragraphs: [
        "Pricing in Ikeja reflects street-level visibility, building age, security quality, and furnishing readiness.",
        "Tenants often shortlist quickly when listings clearly communicate access routes, power backup context, and included amenities.",
        "Owners gain better conversion by aligning rent with active nearby inventory and keeping listing media current.",
      ],
    },
  ],
  "lagos/victoria-island": [
    {
      title: "Victoria Island corporate and luxury rental demand",
      paragraphs: [
        "Victoria Island (VI) remains a core Lagos premium market for corporate tenants, expatriates, and serviced-apartment demand near Ahmadu Bello Way and Ozumba Mbadiwe.",
        "Renter intent prioritizes security, building standards, and commute efficiency to Island business clusters.",
        "RentalPins helps users evaluate VI inventory with locality context before contacting listers.",
      ],
    },
    {
      title: "VI pricing premium and listing trust signals",
      paragraphs: [
        "VI rents typically carry a premium due to location prestige, building amenities, and short-let suitability.",
        "Tenants expect complete listing accuracy, transparent terms, and clear service-level details before scheduling inspections.",
        "Owners who publish full visuals and realistic pricing generally receive higher-quality leads.",
      ],
    },
  ],
  "lagos/yaba": [
    {
      title: "Yaba student and tech-corridor rental demand",
      paragraphs: [
        "Yaba has sustained demand from students, young professionals, and startup workers around Sabo, Tejuosho, and university-adjacent belts.",
        "Self contain, mini flats, and shared apartments move quickly, so locality-level comparison is critical for budget and commute fit.",
        "RentalPins supports this with map-led browsing and direct lister outreach in Yaba and nearby mainland corridors.",
      ],
    },
    {
      title: "Yaba pricing dynamics and occupancy behavior",
      paragraphs: [
        "Rent in Yaba is sensitive to exact street placement, furnishing quality, and proximity to Herbert Macaulay and transit links.",
        "Fast decision cycles reward listings with complete details, clear occupancy terms, and up-to-date availability.",
        "Owners can improve occupancy velocity through transparent pricing and responsive inquiry handling.",
      ],
    },
  ],
  "lagos/ikoyi": [
    {
      title: "Ikoyi ultra-premium residential demand",
      paragraphs: [
        "Ikoyi is one of Lagos's most premium residential markets, attracting high-income tenants and long-stay professionals seeking privacy, security, and central Island access.",
        "Inventory quality and estate reputation drive both discovery behavior and rent expectations more than headline affordability.",
        "RentalPins locality pages help compare Ikoyi options against VI and mainland alternatives with structured context.",
      ],
    },
    {
      title: "Ikoyi rent positioning and lead quality",
      paragraphs: [
        "Ikoyi pricing is driven by property specification, estate standards, and exact access convenience to key business corridors.",
        "Tenants in this segment prioritize listing credibility and complete documentation before progressing to viewings.",
        "Owners can improve lead quality by presenting accurate space details, maintenance readiness, and transparent fee structures.",
      ],
    },
  ],
  "jaipur/raja-park": [
    {
      title: "Raja Park central Jaipur rental demand",
      paragraphs: [
        "Raja Park is a high-traffic Jaipur locality with strong demand from families and professionals due to central access, retail density, and mature neighborhood infrastructure.",
        "Inventory includes apartments and independent portions, with renters comparing nearby belts such as Malviya Nagar and C-Scheme for value fit.",
        "RentalPins helps users shortlist Raja Park options with map context before contacting owners.",
      ],
    },
    {
      title: "Raja Park pricing and conversion behavior",
      paragraphs: [
        "Rent in Raja Park varies by lane-level convenience, furnishing, and building upkeep even for similar unit sizes.",
        "Tenants convert faster on listings with complete photos, exact locality naming, and clear rental terms.",
        "Owners can improve lead quality by pricing against active nearby inventory and keeping listings fresh.",
      ],
    },
  ],
  "jaipur/sitapura": [
    {
      title: "Sitapura industrial and workforce rental opportunity",
      paragraphs: [
        "Sitapura attracts workforce and business-linked rental demand due to industrial estates, logistics corridors, and expanding residential supply.",
        "Demand spans budget rooms, PG-style accommodation, and practical family rentals where commute and affordability matter most.",
        "RentalPins links Sitapura discovery to category filters and nearby Jaipur locality comparisons.",
      ],
    },
    {
      title: "Sitapura rent behavior and inventory performance",
      paragraphs: [
        "Pricing in Sitapura is influenced by property condition, access roads, and distance to employment hubs.",
        "Tenants prioritize functional fit and transport convenience over premium amenity spend.",
        "Owners improve conversion by clearly defining unit type, furnishing status, and realistic rent positioning.",
      ],
    },
  ],
  "jaipur/bani-park": [
    {
      title: "Bani Park established residential demand",
      paragraphs: [
        "Bani Park remains a preferred Jaipur residential belt for long-stay tenants seeking neighborhood stability, connectivity, and daily-life convenience.",
        "Demand is steady across family rentals and professional households, with strong emphasis on locality reputation and access.",
        "RentalPins locality pages help compare Bani Park with adjacent central Jaipur options.",
      ],
    },
    {
      title: "Bani Park pricing spread and tenant priorities",
      paragraphs: [
        "Rent outcomes in Bani Park depend on micro-location, property age, and furnishing standards.",
        "Tenants usually evaluate schools, markets, and commute practicality alongside headline rent.",
        "Detailed listing presentation improves trust and inquiry conversion in this segment.",
      ],
    },
  ],
  "jaipur/tonk-road": [
    {
      title: "Tonk Road and Durgapura corridor rentals",
      paragraphs: [
        "Tonk Road is a major south Jaipur spine linking Malviya Nagar, Mansarovar, and Jagatpura — corridor flats and shops attract tenants who prioritize arterial access over central premiums.",
        "Durgapura and Pratap Nagar pockets mix family housing with retail frontages — map pins help separate residential lanes from high-traffic commercial stretches.",
        "RentalPins links Tonk Road discovery to nearby Malviya Nagar and Mansarovar comparisons for better rent-to-commute value.",
      ],
    },
    {
      title: "Tonk Road pricing and tenant fit",
      paragraphs: [
        "Rent on Tonk Road varies by furnishing, floor, and distance to key junctions — similar BHK titles can span wide price bands.",
        "Commercial tenants should confirm signage rights and loading access separately from residential renters evaluating noise and traffic.",
        "Owners improve conversion by naming exact landmarks — vague 'Tonk Road Jaipur' titles attract mismatched inquiries.",
      ],
    },
  ],
  "jaipur/vidhyadhar-nagar": [
    {
      title: "Vidhyadhar Nagar planned sector demand",
      paragraphs: [
        "Vidhyadhar Nagar is among north Jaipur's fastest-growing family rental belts — planned sectors, society flats, and builder floors attract tenants comparing value with Vaishali Nagar.",
        "Gandhi Path and sector-block naming matter for commute — map-led search beats scrolling generic Pink City classifieds.",
        "RentalPins locality pages help shortlist Vidhyadhar Nagar pins alongside Vaishali Nagar and Bani Park alternatives.",
      ],
    },
    {
      title: "Vidhyadhar Nagar rent trends and listing quality",
      paragraphs: [
        "Pricing reflects sector maturity, society amenities, and furnishing — newer towers command premiums over older builder floors in the same sector.",
        "Family tenants prioritize school access, parking, and compound security before finalizing advance.",
        "Owners who include tower, block, and parking details receive higher-intent inquiries from map search.",
      ],
    },
  ],
  "jaipur/jaipur-metro": [
    {
      title: "Greater Jaipur city-wide rental search",
      paragraphs: [
        "Jaipur Metro coverage spans Pink City core and outer belts — Malviya Nagar, Vaishali Nagar, Mansarovar, Jagatpura, Sitapura, and Tonk Road each behave as distinct micro-markets on the same map.",
        "City-wide search works best when you anchor to commute, budget, and property type first, then drill into locality pages for deeper context.",
        "RentalPins city-wide pins let tenants compare south IT corridors with north-west family belts without broker-led NCR-style noise.",
      ],
    },
    {
      title: "Cross-locality comparison across Jaipur",
      paragraphs: [
        "Students often start in Malviya Nagar or Sitapura; families lean Vaishali Nagar or Mansarovar — use category filters so PG and flat results stay separated.",
        "Premium central demand in C-Scheme and Raja Park sits on the same map as value options in Mansarovar — pan before you commit to advance.",
        "Short /rentals/jaipur guides link into this hub for quick locality navigation while inventory stays owner-direct.",
      ],
    },
  ],
  "lucknow/mahanagar": [
    {
      title: "Mahanagar planned residential rental profile",
      paragraphs: [
        "Mahanagar is a structured Lucknow locality with consistent family and professional demand supported by planned sectors and reliable civic infrastructure.",
        "Renter behavior is typically long-stay oriented, with emphasis on neighborhood comfort and practical commute routes.",
        "RentalPins helps users compare Mahanagar with Gomti Nagar, Indira Nagar, and other high-demand Lucknow belts.",
      ],
    },
    {
      title: "Mahanagar rent trends and listing conversion",
      paragraphs: [
        "Pricing in Mahanagar reflects sector desirability, unit condition, and furnishing readiness.",
        "Tenants shortlist based on livability signals and transparent listing detail before owner contact.",
        "Owners can improve conversion by aligning rent with nearby active stock and publishing complete unit information.",
      ],
    },
  ],
  "mumbai/chembur": [
    {
      title: "Chembur central-suburban rental liquidity",
      paragraphs: [
        "Chembur is a high-liquidity Mumbai rental hub with strong demand from working professionals and families due to central-suburban connectivity and established social infrastructure.",
        "Inventory spans apartments and family rentals across varied budget bands, making locality + category filtering important.",
        "RentalPins helps users compare Chembur with Powai, Vashi, and adjacent corridors before outreach.",
      ],
    },
    {
      title: "Chembur pricing behavior and shortlist drivers",
      paragraphs: [
        "Rent in Chembur varies by building quality, transit relevance, and internal pocket livability.",
        "Tenants evaluate price-quality trade-offs carefully when similar layouts differ in maintenance and access.",
        "Owners improve lead quality through complete listing media, clear terms, and realistic pricing.",
      ],
    },
  ],
};

// ─── Cities data for navbar dropdown ──────────────────────────────────────────
const NAV_CITIES = [
  {
    hub: "Chandigarh Tricity",
    href: "/rentals/in/chandigarh",
    spokes: [
      { label: "Mohali", href: "/rentals/in/chandigarh/mohali" },
      { label: "Kharar", href: "/rentals/in/chandigarh/kharar" },
      { label: "Panchkula", href: "/rentals/in/chandigarh/panchkula" },
      { label: "Zirakpur", href: "/rentals/in/chandigarh/zirakpur" },
      { label: "Landran", href: "/rentals/in/chandigarh/landran" },
    ],
  },
  {
    hub: "Ludhiana",
    href: "/rentals/in/ludhiana",
    spokes: [
      { label: "Sarabha Nagar", href: "/rentals/in/ludhiana/sarabha-nagar" },
      { label: "Model Town", href: "/rentals/in/ludhiana/model-town" },
      { label: "Pakhowal Road", href: "/rentals/in/ludhiana/pakhowal-road" },
      { label: "BRS Nagar", href: "/rentals/in/ludhiana/brs-nagar" },
      { label: "Focal Point", href: "/rentals/in/ludhiana/focal-point" },
    ],
  },
  {
    hub: "Delhi",
    href: "/rentals/in/delhi",
    spokes: [
      { label: "Mukherjee Nagar", href: "/rentals/in/delhi/mukherjee-nagar" },
      { label: "GTB Nagar",       href: "/rentals/in/delhi/gtb-nagar" },
      { label: "Hudson Lane",     href: "/rentals/in/delhi/hudson-lane" },
      { label: "Dwarka",          href: "/rentals/in/delhi/dwarka" },
      { label: "Rohini",          href: "/rentals/in/delhi/rohini" },
      { label: "Jasola",          href: "/rentals/in/delhi/jasola" },
      { label: "Sarita Vihar",    href: "/rentals/in/delhi/sarita-vihar" },
    ],
  },
  {
    hub: "Jaipur",
    href: "/rentals/in/jaipur",
    spokes: [
      { label: "Malviya Nagar", href: "/rentals/in/jaipur/malviya-nagar" },
      { label: "Vaishali Nagar", href: "/rentals/in/jaipur/vaishali-nagar" },
      { label: "Mansarovar", href: "/rentals/in/jaipur/mansarovar" },
      { label: "Jagatpura", href: "/rentals/in/jaipur/jagatpura" },
      { label: "C-Scheme", href: "/rentals/in/jaipur/c-scheme" },
      { label: "Raja Park", href: "/rentals/in/jaipur/raja-park" },
      { label: "Sitapura", href: "/rentals/in/jaipur/sitapura" },
      { label: "Tonk Road", href: "/rentals/in/jaipur/tonk-road" },
      { label: "Bani Park", href: "/rentals/in/jaipur/bani-park" },
      { label: "Vidhyadhar Nagar", href: "/rentals/in/jaipur/vidhyadhar-nagar" },
    ],
  },
  {
    hub: "Lucknow",
    href: "/rentals/in/lucknow",
    spokes: [
      { label: "Gomti Nagar", href: "/rentals/in/lucknow/gomti-nagar" },
      { label: "Indira Nagar", href: "/rentals/in/lucknow/indira-nagar-lucknow" },
      { label: "Aliganj", href: "/rentals/in/lucknow/aliganj" },
      { label: "Hazratganj", href: "/rentals/in/lucknow/hazratganj" },
      { label: "Aashiana", href: "/rentals/in/lucknow/aashiana" },
    ],
  },
  {
    hub: "Mumbai",
    href: "/rentals/in/mumbai",
    spokes: [
      { label: "Powai", href: "/rentals/in/mumbai/powai" },
      { label: "Andheri West", href: "/rentals/in/mumbai/andheri-west" },
      { label: "Bandra West", href: "/rentals/in/mumbai/bandra-west" },
      { label: "Goregaon", href: "/rentals/in/mumbai/goregaon" },
      { label: "Vashi", href: "/rentals/in/mumbai/vashi" },
    ],
  },
  {
    hub: "London",
    href: "/rentals/uk/london",
    spokes: [
      { label: "Camden", href: "/rentals/uk/london/camden" },
      { label: "Shoreditch", href: "/rentals/uk/london/shoreditch" },
      { label: "Westminster", href: "/rentals/uk/london/westminster" },
      { label: "Canary Wharf", href: "/rentals/uk/london/canary-wharf" },
      { label: "Kensington & Chelsea", href: "/rentals/uk/london/kensington-chelsea" },
    ],
  },
  {
    hub: "Nairobi",
    href: "/rentals/ke/nairobi",
    spokes: [
      { label: "Westlands", href: "/rentals/ke/nairobi/westlands" },
      { label: "Kilimani", href: "/rentals/ke/nairobi/kilimani" },
      { label: "Karen", href: "/rentals/ke/nairobi/karen" },
      { label: "Upper Hill", href: "/rentals/ke/nairobi/upper-hill" },
      { label: "Parklands", href: "/rentals/ke/nairobi/parklands" },
    ],
  },
  {
    hub: "Lagos",
    href: "/rentals/ng/lagos",
    spokes: [
      { label: "Lekki", href: "/rentals/ng/lagos/lekki" },
      { label: "Ikeja", href: "/rentals/ng/lagos/ikeja" },
      { label: "Victoria Island", href: "/rentals/ng/lagos/victoria-island" },
      { label: "Yaba", href: "/rentals/ng/lagos/yaba" },
      { label: "Ikoyi", href: "/rentals/ng/lagos/ikoyi" },
    ],
  },
];

// ─── Cities Dropdown ──────────────────────────────────────────────────────────
function CitiesDropdown() {
  const [open, setOpen] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const enter = () => { if (timeoutRef.current) clearTimeout(timeoutRef.current); setOpen(true); };
  const leave = () => { timeoutRef.current = setTimeout(() => setOpen(false), 150); };
  useEffect(() => () => { if (timeoutRef.current) clearTimeout(timeoutRef.current); }, []);

  return (
    <div style={{ position: "relative" }} onMouseEnter={enter} onMouseLeave={leave}>
      <button onClick={() => setOpen(p => !p)} style={{
        fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 500,
        color: open ? BRAND.accent : BRAND.text, background: "none", border: "none",
        cursor: "pointer", display: "flex", alignItems: "center", gap: 4, padding: "4px 0",
      }}>
        Cities
        <span style={{ fontSize: 10, opacity: 0.6, transform: open ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s", display: "inline-block" }}>▼</span>
      </button>
      {open && (
        <div style={{ position: "absolute", top: "100%", left: "50%", transform: "translateX(-50%)", paddingTop: 8, zIndex: 300 }}>
          <div style={{ background: "#fff", border: `1px solid ${BRAND.border}`, borderRadius: 18, boxShadow: UI.shadowDropdown, padding: 18, minWidth: 720, display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
            {NAV_CITIES.map(city => (
              <div key={city.hub}>
                <a href={city.href} style={{ display: "block", fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 700, color: BRAND.primary, textDecoration: "none", marginBottom: 6, letterSpacing: "0.04em", textTransform: "uppercase" as const }}>{city.hub}</a>
                {city.spokes.map(s => (
                  <a key={s.href} href={s.href} style={{ display: "block", fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: BRAND.muted, textDecoration: "none", padding: "3px 0" }}>› {s.label}</a>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Navbar ───────────────────────────────────────────────────────────────────
// REMOVED: Pricing, How It Works, App Store placeholder
// FIXED: Play Store URL, all links point internal
function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 200,
      background: "rgba(255,255,255,0.92)", backdropFilter: "blur(16px)",
      borderBottom: `1px solid ${BRAND.border}`, padding: "0 24px", height: 60,
      display: "flex", alignItems: "center",
    }}>
      <div style={{ maxWidth: 1400, margin: "0 auto", width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <a href={PATHS.home} style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none", flexShrink: 0 }}>
          <Image src="/logo/logo.png" alt="RentalPins" width={32} height={32} style={{ objectFit: "contain" }} priority />
          <span style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 20, fontWeight: 700, color: BRAND.primary }}>
            Rental<span style={{ color: BRAND.accent }}>Pins</span>
          </span>
        </a>

        <div className="desktop-nav" style={{ display: "flex", alignItems: "center", gap: 28 }}>
          {(
            [
              ["Find Rentals", PATHS.search],
              ["List Property", PATHS.post],
            ] as const
          ).map(([label, href]) => (
            <a key={label} href={href} style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 500, color: BRAND.text, textDecoration: "none" }}>{label}</a>
          ))}
          <CitiesDropdown />
        </div>

        <div className="desktop-nav" style={{ display: "flex", gap: 10, alignItems: "center", flexShrink: 0 }}>
          <a href={PATHS.login} style={{
            padding: "8px 14px", borderRadius: 10, border: `1px solid ${BRAND.border}`,
            fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 600, color: BRAND.primary, textDecoration: "none",
          }}>Sign in</a>
          <a href={PLAY_URL} target="_blank" rel="noopener noreferrer" style={{
            padding: "8px 16px", borderRadius: 10, background: BRAND.accent, color: "#fff",
            fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 600, textDecoration: "none",
            boxShadow: "0 4px 14px rgba(232, 80, 26, 0.35)",
          }}>Get Android App</a>
        </div>

        <button className="mobile-menu-btn" onClick={() => setMenuOpen(!menuOpen)} style={{
          display: "none", background: "none", border: "none", cursor: "pointer", fontSize: 24, color: BRAND.primary,
        }} aria-label="Toggle menu">☰</button>
      </div>

      {menuOpen && (
        <div style={{ position: "fixed", top: 60, left: 0, right: 0, background: "#fff", borderBottom: `1px solid ${BRAND.border}`, padding: "16px 24px 24px", zIndex: 200 }}>
          {([
            ["Browse Rentals", PATHS.search],
            ["List Property", PATHS.post],
            ["Chandigarh", "/rentals/in/chandigarh"],
            ["  Mohali", "/rentals/in/chandigarh/mohali"],
            ["  Kharar", "/rentals/in/chandigarh/kharar"],
            ["  Panchkula", "/rentals/in/chandigarh/panchkula"],
            ["  Zirakpur", "/rentals/in/chandigarh/zirakpur"],
            ["Ludhiana", "/rentals/in/ludhiana"],
            ["  Model Town", "/rentals/in/ludhiana/model-town"],
            ["  Sarabha Nagar", "/rentals/in/ludhiana/sarabha-nagar"],
            ["Delhi", "/rentals/in/delhi"],
            ["  Mukherjee Nagar", "/rentals/in/delhi/mukherjee-nagar"],
            ["  GTB Nagar", "/rentals/in/delhi/gtb-nagar"],
            ["  Hudson Lane", "/rentals/in/delhi/hudson-lane"],
            ["  Dwarka", "/rentals/in/delhi/dwarka"],
            ["  Rohini", "/rentals/in/delhi/rohini"],
            ["Jaipur", "/rentals/in/jaipur"],
            ["  Malviya Nagar", "/rentals/in/jaipur/malviya-nagar"],
            ["  Vaishali Nagar", "/rentals/in/jaipur/vaishali-nagar"],
            ["  Mansarovar", "/rentals/in/jaipur/mansarovar"],
            ["  Jagatpura", "/rentals/in/jaipur/jagatpura"],
            ["  C-Scheme", "/rentals/in/jaipur/c-scheme"],
            ["  Raja Park", "/rentals/in/jaipur/raja-park"],
            ["  Sitapura", "/rentals/in/jaipur/sitapura"],
            ["  Vidhyadhar Nagar", "/rentals/in/jaipur/vidhyadhar-nagar"],
            ["Lucknow", "/rentals/in/lucknow"],
            ["  Gomti Nagar", "/rentals/in/lucknow/gomti-nagar"],
            ["  Indira Nagar", "/rentals/in/lucknow/indira-nagar-lucknow"],
            ["Mumbai", "/rentals/in/mumbai"],
            ["  Powai", "/rentals/in/mumbai/powai"],
            ["  Andheri West", "/rentals/in/mumbai/andheri-west"],
            ["London", "/rentals/uk/london"],
            ["Nairobi", "/rentals/ke/nairobi"],
            ["Lagos", "/rentals/ng/lagos"],
          ] as const).map(([label, href]) => (
            <a key={label} href={href} onClick={() => setMenuOpen(false)} style={{
              display: "block", padding: "13px 0", fontFamily: "'DM Sans', sans-serif", fontSize: 15,
              fontWeight: label.startsWith("  ") ? 400 : 500,
              color: label.startsWith("  ") ? BRAND.muted : BRAND.text,
              textDecoration: "none", borderBottom: `1px solid ${BRAND.border}`,
              paddingLeft: label.startsWith("  ") ? 16 : 0,
            }}>{label.startsWith("  ") ? `› ${label.trim()}` : label}</a>
          ))}
          <a href={PLAY_URL} target="_blank" rel="noopener noreferrer" style={{
            display: "block", textAlign: "center", padding: "12px 0", borderRadius: 8,
            background: BRAND.accent, color: "#fff", fontFamily: "'DM Sans', sans-serif",
            fontSize: 13, fontWeight: 600, textDecoration: "none", marginTop: 16,
          }}>Get Android App</a>
        </div>
      )}
    </nav>
  );
}

// ─── Footer ──────────────────────────────────────────────────────────────────
// REMOVED: Pricing, How It Works, FAQ, Find a Rental (404), List Property (404)
// FIXED: Branding "RentalPins", social links, Play Store URL
function Footer() {
  const cols = [
    {
      title: "PLATFORM",
      links: [
        { label: "Map search", href: PATHS.search },
        { label: "Post a listing", href: PATHS.post },
        { label: "Sign in", href: PATHS.login },
        { label: "Get Android App", href: PLAY_URL },
      ],
    },
    {
      title: "CITIES",
      links: [
        { label: "Chandigarh Tricity", href: "/rentals/in/chandigarh" },
        { label: "Mohali", href: "/rentals/in/chandigarh/mohali" },
        { label: "Ludhiana", href: "/rentals/in/ludhiana" },
        { label: "Delhi", href: "/rentals/in/delhi" },
        { label: "Mukherjee Nagar", href: "/rentals/in/delhi/mukherjee-nagar" },
        { label: "GTB Nagar", href: "/rentals/in/delhi/gtb-nagar" },
        { label: "Dwarka", href: "/rentals/in/delhi/dwarka" },
        { label: "Rohini", href: "/rentals/in/delhi/rohini" },
        { label: "Jaipur", href: "/rentals/in/jaipur" },
        { label: "Malviya Nagar (Jaipur)", href: "/rentals/in/jaipur/malviya-nagar" },
        { label: "Vaishali Nagar (Jaipur)", href: "/rentals/in/jaipur/vaishali-nagar" },
        { label: "Mansarovar (Jaipur)", href: "/rentals/in/jaipur/mansarovar" },
        { label: "Jaipur guides", href: "/rentals/jaipur" },
        { label: "Lucknow", href: "/rentals/in/lucknow" },
        { label: "Gomti Nagar", href: "/rentals/in/lucknow/gomti-nagar" },
        { label: "Mumbai", href: "/rentals/in/mumbai" },
        { label: "Powai", href: "/rentals/in/mumbai/powai" },
        { label: "London", href: "/rentals/uk/london" },
        { label: "Nairobi", href: "/rentals/ke/nairobi" },
        { label: "Lagos", href: "/rentals/ng/lagos" },
      ],
    },
    {
      title: "COMPANY",
      links: [
        { label: "About", href: PATHS.about },
        { label: "Contact", href: PATHS.contact },
        { label: "Blog", href: PATHS.blog },
      ],
    },
    {
      title: "LEGAL",
      links: [
        { label: "Privacy Policy", href: PATHS.privacy },
        { label: "Terms", href: PATHS.terms },
        { label: "Refund Policy", href: PATHS.refund },
      ],
    },
  ];

  return (
    <footer style={{ background: BRAND.surface, borderTop: `1px solid ${BRAND.border}`, padding: "48px 24px 28px", fontFamily: "'DM Sans', sans-serif" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "1.4fr 1fr 1fr 1fr 1fr", gap: 32 }} className="footer-grid">
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
            <Image src="/logo/logo.png" alt="RentalPins" width={28} height={28} style={{ objectFit: "contain" }} />
            <span style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 18, fontWeight: 700, color: BRAND.primary }}>
              Rental<span style={{ color: BRAND.accent }}>Pins</span>
            </span>
          </div>
          <p style={{ fontSize: 13, color: BRAND.muted, lineHeight: 1.6, maxWidth: 220 }}>
            Rent Anything Anywhere. India&apos;s map-first rental marketplace.
          </p>
          <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
            {[
              { label: "f", href: "https://www.facebook.com/rentalpins" },
              { label: "ig", href: "https://www.instagram.com/rentalpins/" },
              { label: "X", href: "https://x.com/rentalpins" },
            ].map(s => (
              <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" style={{
                width: 32, height: 32, borderRadius: "50%", background: BRAND.border,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 12, fontWeight: 700, color: BRAND.muted, textDecoration: "none",
              }}>{s.label}</a>
            ))}
          </div>
        </div>
        {cols.map(col => (
          <div key={col.title}>
            <h4 style={{ fontSize: 11, fontWeight: 700, color: BRAND.muted, letterSpacing: "0.08em", marginBottom: 14, textTransform: "uppercase" as const }}>{col.title}</h4>
            {col.links.map(link => (
              <a key={link.label} href={link.href} style={{ display: "block", fontSize: 13, fontWeight: 500, color: BRAND.text, textDecoration: "none", padding: "4px 0" }}>{link.label}</a>
            ))}
          </div>
        ))}
      </div>
      <div style={{ maxWidth: 1200, margin: "28px auto 0", paddingTop: 20, borderTop: `1px solid ${BRAND.border}`, display: "flex", justifyContent: "space-between", flexWrap: "wrap" as const, gap: 8 }}>
        <span style={{ fontSize: 12, color: BRAND.muted }}>© {new Date().getFullYear()} RentalPins. All rights reserved.</span>
        <span style={{ fontSize: 12, color: BRAND.muted }}>Made with love in Punjab, India</span>
      </div>
    </footer>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────
export default function AreaClient({
  area,
  listingsCount = 0,
}: {
  area: AreaData;
  listingsCount?: number;
}) {
  const [faqOpen, setFaqOpen] = useState<number | null>(null);
  const isSubArea = area.parentCity !== "";

  // Build the current page's base path (for popular search self-links)
  const currentPath = isSubArea
    ? `/rentals/${area.parentCountrySlug}/${area.parentSlug}/${area.slug}`
    : `/rentals/${area.parentCountrySlug}/${area.slug}`;

  const cityOrArea = area.name;
  const parentCityName = isSubArea ? area.parentCity : area.name;
  const supplyCitySlug = isSubArea ? area.parentSlug : area.slug;
  const supplyAreaSlug = isSubArea ? area.slug : undefined;
  const supplyBrowseHref = appPath(
    mapSearchUrl(
      area.coordinates.lat,
      area.coordinates.lng,
      isSubArea ? 13 : 12,
      undefined,
      undefined,
      undefined,
      undefined,
      area.name
    )
  );
  const focusKey = isSubArea ? `${area.parentSlug}/${area.slug}` : area.slug;
  const focusedSections = FOCUSED_LONGFORM_OVERRIDES[focusKey] ?? [];
  const longFormSections = isSubArea
    ? [
        {
          title: `${cityOrArea} area guide`,
          paragraphs: [
            `${cityOrArea} is one of the most searched micro-markets in ${parentCityName} on RentalPins. ${area.heroDescription}`,
            `For tenants, the biggest advantage of this area is discoverability by map. Instead of generic city-wide classifieds, you can evaluate listings street-by-street, compare rents in nearby pockets, and shortlist based on commute convenience.`,
            `For owners, ${cityOrArea} pages attract high-intent renters already searching by locality. This usually improves inquiry quality compared with untargeted feed traffic.`,
          ],
        },
        {
          title: `Connectivity and transport in ${cityOrArea}`,
          paragraphs: [
            `Connectivity drives rental demand in ${cityOrArea}. Renters usually prioritize travel time to offices, colleges, coaching hubs, and daily-need markets before finalizing a room, flat, PG, or commercial unit.`,
            `Use the map-first flow to compare road links, public transport access, and practical travel corridors between ${cityOrArea} and nearby areas such as ${area.popularAreas.slice(0, 5).join(", ")}.`,
            `Because listings are shown with exact locality context, you can quickly separate \"good-on-paper\" options from genuinely convenient addresses.`,
          ],
        },
        {
          title: `Nearby landmarks, facilities, and daily-life convenience`,
          paragraphs: [
            `Rental decisions in ${cityOrArea} are strongly influenced by nearby schools, hospitals, grocery clusters, and social infrastructure. Families usually evaluate school access and safety, while students prioritize food, transit, and affordability.`,
            `Commercial tenants tend to focus on market visibility, delivery convenience, and parking/logistics practicality. On RentalPins, these priorities can be validated by exploring surrounding localities before contacting owners.`,
            `This locality-level approach reduces decision friction and helps both tenants and businesses shortlist faster.`,
          ],
        },
        {
          title: `Rental demand and property types`,
          paragraphs: [
            `Demand in ${cityOrArea} is distributed across multiple use cases: student accommodation, family homes, and business rentals. Popular supply types generally include rooms, flats, PG/hostels, shops, office spaces, and selected warehouse/industrial options depending on locality profile.`,
            `You can start from category filters and then refine by budget and furnishing requirements. This is especially helpful when comparing trade-offs between low rent and better connectivity.`,
            `Owners posting with complete photos, accurate location names, and realistic pricing tend to receive faster and higher-quality inquiries.`,
          ],
        },
        {
          title: `Rent trends and pricing behavior`,
          paragraphs: [
            `Rents in ${cityOrArea} vary by furnishing level, building condition, floor, parking availability, and distance from demand anchors. Similar listing titles can still have large rent differences based on exact map position.`,
            `For practical price discovery, compare multiple nearby pins in the same category and evaluate what each price includes. This gives a clearer view than relying on a single portal estimate.`,
            `If you are listing as an owner, pricing in line with nearby active inventory improves conversion and reduces vacancy time.`,
          ],
        },
        {
          title: `Nearby areas you should compare`,
          paragraphs: [
            `Before finalizing, compare ${cityOrArea} with nearby options in ${parentCityName}. RentalPins area pages are designed for this exact workflow: local page -> nearby area -> category refinement -> listing detail.`,
            `This structured discovery path helps renters find better value and helps owners reach audiences already ready to transact.`,
            `Use the nearby links above to evaluate alternatives and identify the best fit for budget, lifestyle, or business needs.`,
          ],
        },
      ]
    : [
        {
          title: `${cityOrArea} city overview`,
          paragraphs: [
            `${cityOrArea} is a high-intent rental market on RentalPins with demand spanning residential, student, and commercial segments. ${area.heroDescription}`,
            `Unlike text-heavy listing feeds, the city hub organizes discovery by map, locality, and category so users can move from broad exploration to neighborhood-level decisions quickly.`,
            `This improves both tenant experience and owner conversion quality by aligning search intent with location-specific supply.`,
          ],
        },
        {
          title: `Rental market overview in ${cityOrArea}`,
          paragraphs: [
            `The local rental market includes flats, houses, PG/hostels, shops, offices, and selected industrial inventory depending on city profile. Different micro-markets attract different renter cohorts and price bands.`,
            `Most successful searches begin with locality discovery, then category filters, then listing-level comparison. RentalPins supports this journey with city -> area -> category navigation and direct owner contact options.`,
            `Owners benefit from city pages because users arriving here typically have immediate location intent and higher probability of inquiry.`,
          ],
        },
        {
          title: `Average rent behavior and price signals`,
          paragraphs: [
            `Average rents in ${cityOrArea} vary by locality demand, furnishing, accessibility, and inventory age. One-size averages are often misleading without map-level context.`,
            `To estimate practical budgets, compare clusters of active listings in your target areas and categories. Focus on nearby comparable inventory rather than broad city-wide assumptions.`,
            `This approach gives tenants clearer expectations and helps owners set realistic prices aligned with current demand.`,
          ],
        },
        {
          title: `Student, family, and commercial rental zones`,
          paragraphs: [
            `Student demand usually concentrates around universities, coaching belts, and transit-connected localities where PG and room inventory is strong.`,
            `Family demand typically favors stable residential neighborhoods with schools, hospitals, and daily-life amenities.`,
            `Commercial demand prioritizes visibility, access, and business utility, especially for shops, offices, and warehouse-linked operations.`,
          ],
        },
        {
          title: `Transport connectivity, schools, hospitals, and shopping`,
          paragraphs: [
            `Transport and infrastructure are key differentiators across localities in ${cityOrArea}. Commute time, arterial road access, and public transport availability directly affect rental preference and price.`,
            `School and healthcare access often drive long-term family decisions, while shopping and market proximity influences both residential convenience and commercial viability.`,
            `Use area pages to evaluate these factors locality-by-locality instead of relying on generic city-level assumptions.`,
          ],
        },
        {
          title: `Related cities and expansion opportunities`,
          paragraphs: [
            `Rental demand often overlaps with nearby cities and corridors. If inventory in one locality feels overpriced or limited, compare related city hubs through the connected rental network.`,
            `This cross-city discovery model helps renters find better options and helps owners tap broader but still relevant demand.`,
            `RentalPins keeps this journey simple with direct links between city hubs, locality pages, and category-focused entry points.`,
          ],
        },
      ];
  const finalLongFormSections = [...focusedSections, ...longFormSections];

  return (
    <>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: var(--font-sans); -webkit-font-smoothing: antialiased; }
        .desktop-nav { display: flex !important; }
        .mobile-menu-btn { display: none !important; }
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
          .footer-grid { grid-template-columns: 1fr 1fr !important; }
          .stats-grid { grid-template-columns: 1fr 1fr !important; }
          .cat-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 480px) {
          .footer-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      <Navbar />

      {/* ── Breadcrumbs ────────────────────────────────────────────────── */}
      <div style={{ marginTop: 60, padding: "14px 24px", background: BRAND.surface, borderBottom: `1px solid ${BRAND.border}` }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: BRAND.muted }}>
          <a href={PATHS.home} style={{ color: BRAND.muted, textDecoration: "none" }}>Home</a>
          <span style={{ margin: "0 8px", opacity: 0.4 }}>›</span>
          <a href={PATHS.rentals} style={{ color: BRAND.muted, textDecoration: "none" }}>Rentals</a>
          {isSubArea && (
            <>
              <span style={{ margin: "0 8px", opacity: 0.4 }}>›</span>
              <a href={`/rentals/${area.parentCountrySlug}/${area.parentSlug}`} style={{ color: BRAND.muted, textDecoration: "none" }}>{area.parentCity}</a>
            </>
          )}
          <span style={{ margin: "0 8px", opacity: 0.4 }}>›</span>
          <span style={{ color: BRAND.text, fontWeight: 600 }}>{area.name}</span>
        </div>
      </div>

      {/* ── Hero Section ───────────────────────────────────────────────── */}
      <section style={{ padding: "48px 24px 40px", background: "#fff" }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 700, color: BRAND.accent, letterSpacing: "0.08em", textTransform: "uppercase" as const, marginBottom: 12 }}>
            {area.badge}
          </div>
          <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(28px, 5vw, 40px)", fontWeight: 800, color: BRAND.primary, lineHeight: 1.15, marginBottom: 16 }}>
            Rentals {isSubArea ? "in" : "across"} {area.name}
          </h1>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 16, color: BRAND.muted, lineHeight: 1.7, marginBottom: 24, maxWidth: 640 }}>
            {area.heroDescription}
          </p>

          {/* Area pills */}
          <div style={{ display: "flex", flexWrap: "wrap" as const, gap: 8, marginBottom: 28 }}>
            {area.tagline.split("·").map(t => t.trim()).filter(Boolean).map(t => (
              <span key={t} style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 600, color: BRAND.primary, background: `${BRAND.primary}0D`, padding: "6px 14px", borderRadius: 100 }}>
                {t}
              </span>
            ))}
          </div>

          {/* CTA buttons */}
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" as const }}>
            <a
              href={appPath(
                mapSearchUrl(
                  area.coordinates.lat,
                  area.coordinates.lng,
                  isSubArea ? 13 : 12,
                  undefined,
                  undefined,
                  undefined,
                  undefined,
                  area.name
                )
              )}
              style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              background: BRAND.accent, color: "#fff", padding: "14px 28px", borderRadius: 12,
              fontFamily: "'DM Sans', sans-serif", fontSize: 15, fontWeight: 700, textDecoration: "none",
              boxShadow: `0 8px 32px ${BRAND.accent}44`,
            }}>Browse on Map</a>
            <a href={PATHS.post} style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              background: BRAND.surface, color: BRAND.primary, border: `1.5px solid ${BRAND.border}`,
              padding: "14px 28px", borderRadius: 12,
              fontFamily: "'DM Sans', sans-serif", fontSize: 15, fontWeight: 600, textDecoration: "none",
            }}>Post Free Listing</a>
          </div>
        </div>
      </section>

      <ListPropertyCTA
        variant="hero"
        cityName={parentCityName}
        areaName={isSubArea ? area.name : undefined}
        citySlug={supplyCitySlug}
        areaSlug={supplyAreaSlug}
        browseHref={supplyBrowseHref}
        listHref={PATHS.post}
      />

      {/* ── Stats ──────────────────────────────────────────────────────── */}
      <section style={{ padding: "32px 24px", background: BRAND.surface }}>
        <div style={{ maxWidth: 800, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, textAlign: "center" }} className="stats-grid">
          {[
            { label: "Active Listings", value: listingsCount.toString() },
            { label: "Categories", value: "9" },
            { label: isSubArea ? "Sub-areas" : "Areas Covered", value: `${area.popularAreas.length}+` },
            { label: "Free Listing", value: "Available" },
          ].map(s => (
            <div key={s.label} style={{ padding: "16px 12px" }}>
              <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 22, fontWeight: 800, color: BRAND.primary, marginBottom: 4 }}>{s.value}</div>
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: BRAND.muted }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      <SupplyAudienceSection
        citySlug={supplyCitySlug}
        areaSlug={supplyAreaSlug}
        listHref={PATHS.post}
      />

      {focusKey === "chandigarh/mohali" ? (
        <MohaliGscHubLinks title="Mohali sector guides" />
      ) : null}

      {/* ── Popular Areas ──────────────────────────────────────────────── */}
      <section style={{ padding: "40px 24px", background: "#fff" }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <h2 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 700, color: BRAND.muted, letterSpacing: "0.06em", textTransform: "uppercase" as const, marginBottom: 16 }}>
            Areas Covered
          </h2>
          <div style={{ display: "flex", flexWrap: "wrap" as const, gap: 8 }}>
            {area.popularAreas.map(a => (
              <span key={a} style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 500, color: BRAND.text, background: BRAND.surface, border: `1px solid ${BRAND.border}`, padding: "7px 16px", borderRadius: 100 }}>{a}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ── Top Categories — links go to homepage (not app.rentalpins.com) */}
      <section style={{ padding: "48px 24px", background: BRAND.surface }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(22px, 3vw, 28px)", fontWeight: 700, color: BRAND.primary, marginBottom: 8 }}>
            What people rent most in {area.name}
          </h2>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: BRAND.muted, marginBottom: 24 }}>
            Browse by category across {area.name}
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 16 }} className="cat-grid">
            {area.topCategories.map(cat => (
              <a key={cat.name} href={appPath(mapSearchUrl(area.coordinates.lat, area.coordinates.lng, isSubArea ? 13 : 12, undefined, cat.name))} style={{
                display: "block", background: "#fff", border: `1px solid ${BRAND.border}`,
                borderRadius: 14, padding: "20px", textDecoration: "none",
              }}>
                <div style={{ fontSize: 28, marginBottom: 8 }}>{cat.icon}</div>
                <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 16, fontWeight: 700, color: BRAND.primary, marginBottom: 6 }}>{cat.name}</div>
                <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: BRAND.muted, lineHeight: 1.6 }}>{cat.desc}</div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ── Popular Searches — FIXED: link to own page (not app.rentalpins.com) */}
      <section style={{ padding: "48px 24px", background: "#fff" }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(22px, 3vw, 28px)", fontWeight: 700, color: BRAND.primary, marginBottom: 8 }}>
            What people are searching in {area.name}
          </h2>
          <div style={{ display: "flex", flexWrap: "wrap" as const, gap: 10, marginTop: 20 }}>
            {area.popularSearches.map(s => (
              <a
                key={s}
                href={appPath(
                  mapSearchUrl(
                    area.coordinates.lat,
                    area.coordinates.lng,
                    isSubArea ? 13 : 12,
                    undefined,
                    undefined,
                    undefined,
                    s
                  )
                )}
                style={{
                fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 500,
                color: BRAND.primary, background: `${BRAND.primary}08`,
                border: `1px solid ${BRAND.border}`, padding: "8px 16px",
                borderRadius: 100, textDecoration: "none",
              }}>{s}</a>
            ))}
          </div>
        </div>
      </section>

      {/* ── Spoke Links (Explore Nearby) ───────────────────────────────── */}
      {area.spokeLinks.length > 0 && (
        <section style={{ padding: "40px 24px", background: BRAND.surface }}>
          <div style={{ maxWidth: 800, margin: "0 auto" }}>
            <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(20px, 3vw, 24px)", fontWeight: 700, color: BRAND.primary, marginBottom: 16 }}>
              {isSubArea ? `More areas in ${area.parentCity}` : `Explore areas in ${area.name}`}
            </h2>
            <div style={{ display: "flex", flexWrap: "wrap" as const, gap: 10 }}>
              {isSubArea && (
                <a href={`/rentals/${area.parentCountrySlug}/${area.parentSlug}`} style={{
                  fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 600,
                  color: BRAND.accent, background: `${BRAND.accent}0D`,
                  border: `1px solid ${BRAND.accent}33`, padding: "10px 20px",
                  borderRadius: 12, textDecoration: "none",
                }}>All of {area.parentCity}</a>
              )}
              {area.spokeLinks.map(s => (
                <a key={s.href} href={s.href} style={{
                  fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 500,
                  color: BRAND.text, background: "#fff", border: `1px solid ${BRAND.border}`,
                  padding: "10px 20px", borderRadius: 12, textDecoration: "none",
                }}>{s.label}</a>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Long-form SEO Content ───────────────────────────────────── */}
      <section style={{ padding: "48px 24px", background: "#fff" }}>
        <div style={{ maxWidth: 820, margin: "0 auto" }}>
          {finalLongFormSections.map((section) => (
            <div key={section.title} style={{ marginBottom: 28 }}>
              <h2
                style={{
                  fontFamily: "'Playfair Display', Georgia, serif",
                  fontSize: "clamp(22px, 3vw, 28px)",
                  fontWeight: 700,
                  color: BRAND.primary,
                  marginBottom: 10,
                }}
              >
                {section.title}
              </h2>
              {section.paragraphs.map((para) => (
                <p
                  key={para}
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: 15,
                    color: BRAND.muted,
                    lineHeight: 1.8,
                    marginBottom: 10,
                  }}
                >
                  {para}
                </p>
              ))}
            </div>
          ))}
          <p
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 14,
              color: BRAND.muted,
              lineHeight: 1.8,
            }}
          >
            Explore live listings in {cityOrArea} with map filters, nearby locality comparisons,
            and direct owner contact. For the best results, shortlist by category first,
            compare nearby map pins, and then review listing-level details before contacting.
          </p>
        </div>
      </section>

      <AreaSupplyDemandSection
        cityName={parentCityName}
        areaName={isSubArea ? area.name : area.name}
        nearbyAreas={area.spokeLinks.slice(0, 6).map((s) => s.label)}
        rentalTypes={area.topCategories.map((c) => c.name)}
        lowListings={listingsCount < 3}
        citySlug={supplyCitySlug}
        areaSlug={supplyAreaSlug}
        browseHref={supplyBrowseHref}
        listHref={PATHS.post}
      />

      {/* ── FAQs ──────────────────────────────────────────────────────── */}
      {area.faqs.length > 0 && (
        <section style={{ padding: "48px 24px", background: "#fff" }}>
          <div style={{ maxWidth: 700, margin: "0 auto" }}>
            <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(22px, 3vw, 28px)", fontWeight: 700, color: BRAND.primary, textAlign: "center", marginBottom: 32 }}>
              Frequently Asked Questions
            </h2>
            {area.faqs.map((faq, i) => (
              <div key={i} style={{ borderBottom: `1px solid ${BRAND.border}`, padding: "16px 0" }}>
                <button onClick={() => setFaqOpen(faqOpen === i ? null : i)} style={{
                  width: "100%", textAlign: "left", background: "none", border: "none",
                  cursor: "pointer", fontFamily: "'DM Sans', sans-serif", fontSize: 15,
                  fontWeight: 600, color: BRAND.text, display: "flex",
                  justifyContent: "space-between", alignItems: "center", padding: 0,
                }}>
                  {faq.q}
                  <span style={{ fontSize: 18, color: BRAND.muted, transform: faqOpen === i ? "rotate(45deg)" : "rotate(0deg)", transition: "transform 0.2s", flexShrink: 0, marginLeft: 12 }}>+</span>
                </button>
                {faqOpen === i && (
                  <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: BRAND.muted, lineHeight: 1.7, marginTop: 10 }}>{faq.a}</p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── Bottom CTA — links to homepage (not app.rentalpins.com) ───── */}
      <section style={{
        padding: "56px 24px",
        background: `linear-gradient(135deg, ${BRAND.primary} 0%, #0F2554 100%)`,
        textAlign: "center",
      }}>
        <div style={{ maxWidth: 600, margin: "0 auto" }}>
          <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(22px, 3vw, 30px)", fontWeight: 700, color: "#fff", marginBottom: 12 }}>
            {area.ctaHeading}
          </h2>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 15, color: "rgba(255,255,255,0.65)", lineHeight: 1.7, marginBottom: 28 }}>
            {area.ctaBody}
          </p>
          <div style={{ display: "flex", justifyContent: "center", gap: 12, flexWrap: "wrap" as const }}>
            <a href={PATHS.post} style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              background: BRAND.accent, color: "#fff", padding: "14px 28px", borderRadius: 12,
              fontFamily: "'DM Sans', sans-serif", fontSize: 15, fontWeight: 700, textDecoration: "none",
            }}>Post Free Listing</a>
            <a href={PLAY_URL} target="_blank" rel="noopener noreferrer" style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              background: "rgba(255,255,255,0.1)", color: "#fff",
              border: "1.5px solid rgba(255,255,255,0.25)", padding: "14px 28px", borderRadius: 12,
              fontFamily: "'DM Sans', sans-serif", fontSize: 15, fontWeight: 600, textDecoration: "none",
            }}>Get Android App</a>
          </div>
        </div>
      </section>

      <StickySeoCTA
        browseHref={supplyBrowseHref}
        listHref={PATHS.post}
        citySlug={supplyCitySlug}
        areaSlug={supplyAreaSlug}
        placeQuery={area.name}
      />

      <Footer />
    </>
  );
}

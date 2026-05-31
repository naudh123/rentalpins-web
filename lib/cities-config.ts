// ─── lib/cities-config.ts ─────────────────────────────────────────────────────
// Single source of truth for all city and area data.
// Add a city or area here → page auto-created, sitemap auto-updated, navbar auto-populated.
//
// To add a new city:  Add an entry to CITIES array.
// To add a new area:  Add to the city's `areas` array.
// That's it. Deploy and the pages exist.

import type { AreaConfig, CityConfig } from "./rental-city-config-types";
import { INTERNATIONAL_CITIES } from "./rental-intl-city-config";
import { JAIPUR_LUCKNOW_MUMBAI_CITIES } from "./rental-india-jaipur-lucknow-mumbai";

export type { AreaConfig, CityConfig } from "./rental-city-config-types";

/** URL segment for country hubs (also used by middleware). */
export const RENTAL_COUNTRY_SLUGS = ["in", "uk", "ke", "ng"] as const;
export type RentalCountrySlug = (typeof RENTAL_COUNTRY_SLUGS)[number];

export function rentalCityPath(countrySlug: string, citySlug: string): string {
  return `/rentals/${countrySlug}/${citySlug}`;
}

export function rentalAreaPath(
  countrySlug: string,
  citySlug: string,
  areaSlug: string
): string {
  return `/rentals/${countrySlug}/${citySlug}/${areaSlug}`;
}

// ─── ALL CITIES ───────────────────────────────────────────────────────────────
export const CITIES: CityConfig[] = [
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // CHANDIGARH TRICITY
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  {
    countrySlug: "in",
    slug: "chandigarh",
    name: "Chandigarh Tricity",
    country: "India",
    tagline: "Chandigarh · Mohali · Panchkula · Zirakpur · Kharar · Landran · Banur",
    badge: "NOW LIVE — CHANDIGARH TRICITY",
    heroDescription:
      "Browse property, vehicles, electronics and more on rent across Chandigarh, Mohali, Panchkula, Zirakpur, Kharar, Landran and Banur — all on one live map.",
    coordinates: { lat: 30.7333, lng: 76.7794 },
    popularAreas: [
      "Sector 17", "Sector 22", "Sector 35", "Sector 43",
      "Mohali", "Panchkula", "Zirakpur", "Kharar",
      "Landran", "Banur", "Manimajra", "IT Park",
      "Aerocity", "New Chandigarh",
    ],
    topCategories: [
      { name: "Property", color: "#7B1FA2", icon: "🏠", desc: "Rooms, apartments, PG, villas, independent houses and commercial spaces across all Tricity sectors and areas." },
      { name: "Vehicles", color: "#1976D2", icon: "🚗", desc: "Cars, bikes, scooters, trucks and tempo travellers on rent across Chandigarh Tricity." },
      { name: "Electronics & Gadgets", color: "#FF8F00", icon: "💻", desc: "Laptops, cameras, projectors and mobile phones available for short-term and long-term rent." },
    ],
    popularSearches: [
      "Room for rent in Chandigarh", "Apartments / Flats for rent in Chandigarh",
      "House for rent in Chandigarh", "PG/Hostels for rent in Chandigarh",
      "Shops for rent in Chandigarh", "Office Space for rent in Chandigarh",
      "Room for rent in Mohali", "Apartments / Flats for rent in Mohali",
      "PG/Hostels for rent in Mohali", "Room for rent in Panchkula",
      "Apartments / Flats for rent in Panchkula", "Room for rent in Zirakpur",
      "Apartments / Flats for rent in Zirakpur", "PG/Hostels for rent in Zirakpur",
      "Rentals in Chandigarh", "Rentals in Mohali",
      "Rentals in Panchkula", "Rentals in Zirakpur",
      "Rentals in Kharar", "Rentals in Landran",
      "Rentals in Manimajra", "Rentals in IT Park",
      "Rentals in Aerocity", "Rentals in New Chandigarh",
    ],
    faqs: [
      { q: "How do I find a room for rent in Chandigarh without a broker?", a: "Open RentalPins and browse the live map of Chandigarh Tricity. All listings are posted directly by owners — no broker fees. Filter by category (rooms, flats, PG) and area (Mohali, Panchkula, Zirakpur, etc.) to find what you need." },
      { q: "Is it free to list a rental property in Chandigarh?", a: "Yes! RentalPins offers free listings in Chandigarh. Download the app or visit www.rentalpins.com to post your property, vehicle, or equipment in minutes." },
      { q: "What areas does RentalPins cover in Chandigarh Tricity?", a: "RentalPins covers all of Chandigarh Tricity including Chandigarh city, Mohali, Panchkula, Zirakpur, Kharar, Landran, Banur, Manimajra, IT Park, Aerocity, and New Chandigarh." },
      { q: "What types of rentals are available on RentalPins in Chandigarh?", a: "RentalPins has 9 rental categories: Property (rooms, flats, PG, villas, shops, offices), Vehicles, Electronics & Gadgets, Home Appliances, Furniture, Heavy Machinery, Construction Equipment, Event & Production gear, and more." },
      { q: "How do I contact a rental owner on RentalPins?", a: "Tap any pin on the map to see listing details. You can contact the owner via WhatsApp, direct call, or in-app chat. All users are OTP-verified for safety." },
    ],
    ctaHeading: "Have something to rent in Chandigarh Tricity?",
    ctaBody: "List your property, vehicle or equipment in minutes. Reach thousands of renters across Chandigarh, Mohali, Panchkula, Zirakpur, Kharar, Landran and Banur. Free to list — check the app for current city offers.",
    status: "live",
    areas: [
      {
        slug: "mohali",
        name: "Mohali",
        tagline: "Phase 1–11 · IT Park · Aerocity · Airport Road · Landran · Kharar",
        badge: "NOW LIVE — MOHALI",
        primaryFocus: "Apartments & IT Professionals",
        heroDescription: "Mohali is the fastest-growing city in the Chandigarh Tricity — home to the IT Park, international airport, and hundreds of gated societies. Browse apartments, PG, office spaces, vehicles and more across Phase 1–11, Aerocity and beyond.",
        coordinates: { lat: 30.7046, lng: 76.7179 },
        popularAreas: ["Phase 1", "Phase 2", "Phase 3B2", "Phase 5", "Phase 7", "Phase 9", "Phase 10", "Phase 11", "IT Park", "Aerocity", "Airport Road", "Landran Road", "Sunny Enclave", "New Chandigarh"],
        topCategories: [
          { name: "Property", color: "#7B1FA2", icon: "🏠", desc: "Apartments, flats, PG and independent houses across all Mohali phases and gated societies." },
          { name: "Vehicles", color: "#1976D2", icon: "🚗", desc: "Cars, bikes and scooters on rent — ideal for IT professionals and students commuting across Tricity." },
          { name: "Office Space", color: "#FF8F00", icon: "💼", desc: "Co-working desks, private cabins and commercial units near Mohali IT Park and Aerocity." },
        ],
        popularSearches: [
          "Room for rent in Mohali", "Apartment for rent in Mohali Phase 7", "PG in Mohali IT Park",
          "Flat for rent in Mohali Phase 11", "1 BHK in Mohali", "2 BHK in Aerocity Mohali",
          "Office space for rent in Mohali", "Co-working in Mohali IT Park", "Furnished flat Mohali",
          "PG near Chandigarh Airport", "House for rent in Sunny Enclave", "Bike for rent Mohali",
          "Car rental Mohali", "Furniture on rent Mohali", "Studio apartment Mohali",
        ],
        faqs: [
          { q: "What are the best areas to rent a flat in Mohali?", a: "Phase 7, Phase 9, Phase 11, and Aerocity are the most popular areas for flat rentals in Mohali. Phase 3B2 and Phase 5 offer more affordable options while staying well-connected to the IT Park and Chandigarh." },
          { q: "Is PG accommodation available near Mohali IT Park?", a: "Yes — RentalPins has PG and hostel listings close to the IT Park, Airport Road, and Phase 8. You can browse all available options on the live map and contact owners directly without any brokerage." },
          { q: "Can I rent office space or a co-working desk in Mohali?", a: "Absolutely. Mohali IT Park and Aerocity have a growing number of co-working spaces, private offices, and commercial units available on RentalPins." },
          { q: "Are there any brokerage fees for rentals in Mohali on RentalPins?", a: "No. RentalPins connects you directly with property owners and listers. There is no brokerage charge to browse or contact owners." },
          { q: "How do I list my property for rent in Mohali?", a: "Download the RentalPins app, create your listing in under 5 minutes, and it goes live on the map. Check the app for the current free listing offer in Mohali." },
        ],
        ctaHeading: "Have something to rent in Mohali?",
        ctaBody: "List your property, vehicle, or office space in minutes. Reach thousands of renters across Mohali, IT Park, Aerocity, Phase 7–11 and beyond. Free to list.",
      },
      {
        slug: "kharar",
        name: "Kharar",
        tagline: "Kharar Town · Kharar-Landran Road · Sunny Enclave · Gillco Valley",
        badge: "NOW LIVE — KHARAR",
        primaryFocus: "Student Housing & Budget Rentals",
        heroDescription: "Kharar is one of the most affordable areas near Chandigarh — popular with students of Chandigarh University and young professionals. Find PG, rooms, flats and more on rent across Kharar town and surrounding areas.",
        coordinates: { lat: 30.7464, lng: 76.6466 },
        popularAreas: ["Kharar Town", "Kharar-Landran Road", "Sunny Enclave", "Gillco Valley", "Sector 125", "Sector 126", "Sector 127"],
        topCategories: [
          { name: "Property", color: "#7B1FA2", icon: "🏠", desc: "Budget-friendly rooms, PG, flats and independent portions near Chandigarh University and Kharar town." },
          { name: "Vehicles", color: "#1976D2", icon: "🚗", desc: "Bikes and scooters on rent — essential for students commuting between Kharar and Mohali/Chandigarh." },
          { name: "Furniture", color: "#5D4037", icon: "🛋️", desc: "Beds, desks, wardrobes and complete room furniture packages on rent for students and working professionals." },
        ],
        popularSearches: [
          "Room for rent in Kharar", "PG in Kharar", "Flat for rent in Kharar",
          "PG near Chandigarh University", "1 BHK in Kharar", "Furnished room Kharar",
          "Student PG Kharar", "Hostel in Kharar", "Bike for rent Kharar",
          "Rentals in Kharar", "House for rent Sunny Enclave", "Apartment Gillco Valley",
        ],
        faqs: [
          { q: "Is PG available near Chandigarh University in Kharar?", a: "Yes — RentalPins has multiple PG, hostel, and room listings near Chandigarh University, Kharar-Landran Road, and surrounding areas. Browse on the live map to find the closest options." },
          { q: "What is the average rent for a room in Kharar?", a: "Room rents in Kharar typically range from ₹3,000 to ₹8,000/month depending on furnishing, location, and proximity to Chandigarh University or the highway." },
          { q: "Are there furnished flats available in Kharar?", a: "Yes — you can find furnished and semi-furnished 1 BHK and 2 BHK flats in Kharar, Sunny Enclave, and Gillco Valley on RentalPins." },
        ],
        ctaHeading: "Have something to rent in Kharar?",
        ctaBody: "List your PG, room, flat, or vehicle in minutes. Reach students and professionals across Kharar and surrounding areas. Free to list.",
      },
      {
        slug: "panchkula",
        name: "Panchkula",
        tagline: "Sector 1–27 · Pinjore · Kalka · Barwala",
        badge: "NOW LIVE — PANCHKULA",
        primaryFocus: "Family Housing & Government Sector",
        heroDescription: "Panchkula is a planned city adjoining Chandigarh — known for its green sectors, government offices, and family-friendly neighbourhoods. Browse flats, houses, PG and more on rent across Panchkula sectors and surrounding towns.",
        coordinates: { lat: 30.6942, lng: 76.8606 },
        popularAreas: ["Sector 4", "Sector 7", "Sector 9", "Sector 11", "Sector 12", "Sector 15", "Sector 20", "Pinjore", "Kalka", "MDC"],
        topCategories: [
          { name: "Property", color: "#7B1FA2", icon: "🏠", desc: "Family homes, flats, independent floors and PG across Panchkula sectors 1–27 and MDC." },
          { name: "Vehicles", color: "#1976D2", icon: "🚗", desc: "Cars and bikes on rent for commuting between Panchkula, Chandigarh, and Mohali." },
          { name: "Furniture", color: "#5D4037", icon: "🛋️", desc: "Home furniture, office desks, and complete room setups available for rent in Panchkula." },
        ],
        popularSearches: [
          "Room for rent in Panchkula", "Flat for rent in Panchkula", "PG in Panchkula",
          "House for rent Panchkula Sector 11", "2 BHK Panchkula", "Independent floor Panchkula",
          "Rentals in Panchkula", "Office space Panchkula", "PG near Panchkula Sector 12",
        ],
        faqs: [
          { q: "What are the best sectors for renting in Panchkula?", a: "Sectors 4, 7, 9, 11, and 20 are the most popular for family housing. MDC (Mansa Devi Complex) is good for commercial rentals." },
          { q: "Are there PG options in Panchkula?", a: "Yes — PG and hostel options are available in multiple Panchkula sectors on RentalPins, especially near the IT and government office areas." },
        ],
        ctaHeading: "Have something to rent in Panchkula?",
        ctaBody: "List your property or vehicle in minutes. Reach renters across Panchkula sectors, Pinjore, Kalka and beyond. Free to list.",
      },
      {
        slug: "zirakpur",
        name: "Zirakpur",
        tagline: "VIP Road · Patiala Road · Dhakoli · Baltana · Peer Muchalla",
        badge: "NOW LIVE — ZIRAKPUR",
        primaryFocus: "Affordable Apartments & Young Professionals",
        heroDescription: "Zirakpur sits on the Chandigarh-Ambala highway and has become one of the most popular residential areas for young professionals and families looking for affordable housing near Chandigarh.",
        coordinates: { lat: 30.6432, lng: 76.8181 },
        popularAreas: ["VIP Road", "Patiala Road", "Dhakoli", "Baltana", "Peer Muchalla", "Gazipur", "Lohgarh", "Maya Garden City"],
        topCategories: [
          { name: "Property", color: "#7B1FA2", icon: "🏠", desc: "Affordable apartments, builder floors, and PG near the highway and residential colonies." },
          { name: "Vehicles", color: "#1976D2", icon: "🚗", desc: "Cars, bikes, and commercial vehicles on rent — Zirakpur is well-connected via NH-22." },
          { name: "Electronics & Gadgets", color: "#FF8F00", icon: "💻", desc: "Laptops, projectors, and electronics for short-term needs." },
        ],
        popularSearches: [
          "Room for rent in Zirakpur", "Flat for rent in Zirakpur", "PG in Zirakpur",
          "2 BHK Zirakpur", "Furnished flat Zirakpur VIP Road", "Apartment Dhakoli",
          "Rentals in Zirakpur", "House for rent Peer Muchalla", "1 BHK Zirakpur",
        ],
        faqs: [
          { q: "Why is Zirakpur popular for rentals?", a: "Zirakpur offers significantly lower rents than Chandigarh while being just 15–20 minutes away via the highway. It has modern apartment complexes, malls, and good connectivity." },
          { q: "What are the best areas for renting in Zirakpur?", a: "VIP Road and Patiala Road are the most popular for apartment rentals. Dhakoli and Peer Muchalla offer more affordable options." },
        ],
        ctaHeading: "Have something to rent in Zirakpur?",
        ctaBody: "List your flat, PG, or vehicle in minutes. Reach renters across Zirakpur, Dhakoli, Baltana and beyond. Free to list.",
      },
      {
        slug: "landran",
        name: "Landran",
        tagline: "Landran Town · Kharar-Landran Road · Sohana · Banur",
        badge: "NOW LIVE — LANDRAN",
        primaryFocus: "Student Rentals & Industrial Area",
        heroDescription: "Landran is a key area between Mohali and Kharar, home to several colleges and a growing industrial belt. Find affordable PG, rooms, and industrial space for rent in Landran and surrounding areas.",
        coordinates: { lat: 30.7110, lng: 76.6650 },
        popularAreas: ["Landran Town", "Kharar-Landran Road", "Sohana", "Banur", "Sector 112", "Sector 115"],
        topCategories: [
          { name: "Property", color: "#7B1FA2", icon: "🏠", desc: "Student PG, budget rooms, and independent portions near colleges and the industrial area." },
          { name: "Heavy Machinery", color: "#D81B60", icon: "🏗️", desc: "JCBs, cranes, and industrial equipment available for rent in the Landran industrial belt." },
          { name: "Vehicles", color: "#1976D2", icon: "🚗", desc: "Bikes and scooters for daily commute between Landran, Mohali, and Chandigarh." },
        ],
        popularSearches: [
          "Room for rent in Landran", "PG in Landran", "PG near Landran colleges",
          "Flat for rent Landran", "Industrial space Landran", "Rentals in Landran",
          "JCB for rent Landran", "Warehouse Landran", "Student PG Landran",
        ],
        faqs: [
          { q: "Are there PG options near colleges in Landran?", a: "Yes — multiple PG and hostel options are available near CGC Landran, IKGPTU, and other colleges on the Kharar-Landran Road." },
          { q: "Is industrial equipment available for rent in Landran?", a: "Yes — RentalPins lists JCBs, cranes, scaffolding, and other industrial equipment in the Landran area." },
        ],
        ctaHeading: "Have something to rent in Landran?",
        ctaBody: "List your PG, industrial equipment, or vehicle in minutes. Reach students and businesses across Landran. Free to list.",
      },
    ],
  },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // LUDHIANA
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  {
    countrySlug: "in",
    slug: "ludhiana",
    name: "Ludhiana",
    country: "India",
    tagline: "Civil Lines · Model Town · Sarabha Nagar · BRS Nagar · Focal Point · Dugri",
    badge: "NOW LIVE — LUDHIANA DISTRICT",
    heroDescription:
      "Browse property, vehicles, electronics, industrial equipment and more on rent across Ludhiana, Khanna, Samrala, Doraha, Jagraon, Raikot and Sudhar — all on one live map.",
    coordinates: { lat: 30.9010, lng: 75.8573 },
    popularAreas: [
      "Civil Lines", "Model Town", "Sarabha Nagar", "BRS Nagar",
      "Pakhowal Road", "Ferozepur Road", "GT Road", "Sherpur",
      "Khanna", "Samrala", "Doraha", "Jagraon",
      "Raikot", "Sudhar", "Focal Point", "Dugri",
    ],
    topCategories: [
      { name: "Property", color: "#7B1FA2", icon: "🏠", desc: "Rooms, flats, PG, independent houses, shops and office spaces across Ludhiana city and district." },
      { name: "Vehicles", color: "#1976D2", icon: "🚗", desc: "Cars, bikes, trucks and commercial vehicles on rent across Ludhiana and nearby towns." },
      { name: "Heavy Machinery", color: "#D81B60", icon: "🏗️", desc: "JCBs, cranes, forklifts and industrial equipment — Ludhiana's industrial hub makes this a key category." },
    ],
    popularSearches: [
      "Room for rent in Ludhiana", "Apartments / Flats for rent in Ludhiana",
      "House for rent in Ludhiana", "PG/Hostels for rent in Ludhiana",
      "Shops for rent in Ludhiana", "Office Space for rent in Ludhiana",
      "Industrial for rent in Ludhiana", "Warehouse for rent in Ludhiana",
      "Room for rent in Khanna", "Apartments / Flats for rent in Khanna",
      "Room for rent in Samrala", "Room for rent in Jagraon",
      "Rentals in Ludhiana", "Rentals in Khanna",
      "Rentals in Samrala", "Rentals in Doraha",
      "Rentals in Model Town", "Rentals in Focal Point",
      "Rentals in Dugri", "Rentals in Pakhowal Road",
    ],
    faqs: [
      { q: "How do I find a room for rent in Ludhiana without a broker?", a: "Open RentalPins and browse the live map of Ludhiana. All listings are posted directly by owners — no broker fees. Filter by rooms, PG, flats or any category to find what you need." },
      { q: "Is it free to list a rental in Ludhiana?", a: "Yes! RentalPins offers free listings in Ludhiana. Download the app to post your property, vehicle, or industrial equipment in minutes." },
      { q: "What areas does RentalPins cover in Ludhiana?", a: "RentalPins covers all of Ludhiana city including Civil Lines, Model Town, Sarabha Nagar, BRS Nagar, Pakhowal Road, Ferozepur Road, Focal Point, Dugri, plus nearby towns like Khanna, Samrala, Doraha, Jagraon, Raikot, and Sudhar." },
      { q: "Can I rent industrial equipment in Ludhiana?", a: "Yes — Ludhiana is a major industrial city and RentalPins lists JCBs, cranes, scaffolding, forklifts and other heavy machinery for rent, especially around Focal Point and the industrial areas." },
      { q: "What types of rentals are available in Ludhiana?", a: "RentalPins has 9 categories: Property, Vehicles, Electronics, Home Appliances, Furniture, Heavy Machinery, Construction Equipment, Event & Production gear, and more." },
    ],
    ctaHeading: "Have something to rent in Ludhiana?",
    ctaBody: "List your property, vehicle or equipment in minutes. Reach thousands of renters across Ludhiana, Khanna, Samrala, Doraha, Jagraon, Raikot and Sudhar. Free to list.",
    status: "live",
    areas: [
      {
        slug: "sarabha-nagar",
        name: "Sarabha Nagar",
        tagline: "Sarabha Nagar · Rajguru Nagar · Kitchlu Nagar",
        badge: "NOW LIVE — SARABHA NAGAR",
        primaryFocus: "Premium Housing",
        heroDescription: "Sarabha Nagar is one of Ludhiana's most premium residential areas. Find flats, independent houses, and commercial spaces for rent in Sarabha Nagar and surrounding localities.",
        coordinates: { lat: 30.8895, lng: 75.8340 },
        popularAreas: ["Sarabha Nagar", "Rajguru Nagar", "Kitchlu Nagar", "Gurdev Nagar"],
        topCategories: [
          { name: "Property", color: "#7B1FA2", icon: "🏠", desc: "Premium flats, independent houses, and kothi portions in Ludhiana's most sought-after colony." },
          { name: "Vehicles", color: "#1976D2", icon: "🚗", desc: "Cars for rent — Sarabha Nagar is centrally located with easy access to all parts of Ludhiana." },
          { name: "Furniture", color: "#5D4037", icon: "🛋️", desc: "Premium furniture on rent for your Sarabha Nagar home or office." },
        ],
        popularSearches: [
          "Room for rent in Sarabha Nagar", "Flat for rent Sarabha Nagar",
          "House for rent Sarabha Nagar", "3 BHK Sarabha Nagar", "PG Sarabha Nagar",
          "Rentals in Sarabha Nagar", "Independent house Sarabha Nagar",
        ],
        faqs: [
          { q: "What is the average rent in Sarabha Nagar?", a: "Sarabha Nagar is a premium area. 2 BHK flats typically range from ₹12,000–20,000/month. Independent houses and kothis can be ₹25,000+ depending on size and furnishing." },
          { q: "Is Sarabha Nagar good for families?", a: "Yes — Sarabha Nagar is one of Ludhiana's safest and greenest colonies with parks, schools, hospitals and markets all within walking distance." },
        ],
        ctaHeading: "Have something to rent in Sarabha Nagar?",
        ctaBody: "List your property or vehicle in minutes. Reach renters looking for premium housing in Sarabha Nagar. Free to list.",
      },
      {
        slug: "model-town",
        name: "Model Town",
        tagline: "Model Town · Model Town Extension · Model Gram",
        badge: "NOW LIVE — MODEL TOWN",
        primaryFocus: "Central Location & Commercial",
        heroDescription: "Model Town is Ludhiana's central commercial and residential hub. Find shops, offices, flats and rooms for rent in Model Town and surrounding areas.",
        coordinates: { lat: 30.9085, lng: 75.8595 },
        popularAreas: ["Model Town", "Model Town Extension", "Model Gram", "Aggar Nagar"],
        topCategories: [
          { name: "Property", color: "#7B1FA2", icon: "🏠", desc: "Shops, offices, flats and rooms in Ludhiana's prime commercial area." },
          { name: "Vehicles", color: "#1976D2", icon: "🚗", desc: "Cars and bikes on rent in central Ludhiana." },
          { name: "Electronics & Gadgets", color: "#FF8F00", icon: "💻", desc: "Laptops, projectors and event equipment near Ludhiana's commercial centre." },
        ],
        popularSearches: [
          "Shop for rent in Model Town Ludhiana", "Office space Model Town",
          "Room for rent Model Town", "Flat for rent Model Town Extension",
          "Rentals in Model Town", "Commercial space Model Town Ludhiana",
        ],
        faqs: [
          { q: "Is Model Town good for commercial rentals?", a: "Yes — Model Town is Ludhiana's prime commercial area with showrooms, offices, and retail spaces available on RentalPins." },
        ],
        ctaHeading: "Have something to rent in Model Town?",
        ctaBody: "List your shop, office or property in minutes. Model Town gets high footfall and visibility. Free to list.",
      },
      {
        slug: "pakhowal-road",
        name: "Pakhowal Road",
        tagline: "Pakhowal Road · Dugri · Urban Estate",
        badge: "NOW LIVE — PAKHOWAL ROAD",
        primaryFocus: "Residential & Commercial Mix",
        heroDescription: "Pakhowal Road is one of Ludhiana's longest and most developed arterial roads. Find flats, rooms, shops and commercial spaces for rent along Pakhowal Road and Dugri.",
        coordinates: { lat: 30.8788, lng: 75.8415 },
        popularAreas: ["Pakhowal Road", "Dugri", "Urban Estate Phase 1", "Urban Estate Phase 2", "Sector 32"],
        topCategories: [
          { name: "Property", color: "#7B1FA2", icon: "🏠", desc: "Flats, builder floors, PG and commercial spaces along Ludhiana's prime Pakhowal Road corridor." },
          { name: "Vehicles", color: "#1976D2", icon: "🚗", desc: "Cars and bikes on rent along the Pakhowal Road stretch." },
          { name: "Furniture", color: "#5D4037", icon: "🛋️", desc: "Home and office furniture for rent in Dugri and Urban Estate areas." },
        ],
        popularSearches: [
          "Flat for rent Pakhowal Road", "Room for rent Dugri", "2 BHK Pakhowal Road",
          "PG near Pakhowal Road", "Rentals in Dugri", "Shop for rent Pakhowal Road",
        ],
        faqs: [
          { q: "What is available for rent on Pakhowal Road?", a: "Pakhowal Road has a mix of residential and commercial rentals — apartments, builder floors, PG, shops, and office spaces. Browse on RentalPins to find the latest listings." },
        ],
        ctaHeading: "Have something to rent on Pakhowal Road?",
        ctaBody: "List your property along Ludhiana's prime road corridor. Reach thousands of renters in Dugri and Urban Estate. Free to list.",
      },
      {
        slug: "brs-nagar",
        name: "BRS Nagar",
        tagline: "BRS Nagar · Bhai Randhir Singh Nagar",
        badge: "NOW LIVE — BRS NAGAR",
        primaryFocus: "Residential Colony",
        heroDescription: "BRS Nagar (Bhai Randhir Singh Nagar) is a well-planned residential colony in Ludhiana. Find rooms, flats and houses for rent in BRS Nagar.",
        coordinates: { lat: 30.8820, lng: 75.8230 },
        popularAreas: ["BRS Nagar", "Block A", "Block B", "Block C", "Block D", "Main Market BRS Nagar"],
        topCategories: [
          { name: "Property", color: "#7B1FA2", icon: "🏠", desc: "Rooms, flats and independent floors in BRS Nagar colony blocks." },
          { name: "Vehicles", color: "#1976D2", icon: "🚗", desc: "Bikes and cars for daily commute from BRS Nagar." },
          { name: "Home Appliances", color: "#00695C", icon: "🍳", desc: "ACs, refrigerators and washing machines on rent in BRS Nagar." },
        ],
        popularSearches: [
          "Room for rent BRS Nagar", "Flat for rent BRS Nagar Ludhiana",
          "PG in BRS Nagar", "Rentals in BRS Nagar", "House for rent BRS Nagar",
        ],
        faqs: [
          { q: "Is BRS Nagar a good area to rent in Ludhiana?", a: "Yes — BRS Nagar is a well-maintained, centrally located colony with markets, parks, and good connectivity to Ferozepur Road and Pakhowal Road." },
        ],
        ctaHeading: "Have something to rent in BRS Nagar?",
        ctaBody: "List your property in BRS Nagar. Reach renters looking in one of Ludhiana's most popular colonies. Free to list.",
      },
      {
        slug: "focal-point",
        name: "Focal Point",
        tagline: "Focal Point · Industrial Area · GT Road",
        badge: "NOW LIVE — FOCAL POINT",
        primaryFocus: "Industrial & Commercial Rentals",
        heroDescription: "Focal Point is Ludhiana's primary industrial and commercial zone. Find warehouses, industrial spaces, shops and commercial units for rent in Focal Point.",
        coordinates: { lat: 30.8950, lng: 75.9010 },
        popularAreas: ["Focal Point Phase 1", "Focal Point Phase 2", "GT Road", "Tajpur Road", "Gill Road"],
        topCategories: [
          { name: "Heavy Machinery", color: "#D81B60", icon: "🏗️", desc: "JCBs, forklifts, cranes and industrial equipment in Ludhiana's manufacturing hub." },
          { name: "Property", color: "#7B1FA2", icon: "🏠", desc: "Warehouses, godowns, factory spaces and commercial units in Focal Point industrial area." },
          { name: "Construction Equipment", color: "#2E7D32", icon: "🔧", desc: "Scaffolding, concrete mixers and construction tools for Ludhiana's building projects." },
        ],
        popularSearches: [
          "Warehouse for rent Focal Point", "Industrial space Focal Point Ludhiana",
          "Factory for rent Ludhiana", "JCB for rent Focal Point", "Godown for rent Ludhiana",
          "Shop for rent GT Road Ludhiana", "Rentals in Focal Point",
        ],
        faqs: [
          { q: "Can I rent industrial equipment in Focal Point?", a: "Yes — Focal Point is Ludhiana's industrial hub. RentalPins lists JCBs, forklifts, cranes, scaffolding and other heavy machinery for rent in the area." },
          { q: "Are warehouses available for rent in Focal Point?", a: "Yes — multiple warehouse and godown spaces are listed on RentalPins in Focal Point Phase 1 and Phase 2." },
        ],
        ctaHeading: "Have industrial space or equipment to rent in Focal Point?",
        ctaBody: "List your warehouse, factory space, or heavy machinery. Reach Ludhiana's industrial community. Free to list.",
      },
    ],
  },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // NCR DELHI (Coming Soon)
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  {
    countrySlug: "in",
    slug: "delhi",
    name: "Delhi",
    country: "India",
    tagline: "Mukherjee Nagar · GTB Nagar · Hudson Lane · Dwarka · Rohini · Jasola · Sarita Vihar",
    badge: "NOW LIVE — DELHI",
    heroDescription:
      "Browse PG, rooms, flats, vehicles and more on rent across Delhi — including student hubs, family neighbourhoods and office-linked rental corridors — all on one live map.",
    coordinates: { lat: 28.6139, lng: 77.2090 },
    popularAreas: [
      "Mukherjee Nagar", "GTB Nagar", "Hudson Lane", "Dwarka",
      "Rohini", "Jasola", "Sarita Vihar", "North Campus",
      "Kamla Nagar", "NSP", "South East Delhi", "West Delhi"
    ],
    topCategories: [
      { name: "Property", color: "#7B1FA2", icon: "🏠", desc: "Rooms, PG, apartments, builder floors, houses and shops across Delhi." },
      { name: "Vehicles", color: "#1976D2", icon: "🚗", desc: "Cars, bikes and scooters on rent across key Delhi neighbourhoods." },
      { name: "Office Space", color: "#FF8F00", icon: "💼", desc: "Office, retail and co-working options in professional and mixed-use corridors." },
    ],
    popularSearches: [
      "PG in Mukherjee Nagar", "Room for rent in GTB Nagar",
      "PG in Hudson Lane", "Flat for rent in Dwarka",
      "Apartment for rent in Rohini", "Flats in Jasola",
      "Rental homes in Sarita Vihar", "Delhi rentals without broker",
      "PG near North Campus", "Family rental homes in Delhi"
    ],
    faqs: [
      { q: "Which are the best rental areas in Delhi?", a: "Popular Delhi rental areas include Mukherjee Nagar, GTB Nagar, Hudson Lane, Dwarka, Rohini, Jasola and Sarita Vihar." },
      { q: "Can I find PG and room rentals in Delhi on RentalPins?", a: "Yes. RentalPins helps users discover PG, rooms, flats and more across Delhi on the live map and contact owners directly." },
      { q: "Is it free to list rentals in Delhi on RentalPins?", a: "You can check the current listing offer inside the RentalPins app. Availability of free or paid plans may vary by area and time." },
    ],
    ctaHeading: "Have something to rent in Delhi?",
    ctaBody: "List your property, PG, room, vehicle or office space on RentalPins and reach renters across Delhi faster.",
    status: "live",
    areas: [
      {
        slug: "mukherjee-nagar",
        name: "Mukherjee Nagar",
        tagline: "UPSC · PG · Rooms · Student Rentals",
        badge: "NOW LIVE — MUKHERJEE NAGAR",
        primaryFocus: "PG, rooms and student rentals",
        heroDescription: "Discover PG, rooms, flats and rentals in Mukherjee Nagar — one of Delhi's strongest student and UPSC coaching markets.",
        coordinates: { lat: 28.7007, lng: 77.2059 },
        popularAreas: ["Batra Cinema", "Nehru Vihar", "Vijay Nagar", "North Campus"],
        topCategories: [
          { name: "Property", color: "#7B1FA2", icon: "🏠", desc: "PG, rooms, shared flats and student-focused rentals in Mukherjee Nagar." },
          { name: "Furniture", color: "#5D4037", icon: "🛋️", desc: "Beds, desks and room furniture packages for students and working renters." },
          { name: "Vehicles", color: "#1976D2", icon: "🚗", desc: "Bikes and scooters for commuting around North Delhi." },
        ],
        popularSearches: [
          "PG in Mukherjee Nagar", "Room for rent in Mukherjee Nagar",
          "Student room Mukherjee Nagar", "Shared flat Mukherjee Nagar"
        ],
        faqs: [
          { q: "Is Mukherjee Nagar good for PG rentals?", a: "Yes. Mukherjee Nagar is one of Delhi's most active PG and student rental areas because of coaching demand and proximity to North Campus." },
        ],
        ctaHeading: "Have something to rent in Mukherjee Nagar?",
        ctaBody: "List your PG, room or flat and reach students and UPSC aspirants across Mukherjee Nagar.",
      },
      {
        slug: "gtb-nagar",
        name: "GTB Nagar",
        tagline: "North Campus · PG · Rooms · Flats",
        badge: "NOW LIVE — GTB NAGAR",
        primaryFocus: "PG, flats and rooms",
        heroDescription: "Browse PG, rooms and flats in GTB Nagar near Delhi University North Campus.",
        coordinates: { lat: 28.6982, lng: 77.2058 },
        popularAreas: ["North Campus", "Kamla Nagar", "Hudson Lane"],
        topCategories: [
          { name: "Property", color: "#7B1FA2", icon: "🏠", desc: "PG, rooms and apartments near GTB Nagar metro and North Campus." },
          { name: "Vehicles", color: "#1976D2", icon: "🚗", desc: "Daily commute options for students and working renters." },
          { name: "Furniture", color: "#5D4037", icon: "🛋️", desc: "Rental furniture for rooms, PG and small flats." },
        ],
        popularSearches: [
          "PG in GTB Nagar", "Room for rent in GTB Nagar",
          "Flat in GTB Nagar", "North Campus rentals"
        ],
        faqs: [
          { q: "Is GTB Nagar good for students?", a: "Yes. GTB Nagar is a major student rental area due to its metro access and closeness to North Campus." },
        ],
        ctaHeading: "Have something to rent in GTB Nagar?",
        ctaBody: "List your PG, room or flat and connect with renters in GTB Nagar.",
      },
      {
        slug: "hudson-lane",
        name: "Hudson Lane",
        tagline: "Student Hotspot · Shared Flats · PG",
        badge: "NOW LIVE — HUDSON LANE",
        primaryFocus: "PG, shared flats and rooms",
        heroDescription: "Find PG, shared flats and room rentals in Hudson Lane near North Campus.",
        coordinates: { lat: 28.6964, lng: 77.2050 },
        popularAreas: ["GTB Nagar", "Kamla Nagar", "North Campus"],
        topCategories: [
          { name: "Property", color: "#7B1FA2", icon: "🏠", desc: "PG, shared flats and student rentals in Hudson Lane." },
          { name: "Furniture", color: "#5D4037", icon: "🛋️", desc: "Beds, study tables and room essentials on rent." },
          { name: "Vehicles", color: "#1976D2", icon: "🚗", desc: "Scooters and bikes for short-distance mobility." },
        ],
        popularSearches: [
          "PG in Hudson Lane", "Room in Hudson Lane",
          "Shared flat Hudson Lane", "Student rentals Hudson Lane"
        ],
        faqs: [
          { q: "What kind of rentals are popular in Hudson Lane?", a: "Hudson Lane is best known for PG, shared flats and student rooms because of demand from Delhi University students." },
        ],
        ctaHeading: "Have something to rent in Hudson Lane?",
        ctaBody: "List your PG, room or flat and reach student renters searching Hudson Lane.",
      },
      {
        slug: "dwarka",
        name: "Dwarka",
        tagline: "Family Homes · Apartments · Builder Floors",
        badge: "NOW LIVE — DWARKA",
        primaryFocus: "Apartments and family homes",
        heroDescription: "Explore flats, builder floors and family rentals in Dwarka — one of West Delhi's strongest rental markets.",
        coordinates: { lat: 28.5921, lng: 77.0460 },
        popularAreas: ["Sector 6", "Sector 10", "Sector 12", "Sector 14", "Sector 21"],
        topCategories: [
          { name: "Property", color: "#7B1FA2", icon: "🏠", desc: "Apartments, builder floors and family homes across Dwarka sectors." },
          { name: "Vehicles", color: "#1976D2", icon: "🚗", desc: "Cars and bikes for daily commuting in West Delhi." },
          { name: "Furniture", color: "#5D4037", icon: "🛋️", desc: "Home furniture and appliances for family moves." },
        ],
        popularSearches: [
          "Flat for rent in Dwarka", "Dwarka rental homes",
          "2 BHK in Dwarka", "Builder floor Dwarka"
        ],
        faqs: [
          { q: "Is Dwarka good for family rentals?", a: "Yes. Dwarka is a planned West Delhi sub-city with strong family demand, metro access and a large apartment stock." },
        ],
        ctaHeading: "Have something to rent in Dwarka?",
        ctaBody: "List your apartment, floor or home in Dwarka and reach family renters faster.",
      },
      {
        slug: "rohini",
        name: "Rohini",
        tagline: "Affordable Homes · Apartments · Rooms",
        badge: "NOW LIVE — ROHINI",
        primaryFocus: "Family and working rentals",
        heroDescription: "Browse affordable apartments, builder floors and rentals across Rohini.",
        coordinates: { lat: 28.7494, lng: 77.0562 },
        popularAreas: ["Sector 3", "Sector 7", "Sector 9", "Sector 13", "Sector 24"],
        topCategories: [
          { name: "Property", color: "#7B1FA2", icon: "🏠", desc: "Apartments, rooms and homes in Rohini's residential sectors." },
          { name: "Vehicles", color: "#1976D2", icon: "🚗", desc: "Cars and bikes for renters and daily commuters." },
          { name: "Home Appliances", color: "#00695C", icon: "🍳", desc: "Appliances for home setup and relocations." },
        ],
        popularSearches: [
          "Flat for rent in Rohini", "Apartment in Rohini",
          "Room for rent in Rohini", "Affordable rentals Rohini"
        ],
        faqs: [
          { q: "Is Rohini a good area for affordable rentals?", a: "Yes. Rohini is one of Delhi's large residential zones with relatively affordable rental options and broad housing stock." },
        ],
        ctaHeading: "Have something to rent in Rohini?",
        ctaBody: "List your room, flat or home in Rohini and reach renters looking for affordable options.",
      },
      {
        slug: "jasola",
        name: "Jasola",
        tagline: "Professional Rentals · Apartments · Metro Access",
        badge: "NOW LIVE — JASOLA",
        primaryFocus: "Flats and professional rentals",
        heroDescription: "Find rentals in Jasola with strong access to offices, hospitals and metro routes.",
        coordinates: { lat: 28.5450, lng: 77.2910 },
        popularAreas: ["Jasola Vihar", "Apollo", "Okhla", "Noida Link"],
        topCategories: [
          { name: "Property", color: "#7B1FA2", icon: "🏠", desc: "Flats, apartments and rooms for professionals and families in Jasola." },
          { name: "Office Space", color: "#FF8F00", icon: "💼", desc: "Commercial and office rental options in mixed-use corridors." },
          { name: "Vehicles", color: "#1976D2", icon: "🚗", desc: "Transport options for daily commuting around South East Delhi." },
        ],
        popularSearches: [
          "Flat for rent in Jasola", "Apartments Jasola",
          "Rental flats Jasola", "Jasola rooms for rent"
        ],
        faqs: [
          { q: "Is Jasola good for professionals?", a: "Yes. Jasola is well positioned for professional and mixed household rentals due to metro access and connectivity to offices and hospitals." },
        ],
        ctaHeading: "Have something to rent in Jasola?",
        ctaBody: "List your flat, room or office space in Jasola and connect with renters faster.",
      },
      {
        slug: "sarita-vihar",
        name: "Sarita Vihar",
        tagline: "Family Housing · Apartments · South East Delhi",
        badge: "NOW LIVE — SARITA VIHAR",
        primaryFocus: "Apartments and family rentals",
        heroDescription: "Explore rentals in Sarita Vihar with strong connectivity to Jasola and Noida.",
        coordinates: { lat: 28.5315, lng: 77.2913 },
        popularAreas: ["Pocket A", "Pocket B", "Pocket C", "Jasola"],
        topCategories: [
          { name: "Property", color: "#7B1FA2", icon: "🏠", desc: "Family apartments, homes and flats in Sarita Vihar." },
          { name: "Vehicles", color: "#1976D2", icon: "🚗", desc: "Cars and bikes for daily commute and local mobility." },
          { name: "Furniture", color: "#5D4037", icon: "🛋️", desc: "Furniture options for home setup and relocation." },
        ],
        popularSearches: [
          "Flat for rent in Sarita Vihar", "Apartment Sarita Vihar",
          "Family home Sarita Vihar", "Rental homes Sarita Vihar"
        ],
        faqs: [
          { q: "Is Sarita Vihar suitable for families?", a: "Yes. Sarita Vihar is known for stable family housing demand and access to Jasola, South East Delhi and Noida corridors." },
        ],
        ctaHeading: "Have something to rent in Sarita Vihar?",
        ctaBody: "List your flat or home in Sarita Vihar and reach family renters across the area.",
      }
    ],
  },

  ...JAIPUR_LUCKNOW_MUMBAI_CITIES,

  {
    countrySlug: "in",
    slug: "ncr",
    name: "NCR Delhi",
    country: "India",
    tagline: "Delhi · Noida · Gurugram · Ghaziabad · Faridabad",
    badge: "COMING SOON — NCR DELHI",
    heroDescription:
      "India's capital region is coming soon to RentalPins. Find rooms, flats, PG, vehicles and more across Delhi, Noida, Gurugram and Ghaziabad.",
    coordinates: { lat: 28.6139, lng: 77.2090 },
    popularAreas: ["South Delhi", "North Delhi", "Noida", "Greater Noida", "Gurugram", "Ghaziabad", "Faridabad", "Dwarka"],
    topCategories: [
      { name: "Property", color: "#7B1FA2", icon: "🏠", desc: "Coming soon — rooms, flats, PG and houses across NCR." },
      { name: "Vehicles", color: "#1976D2", icon: "🚗", desc: "Coming soon — cars and bikes on rent in Delhi NCR." },
      { name: "Office Space", color: "#FF8F00", icon: "💼", desc: "Coming soon — co-working and office spaces in Noida and Gurugram." },
    ],
    popularSearches: [
      "Room for rent in Delhi", "PG in Noida", "Flat for rent Gurugram",
      "Rentals in NCR", "Office space Noida", "PG near metro Delhi",
    ],
    faqs: [
      { q: "When is RentalPins launching in Delhi NCR?", a: "RentalPins is launching in Delhi NCR soon. Join the waitlist by downloading the app to be notified when we go live." },
    ],
    ctaHeading: "Want RentalPins in NCR Delhi?",
    ctaBody: "We're launching soon in Delhi, Noida, Gurugram and more. Download the app to get notified when we go live in your area.",
    status: "coming-soon",
    areas: [],
  },
  ...INTERNATIONAL_CITIES,
];

// ─── Helper Functions ─────────────────────────────────────────────────────────

/** Two-arg: city by country + slug. One-arg: legacy lookup by city slug only (unique across CITIES). */
export function getCityBySlug(
  countryOrCitySlug: string,
  citySlug?: string
): CityConfig | undefined {
  if (citySlug !== undefined) {
    return CITIES.find(
      (c) => c.countrySlug === countryOrCitySlug && c.slug === citySlug
    );
  }
  return CITIES.find((c) => c.slug === countryOrCitySlug);
}

/** Area by country, city, and area slug. */
export function getAreaBySlug(
  countrySlug: string,
  citySlug: string,
  areaSlug: string
): { city: CityConfig; area: AreaConfig } | undefined {
  const city = getCityBySlug(countrySlug, citySlug);
  if (!city) return undefined;
  const area = city.areas.find((a) => a.slug === areaSlug);
  if (!area) return undefined;
  return { city, area };
}

/** Get all cities (for navbar, sitemap, etc.) */
export function getAllCities(): CityConfig[] {
  return CITIES;
}

/** All area pages across all cities (for sitemap) */
export function getAllAreas(): (AreaConfig & {
  parentSlug: string;
  parentName: string;
  parentCountrySlug: string;
})[] {
  return CITIES.flatMap((city) =>
    city.areas.map((area) => ({
      ...area,
      parentSlug: city.slug,
      parentName: city.name,
      parentCountrySlug: city.countrySlug,
    }))
  );
}

/** Sibling areas for cross-linking (excludes current area) */
export function getSiblingAreas(
  countrySlug: string,
  citySlug: string,
  currentAreaSlug: string
): { label: string; href: string }[] {
  const city = getCityBySlug(countrySlug, citySlug);
  if (!city) return [];
  return city.areas
    .filter((a) => a.slug !== currentAreaSlug)
    .map((a) => ({
      label: a.name,
      href: rentalAreaPath(countrySlug, city.slug, a.slug),
    }));
}

/** Other cities for cross-linking */
export function getOtherCities(
  currentCountrySlug: string,
  currentCitySlug: string
): { label: string; href: string; status: string }[] {
  return CITIES.filter(
    (c) => !(c.countrySlug === currentCountrySlug && c.slug === currentCitySlug)
  ).map((c) => ({
    label: c.name,
    href: rentalCityPath(c.countrySlug, c.slug),
    status: c.status,
  }));
}

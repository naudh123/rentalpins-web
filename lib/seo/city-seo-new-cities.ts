// Long-form city guides (money-page content) for the cities added in Nov 2026.
// Rent rows are the middle half (25th–75th percentile) of asking rents on live RentalPins
// listings within 25 km of each city centre, 8 Nov 2026, shown only where 5+ listings exist.
import { rentalAreaPath } from "@/lib/cities-config";
import type { CitySEOConfig } from "@/lib/seo/city-seo-config";

const RENT_NOTE = "Asking rents on RentalPins, Nov 2026 (middle half of live listings).";

function noBrokerFaq(city: string) {
  return {
    q: `How do I rent a flat in ${city} without a broker?`,
    a: `Open the RentalPins ${city} map, filter by flat, PG or room and your budget, then message owners directly from the listing pin. RentalPins does not charge tenants brokerage.`,
  };
}

function listFreeFaq(city: string) {
  return {
    q: `Can owners list property in ${city} for free?`,
    a: `Yes. Owners and PG operators in ${city} can post flats, rooms, PG, houses and offices free from the website or the RentalPins app and receive enquiries directly.`,
  };
}

export const NEW_CITY_SEO_CONFIGS: Record<string, CitySEOConfig> = {
  // ─── Bengaluru ─────────────────────────────────────────────────────────────
  "in/bengaluru": {
    key: "in/bengaluru",
    placeName: "Bengaluru",
    intro: [
      "Bengaluru is India's largest technology rental market: thousands of people move here every month for jobs on Outer Ring Road, in Whitefield, Electronic City and Manyata Tech Park, and most of them start by searching for a flat, a PG or a shared room near the office.",
      "The RentalPins Bengaluru hub puts owner-direct flats for rent, PG, co-living, shared rooms and independent houses on one live map, so you can compare BTM Layout, Koramangala, HSR Layout, Whitefield and Hebbal before you spend a weekend on visits.",
      "Because every pin shows the exact location, you can judge the commute to your office first and the rent second — which matters more in Bengaluru than almost anywhere else, given Outer Ring Road and Silk Board traffic.",
      "Use the locality pages for BTM Layout and Koramangala if you want PG or a shared flat, HSR Layout and JP Nagar for family flats and independent floors, Whitefield for ITPL and the eastern tech parks, and Hebbal for Manyata Tech Park.",
      "Save a search on the Bengaluru hub to get alerts when owners post new 1 BHK and 2 BHK flats for rent, since good listings in popular blocks are often taken within days.",
      "When you shortlist, check the deposit, maintenance, water supply and power backup before paying a token amount; these vary widely between apartment complexes and independent houses in Bengaluru.",
    ],
    bestAreas: [
      { name: "BTM Layout & Madiwala", description: "PG, shared rooms and 1 BHK flats close to Silk Board, Koramangala and Outer Ring Road offices.", href: rentalAreaPath("in", "bengaluru", "btm-layout") },
      { name: "Koramangala", description: "Flats, PG and shared flats near startup offices, cafés and the Forum mall area.", href: rentalAreaPath("in", "bengaluru", "koramangala") },
      { name: "HSR Layout", description: "Planned sectors with apartments, independent floors and PG off Outer Ring Road.", href: rentalAreaPath("in", "bengaluru", "hsr-layout") },
      { name: "Whitefield", description: "Flats and PG near ITPL, Hoodi and Brookefield, served by the Purple Line metro.", href: rentalAreaPath("in", "bengaluru", "whitefield") },
      { name: "Hebbal", description: "Flats and PG for people working at Manyata Tech Park and on the airport road.", href: rentalAreaPath("in", "bengaluru", "hebbal") },
    ],
    averageRent: [
      { label: "PG / room", range: "₹6,500 – ₹16,500/mo", note: RENT_NOTE },
      { label: "1 BHK flat", range: "₹11,000 – ₹17,000/mo", note: RENT_NOTE },
      { label: "2 BHK flat", range: "₹18,500 – ₹26,000/mo", note: RENT_NOTE },
      { label: "3 BHK flat", range: "₹28,500 – ₹49,000/mo", note: RENT_NOTE },
      { label: "Shop / office", range: "₹15,000 – ₹30,000/mo", note: RENT_NOTE },
    ],
    universities: [
      { name: "Christ University and Hosur Road colleges", description: "Drive demand for PG and rooms in Koramangala, BTM Layout and the Hosur Road belt." },
      { name: "Outer Ring Road, ITPL, Electronic City and Manyata tech parks", description: "The main source of flat and PG demand; most renters choose an area by commute to one of these hubs." },
    ],
    transport: [
      "Outer Ring Road connects Hebbal, Marathahalli, Bellandur and Silk Board; living within a few kilometres of your office on this road saves hours each week.",
      "The Purple Line metro runs from Whitefield through the city centre, and the Green Line serves the north and south; new lines are extending towards Silk Board and Electronic City.",
      "Hosur Road links Koramangala and BTM Layout to Electronic City, while the airport road passes Hebbal and Yelahanka.",
      "Check your commute at actual office hours on the map before signing; Bengaluru travel times change sharply between morning and late evening.",
    ],
    sections: [
      { title: "Flats for rent in Bengaluru: where to start", paragraphs: [
        "Most people looking for a flat for rent in Bengaluru choose the area first and the flat second. Start from your office on the RentalPins map, look at pins within a short drive or metro ride, and compare 1 BHK and 2 BHK flats in the two or three nearest localities.",
        "South-east Bengaluru — BTM Layout, Koramangala, HSR Layout and Bellandur — suits Outer Ring Road jobs; east Bengaluru — Whitefield, Marathahalli and Hoodi — suits ITPL; north Bengaluru — Hebbal and Nagawara — suits Manyata Tech Park.",
        "Gated apartment complexes come with security, a gym and power backup, while independent houses and floors often give more space for the same rent; open several pins of each type to compare.",
      ] },
      { title: "PG and co-living in Bengaluru", paragraphs: [
        "PG in Bengaluru usually includes meals, housekeeping and Wi-Fi, which makes it popular with new joiners and students. BTM Layout, Koramangala and HSR Layout have the largest choice of PG and co-living, followed by Marathahalli and Whitefield.",
        "Before booking, ask about the food plan, sharing options, gender policy, notice period and whether electricity is billed separately. Filter PG on the Bengaluru map and open pins in the same block to compare these side by side.",
        "Shared flats are a good alternative for groups of colleagues who want a kitchen and more privacy; compare a shared 2 BHK against two PG beds in the same locality.",
      ] },
      { title: "Rooms for rent and budget options", paragraphs: [
        "Single rooms and studio units are common in BTM Layout, Madiwala and around Marathahalli, and suit people who want privacy without the cost of a full flat.",
        "Budget options are easier to find a little further from the main tech corridors, in areas such as JP Nagar, Bommanahalli and parts of Hebbal, where the commute is longer but the rent is lower.",
        "Use the price filter on the map to set your monthly budget, then widen the map area until you see enough listings to compare.",
      ] },
      { title: "Family flats and independent houses", paragraphs: [
        "Families often look at HSR Layout, JP Nagar, Jayanagar and Hebbal for 2 BHK and 3 BHK flats near schools, parks and hospitals.",
        "Independent floors in planned layouts such as HSR Layout give more space and quieter streets, while apartment complexes offer shared amenities and security.",
        "Ask the owner about parking, water supply, power backup and maintenance charges, and whether the rent quoted includes maintenance.",
      ] },
      { title: "Deposits and agreements in Bengaluru", paragraphs: [
        "Bengaluru owners often ask for a higher security deposit than owners in many other cities, so agree the exact amount, the refund timeline and any deductions for painting or cleaning before you pay.",
        "Most residential agreements run for 11 months with a notice period of one or two months; read the lock-in clause carefully if you may move jobs.",
        "Photograph the condition of the flat, fittings and appliances at move-in so the deposit refund is straightforward when you leave.",
      ] },
      { title: "Renting without a broker in Bengaluru", paragraphs: [
        "On RentalPins you contact owners and PG operators directly from the listing, so there is no brokerage to pay. Check that the person you meet is the owner or authorised by the owner, and that the flat matches the pin and photos.",
        "Message owners with your move-in date, budget and whether you are a family, a couple or bachelors; clear messages get faster replies.",
        "Be cautious of anyone asking for a large advance before a visit; pay a token only after you have seen the flat and agreed the terms.",
      ] },
      { title: "Best time to search for a rental in Bengaluru", paragraphs: [
        "Demand rises at the start of each month and around campus joining and appraisal seasons, when many people relocate at once.",
        "Start your search two to four weeks before your move-in date, save a search on the Bengaluru hub, and act quickly on good listings in popular blocks.",
        "If you are moving from another city, shortlist on the map first and plan your visits for a single day by grouping pins in neighbouring localities.",
      ] },
      { title: "For owners and PG operators in Bengaluru", paragraphs: [
        "List your flat, PG, room or house free on RentalPins and pin the exact location, so renters searching near their office see it on the map.",
        "Clear photos, the floor, furnishing, parking and what the rent includes help renters decide faster; PG operators should mention food, sharing and house rules.",
        "Mark the listing as rented once it is let, so renters trust your future posts and you only get calls about available homes.",
      ] },
    ],
    faq: [
      noBrokerFaq("Bengaluru"),
      { q: "Which Bengaluru areas are best for IT professionals?", a: "Koramangala, HSR Layout, BTM Layout and Bellandur suit Outer Ring Road jobs; Whitefield and Marathahalli suit ITPL; Hebbal suits Manyata Tech Park." },
      { q: "Where can I find PG in Bengaluru?", a: "BTM Layout, Koramangala, HSR Layout and Marathahalli have the most PG and co-living listings. Filter PG on the Bengaluru map to compare them." },
      { q: "What is the rent for a 1 BHK in Bengaluru?", a: "On RentalPins in November 2026 the middle half of 1 BHK asking rents in Bengaluru was about ₹11,000 to ₹17,000 a month; it varies a lot by area." },
      listFreeFaq("Bengaluru"),
    ],
  },

  // ─── Gurugram ──────────────────────────────────────────────────────────────
  "in/gurugram": {
    key: "in/gurugram",
    placeName: "Gurugram",
    intro: [
      "Gurugram is one of NCR's busiest rental markets, with corporate offices in Cyber City, on Golf Course Road and along Sohna Road drawing professionals, families and students looking for flats, builder floors and PG.",
      "The RentalPins Gurugram hub maps owner-direct flats for rent, independent builder floors, PG, rooms and office space across Sushant Lok, Golf Course Road, Sohna Road, Palam Vihar, Sector 14 and Sector 56.",
      "Every listing shows its exact pin, so you can check the drive or metro ride to Cyber City, Udyog Vihar or your office on Golf Course Extension before contacting the owner.",
      "Use the Sushant Lok page for flats and floors near MG Road, Golf Course Road and Sector 56 for society apartments, Sohna Road for gated societies at lower rents, and Palam Vihar or Sector 14 for independent floors and rooms.",
      "Save a search on the Gurugram hub to get alerts as owners post new 2 BHK and 3 BHK flats, and compare several pins in the same sector before visiting.",
      "Before paying a token, agree the deposit, maintenance, power backup and parking; these differ a lot between builder floors and society flats in Gurugram.",
    ],
    bestAreas: [
      { name: "Sushant Lok & MG Road", description: "Flats, builder floors and PG close to MG Road metro, Galleria Market and Cyber City.", href: rentalAreaPath("in", "gurugram", "sushant-lok") },
      { name: "Golf Course Road", description: "High-rise society apartments and office space along the Rapid Metro.", href: rentalAreaPath("in", "gurugram", "golf-course-road") },
      { name: "Sohna Road", description: "Gated societies and builder floors with schools and markets nearby.", href: rentalAreaPath("in", "gurugram", "sohna-road") },
      { name: "Palam Vihar", description: "Independent floors and rooms near the Delhi border and Dwarka Expressway.", href: rentalAreaPath("in", "gurugram", "palam-vihar") },
      { name: "Sector 14 & Old Gurugram", description: "Rooms, PG, independent floors and shops around Sector 14 Market.", href: rentalAreaPath("in", "gurugram", "sector-14-gurugram") },
    ],
    averageRent: [
      { label: "PG / room", range: "₹10,000 – ₹26,500/mo", note: RENT_NOTE },
      { label: "1 BHK flat", range: "₹17,500 – ₹25,000/mo", note: RENT_NOTE },
      { label: "2 BHK flat / floor", range: "₹12,500 – ₹40,000/mo", note: RENT_NOTE },
      { label: "3 BHK flat / floor", range: "₹26,000 – ₹62,500/mo", note: RENT_NOTE },
    ],
    universities: [
      { name: "Cyber City, Udyog Vihar and Golf Course Road offices", description: "The main source of flat and PG demand in Gurugram; most renters choose by commute to one of these hubs." },
      { name: "Colleges and institutes in Gurugram and on Sohna Road", description: "Create steady demand for PG and rooms in Sector 14, Sohna Road and older sectors." },
    ],
    transport: [
      "The Yellow Line runs from Delhi through Sikanderpur, MG Road and Huda City Centre; the Rapid Metro loops through Cyber City and down Golf Course Road to Sector 55–56.",
      "NH-48 connects Gurugram to Delhi and the airport, and Golf Course Extension and Sohna Road serve the newer southern sectors.",
      "Dwarka Expressway links Palam Vihar and the new sectors to Dwarka and the airport side.",
      "Traffic peaks sharply at office hours on NH-48 and Sohna Road, so check the route at your real commute time before you sign.",
    ],
    sections: [
      { title: "Flats for rent in Gurugram: choosing an area", paragraphs: [
        "When searching for a flat for rent in Gurugram, start with your office. If you work in Cyber City or Udyog Vihar, Sushant Lok, DLF Phase 3 and the MG Road belt keep the commute short; for Golf Course Extension or Sohna Road offices, the southern sectors are closer.",
        "Golf Course Road and Sector 56 have high-rise society apartments with amenities, while Sohna Road offers gated societies at rents often lower than Golf Course Road.",
        "Open pins in two or three neighbouring sectors on the RentalPins map and compare 2 BHK and 3 BHK flats by rent, floor, furnishing and commute.",
      ] },
      { title: "Builder floors versus society flats", paragraphs: [
        "Gurugram has a large supply of independent builder floors in older sectors such as Sushant Lok, DLF phases, Palam Vihar and Sector 14, alongside society flats in newer sectors.",
        "Builder floors usually give more space and fewer neighbours per floor, but ask who handles water, parking, lift and power backup.",
        "Society flats include maintenance, security and amenities; confirm whether the quoted rent includes maintenance or whether it is paid separately.",
      ] },
      { title: "PG and rooms in Gurugram", paragraphs: [
        "PG in Gurugram is popular with new joiners and students, especially around Sushant Lok, Sector 14, DLF phases and Sohna Road.",
        "Ask the PG operator about meals, sharing, AC, laundry and the notice period before booking, and confirm whether electricity is billed separately.",
        "Single rooms in independent houses are common in Sector 14 and Palam Vihar; filter rooms on the map to compare them.",
      ] },
      { title: "Renting near the metro in Gurugram", paragraphs: [
        "Living near a Yellow Line or Rapid Metro station makes the Delhi and Cyber City commute much easier.",
        "Sushant Lok and DLF Phase 3 are close to MG Road and Sikanderpur, Golf Course Road and Sector 56 sit along the Rapid Metro, and Sector 14 is near Huda City Centre.",
        "Use the map to check the walk from a listing to the nearest station before you visit.",
      ] },
      { title: "Deposits and agreements in Gurugram", paragraphs: [
        "Gurugram owners usually ask for a security deposit of one to three months' rent; agree the amount and refund terms in writing before paying.",
        "Most agreements run for 11 months with a one-month notice period, and many societies require tenant police verification.",
        "Photograph the flat and appliances at handover so the deposit refund is simple when you leave.",
      ] },
      { title: "Renting without a broker in Gurugram", paragraphs: [
        "On RentalPins you contact owners directly from the listing pin, with no brokerage. Confirm that the person you meet is the owner or authorised by them, and that the flat matches the pin.",
        "Send owners your move-in date, budget, family size and whether you need parking; clear messages get faster replies.",
        "Avoid paying any advance before visiting the flat and agreeing the terms.",
      ] },
      { title: "Office and retail space in Gurugram", paragraphs: [
        "Golf Course Road, MG Road, Sohna Road and Sector 14 Market have office and shop listings for startups, clinics and retail.",
        "Check the carpet area, parking, lift access and whether maintenance and electricity are included before shortlisting.",
        "Commercial leases are usually longer than residential ones, so read the lock-in and escalation clauses carefully.",
      ] },
      { title: "For owners in Gurugram", paragraphs: [
        "List your flat, builder floor, PG or office free on RentalPins and pin the exact location so renters searching near Cyber City or Golf Course Road see it.",
        "Mention the floor, parking, power backup and whether maintenance is included; Gurugram renters compare these first.",
        "Mark the listing as rented once it is let, so renters trust your future posts.",
      ] },
    ],
    faq: [
      noBrokerFaq("Gurugram"),
      { q: "Which Gurugram areas are close to Cyber City?", a: "Sushant Lok, DLF Phase 3 and the MG Road area are closest to Cyber City and the Yellow Line and Rapid Metro." },
      { q: "Are builder floors cheaper than society flats in Gurugram?", a: "Often, for the same size, though it depends on the sector. Compare both types on the Gurugram map in the same area." },
      { q: "What is the rent for a 2 BHK in Gurugram?", a: "On RentalPins in November 2026 the middle half of 2 BHK asking rents in Gurugram was about ₹12,500 to ₹40,000 a month, varying widely by sector." },
      listFreeFaq("Gurugram"),
    ],
  },

  // ─── Hyderabad ─────────────────────────────────────────────────────────────
  "in/hyderabad": {
    key: "in/hyderabad",
    placeName: "Hyderabad",
    intro: [
      "Hyderabad's rental market is shaped by its IT corridor: HITEC City, Gachibowli and the Financial District draw professionals looking for flats, gated-community apartments and PG, while older areas such as Secunderabad and Ameerpet suit people working in the central city.",
      "The RentalPins Hyderabad hub maps owner-direct flats for rent, PG, rooms and independent houses across Kondapur, Madhapur, Gachibowli, Kukatpally and Secunderabad on one live map.",
      "Every listing is pinned to its exact location, so you can check the commute to your office or the nearest metro station before contacting the owner.",
      "Use the Kondapur and Madhapur pages for flats and PG near HITEC City, look at Kukatpally and Miyapur for metro access, and Secunderabad and Ameerpet for central locations.",
      "Save a search on the Hyderabad hub to get alerts as owners post new 2 BHK flats and PG, especially around joining dates.",
      "Before paying a token, confirm the deposit, maintenance and any community move-in charges, which differ between gated communities and independent houses.",
    ],
    bestAreas: [
      { name: "Kondapur", description: "Flats and PG between HITEC City and Gachibowli at rents often below Madhapur.", href: rentalAreaPath("in", "hyderabad", "kondapur") },
      { name: "Madhapur & HITEC City", description: "PG, flats and office space at the heart of the IT corridor.", href: rentalAreaPath("in", "hyderabad", "madhapur") },
      { name: "Gachibowli & Financial District", description: "Gated communities and flats near large IT campuses and Nanakramguda." },
      { name: "Kukatpally & Miyapur", description: "Flats and PG with metro access to Ameerpet and HITEC City." },
      { name: "Secunderabad & Ameerpet", description: "Central flats, rooms and PG with good rail and metro links." },
    ],
    averageRent: [
      { label: "PG / room", range: "₹5,500 – ₹16,000/mo", note: RENT_NOTE },
      { label: "1 BHK flat", range: "₹8,000 – ₹22,000/mo", note: RENT_NOTE },
      { label: "2 BHK flat", range: "₹13,000 – ₹26,500/mo", note: RENT_NOTE },
      { label: "3 BHK flat", range: "₹26,500 – ₹41,500/mo", note: RENT_NOTE },
    ],
    universities: [
      { name: "HITEC City, Gachibowli and Financial District IT campuses", description: "The largest source of flat and PG demand in western Hyderabad." },
      { name: "University of Hyderabad and IIIT Hyderabad (Gachibowli)", description: "Drive demand for PG and shared flats in Gachibowli and nearby areas." },
    ],
    transport: [
      "The Blue Line connects HITEC City and Madhapur with Ameerpet and the east; the Red Line runs from Miyapur through Kukatpally and Ameerpet to LB Nagar.",
      "The Outer Ring Road links the Financial District, Gachibowli and the airport side.",
      "Secunderabad is a major railway hub, and Ameerpet is the main metro interchange.",
      "Check your commute at peak hours; roads around the IT corridor are much slower at the start and end of the working day.",
    ],
    sections: [
      { title: "Flats for rent in Hyderabad: choosing an area", paragraphs: [
        "When searching for a flat for rent in Hyderabad, start with your office. For HITEC City and Madhapur, Kondapur, Madhapur and Kothaguda are closest; for Gachibowli and the Financial District, Gachibowli, Nanakramguda, Manikonda and Narsingi are popular.",
        "If you prefer metro access, Kukatpally and Miyapur on the Red Line and areas along the Blue Line make the daily commute predictable.",
        "Open pins in a few neighbouring areas on the RentalPins map and compare 2 BHK flats by rent, community and commute before visiting.",
      ] },
      { title: "Gated communities in Hyderabad", paragraphs: [
        "Western Hyderabad has many gated communities with security, clubhouses and power backup, popular with families and professionals.",
        "Ask whether maintenance is included in the rent, and whether the community charges a move-in fee or separate maintenance deposit.",
        "Independent houses often give more space for the same rent; confirm water supply, parking and who maintains the common areas.",
      ] },
      { title: "PG and rooms in Hyderabad", paragraphs: [
        "PG around Madhapur, Kondapur and Ameerpet suits new joiners and students, with options for single, double and triple sharing.",
        "Before booking, ask about food, cleaning, Wi-Fi, notice period and whether electricity is extra.",
        "Filter PG on the Hyderabad map and open pins in the same area to compare them side by side.",
      ] },
      { title: "Renting near the metro in Hyderabad", paragraphs: [
        "Living near a metro station saves time on Hyderabad's busy roads. HITEC City and Durgam Cheruvu stations serve the IT corridor, and Ameerpet connects the Red and Blue Lines.",
        "Kukatpally and Miyapur offer flats at lower rents with a direct metro ride to Ameerpet and onward to HITEC City.",
        "Use the map to check the distance from a listing to the nearest station.",
      ] },
      { title: "Growing areas around the Financial District", paragraphs: [
        "Manikonda, Puppalaguda, Narsingi and Kokapet have grown quickly around the Financial District and Outer Ring Road, with many newer apartment blocks.",
        "These areas suit people working in Nanakramguda and Gachibowli who want newer flats at rents often below Gachibowli itself.",
        "Check the road access and shops nearby when you visit, as facilities are still developing in some pockets.",
      ] },
      { title: "Deposits and agreements in Hyderabad", paragraphs: [
        "Hyderabad owners commonly ask for a deposit of two to three months' rent; agree the amount and refund timeline in writing.",
        "Most residential agreements run for 11 months, with a one- or two-month notice period.",
        "Photograph the condition of the flat at move-in so the deposit refund is straightforward.",
      ] },
      { title: "Renting without a broker in Hyderabad", paragraphs: [
        "On RentalPins you message owners directly from the listing pin and pay no brokerage. Confirm that the person you meet is the owner or authorised by them.",
        "Tell owners your move-in date, budget and family size to get faster replies.",
        "Avoid paying an advance before you have visited the flat and agreed the terms.",
      ] },
      { title: "For owners in Hyderabad", paragraphs: [
        "List your flat, house or PG free on RentalPins and pin the exact location so renters searching near HITEC City or their metro station find it.",
        "Include the community name, floor, parking and what the rent covers; renters compare these first.",
        "Mark the listing as rented once it is let so renters trust your future posts.",
      ] },
    ],
    faq: [
      noBrokerFaq("Hyderabad"),
      { q: "Which Hyderabad areas are best near HITEC City?", a: "Kondapur, Madhapur and Kothaguda are closest to HITEC City; Gachibowli and Nanakramguda suit the Financial District." },
      { q: "Where can I find PG in Hyderabad?", a: "Madhapur, Kondapur and Ameerpet have many PG listings. Filter PG on the Hyderabad map to compare them." },
      { q: "What is the rent for a 2 BHK in Hyderabad?", a: "On RentalPins in November 2026 the middle half of 2 BHK asking rents in Hyderabad was about ₹13,000 to ₹26,500 a month." },
      listFreeFaq("Hyderabad"),
    ],
  },

  // ─── Kolkata ───────────────────────────────────────────────────────────────
  "in/kolkata": {
    key: "in/kolkata",
    placeName: "Kolkata",
    intro: [
      "Kolkata's rental market ranges from IT professionals in Salt Lake and New Town to students and families across South Kolkata, with flats, PG, rooms and independent houses available in every part of the city.",
      "The RentalPins Kolkata hub maps owner-direct flats for rent, PG, rooms and office space across Salt Lake, New Town, Garia, Park Street, Ballygunge and Behala on one live map.",
      "Every listing is pinned to its location, so you can check the commute to Sector V, New Town or your college before contacting the owner.",
      "Use the Salt Lake page for flats and PG near Sector V, look at New Town for newer apartment complexes, and Garia, Jadavpur and Tollygunge for student rooms and budget flats near the metro.",
      "Save a search on the Kolkata hub to get alerts when owners post new flats and PG, especially before college sessions start.",
      "Before paying a token, agree the deposit, maintenance and electricity billing with the owner, which vary between older houses and newer complexes.",
    ],
    bestAreas: [
      { name: "Salt Lake (Bidhannagar)", description: "Flats, PG and office space close to Sector V and City Centre.", href: rentalAreaPath("in", "kolkata", "salt-lake") },
      { name: "New Town", description: "Newer apartment complexes near the New Town IT hubs and Eco Park." },
      { name: "Garia & Jadavpur", description: "Student rooms, PG and budget flats near colleges and the Blue Line metro." },
      { name: "Park Street & Ballygunge", description: "Central flats and premium apartments close to offices and markets." },
      { name: "Behala & Tollygunge", description: "Family flats and independent houses in south and south-west Kolkata." },
    ],
    averageRent: [
      { label: "PG / room", range: "₹3,000 – ₹12,000/mo", note: RENT_NOTE },
      { label: "2 BHK flat", range: "₹8,500 – ₹15,000/mo", note: RENT_NOTE },
      { label: "3 BHK flat", range: "₹14,000 – ₹15,000/mo", note: RENT_NOTE },
    ],
    universities: [
      { name: "Jadavpur University and South Kolkata colleges", description: "Drive demand for rooms and PG in Jadavpur, Garia and Tollygunge." },
      { name: "Salt Lake Sector V and New Town IT hubs", description: "The main source of flat and PG demand in east Kolkata." },
    ],
    transport: [
      "The Blue Line metro runs north–south from Dakshineswar to Kavi Subhash, serving Park Street, Tollygunge and Garia.",
      "The Green Line (East–West Metro) connects Salt Lake Sector V with Sealdah and Howrah.",
      "EM Bypass links South Kolkata with Salt Lake and New Town, and buses and autos cover most local routes.",
      "Check your commute at peak hours; travel between South Kolkata and Sector V can take much longer in the evening rush.",
    ],
    sections: [
      { title: "Flats for rent in Kolkata: choosing an area", paragraphs: [
        "When looking for a flat for rent in Kolkata, start from where you work or study. Salt Lake and New Town suit Sector V and the New Town IT hubs; Park Street and Ballygunge suit central offices; Garia, Jadavpur and Behala suit South Kolkata.",
        "Older neighbourhoods often have independent houses and floors, while New Town and parts of Salt Lake have newer apartment complexes with security and power backup.",
        "Open pins in a few nearby areas on the RentalPins map and compare 2 BHK flats by rent, floor and commute before visiting.",
      ] },
      { title: "PG and rooms in Kolkata", paragraphs: [
        "Students and young professionals often rent rooms or PG in Garia, Jadavpur, Tollygunge and Salt Lake.",
        "Ask about meals, sharing, curfew, Wi-Fi and the notice period before booking a PG, and confirm whether electricity is billed separately.",
        "Single rooms in family houses are common in South Kolkata; filter rooms on the map to compare them.",
      ] },
      { title: "Renting near Salt Lake Sector V", paragraphs: [
        "Salt Lake and nearby areas such as Kestopur and Lake Town are popular with people working in Sector V.",
        "The East–West Metro now links Sector V with central Kolkata, which widens the choice of areas within a reasonable commute.",
        "Check the walk from a listing to the nearest metro or bus stop on the map before you visit.",
      ] },
      { title: "New Town and newer apartment complexes", paragraphs: [
        "New Town has many newer apartment complexes with wider roads, parks and shopping, popular with families and IT professionals.",
        "Rents can be competitive because of the large supply; compare several complexes before you decide.",
        "Ask about maintenance, power backup and parking, which are usually part of the complex rules.",
      ] },
      { title: "Family flats and independent houses", paragraphs: [
        "Families often look at Behala, Tollygunge, Ballygunge and Salt Lake for 2 BHK and 3 BHK flats near schools and hospitals.",
        "Independent houses and floors can give more space; confirm water supply, parking and who maintains the building.",
        "Ask whether the rent includes maintenance and how electricity is billed.",
      ] },
      { title: "Deposits and agreements in Kolkata", paragraphs: [
        "Kolkata owners usually ask for a deposit of one to three months' rent; agree the amount and refund terms in writing.",
        "Most agreements run for 11 months; read the notice period and any lock-in clause before signing.",
        "Photograph the flat at move-in so the deposit refund is straightforward.",
      ] },
      { title: "Renting without a broker in Kolkata", paragraphs: [
        "On RentalPins you contact owners directly from the listing pin, with no brokerage. Check that the person you meet is the owner or authorised by them.",
        "Tell owners your move-in date, budget and family size for faster replies.",
        "Avoid paying an advance before you have visited the flat and agreed the terms.",
      ] },
      { title: "For owners in Kolkata", paragraphs: [
        "List your flat, room, PG or office free on RentalPins and pin the exact location so renters searching near Sector V, New Town or their college find it.",
        "Mention the floor, furnishing, parking and how electricity is billed; Kolkata renters compare these first.",
        "Mark the listing as rented once it is let so renters trust your future posts.",
      ] },
    ],
    faq: [
      noBrokerFaq("Kolkata"),
      { q: "Which Kolkata areas are best near Sector V?", a: "Salt Lake, New Town, Kestopur and Lake Town are closest to Salt Lake Sector V and the New Town IT hubs." },
      { q: "Where do students rent in Kolkata?", a: "Garia, Jadavpur and Tollygunge have many rooms and PG near colleges and the Blue Line metro." },
      { q: "What is the rent for a 2 BHK in Kolkata?", a: "On RentalPins in November 2026 the middle half of 2 BHK asking rents in Kolkata was about ₹8,500 to ₹15,000 a month." },
      listFreeFaq("Kolkata"),
    ],
  },

  // ─── Ghaziabad ─────────────────────────────────────────────────────────────
  "in/ghaziabad": {
    key: "in/ghaziabad",
    placeName: "Ghaziabad",
    intro: [
      "Ghaziabad is one of NCR's most affordable rental markets, with families and professionals renting flats in Indirapuram, Vaishali, Raj Nagar Extension and Crossings Republik while working in Delhi, Noida or Ghaziabad itself.",
      "The RentalPins Ghaziabad hub maps owner-direct flats for rent, builder floors, rooms, PG and shops on one live map, so you can compare areas by commute and rent before visiting.",
      "Every listing is pinned to its exact location, so you can check the distance to the Blue Line or Red Line metro, NH-24 or your office before contacting the owner.",
      "Indirapuram, Vaishali and Kaushambi are closest to East Delhi; Raj Nagar Extension and Crossings Republik offer newer gated societies at lower rents.",
      "Save a search on the Ghaziabad hub to get alerts as owners post new 2 BHK and 3 BHK flats.",
      "Before paying a token, agree the deposit, maintenance and power backup arrangements, which differ between societies and builder floors.",
    ],
    bestAreas: [
      { name: "Indirapuram", description: "Society flats and builder floors close to East Delhi and Noida." },
      { name: "Vaishali & Kaushambi", description: "Flats and rooms near the Blue Line metro and Anand Vihar." },
      { name: "Raj Nagar Extension", description: "Newer gated societies at rents usually below areas next to Delhi." },
      { name: "Crossings Republik", description: "Township flats along NH-24 with access to Noida." },
      { name: "Vasundhara", description: "Family flats and builder floors between Indirapuram and Vaishali." },
    ],
    averageRent: [
      { label: "1 BHK flat", range: "₹7,000 – ₹16,500/mo", note: RENT_NOTE },
      { label: "2 BHK flat", range: "₹18,000 – ₹30,000/mo", note: RENT_NOTE },
      { label: "3 BHK flat", range: "₹19,000 – ₹26,000/mo", note: RENT_NOTE },
      { label: "Shop / office", range: "₹28,500 – ₹49,000/mo", note: RENT_NOTE },
    ],
    universities: [
      { name: "Colleges along NH-24 and in Ghaziabad", description: "Create demand for rooms and PG in Crossings Republik, Vijay Nagar and nearby areas." },
      { name: "Offices in Delhi, Noida and Ghaziabad", description: "Most renters choose an area by metro or road access to their workplace." },
    ],
    transport: [
      "The Blue Line metro serves Vaishali and Kaushambi, and the Red Line extends into Ghaziabad up to Shaheed Sthal (New Bus Adda).",
      "NH-24 (Delhi–Meerut Expressway) connects Ghaziabad with Delhi and Crossings Republik, and the RRTS Namo Bharat line links Ghaziabad with Delhi and Meerut.",
      "Anand Vihar is a major rail and bus hub next to Vaishali and Kaushambi.",
      "Check your commute at peak hours; NH-24 and the Delhi border crossings are slow in the morning and evening rush.",
    ],
    sections: [
      { title: "Flats for rent in Ghaziabad: choosing an area", paragraphs: [
        "When searching for a flat for rent in Ghaziabad, start with your commute. If you work in Delhi, Indirapuram, Vaishali and Kaushambi are closest; if you work in Noida, Indirapuram and Crossings Republik are convenient.",
        "Raj Nagar Extension and Crossings Republik have many newer gated societies at rents usually below the areas next to Delhi.",
        "Open pins in a few nearby areas on the RentalPins map and compare 2 BHK and 3 BHK flats by rent and commute.",
      ] },
      { title: "Society flats and builder floors", paragraphs: [
        "Ghaziabad has a mix of gated societies and independent builder floors, especially in Indirapuram, Vaishali and Vasundhara.",
        "Society flats include security, maintenance and often power backup; confirm whether maintenance is included in the rent.",
        "Builder floors may give more space; ask about parking, water supply and who maintains the building.",
      ] },
      { title: "Rooms and PG in Ghaziabad", paragraphs: [
        "Rooms and PG are common near colleges along NH-24, in Vaishali and in older Ghaziabad neighbourhoods.",
        "Ask the PG operator about meals, sharing, AC and the notice period before booking.",
        "Filter rooms and PG on the map to compare options near your college or office.",
      ] },
      { title: "Renting near the metro in Ghaziabad", paragraphs: [
        "Living near Vaishali or Kaushambi on the Blue Line makes the Delhi commute easier, while the Red Line serves central Ghaziabad.",
        "The Namo Bharat RRTS line has shortened travel between Ghaziabad, Delhi and Meerut for people living near its stations.",
        "Use the map to check the distance from a listing to the nearest station before visiting.",
      ] },
      { title: "Family flats in Ghaziabad", paragraphs: [
        "Families often choose Indirapuram, Vasundhara and Raj Nagar Extension for societies with parks, schools and markets nearby.",
        "Compare a 3 BHK in a newer society with a 2 BHK closer to Delhi, depending on what matters more to you: space or commute.",
        "Ask about society rules for tenants, parking slots and move-in charges.",
      ] },
      { title: "Deposits and agreements in Ghaziabad", paragraphs: [
        "Ghaziabad owners usually ask for a deposit of one to two months' rent; agree the amount and refund terms in writing.",
        "Most agreements run for 11 months, and many societies require tenant police verification.",
        "Photograph the flat at move-in so the deposit refund is straightforward.",
      ] },
      { title: "Renting without a broker in Ghaziabad", paragraphs: [
        "On RentalPins you message owners directly from the listing pin and pay no brokerage. Confirm that the person you meet is the owner or authorised by them.",
        "Send owners your move-in date, budget and family size for faster replies.",
        "Avoid paying any advance before visiting the flat.",
      ] },
      { title: "For owners in Ghaziabad", paragraphs: [
        "List your flat, builder floor, room or shop free on RentalPins and pin the exact location so renters searching near their metro station find it.",
        "Mention the society name, floor, parking and power backup; renters compare these first.",
        "Mark the listing as rented once it is let.",
      ] },
    ],
    faq: [
      noBrokerFaq("Ghaziabad"),
      { q: "Which Ghaziabad areas are closest to Delhi?", a: "Indirapuram, Vaishali and Kaushambi border East Delhi and are served by the Blue Line metro." },
      { q: "Is Raj Nagar Extension good for families?", a: "It has many newer gated societies at rents usually below the areas next to Delhi." },
      { q: "What is the rent for a 2 BHK in Ghaziabad?", a: "On RentalPins in November 2026 the middle half of 2 BHK asking rents in the Ghaziabad area was about ₹18,000 to ₹30,000 a month." },
      listFreeFaq("Ghaziabad"),
    ],
  },

  // ─── Pune ──────────────────────────────────────────────────────────────────
  "in/pune": {
    key: "in/pune",
    placeName: "Pune",
    intro: [
      "Pune's rental market is driven by its IT parks in Hinjewadi and Kharadi and by a large student population, with flats, PG and shared rooms in demand across the city.",
      "The RentalPins Pune hub maps owner-direct flats for rent, PG, rooms and houses across Hinjewadi, Wakad, Baner, Kharadi, Viman Nagar and Kothrud on one live map.",
      "Every listing is pinned to its location, so you can check the commute to Hinjewadi, EON IT Park or your college before contacting the owner.",
      "West Pune — Hinjewadi, Wakad and Baner — suits the Hinjewadi IT Park; east Pune — Kharadi and Viman Nagar — suits EON IT Park and the airport side; Kothrud and Deccan suit students.",
      "Save a search on the Pune hub to get alerts as owners post new flats and PG.",
      "Before paying a token, agree the deposit, maintenance and society rules for tenants.",
    ],
    bestAreas: [
      { name: "Hinjewadi", description: "Flats and PG next to the Rajiv Gandhi Infotech Park.", href: rentalAreaPath("in", "pune", "hinjewadi") },
      { name: "Wakad & Baner", description: "Society flats and shared apartments close to Hinjewadi and the Mumbai–Bengaluru highway." },
      { name: "Kharadi & Viman Nagar", description: "Flats and PG near EON IT Park and the airport." },
      { name: "Kothrud & Deccan", description: "Student rooms, PG and family flats near colleges in central-west Pune." },
      { name: "Hadapsar & Magarpatta", description: "Flats near Magarpatta City and the south-east IT parks." },
    ],
    averageRent: [
      { label: "2 BHK flat", range: "₹20,500 – ₹31,500/mo", note: RENT_NOTE },
    ],
    universities: [
      { name: "Savitribai Phule Pune University and city colleges", description: "Drive demand for rooms and PG in Kothrud, Deccan, Aundh and nearby areas." },
      { name: "Hinjewadi, Kharadi and Magarpatta IT parks", description: "The main source of flat and PG demand; most renters choose by commute to one of these." },
    ],
    transport: [
      "Pune Metro lines connect Pimpri-Chinchwad, Shivajinagar, Swargate and Ramwadi, with a line to Hinjewadi under construction.",
      "The Mumbai–Bengaluru highway links Wakad, Baner and Hinjewadi, and Nagar Road serves Viman Nagar and Kharadi.",
      "Pune Airport is in Lohegaon, close to Viman Nagar and Kharadi.",
      "Check your commute at peak hours; Hinjewadi traffic is heavy at the start and end of the working day.",
    ],
    sections: [
      { title: "Flats for rent in Pune: choosing an area", paragraphs: [
        "When looking for a flat for rent in Pune, start with your office or college. Hinjewadi, Wakad and Baner suit the Hinjewadi IT Park; Kharadi and Viman Nagar suit EON IT Park; Hadapsar suits Magarpatta.",
        "Most of these areas have gated societies with amenities, while older parts of the city have independent buildings and houses.",
        "Open pins in two or three nearby areas on the RentalPins map and compare 1 BHK and 2 BHK flats by rent and commute.",
      ] },
      { title: "PG and shared flats in Pune", paragraphs: [
        "PG and shared flats are popular with students and new joiners in Hinjewadi, Wakad, Kothrud and Viman Nagar.",
        "Ask about meals, sharing, house rules and the notice period before booking a PG.",
        "Shared flats suit groups of colleagues who want a kitchen and more privacy; compare them with PG in the same area.",
      ] },
      { title: "Renting in Hinjewadi", paragraphs: [
        "Hinjewadi Phase 1 and the Wakad side are closest to most offices and shops, while Phases 2 and 3 suit people working further inside the park.",
        "Maan and Marunji offer newer flats at lower rents, with a slightly longer commute.",
        "Use the Hinjewadi page and map to compare listings by distance to your building.",
      ] },
      { title: "Renting in east Pune", paragraphs: [
        "Kharadi and Viman Nagar are popular with people working at EON IT Park, World Trade Center and the airport side.",
        "These areas have many newer societies, restaurants and shopping, which makes them popular with young professionals.",
        "Compare flats in Kharadi with options in Viman Nagar and Wagholi to balance rent and commute.",
      ] },
      { title: "Student rentals in Pune", paragraphs: [
        "Students often rent rooms and PG in Kothrud, Deccan, Aundh and near their college campuses.",
        "Ask about curfew, meals, study space and Wi-Fi, which matter most for students.",
        "Start searching a few weeks before the session begins, when demand rises.",
      ] },
      { title: "Deposits and agreements in Pune", paragraphs: [
        "Pune owners usually ask for a deposit of two to three months' rent; agree the amount and refund timeline in writing.",
        "Rent agreements in Maharashtra are usually registered and run for 11 months; confirm who pays the registration charges.",
        "Photograph the flat at move-in so the deposit refund is straightforward.",
      ] },
      { title: "Renting without a broker in Pune", paragraphs: [
        "On RentalPins you contact owners directly from the listing pin and pay no brokerage. Confirm that the person you meet is the owner or authorised by them.",
        "Tell owners your move-in date, budget and whether you are a family, a couple or bachelors.",
        "Avoid paying an advance before visiting the flat.",
      ] },
      { title: "For owners in Pune", paragraphs: [
        "List your flat, PG or room free on RentalPins and pin the exact location so renters searching near Hinjewadi, Kharadi or their college find it.",
        "Mention the society name, furnishing, parking and tenant rules; renters compare these first.",
        "Mark the listing as rented once it is let.",
      ] },
    ],
    faq: [
      noBrokerFaq("Pune"),
      { q: "Where do IT professionals rent in Pune?", a: "Hinjewadi, Wakad and Baner suit the Hinjewadi IT Park; Kharadi and Viman Nagar suit EON IT Park and the airport side." },
      { q: "Which Pune areas suit students?", a: "Kothrud, Deccan and Aundh have many rooms and PG near colleges." },
      { q: "What is the rent for a 2 BHK in Pune?", a: "On RentalPins in November 2026 the middle half of 2 BHK asking rents in Pune was about ₹20,500 to ₹31,500 a month." },
      listFreeFaq("Pune"),
    ],
  },

  // ─── Patna ─────────────────────────────────────────────────────────────────
  "in/patna": {
    key: "in/patna",
    placeName: "Patna",
    intro: [
      "Patna's rental market serves a large student population preparing for competitive exams, families across the city's planned colonies, and professionals working in offices and hospitals along Bailey Road and Boring Road.",
      "The RentalPins Patna hub maps owner-direct flats for rent, rooms, PG, independent houses and shops across Bailey Road, Patliputra, Boring Road and Kankarbagh on one live map.",
      "Every listing is pinned to its location, so you can check the distance to your coaching centre, college or office before contacting the owner.",
      "Students usually look at Boring Road, Kankarbagh, Rajendra Nagar and the Ashok Rajpath belt; families often prefer Patliputra Colony, Bailey Road and Rajendra Nagar.",
      "Save a search on the Patna hub to get alerts as owners post new rooms and flats, especially before coaching and college sessions begin.",
      "Before paying a token, agree the deposit, electricity billing, water supply and house rules with the owner.",
    ],
    bestAreas: [
      { name: "Bailey Road", description: "Flats, rooms and office space along west Patna's main road towards Danapur.", href: rentalAreaPath("in", "patna", "bailey-road") },
      { name: "Patliputra Colony", description: "Flats and independent houses in a quieter planned colony.", href: rentalAreaPath("in", "patna", "patliputra") },
      { name: "Boring Road", description: "Rooms, PG and shops on Patna's busy coaching and shopping street.", href: rentalAreaPath("in", "patna", "boring-road") },
      { name: "Kankarbagh", description: "Rooms, PG and flats in a large residential area popular with students.", href: rentalAreaPath("in", "patna", "kankarbagh") },
      { name: "Rajendra Nagar", description: "Student rooms near coaching centres and family flats close to the station." },
    ],
    averageRent: [
      { label: "2 BHK flat", range: "₹7,500 – ₹12,000/mo", note: RENT_NOTE },
      { label: "3 BHK flat / house", range: "₹10,500 – ₹20,000/mo", note: RENT_NOTE },
    ],
    universities: [
      { name: "Patna University and Ashok Rajpath colleges", description: "Drive demand for rooms and PG along Ashok Rajpath, Rajendra Nagar and nearby areas." },
      { name: "Coaching centres on Boring Road and in Kankarbagh", description: "Create year-round demand for student rooms, PG and shared flats." },
    ],
    transport: [
      "Bailey Road and Boring Road are Patna's main east–west corridors in the west of the city; Ashok Rajpath runs along the Ganga.",
      "Patna Junction and Pataliputra Junction are the main railway stations, and Patna Metro is being built across the city.",
      "Autos and e-rickshaws cover most local routes between colonies and coaching areas.",
      "Check the distance to your coaching centre or college on the map; a short walk saves a lot of time during exam preparation.",
    ],
    sections: [
      { title: "Rooms and flats for rent in Patna", paragraphs: [
        "When searching for a room or flat for rent in Patna, start from where you study or work. Students often choose Boring Road, Kankarbagh and Rajendra Nagar to be near coaching centres, while families look at Patliputra and Bailey Road.",
        "Single rooms, shared rooms and small flats are common in student areas; independent houses and larger flats are more common in planned colonies.",
        "Open pins in a few nearby areas on the RentalPins map and compare rent, size and distance before visiting.",
      ] },
      { title: "Student accommodation and PG in Patna", paragraphs: [
        "Patna has a large population of students preparing for competitive exams, and many owners rent rooms and PG for them.",
        "Ask about meals, study space, electricity backup, curfew and the notice period before booking.",
        "Start searching a few weeks before your batch starts, when demand for rooms near coaching centres rises.",
      ] },
      { title: "Family flats and houses in Patna", paragraphs: [
        "Families often prefer Patliputra Colony, Bailey Road, Rajendra Nagar and parts of Kankarbagh for flats and independent houses near schools and hospitals.",
        "Ask about water supply, power backup, parking and who maintains the building.",
        "Compare a flat on a main road with one in a quieter lane, depending on whether you value convenience or calm.",
      ] },
      { title: "Shops and offices in Patna", paragraphs: [
        "Boring Road, Bailey Road and Fraser Road have shops and office space for clinics, coaching centres and retail.",
        "Check the frontage, parking, floor and whether electricity is billed separately before shortlisting.",
        "Commercial leases are usually longer than residential ones, so read the lock-in and rent increase terms carefully.",
      ] },
      { title: "Choosing between areas in Patna", paragraphs: [
        "West Patna along Bailey Road suits people working in offices and hospitals in that part of the city, with good road access to Danapur.",
        "Central areas such as Boring Road and Rajendra Nagar are busier but close to markets, coaching centres and the railway station.",
        "Use the map to compare commute times before deciding.",
      ] },
      { title: "Deposits and agreements in Patna", paragraphs: [
        "Patna owners usually ask for a deposit of one to two months' rent; agree the amount and refund terms in writing.",
        "Agree the rent, electricity billing, notice period and house rules before moving in.",
        "Photograph the room or flat at move-in so the deposit refund is straightforward.",
      ] },
      { title: "Renting without a broker in Patna", paragraphs: [
        "On RentalPins you contact owners directly from the listing pin and pay no brokerage. Confirm that the person you meet is the owner or authorised by them.",
        "Tell owners whether you are a student, working professional or family, and your move-in date.",
        "Avoid paying any advance before visiting the room or flat.",
      ] },
      { title: "For owners in Patna", paragraphs: [
        "List your room, flat, PG or shop free on RentalPins and pin the exact location so students and families searching near their coaching centre or office find it.",
        "Mention meals, electricity billing, water supply and house rules; renters compare these first.",
        "Mark the listing as rented once it is let.",
      ] },
    ],
    faq: [
      noBrokerFaq("Patna"),
      { q: "Which Patna areas suit students?", a: "Boring Road, Kankarbagh, Rajendra Nagar and the Ashok Rajpath belt have many rooms and PG near coaching centres and colleges." },
      { q: "Where do families rent in Patna?", a: "Patliputra Colony, Bailey Road and Rajendra Nagar are popular for flats and independent houses." },
      { q: "What is the rent for a 2 BHK in Patna?", a: "On RentalPins in November 2026 the middle half of 2 BHK asking rents in Patna was about ₹7,500 to ₹12,000 a month." },
      listFreeFaq("Patna"),
    ],
  },

  // ─── Indore ────────────────────────────────────────────────────────────────
  "in/indore": {
    key: "in/indore",
    placeName: "Indore",
    intro: [
      "Indore is Madhya Pradesh's largest commercial city, with students at its colleges and coaching institutes, professionals in Vijay Nagar and along AB Road, and families across planned schemes renting flats, rooms and PG.",
      "The RentalPins Indore hub maps owner-direct flats for rent, PG, rooms, houses and office space across Vijay Nagar, Palasia, AB Road and Bhawarkuan on one live map.",
      "Every listing is pinned to its exact location, so you can check the distance to your college, coaching centre or office before contacting the owner.",
      "Vijay Nagar and AB Road suit professionals; Bhawarkuan and areas near coaching institutes suit students; Palasia offers central flats and shops.",
      "Save a search on the Indore hub to get alerts as owners post new flats and PG.",
      "Before paying a token, agree the deposit, electricity billing and maintenance with the owner.",
    ],
    bestAreas: [
      { name: "Vijay Nagar", description: "Flats, PG and office space in Indore's busiest commercial area on AB Road.", href: rentalAreaPath("in", "indore", "vijay-nagar-indore") },
      { name: "Palasia", description: "Central flats, shops and offices around New Palasia and 56 Dukan.", href: rentalAreaPath("in", "indore", "palasia") },
      { name: "Bhawarkuan", description: "Student rooms and PG near coaching institutes and colleges." },
      { name: "Super Corridor", description: "Newer flats near the IT parks and the airport road." },
      { name: "Rau", description: "Budget flats and rooms on the southern edge of the city." },
    ],
    averageRent: [
      { label: "1 BHK flat", range: "₹13,500 – ₹17,000/mo", note: RENT_NOTE },
      { label: "2 BHK flat", range: "₹9,000 – ₹18,000/mo", note: RENT_NOTE },
      { label: "Shop / office", range: "₹16,500 – ₹44,000/mo", note: RENT_NOTE },
    ],
    universities: [
      { name: "Devi Ahilya Vishwavidyalaya (DAVV) and city colleges", description: "Drive demand for rooms and PG in Bhawarkuan and nearby areas." },
      { name: "IIM Indore, IIT Indore and coaching institutes", description: "Create demand for student and faculty housing in different parts of the city." },
    ],
    transport: [
      "AB Road is Indore's main north–south corridor, linking Vijay Nagar, Palasia and the city centre, with the BRTS bus corridor running along it.",
      "The Super Corridor connects the airport side with the IT parks, and Indore Metro is being built along it.",
      "Autos and city buses cover most local routes.",
      "Check the distance to your college or office on the map before visiting.",
    ],
    sections: [
      { title: "Flats for rent in Indore: choosing an area", paragraphs: [
        "When searching for a flat for rent in Indore, start from where you work or study. Vijay Nagar and AB Road suit professionals, Bhawarkuan suits students, and Palasia offers central locations near markets.",
        "Planned schemes such as Scheme 54 and Scheme 78 have many flats and independent houses, while the Super Corridor has newer projects.",
        "Open pins in a few nearby areas on the RentalPins map and compare rent and commute before visiting.",
      ] },
      { title: "PG and rooms in Indore", paragraphs: [
        "Students and young professionals often rent PG and rooms in Bhawarkuan, Vijay Nagar and near coaching institutes.",
        "Ask about meals, sharing, study space and the notice period before booking.",
        "Start searching a few weeks before your session or batch begins, when demand rises.",
      ] },
      { title: "Family flats in Indore", paragraphs: [
        "Families often look at Vijay Nagar schemes, Palasia and Saket Nagar for flats near schools, hospitals and markets.",
        "Independent houses can give more space; confirm water supply, parking and power backup.",
        "Ask whether maintenance is included in the rent.",
      ] },
      { title: "Office and retail space in Indore", paragraphs: [
        "Vijay Nagar, AB Road and Palasia have office and shop listings for clinics, coaching centres, startups and retail.",
        "Check the frontage, parking, floor and whether maintenance and electricity are included.",
        "Read the lock-in and rent increase terms carefully before signing a commercial lease.",
      ] },
      { title: "Renting near the Super Corridor", paragraphs: [
        "The Super Corridor has newer apartments close to the IT parks and the airport road.",
        "It suits people working at the IT parks who want newer flats, though shops and services are still developing in some pockets.",
        "Check road access and nearby facilities when you visit.",
      ] },
      { title: "Deposits and agreements in Indore", paragraphs: [
        "Indore owners usually ask for a deposit of one to two months' rent; agree the amount and refund terms in writing.",
        "Most agreements run for 11 months; read the notice period before signing.",
        "Photograph the flat at move-in so the deposit refund is straightforward.",
      ] },
      { title: "Renting without a broker in Indore", paragraphs: [
        "On RentalPins you message owners directly from the listing pin and pay no brokerage. Confirm that the person you meet is the owner or authorised by them.",
        "Tell owners your move-in date, budget and whether you are a student, professional or family.",
        "Avoid paying any advance before visiting the flat.",
      ] },
      { title: "For owners in Indore", paragraphs: [
        "List your flat, room, PG or shop free on RentalPins and pin the exact location so renters searching near Vijay Nagar or their college find it.",
        "Mention furnishing, parking, electricity billing and house rules; renters compare these first.",
        "Mark the listing as rented once it is let.",
      ] },
    ],
    faq: [
      noBrokerFaq("Indore"),
      { q: "Which Indore areas suit students?", a: "Bhawarkuan and the areas near coaching institutes and DAVV campuses have many PG and room listings." },
      { q: "Where do professionals rent in Indore?", a: "Vijay Nagar and the AB Road corridor are close to offices, malls and the Super Corridor." },
      { q: "What is the rent for a 1 BHK in Indore?", a: "On RentalPins in November 2026 the middle half of 1 BHK asking rents in Indore was about ₹13,500 to ₹17,000 a month." },
      listFreeFaq("Indore"),
    ],
  },

  // ─── Bhopal ────────────────────────────────────────────────────────────────
  "in/bhopal": {
    key: "in/bhopal",
    placeName: "Bhopal",
    intro: [
      "Bhopal's rental market serves government employees, students at its colleges and institutes, and families across New Bhopal, with flats, rooms, PG and independent houses in demand.",
      "The RentalPins Bhopal hub maps owner-direct flats for rent, rooms, PG, houses and office space across MP Nagar, Arera Colony, Kolar Road, Indrapuri and Hoshangabad Road on one live map.",
      "Every listing is pinned to its location, so you can check the distance to your office, college or the lakes area before contacting the owner.",
      "MP Nagar is the commercial centre, Arera Colony and Shahpura suit families, Kolar Road offers newer flats, and Indrapuri and Ayodhya Bypass suit students.",
      "Save a search on the Bhopal hub to get alerts as owners post new flats and rooms.",
      "Before paying a token, agree the deposit, electricity billing and maintenance with the owner.",
    ],
    bestAreas: [
      { name: "MP Nagar", description: "Bhopal's commercial centre, with offices, shops and nearby flats." },
      { name: "Arera Colony & Shahpura", description: "Family flats and independent houses in green, planned colonies." },
      { name: "Kolar Road", description: "Newer flats and townships in south Bhopal at moderate rents." },
      { name: "Indrapuri & Ayodhya Bypass", description: "Rooms and PG for students near engineering colleges." },
      { name: "Hoshangabad Road", description: "Flats and townships along the city's southern corridor." },
    ],
    averageRent: [
      { label: "2 BHK flat", range: "₹10,500 – ₹22,000/mo", note: RENT_NOTE },
    ],
    universities: [
      { name: "MANIT, Barkatullah University and engineering colleges", description: "Drive demand for rooms and PG in Indrapuri, Ayodhya Bypass and nearby areas." },
      { name: "AIIMS Bhopal and government offices", description: "Create steady demand for family flats and rooms across New Bhopal." },
    ],
    transport: [
      "Bhopal Metro has started on its first corridor, and city buses connect most neighbourhoods.",
      "Hoshangabad Road and Kolar Road are the main southern corridors; VIP Road runs along the Upper Lake.",
      "Bhopal Junction and Rani Kamalapati are the main railway stations.",
      "Check the distance to your office or college on the map before visiting.",
    ],
    sections: [
      { title: "Flats for rent in Bhopal: choosing an area", paragraphs: [
        "When searching for a flat for rent in Bhopal, start from where you work or study. MP Nagar suits people working in offices and businesses, Arera Colony and Shahpura suit families, and Kolar Road offers newer flats at moderate rents.",
        "Older parts of the city have independent houses, while Kolar Road and Hoshangabad Road have many newer townships.",
        "Open pins in a few nearby areas on the RentalPins map and compare rent and commute before visiting.",
      ] },
      { title: "Rooms and PG in Bhopal", paragraphs: [
        "Students often rent rooms and PG in Indrapuri, Ayodhya Bypass and near MANIT and engineering colleges.",
        "Ask about meals, sharing, study space and the notice period before booking.",
        "Start searching a few weeks before the session begins, when demand rises.",
      ] },
      { title: "Family flats and houses in Bhopal", paragraphs: [
        "Families often look at Arera Colony, Shahpura, Kolar Road and Hoshangabad Road for flats and independent houses near schools and hospitals.",
        "Ask about water supply, parking, power backup and who maintains the building.",
        "Compare a newer township flat with an independent house in an older colony, depending on space and budget.",
      ] },
      { title: "Office and shop space in Bhopal", paragraphs: [
        "MP Nagar has the largest choice of office and shop listings in Bhopal, followed by New Market and Hoshangabad Road.",
        "Check the frontage, parking and whether electricity and maintenance are included.",
        "Read the lock-in and rent increase terms before signing a commercial lease.",
      ] },
      { title: "Renting near the lakes and New Bhopal", paragraphs: [
        "Areas around the Upper Lake and VIP Road are popular for their views and greenery, with rents varying by locality.",
        "New Bhopal's planned colonies offer wide roads and parks, popular with families and government employees.",
        "Use the map to compare listings by distance to your office and to schools.",
      ] },
      { title: "Deposits and agreements in Bhopal", paragraphs: [
        "Bhopal owners usually ask for a deposit of one to two months' rent; agree the amount and refund terms in writing.",
        "Most agreements run for 11 months; read the notice period before signing.",
        "Photograph the flat at move-in so the deposit refund is straightforward.",
      ] },
      { title: "Renting without a broker in Bhopal", paragraphs: [
        "On RentalPins you contact owners directly from the listing pin and pay no brokerage. Confirm that the person you meet is the owner or authorised by them.",
        "Tell owners your move-in date, budget and whether you are a student, professional or family.",
        "Avoid paying an advance before visiting the flat.",
      ] },
      { title: "For owners in Bhopal", paragraphs: [
        "List your flat, room, PG or office free on RentalPins and pin the exact location so renters searching near MP Nagar or their college find it.",
        "Mention furnishing, parking, electricity billing and house rules; renters compare these first.",
        "Mark the listing as rented once it is let.",
      ] },
    ],
    faq: [
      noBrokerFaq("Bhopal"),
      { q: "Which Bhopal areas suit students?", a: "Indrapuri, Ayodhya Bypass and areas near MANIT and engineering colleges have many rooms and PG." },
      { q: "Where do families rent in Bhopal?", a: "Arera Colony, Shahpura and Kolar Road are popular for flats and independent houses." },
      { q: "What is the rent for a 2 BHK in Bhopal?", a: "On RentalPins in November 2026 the middle half of 2 BHK asking rents in Bhopal was about ₹10,500 to ₹22,000 a month." },
      listFreeFaq("Bhopal"),
    ],
  },
};

// Locality guides, living-cost notes and extra FAQs for the Nov 2026 city guides.
// Merged into NEW_CITY_SEO_CONFIGS by city-seo-config.ts.
import type { CitySeoFaq, CitySeoSection } from "@/lib/seo/city-seo-config";

export const NEW_CITY_SEO_EXTRAS: Record<string, { sections: CitySeoSection[]; faq: CitySeoFaq[] }> = {
  "in/bengaluru": {
    sections: [
      { title: "Bengaluru locality guide", paragraphs: [
        "BTM Layout: one of the densest PG and shared-room areas in the city, between Silk Board and Koramangala. Good for new joiners on Outer Ring Road or Hosur Road who want low rent and many choices within walking distance.",
        "Koramangala: lively blocks with cafés, gyms and startup offices; flats and shared apartments cost more than in BTM but the commute to many offices is short.",
        "HSR Layout: planned sectors with parks and independent floors, popular with couples and families working on Outer Ring Road or Sarjapur Road.",
        "Whitefield: a large IT area around ITPL with gated apartments and PG; the Purple Line metro now connects it to the city centre.",
        "Hebbal: convenient for Manyata Tech Park and the airport road, with apartments around the lake and in Nagawara and RT Nagar.",
      ] },
    ],
    faq: [
      { q: "Is it better to live near Outer Ring Road or near the metro in Bengaluru?", a: "If your office is on Outer Ring Road, living close to it usually saves more time than living near a metro line. For Whitefield, MG Road or the city centre, a home near the Purple or Green Line is often the better choice." },
    ],
  },
  "in/gurugram": {
    sections: [
      { title: "Gurugram locality guide", paragraphs: [
        "Sushant Lok: Phases 1 to 3 have builder floors and low-rise apartments close to MG Road metro, Galleria Market and Cyber City, popular with working professionals.",
        "Golf Course Road and Sector 56: high-rise societies with clubhouses along the Rapid Metro, suited to families and senior professionals.",
        "Sohna Road: gated societies in Sectors 47 to 49 with schools and markets, often at lower rents than Golf Course Road.",
        "Palam Vihar: an established colony of independent floors near the Delhi border, with quick road access to Dwarka and the airport.",
        "Sector 14 and old Gurugram: rooms, PG, floors and shops around Sector 14 Market and Huda City Centre, good for budget renters.",
      ] },
      { title: "Living costs beyond rent in Gurugram", paragraphs: [
        "Society maintenance, power backup charges and parking can add noticeably to the monthly cost of a Gurugram flat, so ask for the total, not just the rent.",
        "Builder floors may bill electricity on a separate meter and charge less maintenance; compare the total monthly cost of both types before deciding.",
        "If you commute to Delhi, factor in metro or toll costs on NH-48 when comparing areas.",
      ] },
    ],
    faq: [
      { q: "Is Gurugram or Noida better for renting?", a: "It depends on where you work. Gurugram suits offices in Cyber City, Golf Course Road and Udyog Vihar; Noida suits offices in Noida sectors and along the expressway. Compare commute first, then rent." },
      { q: "Do Gurugram societies allow bachelors?", a: "Many do, but some societies have rules for bachelor tenants. Ask the owner about society rules before visiting." },
    ],
  },
  "in/hyderabad": {
    sections: [
      { title: "Hyderabad locality guide", paragraphs: [
        "Kondapur: between HITEC City and Gachibowli, with apartments, gated communities and PG at rents often below Madhapur.",
        "Madhapur: at the centre of the IT corridor near Cyber Towers and Durgam Cheruvu, with many PG and flats within a short walk of offices.",
        "Gachibowli and Nanakramguda: close to the Financial District and large IT campuses, with gated communities and newer apartments.",
        "Kukatpally and Miyapur: established residential areas on the Red Line metro, popular for lower rents and easy metro access.",
        "Secunderabad and Ameerpet: central areas with good rail and metro links, suited to people working in the old city or central offices.",
      ] },
      { title: "Living costs beyond rent in Hyderabad", paragraphs: [
        "Gated communities often charge monthly maintenance and sometimes a one-time move-in fee, so ask for the total monthly cost before comparing flats.",
        "Electricity is usually billed separately; ask the owner about average bills, especially for flats with air conditioning.",
        "If you commute by metro, a flat a little further out on the Red or Blue Line can cost less overall than one closer to the IT corridor.",
      ] },
    ],
    faq: [
      { q: "Is Kukatpally a good area to rent in Hyderabad?", a: "Yes, especially if you want lower rent with metro access. The Red Line connects Kukatpally to Ameerpet, where you can change to the Blue Line for HITEC City." },
      { q: "Do Hyderabad gated communities charge move-in fees?", a: "Some do. Ask the owner whether the community charges a move-in fee or a separate maintenance deposit before you pay." },
    ],
  },
  "in/kolkata": {
    sections: [
      { title: "Kolkata locality guide", paragraphs: [
        "Salt Lake (Bidhannagar): planned blocks with flats and independent houses close to Sector V, popular with IT professionals and families.",
        "New Town: newer apartment complexes near the New Town IT hubs, Eco Park and the airport, with wide roads and shopping.",
        "Garia and Jadavpur: student-friendly areas with rooms, PG and budget flats near colleges and the Blue Line metro.",
        "Park Street and Ballygunge: central and well-established, with premium flats close to offices, schools and markets.",
        "Behala and Tollygunge: large residential areas in the south and south-west with family flats and independent houses.",
      ] },
      { title: "Living costs beyond rent in Kolkata", paragraphs: [
        "Older buildings may not have power backup or lifts, while newer complexes usually include them in maintenance; ask what is included before comparing rents.",
        "Electricity is often billed separately by meter; ask the owner how it is calculated for your flat or room.",
        "Kolkata's metro and bus network is affordable, so a flat a little further from the centre but near a station can keep total costs down.",
      ] },
    ],
    faq: [
      { q: "Is New Town good for renting in Kolkata?", a: "Yes, especially if you work in New Town or Sector V. It has many newer apartment complexes, often at competitive rents because of the large supply." },
      { q: "Can students find rooms near Jadavpur University?", a: "Yes. Jadavpur, Garia and Tollygunge have many rooms and PG near the university and the Blue Line metro. Filter rooms on the Kolkata map to compare them." },
    ],
  },
  "in/ghaziabad": {
    sections: [
      { title: "Ghaziabad locality guide", paragraphs: [
        "Indirapuram: a large area of societies and builder floors next to East Delhi and Noida, popular with families and professionals.",
        "Vaishali and Kaushambi: close to the Blue Line metro and Anand Vihar, with flats and rooms for people who commute to Delhi.",
        "Raj Nagar Extension: newer gated societies at rents usually below areas next to Delhi, with improving road access.",
        "Crossings Republik: a township along NH-24 with flats close to Noida and colleges on the highway.",
        "Vasundhara: a planned area between Indirapuram and Vaishali with family flats and builder floors.",
      ] },
      { title: "Living costs beyond rent in Ghaziabad", paragraphs: [
        "Society maintenance and power backup charges vary between societies, so ask for the total monthly cost, not just the rent.",
        "Newer areas such as Raj Nagar Extension may have lower rents but longer commutes; compare the cost and time of travel to work.",
        "If you commute to Delhi or Noida every day, living near a metro or Namo Bharat station can save both time and money.",
      ] },
      { title: "Commuting from Ghaziabad to Delhi and Noida", paragraphs: [
        "Vaishali and Kaushambi on the Blue Line give a direct metro ride into central Delhi, while Indirapuram is a short drive to Noida sectors.",
        "The Namo Bharat RRTS line has made trips between Ghaziabad and Delhi faster for people living near its stations.",
        "Use the RentalPins map to check how far a listing is from the nearest station before you visit.",
      ] },
    ],
    faq: [
      { q: "Is Indirapuram good for renting?", a: "Yes. It is close to East Delhi and Noida, with many societies and builder floors and plenty of shops and schools nearby." },
      { q: "Is renting in Ghaziabad cheaper than in Noida or Delhi?", a: "Often, especially in newer areas such as Raj Nagar Extension and Crossings Republik. Compare total monthly cost, including commute, before deciding." },
    ],
  },
  "in/pune": {
    sections: [
      { title: "Pune locality guide", paragraphs: [
        "Hinjewadi: home to the Rajiv Gandhi Infotech Park, with flats and PG in Phases 1 to 3 and nearby Maan and Marunji.",
        "Wakad and Baner: well-developed areas close to Hinjewadi and the highway, with societies, restaurants and shopping.",
        "Kharadi and Viman Nagar: east Pune areas near EON IT Park, the World Trade Center and the airport, popular with young professionals.",
        "Kothrud and Deccan: established central-west areas near colleges, with rooms, PG and family flats.",
        "Hadapsar and Magarpatta: south-east areas near Magarpatta City and other IT parks, with townships and societies.",
      ] },
      { title: "Living costs beyond rent in Pune", paragraphs: [
        "Society maintenance is often charged separately from rent; ask whether the quoted rent includes it.",
        "Registered rent agreements in Maharashtra involve stamp duty and registration charges; agree with the owner who pays them.",
        "Living close to your IT park can save on daily travel, especially in Hinjewadi where traffic is heavy at peak hours.",
      ] },
      { title: "Moving to Pune for work or study", paragraphs: [
        "If you are moving for a job in Hinjewadi, many people rent a PG or shared flat first and move to a flat once they know the area.",
        "Students should look near their college, as commuting across Pune at peak hours can take a long time.",
        "Save a search on the Pune hub before you arrive, so you can shortlist listings and plan visits for your first weekend.",
      ] },
    ],
    faq: [
      { q: "Is Wakad or Hinjewadi better for renting?", a: "Hinjewadi is closest to the IT park, while Wakad has more shops, restaurants and established societies a short drive away. Compare commute and rent for both." },
      { q: "Who pays for registering a rent agreement in Pune?", a: "It varies; owners and tenants often share it or one side pays. Agree this with the owner before signing." },
    ],
  },
  "in/patna": {
    sections: [
      { title: "Patna locality guide", paragraphs: [
        "Bailey Road: west Patna's main road with flats, rooms and offices, and easy access to Danapur and hospitals in the area.",
        "Patliputra Colony: a planned, quieter colony with independent houses and flats, close to Boring Road and Pataliputra Junction.",
        "Boring Road: a busy street of coaching centres and shops, with rooms and PG for students in the side lanes.",
        "Kankarbagh: one of Patna's largest residential areas, with rooms, PG and flats popular with students.",
        "Rajendra Nagar: close to coaching centres and Patna Junction, with student rooms and family flats.",
      ] },
      { title: "Living costs beyond rent in Patna", paragraphs: [
        "Electricity is usually billed separately by meter, and power backup may be extra; ask the owner how both are charged.",
        "Some rooms and PG include meals; compare the total monthly cost of a PG with meals against a room where you cook or eat out.",
        "Living close to your coaching centre or college saves daily travel time and cost.",
      ] },
      { title: "Tips for students renting in Patna", paragraphs: [
        "Visit the room before paying and check light, ventilation, study space and drinking water.",
        "Ask about house rules such as visiting hours and curfew, and whether guests are allowed.",
        "Rooms near coaching centres fill quickly before new batches; save a search on the Patna hub to see new listings early.",
      ] },
    ],
    faq: [
      { q: "Is Kankarbagh good for students?", a: "Yes. It has many rooms and PG close to coaching centres in Rajendra Nagar and the Ashok Rajpath area." },
      { q: "Is Bailey Road good for families?", a: "Yes. It has flats and houses near offices, schools and hospitals in west Patna, with good road access." },
    ],
  },
  "in/indore": {
    sections: [
      { title: "Indore locality guide", paragraphs: [
        "Vijay Nagar: Indore's busiest commercial area on AB Road, with flats, PG, offices and malls, popular with professionals.",
        "Palasia: central Indore around New Palasia and 56 Dukan, with flats, shops and offices close to markets.",
        "Bhawarkuan: a student area near coaching institutes and colleges, with many rooms and PG.",
        "Super Corridor: newer apartments near the IT parks and the airport road, with facilities still developing.",
        "Rau: on the southern edge of the city, with budget flats and rooms near colleges on that side.",
      ] },
      { title: "Living costs beyond rent in Indore", paragraphs: [
        "Electricity is usually billed separately; ask the owner about average bills before moving in.",
        "Some PG include meals; compare the total monthly cost of PG with meals against a room or shared flat.",
        "Living near your college or office along AB Road can save daily travel time.",
      ] },
      { title: "Tips for students renting in Indore", paragraphs: [
        "Visit the room before paying and check study space, ventilation and drinking water.",
        "Ask about house rules, visiting hours and the notice period before booking a PG.",
        "Rooms near coaching institutes fill quickly before new batches; save a search on the Indore hub to see new listings early.",
      ] },
    ],
    faq: [
      { q: "Is Vijay Nagar good for renting in Indore?", a: "Yes. It is close to offices, malls and AB Road, with many flats and PG, though rents are higher than in some other areas." },
      { q: "Where can I find PG in Indore?", a: "Bhawarkuan, Vijay Nagar and areas near coaching institutes have many PG listings. Filter PG on the Indore map to compare them." },
    ],
  },
  "in/bhopal": {
    sections: [
      { title: "Bhopal locality guide", paragraphs: [
        "MP Nagar: Bhopal's commercial centre with offices, coaching centres and shops, and flats in the surrounding zones.",
        "Arera Colony: a green, planned area with independent houses and flats, popular with families and senior professionals.",
        "Shahpura: residential colonies near Shahpura Lake with family flats and houses.",
        "Kolar Road: newer townships and apartments in south Bhopal, often at moderate rents.",
        "Indrapuri and Ayodhya Bypass: student areas near engineering colleges with many rooms and PG.",
      ] },
      { title: "Living costs beyond rent in Bhopal", paragraphs: [
        "Electricity is usually billed separately; ask the owner about average bills before moving in.",
        "Newer townships may charge maintenance; ask whether it is included in the quoted rent.",
        "Living near your office or college saves daily travel time and cost.",
      ] },
      { title: "Tips for students renting in Bhopal", paragraphs: [
        "Visit the room before paying and check light, ventilation, study space and drinking water.",
        "Ask about house rules, visiting hours and the notice period before booking a PG.",
        "Rooms near colleges fill quickly before new sessions; save a search on the Bhopal hub to see new listings early.",
      ] },
    ],
    faq: [
      { q: "Is Kolar Road good for renting in Bhopal?", a: "Yes, especially for families who want newer flats at moderate rents. Check the commute to your office before deciding." },
      { q: "Is Arera Colony expensive?", a: "It is one of Bhopal's more established areas, so rents can be higher than in newer parts of the city. Compare listings on the Bhopal map." },
    ],
  },
};

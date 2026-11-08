// Long-form locality content for the Nov 2026 city pages (rendered on /rentals/in/{city}/{area}).
// Keyed "city/area" like FOCUSED_LONGFORM_OVERRIDES in app/rentals-shared/AreaClient.tsx.

export interface AreaLongFormSection {
  title: string;
  paragraphs: string[];
}

export const NEW_CITY_AREA_LONGFORM: Record<string, AreaLongFormSection[]> = {
  // ─── Bengaluru ───────────────────────────────────────────────────────────
  "bengaluru/btm-layout": [
    { title: "PG and rooms for rent in BTM Layout", paragraphs: [
      "BTM Layout is one of Bengaluru's busiest areas for PG, shared rooms and 1 BHK flats, close to Silk Board, Madiwala and Koramangala.",
      "New joiners working on Outer Ring Road, Hosur Road or in Koramangala often start in a BTM Layout PG because of the large choice within walking distance.",
      "Filter PG on the map to compare sharing, meals and rent across BTM 1st and 2nd Stage before visiting.",
    ] },
    { title: "Flats in BTM Layout", paragraphs: [
      "1 BHK and 2 BHK flats in BTM Layout suit couples and small families who want to stay close to Koramangala and HSR Layout without paying their rents.",
      "Independent buildings are common, so ask about water supply, parking and power backup.",
      "Compare BTM flats with options in nearby JP Nagar and Bommanahalli if you need more space.",
    ] },
    { title: "Living in BTM Layout", paragraphs: [
      "BTM Layout has plenty of eateries, gyms and grocery stores, and Silk Board junction connects it to Outer Ring Road and Hosur Road.",
      "Traffic around Silk Board is heavy at peak hours, so check the drive to your office at your real commute time.",
      "Owners and PG operators in BTM Layout can list free on RentalPins and reach renters directly.",
    ] },
  ],
  "bengaluru/whitefield": [
    { title: "Flats for rent in Whitefield", paragraphs: [
      "Whitefield is east Bengaluru's IT hub around ITPL, with gated apartments, independent floors and PG for people working in the tech parks.",
      "Hoodi, Brookefield and the ITPL Main Road area are closest to most offices; Kadugodi and Varthur offer more space at lower rents.",
      "Compare 2 BHK and 3 BHK flats on the map by distance to your building.",
    ] },
    { title: "PG near ITPL", paragraphs: [
      "PG and co-living near ITPL suit new joiners who want meals and housekeeping included.",
      "Ask about sharing, food, notice period and transport to the tech park before booking.",
      "Filter PG on the Whitefield map to compare options within walking distance of your office.",
    ] },
    { title: "Getting around from Whitefield", paragraphs: [
      "The Purple Line metro connects Whitefield (Kadugodi) to the city centre, which helps if you travel into central Bengaluru.",
      "Whitefield Main Road and the ITPL road get busy at office hours, so living close to your office saves the most time.",
      "Owners in Whitefield can list free on RentalPins and reach renters working in the tech parks.",
    ] },
  ],
  "bengaluru/koramangala": [
    { title: "Flats for rent in Koramangala", paragraphs: [
      "Koramangala is Bengaluru's startup hub, with flats, shared apartments and PG spread across Blocks 1 to 8.",
      "Rents are higher than in nearby BTM Layout, but many people choose Koramangala for its short commute and lively neighbourhood.",
      "Compare listings by block on the map, since each block has a different feel and price level.",
    ] },
    { title: "Shared flats and PG in Koramangala", paragraphs: [
      "Shared 2 BHK and 3 BHK flats are popular with groups of colleagues who want a kitchen and more privacy than a PG.",
      "PG in Koramangala usually include meals, Wi-Fi and cleaning; ask about sharing and notice period.",
      "Filter PG and shared flats on the map to compare them side by side.",
    ] },
    { title: "Living in Koramangala", paragraphs: [
      "Koramangala has cafés, restaurants, gyms and the Forum mall area, and is close to Outer Ring Road, Hosur Road and Indiranagar.",
      "Parking can be limited in some blocks, so ask the owner about parking before visiting.",
      "Owners can list flats and PG in Koramangala free on RentalPins.",
    ] },
  ],
  "bengaluru/hebbal": [
    { title: "Flats for rent in Hebbal", paragraphs: [
      "Hebbal is the natural choice for people working at Manyata Tech Park or travelling often to the airport.",
      "Apartments around Hebbal Lake, Nagawara and RT Nagar offer a range of 1 BHK to 3 BHK flats.",
      "Compare listings on the map by distance to Manyata Tech Park and the airport road.",
    ] },
    { title: "PG near Manyata Tech Park", paragraphs: [
      "PG in Hebbal and Nagawara suit new joiners at Manyata Tech Park who want meals and housekeeping included.",
      "Ask about sharing, food and transport to the tech park before booking.",
      "Filter PG on the Hebbal map to compare options.",
    ] },
    { title: "Living in Hebbal", paragraphs: [
      "Hebbal sits on the airport road and Outer Ring Road, with good road links to north and central Bengaluru.",
      "The Hebbal flyover junction gets busy at peak hours, so check your commute at your real office time.",
      "Owners in Hebbal can list free on RentalPins and reach renters working in north Bengaluru.",
    ] },
  ],
  "bengaluru/hsr-layout": [
    { title: "Flats for rent in HSR Layout", paragraphs: [
      "HSR Layout's planned sectors have apartments, independent floors and PG close to Outer Ring Road and Koramangala.",
      "Sectors 1 to 7 differ in rent and feel; Sector 2 and Sector 1 are close to Outer Ring Road, while the inner sectors are quieter.",
      "Compare listings by sector on the map before visiting.",
    ] },
    { title: "Family homes in HSR Layout", paragraphs: [
      "Families often choose HSR Layout for its parks, schools and independent floors, which give more space than many apartments.",
      "Ask about parking, water supply and power backup, especially in independent buildings.",
      "Compare a 2 BHK floor in HSR with apartments in nearby Bellandur or Sarjapur Road.",
    ] },
    { title: "Living in HSR Layout", paragraphs: [
      "HSR Layout has restaurants, gyms and shops, and is close to Agara Lake and Outer Ring Road.",
      "Traffic towards Silk Board and Outer Ring Road peaks at office hours, so check your route before signing.",
      "Owners can list flats and floors in HSR Layout free on RentalPins.",
    ] },
  ],

  // ─── Gurugram ────────────────────────────────────────────────────────────
  "gurugram/sushant-lok": [
    { title: "Flats and builder floors in Sushant Lok", paragraphs: [
      "Sushant Lok Phases 1 to 3 have builder floors and low-rise apartments close to MG Road, Galleria Market and Cyber City.",
      "It is popular with professionals who want a short commute to Cyber City and easy access to the Yellow Line metro.",
      "Compare floors and flats on the map by phase and distance to MG Road metro.",
    ] },
    { title: "PG and rooms in Sushant Lok", paragraphs: [
      "PG and rooms in Sushant Lok suit new joiners working in Cyber City and on Golf Course Road.",
      "Ask about meals, AC, sharing and notice period before booking.",
      "Filter PG and rooms on the map to compare options.",
    ] },
    { title: "Living in Sushant Lok", paragraphs: [
      "Galleria Market and the MG Road malls are close by, along with schools and hospitals.",
      "Parking can be limited on some streets, so ask the owner about parking for builder floors.",
      "Owners can list flats and floors in Sushant Lok free on RentalPins.",
    ] },
  ],
  "gurugram/golf-course-road": [
    { title: "Apartments on Golf Course Road", paragraphs: [
      "Golf Course Road has high-rise societies with clubhouses, pools and security, popular with families and senior professionals.",
      "The Rapid Metro runs along the road, linking it to Cyber City and the Yellow Line.",
      "Compare 3 BHK and 4 BHK apartments on the map by society and distance to the metro.",
    ] },
    { title: "Office space on Golf Course Road", paragraphs: [
      "Golf Course Road has office space for companies and professionals who want a prominent Gurugram address.",
      "Check the carpet area, parking and maintenance before shortlisting.",
      "Commercial leases are longer than residential ones, so read the lock-in clause carefully.",
    ] },
    { title: "Living on Golf Course Road", paragraphs: [
      "Societies on Golf Course Road usually charge maintenance for amenities, so ask for the total monthly cost.",
      "The road connects to Sohna Road and Golf Course Extension in the south and Cyber City in the north.",
      "Owners can list apartments and offices on Golf Course Road free on RentalPins.",
    ] },
  ],
  "gurugram/sohna-road": [
    { title: "Society flats on Sohna Road", paragraphs: [
      "Sohna Road has gated societies in Sectors 47 to 49 with schools, markets and hospitals nearby.",
      "Rents are often lower than on Golf Course Road for similar flats, which makes it popular with families.",
      "Compare 2 BHK and 3 BHK flats on the map by society and sector.",
    ] },
    { title: "Builder floors and rooms near Sohna Road", paragraphs: [
      "Builder floors and rooms are also available in the sectors around Sohna Road and Badshahpur.",
      "Ask about parking, power backup and water supply before visiting.",
      "Filter flats and rooms on the map to compare options.",
    ] },
    { title: "Commuting from Sohna Road", paragraphs: [
      "Sohna Road connects to Subhash Chowk, Golf Course Extension and NH-48.",
      "Traffic builds up at office hours, so check your route to work before signing.",
      "Owners can list flats on Sohna Road free on RentalPins.",
    ] },
  ],
  "gurugram/palam-vihar": [
    { title: "Independent floors in Palam Vihar", paragraphs: [
      "Palam Vihar is an established colony of independent floors and houses near the Delhi border.",
      "It suits families who want more space and quick road access to Dwarka, the airport and Dwarka Expressway.",
      "Compare floors on the map by block and distance to main roads.",
    ] },
    { title: "Rooms and flats in Palam Vihar", paragraphs: [
      "Rooms and smaller flats suit working professionals and couples.",
      "Ask about parking, water supply and whether electricity has a separate meter.",
      "Filter rooms and flats on the map to compare options.",
    ] },
    { title: "Living in Palam Vihar", paragraphs: [
      "Palam Vihar has markets, schools and parks, and is close to Dwarka and the new sectors along Dwarka Expressway.",
      "Check the commute to Cyber City or Udyog Vihar at peak hours before deciding.",
      "Owners can list floors in Palam Vihar free on RentalPins.",
    ] },
  ],
  "gurugram/sector-14-gurugram": [
    { title: "Rooms and PG in Sector 14, Gurugram", paragraphs: [
      "Sector 14 and the surrounding old Gurugram sectors have rooms, PG and independent floors at lower rents than the newer parts of the city.",
      "They suit students and budget renters who want to stay close to markets and the Huda City Centre metro.",
      "Filter rooms and PG on the map to compare options.",
    ] },
    { title: "Shops near Sector 14 Market", paragraphs: [
      "Sector 14 Market is one of Gurugram's busiest older markets, with shops for retail and services.",
      "Check frontage, parking and rent terms before shortlisting.",
      "Read the lock-in and rent increase terms before signing a commercial lease.",
    ] },
    { title: "Living in Sector 14", paragraphs: [
      "Old Gurugram has markets, schools and hospitals close by, and good road links to NH-48.",
      "Streets can be busy, so ask about parking before visiting.",
      "Owners can list rooms, floors and shops in Sector 14 free on RentalPins.",
    ] },
  ],
  "gurugram/sector-56-gurugram": [
    { title: "Society flats in Sector 56, Gurugram", paragraphs: [
      "Sector 56 has society flats near Golf Course Extension Road and the Sector 55–56 Rapid Metro station.",
      "It suits families and professionals working on Golf Course Road and in the southern sectors.",
      "Compare flats on the map by society and distance to the metro.",
    ] },
    { title: "PG near Sector 55–56 metro", paragraphs: [
      "PG near the metro station suit new joiners working along Golf Course Road.",
      "Ask about meals, sharing and notice period before booking.",
      "Filter PG on the map to compare options.",
    ] },
    { title: "Living in Sector 56", paragraphs: [
      "Sector 56 has markets and schools, and Golf Course Road is a short ride away.",
      "Societies usually charge maintenance, so ask for the total monthly cost.",
      "Owners can list flats in Sector 56 free on RentalPins.",
    ] },
  ],

  // ─── Hyderabad ───────────────────────────────────────────────────────────
  "hyderabad/kondapur": [
    { title: "Flats for rent in Kondapur", paragraphs: [
      "Kondapur sits between HITEC City and Gachibowli, with apartments, gated communities and independent houses.",
      "Rents are often a little lower than in Madhapur for similar flats, which makes it popular with IT professionals.",
      "Compare 2 BHK and 3 BHK flats on the map by distance to your office.",
    ] },
    { title: "PG in Kondapur", paragraphs: [
      "PG in Kondapur suit new joiners at HITEC City and Gachibowli who want meals included.",
      "Ask about sharing, food, gender policy and notice period before booking.",
      "Filter PG on the Kondapur map to compare options.",
    ] },
    { title: "Living in Kondapur", paragraphs: [
      "Kondapur has markets, hospitals and schools, and is close to the Botanical Garden and Kothaguda.",
      "Traffic towards HITEC City peaks at office hours, so check your commute before signing.",
      "Owners can list flats and PG in Kondapur free on RentalPins.",
    ] },
  ],
  "hyderabad/madhapur": [
    { title: "PG and flats in Madhapur", paragraphs: [
      "Madhapur is at the heart of HITEC City, with PG, studio flats and apartments within walking distance of many offices.",
      "It is the first choice for many new joiners, though rents are higher than in nearby Kondapur.",
      "Filter PG and flats on the map to compare options near your office.",
    ] },
    { title: "Office space in Madhapur", paragraphs: [
      "Madhapur has office and co-working space for startups and teams working near HITEC City.",
      "Check the carpet area, parking and maintenance before shortlisting.",
      "Read the lock-in clause carefully before signing a commercial lease.",
    ] },
    { title: "Living in Madhapur", paragraphs: [
      "Madhapur has restaurants, cafés and Durgam Cheruvu lake, and is served by the HITEC City and Durgam Cheruvu metro stations.",
      "Traffic is heavy at office hours, so living within walking distance of your office saves the most time.",
      "Owners can list flats and PG in Madhapur free on RentalPins.",
    ] },
  ],

  // ─── Kolkata ─────────────────────────────────────────────────────────────
  "kolkata/salt-lake": [
    { title: "Flats for rent in Salt Lake", paragraphs: [
      "Salt Lake (Bidhannagar) has flats and independent houses in planned blocks close to Sector V.",
      "It is popular with IT professionals and families who want a short commute and established markets.",
      "Compare listings on the map by sector and distance to Sector V.",
    ] },
    { title: "PG and office space in Salt Lake", paragraphs: [
      "PG in Salt Lake suit new joiners in Sector V; ask about meals, sharing and notice period.",
      "Sector V has office space for IT and services companies; check carpet area and maintenance.",
      "Filter PG and offices on the map to compare options.",
    ] },
    { title: "Living in Salt Lake", paragraphs: [
      "Salt Lake has City Centre mall, markets and parks, and the East–West Metro connects Sector V to central Kolkata.",
      "Check the commute at peak hours if you work outside Sector V.",
      "Owners can list flats and PG in Salt Lake free on RentalPins.",
    ] },
  ],

  // ─── Pune ────────────────────────────────────────────────────────────────
  "pune/hinjewadi": [
    { title: "Flats for rent in Hinjewadi", paragraphs: [
      "Hinjewadi is home to the Rajiv Gandhi Infotech Park, with societies and apartments across Phases 1 to 3 and nearby Maan and Marunji.",
      "Phase 1 and the Wakad side are closest to most offices and shops; Phases 2 and 3 suit people working further inside the park.",
      "Compare flats on the map by distance to your building.",
    ] },
    { title: "PG in Hinjewadi", paragraphs: [
      "PG and shared flats suit new joiners at the IT park who want meals and housekeeping included.",
      "Ask about sharing, food, transport to the park and notice period before booking.",
      "Filter PG on the Hinjewadi map to compare options.",
    ] },
    { title: "Living in Hinjewadi", paragraphs: [
      "Hinjewadi traffic is heavy at office hours, so living close to your phase saves the most time.",
      "A metro line to Hinjewadi is under construction, which should improve connections to the rest of Pune.",
      "Owners can list flats and PG in Hinjewadi free on RentalPins.",
    ] },
  ],

  // ─── Patna ───────────────────────────────────────────────────────────────
  "patna/bailey-road": [
    { title: "Flats for rent on Bailey Road", paragraphs: [
      "Bailey Road runs across west Patna towards Danapur, with flats, rooms and offices along the road and in side lanes.",
      "It suits families and professionals working in offices and hospitals in west Patna.",
      "Compare flats on the map by distance to your office or school.",
    ] },
    { title: "Offices and shops on Bailey Road", paragraphs: [
      "Bailey Road has office and shop space for clinics, coaching centres and businesses.",
      "Check frontage, parking and whether electricity is billed separately.",
      "Read the lock-in and rent increase terms before signing a commercial lease.",
    ] },
    { title: "Living near Bailey Road", paragraphs: [
      "Shastri Nagar and Raja Bazar nearby have markets, schools and hospitals.",
      "Traffic can be heavy at peak hours, so check your route before deciding.",
      "Owners can list flats and offices on Bailey Road free on RentalPins.",
    ] },
  ],
  "patna/patliputra": [
    { title: "Flats and houses in Patliputra Colony", paragraphs: [
      "Patliputra Colony is a planned, quieter residential area with independent houses and flats.",
      "It suits families who want space and calm while staying close to Boring Road and Pataliputra Junction.",
      "Compare listings on the map by lane and distance to main roads.",
    ] },
    { title: "Rooms in Patliputra", paragraphs: [
      "Rooms in family houses suit working professionals and students who want a quieter place.",
      "Ask about house rules, electricity billing and water supply.",
      "Filter rooms on the map to compare options.",
    ] },
    { title: "Living in Patliputra", paragraphs: [
      "Patliputra has markets and schools, and Boring Road is a short ride away.",
      "Pataliputra Junction is close by for train travel.",
      "Owners can list houses and flats in Patliputra free on RentalPins.",
    ] },
  ],
  "patna/kankarbagh": [
    { title: "Rooms and PG in Kankarbagh", paragraphs: [
      "Kankarbagh is one of Patna's largest residential areas, with many rooms and PG for students.",
      "It is close to coaching centres in Rajendra Nagar and the Ashok Rajpath area.",
      "Filter rooms and PG on the map to compare options near your coaching centre.",
    ] },
    { title: "Flats in Kankarbagh", paragraphs: [
      "Flats in Kankarbagh suit families and students sharing a home.",
      "Ask about water supply, power backup and parking before visiting.",
      "Compare flats in Kankarbagh with nearby Lohia Nagar and Patrakar Nagar.",
    ] },
    { title: "Living in Kankarbagh", paragraphs: [
      "Kankarbagh has markets, hospitals and schools, and good road links to the rest of Patna.",
      "Some lanes get waterlogged in heavy rain, so ask the owner about this when you visit during the monsoon.",
      "Owners can list rooms and flats in Kankarbagh free on RentalPins.",
    ] },
  ],
  "patna/boring-road": [
    { title: "Rooms and PG on Boring Road", paragraphs: [
      "Boring Road is Patna's busy coaching and shopping street, with rooms and PG for students in the side lanes.",
      "Students can walk to many coaching centres, which saves time during exam preparation.",
      "Filter rooms and PG on the map to compare options.",
    ] },
    { title: "Shops on Boring Road", paragraphs: [
      "Boring Road has shops for retail, food and services, with heavy footfall from students and shoppers.",
      "Check frontage, parking and rent terms before shortlisting.",
      "Read the lock-in clause carefully before signing a commercial lease.",
    ] },
    { title: "Living near Boring Road", paragraphs: [
      "SK Puri and Boring Canal Road nearby have flats in quieter lanes.",
      "The main road is busy and noisy, so look one or two lanes back if you want quiet.",
      "Owners can list rooms, flats and shops on Boring Road free on RentalPins.",
    ] },
  ],

  // ─── Indore ──────────────────────────────────────────────────────────────
  "indore/vijay-nagar-indore": [
    { title: "Flats for rent in Vijay Nagar", paragraphs: [
      "Vijay Nagar is Indore's busiest commercial area on AB Road, with flats in Scheme 54, Scheme 78 and nearby schemes.",
      "It suits professionals who want to be near offices, malls and the Super Corridor.",
      "Compare flats on the map by scheme and distance to AB Road.",
    ] },
    { title: "PG and offices in Vijay Nagar", paragraphs: [
      "PG in Vijay Nagar suit students and young professionals; ask about meals, sharing and notice period.",
      "Vijay Nagar has office space for startups, clinics and businesses; check parking and maintenance.",
      "Filter PG and offices on the map to compare options.",
    ] },
    { title: "Living in Vijay Nagar", paragraphs: [
      "Vijay Nagar has malls, restaurants and markets, and the BRTS corridor runs along AB Road.",
      "Rents are higher than in some other areas, so compare with nearby schemes before deciding.",
      "Owners can list flats, PG and offices in Vijay Nagar free on RentalPins.",
    ] },
  ],
  "indore/palasia": [
    { title: "Flats for rent in Palasia", paragraphs: [
      "Palasia is central Indore, with flats in residential lanes around New Palasia and Old Palasia.",
      "It suits families and professionals who want to be close to markets, hospitals and schools.",
      "Compare flats on the map by lane and distance to main roads.",
    ] },
    { title: "Shops and offices in Palasia", paragraphs: [
      "New Palasia and 56 Dukan have shops and offices with heavy footfall.",
      "Check frontage, parking and rent terms before shortlisting.",
      "Read the lock-in clause carefully before signing a commercial lease.",
    ] },
    { title: "Living in Palasia", paragraphs: [
      "Palasia is close to Geeta Bhawan, Saket Nagar and AB Road, with good connections across Indore.",
      "Main roads get busy in the evening, so quieter lanes suit families better.",
      "Owners can list flats and shops in Palasia free on RentalPins.",
    ] },
  ],
};

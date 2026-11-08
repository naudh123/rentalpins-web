// Area comparisons and extra FAQs for the Nov 2026 city guides (merged in city-seo-config.ts).
import type { CitySeoFaq, CitySeoSection } from "@/lib/seo/city-seo-config";

export const NEW_CITY_SEO_COMPARE: Record<string, { sections: CitySeoSection[]; faq: CitySeoFaq[] }> = {
  "in/gurugram": {
    sections: [],
    faq: [
      { q: "Is Sohna Road or Golf Course Road better for families in Gurugram?", a: "Golf Course Road has more high-rise societies with clubhouses and the Rapid Metro, while Sohna Road usually offers larger flats for the same rent. Compare both on the Gurugram map by commute and total monthly cost." },
    ],
  },
  "in/hyderabad": {
    sections: [
      { title: "Choosing between Kondapur, Madhapur and Gachibowli", paragraphs: [
        "Madhapur is closest to HITEC City offices and has the most PG and studio options, but rents and traffic are higher than in nearby areas.",
        "Kondapur sits between HITEC City and Gachibowli, so it suits people whose office may move between the two, and its rents are often a little lower.",
        "Gachibowli and Nanakramguda are the natural choice for the Financial District, with larger gated communities and newer apartments.",
        "If metro access matters more than distance, compare these areas with Kukatpally, where the Red Line gives a predictable commute to Ameerpet and onward to HITEC City.",
      ] },
    ],
    faq: [
      { q: "Which is cheaper, Kondapur or Madhapur?", a: "Kondapur is often a little cheaper than Madhapur for similar flats, though prices vary by community. Compare listings in both on the Hyderabad map." },
      { q: "Are there PG options for women near HITEC City?", a: "Yes. Many PG in Madhapur and Kondapur are women-only or have separate floors. Filter PG on the Hyderabad map and check the gender policy on each listing before contacting the operator." },
      { q: "How early should I search for a flat in Hyderabad?", a: "Start two to four weeks before your move-in date, and earlier around joining seasons. Save a search on the Hyderabad hub to see new listings as owners post them." },
    ],
  },
  "in/kolkata": {
    sections: [
      { title: "Choosing between Salt Lake, New Town and South Kolkata", paragraphs: [
        "Salt Lake is the most convenient choice for Sector V, with established blocks, markets and the East–West Metro nearby.",
        "New Town offers newer apartment complexes and wider roads, suited to people working in the New Town IT hubs or travelling often to the airport.",
        "South Kolkata areas such as Garia, Jadavpur, Tollygunge and Behala suit students and families who want older, well-connected neighbourhoods with the Blue Line metro.",
        "If you work in Sector V but prefer South Kolkata, check the EM Bypass commute at peak hours before choosing.",
      ] },
    ],
    faq: [
      { q: "Is Salt Lake or New Town better for IT professionals in Kolkata?", a: "Salt Lake is closest to Sector V, while New Town suits the New Town IT hubs and has newer apartments. Choose based on where your office is." },
      { q: "Are rooms in Kolkata usually furnished?", a: "It varies. Many PG and rooms come with a bed, cupboard and fan, while flats are more often unfurnished or semi-furnished. Check the furnishing details on each listing before visiting." },
      { q: "How early should I search before a college session in Kolkata?", a: "Start three to four weeks before the session, when owners in Jadavpur, Garia and Salt Lake post new rooms. Save a search on the Kolkata hub to get alerts." },
    ],
  },
  "in/ghaziabad": {
    sections: [
      { title: "Choosing between Indirapuram, Raj Nagar Extension and Crossings Republik", paragraphs: [
        "Indirapuram is the most established of the three, close to East Delhi and Noida with mature markets, schools and hospitals.",
        "Raj Nagar Extension has many newer societies at lower rents, suited to families who can manage a longer commute.",
        "Crossings Republik is a self-contained township on NH-24, convenient for people working in Noida or studying at colleges on the highway.",
        "Compare the three on the Ghaziabad map by rent, society amenities and commute time to your workplace.",
      ] },
    ],
    faq: [
      { q: "Is Raj Nagar Extension good for working in Delhi?", a: "It offers lower rents and newer societies, but the commute to Delhi is longer than from Indirapuram or Vaishali. Check the route at peak hours before deciding." },
      { q: "Do Ghaziabad societies require police verification for tenants?", a: "Many do. Keep ID proof and passport photos ready, and ask the owner which documents the society needs before you move in." },
      { q: "Are builder floors available in Indirapuram?", a: "Yes. Indirapuram and Vasundhara have builder floors alongside society flats. Filter flats and houses on the Ghaziabad map to compare both." },
      { q: "How early should I search for a flat in Ghaziabad?", a: "Start two to four weeks before your move-in date. Save a search on the Ghaziabad hub to see new society flats and builder floors as owners post them." },
    ],
  },
  "in/pune": {
    sections: [
      { title: "Choosing between Hinjewadi, Wakad and Baner", paragraphs: [
        "Hinjewadi puts you closest to the IT park, which saves the most time on weekdays, but has fewer shops and restaurants than older areas.",
        "Wakad is a short drive from Hinjewadi with more established societies, markets and schools, making it popular with families.",
        "Baner is further but has a lively mix of restaurants, offices and societies, suited to people who value amenities over the shortest commute.",
        "For east Pune jobs, compare Kharadi, Viman Nagar and Wagholi in the same way: Kharadi for proximity, Viman Nagar for amenities, Wagholi for lower rents.",
      ] },
    ],
    faq: [
      { q: "Is Baner good for renting in Pune?", a: "Yes, especially if you want restaurants, shopping and established societies, with a reasonable commute to Hinjewadi and the university area." },
      { q: "Is Kharadi or Viman Nagar better for EON IT Park?", a: "Kharadi is closest to EON IT Park, while Viman Nagar has more established shops and restaurants and is near the airport. Compare both on the Pune map." },
      { q: "Are flats in Hinjewadi usually furnished?", a: "Many are semi-furnished with wardrobes and kitchen fittings, while fully furnished flats and PG are common for new joiners. Check the furnishing details on each listing." },
      { q: "Do Pune societies allow bachelors?", a: "Many do, but some societies have rules for bachelor tenants. Ask the owner about society rules before visiting." },
      { q: "How early should I search for a flat in Pune?", a: "Start two to four weeks before your move-in date, and earlier around joining seasons. Save a search on the Pune hub to see new listings as owners post them." },
      { q: "Is Kothrud good for families in Pune?", a: "Yes. Kothrud is an established area with schools, parks and markets, and a mix of family flats and independent buildings." },
    ],
  },
  "in/patna": {
    sections: [
      { title: "Choosing between Boring Road, Kankarbagh and Bailey Road", paragraphs: [
        "Boring Road is best for students who want to walk to coaching centres and shops, though it is busy and noisy.",
        "Kankarbagh is a large residential area with more space and a wide choice of rooms and flats, popular with students and families alike.",
        "Bailey Road suits families and working professionals in west Patna, with flats and houses near offices and hospitals.",
        "Compare the three on the Patna map by distance to your coaching centre, college or office, and by monthly cost.",
      ] },
    ],
    faq: [
      { q: "Is Boring Road good for coaching students?", a: "Yes. Many coaching centres are on and around Boring Road, so rooms and PG in the side lanes let students walk to classes." },
      { q: "Which Patna areas are quieter for families?", a: "Patliputra Colony and parts of Rajendra Nagar and Bailey Road are quieter, with flats and independent houses." },
      { q: "Are PG with meals available in Patna?", a: "Yes. Many PG near coaching centres include breakfast and dinner. Ask the operator about the menu, timings and whether meals are included in the rent." },
      { q: "Do Patna owners allow students to share rooms?", a: "Many do, especially in Boring Road, Kankarbagh and Rajendra Nagar. Ask the owner how many people can share and whether the rent is per bed or per room." },
      { q: "How early should students look for rooms in Patna?", a: "Start a few weeks before your coaching batch or college session begins. Save a search on the Patna hub to see new rooms early." },
    ],
  },
  "in/indore": {
    sections: [
      { title: "Choosing between Vijay Nagar, Palasia and Bhawarkuan", paragraphs: [
        "Vijay Nagar suits professionals who want to be near offices, malls and AB Road, with flats and PG at higher rents.",
        "Palasia is central and convenient for markets, shops and offices, with flats in residential lanes.",
        "Bhawarkuan is the main student area, with many rooms and PG close to coaching institutes and colleges.",
        "If you work at the IT parks, compare these areas with the Super Corridor, where newer flats are closer to the offices.",
      ] },
      { title: "Moving to Indore for work or study", paragraphs: [
        "Many students rent a room or PG near their institute first and move to a shared flat once they know the city.",
        "Professionals moving for a job often shortlist Vijay Nagar flats before visiting, then compare them with options along AB Road.",
        "Save a search on the Indore hub before you arrive, so you can plan visits for your first weekend.",
      ] },
    ],
    faq: [
      { q: "Is Bhawarkuan good for students in Indore?", a: "Yes. It is close to coaching institutes and colleges, with many rooms and PG within walking distance." },
      { q: "Is the Super Corridor good for renting?", a: "It suits people working at the IT parks who want newer flats, though shops and services are still developing in some pockets." },
      { q: "Are flats in Indore usually furnished?", a: "Many flats are unfurnished or semi-furnished, while PG and rooms often come with basic furniture. Check the furnishing details on each listing before visiting." },
      { q: "Do Indore owners allow students to share flats?", a: "Many do, especially near Bhawarkuan and Vijay Nagar. Ask the owner how many people can share and whether the rent is per person or per flat." },
      { q: "How early should I search for a room in Indore?", a: "Start a few weeks before your batch or session begins. Save a search on the Indore hub to see new listings as owners post them." },
      { q: "Is Palasia good for families in Indore?", a: "Yes. It is central, close to markets, schools and hospitals, with flats in quieter residential lanes off the main roads." },
    ],
  },
  "in/bhopal": {
    sections: [
      { title: "Choosing between MP Nagar, Arera Colony and Kolar Road", paragraphs: [
        "MP Nagar suits people who work in offices and businesses in the commercial centre, with flats in the surrounding zones.",
        "Arera Colony is green and established, suited to families and senior professionals who want a quieter, well-connected area.",
        "Kolar Road offers newer townships and apartments at moderate rents, suited to families who can manage a slightly longer commute.",
        "Compare all three on the Bhopal map by rent, commute and nearby schools before visiting.",
      ] },
      { title: "Moving to Bhopal for work or study", paragraphs: [
        "Students usually rent a room or PG near their college first, especially around Indrapuri and Ayodhya Bypass.",
        "Government employees and professionals often shortlist flats in Arera Colony, Shahpura or along Hoshangabad Road.",
        "Save a search on the Bhopal hub before you arrive, so you can plan visits for your first weekend.",
      ] },
    ],
    faq: [
      { q: "Is MP Nagar good for renting in Bhopal?", a: "Yes, if you work in the commercial centre; flats in the surrounding zones keep your commute short." },
      { q: "Where do students rent in Bhopal?", a: "Indrapuri, Ayodhya Bypass and areas near MANIT and engineering colleges have many rooms and PG." },
      { q: "Are flats in Bhopal usually furnished?", a: "Many flats are unfurnished or semi-furnished, while PG and rooms often include basic furniture. Check the furnishing details on each listing before visiting." },
      { q: "Do Bhopal owners allow students to share rooms?", a: "Many do, especially near Indrapuri and Ayodhya Bypass. Ask the owner how many people can share and whether the rent is per bed or per room." },
      { q: "Is Hoshangabad Road good for renting?", a: "It has many newer townships and flats along the southern corridor, suited to families. Check the commute to your office before deciding." },
      { q: "How early should I search for a room in Bhopal?", a: "Start a few weeks before your session or joining date. Save a search on the Bhopal hub to see new listings as owners post them." },
      { q: "Can I find a flat near AIIMS Bhopal?", a: "Yes. Areas along Saket Nagar and the south-east side of the city have flats and rooms within a short drive of AIIMS. Use the Bhopal map to check distance from each listing." },
      { q: "Is Shahpura good for families in Bhopal?", a: "Yes. Shahpura has residential colonies near the lake with family flats and houses, close to schools and markets." },
    ],
  },
};

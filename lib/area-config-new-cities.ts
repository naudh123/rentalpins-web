// New India cities (Nov 2026): Bengaluru, Gurugram, Hyderabad, Kolkata, Ghaziabad, Pune, Patna, Indore, Bhopal.
// Map cells from each centre: city-wide = geohash precision 4 over 25 km; localities = precision 5 over 3 km.
// Localities included only where RentalPins had 4+ live listings within 3 km (8 Nov 2026).
import type { AreaConfig } from "./area-config";

export const NEW_INDIA_CITY_AREAS: Record<string, AreaConfig[]> = {
  bengaluru: [
    { slug: "bengaluru-metro", name: "Bengaluru Metro", city: "Bengaluru", geohashPrefixes: ["tdr0","tdr2","tdr1","tdr3","tdr4","tdr6","tdr5","tdr7"], center: { lat: 12.9716, lng: 77.5946 }, radiusKm: 25, description: "Browse rental listings across Bengaluru." },
    { slug: "btm-layout", name: "BTM Layout", city: "Bengaluru", geohashPrefixes: ["tdr1m","tdr1q","tdr1t","tdr1w"], center: { lat: 12.9166, lng: 77.6101 }, radiusKm: 3, description: "BTM Layout PG, rooms and flats near Silk Board." },
    { slug: "whitefield", name: "Whitefield", city: "Bengaluru", geohashPrefixes: ["tdr38","tdr39","tdr3b","tdr3c"], center: { lat: 12.9698, lng: 77.75 }, radiusKm: 3, description: "Whitefield flats and PG near ITPL and the IT parks." },
    { slug: "koramangala", name: "Koramangala", city: "Bengaluru", geohashPrefixes: ["tdr1m","tdr1q","tdr1r","tdr1t","tdr1w","tdr1x"], center: { lat: 12.9352, lng: 77.6245 }, radiusKm: 3, description: "Koramangala flats, PG and shared rooms near startup offices." },
    { slug: "hebbal", name: "Hebbal", city: "Bengaluru", geohashPrefixes: ["tdr4j","tdr4n","tdr4m","tdr4q"], center: { lat: 13.0358, lng: 77.597 }, radiusKm: 3, description: "Hebbal and Manyata Tech Park area rentals." },
    { slug: "hsr-layout", name: "HSR Layout", city: "Bengaluru", geohashPrefixes: ["tdr1q","tdr1r","tdr1w","tdr1x"], center: { lat: 12.9116, lng: 77.6474 }, radiusKm: 3, description: "HSR Layout flats and PG off Outer Ring Road." },
  ],
  gurugram: [
    { slug: "gurugram-metro", name: "Gurugram Metro", city: "Gurugram", geohashPrefixes: ["ttn8","ttnb","ttn9","ttnc","ttnd","ttnf","ttne","ttng"], center: { lat: 28.4595, lng: 77.0266 }, radiusKm: 25, description: "Browse rental listings across Gurugram." },
    { slug: "sushant-lok", name: "Sushant Lok", city: "Gurugram", geohashPrefixes: ["ttncc","ttncf","ttnf1","ttnf4"], center: { lat: 28.4636, lng: 77.0757 }, radiusKm: 3, description: "Sushant Lok flats, floors and PG near MG Road metro." },
    { slug: "golf-course-road", name: "Golf Course Road", city: "Gurugram", geohashPrefixes: ["ttnc9","ttncd","ttnce","ttncc","ttncf","ttncg","ttnf1","ttnf4","ttnf5"], center: { lat: 28.4503, lng: 77.099 }, radiusKm: 3, description: "Golf Course Road apartments and office space." },
    { slug: "sohna-road", name: "Sohna Road", city: "Gurugram", geohashPrefixes: ["ttnc2","ttnc3","ttnc8","ttnc9","ttncb","ttncc"], center: { lat: 28.4089, lng: 77.042 }, radiusKm: 3, description: "Sohna Road society flats and builder floors." },
    { slug: "palam-vihar", name: "Palam Vihar", city: "Gurugram", geohashPrefixes: ["ttnf0","ttnf1","ttnf2","ttnf3"], center: { lat: 28.5065, lng: 77.0367 }, radiusKm: 3, description: "Palam Vihar independent floors and rooms." },
    { slug: "sector-14-gurugram", name: "Sector 14, Gurugram", city: "Gurugram", geohashPrefixes: ["ttncb","ttncc","ttnf0","ttnf1"], center: { lat: 28.471, lng: 77.043 }, radiusKm: 3, description: "Sector 14 and old Gurugram rooms, PG and shops." },
    { slug: "sector-56-gurugram", name: "Sector 56, Gurugram", city: "Gurugram", geohashPrefixes: ["ttnc9","ttncd","ttnce","ttncc","ttncf","ttncg"], center: { lat: 28.422, lng: 77.108 }, radiusKm: 3, description: "Sector 56 and Golf Course Extension flats." },
  ],
  hyderabad: [
    { slug: "hyderabad-metro", name: "Hyderabad Metro", city: "Hyderabad", geohashPrefixes: ["tep9","tepc","tepd","tepf","tepe","tepg","teps","tepu"], center: { lat: 17.385, lng: 78.4867 }, radiusKm: 25, description: "Browse rental listings across Hyderabad." },
    { slug: "kondapur", name: "Kondapur", city: "Hyderabad", geohashPrefixes: ["tepen","tepep","tepeq","teper","tepew","tepex"], center: { lat: 17.47, lng: 78.3637 }, radiusKm: 3, description: "Kondapur flats and PG near HITEC City." },
    { slug: "madhapur", name: "Madhapur", city: "Hyderabad", geohashPrefixes: ["tepep","tepg0","teper","tepg2"], center: { lat: 17.4483, lng: 78.3915 }, radiusKm: 3, description: "Madhapur and HITEC City PG, flats and offices." },
  ],
  kolkata: [
    { slug: "kolkata-metro", name: "Kolkata Metro", city: "Kolkata", geohashPrefixes: ["tgyx","tgyz","tgzp","tun8","tunb","tup0","tun9","tunc","tup1"], center: { lat: 22.5726, lng: 88.3639 }, radiusKm: 25, description: "Browse rental listings across Kolkata." },
    { slug: "salt-lake", name: "Salt Lake", city: "Kolkata", geohashPrefixes: ["tunb7","tunbk","tunbe","tunbs"], center: { lat: 22.58, lng: 88.415 }, radiusKm: 3, description: "Salt Lake (Bidhannagar) flats, PG and offices near Sector V." },
  ],
  ghaziabad: [
    { slug: "ghaziabad-metro", name: "Ghaziabad Metro", city: "Ghaziabad", geohashPrefixes: ["ttnc","ttp1","ttp3","ttnf","ttp4","ttp6","ttng","ttp5","ttp7","ttnu","ttph","ttpk"], center: { lat: 28.6692, lng: 77.4538 }, radiusKm: 25, description: "Browse rental listings across Ghaziabad." },
  ],
  pune: [
    { slug: "pune-metro", name: "Pune Metro", city: "Pune", geohashPrefixes: ["tek2","tek8","tek3","tek9","tek6","tekd"], center: { lat: 18.5204, lng: 73.8567 }, radiusKm: 25, description: "Browse rental listings across Pune." },
    { slug: "hinjewadi", name: "Hinjewadi", city: "Pune", geohashPrefixes: ["tek3t","tek3w","tek3v","tek3y"], center: { lat: 18.5913, lng: 73.7389 }, radiusKm: 3, description: "Hinjewadi IT Park flats and PG." },
  ],
  patna: [
    { slug: "patna-metro", name: "Patna Metro", city: "Patna", geohashPrefixes: ["tus2","tus8","tus3","tus9","tus6","tusd"], center: { lat: 25.5941, lng: 85.1376 }, radiusKm: 25, description: "Browse rental listings across Patna." },
    { slug: "bailey-road", name: "Bailey Road", city: "Patna", geohashPrefixes: ["tus3x","tus98","tus3z","tus9b"], center: { lat: 25.609, lng: 85.08 }, radiusKm: 3, description: "Bailey Road flats, rooms and offices." },
    { slug: "patliputra", name: "Patliputra", city: "Patna", geohashPrefixes: ["tus3x","tus98","tus99","tus3z","tus9b","tus9c"], center: { lat: 25.623, lng: 85.096 }, radiusKm: 3, description: "Patliputra Colony flats and independent houses." },
    { slug: "kankarbagh", name: "Kankarbagh", city: "Patna", geohashPrefixes: ["tus93","tus96","tus99","tus9d","tus9c","tus9f"], center: { lat: 25.594, lng: 85.159 }, radiusKm: 3, description: "Kankarbagh rooms, PG and flats for students." },
    { slug: "boring-road", name: "Boring Road", city: "Patna", geohashPrefixes: ["tus98","tus99","tus9b","tus9c"], center: { lat: 25.612, lng: 85.11 }, radiusKm: 3, description: "Boring Road PG, rooms and coaching-belt rentals." },
  ],
  indore: [
    { slug: "indore-metro", name: "Indore Metro", city: "Indore", geohashPrefixes: ["tevz","teyp","tsjb","tsn0","tsjc","tsn1","tsjf","tsn4"], center: { lat: 22.7196, lng: 75.8577 }, radiusKm: 25, description: "Browse rental listings across Indore." },
    { slug: "vijay-nagar-indore", name: "Vijay Nagar", city: "Indore", geohashPrefixes: ["tsjcq","tsjcr","tsjcw","tsjcx"], center: { lat: 22.753, lng: 75.894 }, radiusKm: 3, description: "Vijay Nagar flats, PG and offices near the AB Road." },
    { slug: "palasia", name: "Palasia", city: "Indore", geohashPrefixes: ["tsjcn","tsjcp","tsjcq","tsjcr"], center: { lat: 22.724, lng: 75.884 }, radiusKm: 3, description: "Palasia and New Palasia flats, shops and offices." },
  ],
  bhopal: [
    { slug: "bhopal-metro", name: "Bhopal Metro", city: "Bhopal", geohashPrefixes: ["tsng","tsp5","tsnu","tsph","tsnv","tspj"], center: { lat: 23.2599, lng: 77.4126 }, radiusKm: 25, description: "Browse rental listings across Bhopal." },
  ],
};

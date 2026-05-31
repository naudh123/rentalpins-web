// scripts/compute-geohashes.mjs
// Run: node scripts/compute-geohashes.mjs
//
// This script computes the geohash for each area center so you can
// verify/update the prefixes in lib/area-config.ts.

import ngeohash from "ngeohash";

const areas = [
  // Chandigarh Tricity
  { name: "Chandigarh (center)",  lat: 30.7333, lng: 76.7794 },
  { name: "Mohali",               lat: 30.7046, lng: 76.7179 },
  { name: "Kharar",               lat: 30.7460, lng: 76.6486 },
  { name: "Panchkula",            lat: 30.6942, lng: 76.8606 },
  { name: "Zirakpur",             lat: 30.6434, lng: 76.8085 },
  { name: "Landran",              lat: 30.6649, lng: 76.7652 },
  // Ludhiana
  { name: "Ludhiana (center)",    lat: 30.9010, lng: 75.8573 },
  { name: "Sarabha Nagar",        lat: 30.8967, lng: 75.8283 },
  { name: "Model Town, Ldh",      lat: 30.9110, lng: 75.8481 },
  { name: "Pakhowal Road",        lat: 30.8890, lng: 75.8320 },
  { name: "BRS Nagar",            lat: 30.9012, lng: 75.8178 },
  { name: "Focal Point, Ldh",     lat: 30.8850, lng: 75.8890 },
];

console.log("Area Geohash Prefixes");
console.log("═".repeat(60));
console.log();

for (const area of areas) {
  const hash4 = ngeohash.encode(area.lat, area.lng, 4);
  const hash5 = ngeohash.encode(area.lat, area.lng, 5);
  const hash6 = ngeohash.encode(area.lat, area.lng, 6);
  const neighbors4 = ngeohash.neighbors(hash4);

  console.log(`📍 ${area.name}`);
  console.log(`   Center:    ${area.lat}, ${area.lng}`);
  console.log(`   Geohash:   ${hash6} (precision 6)`);
  console.log(`   Prefix-4:  ${hash4}  (≈20km cell)`);
  console.log(`   Prefix-5:  ${hash5}  (≈5km cell)`);
  console.log(`   Neighbors: [${neighbors4.join(", ")}]`);
  console.log();
}

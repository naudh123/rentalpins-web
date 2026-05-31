import ngeohash from "ngeohash";
import { GeoPoint } from "firebase/firestore";

const PROMOTION_BONUS = 500_000_000;

export function generateRankingKey(date = new Date(), isPromoted = false): number {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  const dayBucket = parseInt(`${y}${m}${d}`, 10);
  return dayBucket * 10 + (isPromoted ? PROMOTION_BONUS : 0);
}

export function buildPosition(lat: number, lng: number) {
  return {
    geopoint: new GeoPoint(lat, lng),
    geohash: ngeohash.encode(lat, lng, 9),
  };
}

export function createSearchableTitle(title: string): string {
  return title.trim().toLowerCase();
}

export function extractSearchKeywords(title: string): string[] {
  return title
    .toLowerCase()
    .split(/\s+/)
    .filter((w) => w.length > 2)
    .slice(0, 12);
}

export function buildFetchToken(
  lat: number,
  lng: number,
  category: string
): string {
  return `${lat.toFixed(3)}_${lng.toFixed(2)}_${category}`;
}

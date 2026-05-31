import { describe, expect, it } from "vitest";
import {
  coLocatedPinIndexById,
  displayPositionForListing,
  markerDisplayPosition,
} from "../map-pin-offset";
import type { ListingCard } from "../types/listing";

function listing(id: string, lat: number, lng: number): ListingCard {
  return {
    id,
    title: id,
    description: "",
    price: 10000,
    priceUnit: "per month",
    category: "Residential",
    locationName: "Test",
    imageUrl: "",
    lat,
    lng,
    isPromoted: false,
    viewsCount: 0,
    inquiryCount: 0,
    ownerPhone: "",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

describe("map-pin-offset", () => {
  it("offsets co-located listings in a ring", () => {
    const a = listing("a", 30.73304, 76.77942);
    const b = listing("b", 30.73304, 76.77942);
    const coLocated = coLocatedPinIndexById([a, b]);
    const posA = markerDisplayPosition(a, coLocated);
    const posB = markerDisplayPosition(b, coLocated);
    expect(posA.lat).not.toBe(posB.lat);
    expect(Math.hypot(posA.lat - a.lat, posA.lng - a.lng)).toBeGreaterThan(0);
  });

  it("leaves singletons at true coordinates", () => {
    const solo = listing("solo", 12, 77);
    const coLocated = coLocatedPinIndexById([solo]);
    expect(markerDisplayPosition(solo, coLocated)).toEqual({
      lat: solo.lat,
      lng: solo.lng,
    });
  });

  it("places group members on a circle", () => {
    const center = listing("c", 28.6, 77.2);
    const positions = [0, 1, 2].map((index) =>
      displayPositionForListing(center, index, 3)
    );
    const distinct = new Set(positions.map((p) => `${p.lat},${p.lng}`));
    expect(distinct.size).toBe(3);
  });
});

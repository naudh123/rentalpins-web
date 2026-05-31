/** Spread markers in a ring around a cluster center (meters). */

const METERS_PER_DEGREE_LAT = 111_320;

export function spiderfyPositions(
  centerLat: number,
  centerLng: number,
  count: number,
  radiusMeters = 22
): { lat: number; lng: number }[] {
  if (count <= 0) return [];
  if (count === 1) return [{ lat: centerLat, lng: centerLng }];

  const latRad = (centerLat * Math.PI) / 180;
  const cosLat = Math.max(0.2, Math.cos(latRad));
  const positions: { lat: number; lng: number }[] = [];

  for (let i = 0; i < count; i++) {
    const angle = (2 * Math.PI * i) / count - Math.PI / 2;
    const metersLat = radiusMeters * Math.sin(angle);
    const metersLng = radiusMeters * Math.cos(angle);
    positions.push({
      lat: centerLat + metersLat / METERS_PER_DEGREE_LAT,
      lng: centerLng + metersLng / (METERS_PER_DEGREE_LAT * cosLat),
    });
  }

  return positions;
}

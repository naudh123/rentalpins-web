"use client";

import { useEffect, useRef } from "react";
import type { ListingCard } from "@/lib/types/listing";
import { sampleListingsForHeatmap } from "@/lib/map-heatmap";

/** Show density layer only when zoomed far out (clusters handle mid zoom). */
export const MAP_DENSITY_LAYER_MAX_ZOOM = 9;

const MAX_CIRCLES = 100;

interface Props {
  map: google.maps.Map | null;
  listings: ListingCard[];
  mapZoom: number;
  paused?: boolean;
}

function clearCircles(circlesById: Map<string, google.maps.Circle>) {
  circlesById.forEach((c) => c.setMap(null));
  circlesById.clear();
}

/** Low-zoom rental density — soft brand circles (HeatmapLayer removed in Maps JS API 3.55+). */
export default function MapDensityLayer({ map, listings, mapZoom, paused = false }: Props) {
  const circlesByIdRef = useRef<Map<string, google.maps.Circle>>(new Map());

  useEffect(() => {
    if (!map || typeof google === "undefined") return;

    if (paused) {
      clearCircles(circlesByIdRef.current);
      return;
    }

    const active = mapZoom <= MAP_DENSITY_LAYER_MAX_ZOOM;
    const sample = sampleListingsForHeatmap(
      listings.filter((l) => Number.isFinite(l.lat) && Number.isFinite(l.lng))
    );

    if (!active) {
      clearCircles(circlesByIdRef.current);
      return;
    }

    const circleSample =
      sample.length <= MAX_CIRCLES
        ? sample
        : sample.filter((_, i) => i % Math.ceil(sample.length / MAX_CIRCLES) === 0).slice(
            0,
            MAX_CIRCLES
          );

    const nextIds = new Set(circleSample.map((l) => l.id));
    for (const [id, circle] of [...circlesByIdRef.current.entries()]) {
      if (nextIds.has(id)) continue;
      circle.setMap(null);
      circlesByIdRef.current.delete(id);
    }

    const radius = mapZoom <= 7 ? 420 : 280;
    for (const listing of circleSample) {
      const fillOpacity = listing.isPromoted ? 0.3 : 0.22;
      let circle = circlesByIdRef.current.get(listing.id);
      if (!circle) {
        circle = new google.maps.Circle({
          map,
          center: { lat: listing.lat, lng: listing.lng },
          radius,
          strokeColor: "#E8501A",
          strokeOpacity: 0.35,
          strokeWeight: 1,
          fillColor: "#1E3A6E",
          fillOpacity,
          clickable: false,
          zIndex: 1,
        });
        circlesByIdRef.current.set(listing.id, circle);
      } else {
        circle.setCenter({ lat: listing.lat, lng: listing.lng });
        circle.setRadius(radius);
        circle.setOptions({ fillOpacity });
        if (!circle.getMap()) circle.setMap(map);
      }
    }
  }, [map, listings, mapZoom, paused]);

  useEffect(() => {
    return () => {
      clearCircles(circlesByIdRef.current);
    };
  }, []);

  return null;
}

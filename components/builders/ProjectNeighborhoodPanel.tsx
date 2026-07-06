"use client";

import {
  landmarksToPois,
  POI_CATEGORY_LABELS,
  type PoiCategory,
} from "@/lib/builders/neighborhood-pois";

interface ProjectNeighborhoodPanelProps {
  landmarks: string[];
  latitude?: number | null;
  longitude?: number | null;
  projectName: string;
}

export default function ProjectNeighborhoodPanel({
  landmarks,
  latitude,
  longitude,
  projectName,
}: ProjectNeighborhoodPanelProps) {
  if (landmarks.length === 0) return null;

  const pois = landmarksToPois(landmarks);
  const grouped = pois.reduce<Record<PoiCategory, typeof pois>>(
    (acc, poi) => {
      if (!acc[poi.category]) acc[poi.category] = [];
      acc[poi.category].push(poi);
      return acc;
    },
    {} as Record<PoiCategory, typeof pois>
  );

  const mapsUrl =
    latitude != null && longitude != null
      ? `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`
      : null;

  return (
    <div className="space-y-6">
      {mapsUrl && (
        <a
          href={mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-sm font-medium text-[var(--lux-accent)] hover:underline"
        >
          Explore {projectName} on Google Maps →
        </a>
      )}
      <div className="grid gap-6 sm:grid-cols-2">
        {(Object.keys(grouped) as PoiCategory[]).map((cat) => (
          <div key={cat} className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--lux-primary)]">
              {POI_CATEGORY_LABELS[cat]}
            </h3>
            <ul className="mt-3 space-y-2">
              {grouped[cat].map((poi) => (
                <li key={poi.label} className="flex items-start gap-2 text-sm text-[var(--muted)]">
                  <span className="mt-0.5 text-[var(--lux-accent)]">◆</span>
                  {poi.label}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

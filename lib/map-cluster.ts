import type { Renderer } from "@googlemaps/markerclusterer";
import type { Cluster } from "@googlemaps/markerclusterer";
import type { SuperClusterOptions } from "@googlemaps/markerclusterer/dist/algorithms/supercluster";

/** Stop clustering above this zoom so individual price pins appear sooner. */
export const MAP_CLUSTER_MAX_ZOOM = 14;

/** SuperCluster radius in pixels — slightly tighter than library default (60). */
export const MAP_CLUSTER_RADIUS = 50;

/** Passed to MarkerClusterer — SuperCluster reads maxZoom + radius at runtime. */
export const MAP_CLUSTER_ALGORITHM_OPTIONS: SuperClusterOptions = {
  maxZoom: MAP_CLUSTER_MAX_ZOOM,
  radius: MAP_CLUSTER_RADIUS,
};

function clusterTooltip(count: number): string {
  if (count === 1) return "1 rental here — click to zoom in";
  return `${count} rentals here — click to zoom in`;
}

/** Brand-styled cluster bubbles (navy default, orange when dense). */
export const rentalPinsClusterRenderer: Renderer = {
  render(cluster: Cluster) {
    const count = cluster.count;
    const position = cluster.position;
    const size = count < 10 ? 44 : count < 50 ? 52 : 60;
    const fill = count >= 25 ? "#E8501A" : "#1E3A6E";
    const stroke = count >= 25 ? "#D34415" : "#0F2554";

    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <circle cx="${size / 2}" cy="${size / 2}" r="${size / 2 - 2}" fill="${fill}" fill-opacity="0.92" stroke="${stroke}" stroke-width="2"/>
  <circle cx="${size / 2}" cy="${size / 2}" r="${size / 2 - 5}" fill="none" stroke="#ffffff" stroke-opacity="0.35" stroke-width="1"/>
</svg>`;

    const title = clusterTooltip(count);

    return new google.maps.Marker({
      position,
      title,
      clickable: true,
      optimized: true,
      icon: {
        url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`,
        scaledSize: new google.maps.Size(size, size),
        anchor: new google.maps.Point(size / 2, size / 2),
      },
      label: {
        text: count >= 1000 ? `${Math.round(count / 100) / 10}k` : String(count),
        color: "#ffffff",
        fontSize: count >= 100 ? "10px" : "12px",
        fontWeight: "700",
      },
      zIndex: Number(google.maps.Marker.MAX_ZINDEX) + count,
    });
  },
};

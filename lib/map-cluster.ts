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

function clusterTooltip(count: number, sale = false): string {
  const noun = sale ? "listing" : "rental";
  if (count === 1) return `1 ${noun} here — click to zoom in`;
  return `${count} ${noun}s here — click to zoom in`;
}

function renderClusterBubble(
  cluster: Cluster,
  palette: { sparseFill: string; sparseStroke: string; denseFill: string; denseStroke: string },
  sale = false
): google.maps.Marker {
  const count = cluster.count;
  const position = cluster.position;
  const size = count < 10 ? 44 : count < 50 ? 52 : 60;
  const dense = count >= 25;
  const fill = dense ? palette.denseFill : palette.sparseFill;
  const stroke = dense ? palette.denseStroke : palette.sparseStroke;

    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <circle cx="${size / 2}" cy="${size / 2}" r="${size / 2 - 2}" fill="${fill}" fill-opacity="0.92" stroke="${stroke}" stroke-width="2"/>
  <circle cx="${size / 2}" cy="${size / 2}" r="${size / 2 - 5}" fill="none" stroke="#ffffff" stroke-opacity="0.35" stroke-width="1"/>
</svg>`;

  const title = clusterTooltip(count, sale);

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
}

/** Brand-styled cluster bubbles (navy default, orange when dense). */
export const rentalPinsClusterRenderer: Renderer = {
  render(cluster: Cluster) {
    return renderClusterBubble(cluster, {
      sparseFill: "#1E3A6E",
      sparseStroke: "#0F2554",
      denseFill: "#E8501A",
      denseStroke: "#D34415",
    });
  },
};

/** Sale map clusters — navy default, champagne gold when dense. */
export const salePinsClusterRenderer: Renderer = {
  render(cluster: Cluster) {
    return renderClusterBubble(
      cluster,
      {
        sparseFill: "#1E3A6E",
        sparseStroke: "#0F2554",
        denseFill: "#C9A227",
        denseStroke: "#B8922A",
      },
      true
    );
  },
};

export function getClusterRenderer(sale = false): Renderer {
  return sale ? salePinsClusterRenderer : rentalPinsClusterRenderer;
}

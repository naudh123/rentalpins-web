"use client";

import { useEffect, useRef } from "react";
import {
  googleBoundsToMapBounds,
  mapBoundsToGoogleLiteral,
} from "@/lib/map-geometry";
import { encodeMapArea, type LatLngPoint, type MapAreaShape } from "@/lib/map-area";

const SHARED_STYLE = {
  fillColor: "#E8501A",
  fillOpacity: 0.12,
  strokeColor: "#E8501A",
  strokeOpacity: 0.9,
  strokeWeight: 2,
  clickable: false,
  zIndex: 2,
};

const RECT_STYLE: google.maps.RectangleOptions = {
  ...SHARED_STYLE,
  editable: true,
  draggable: true,
};

const POLY_STYLE: google.maps.PolygonOptions = {
  ...SHARED_STYLE,
  editable: true,
  draggable: true,
};

const EDIT_DEBOUNCE_MS = 200;

export type DrawMode = "rect" | "poly";

interface Props {
  map: google.maps.Map | null;
  drawMode: DrawMode | null;
  shape: MapAreaShape | null;
  /** Skip overlays while the map layer is hidden (mobile list / background tab). */
  paused?: boolean;
  onShapeChange: (shape: MapAreaShape | null) => void;
  onDrawComplete: () => void;
}

function polygonPath(polygon: google.maps.Polygon): LatLngPoint[] {
  return polygon
    .getPath()
    .getArray()
    .map((p) => ({ lat: p.lat(), lng: p.lng() }));
}

export default function MapDrawAreaController({
  map,
  drawMode,
  shape,
  paused = false,
  onShapeChange,
  onDrawComplete,
}: Props) {
  const onShapeChangeRef = useRef(onShapeChange);
  onShapeChangeRef.current = onShapeChange;
  const onDrawCompleteRef = useRef(onDrawComplete);
  onDrawCompleteRef.current = onDrawComplete;
  const overlayRef = useRef<google.maps.Rectangle | google.maps.Polygon | null>(null);
  const lastEmittedKeyRef = useRef<string | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const shapeRef = useRef(shape);
  shapeRef.current = shape;

  const emitShape = (next: MapAreaShape) => {
    lastEmittedKeyRef.current = encodeMapArea(next);
    onShapeChangeRef.current(next);
  };

  const clearOverlay = () => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = null;
    overlayRef.current?.setMap(null);
    overlayRef.current = null;
  };

  useEffect(() => {
    if (!map || paused || !drawMode || typeof google.maps.drawing === "undefined") return;

    const overlayType =
      drawMode === "rect"
        ? google.maps.drawing.OverlayType.RECTANGLE
        : google.maps.drawing.OverlayType.POLYGON;

    const dm = new google.maps.drawing.DrawingManager({
      drawingMode: overlayType,
      drawingControl: false,
      rectangleOptions: { ...RECT_STYLE, editable: false, draggable: false },
      polygonOptions: { ...POLY_STYLE, editable: false, draggable: false },
    });
    dm.setMap(map);

    const completeListener = google.maps.event.addListener(
      dm,
      "overlaycomplete",
      (event: google.maps.drawing.OverlayCompleteEvent) => {
        dm.setDrawingMode(null);
        if (event.type === google.maps.drawing.OverlayType.RECTANGLE) {
          const overlay = event.overlay as google.maps.Rectangle;
          const b = overlay.getBounds();
          overlay.setMap(null);
          if (b) emitShape({ type: "rect", bounds: googleBoundsToMapBounds(b) });
        } else if (event.type === google.maps.drawing.OverlayType.POLYGON) {
          const overlay = event.overlay as google.maps.Polygon;
          const path = polygonPath(overlay);
          overlay.setMap(null);
          if (path.length >= 3) emitShape({ type: "poly", path });
        }
        onDrawCompleteRef.current();
      }
    );

    return () => {
      google.maps.event.removeListener(completeListener);
      dm.setMap(null);
    };
  }, [map, drawMode, paused]);

  useEffect(() => {
    if (!map) return;

    if (paused || drawMode || !shapeRef.current) {
      clearOverlay();
      if (!shapeRef.current) lastEmittedKeyRef.current = null;
      return;
    }

    const current = shapeRef.current;
    const cleanups: Array<() => void> = [];

    if (current.type === "rect") {
      if (!(overlayRef.current instanceof google.maps.Rectangle)) {
        clearOverlay();
        const rect = new google.maps.Rectangle({
          ...RECT_STYLE,
          bounds: mapBoundsToGoogleLiteral(current.bounds),
          map,
        });
        overlayRef.current = rect;
        lastEmittedKeyRef.current = encodeMapArea(current);

        const listener = rect.addListener("bounds_changed", () => {
          if (debounceRef.current) clearTimeout(debounceRef.current);
          debounceRef.current = setTimeout(() => {
            const b = rect.getBounds();
            if (b) emitShape({ type: "rect", bounds: googleBoundsToMapBounds(b) });
          }, EDIT_DEBOUNCE_MS);
        });
        cleanups.push(() => google.maps.event.removeListener(listener));
      }
    } else if (!(overlayRef.current instanceof google.maps.Polygon)) {
      clearOverlay();
      const polygon = new google.maps.Polygon({
        ...POLY_STYLE,
        paths: current.path,
        map,
      });
      overlayRef.current = polygon;
      lastEmittedKeyRef.current = encodeMapArea(current);

      const scheduleEmit = () => {
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => {
          const path = polygonPath(polygon);
          if (path.length >= 3) emitShape({ type: "poly", path });
        }, EDIT_DEBOUNCE_MS);
      };
      const path = polygon.getPath();
      const listeners = [
        path.addListener("set_at", scheduleEmit),
        path.addListener("insert_at", scheduleEmit),
        path.addListener("remove_at", scheduleEmit),
        polygon.addListener("dragend", scheduleEmit),
      ];
      cleanups.push(() => listeners.forEach((l) => google.maps.event.removeListener(l)));
    }

    return () => {
      cleanups.forEach((fn) => fn());
      clearOverlay();
    };
  }, [map, drawMode, paused, shape?.type, shape ? "on" : "off"]);

  useEffect(() => {
    if (!map || paused || drawMode || !shape) return;
    const key = encodeMapArea(shape);
    if (!key || key === lastEmittedKeyRef.current) return;

    lastEmittedKeyRef.current = key;
    const overlay = overlayRef.current;
    if (shape.type === "rect" && overlay instanceof google.maps.Rectangle) {
      overlay.setBounds(mapBoundsToGoogleLiteral(shape.bounds));
    } else if (shape.type === "poly" && overlay instanceof google.maps.Polygon) {
      overlay.setPath(shape.path);
    }
  }, [map, drawMode, paused, shape]);

  return null;
}

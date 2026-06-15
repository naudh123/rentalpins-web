"use client";

import { useEffect, useRef } from "react";
import {
  googleBoundsToMapBounds,
  mapBoundsToGoogleLiteral,
} from "@/lib/map-geometry";
import { encodeMapArea, type LatLngPoint, type MapAreaShape } from "@/lib/map-area";
import {
  boundsFromCorners,
  isMeaningfulRectBounds,
  isNearFirstPoint,
  MAP_AREA_PREVIEW_STYLE,
} from "@/lib/map-area-drawing";

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
    if (!map || paused || !drawMode) return;

    const cleanups: Array<() => void> = [];
    let clickTimer: ReturnType<typeof setTimeout> | null = null;
    const previousDraggable = map.get("draggable") !== false;
    const previousDblClickZoom = map.get("disableDoubleClickZoom") !== true;

    const clearClickTimer = () => {
      if (clickTimer) clearTimeout(clickTimer);
      clickTimer = null;
    };

    const finish = () => {
      onDrawCompleteRef.current();
    };

    if (drawMode === "rect") {
      let start: google.maps.LatLng | null = null;
      let preview: google.maps.Rectangle | null = null;
      map.setOptions({ draggable: false });

      const onMouseDown = (e: google.maps.MapMouseEvent) => {
        if (!e.latLng) return;
        start = e.latLng;
        preview?.setMap(null);
        preview = new google.maps.Rectangle({
          ...MAP_AREA_PREVIEW_STYLE,
          map,
          bounds: boundsFromCorners(start, start),
        });
      };

      const onMouseMove = (e: google.maps.MapMouseEvent) => {
        if (!start || !e.latLng || !preview) return;
        preview.setBounds(boundsFromCorners(start, e.latLng));
      };

      const onMouseUp = (e: google.maps.MapMouseEvent) => {
        if (!start || !e.latLng) {
          start = null;
          preview?.setMap(null);
          preview = null;
          return;
        }
        const bounds = new google.maps.LatLngBounds();
        bounds.extend(start);
        bounds.extend(e.latLng);
        preview?.setMap(null);
        preview = null;
        start = null;
        if (isMeaningfulRectBounds(bounds)) {
          emitShape({ type: "rect", bounds: googleBoundsToMapBounds(bounds) });
        }
        finish();
      };

      const downListener = map.addListener("mousedown", onMouseDown);
      const moveListener = map.addListener("mousemove", onMouseMove);
      const upListener = map.addListener("mouseup", onMouseUp);
      cleanups.push(
        () => google.maps.event.removeListener(downListener),
        () => google.maps.event.removeListener(moveListener),
        () => google.maps.event.removeListener(upListener)
      );
    } else {
      const path: LatLngPoint[] = [];
      let preview: google.maps.Polygon | null = null;
      map.setOptions({ disableDoubleClickZoom: true });

      const completePolygon = () => {
        if (path.length < 3) return;
        emitShape({ type: "poly", path: [...path] });
        preview?.setMap(null);
        preview = null;
        finish();
      };

      const onClick = (e: google.maps.MapMouseEvent) => {
        if (!e.latLng) return;
        const point: LatLngPoint = { lat: e.latLng.lat(), lng: e.latLng.lng() };

        clearClickTimer();
        clickTimer = setTimeout(() => {
          clickTimer = null;
          if (path.length >= 3 && isNearFirstPoint(map, point, path[0]!)) {
            completePolygon();
            return;
          }
          path.push(point);
          if (!preview) {
            preview = new google.maps.Polygon({
              ...MAP_AREA_PREVIEW_STYLE,
              map,
              paths: path,
            });
          } else {
            preview.setPath(path);
          }
        }, 220);
      };

      const onDblClick = (e: google.maps.MapMouseEvent) => {
        e.stop();
        clearClickTimer();
        if (path.length >= 3) completePolygon();
      };

      const onKeyDown = (ev: KeyboardEvent) => {
        if (ev.key === "Escape") {
          preview?.setMap(null);
          finish();
        }
      };

      const clickListener = map.addListener("click", onClick);
      const dblClickListener = map.addListener("dblclick", onDblClick);
      cleanups.push(
        () => google.maps.event.removeListener(clickListener),
        () => google.maps.event.removeListener(dblClickListener),
        () => window.removeEventListener("keydown", onKeyDown)
      );
      window.addEventListener("keydown", onKeyDown);
    }

    return () => {
      clearClickTimer();
      cleanups.forEach((fn) => fn());
      map.setOptions({
        draggable: previousDraggable,
        disableDoubleClickZoom: previousDblClickZoom,
      });
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

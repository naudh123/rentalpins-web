"use client";

import { useEffect, useRef, type MutableRefObject } from "react";
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
  MAP_AREA_PREVIEW_STROKE,
} from "@/lib/map-area-drawing";
import type { MapDrawProgress } from "@/lib/map-draw-ui";
import { isMobileMapLayout } from "@/lib/map-gestures";

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
/** Let mouseup from finishing a draw finish before map/overlay drag is re-enabled. */
const POST_DRAW_GESTURE_MS = 320;

export type DrawMode = "rect" | "poly";

export interface MapDrawActions {
  cancel: () => void;
  undoPoint: () => void;
  finishPolygon: () => void;
}

interface Props {
  map: google.maps.Map | null;
  drawMode: DrawMode | null;
  shape: MapAreaShape | null;
  /** Skip overlays while the map layer is hidden (mobile list / background tab). */
  paused?: boolean;
  onShapeChange: (shape: MapAreaShape | null) => void;
  onDrawComplete: () => void;
  onDrawProgress?: (progress: MapDrawProgress | null) => void;
  drawActionsRef?: MutableRefObject<MapDrawActions | null>;
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
  onDrawProgress,
  drawActionsRef,
}: Props) {
  const onShapeChangeRef = useRef(onShapeChange);
  onShapeChangeRef.current = onShapeChange;
  const onDrawCompleteRef = useRef(onDrawComplete);
  onDrawCompleteRef.current = onDrawComplete;
  const onDrawProgressRef = useRef(onDrawProgress);
  onDrawProgressRef.current = onDrawProgress;
  const overlayRef = useRef<google.maps.Rectangle | google.maps.Polygon | null>(null);
  const lastEmittedKeyRef = useRef<string | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const restoreGestureTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
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
    if (!drawMode) {
      onDrawProgressRef.current?.(null);
      if (drawActionsRef) drawActionsRef.current = null;
      return;
    }

    if (!map || paused) return;

    if (restoreGestureTimerRef.current) {
      clearTimeout(restoreGestureTimerRef.current);
      restoreGestureTimerRef.current = null;
    }

    const cleanups: Array<() => void> = [];
    let clickTimer: ReturnType<typeof setTimeout> | null = null;
    const previousDraggable = map.get("draggable") !== false;
    const previousDisableDoubleClickZoom = Boolean(map.get("disableDoubleClickZoom"));
    let preview: google.maps.Rectangle | google.maps.Polygon | google.maps.Polyline | null =
      null;
    let rubberLine: google.maps.Polyline | null = null;
    let closeHint: google.maps.Circle | null = null;

    const clearClickTimer = () => {
      if (clickTimer) clearTimeout(clickTimer);
      clickTimer = null;
    };

    const clearPreview = () => {
      preview?.setMap(null);
      preview = null;
      rubberLine?.setMap(null);
      rubberLine = null;
      closeHint?.setMap(null);
      closeHint = null;
    };

    const finish = () => {
      clearPreview();
      onDrawProgressRef.current?.(null);
      if (drawActionsRef) drawActionsRef.current = null;
      onDrawCompleteRef.current();
    };

    const cancel = () => {
      clearClickTimer();
      clearPreview();
      finish();
    };

    const reportRectProgress = () => {
      onDrawProgressRef.current?.({
        mode: "rect",
        pointCount: 0,
        canFinish: false,
        canUndo: false,
      });
    };

    if (drawActionsRef) {
      drawActionsRef.current = {
        cancel,
        undoPoint: () => {},
        finishPolygon: () => {},
      };
    }

    const onKeyDown = (ev: KeyboardEvent) => {
      if (ev.key === "Escape") cancel();
    };
    window.addEventListener("keydown", onKeyDown);
    cleanups.push(() => window.removeEventListener("keydown", onKeyDown));

    if (drawMode === "rect") {
      reportRectProgress();
      const mobileTwoTap = isMobileMapLayout();

      if (mobileTwoTap) {
        let start: google.maps.LatLng | null = null;

        const onClick = (e: google.maps.MapMouseEvent) => {
          if (!e.latLng) return;
          if (!start) {
            start = e.latLng;
            preview = new google.maps.Rectangle({
              ...MAP_AREA_PREVIEW_STYLE,
              map,
              bounds: boundsFromCorners(start, start),
            });
            return;
          }
          const bounds = new google.maps.LatLngBounds();
          bounds.extend(start);
          bounds.extend(e.latLng);
          start = null;
          clearPreview();
          if (isMeaningfulRectBounds(bounds)) {
            emitShape({ type: "rect", bounds: googleBoundsToMapBounds(bounds) });
          }
          finish();
        };

        const clickListener = map.addListener("click", onClick);
        cleanups.push(() => google.maps.event.removeListener(clickListener));
      } else {
        let start: google.maps.LatLng | null = null;
        map.setOptions({ draggable: false });

        const onMouseDown = (e: google.maps.MapMouseEvent) => {
          if (!e.latLng) return;
          start = e.latLng;
          clearPreview();
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
            clearPreview();
            return;
          }
          const bounds = new google.maps.LatLngBounds();
          bounds.extend(start);
          bounds.extend(e.latLng);
          start = null;
          clearPreview();
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
      }
    } else {
      const path: LatLngPoint[] = [];

      const reportPolyProgress = () => {
        onDrawProgressRef.current?.({
          mode: "poly",
          pointCount: path.length,
          canFinish: path.length >= 3,
          canUndo: path.length > 0,
        });
      };

      let finishing = false;

      const completePolygon = () => {
        if (path.length < 3 || finishing) return;
        finishing = true;
        clearClickTimer();
        emitShape({ type: "poly", path: [...path] });
        finish();
      };

      const undoPoint = () => {
        if (path.length === 0) return;
        path.pop();
        updatePolyPreview(null);
        reportPolyProgress();
      };

      const updatePolyPreview = (cursor: LatLngPoint | null) => {
        preview?.setMap(null);
        preview = null;
        rubberLine?.setMap(null);
        rubberLine = null;
        closeHint?.setMap(null);
        closeHint = null;

        if (path.length === 0) return;

        if (path.length < 3) {
          const linePath = cursor ? [...path, cursor] : path;
          if (linePath.length >= 2) {
            preview = new google.maps.Polyline({
              ...MAP_AREA_PREVIEW_STROKE,
              path: linePath,
              map,
            });
          }
          return;
        }

        preview = new google.maps.Polygon({
          ...MAP_AREA_PREVIEW_STYLE,
          paths: path,
          map,
        });

        if (cursor) {
          rubberLine = new google.maps.Polyline({
            ...MAP_AREA_PREVIEW_STROKE,
            strokeOpacity: 0.55,
            strokeWeight: 2,
            path: [path[path.length - 1]!, cursor],
            map,
          });
        }

        closeHint = new google.maps.Circle({
          center: path[0],
          radius: 22,
          fillColor: "#E8501A",
          fillOpacity: 1,
          strokeColor: "#ffffff",
          strokeWeight: 2,
          map,
          zIndex: 4,
          clickable: false,
        });
      };

      if (drawActionsRef) {
        drawActionsRef.current = {
          cancel,
          undoPoint,
          finishPolygon: completePolygon,
        };
      }

      reportPolyProgress();
      map.setOptions({ disableDoubleClickZoom: true });

      const mapDiv = map.getDiv();
      const blockDblClickZoom = (e: MouseEvent) => {
        e.preventDefault();
        e.stopImmediatePropagation();
      };
      mapDiv.addEventListener("dblclick", blockDblClickZoom, { capture: true });
      cleanups.push(() =>
        mapDiv.removeEventListener("dblclick", blockDblClickZoom, { capture: true })
      );

      const onClick = (e: google.maps.MapMouseEvent) => {
        if (!e.latLng || finishing) return;
        const point: LatLngPoint = { lat: e.latLng.lat(), lng: e.latLng.lng() };

        clearClickTimer();
        clickTimer = setTimeout(() => {
          clickTimer = null;
          if (finishing) return;
          if (path.length >= 3 && isNearFirstPoint(map, point, path[0]!)) {
            completePolygon();
            return;
          }
          path.push(point);
          updatePolyPreview(null);
          reportPolyProgress();
        }, 180);
      };

      const onMouseMove = (e: google.maps.MapMouseEvent) => {
        if (!e.latLng || path.length === 0 || finishing) return;
        updatePolyPreview({ lat: e.latLng.lat(), lng: e.latLng.lng() });
      };

      const onDblClick = (e: google.maps.MapMouseEvent) => {
        e.stop();
        clearClickTimer();
      };

      const clickListener = map.addListener("click", onClick);
      const dblClickListener = map.addListener("dblclick", onDblClick);
      const moveListener = map.addListener("mousemove", onMouseMove);
      cleanups.push(
        () => google.maps.event.removeListener(clickListener),
        () => google.maps.event.removeListener(dblClickListener),
        () => google.maps.event.removeListener(moveListener)
      );
    }

    return () => {
      clearClickTimer();
      cleanups.forEach((fn) => fn());
      clearPreview();
      if (restoreGestureTimerRef.current) clearTimeout(restoreGestureTimerRef.current);
      restoreGestureTimerRef.current = window.setTimeout(() => {
        map.setOptions({
          draggable: previousDraggable,
          disableDoubleClickZoom: previousDisableDoubleClickZoom,
        });
        restoreGestureTimerRef.current = null;
      }, POST_DRAW_GESTURE_MS);
      onDrawProgressRef.current?.(null);
      if (drawActionsRef) drawActionsRef.current = null;
    };
  }, [map, drawMode, paused, drawActionsRef]);

  useEffect(() => {
    if (!map) return;

    if (paused || drawMode || !shapeRef.current) {
      clearOverlay();
      if (!shapeRef.current) lastEmittedKeyRef.current = null;
      return;
    }

    const current = shapeRef.current;
    const cleanups: Array<() => void> = [];

    const enableOverlayDragLater = (
      overlay: google.maps.Rectangle | google.maps.Polygon
    ) => {
      const timer = window.setTimeout(() => {
        if (overlayRef.current === overlay) {
          overlay.setOptions({ draggable: true });
        }
      }, POST_DRAW_GESTURE_MS);
      cleanups.push(() => clearTimeout(timer));
    };

    if (current.type === "rect") {
      if (!(overlayRef.current instanceof google.maps.Rectangle)) {
        clearOverlay();
        const rect = new google.maps.Rectangle({
          ...RECT_STYLE,
          draggable: false,
          bounds: mapBoundsToGoogleLiteral(current.bounds),
          map,
        });
        overlayRef.current = rect;
        lastEmittedKeyRef.current = encodeMapArea(current);
        enableOverlayDragLater(rect);

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
        draggable: false,
        paths: current.path,
        map,
      });
      overlayRef.current = polygon;
      lastEmittedKeyRef.current = encodeMapArea(current);
      enableOverlayDragLater(polygon);

      const scheduleEmit = () => {
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => {
          const nextPath = polygonPath(polygon);
          if (nextPath.length >= 3) emitShape({ type: "poly", path: nextPath });
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
    };
  }, [map, drawMode, paused, shape?.type, shape ? "on" : "off"]);

  useEffect(() => {
    return () => {
      clearOverlay();
    };
  }, [map]);

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

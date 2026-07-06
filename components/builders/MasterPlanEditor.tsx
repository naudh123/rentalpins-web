"use client";

import { useCallback, useRef, useState } from "react";
import type { ProjectUnit, HotspotCoord } from "@/lib/types/builder-microsite";
import { useAuth } from "@/components/providers/AuthProvider";
import BuilderAssetUploadField from "@/components/builders/BuilderAssetUploadField";

type AngleKey = "default" | "angle1" | "angle2" | "angle3" | "angle4";

interface MasterPlanEditorProps {
  projectId: string;
  initialImageUrl: string | null;
  initialAngles: { id: string; label: string; imageUrl: string }[];
  units: ProjectUnit[];
  onSaved?: () => void;
}

export default function MasterPlanEditor({
  projectId,
  initialImageUrl,
  initialAngles,
  units,
  onSaved,
}: MasterPlanEditorProps) {
  const { user } = useAuth();
  const containerRef = useRef<HTMLDivElement>(null);
  const [imageUrl, setImageUrl] = useState(initialImageUrl || "");
  const [angles, setAngles] = useState(initialAngles);
  const [activeAngle, setActiveAngle] = useState<AngleKey>("default");
  const [localUnits, setLocalUnits] = useState(units);
  const [selectedUnitId, setSelectedUnitId] = useState<string | null>(null);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const currentImage =
    angles.find((a) => a.id === activeAngle)?.imageUrl || imageUrl;

  const getCoord = (unit: ProjectUnit): HotspotCoord | undefined =>
    unit.hotspots[activeAngle];

  const updateUnitHotspot = useCallback(
    (unitId: string, coord: HotspotCoord) => {
      setLocalUnits((prev) =>
        prev.map((u) =>
          u.id === unitId
            ? { ...u, hotspots: { ...u.hotspots, [activeAngle]: coord } }
            : u
        )
      );
    },
    [activeAngle]
  );

  function handleImageClick(e: React.MouseEvent<HTMLDivElement>) {
    if (!selectedUnitId || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const xPercent = Math.round(((e.clientX - rect.left) / rect.width) * 1000) / 10;
    const yPercent = Math.round(((e.clientY - rect.top) / rect.height) * 1000) / 10;
    updateUnitHotspot(selectedUnitId, {
      xPercent: Math.max(0, Math.min(100, xPercent)),
      yPercent: Math.max(0, Math.min(100, yPercent)),
    });
  }

  function handleMarkerDrag(
    e: React.MouseEvent,
    unitId: string
  ) {
    e.stopPropagation();
    if (!containerRef.current) return;
    setDraggingId(unitId);

    function onMove(ev: MouseEvent) {
      const rect = containerRef.current!.getBoundingClientRect();
      const xPercent = Math.round(((ev.clientX - rect.left) / rect.width) * 1000) / 10;
      const yPercent = Math.round(((ev.clientY - rect.top) / rect.height) * 1000) / 10;
      updateUnitHotspot(unitId, {
        xPercent: Math.max(0, Math.min(100, xPercent)),
        yPercent: Math.max(0, Math.min(100, yPercent)),
      });
    }

    function onUp() {
      setDraggingId(null);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    }

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  }

  async function saveMasterPlanOnly(
    defaultUrl: string,
    anglesList: { id: string; label: string; imageUrl: string }[]
  ) {
    if (!user) return;
    setSaving(true);
    setMessage(null);
    try {
      const token = await user.getIdToken();
      const payload = {
        defaultImageUrl: defaultUrl,
        angles: anglesList.length
          ? anglesList
          : [{ id: "default", label: "2D Plan", imageUrl: defaultUrl }],
      };
      await fetch(`/api/master-plans/${projectId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      setMessage("Upload saved!");
      onSaved?.();
    } catch {
      setMessage("Failed to save upload.");
    } finally {
      setSaving(false);
    }
  }

  async function saveAll() {
    if (!user) return;
    setSaving(true);
    setMessage(null);
    try {
      const token = await user.getIdToken();
      await fetch(`/api/master-plans/${projectId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          defaultImageUrl: imageUrl,
          angles: angles.length ? angles : [{ id: "default", label: "2D Plan", imageUrl }],
        }),
      });

      for (const unit of localUnits) {
        await fetch(`/api/project-units/${unit.id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ hotspots: unit.hotspots }),
        });
      }

      setMessage("Saved successfully!");
      onSaved?.();
    } catch {
      setMessage("Failed to save. Try again.");
    } finally {
      setSaving(false);
    }
  }

  function nextAnglesWithUpload(
    prev: { id: string; label: string; imageUrl: string }[],
    url: string,
    angle: AngleKey
  ) {
    const existing = prev.find((a) => a.id === angle);
    if (existing) {
      return prev.map((a) => (a.id === angle ? { ...a, imageUrl: url } : a));
    }
    if (angle === "default" && prev.length === 0) {
      return [{ id: "default", label: "2D Plan", imageUrl: url }];
    }
    return [
      ...prev,
      {
        id: angle,
        label: angle === "default" ? "2D Plan" : angle,
        imageUrl: url,
      },
    ];
  }

  async function handlePlanImageUploaded(url: string) {
    setImageUrl(url);
    let nextAngles: { id: string; label: string; imageUrl: string }[] = [];
    setAngles((prev) => {
      nextAngles = nextAnglesWithUpload(prev, url, activeAngle);
      return nextAngles;
    });
    await saveMasterPlanOnly(url, nextAngles);
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <BuilderAssetUploadField
          label={`Upload master plan (${activeAngle})`}
          kind="project-master-plan"
          entityId={projectId}
          pathExtra={activeAngle}
          existingUrl={currentImage || null}
          disabled={saving}
          onUploaded={handlePlanImageUploaded}
        />
        <div>
          <label className="mb-1 block text-sm font-medium">
            Select plot to place marker
          </label>
          <select
            value={selectedUnitId || ""}
            onChange={(e) => setSelectedUnitId(e.target.value || null)}
            className="w-full rounded-lg border border-[var(--border)] px-3 py-2 text-sm"
          >
            <option value="">— Select plot —</option>
            {localUnits.map((u) => (
              <option key={u.id} value={u.id}>
                Plot {u.plotNumber} ({u.status})
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {(["default", "angle1", "angle2", "angle3", "angle4"] as AngleKey[]).map((k) => (
          <button
            key={k}
            type="button"
            onClick={() => setActiveAngle(k)}
            className={`rounded-lg px-3 py-1.5 text-sm ${
              activeAngle === k
                ? "bg-[var(--brand-navy)] text-white"
                : "bg-[var(--bg-elevated)]"
            }`}
          >
            {angles.find((a) => a.id === k)?.label ||
              (k === "default" ? "2D Plan" : k.replace("angle", "Angle "))}
          </button>
        ))}
      </div>

      {currentImage ? (
        <div
          ref={containerRef}
          className="relative cursor-crosshair overflow-hidden rounded-xl border border-[var(--border)]"
          onClick={handleImageClick}
          role="presentation"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={currentImage} alt="Master plan" className="block w-full" draggable={false} />
          {localUnits
            .filter((u) => getCoord(u))
            .map((unit) => {
              const coord = getCoord(unit)!;
              return (
                <button
                  key={unit.id}
                  type="button"
                  aria-label={`Plot ${unit.plotNumber}`}
                  onMouseDown={(e) => handleMarkerDrag(e, unit.id)}
                  className={`absolute z-10 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-[var(--brand-orange)] shadow-lg ${
                    draggingId === unit.id ? "scale-125" : ""
                  }`}
                  style={{
                    left: `${coord.xPercent}%`,
                    top: `${coord.yPercent}%`,
                    width: 22,
                    height: 22,
                  }}
                />
              );
            })}
        </div>
      ) : (
        <p className="text-sm text-[var(--muted)]">Upload a master plan image to start placing markers.</p>
      )}

      <p className="text-sm text-[var(--muted)]">
        Select a plot, then click on the image to place a marker. Drag markers to reposition.
        Coordinates are saved as percentages for responsive display.
      </p>

      {message && (
        <p className={`text-sm ${message.includes("Failed") ? "text-red-600" : "text-green-600"}`}>
          {message}
        </p>
      )}

      <button
        type="button"
        onClick={saveAll}
        disabled={saving || !user}
        className="rp-btn rp-btn-primary"
      >
        {saving ? "Saving..." : "Save Master Plan"}
      </button>
    </div>
  );
}

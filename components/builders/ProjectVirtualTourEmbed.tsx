"use client";

function tourEmbedUrl(url: string): string | null {
  const u = url.trim();
  if (!u) return null;
  if (u.includes("matterport.com/show")) return u.replace("/show/?", "/show/?").replace(/\?m=.*/, (m) => m);
  if (u.includes("my.matterport.com")) return u;
  if (u.includes("youtube.com") || u.includes("youtu.be")) {
    if (u.includes("embed")) return u;
    if (u.includes("watch?v=")) {
      const id = new URL(u).searchParams.get("v");
      return id ? `https://www.youtube.com/embed/${id}` : null;
    }
  }
  return u;
}

interface ProjectVirtualTourEmbedProps {
  virtualTourUrl: string | null;
  title: string;
}

export default function ProjectVirtualTourEmbed({
  virtualTourUrl,
  title,
}: ProjectVirtualTourEmbedProps) {
  const src = virtualTourUrl ? tourEmbedUrl(virtualTourUrl) : null;
  if (!src) return null;

  return (
    <div className="overflow-hidden rounded-2xl border border-[var(--border)] shadow-[var(--lux-shadow)]">
      <div className="relative aspect-[16/10] w-full bg-[var(--bg-elevated)]">
        <iframe
          src={src}
          title={`${title} virtual tour`}
          className="absolute inset-0 h-full w-full"
          allow="fullscreen; xr-spatial-tracking"
          allowFullScreen
        />
      </div>
    </div>
  );
}

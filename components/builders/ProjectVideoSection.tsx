"use client";

function embedUrl(url: string): string | null {
  const u = url.trim();
  if (!u) return null;
  if (u.includes("youtube.com/watch")) {
    const id = new URL(u).searchParams.get("v");
    return id ? `https://www.youtube.com/embed/${id}` : null;
  }
  if (u.includes("youtu.be/")) {
    const id = u.split("youtu.be/")[1]?.split(/[?#]/)[0];
    return id ? `https://www.youtube.com/embed/${id}` : null;
  }
  if (u.includes("youtube.com/embed/")) return u;
  return u;
}

interface ProjectVideoSectionProps {
  videoUrls: string[];
  title: string;
}

export default function ProjectVideoSection({ videoUrls, title }: ProjectVideoSectionProps) {
  const embeds = videoUrls.map(embedUrl).filter((u): u is string => u != null);
  if (embeds.length === 0) return null;

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {embeds.map((src) => (
        <div
          key={src}
          className="overflow-hidden rounded-2xl border border-[var(--border)] bg-black shadow-[var(--lux-shadow)]"
        >
          <div className="relative aspect-video w-full">
            <iframe
              src={src}
              title={`${title} video`}
              className="absolute inset-0 h-full w-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      ))}
    </div>
  );
}

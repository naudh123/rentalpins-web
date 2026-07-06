import { getProjectBySlugAndCity } from "../lib/builders/builders-server.ts";
import { resolveProjectMedia } from "../lib/builders/project-media.ts";

const p = await getProjectBySlugAndCity("mohali", "gillco-valley");
if (!p) {
  console.error("not found");
  process.exit(1);
}
const m = resolveProjectMedia(
  p.slug,
  p.builderSlug,
  p.builderName,
  p.galleryUrls[0],
  p.galleryUrls
);
console.log(JSON.stringify({ stored: p.galleryUrls, resolved: m }, null, 2));

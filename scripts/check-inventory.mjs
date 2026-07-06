import { getProjectBySlugAndCity } from "../lib/builders/builders-server.ts";
import { resolveInventorySummary } from "../lib/builders/builders-server.ts";

const p = await getProjectBySlugAndCity("mohali", "gillco-valley");
if (!p) {
  console.error("not found");
  process.exit(1);
}
const s = resolveInventorySummary(p, []);
console.log(JSON.stringify({ totalUnits: p.totalUnits, summary: s }, null, 2));

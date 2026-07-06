import { getProjectBySlugAndCity } from "../lib/builders/builders-server.ts";

const p = await getProjectBySlugAndCity("mohali", "gillco-valley");
if (!p) {
  console.error("Project not found");
  process.exit(1);
}
console.log(JSON.stringify({
  name: p.name,
  seoTitle: p.seoTitle,
  seoDescription: p.seoDescription,
  keywordCount: p.seoKeywords.length,
  sampleKeywords: p.seoKeywords.slice(0, 8),
  faqCount: p.faqs.length,
  hasDealMarker: p.description.includes("Best Deal Guarantee"),
  aiSearchSnippet: p.aiSearchSnippet?.slice(0, 120),
}, null, 2));

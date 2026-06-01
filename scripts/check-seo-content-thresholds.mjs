import { readFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const areaClientPath = path.join(root, "app", "rentals-shared", "AreaClient.tsx");
const content = await readFile(areaClientPath, "utf8");

function wordCount(text) {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

function assert(condition, message) {
  if (!condition) {
    console.error(`SEO content check failed: ${message}`);
    process.exitCode = 1;
  }
}

const words = wordCount(content);
const titleOccurrences = (content.match(/title:\s*`/g) || []).length;
const paragraphOccurrences = (content.match(/paragraphs:\s*\[/g) || []).length;

assert(words >= 2500, `AreaClient content too short (${words} words, expected >= 2500).`);
assert(titleOccurrences >= 12, `Expected >=12 long-form section titles, found ${titleOccurrences}.`);
assert(
  paragraphOccurrences >= 12,
  `Expected >=12 long-form paragraph groups, found ${paragraphOccurrences}.`
);

if (!process.exitCode) {
  console.log(
    `SEO content thresholds passed: words=${words}, titles=${titleOccurrences}, groups=${paragraphOccurrences}`
  );
}

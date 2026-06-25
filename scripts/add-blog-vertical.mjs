import fs from "fs";
import path from "path";

const dir = path.join(process.cwd(), "content", "blog");
for (const f of fs.readdirSync(dir).filter((x) => x.endsWith(".mdx"))) {
  const p = path.join(dir, f);
  let s = fs.readFileSync(p, "utf8");
  if (/\nvertical:/.test(s)) continue;
  s = s.replace(/^---\r?\n/, "---\nvertical: \"rent\"\n");
  fs.writeFileSync(p, s);
  console.log("updated", f);
}

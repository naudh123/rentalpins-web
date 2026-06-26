/** Split markdown blog content into embedding-sized chunks. */

const MAX_CHUNK = 900;

export function chunkMarkdown(text: string, maxLen = MAX_CHUNK): string[] {
  const normalized = text.replace(/\r\n/g, "\n").trim();
  if (!normalized) return [];

  const sections = normalized.split(/(?=^##\s)/m).filter(Boolean);
  const chunks: string[] = [];

  for (const section of sections) {
    if (section.length <= maxLen) {
      chunks.push(section.trim());
      continue;
    }

    const paragraphs = section.split(/\n\n+/);
    let buffer = "";
    for (const para of paragraphs) {
      const next = buffer ? `${buffer}\n\n${para}` : para;
      if (next.length <= maxLen) {
        buffer = next;
      } else {
        if (buffer) chunks.push(buffer.trim());
        if (para.length <= maxLen) {
          buffer = para;
        } else {
          for (let i = 0; i < para.length; i += maxLen) {
            chunks.push(para.slice(i, i + maxLen).trim());
          }
          buffer = "";
        }
      }
    }
    if (buffer) chunks.push(buffer.trim());
  }

  return chunks.filter((c) => c.length > 40);
}

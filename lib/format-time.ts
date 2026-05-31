/** Human-readable “listed … ago” from ISO date. */
export function formatListedAgo(isoDate: string): string {
  const then = new Date(isoDate).getTime();
  if (Number.isNaN(then)) return "Recently listed";

  const ms = Date.now() - then;
  if (ms < 0) return "Just listed";

  const minutes = Math.floor(ms / 60_000);
  if (minutes < 1) return "Listed just now";
  if (minutes < 60) return `Listed ${minutes}m ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `Listed ${hours}h ago`;

  const days = Math.floor(hours / 24);
  if (days === 1) return "Listed yesterday";
  if (days < 30) return `Listed ${days} days ago`;

  const months = Math.floor(days / 30);
  if (months < 12) return `Listed ${months} mo ago`;

  const years = Math.floor(months / 12);
  return years === 1 ? "Listed 1 year ago" : `Listed ${years} years ago`;
}

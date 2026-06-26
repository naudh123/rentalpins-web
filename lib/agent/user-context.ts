import { Timestamp } from "firebase-admin/firestore";
import { adminDb } from "@/lib/firebase-admin";

export interface AgentUserContext {
  userId: string;
  displayName: string | null;
  savedSearches: {
    id: string;
    name: string;
    placeQuery: string | null;
    keywords: string | null;
    priceMin: number | null;
    priceMax: number | null;
    bhk: string | null;
    category: string;
  }[];
  priorSessions: {
    sessionId: string;
    surface: string;
    summary: string | null;
    mapPath: string | null;
    intentScore: number;
    updatedAtMs: number;
  }[];
}

function tsToMs(v: unknown): number {
  if (v instanceof Timestamp) return v.toMillis();
  if (v && typeof v === "object" && "toMillis" in v) {
    return (v as Timestamp).toMillis();
  }
  return 0;
}

export async function loadAgentUserContext(userId: string): Promise<AgentUserContext | null> {
  if (!userId) return null;

  const [searchesSnap, sessionsSnap, userSnap] = await Promise.all([
    adminDb
      .collection("saved_searches")
      .where("userId", "==", userId)
      .orderBy("updatedAt", "desc")
      .limit(5)
      .get()
      .catch(() => null),
    adminDb
      .collection("agent_conversations")
      .where("userId", "==", userId)
      .orderBy("updatedAt", "desc")
      .limit(3)
      .get()
      .catch(() => null),
    adminDb.collection("users").doc(userId).get().catch(() => null),
  ]);

  const displayName =
    (userSnap?.data()?.displayName as string | undefined) ??
    (userSnap?.data()?.name as string | undefined) ??
    null;

  const savedSearches =
    searchesSnap?.docs.map((doc) => {
      const d = doc.data();
      return {
        id: doc.id,
        name: (d.name as string) || "Saved search",
        placeQuery: typeof d.placeQuery === "string" ? d.placeQuery : null,
        keywords: typeof d.keywords === "string" ? d.keywords : null,
        priceMin: typeof d.priceMin === "number" ? d.priceMin : null,
        priceMax: typeof d.priceMax === "number" ? d.priceMax : null,
        bhk: typeof d.bhk === "string" ? d.bhk : null,
        category: (d.category as string) || "All",
      };
    }) ?? [];

  const priorSessions =
    sessionsSnap?.docs.map((doc) => {
      const d = doc.data();
      return {
        sessionId: doc.id,
        surface: (d.surface as string) || "advisor",
        summary: typeof d.summary === "string" ? d.summary : null,
        mapPath: typeof d.mapPath === "string" ? d.mapPath : null,
        intentScore: typeof d.intentScore === "number" ? d.intentScore : 0,
        updatedAtMs: tsToMs(d.updatedAt),
      };
    }) ?? [];

  return {
    userId,
    displayName,
    savedSearches,
    priorSessions,
  };
}

export function formatUserContextForPrompt(ctx: AgentUserContext): string {
  const lines: string[] = [
    `Signed-in user: ${ctx.displayName ?? ctx.userId.slice(0, 8)}.`,
  ];

  if (ctx.savedSearches.length > 0) {
    lines.push("Saved map searches:");
    for (const s of ctx.savedSearches) {
      const bits = [
        s.name,
        s.placeQuery,
        s.keywords,
        s.bhk ? `${s.bhk} BHK` : null,
        s.priceMax != null ? `max ₹${s.priceMax}` : null,
      ].filter(Boolean);
      lines.push(`- ${bits.join(" · ")}`);
    }
    lines.push("Offer to reopen a saved search on the map when relevant.");
  }

  if (ctx.priorSessions.length > 0) {
    lines.push("Recent agent sessions (this account):");
    for (const s of ctx.priorSessions) {
      lines.push(
        `- [${s.surface}] ${s.summary ?? "no summary"}${s.mapPath ? ` → ${s.mapPath}` : ""}`
      );
    }
    lines.push("Continue naturally — do not repeat full prior transcripts.");
  }

  return lines.join("\n");
}

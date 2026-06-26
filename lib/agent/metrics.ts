import { Timestamp } from "firebase-admin/firestore";
import { adminDb } from "@/lib/firebase-admin";
import type { AgentSurface } from "./types";

export interface AgentMetricsSummary {
  periodDays: number;
  totalSessions: number;
  highIntentSessions: number;
  bySurface: Record<string, number>;
  topTools: { tool: string; count: number }[];
  recentSessions: AgentSessionRow[];
}

export interface AgentSessionRow {
  sessionId: string;
  surface: AgentSurface;
  transactionType: string;
  userMessageCount: number;
  intentScore: number;
  highIntent: boolean;
  toolsUsed: string[];
  summary: string | null;
  mapPath: string | null;
  updatedAtMs: number;
  notifiedAtMs: number | null;
}

function tsToMs(v: unknown): number {
  if (v instanceof Timestamp) return v.toMillis();
  if (v && typeof v === "object" && "toMillis" in v) {
    return (v as Timestamp).toMillis();
  }
  return 0;
}

export async function fetchAgentMetrics(days = 7): Promise<AgentMetricsSummary> {
  const since = Date.now() - days * 24 * 60 * 60 * 1000;
  const snap = await adminDb
    .collection("agent_conversations")
    .orderBy("updatedAt", "desc")
    .limit(500)
    .get();

  const rows: AgentSessionRow[] = [];
  const bySurface: Record<string, number> = {};
  const toolCounts = new Map<string, number>();
  let highIntentSessions = 0;

  for (const doc of snap.docs) {
    const data = doc.data();
    const updatedAtMs = tsToMs(data.updatedAt);
    if (updatedAtMs > 0 && updatedAtMs < since) continue;

    const surface = (data.surface as string) || "advisor";
    bySurface[surface] = (bySurface[surface] ?? 0) + 1;

    if (data.highIntent === true) highIntentSessions += 1;

    const toolsUsed = Array.isArray(data.toolsUsed)
      ? (data.toolsUsed as string[]).filter((t) => typeof t === "string")
      : [];
    for (const tool of toolsUsed) {
      toolCounts.set(tool, (toolCounts.get(tool) ?? 0) + 1);
    }

    rows.push({
      sessionId: doc.id,
      surface: surface as AgentSurface,
      transactionType: (data.transactionType as string) || "rent",
      userMessageCount: typeof data.userMessageCount === "number" ? data.userMessageCount : 0,
      intentScore: typeof data.intentScore === "number" ? data.intentScore : 0,
      highIntent: data.highIntent === true,
      toolsUsed,
      summary: typeof data.summary === "string" ? data.summary : null,
      mapPath: typeof data.mapPath === "string" ? data.mapPath : null,
      updatedAtMs,
      notifiedAtMs: tsToMs(data.notifiedAt) || null,
    });
  }

  const topTools = [...toolCounts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([tool, count]) => ({ tool, count }));

  return {
    periodDays: days,
    totalSessions: rows.length,
    highIntentSessions,
    bySurface,
    topTools,
    recentSessions: rows.slice(0, 25),
  };
}

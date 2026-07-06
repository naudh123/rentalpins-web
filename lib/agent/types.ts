/** Where the agent UI is mounted — adjusts tone and tool bias. */
export type AgentSurface = "advisor" | "map" | "showcase" | "project";

export interface AgentChatRequestBody {
  messages?: unknown[];
  sessionId?: string;
  surface?: AgentSurface;
  /** Active map module when surface=map */
  transactionType?: "rent" | "sale";
  /** Firestore project id when surface=project on a microsite */
  projectId?: string;
  /** Alternative to projectId — resolved server-side from city + slug */
  projectSlug?: string;
  /** City filter for projects index concierge */
  citySlug?: string;
}
/** Where the agent UI is mounted — adjusts tone and tool bias. */
export type AgentSurface = "advisor" | "map" | "showcase";

export interface AgentChatRequestBody {
  messages?: unknown[];
  sessionId?: string;
  surface?: AgentSurface;
  /** Active map module when surface=map */
  transactionType?: "rent" | "sale";
}
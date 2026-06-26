import { verifyAuthToken } from "@/lib/firebase-auth-server";
import {
  formatUserContextForPrompt,
  loadAgentUserContext,
} from "./user-context";

export async function resolveAgentAuthContext(request: Request): Promise<{
  userId?: string;
  userContextPrompt?: string;
}> {
  const token = await verifyAuthToken(request);
  if (!token?.uid) return {};

  const ctx = await loadAgentUserContext(token.uid);
  if (!ctx) return { userId: token.uid };

  return {
    userId: token.uid,
    userContextPrompt: formatUserContextForPrompt(ctx),
  };
}

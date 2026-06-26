function cleanEnv(value: string | undefined, fallback = ""): string {
  return (value ?? fallback).replace(/^\uFEFF/, "").trim();
}

export const openaiApiKey = cleanEnv(process.env.OPENAI_API_KEY);

/** Model for property agent (tools + chat). */
export const agentModel = cleanEnv(process.env.AI_AGENT_MODEL, "gpt-4o-mini");

export const isAgentConfigured = Boolean(openaiApiKey);

export const agentDailyMessageLimit = Number.parseInt(
  cleanEnv(process.env.AI_DAILY_MESSAGE_LIMIT, "40"),
  10
);

export const agentMaxSteps = Number.parseInt(cleanEnv(process.env.AI_AGENT_MAX_STEPS, "8"), 10);

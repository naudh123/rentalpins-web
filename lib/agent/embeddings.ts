import { embed, embedMany } from "ai";
import { openai } from "@ai-sdk/openai";
import { agentEmbeddingModel, isAgentConfigured } from "./env";

export const isEmbeddingConfigured = isAgentConfigured;

export function getEmbeddingModel() {
  return openai.embedding(agentEmbeddingModel);
}

export async function embedText(text: string): Promise<number[]> {
  if (!isEmbeddingConfigured) {
    throw new Error("Embeddings not configured. Set OPENAI_API_KEY.");
  }

  const { embedding } = await embed({
    model: getEmbeddingModel(),
    value: text.slice(0, 8000),
  });

  return embedding;
}

export async function embedTexts(texts: string[]): Promise<number[][]> {
  if (!isEmbeddingConfigured) {
    throw new Error("Embeddings not configured. Set OPENAI_API_KEY.");
  }

  const { embeddings } = await embedMany({
    model: getEmbeddingModel(),
    values: texts.map((t) => t.slice(0, 8000)),
  });

  return embeddings;
}

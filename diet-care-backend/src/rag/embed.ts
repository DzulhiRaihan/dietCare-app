import { createHash } from "crypto";
import { env } from "../config/env.js";

const hashText = (text: string) => {
  return createHash("sha256").update(text).digest("hex");
};

export const getContentHash = hashText;

export const generateEmbedding = async (text: string): Promise<number[]> => {
  const apiKey = env.embeddingApiKey;
  const endpoint = env.embeddingApiUrl;
  const model = env.embeddingModel;

  if (!apiKey || !endpoint || !model) {
    throw new Error("Missing embedding API configuration");
  }

  const maxAttempts = 3;

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    const isGemini = endpoint.includes("generativelanguage.googleapis.com");
    const isOpenAiStyle = endpoint.includes("/v1/");
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(isGemini ? { "x-goog-api-key": apiKey } : { Authorization: `Bearer ${apiKey}` }),
      },
      body: JSON.stringify({
        model,
        ...(isGemini
          ? {
              content: {
                parts: [{ text }],
              },
            }
          : isOpenAiStyle
          ? { input: text }
          : { prompt: text }),
      }),
    });

    if (!response.ok) {
      const body = await response.text();
      if (attempt === maxAttempts) {
        throw new Error(`Embedding API error: ${response.status} ${body}`);
      }
      await new Promise((resolve) => setTimeout(resolve, 500 * attempt));
      continue;
    }

    const payload = (await response.json()) as {
      embedding?: { values?: number[] } | number[];
      embeddingList?: { values?: number[] }[];
      embeddings?: number[][];
      data?: Array<{ embedding?: number[] }>;
    };
    const embedding =
      payload.embedding?.values ??
      payload.embeddingList?.[0]?.values ??
      (payload as { embedding?: number[] }).embedding ??
      payload.embeddings?.[0] ??
      payload.data?.[0]?.embedding;
    if (!embedding || !Array.isArray(embedding)) {
      throw new Error("Invalid embedding response");
    }

    return embedding;
  }

  throw new Error("Embedding API failed after retries");
};

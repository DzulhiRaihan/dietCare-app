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
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": apiKey,
      },
      body: JSON.stringify({
        model,
        content: {
          parts: [{ text }],
        },
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
      embedding?: { values?: number[] };
    };
    const embedding = payload.embedding?.values;
    if (!embedding) {
      throw new Error("Invalid embedding response");
    }

    return embedding;
  }

  throw new Error("Embedding API failed after retries");
};

import { env } from "../config/env.js";
import { HttpError } from "../utils/http-error.js";
import { buildUserContext } from "./user-context.service.js";
import { generateEmbedding } from "../rag/embed.js";
import * as nutritionRepo from "../repositories/nutrition.repository.js";
import * as recommendationRepo from "../repositories/recommendation.repository.js";

export type RecommendationPayload = {
  query: string;
  topK?: number;
  source?: string;
  language?: string;
  topic?: string;
  chapter?: string;
};

const unsafePatterns = [
  /diagnos(e|is)/i,
  /penyakit/i,
  /obat/i,
  /dosis/i,
  /terapi/i,
  /resep dokter/i,
  /hamil berisiko/i,
];

const isUnsafeQuery = (text: string) => unsafePatterns.some((pattern) => pattern.test(text));

const buildContext = (chunks: Array<{ title: string | null; content: string }>) => {
  return chunks
    .map((chunk, index) => {
      const heading = chunk.title ? `(${chunk.title})` : "";
      return `[#${index + 1}] ${heading}\n${chunk.content}`;
    })
    .join("\n\n");
};

const generateRecommendationText = async (question: string, context: string, userContext: string) => {
  const endpoint = env.generationApiUrl;
  const model = env.generationModel;

  if (!endpoint || !model) {
    throw new Error("Missing generation API configuration");
  }

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(env.generationApiKey ? { Authorization: `Bearer ${env.generationApiKey}` } : {}),
    },
    body: JSON.stringify({
      model,
      prompt: [
        "You are a diet and nutrition coach.",
        "Give practical, safe, and personalized recommendations.",
        "Use the user context and the provided references.",
        "If information is missing, say what you need.",
        "",
        "User Context:",
        userContext,
        "",
        "References:",
        context,
        "",
        `Question: ${question}`,
      ].join("\n"),
      stream: false,
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Generation API error: ${response.status} ${body}`);
  }

  const payload = (await response.json()) as { response?: string };
  const text = payload.response;
  if (!text) {
    throw new Error("Invalid generation response");
  }

  return text.trim();
};

export const createRecommendation = async (userId: string, payload: RecommendationPayload) => {
  const trimmed = payload.query?.trim();
  if (!trimmed) {
    throw new HttpError(400, "Query is required");
  }

  const userContext = await buildUserContext(userId);

  if (isUnsafeQuery(trimmed)) {
    const refusal = "Maaf, saya tidak dapat memberikan rekomendasi medis. Konsultasikan dengan tenaga kesehatan profesional.";
    const record = await recommendationRepo.createRecommendation({
      user: { connect: { id: userId } },
      content: refusal,
      context: userContext,
      isSafe: false,
      refusalReason: "medical_request",
    });
    return { recommendation: record };
  }

  const embedding = await generateEmbedding(trimmed);
  const filters: Record<string, string> = {};
  if (payload.source) filters.source = payload.source;
  if (payload.language) filters.language = payload.language;
  if (payload.topic) filters.topic = payload.topic;
  if (payload.chapter) filters.chapter = payload.chapter;
  
  const results = await nutritionRepo.searchByEmbedding(embedding, payload.topK ?? 5, filters as any);

  const context = buildContext(results);
  const recommendationText = await generateRecommendationText(
    trimmed,
    context,
    JSON.stringify(userContext)
  );

  const record = await recommendationRepo.createRecommendation({
    user: { connect: { id: userId } },
    content: recommendationText,
    sources: results.map((row) => ({
      id: row.id,
      title: row.title,
      chapter: row.chapter,
      topic: row.topic,
      language: row.language,
      source: row.source,
      score: row.score,
    })),
    context: userContext,
    isSafe: true,
  });

  return { recommendation: record };
};

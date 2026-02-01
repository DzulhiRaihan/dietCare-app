import { HttpError } from "../utils/http-error.js";
import { createHash } from "crypto";
import { env } from "../config/env.js";
import { generateEmbedding } from "../rag/embed.js";
import * as nutritionRepo from "../repositories/nutrition.repository.js";
import * as queryCacheRepo from "../repositories/query-embedding.repository.js";

export type VectorSearchResult = {
  id: string;
  title: string | null;
  content: string;
  chapter: string | null;
  topic: string | null;
  language: string | null;
  source: string | null;
  createdAt: Date;
  score: number;
};

export type NutritionSearchFilters = {
  source?: string;
  language?: string;
  topic?: string;
  chapter?: string;
};

export const searchNutrition = async (
  query: string,
  topK = 5,
  filters: NutritionSearchFilters = {}
) => {
  const cleaned = query?.trim();
  if (!cleaned) {
    throw new HttpError(400, "Query is required");
  }

  const normalizedTopK = Math.min(Math.max(topK, 1), 20);
  const queryHash = createHash("sha256").update(cleaned).digest("hex");
  const cached = await queryCacheRepo.findQueryEmbedding(queryHash);
  const ttlMs = env.queryEmbeddingTtlDays * 24 * 60 * 60 * 1000;
  const isExpired = cached
    ? Date.now() - new Date(cached.createdAt).getTime() > ttlMs
    : false;

  let embedding: number[];
  if (cached?.embedding && !isExpired) {
    embedding = queryCacheRepo.parseEmbeddingText(cached.embedding);
  } else {
    if (cached && isExpired) {
      await queryCacheRepo.deleteQueryEmbedding(queryHash);
    }
    embedding = await generateEmbedding(cleaned);
    await queryCacheRepo.upsertQueryEmbedding(queryHash, cleaned, embedding);
  }
  const results = await nutritionRepo.searchByEmbedding(embedding, normalizedTopK, filters);

  return { results };
};

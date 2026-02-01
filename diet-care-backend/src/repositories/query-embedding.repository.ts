import { randomUUID } from "crypto";
import { prisma } from "../database/prisma.js";

type QueryEmbeddingRow = {
  id: string;
  queryHash: string;
  queryText: string;
  embedding: string;
  createdAt: Date;
};

export const findQueryEmbedding = async (queryHash: string) => {
  const row = await prisma.$queryRaw<QueryEmbeddingRow[]>`
    SELECT id, "queryHash", "queryText", embedding::text as embedding, "createdAt"
    FROM "QueryEmbeddingCache"
    WHERE "queryHash" = ${queryHash}
    LIMIT 1
  `;
  return row[0] ?? null;
};

export const deleteQueryEmbedding = async (queryHash: string) => {
  return prisma.$executeRaw`
    DELETE FROM "QueryEmbeddingCache"
    WHERE "queryHash" = ${queryHash}
  `;
};

export const purgeExpired = async (olderThan: Date) => {
  return prisma.$executeRaw`
    DELETE FROM "QueryEmbeddingCache"
    WHERE "createdAt" < ${olderThan}
  `;
};

export const upsertQueryEmbedding = async (
  queryHash: string,
  queryText: string,
  embedding: number[]
) => {
  const vectorLiteral = `[${embedding.join(",")}]`;
  return prisma.$executeRaw`
    INSERT INTO "QueryEmbeddingCache" ("id", "queryHash", "queryText", "embedding")
    VALUES (${randomUUID()}, ${queryHash}, ${queryText}, ${vectorLiteral}::vector)
    ON CONFLICT ("queryHash")
    DO UPDATE SET "queryText" = EXCLUDED."queryText"
  `;
};

export const parseEmbeddingText = (embeddingText: string): number[] => {
  const trimmed = embeddingText.replace(/^\[/, "").replace(/\]$/, "");
  if (!trimmed) return [];
  return trimmed.split(",").map((value) => Number.parseFloat(value));
};

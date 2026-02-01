import { Prisma } from "@prisma/client";
import { prisma } from "../database/prisma.js";

type NutritionSearchRow = {
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

type NutritionSearchFilters = {
  source?: string;
  language?: string;
  topic?: string;
  chapter?: string;
};

export const searchByEmbedding = async (
  embedding: number[],
  limit: number,
  filters: NutritionSearchFilters = {}
): Promise<NutritionSearchRow[]> => {
  const vector = `[${embedding.join(",")}]`;

  const sourceClause = filters.source
    ? Prisma.sql`AND source = ${filters.source}`
    : Prisma.empty;
  const languageClause = filters.language
    ? Prisma.sql`AND language = ${filters.language}`
    : Prisma.empty;
  const topicClause = filters.topic
    ? Prisma.sql`AND topic = ${filters.topic}`
    : Prisma.empty;
  const chapterClause = filters.chapter
    ? Prisma.sql`AND chapter = ${filters.chapter}`
    : Prisma.empty;

  return prisma.$queryRaw<NutritionSearchRow[]>`
    SELECT
      id,
      title,
      content,
      chapter,
      topic,
      language,
      source,
      "createdAt",
      1 - (embedding <=> ${vector}::vector) AS score
    FROM "NutritionDocument"
    WHERE 1=1
    ${sourceClause}
    ${languageClause}
    ${topicClause}
    ${chapterClause}
    ORDER BY embedding <=> ${vector}::vector
    LIMIT ${limit}
  `;
};

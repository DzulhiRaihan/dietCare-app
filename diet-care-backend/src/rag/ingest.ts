import { readFile } from "fs/promises";
import { cleanText } from "./clean.js";
import { chunkText } from "./chunk.js";
import { generateEmbedding, getContentHash } from "./embed.js";
import type { Chunk, IngestOptions } from "./types.js";
import { Prisma } from "@prisma/client";
import { randomUUID } from "crypto";
import { prisma } from "../database/prisma.js";

const parseArgs = (): IngestOptions => {
  const args = process.argv.slice(2);
  const getArg = (name: string) => {
    const index = args.findIndex((arg) => arg === name);
    if (index === -1) return null;
    return args[index + 1] ?? null;
  };

  const inputPath = getArg("--input");
  if (!inputPath) {
    throw new Error("Missing --input path to raw text file");
  }

  return {
    inputPath,
    source: getArg("--source") ?? "nutrition_book",
    language: getArg("--lang") ?? "en",
    dryRun: args.includes("--dry-run"),
  };
};

const persistChunk = async (chunk: Chunk, embedding: number[]) => {
  const content = chunk.content.trim();
  const vectorLiteral = `[${embedding.join(",")}]`;

  return prisma.$executeRaw`
    INSERT INTO "NutritionDocument" ("id", "title", "content", "chapter", "topic", "language", "embedding", "source")
    VALUES (
      ${randomUUID()},
      ${chunk.metadata.chapter ?? chunk.metadata.topic ?? null},
      ${content},
      ${chunk.metadata.chapter ?? null},
      ${chunk.metadata.topic ?? null},
      ${chunk.metadata.language},
      ${vectorLiteral}::vector,
      ${chunk.metadata.source}
    )
  `;
};

const contentExists = async (content: string) => {
  const existing = await prisma.nutritionDocument.findFirst({
    where: { content },
    select: { id: true },
  });
  return Boolean(existing);
};

const ingest = async (options: IngestOptions) => {
  const rawText = await readFile(options.inputPath, "utf-8");
  const cleaned = cleanText(rawText);
  const chunks = chunkText(cleaned, {
    source: options.source,
    language: options.language,
  });

  const seen = new Set<string>();

  for (const chunk of chunks) {
    const normalized = chunk.content.trim();
    if (!normalized) continue;

    const hash = getContentHash(normalized);
    if (seen.has(hash)) continue;
    seen.add(hash);

    if (await contentExists(normalized)) {
      continue;
    }

    if (options.dryRun) {
      console.log(`[dry-run] chunk ${hash} (${normalized.length} chars)`);
      continue;
    }

    try {
      const embedding = await generateEmbedding(normalized);
      await persistChunk(chunk, embedding);
    } catch (error) {
      console.error("Failed to embed chunk", error);
    }
  }
};

// Usage:
// npx tsx src/rag/ingest.ts --input ./data/nutrition_book.txt --source nutrition_book --lang en
// npx tsx src/rag/ingest.ts --input ./data/nutrition_book.txt --dry-run
ingest(parseArgs())
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });

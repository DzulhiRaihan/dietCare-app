import { env } from "../config/env.js";
import { prisma } from "../database/prisma.js";
import { purgeExpired } from "../repositories/query-embedding.repository.js";

const run = async () => {
  const ttlMs = env.queryEmbeddingTtlDays * 24 * 60 * 60 * 1000;
  const cutoff = new Date(Date.now() - ttlMs);
  await purgeExpired(cutoff);
};

// Usage:
// npx tsx src/rag/cleanup-cache.ts
run()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });

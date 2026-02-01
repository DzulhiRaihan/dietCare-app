import type { Chunk, ChunkMetadata } from "./types.js";

const sentenceSplitter = (text: string) => {
  return text
    .split(/(?<=[.!?])\s+(?=[A-Z])/)
    .map((sentence) => sentence.trim())
    .filter(Boolean);
};

const estimateTokens = (text: string) => {
  // Heuristic: ~0.75 words per token for English.
  const words = text.trim().split(/\s+/).filter(Boolean);
  return Math.ceil(words.length / 0.75);
};

const detectChapter = (line: string) => {
  const match = line.match(/^(chapter\s+\d+[:.\s-]*)(.*)$/i);
  if (!match) return null;
  const title = match[2]?.trim();
  return title ? `Chapter ${(match[1] ?? "").replace(/chapter\s+/i, "").trim()} ${title}` : (match[1] ?? "").trim();
};

const detectBab = (line: string) => {
  const match = line.match(/^(bab\s+\d+[:.\s-]*)(.*)$/i);
  if (!match) return null;
  const title = match[2]?.trim();
  return title ? `Bab ${(match[1] ?? "").replace(/bab\s+/i, "").trim()} ${title}` : (match[1] ?? "").trim();
};

const detectHeading = (line: string) => {
  if (line.length > 90) return null;
  if (/^[A-Z0-9\s:,-]{4,}$/.test(line.trim())) return line.trim();
  if (/^(kata pengantar|daftar isi|pendahuluan|metodologi|kesimpulan)$/i.test(line.trim())) {
    return line.trim();
  }
  return null;
};

const inferTopic = (paragraph: string) => {
  const lower = paragraph.toLowerCase();
  if (lower.includes("protein")) return "protein";
  if (lower.includes("carbohydrate")) return "carbohydrates";
  if (lower.includes("fat ")) return "fat";
  if (lower.includes("calorie") || lower.includes("energy")) return "calories";
  if (lower.includes("fiber")) return "fiber";
  if (lower.includes("micronutrient") || lower.includes("vitamin") || lower.includes("mineral")) {
    return "micronutrients";
  }
  return null;
};

export const chunkText = (
  cleanedText: string,
  baseMetadata: Omit<ChunkMetadata, "chapter" | "topic">
): Chunk[] => {
  const paragraphs = cleanedText
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean);

  const chunks: Chunk[] = [];
  let currentChunk: string[] = [];
  let currentTokens = 0;
  let currentChapter: string | null = null;
  let lastTopic: string | null = null;

  const flushChunk = () => {
    if (!currentChunk.length) return;
    const content = currentChunk.join(" ").trim();
    if (!content) return;
    chunks.push({
      content,
      metadata: {
        ...baseMetadata,
        chapter: currentChapter,
        topic: lastTopic ?? inferTopic(content),
      },
    });
    currentChunk = [];
    currentTokens = 0;
  };

  const overlapTokensTarget = 60;
  const maxTokens = 380;

  paragraphs.forEach((paragraph) => {
    const chapter = detectChapter(paragraph) ?? detectBab(paragraph);
    const heading = detectHeading(paragraph);
    if (chapter) {
      currentChapter = chapter;
      flushChunk();
      return;
    }

    if (heading) {
      flushChunk();
      currentChunk.push(heading);
      currentTokens += estimateTokens(heading);
      lastTopic = inferTopic(heading) ?? lastTopic;
      return;
    }

    const sentences = sentenceSplitter(paragraph);
    sentences.forEach((sentence) => {
      const sentenceTokens = estimateTokens(sentence);
      if (currentTokens + sentenceTokens > maxTokens) {
        // Create overlap from the tail of the existing chunk.
        const overlap: string[] = [];
        let overlapTokens = 0;
        for (let i = currentChunk.length - 1; i >= 0; i -= 1) {
          overlapTokens += estimateTokens(currentChunk[i]!);
          overlap.unshift(currentChunk[i]!);
          if (overlapTokens >= overlapTokensTarget) break;
        }
        flushChunk();
        currentChunk = overlap;
        currentTokens = overlapTokens;
      }

      currentChunk.push(sentence);
      currentTokens += sentenceTokens;
      lastTopic = inferTopic(sentence) ?? lastTopic;
    });
  });

  flushChunk();
  return chunks;
};

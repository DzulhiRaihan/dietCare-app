import { ChatRole } from "@prisma/client";
import { env } from "../config/env.js";
import { HttpError } from "../utils/http-error.js";
import * as chatRepo from "../repositories/chat.repository.js";
import * as nutritionRepo from "../repositories/nutrition.repository.js";
import { generateEmbedding } from "../rag/embed.js";
import { buildUserContext } from "./user-context.service.js";

export type RagChatPayload = {
  sessionId: string;
  content: string;
  topK?: number;
  source?: string;
  language?: string;
  topic?: string;
  chapter?: string;
};

export type RagChatResponse = {
  userMessage: Awaited<ReturnType<typeof chatRepo.createMessage>>;
  assistantMessage: Awaited<ReturnType<typeof chatRepo.createMessage>>;
  sources: Array<{
    id: string;
    title: string | null;
    chapter: string | null;
    topic: string | null;
    language: string | null;
    source: string | null;
    score: number;
  }>;
};

const assertSessionAccess = (session: { userId: string | null; isGuest: boolean }, userId?: string) => {
  if (session.userId) {
    if (!userId) {
      throw new HttpError(401, "Unauthorized");
    }
    if (session.userId !== userId) {
      throw new HttpError(403, "You do not have access to this session");
    }
    return;
  }

  if (!session.isGuest) {
    throw new HttpError(403, "You do not have access to this session");
  }
};

const ensureNonEmptyContent = (content: string) => {
  if (!content || content.trim().length === 0) {
    throw new HttpError(400, "Message content cannot be empty");
  }
};

const buildContext = (chunks: Array<{ title: string | null; content: string }>) => {
  return chunks
    .map((chunk, index) => {
      const heading = chunk.title ? `(${chunk.title})` : "";
      return `[#${index + 1}] ${heading}\n${chunk.content}`;
    })
    .join("\n\n");
};

const buildUserContextBlock = (summary: Awaited<ReturnType<typeof buildUserContext>>) => {
  if (!summary.profile && !summary.plan) return "No user context available.";
  const lines: string[] = [];
  if (summary.profile) {
    lines.push(
      [
        "Profile:",
        summary.profile.gender ? `gender=${summary.profile.gender}` : null,
        summary.profile.age ? `age=${summary.profile.age}` : null,
        summary.profile.heightCm ? `heightCm=${summary.profile.heightCm}` : null,
        summary.profile.currentWeightKg ? `weightKg=${summary.profile.currentWeightKg}` : null,
        summary.profile.bmiCurrent ? `bmi=${summary.profile.bmiCurrent}` : null,
        summary.profile.activityLevel ? `activity=${summary.profile.activityLevel}` : null,
        summary.profile.dietGoal ? `goal=${summary.profile.dietGoal}` : null,
      ]
        .filter(Boolean)
        .join(", ")
    );
  }
  if (summary.plan) {
    lines.push(
      [
        "Plan:",
        summary.plan.dailyCalorieTarget ? `calories=${summary.plan.dailyCalorieTarget}` : null,
        summary.plan.proteinTarget ? `protein=${summary.plan.proteinTarget}g` : null,
        summary.plan.carbsTarget ? `carbs=${summary.plan.carbsTarget}g` : null,
        summary.plan.fatTarget ? `fat=${summary.plan.fatTarget}g` : null,
        summary.plan.targetWeight ? `targetWeight=${summary.plan.targetWeight}kg` : null,
        summary.plan.targetBmi ? `targetBmi=${summary.plan.targetBmi}` : null,
        summary.plan.planType ? `planType=${summary.plan.planType}` : null,
      ]
        .filter(Boolean)
        .join(", ")
    );
  }
  if (summary.recent) {
    lines.push(
      [
        "Recent:",
        summary.recent.latestWeightKg ? `latestWeight=${summary.recent.latestWeightKg}kg` : null,
        summary.recent.avgCalories7d ? `avgCalories7d=${summary.recent.avgCalories7d}` : null,
      ]
        .filter(Boolean)
        .join(", ")
    );
  }
  return lines.join("\n");
};

const isDietRelated = (text: string) => {
  const lower = text.toLowerCase();
  const keywords = [
    "diet",
    "nutrition",
    "gizi",
    "kalori",
    "protein",
    "lemak",
    "karbohidrat",
    "vitamin",
    "mineral",
    "berat",
    "weight",
    "bmi",
    "makan",
    "menu",
    "makanan",
    "porsi",
    "olahraga",
  ];
  return keywords.some((key) => lower.includes(key));
};

const buildChitChatPrompt = (question: string) => {
  return [
    "You are a friendly, concise assistant.",
    "If the user is just greeting or chatting, respond politely and briefly.",
    "Gently invite them to ask about diet, nutrition, or their health goals.",
    "answer the chat using indonesian language first.",
    "",
    `User: ${question}`,
  ].join("\n");
};

const generateAssistantResponse = async (
  question: string,
  context: string,
  userContext: string
) => {
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
      prompt: isDietRelated(question)
        ? [
            "You are a diet and nutrition assistant.",
            "Use only the provided context to answer the user's question.",
            "If the context does not contain the answer, say you don't know.",
            "Keep answers concise and practical.",
            "",
            "User Context:",
            userContext,
            "",
            "Context:",
            context,
            "",
            `Question: ${question}`,
          ].join("\n")
        : buildChitChatPrompt(question),
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

export const createRagChatMessage = async (
  userId: string | undefined,
  payload: RagChatPayload
): Promise<RagChatResponse> => {
  ensureNonEmptyContent(payload.content);

  const session = await chatRepo.findSessionById(payload.sessionId);
  if (!session) {
    throw new HttpError(404, "Session not found");
  }

  assertSessionAccess(session, userId);

  const userMessage = await chatRepo.createMessage({
    sessionId: session.id,
    role: ChatRole.USER,
    content: payload.content.trim(),
  });

  const userContext = userId ? await buildUserContext(userId) : null;

  const embedding = await generateEmbedding(payload.content.trim());
  const filters: Record<string, string> = {};
  if (payload.source !== undefined) filters.source = payload.source;
  if (payload.language !== undefined) filters.language = payload.language;
  if (payload.topic !== undefined) filters.topic = payload.topic;
  if (payload.chapter !== undefined) filters.chapter = payload.chapter;

  const results = await nutritionRepo.searchByEmbedding(embedding, payload.topK ?? 5, filters);

  const context = buildContext(results);
  const assistantText = await generateAssistantResponse(
    payload.content.trim(),
    context,
    userContext ? buildUserContextBlock(userContext) : "No user context available."
  );

  const assistantMessage = await chatRepo.createMessage({
    sessionId: session.id,
    role: ChatRole.ASSISTANT,
    content: assistantText,
  });

  return {
    userMessage,
    assistantMessage,
    sources: results.map((row) => ({
      id: row.id,
      title: row.title,
      chapter: row.chapter,
      topic: row.topic,
      language: row.language,
      source: row.source,
      score: row.score,
    })),
  };
};

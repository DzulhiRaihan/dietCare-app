import "dotenv/config";

const port = Number.parseInt(process.env.PORT ?? "3000", 10);
const nodeEnv = process.env.NODE_ENV ?? "development";

const databaseUrl = process.env.DATABASE_URL;
const directUrl = process.env.DIRECT_URL;
const jwtSecret = process.env.JWT_SECRET;
const accessTokenTtl: string = process.env.ACCESS_TOKEN_TTL ?? "15m";
const refreshTokenTtlDays = Number.parseInt(process.env.REFRESH_TOKEN_TTL_DAYS ?? "30", 10);
const frontendUrl = process.env.FRONTEND_URL ?? "http://localhost:5173";
const cookieSecure = process.env.COOKIE_SECURE === "true" || nodeEnv === "production";
const embeddingApiKey = process.env.EMBEDDING_API_KEY;
const embeddingApiUrl = process.env.EMBEDDING_API_URL;
const embeddingModel = process.env.EMBEDDING_MODEL;
const generationApiKey = process.env.GENERATION_API_KEY;
const generationApiUrl = process.env.GENERATION_API_URL;
const generationModel = process.env.GENERATION_MODEL;
const queryEmbeddingTtlDays = Number.parseInt(process.env.QUERY_EMBEDDING_TTL_DAYS ?? "30", 10);

if (!databaseUrl) {
  throw new Error("DATABASE_URL is not set");
}
if (!jwtSecret) {
  throw new Error("JWT_SECRET is not set");
}

export const env = {
  port,
  nodeEnv,
  databaseUrl,
  directUrl,
  jwtSecret,
  accessTokenTtl,
  refreshTokenTtlDays,
  frontendUrl,
  cookieSecure,
  embeddingApiKey,
  embeddingApiUrl,
  embeddingModel,
  generationApiKey,
  generationApiUrl,
  generationModel,
  queryEmbeddingTtlDays,
};

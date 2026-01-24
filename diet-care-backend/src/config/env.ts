import "dotenv/config";

const port = Number.parseInt(process.env.PORT ?? "3000", 10);
const nodeEnv = process.env.NODE_ENV ?? "development";

const databaseUrl = process.env.DATABASE_URL;
const directUrl = process.env.DIRECT_URL;
const jwtSecret = process.env.JWT_SECRET;

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
};

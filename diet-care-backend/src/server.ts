import "dotenv/config";
import app from "./app.js";
import { env } from "./config/env.js";

const server = app.listen(env.port, () => {
  console.log(`Server listening on http://localhost:${env.port}`);
});

const shutdown = (signal: string) => {
  console.log(`${signal} received. Shutting down...`);
  server.close(() => {
    process.exit(0);
  });
};

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));

export default server;

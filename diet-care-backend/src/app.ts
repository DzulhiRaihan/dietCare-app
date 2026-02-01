/// <reference types="node" />
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import routes from "./routes/index.js";
import { errorHandler, notFound } from "./middlewares/error.middleware.js";
import { env } from "./config/env.js";
import { apiLogger } from "./middlewares/api-logger.middleware.js";

const app = express();

app.use(
  cors({
    origin: env.frontendUrl,
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json({ strict: false }));
app.use(express.urlencoded({ extended: true }));
app.use(apiLogger);

app.use(routes);

app.use(notFound);
app.use(errorHandler);

export default app;

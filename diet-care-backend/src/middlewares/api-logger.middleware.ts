import type { NextFunction, Request, Response } from "express";

export const apiLogger = (req: Request, res: Response, next: NextFunction) => {
  const startedAt = Date.now();

  res.on("finish", () => {
    const durationMs = Date.now() - startedAt;
    const userId = req.user?.id ?? "guest";
    const logLine = [
      req.method,
      req.originalUrl,
      res.statusCode,
      `${durationMs}ms`,
      `user=${userId}`,
    ].join(" ");
    console.log(logLine);
  });

  next();
};

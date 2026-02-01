import { Router } from "express";
import { sendSuccess } from "../utils/api-response.js";

const router = Router();

router.get("/health", (_req, res) => {
  return sendSuccess(res, 200, { status: "ok" });
});

export default router;

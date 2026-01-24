import { Router } from "express";
import { optionalJwtMiddleware } from "../middlewares/jwt.middleware.js";
import {
  createSessionController,
  createMessageController,
  getHistoryController,
} from "../controllers/chat.controller.js";

const router = Router();

router.use(optionalJwtMiddleware);

router.post("/session", createSessionController);
router.post("/message", createMessageController);
router.get("/history/:sessionId", getHistoryController);

export default router;

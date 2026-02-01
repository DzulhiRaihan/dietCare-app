import { Router } from "express";
import { searchNutritionController, searchNutritionQueryController } from "../controllers/rag.controller.js";
import { ragChatMessageController } from "../controllers/rag-chat.controller.js";
import { csrfMiddleware } from "../middlewares/csrf.middleware.js";
import { optionalJwtMiddleware } from "../middlewares/jwt.middleware.js";

const router = Router();

router.use(optionalJwtMiddleware);
router.post("/rag/search", searchNutritionController);
router.post("/rag/chat", ragChatMessageController);
router.use(csrfMiddleware);
router.get("/rag/search", searchNutritionQueryController);

export default router;

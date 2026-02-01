import { Router } from "express";
import { createRecommendationController } from "../controllers/recommendation.controller.js";
import { jwtMiddleware } from "../middlewares/jwt.middleware.js";
import { requireAuth } from "../middlewares/auth.middleware.js";
import { csrfMiddleware } from "../middlewares/csrf.middleware.js";

const router = Router();

router.use(jwtMiddleware, requireAuth);
router.use(csrfMiddleware);

router.post("/recommendation", createRecommendationController);

export default router;

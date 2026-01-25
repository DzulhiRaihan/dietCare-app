import { Router } from "express";
import { jwtMiddleware } from "../middlewares/jwt.middleware.js";
import { requireAuth } from "../middlewares/auth.middleware.js";
import { createDietPlanController, getDietPlanController } from "../controllers/diet-plan.controller.js";

const router = Router();

router.use(jwtMiddleware, requireAuth);

router.post("/diet-plan", createDietPlanController);
router.get("/diet-plan", getDietPlanController);

export default router;

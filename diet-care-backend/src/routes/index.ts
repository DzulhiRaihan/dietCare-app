import { Router } from "express";
import healthRouter from "./health.route.js";
import authRouter from "./auth.route.js";
import userRouter from "./user.routes.js";
import chatRouter from "./chat.routes.js";
import dietPlanRouter from "./diet-plan.routes.js";
import ragRouter from "./rag.routes.js";
import recommendationRouter from "./recommendation.routes.js";

const router = Router();

router.use(healthRouter);
router.use("/auth", authRouter);
router.use("/user", userRouter);
router.use("/chat", chatRouter);
router.use(dietPlanRouter);
router.use(ragRouter);
router.use(recommendationRouter);

export default router;

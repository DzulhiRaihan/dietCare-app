import { Router } from "express";
import { jwtMiddleware } from "../middlewares/jwt.middleware.js";
import { requireAuth } from "../middlewares/auth.middleware.js";
import { loginController, meController, registerController } from "../controllers/auth.controller.js";

const router = Router();

router.post("/register", registerController);
router.post("/login", loginController);
router.get("/me", jwtMiddleware, requireAuth, meController);

export default router;

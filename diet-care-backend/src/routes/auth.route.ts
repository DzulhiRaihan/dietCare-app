import { Router } from "express";
import { jwtMiddleware } from "../middlewares/jwt.middleware.js";
import { requireAuth } from "../middlewares/auth.middleware.js";
import { csrfMiddleware } from "../middlewares/csrf.middleware.js";
import {
  loginController,
  registerController,
  meController,
  refreshController,
  logoutController,
  csrfController,
} from "../controllers/auth.controller.js";

const router = Router();

router.get("/csrf", csrfController);
router.post("/register", registerController);
router.post("/login", loginController);
router.post("/refresh", refreshController);
router.post("/logout", csrfMiddleware, logoutController);
router.get("/me", jwtMiddleware, requireAuth, meController);

export default router;

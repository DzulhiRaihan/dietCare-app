import { Router } from "express";
import { jwtMiddleware } from "../middlewares/jwt.middleware.js";
import { requireAuth } from "../middlewares/auth.middleware.js";
import { csrfMiddleware } from "../middlewares/csrf.middleware.js";
import {
  createProfileController,
  getProfileController,
  updateProfileController,
} from "../controllers/user.controller.js";

const router = Router();

router.use(jwtMiddleware, requireAuth);
router.use(csrfMiddleware);

router.post("/profile", createProfileController);
router.get("/profile", getProfileController);
router.patch("/profile", updateProfileController);

export default router;

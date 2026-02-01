import type { NextFunction, Request, Response } from "express";
import { createUserProfile, getUserProfile, updateUserProfile } from "../services/user.service.js";
import type { UserProfilePayload } from "../services/user.service.js";
import { sendError, sendSuccess } from "../utils/api-response.js";

export const createProfileController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return sendError(res, 401, "Unauthorized");
    }

    const payload = req.body as UserProfilePayload;
    const profile = await createUserProfile(userId, payload);
    return sendSuccess(res, 201, profile);
  } catch (error) {
    return next(error);
  }
};

export const getProfileController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return sendError(res, 401, "Unauthorized");
    }

    const profile = await getUserProfile(userId);
    return sendSuccess(res, 200, profile);
  } catch (error) {
    return next(error);
  }
};

export const updateProfileController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return sendError(res, 401, "Unauthorized");
    }

    const payload = req.body as UserProfilePayload;
    const profile = await updateUserProfile(userId, payload);
    return sendSuccess(res, 200, profile);
  } catch (error) {
    return next(error);
  }
};

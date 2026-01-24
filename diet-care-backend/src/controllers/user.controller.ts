import type { NextFunction, Request, Response } from "express";
import { createUserProfile, getUserProfile, updateUserProfile } from "../services/user.service.js";
import type { UserProfilePayload } from "../services/user.service.js";

export const createProfileController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const payload = req.body as UserProfilePayload;
    const profile = await createUserProfile(userId, payload);
    return res.status(201).json(profile);
  } catch (error) {
    return next(error);
  }
};

export const getProfileController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const profile = await getUserProfile(userId);
    return res.status(200).json(profile);
  } catch (error) {
    return next(error);
  }
};

export const updateProfileController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const payload = req.body as UserProfilePayload;
    const profile = await updateUserProfile(userId, payload);
    return res.status(200).json(profile);
  } catch (error) {
    return next(error);
  }
};

import type { Response } from "express";

export type ApiResponse<T> = {
  success: boolean;
  data: T;
  message: string | null;
};

export const sendSuccess = <T>(
  res: Response,
  status: number,
  data: T,
  message: string | null = null
) => {
  return res.status(status).json({ success: true, data, message } satisfies ApiResponse<T>);
};

export const sendError = (
  res: Response,
  status: number,
  message: string,
  data: null = null
) => {
  return res
    .status(status)
    .json({ success: false, data, message } satisfies ApiResponse<null>);
};

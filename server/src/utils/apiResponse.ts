import { Response } from "express";

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string | any;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };
}

export const sendSuccess = <T>(
  res: Response,
  data?: T,
  message?: string,
  statusCode = 200,
  meta?: ApiResponse["meta"]
) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
    meta,
  });
};

export const sendError = (
  res: Response,
  error: string | any,
  statusCode = 400
) => {
  return res.status(statusCode).json({
    success: false,
    error: typeof error === "string" ? error : error?.message || "An error occurred",
    details: typeof error === "object" ? error : undefined,
  });
};


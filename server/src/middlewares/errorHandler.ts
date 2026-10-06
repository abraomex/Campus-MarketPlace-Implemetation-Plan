import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { sendError } from "../utils/apiResponse";

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
) => {
  console.error("Unhandled Error:", err);

  if (err instanceof ZodError) {
    const errorMessages = err.issues.map(
      (issue) => `${issue.path.join(".")}: ${issue.message}`
    );
    return sendError(res, errorMessages.join(", "), 422);
  }

  // Prisma unique constraint violation
  if (err.code === "P2002") {
    const target = Array.isArray(err.meta?.target)
      ? err.meta.target.join(", ")
      : err.meta?.target || "field";
    return sendError(res, `A record with this ${target} already exists.`, 409);
  }

  // Prisma record not found
  if (err.code === "P2025") {
    return sendError(res, "Requested record was not found.", 404);
  }

  const statusCode = err.statusCode || err.status || 500;
  const message = err.message || "Internal server error";

  return sendError(res, message, statusCode);
};


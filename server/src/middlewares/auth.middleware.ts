import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { sendError } from "../utils/apiResponse";

export interface TokenPayload {
  userId: string;
  email: string;
  role: "STUDENT" | "ADMIN";
}

declare global {
  namespace Express {
    interface Request {
      user?: TokenPayload;
    }
  }
}

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return sendError(res, "Access denied. No authentication token provided.", 401);
  }

  const token = authHeader.split(" ")[1];
  const secret = process.env.JWT_SECRET || "super-secret-jwt-key-for-campus-marketplace";

  try {
    const decoded = jwt.verify(token, secret) as TokenPayload;
    req.user = decoded;
    next();
  } catch (err: any) {
    if (err.name === "TokenExpiredError") {
      return sendError(res, "Authentication token has expired. Please log in again.", 401);
    }
    return sendError(res, "Invalid authentication token.", 401);
  }
};

export const authorizeRoles = (...allowedRoles: Array<"STUDENT" | "ADMIN">) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return sendError(res, "Unauthorized", 401);
    }

    if (!allowedRoles.includes(req.user.role)) {
      return sendError(res, "Forbidden: You do not have permission to perform this action.", 403);
    }

    next();
  };
};


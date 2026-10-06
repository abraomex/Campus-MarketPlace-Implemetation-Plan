import { Router } from "express";
import { AuthController } from "./auth.controller";
import { validateBody } from "../../middlewares/validate.middleware";
import { registerSchema, loginSchema } from "./auth.schema";
import { authenticate } from "../../middlewares/auth.middleware";

export const authRouter = Router();

authRouter.post("/register", validateBody(registerSchema), AuthController.register);
authRouter.post("/login", validateBody(loginSchema), AuthController.login);
authRouter.get("/me", authenticate, AuthController.getMe);


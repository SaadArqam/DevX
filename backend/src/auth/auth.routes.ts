import { Router } from "express";
import { AuthController } from "./auth.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate.middleware";
import { registerSchema, loginSchema } from "./auth.schema";
import { authRateLimiter } from "../middlewares/rateLimiter.middleware";

const router = Router();

router.post("/register", authRateLimiter, validate(registerSchema), AuthController.register);
router.post("/login", authRateLimiter, validate(loginSchema), AuthController.login);
router.post("/refresh", AuthController.refresh);
router.post("/logout", AuthController.logout);
router.post("/logout-all", authMiddleware, AuthController.logoutAll);

export default router;

import { Router } from "express";
import healthRoutes from "./health.routes";
import authRoutes from "../auth/auth.routes";
import blogRoutes from "../blog/blog.routes";
import commentRoutes from "../comment/comment.routes";
import engagementRoutes from "../engagement/engagement.routes";
import { authRateLimiter } from "../middlewares/rateLimiter.middleware";

const router = Router();

router.use("/", healthRoutes);
router.use("/auth", authRateLimiter, authRoutes);
router.use("/blogs", blogRoutes);
router.use("/comments", commentRoutes);
router.use("/engagement", engagementRoutes);

export default router;

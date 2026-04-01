import { Router } from "express";
import healthRoutes from "./health.routes";
import authRoutes from "../auth/auth.routes";
import blogRoutes from "../blog/blog.routes";
import engagementRoutes from "../engagement/engagement.routes";

const router = Router();

router.use("/", healthRoutes);
router.use("/auth", authRoutes);
router.use("/blogs", blogRoutes);
router.use("/users", engagementRoutes);

export default router;

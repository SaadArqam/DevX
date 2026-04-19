import { Router } from "express";
import healthRoutes from "./health.routes";
import authRoutes from "../auth/auth.routes";
import blogRoutes from "../blog/blog.routes";
import commentRoutes from "../comment/comment.routes";
import engagementRoutes from "../engagement/engagement.routes";

const router = Router();

console.log("Route mounted: /auth");
router.use("/auth", authRoutes);

console.log("Route mounted: /blogs");
router.use("/blogs", blogRoutes);

console.log("Route mounted: /comments");
router.use("/comments", commentRoutes);

console.log("Route mounted: /engagement");
router.use("/engagement", engagementRoutes);

router.use("/", healthRoutes);

export default router;

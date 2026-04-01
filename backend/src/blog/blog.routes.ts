import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import {
  blogCreate,
  blogGet,
  blogDelete,
  blogUpdate,
  blogTogglePublish,
  blogGetPublished,
  blogGetById,
} from "./blog.controller";
import commentRoutes from "../comment/comment.routes"
import {
  toggleLikeController,
  toggleBookmarkController,
  getLikeCountController,
} from "../engagement/engagement.controller";



const blogRoutes = Router();

blogRoutes.post("/", authMiddleware, blogCreate);

blogRoutes.get("/me", authMiddleware, blogGet);
blogRoutes.get("/:id", blogGetById);
blogRoutes.get("/", blogGetPublished);

blogRoutes.patch("/:id", authMiddleware, blogUpdate);

blogRoutes.delete("/:id", authMiddleware, blogDelete);

blogRoutes.patch("/:id/publish", authMiddleware, blogTogglePublish);

commentRoutes.use("/:blogId/comments", commentRoutes)
// Engagement endpoints
blogRoutes.post("/:blogId/like", authMiddleware, toggleLikeController);
blogRoutes.post("/:blogId/bookmark", authMiddleware, toggleBookmarkController);
blogRoutes.get("/:blogId/likes/count", getLikeCountController);
export default blogRoutes;

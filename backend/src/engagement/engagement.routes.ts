import { Router } from "express";
import { EngagementController } from "./engagement.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate.middleware";
import { engagementSchema } from "./engagement.schema";

const router = Router();

router.post("/like/:blogId", authMiddleware, validate(engagementSchema), EngagementController.toggleLike);
router.post("/bookmark/:blogId", authMiddleware, validate(engagementSchema), EngagementController.toggleBookmark);
router.get("/bookmarks", authMiddleware, EngagementController.getBookmarks);
router.get("/like-count/:blogId", validate(engagementSchema), EngagementController.getLikeCount);

export default router;

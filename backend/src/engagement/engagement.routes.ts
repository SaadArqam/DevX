import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { getUserBookmarksController } from "./engagement.controller";

const router = Router();

// GET /users/me/bookmarks
router.get("/me/bookmarks", authMiddleware, getUserBookmarksController);

export default router;

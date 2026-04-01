import { Request, Response } from "express";
import { AuthRequest } from "../middlewares/auth.middleware";
import { asyncHandler } from "../utils/asyncHandler";
import {
  toggleLike,
  toggleBookmark,
  getLikeCount,
  getUserBookmarks,
} from "./engagement.service";

export const toggleLikeController = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const blogId = Number(req.params.blogId);
    const userId = req.user!.userId;

    const result = await toggleLike(blogId, userId);

    res.status(200).json({ success: true, liked: result.liked });
  }
);

export const toggleBookmarkController = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const blogId = Number(req.params.blogId);
    const userId = req.user!.userId;

    const result = await toggleBookmark(blogId, userId);

    res.status(200).json({ success: true, bookmarked: result.bookmarked });
  }
);

export const getLikeCountController = asyncHandler(
  async (req: Request, res: Response) => {
    const blogId = Number(req.params.blogId);
    const count = await getLikeCount(blogId);
    res.status(200).json({ success: true, count });
  }
);

export const getUserBookmarksController = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const userId = req.user!.userId;
    const data = await getUserBookmarks(userId);
    res.status(200).json({ success: true, data });
  }
);

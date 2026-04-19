import { Router } from "express";
import { CommentController } from "./comment.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate.middleware";
import { createCommentSchema, commentIdSchema, updateCommentSchema, blogIdParamSchema } from "./comment.schema";

const router = Router();

router.get("/blog/:blogId", validate({ params: blogIdParamSchema }), CommentController.getByBlog);

// New correct route mapping to POST /api/v1/comments
router.post("/", authMiddleware, validate({ body: createCommentSchema }), CommentController.create);

// Keep legacy briefly if anything still hits it
router.post("/blog/:blogId", authMiddleware, validate({ params: blogIdParamSchema, body: createCommentSchema }), CommentController.create);

router.put("/:id", authMiddleware, validate({ params: commentIdSchema, body: updateCommentSchema }), CommentController.update);
router.delete("/:id", authMiddleware, validate({ params: commentIdSchema }), CommentController.delete);

export default router;

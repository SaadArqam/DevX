import { Router } from "express";
import { CommentController } from "./comment.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate.middleware";
import { createCommentSchema, commentIdSchema, updateCommentSchema } from "./comment.schema";

const router = Router();

router.get("/blog/:blogId", validate(createCommentSchema.pick({ params: true })), CommentController.getByBlog);
router.post("/blog/:blogId", authMiddleware, validate(createCommentSchema), CommentController.create);
router.put("/:id", authMiddleware, validate(updateCommentSchema), CommentController.update);
router.delete("/:id", authMiddleware, validate(commentIdSchema), CommentController.delete);

export default router;

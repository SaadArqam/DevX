import { Router } from "express";
import { BlogController } from "./blog.controller";
import { authMiddleware, optionalAuth } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate.middleware";
import { createBlogSchema, updateBlogSchema, blogIdSchema, blogQuerySchema } from "./blog.schema";

const router = Router();

router.get("/", optionalAuth, validate(blogQuerySchema), BlogController.getPublished);
router.get("/my-blogs", authMiddleware, validate(blogQuerySchema), BlogController.getMyBlogs);
router.get("/:id", optionalAuth, validate(blogIdSchema), BlogController.getById);

router.post("/", authMiddleware, validate(createBlogSchema), BlogController.create);
router.put("/:id", authMiddleware, validate(updateBlogSchema), BlogController.update);
router.delete("/:id", authMiddleware, validate(blogIdSchema), BlogController.delete);

export default router;

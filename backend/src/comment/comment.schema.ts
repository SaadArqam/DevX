import { z } from "zod";

export const createCommentSchema = z.object({
  blogId: z.union([z.number(), z.string().regex(/^\d+$/).transform(Number)]),
  content: z.string().min(1).max(1000),
  parentId: z.number().optional().nullable(),
});

export const blogIdParamSchema = z.object({
  blogId: z.string().regex(/^\d+$/).transform(Number),
});

export const commentIdSchema = z.object({
  id: z.string().regex(/^\d+$/).transform(Number),
});

export const updateCommentSchema = z.object({
  content: z.string().min(1).max(1000),
});

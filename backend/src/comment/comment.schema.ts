import { z } from "zod";

export const createCommentSchema = z.object({
  params: z.object({
    blogId: z.string().regex(/^\d+$/).transform(Number),
  }),
  body: z.object({
    content: z.string().min(1).max(1000),
    parentId: z.number().optional(),
  }),
});

export const commentIdSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/).transform(Number),
  }),
});

export const updateCommentSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/).transform(Number),
  }),
  body: z.object({
    content: z.string().min(1).max(1000),
  }),
});

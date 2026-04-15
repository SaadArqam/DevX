import { z } from "zod";

export const engagementSchema = z.object({
  params: z.object({
    blogId: z.string().regex(/^\d+$/).transform(Number),
  }),
});

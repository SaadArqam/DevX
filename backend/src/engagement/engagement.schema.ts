import { z } from "zod";

export const engagementSchema = z.object({
  blogId: z.union([z.number(), z.string().regex(/^\d+$/).transform(Number)]),
});

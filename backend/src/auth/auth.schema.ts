import { z } from "zod";

export const registerSchema = z.object({
  body: z.object({
    name: z.string().min(2).max(50),
    email: z.string().email(),
    password: z.string().min(6).max(100),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(6),
  }),
});

export const refreshSchema = z.object({
  // No body needed if using cookies, but added for flexibility
  body: z.object({
    refreshToken: z.string().optional(),
  }).optional(),
});

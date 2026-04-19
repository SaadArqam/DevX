import rateLimit from "express-rate-limit";
import { Request, Response } from "express";

const rateLimitResponse = (_req: Request, res: Response) => {
  res.status(429).json({
    success: false,
    message: "Too many requests, please try again later",
  });
};

/**
 * Global API rate limiter: 100 requests per 15 minutes per IP
 */
export const apiRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  handler: rateLimitResponse,
});

/**
 * Stricter limiter for auth routes: 10 requests per 15 minutes per IP
 */
export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === "development" ? 1000 : 10,
  standardHeaders: true,
  legacyHeaders: false,
  handler: rateLimitResponse,
});

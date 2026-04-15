import { Request, Response, NextFunction } from "express";
import { RateLimiterRedis } from "rate-limiter-flexible";
import redisClient from "../utils/redis";
import { ApiError } from "../utils/ApiError";
import logger from "../utils/logger";
import { env } from "../config/env";

const rateLimiter = new RateLimiterRedis({
  storeClient: redisClient,
  keyPrefix: "middleware",
  points: 10, // 10 requests
  duration: 1, // per 1 second by default
});

export const createRateLimiter = (points: number, duration: number, prefix: string) => {
  const limiter = new RateLimiterRedis({
    storeClient: redisClient,
    keyPrefix: prefix,
    points,
    duration,
  });

  return async (req: Request, res: Response, next: NextFunction) => {
    if (!env.REDIS_URL) {
      return next(); // Skip if Redis is info configured
    }

    try {
      await limiter.consume(req.ip || "unknown");
      next();
    } catch (rejRes) {
      logger.warn(`Rate limit exceeded for IP: ${req.ip} on ${prefix}`);
      throw new ApiError(429, "Too many requests, please try again later");
    }
  };
};

export const authRateLimiter = createRateLimiter(5, 60 * 15, "auth_limit"); // 5 requests per 15 mins
export const apiRateLimiter = createRateLimiter(100, 60, "api_limit"); // 100 requests per minute

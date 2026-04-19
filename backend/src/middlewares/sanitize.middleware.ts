import { Request, Response, NextFunction } from "express";

/**
 * Basic XSS sanitization middleware.
 * Strips dangerous HTML from all string fields in req.body recursively.
 * 
 * NOTE: Install `xss` package: npm install xss @types/xss
 * Until installed, this middleware uses a simple regex-based strip.
 */

function stripHTMLTags(value: string): string {
  // Remove script tags and their content
  return value
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    // Remove all other HTML tags
    .replace(/<[^>]+>/g, "")
    // Remove javascript: protocols
    .replace(/javascript:/gi, "")
    // Remove on* event handlers
    .replace(/on\w+\s*=\s*(['"])[^'"]*\1/gi, "")
    .trim();
}

function sanitizeObject(obj: unknown): unknown {
  if (typeof obj === "string") {
    return stripHTMLTags(obj);
  }
  if (Array.isArray(obj)) {
    return obj.map(sanitizeObject);
  }
  if (obj !== null && typeof obj === "object") {
    const sanitized: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(obj)) {
      sanitized[key] = sanitizeObject(value);
    }
    return sanitized;
  }
  return obj;
}

export const sanitizeMiddleware = (
  req: Request,
  _res: Response,
  next: NextFunction
): void => {
  if (req.body && typeof req.body === "object") {
    req.body = sanitizeObject(req.body);
  }
  next();
};

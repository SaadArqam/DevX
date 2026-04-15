import { Request, Response, NextFunction } from "express";
import { AnyZodObject, ZodError } from "zod";
import { ApiError } from "../utils/ApiError";

export const validate =
  (schema: { body?: AnyZodObject; query?: AnyZodObject; params?: AnyZodObject }) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      if (schema.body) {
        req.body = schema.body.parse(req.body);
      }
      if (schema.query) {
        req.query = schema.query.parse(req.query) as any;
      }
      if (schema.params) {
        req.params = schema.params.parse(req.params) as any;
      }
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMessages = error.errors.map((issue) => ({
          path: issue.path.join("."),
          message: issue.message,
        }));
        throw new ApiError(400, "Validation failed", errorMessages);
      }
      next(error);
    }
  };

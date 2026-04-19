import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { ApiError } from "./ApiError";

export interface JwtPayload {
  userId: number;
  role: string;
}

export const generateAccessToken = (payload: JwtPayload): string => {
  return jwt.sign(payload, env.ACCESS_TOKEN_SECRET, {
    expiresIn: env.JWT_ACCESS_EXPIRY as jwt.SignOptions["expiresIn"],
  });
};

export const verifyAccessToken = (token: string): JwtPayload => {
  try {
    return jwt.verify(token, env.ACCESS_TOKEN_SECRET) as JwtPayload;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new ApiError(401, "Access token expired");
    }
    if (error instanceof jwt.JsonWebTokenError) {
      throw new ApiError(401, "Invalid access token");
    }
    throw new ApiError(401, "Token verification failed");
  }
};
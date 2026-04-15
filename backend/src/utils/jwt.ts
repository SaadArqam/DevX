import jwt from "jsonwebtoken";
import { ApiError } from "./ApiError";

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || "access_secret";

export const generateAccessToken = (payload: { userId: number; role: string }) => {
  return jwt.sign(payload, ACCESS_TOKEN_SECRET, {
    expiresIn: "15m",
  });
};

export const verifyAccessToken = (token: string) => {
  try {
    return jwt.verify(token, ACCESS_TOKEN_SECRET) as {
      userId: number;
      role: string;
    };
  } catch (error) {
    throw new ApiError(401, "Invalid or expired access token");
  }
};
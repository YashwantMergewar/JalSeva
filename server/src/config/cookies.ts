import type { CookieOptions } from "express";
import { config } from "./env.js";

export const refreshTokenCookieName = "refreshToken";

export const refreshTokenCookieOptions: CookieOptions = {
  httpOnly: true,
  secure: config.NODE_ENV === "production",
  sameSite: config.NODE_ENV === "production" ? "strict" : "lax",
  path: "/api/users",
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

export const clearRefreshTokenCookieOptions: CookieOptions = {
  ...refreshTokenCookieOptions,
  maxAge: 0,
};

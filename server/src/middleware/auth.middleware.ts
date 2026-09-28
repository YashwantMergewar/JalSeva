import type { NextFunction, Request, Response } from "express";
import { ApiError } from "../utils/ApiError.js";
import { verifyAccessToken } from "../utils/jwt.js";

export const authenticate = (
  req: Request,
  _res: Response,
  next: NextFunction,
): void => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new ApiError(401, "Authentication failed");
    }

    const accessToken = authHeader.slice("Bearer ".length).trim();
    if (!accessToken) {
      throw new ApiError(401, "Authentication failed");
    }

    const payload = verifyAccessToken(accessToken);

    req.user = {
      id: payload.sub,
      userType: payload.userType,
      roleId: payload.roleId,
    };

    next();
  } catch (error) {
    if (error instanceof ApiError) {
      next(error);
      return;
    }

    next(new ApiError(401, "Authentication failed"));
  }
};

export const authenticateForLogout = (
  req: Request,
  _res: Response,
  next: NextFunction,
): void => {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith("Bearer ")) {
      const accessToken = authHeader.slice("Bearer ".length).trim();
      if (accessToken) {
        try {
          const payload = verifyAccessToken(accessToken);
          req.user = {
            id: payload.sub,
            userType: payload.userType,
            roleId: payload.roleId,
          };
          return next();
        } catch {
          // If access token is expired/invalid, allow fallback to refreshToken below
        }
      }
    }

    const refreshToken =
      typeof req.cookies?.refreshToken === "string"
        ? req.cookies.refreshToken
        : typeof req.body?.refreshToken === "string"
        ? req.body.refreshToken
        : typeof req.headers["x-refresh-token"] === "string"
        ? req.headers["x-refresh-token"]
        : undefined;

    if (refreshToken) {
      return next();
    }

    throw new ApiError(401, "Authentication failed");
  } catch (error) {
    if (error instanceof ApiError) {
      next(error);
      return;
    }

    next(new ApiError(401, "Authentication failed"));
  }
};


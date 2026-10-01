import crypto from "node:crypto";
import jwt, { type SignOptions } from "jsonwebtoken";
import { z } from "zod";
import { config } from "../config/env.js";

const accessTokenPayloadSchema = z.object({
  sub: z.string().uuid(),
  userType: z.enum(["CITIZEN", "EMPLOYEE"]),
  roleId: z.string().uuid().nullable(),
});

const refreshTokenPayloadSchema = z.object({
  sub: z.string().uuid(),
});

export type AccessTokenPayload = z.infer<typeof accessTokenPayloadSchema>;
export type RefreshTokenPayload = z.infer<typeof refreshTokenPayloadSchema>;

const getJwtErrorMessage = (error: unknown): string => {
  if (error instanceof jwt.TokenExpiredError) {
    return "Token expired";
  }

  if (error instanceof jwt.JsonWebTokenError) {
    return "Invalid token";
  }

  return "Invalid token";
};

const validatePayload = <T>(
  value: unknown,
  schema: z.ZodSchema<T>,
  kind: "access" | "refresh",
): T => {
  const parsed = schema.safeParse(value);

  if (!parsed.success) {
    throw new Error(`${kind === "access" ? "Access" : "Refresh"} token payload is invalid`);
  }

  return parsed.data;
};

const baseSignOptions = (expiresIn: string): SignOptions => ({
  algorithm: "HS256",
  expiresIn: expiresIn as never,
} as SignOptions);

export function generateAccessToken(user: {
  id: string;
  userType: "CITIZEN" | "EMPLOYEE";
  roleId: string | null;
}): string {
  return jwt.sign(
    {
      sub: user.id,
      userType: user.userType,
      roleId: user.roleId,
    },
    config.ACCESS_TOKEN_SECRET,
    baseSignOptions(config.ACCESS_TOKEN_EXPIRES_IN),
  );
}

export function generateRefreshToken(userId: string): string {
  return jwt.sign(
    { sub: userId },
    config.REFRESH_TOKEN_SECRET,
    baseSignOptions(config.REFRESH_TOKEN_EXPIRES_IN),
  );
}

export function verifyAccessToken(token: string): AccessTokenPayload {
  try {
    const decoded = jwt.verify(token, config.ACCESS_TOKEN_SECRET, {
      algorithms: ["HS256"],
    });

    return validatePayload(decoded, accessTokenPayloadSchema, "access");
  } catch (error) {
    throw new Error(getJwtErrorMessage(error));
  }
}

export function verifyRefreshToken(token: string): RefreshTokenPayload {
  try {
    const decoded = jwt.verify(token, config.REFRESH_TOKEN_SECRET, {
      algorithms: ["HS256"],
    });

    return validatePayload(decoded, refreshTokenPayloadSchema, "refresh");
  } catch (error) {
    throw new Error(getJwtErrorMessage(error));
  }
}

export function hashRefreshToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex");
}

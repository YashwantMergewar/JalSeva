import type { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/ApiError.js";

interface RateLimitOptions {
  windowMs: number;
  max: number;
  message?: string;
}

interface RequestRecord {
  count: number;
  resetTime: number;
}

/**
 * Lightweight in-memory rate limiter middleware.
 * Tracks requests per IP within windowMs.
 */
export function createRateLimiter(options: RateLimitOptions) {
  const { windowMs, max, message = "Too many requests. Please try again later." } = options;
  const store = new Map<string, RequestRecord>();

  // Periodically clean up expired records to avoid memory leaks
  const interval = setInterval(() => {
    const now = Date.now();
    for (const [key, record] of store.entries()) {
      if (now > record.resetTime) {
        store.delete(key);
      }
    }
  }, Math.max(windowMs, 60000));

  // Allow Node.js process to exit cleanly without waiting for timer
  if (interval.unref) {
    interval.unref();
  }

  return (req: Request, _res: Response, next: NextFunction) => {
    const ip =
      req.ip ||
      (req.headers["x-forwarded-for"] as string)?.split(",")[0]?.trim() ||
      req.socket.remoteAddress ||
      "unknown-ip";

    const now = Date.now();
    const record = store.get(ip);

    if (!record || now > record.resetTime) {
      store.set(ip, { count: 1, resetTime: now + windowMs });
      return next();
    }

    record.count += 1;
    if (record.count > max) {
      const retryAfterSeconds = Math.ceil((record.resetTime - now) / 1000);
      _res.setHeader("Retry-After", String(retryAfterSeconds));
      throw new ApiError(429, message);
    }

    next();
  };
}

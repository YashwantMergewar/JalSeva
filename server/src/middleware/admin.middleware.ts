import type { NextFunction, Request, Response } from "express";
import { ApiError } from "../utils/ApiError.js";

/**
 * Middleware: Requires the requesting user to be an EMPLOYEE with an ADMIN role name.
 * Must be used after `authenticate` middleware.
 */
export const requireAdmin = async (
    req: Request,
    _res: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        if (!req.user) {
            throw new ApiError(401, "Authentication failed");
        }

        if (req.user.userType !== "EMPLOYEE") {
            throw new ApiError(403, "Access denied: Employee accounts only");
        }

        if (!req.user.roleId) {
            throw new ApiError(403, "Access denied: No role assigned");
        }

        // Import prisma lazily to avoid circular deps
        const { prisma } = await import("../config/db.js");

        const role = await prisma.role.findUnique({
            where: { id: req.user.roleId },
            select: { name: true },
        });

        if (!role || role.name !== "ADMIN") {
            throw new ApiError(403, "Access denied: Admin role required");
        }

        next();
    } catch (error) {
        if (error instanceof ApiError) {
            next(error);
            return;
        }
        next(new ApiError(403, "Access denied"));
    }
};

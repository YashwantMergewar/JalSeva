import type { Request, Response } from "express";
import { ZodError } from "zod";
import { AsyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import {
    citizenLoginSchema,
    citizenRegistrationSchema,
} from "../utils/validations/userValidation.js";
import {
    authenticateUser,
    createCitizen,
    getCurrentUser,
    logout,
    logoutAll,
    refreshAccessToken,
} from "../services/user.services.js";

import { refreshTokenCookieName } from "../config/cookies.js";

const getValidationErrors = (error: ZodError) =>
    error.issues.map(({ path, message }) => ({ path, message }));

const getValidationErrorMessage = (error: ZodError, fallback: string) => {
    const firstIssue = error.issues[0];
    return firstIssue?.message || fallback;
};

const registerCitizen = AsyncHandler.wrap(async (req: Request, res: Response) => {
    const parsedBody = citizenRegistrationSchema.safeParse(req.body);
    if (!parsedBody.success) {
        throw new ApiError(
            400,
            getValidationErrorMessage(parsedBody.error, "Invalid registration details"),
            getValidationErrors(parsedBody.error),
        );
    }

    const user = await createCitizen(parsedBody.data);
    return res
        .status(201)
        .json(ApiResponse.success("Citizen registered successfully", user, 201));
});

const loginUser = AsyncHandler.wrap(async (req: Request, res: Response) => {
    const parsedBody = citizenLoginSchema.safeParse(req.body);
    if (!parsedBody.success) {
        throw new ApiError(
            400,
            getValidationErrorMessage(parsedBody.error, "Invalid login credentials"),
            getValidationErrors(parsedBody.error),
        );
    }

    const result = await authenticateUser(parsedBody.data, res);
    return res
        .status(200)
        .json(ApiResponse.success("Login successful", result, 200));
});


const getRequestRefreshToken = (req: Request): string | undefined => {
    if (typeof req.cookies?.[refreshTokenCookieName] === "string") {
        return req.cookies[refreshTokenCookieName];
    }
    if (typeof req.body?.refreshToken === "string" && req.body.refreshToken.trim()) {
        return req.body.refreshToken.trim();
    }
    const headerToken = req.headers["x-refresh-token"];
    if (typeof headerToken === "string" && headerToken.trim()) {
        return headerToken.trim();
    }
    return undefined;
};

const refreshController = AsyncHandler.wrap(async (req: Request, res: Response) => {
    const refreshToken = getRequestRefreshToken(req);
    const result = await refreshAccessToken(refreshToken ?? "", res);
    return res
        .status(200)
        .json(ApiResponse.success("Token refreshed successfully", result, 200));
});

const logoutController = AsyncHandler.wrap(async (req: Request, res: Response) => {
    const refreshToken = getRequestRefreshToken(req);
    await logout(refreshToken, res, req.user?.id);
    return res
        .status(200)
        .json(ApiResponse.success("Logged out successfully", null, 200));
});

const logoutAllController = AsyncHandler.wrap(async (req: Request, res: Response) => {
    if (!req.user) {
        throw new ApiError(401, "Authentication failed");
    }

    await logoutAll(req.user.id, res);
    return res
        .status(200)
        .json(ApiResponse.success("All sessions logged out successfully", null, 200));
});

const meController = AsyncHandler.wrap(async (req: Request, res: Response) => {
    if (!req.user) {
        throw new ApiError(401, "Authentication failed");
    }

    const user = await getCurrentUser(req.user.id);
    return res
        .status(200)
        .json(ApiResponse.success("User fetched successfully", user, 200));
});

export {
    loginUser,
    logoutAllController,
    logoutController,
    meController,
    refreshController,
    registerCitizen,
};

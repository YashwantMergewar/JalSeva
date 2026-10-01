import bcrypt from "bcrypt";
import type { Response } from "express";
import { prisma } from "../config/db.js";
import {
    clearRefreshTokenCookieOptions,
    refreshTokenCookieName,
    refreshTokenCookieOptions,
} from "../config/cookies.js";
import { ApiError } from "../utils/ApiError.js";
import {
    generateAccessToken,
    generateRefreshToken,
    hashRefreshToken,
    verifyRefreshToken,
} from "../utils/jwt.js";
import type { AuthenticatedUser } from "../types/auth.js";
import type {
    CitizenLoginInput,
    CitizenRegistrationInput,
} from "../utils/validations/userValidation.js";
import { UserType } from "../generated/prisma/enums.js";

const publicUserSelect = {
    id: true,
    fullname: true,
    email: true,
    mobile_no: true,
    userType: true,
    roleId: true,
    isActive: true,
    createdAt: true,
    updatedAt: true,
} as const;

const createRefreshToken = async (userId: string) => {
    const refreshToken = generateRefreshToken(userId);

    await prisma.refreshToken.create({
        data: {
            userId,
            tokenHash: hashRefreshToken(refreshToken),
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            revokedAt: null,
        },
    });

    return refreshToken;
};

const setRefreshCookie = (res: Response, token: string) => {
    res.cookie(refreshTokenCookieName, token, refreshTokenCookieOptions);
};

const clearRefreshCookie = (res: Response) => {
    res.clearCookie(refreshTokenCookieName, clearRefreshTokenCookieOptions);
    res.clearCookie(refreshTokenCookieName, {
        ...clearRefreshTokenCookieOptions,
        path: "/api/users",
    });
};

const toAuthUserType = (value: UserType): AuthenticatedUser["userType"] =>
    value === UserType.CITIZEN ? "CITIZEN" : "EMPLOYEE";

export const createCitizen = async (userData: CitizenRegistrationInput) => {
    const existingUser = await prisma.user.findFirst({
        where: {
            OR: [
                { email: userData.email },
                { mobile_no: userData.mobile_no },
            ],
        },
        select: { email: true, mobile_no: true },
    });

    if (existingUser) {
        const field = existingUser.email === userData.email
            ? "Email"
            : "Mobile number";
        throw new ApiError(409, `${field} is already registered`);
    }

    const passwordHash = await bcrypt.hash(userData.password, 12);

    try {
        return await prisma.user.create({
            data: {
                fullname: userData.fullname,
                email: userData.email,
                mobile_no: userData.mobile_no,
                password_hash: passwordHash,
                userType: UserType.CITIZEN,
            },
            select: publicUserSelect,
        });
    } catch (error) {
        if (
            error instanceof Error &&
            "code" in error &&
            error.code === "P2002"
        ) {
            throw new ApiError(409, "Email or mobile number is already registered");
        }
        throw error;
    }
};

export const authenticateUser = async (
    credentials: CitizenLoginInput,
    res: Response,
) => {
    const identifier = credentials.identifier.trim();
    const user = await prisma.user.findFirst({
        where: {
            OR: [
                { email: identifier.toLowerCase() },
                { mobile_no: identifier },
            ],
        },
    });

    if (
        !user ||
        !user.isActive ||
        !(await bcrypt.compare(credentials.password, user.password_hash))
    ) {
        throw new ApiError(401, "Authentication failed");
    }

    const accessToken = generateAccessToken({
        id: user.id,
        userType: toAuthUserType(user.userType),
        roleId: user.roleId,
    });
    setRefreshCookie(res, await createRefreshToken(user.id));

    const { password_hash: _passwordHash, ...publicUser } = user;
    return { accessToken, user: publicUser };
};

export const refreshAccessToken = async (
    refreshToken: string,
    res: Response,
) => {
    if (!refreshToken) {
        throw new ApiError(401, "Authentication failed");
    }

    let payload;
    try {
        payload = verifyRefreshToken(refreshToken);
    } catch {
        throw new ApiError(401, "Authentication failed");
    }

    const existingToken = await prisma.refreshToken.findFirst({
        where: {
            tokenHash: hashRefreshToken(refreshToken),
            userId: payload.sub,
            revokedAt: null,
        },
        include: { user: true },
    });

    if (
        !existingToken ||
        !existingToken.user ||
        !existingToken.user.isActive ||
        existingToken.expiresAt <= new Date()
    ) {
        throw new ApiError(401, "Authentication failed");
    }

    await prisma.refreshToken.update({
        where: { id: existingToken.id },
        data: { revokedAt: new Date() },
    });

    const newRefreshToken = await createRefreshToken(existingToken.userId);
    const accessToken = generateAccessToken({
        id: existingToken.userId,
        userType: toAuthUserType(existingToken.user.userType),
        roleId: existingToken.user.roleId,
    });

    setRefreshCookie(res, newRefreshToken);
    return { accessToken };
};

export const logout = async (
    refreshToken: string | undefined,
    res: Response,
    userId?: string,
) => {
    if (refreshToken) {
        const tokenHash = hashRefreshToken(refreshToken);
        const existingToken = await prisma.refreshToken.findFirst({
            where: { tokenHash },
        });

        if (existingToken) {
            if (existingToken.revokedAt !== null) {
                clearRefreshCookie(res);
                throw new ApiError(400, "User already logged out");
            }

            await prisma.refreshToken.update({
                where: { id: existingToken.id },
                data: { revokedAt: new Date() },
            });

            clearRefreshCookie(res);
            return;
        }
    }

    if (userId) {
        const activeTokens = await prisma.refreshToken.findMany({
            where: {
                userId,
                revokedAt: null,
            },
        });

        if (activeTokens.length === 0) {
            clearRefreshCookie(res);
            throw new ApiError(400, "User already logged out");
        }

        await prisma.refreshToken.updateMany({
            where: {
                userId,
                revokedAt: null,
            },
            data: { revokedAt: new Date() },
        });

        clearRefreshCookie(res);
        return;
    }

    clearRefreshCookie(res);
    throw new ApiError(400, "User already logged out");
};

export const logoutAll = async (userId: string, res?: Response) => {
    const activeTokens = await prisma.refreshToken.findMany({
        where: {
            userId,
            revokedAt: null,
        },
    });

    if (activeTokens.length === 0) {
        if (res) clearRefreshCookie(res);
        throw new ApiError(400, "User already logged out");
    }

    await prisma.refreshToken.updateMany({
        where: {
            userId,
            revokedAt: null,
        },
        data: { revokedAt: new Date() },
    });

    if (res) clearRefreshCookie(res);
};

export const getCurrentUser = async (userId: string) => {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: publicUserSelect,
    });

    if (!user || !user.isActive) {
        throw new ApiError(401, "Authentication failed");
    }

    return user;
};

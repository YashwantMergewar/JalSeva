import crypto from "node:crypto";
import bcrypt from "bcrypt";
import { prisma } from "../config/db.js";
import { ApiError } from "../utils/ApiError.js";
import type { CreateEmployeeInput } from "../utils/validations/employeeValidation.js";
import { UserType } from "../generated/prisma/enums.js";
import { sendActivationEmail } from "./email.service.js";
import { config } from "../config/env.js";

const publicUserSelect = {
    id: true,
    employeeId: true,
    fullname: true,
    email: true,
    mobile_no: true,
    userType: true,
    roleId: true,
    isActive: true,
    createdAt: true,
    updatedAt: true,
} as const;

/** Generate a sequential employee ID like EMP-0001 */
const generateEmployeeId = async (): Promise<string> => {
    const latest = await prisma.user.findFirst({
        where: {
            userType: UserType.EMPLOYEE,
            employeeId: { not: null },
        },
        orderBy: { createdAt: "desc" },
        select: { employeeId: true },
    });

    let nextNum = 1;
    if (latest?.employeeId) {
        const match = latest.employeeId.match(/EMP-(\d+)/);
        if (match && match[1]) {
            nextNum = parseInt(match[1], 10) + 1;
        }
    }

    return `EMP-${String(nextNum).padStart(4, "0")}`;
};

/** Generate a cryptographically secure activation token */
const generateRawToken = (): string => crypto.randomBytes(32).toString("hex");

/** Hash an activation token for storage (SHA-256) */
const hashActivationToken = (token: string): string =>
    crypto.createHash("sha256").update(token).digest("hex");

export const createEmployee = async (data: CreateEmployeeInput) => {
    // Check for conflicts
    const existing = await prisma.user.findFirst({
        where: {
            OR: [{ email: data.email }, { mobile_no: data.mobile_no }],
        },
        select: { email: true, mobile_no: true },
    });

    if (existing) {
        const field = existing.email === data.email ? "Email" : "Mobile number";
        throw new ApiError(409, `${field} is already registered`);
    }

    // Validate role exists
    const role = await prisma.role.findUnique({
        where: { id: data.roleId },
        select: { id: true, name: true },
    });
    if (!role) {
        throw new ApiError(404, "Role not found");
    }

    // Validate department exists
    const department = await prisma.department.findUnique({
        where: { id: data.departmentId },
        select: { id: true, name: true },
    });
    if (!department) {
        throw new ApiError(404, "Department not found");
    }

    const employeeId = await generateEmployeeId();
    const rawToken = generateRawToken();
    const tokenHash = hashActivationToken(rawToken);
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Create employee + department assignment + activation token in a single transaction
    const employee = await prisma.$transaction(async (tx) => {
        const newUser = await tx.user.create({
            data: {
                fullname: data.fullname,
                email: data.email,
                mobile_no: data.mobile_no,
                // Placeholder: employee sets their own password via activation link
                password_hash: await bcrypt.hash(`pending:${Date.now()}`, 12),
                userType: UserType.EMPLOYEE,
                roleId: data.roleId,
                employeeId,
                isActive: false,
            },
            select: publicUserSelect,
        });

        await tx.employeeDepartment.create({
            data: {
                employeeId: newUser.id,
                departmentId: data.departmentId,
                isActive: true,
            },
        });

        await tx.activationToken.create({
            data: {
                userId: newUser.id,
                tokenHash,
                expiresAt,
            },
        });

        return newUser;
    });

    // Build activation URL — uses the app's deep link scheme or frontend URL
    const frontendBase = config.FRONTEND_URL || "jalseva://";
    const activationUrl = frontendBase.startsWith("http")
        ? `${frontendBase}/activate-account?token=${rawToken}`
        : `${frontendBase}activate-account?token=${rawToken}`;

    // Send email asynchronously; don't block or roll back employee creation if email fails
    let emailSent = false;
    try {
        await sendActivationEmail({
            to: employee.email,
            employeeName: employee.fullname,
            employeeId: employee.employeeId ?? employeeId,
            departmentName: department.name,
            roleName: role.name,
            activationUrl,
        });
        emailSent = true;
    } catch (emailError) {
        // Log but don't crash — admin can resend the invitation
        console.error("[Email] Failed to send activation email:", emailError);
    }

    return {
        employee,
        department,
        role,
        activationUrl,
        emailSent,
    };
};

export const resendInvitation = async (employeeUserId: string) => {
    // Find the employee
    const user = await prisma.user.findUnique({
        where: { id: employeeUserId },
        select: {
            id: true,
            employeeId: true,
            fullname: true,
            email: true,
            isActive: true,
            userType: true,
            roleId: true,
            role: { select: { name: true } },
            employeeDepartment: {
                where: { isActive: true },
                take: 1,
                select: { department: { select: { name: true } } },
            },
        },
    });

    if (!user || user.userType !== UserType.EMPLOYEE) {
        throw new ApiError(404, "Employee not found");
    }

    if (user.isActive) {
        throw new ApiError(400, "Account is already activated");
    }

    const rawToken = generateRawToken();
    const tokenHash = hashActivationToken(rawToken);
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    // Revoke all existing unused tokens, then create a fresh one
    await prisma.$transaction(async (tx) => {
        await tx.activationToken.updateMany({
            where: {
                userId: user.id,
                usedAt: null,
                revokedAt: null,
            },
            data: { revokedAt: new Date() },
        });

        await tx.activationToken.create({
            data: {
                userId: user.id,
                tokenHash,
                expiresAt,
            },
        });
    });

    const frontendBase = config.FRONTEND_URL || "jalseva://";
    const activationUrl = frontendBase.startsWith("http")
        ? `${frontendBase}/activate-account?token=${rawToken}`
        : `${frontendBase}activate-account?token=${rawToken}`;

    const departmentName = user.employeeDepartment[0]?.department.name ?? "N/A";
    const roleName = user.role?.name ?? "N/A";

    let emailSent = false;
    try {
        await sendActivationEmail({
            to: user.email,
            employeeName: user.fullname,
            employeeId: user.employeeId ?? "N/A",
            departmentName,
            roleName,
            activationUrl,
        });
        emailSent = true;
    } catch (emailError) {
        console.error("[Email] Failed to resend activation email:", emailError);
    }

    return { emailSent, activationUrl };
};

export const activateAccount = async (rawToken: string, newPassword: string) => {
    if (!rawToken || rawToken.trim() === "") {
        throw new ApiError(400, "Activation token is required");
    }
    if (!newPassword || newPassword.length < 8) {
        throw new ApiError(400, "Password must be at least 8 characters");
    }

    const tokenHash = hashActivationToken(rawToken);
    const now = new Date();

    const record = await prisma.activationToken.findUnique({
        where: { tokenHash },
        include: {
            user: {
                select: {
                    id: true,
                    employeeId: true,
                    fullname: true,
                    email: true,
                    isActive: true,
                    userType: true,
                    roleId: true,
                    role: { select: { id: true, name: true } },
                    employeeDepartment: {
                        where: { isActive: true },
                        take: 1,
                        select: { department: { select: { id: true, name: true } } },
                    },
                },
            },
        },
    });

    // Deliberately vague error messages to avoid information leakage
    if (!record) {
        throw new ApiError(400, "Activation link is invalid or has already been used");
    }

    if (record.revokedAt !== null) {
        throw new ApiError(400, "This activation link has been revoked. Please request a new invitation.");
    }

    if (record.usedAt !== null) {
        throw new ApiError(400, "This activation link has already been used. Please log in or contact your administrator.");
    }

    if (record.expiresAt < now) {
        throw new ApiError(400, "This activation link has expired. Please contact your administrator for a new invitation.");
    }

    if (!record.user || record.user.userType !== UserType.EMPLOYEE) {
        throw new ApiError(400, "Activation link is invalid or has already been used");
    }

    if (record.user.isActive) {
        throw new ApiError(400, "This account is already activated. Please log in.");
    }

    const passwordHash = await bcrypt.hash(newPassword, 12);

    // Update password, activate account, and consume token atomically
    await prisma.$transaction(async (tx) => {
        const tokenUpdate = await tx.activationToken.updateMany({
            where: {
                id: record.id,
                usedAt: null,
                revokedAt: null,
            },
            data: { usedAt: now },
        });

        if (tokenUpdate.count === 0) {
            throw new ApiError(400, "This activation link has already been used or revoked");
        }

        await tx.user.update({
            where: { id: record.userId },
            data: {
                password_hash: passwordHash,
                isActive: true,
            },
        });
    });

    return {
        employeeId: record.user.employeeId,
        fullname: record.user.fullname,
        email: record.user.email,
        role: record.user.role,
        department: record.user.employeeDepartment[0]?.department ?? null,
    };
};

export const verifyActivationToken = async (rawToken: string) => {
    if (!rawToken || rawToken.trim() === "") {
        throw new ApiError(400, "Activation token is required");
    }

    const tokenHash = hashActivationToken(rawToken);
    const now = new Date();

    const record = await prisma.activationToken.findUnique({
        where: { tokenHash },
        include: {
            user: {
                select: {
                    id: true,
                    employeeId: true,
                    fullname: true,
                    isActive: true,
                    userType: true,
                    role: { select: { id: true, name: true } },
                    employeeDepartment: {
                        where: { isActive: true },
                        take: 1,
                        select: { department: { select: { id: true, name: true } } },
                    },
                },
            },
        },
    });

    if (!record || record.revokedAt !== null || record.usedAt !== null) {
        throw new ApiError(400, "Activation link is invalid or has already been used");
    }

    if (record.expiresAt < now) {
        throw new ApiError(400, "This activation link has expired");
    }

    if (!record.user || record.user.userType !== UserType.EMPLOYEE) {
        throw new ApiError(400, "Activation link is invalid");
    }

    if (record.user.isActive) {
        throw new ApiError(400, "This account is already activated");
    }

    return {
        employeeId: record.user.employeeId,
        fullname: record.user.fullname,
        role: record.user.role,
        department: record.user.employeeDepartment[0]?.department ?? null,
        expiresAt: record.expiresAt,
    };
};

export const listEmployees = async () => {
    const employees = await prisma.user.findMany({
        where: { userType: UserType.EMPLOYEE },
        select: {
            ...publicUserSelect,
            role: { select: { id: true, name: true } },
            employeeDepartment: {
                where: { isActive: true },
                take: 1,
                select: {
                    department: { select: { id: true, name: true } },
                },
            },
            activationTokens: {
                where: { usedAt: null, revokedAt: null },
                orderBy: { createdAt: "desc" },
                take: 1,
                select: { expiresAt: true, createdAt: true },
            },
        },
        orderBy: { createdAt: "desc" },
    });

    return employees;
};

export const getEmployeeById = async (id: string) => {
    const employee = await prisma.user.findUnique({
        where: { id },
        select: {
            ...publicUserSelect,
            role: { select: { id: true, name: true } },
            employeeDepartment: {
                where: { isActive: true },
                take: 1,
                select: {
                    department: { select: { id: true, name: true } },
                },
            },
        },
    });

    if (!employee || employee.userType !== UserType.EMPLOYEE) {
        throw new ApiError(404, "Employee not found");
    }

    return employee;
};

export const getRoles = async () => {
    return prisma.role.findMany({
        select: { id: true, name: true, description: true },
        orderBy: { name: "asc" },
    });
};

export const getDepartments = async () => {
    return prisma.department.findMany({
        where: { isActive: true },
        select: { id: true, name: true, description: true },
        orderBy: { name: "asc" },
    });
};

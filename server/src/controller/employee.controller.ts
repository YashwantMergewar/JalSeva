import type { Request, Response } from "express";
import { ZodError } from "zod";
import { AsyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { createEmployeeSchema } from "../utils/validations/employeeValidation.js";
import {
    activateAccountSchema,
    resendInvitationSchema,
    verifyTokenSchema,
} from "../utils/validations/activationValidation.js";
import {
    activateAccount,
    createEmployee,
    getDepartments,
    getEmployeeById,
    getRoles,
    listEmployees,
    resendInvitation,
    verifyActivationToken,
} from "../services/employee.services.js";

const getValidationErrors = (error: ZodError) =>
    error.issues.map(({ path, message }) => ({ path, message }));

const getValidationErrorMessage = (error: ZodError, fallback: string) => {
    const firstIssue = error.issues[0];
    return firstIssue?.message || fallback;
};

/** POST /api/v1/employees  – Admin creates an employee */
export const createEmployeeController = AsyncHandler.wrap(
    async (req: Request, res: Response) => {
        const parsed = createEmployeeSchema.safeParse(req.body);
        if (!parsed.success) {
            throw new ApiError(
                400,
                getValidationErrorMessage(parsed.error, "Invalid employee details"),
                getValidationErrors(parsed.error),
            );
        }

        const result = await createEmployee(parsed.data);

        return res.status(201).json(
            ApiResponse.success(
                result.emailSent
                    ? "Employee created successfully. Activation email sent."
                    : "Employee created successfully. Activation email could not be delivered — please resend the invitation.",
                {
                    employee: result.employee,
                    department: result.department,
                    role: result.role,
                    emailSent: result.emailSent,
                },
                201,
            ),
        );
    },
);

/** GET /api/v1/employees  – Admin lists all employees */
export const listEmployeesController = AsyncHandler.wrap(
    async (_req: Request, res: Response) => {
        const employees = await listEmployees();
        return res
            .status(200)
            .json(ApiResponse.success("Employees fetched successfully", employees, 200));
    },
);

/** GET /api/v1/employees/:id  – Admin gets one employee */
export const getEmployeeController = AsyncHandler.wrap(
    async (req: Request, res: Response) => {
        const { id } = req.params;
        if (!id || typeof id !== "string") throw new ApiError(400, "Employee ID is required");
        const employee = await getEmployeeById(id);
        return res
            .status(200)
            .json(ApiResponse.success("Employee fetched successfully", employee, 200));
    },
);

/** GET /api/v1/employees/meta/roles  – Admin gets all roles for dropdown */
export const getRolesController = AsyncHandler.wrap(
    async (_req: Request, res: Response) => {
        const roles = await getRoles();
        return res
            .status(200)
            .json(ApiResponse.success("Roles fetched successfully", roles, 200));
    },
);

/** GET /api/v1/employees/meta/departments  – Admin gets all departments for dropdown */
export const getDepartmentsController = AsyncHandler.wrap(
    async (_req: Request, res: Response) => {
        const departments = await getDepartments();
        return res.status(200).json(
            ApiResponse.success("Departments fetched successfully", departments, 200),
        );
    },
);

/** POST /api/v1/employees/:id/resend-invitation  – Admin resends activation email */
export const resendInvitationController = AsyncHandler.wrap(
    async (req: Request, res: Response) => {
        const parsed = resendInvitationSchema.safeParse({ employeeId: req.params.id });
        if (!parsed.success) {
            throw new ApiError(400, "Invalid employee ID", getValidationErrors(parsed.error));
        }

        const result = await resendInvitation(parsed.data.employeeId);

        return res.status(200).json(
            ApiResponse.success(
                result.emailSent
                    ? "Invitation email resent successfully."
                    : "New invitation token generated but email delivery failed. Please try again.",
                { emailSent: result.emailSent },
                200,
            ),
        );
    },
);

/**
 * POST /api/v1/employees/activate
 * Public endpoint — no auth required.
 * Body: { token: string; password: string }
 */
export const activateAccountController = AsyncHandler.wrap(
    async (req: Request, res: Response) => {
        const parsed = activateAccountSchema.safeParse(req.body);
        if (!parsed.success) {
            throw new ApiError(
                400,
                "Invalid request",
                getValidationErrors(parsed.error),
            );
        }

        const result = await activateAccount(parsed.data.token, parsed.data.password);

        return res.status(200).json(
            ApiResponse.success("Account activated successfully. You may now log in.", result, 200),
        );
    },
);

/**
 * GET /api/v1/employees/verify-token?token=<raw>
 * Public endpoint — used by the activation screen to pre-fill employee info.
 */
export const verifyTokenController = AsyncHandler.wrap(
    async (req: Request, res: Response) => {
        const parsed = verifyTokenSchema.safeParse({ token: req.query.token });
        if (!parsed.success) {
            throw new ApiError(400, "Token is required");
        }

        const result = await verifyActivationToken(parsed.data.token);

        return res.status(200).json(
            ApiResponse.success("Token is valid", result, 200),
        );
    },
);

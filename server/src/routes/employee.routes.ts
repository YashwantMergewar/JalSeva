import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware.js";
import { requireAdmin } from "../middleware/admin.middleware.js";
import { createRateLimiter } from "../middleware/rateLimit.middleware.js";
import {
    activateAccountController,
    createEmployeeController,
    getDepartmentsController,
    getEmployeeController,
    getRolesController,
    listEmployeesController,
    resendInvitationController,
    verifyTokenController,
} from "../controller/employee.controller.js";

const employeeRouter = Router();

// Rate limiters for public activation & resend endpoints
const activationLimiter = createRateLimiter({
    windowMs: 15 * 60 * 1000,
    max: 10,
    message: "Too many activation attempts. Please try again after 15 minutes.",
});

const verifyTokenLimiter = createRateLimiter({
    windowMs: 15 * 60 * 1000,
    max: 30,
    message: "Too many token verification requests. Please try again later.",
});

const resendLimiter = createRateLimiter({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: "Too many resend attempts. Please wait 15 minutes before requesting another invitation.",
});

// ─── Public activation endpoints (no auth required) ─────────────────────────
employeeRouter.post("/activate", activationLimiter, activateAccountController);
employeeRouter.get("/verify-token", verifyTokenLimiter, verifyTokenController);

// ─── Admin-only endpoints ────────────────────────────────────────────────────
employeeRouter.use(authenticate, requireAdmin);

employeeRouter.get("/meta/roles", getRolesController);
employeeRouter.get("/meta/departments", getDepartmentsController);

employeeRouter.post("/", createEmployeeController);
employeeRouter.get("/", listEmployeesController);
employeeRouter.get("/:id", getEmployeeController);
employeeRouter.post("/:id/resend-invitation", resendLimiter, resendInvitationController);

export { employeeRouter, activationLimiter, verifyTokenLimiter };

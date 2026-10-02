import { z } from "zod";

export const activateAccountSchema = z.object({
    token: z.string().min(1, "Activation token is required"),
    password: z
        .string()
        .min(8, "Password must be at least 8 characters")
        .max(128, "Password must not exceed 128 characters"),
});

export type ActivateAccountInput = z.infer<typeof activateAccountSchema>;

export const verifyTokenSchema = z.object({
    token: z.string().min(1, "Token is required"),
});

export type VerifyTokenInput = z.infer<typeof verifyTokenSchema>;

export const resendInvitationSchema = z.object({
    employeeId: z.string().uuid("Invalid employee ID"),
});

export type ResendInvitationInput = z.infer<typeof resendInvitationSchema>;

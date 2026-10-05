import { z } from "zod";

const mobileNumberSchema = z
    .string()
    .trim()
    .regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit mobile number");

export const createEmployeeSchema = z.object({
    fullname: z
        .string()
        .trim()
        .min(2, "Full name must be at least 2 characters long")
        .max(100, "Full name must not exceed 100 characters"),
    email: z
        .string()
        .trim()
        .email("Enter a valid email address")
        .transform((v) => v.toLowerCase()),
    mobile_no: mobileNumberSchema,
    roleId: z
        .string()
        .trim()
        .min(1, "Role selection is required"),
    departmentId: z
        .string()
        .trim()
        .min(1, "Department selection is required"),
    officeName: z
        .string()
        .trim()
        .min(2, "Office / sub-division name must be at least 2 characters")
        .max(100, "Office / sub-division name must not exceed 100 characters")
        .optional(),
});

export type CreateEmployeeInput = z.infer<typeof createEmployeeSchema>;

import { z } from "zod";

const passwordSchema = z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .max(128, "Password must not exceed 128 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number");

const mobileNumberSchema = z
    .string()
    .trim()
    .regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit mobile number");

const citizenRegistrationSchema = z
    .object({
        fullname: z
            .string()
            .trim()
            .min(2, "Full name must be at least 2 characters long")
            .max(100, "Full name must not exceed 100 characters"),
        email: z
            .string()
            .trim()
            .email("Enter a valid email address")
            .transform((value) => value.toLowerCase()),
        mobile_no: mobileNumberSchema,
        password: passwordSchema,
        confirmPassword: z.string(),
    })
    .refine((value) => value.password === value.confirmPassword, {
        path: ["confirmPassword"],
        message: "Passwords do not match",
    });

const citizenLoginSchema = z.object({
    identifier: z
        .string()
        .trim()
        .min(1, "Email or mobile number is required"),
    password: z.string().min(1, "Password is required"),
});

type CitizenRegistrationInput = z.infer<typeof citizenRegistrationSchema>;
type CitizenLoginInput = z.infer<typeof citizenLoginSchema>;

export {
    citizenRegistrationSchema,
    citizenLoginSchema,
    citizenRegistrationSchema as registerSchema,
    citizenLoginSchema as loginSchema,
};

export type { CitizenRegistrationInput, CitizenLoginInput };
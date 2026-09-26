import { z } from "zod";

const loginSchema = z.object({
  identifier: z
    .string()
    .trim()
    .min(1, "Email or mobile number is required"),
  password: z.string().min(1, "Password is required"),
});

const meSchema = z.object({
  id: z.string().uuid(),
});

export { loginSchema, meSchema };
export type LoginInput = z.infer<typeof loginSchema>;

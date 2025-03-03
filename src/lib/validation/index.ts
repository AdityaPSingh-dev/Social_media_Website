import * as z from "zod";
export const SignupValidation = z.object({
  name: z
    .string()
    .min(3, { message: "Too Short" })
    .max(50, { message: "Too Long" }),
  username: z.string().min(3, { message: "Too Short" }),
  email: z.string().email(),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
});

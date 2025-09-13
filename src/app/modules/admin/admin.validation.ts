import z from "zod";
import { IStatus, Role } from "../user/user.interface";

export const updateAdminZodSchema = z.object({
  name: z.string()
    .min(2, { message: "name too short must be 2 characters" })
    .max(50, { message: "cannot exceed 50 characters" })
    .optional(),

  email: z.email("Please enter a valid email")
    .optional(),

  password: z.string()
  .min(8)
    .regex(
      /^[A-Za-z0-9]+$/,
      "Password must contain at least one uppercase, one lowercase, and one number"
    ).optional(),

  phone: z.string()
    .regex(/^(?:\+8801|01)\d{9}$/, "Please enter a valid Bangladeshi phone number.")
    .optional(),

  role: z.enum(Object.values(Role) as [string]).optional(),

  isVerified: z.boolean().optional(),

  isActive: z.enum(Object.values(IStatus) as [string]).optional(),

  address: z.string()
    .max(200, { message: "Address cannot exceed 200 characters" })
    .optional(),
});

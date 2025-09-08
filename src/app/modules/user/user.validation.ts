import z from "zod";
import { IStatus, Role } from "./user.interface";


export const createUserZodSchema = z.object({
    name: z.string().min(2, { message: " name too short must be 2 character " }).max(50, { message: "character reached its limit, can not exceed 50 character" }),
    email: z.string(),
    password: z.string().min(8).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d\S]{8,}$/,
        "Password must contain at least one uppercase letter, one lowercase letter, and one number."
    ),
    phone: z.string()
        .regex(/^(?:\+8801|01)\d{9}$/, "Please enter a valid Bangladeshi phone number.").optional(),

    address: z.string().max(200, { message: "address can not exceed 200 character" }).optional()


})

export const updateUserZodSchema = z.object({
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

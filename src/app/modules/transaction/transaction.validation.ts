import { z } from 'zod';
import mongoose from 'mongoose';


const objectId = () =>
  z
    .string()
    .refine((val) => mongoose.Types.ObjectId.isValid(val), {
      message: 'Invalid user ID',
    });

export const SendMoneySchema = z.object({
  fromEmail: z.email(),
  toEmail: z.email(),
  amount: z.number().positive('Amount must be positive'),
});

export const WithdrawSchema = z.object({
 fromEmail: z.email().optional(),
  agentEmail: z.email(),
  amount: z.number().positive('Amount must be positive'),
});

// For agents
export const CashInSchema = z.object({
  agentId: z.email(),
  toUserId: z.email("Enter a valid email"),
  amount: z
    .number()
    .min(1, "Amount must be greater than 0"),
});

export const CashOutSchema = z.object({
  userId: objectId(),
  amount: z.number().positive('Amount must be positive'),
});

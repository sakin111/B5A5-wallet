

import { z } from 'zod';



export const SendMoneySchema = z.object({
    toUserId:  z.string(),
    amount: z.number().positive('Amount must be positive'),
});

export const WithdrawSchema = z.object({
  amount: z.number().positive('Amount must be positive'),
});


// For agents
export const CashInSchema = z.object({
  toUserId:  z.string(),
    amount: z.number().positive('Amount must be positive'),
});

export const CashOutSchema = z.object({
   toUserId: z.string(),
    amount: z.number().positive('Amount must be positive'),
});

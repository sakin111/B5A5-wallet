// src/app/modules/transaction/transaction.validation.ts

import { z } from 'zod';




export const SendMoneySchema = z.object({
  body: z.object({
    toUserId:  z.string(),
    amount: z.number().positive('Amount must be positive'),
  }),
});

export const WithdrawSchema = z.object({
  body: z.object({
    amount: z.number().positive('Amount must be positive'),
  }),
});

// For agents
export const CashInSchema = z.object({
  body: z.object({
    toUserId:  z.string(),
    amount: z.number().positive('Amount must be positive'),
  }),
});

export const CashOutSchema = z.object({
  body: z.object({
    toUserId: z.string(),
    amount: z.number().positive('Amount must be positive'),
  }),
});



import { z } from 'zod';

export const SetCommissionRateSchema = z.object({
  body: z.object({
    rate: z.number().min(0).max(100, 'Rate must be between 0 and 100'),
  }),
});

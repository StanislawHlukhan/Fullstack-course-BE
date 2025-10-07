import { z } from 'zod';

export const GetTagRespSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  createdAt: z.date(),
  updatedAt: z.date()
});
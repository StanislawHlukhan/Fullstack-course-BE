
import { z } from 'zod';

export const GetUserRespSchema = z.object({
  id: z.string().uuid(),
  email: z.string(),
  name: z.string(),
  dickSize: z.number(),
  createdAt: z.date(),
  isEnabled: z.boolean().optional(),
  activatedAt: z.date().nullable().optional()
});
import { ESystemRole } from 'src/types/Profile';
import { z } from 'zod';

export const GetMeRespSchema = z.object({
  email: z.string().optional().nullable(),
  subId: z.string(),
  name: z.string(),
  dickSize: z.number(),
  createdAt: z.date(),
  id: z.string().uuid(),
  systemRole: z.nativeEnum(ESystemRole)
});;
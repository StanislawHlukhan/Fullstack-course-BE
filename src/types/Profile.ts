import { z } from 'zod';

export const ProfileSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  email: z.string(),
  dickSize: z.number(),
  createdAt: z.date(),
  updatedAt: z.date(),
  subId: z.string()
});

export type Profile = z.infer<typeof ProfileSchema>;
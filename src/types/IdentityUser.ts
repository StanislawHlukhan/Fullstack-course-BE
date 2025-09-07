import { z } from 'zod';

export const IdentityUserSchema = z.object({
  subId: z.string(),
  email: z.string(),
  isEnabled: z.boolean().optional()
});

export type IdentityUser = z.infer<typeof IdentityUserSchema>;
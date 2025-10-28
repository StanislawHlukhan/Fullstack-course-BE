import { z } from 'zod';
export enum ESystemRole {
  admin = 'admin',
  user = 'user'
}

export const ProfileSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  email: z.string(),
  footSize: z.number(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  subId: z.string(),
  stripeCustomerId: z.string().nullable().optional(),
  systemRole: z.nativeEnum(ESystemRole),
  activatedAt: z.coerce.date().nullable().optional(),
  deletedAt: z.coerce.date().nullable().optional()
});

export type Profile = z.infer<typeof ProfileSchema>;
import { z } from 'zod';
export enum ESystemRole {
  admin = 'admin',
  user = 'user'
}

export const ProfileSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  email: z.string(),
  dickSize: z.number(),
  createdAt: z.date(),
  updatedAt: z.date(),
  subId: z.string(),
  stripeCustomerId: z.string().nullable().optional(),
  systemRole: z.nativeEnum(ESystemRole),
  activatedAt: z.date().nullable().optional(),
  deletedAt: z.date().nullable().optional(),
  subscription: z.object({
    name: z.string(),
    expiresAt: z.date(),
    customerPortalUrl: z.string().url()
  }).nullable().optional()
});

export type Profile = z.infer<typeof ProfileSchema>;
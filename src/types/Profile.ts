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
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  subId: z.string(),
  systemRole: z.nativeEnum(ESystemRole),
  activatedAt: z.coerce.date().nullable().optional(),
  deletedAt: z.coerce.date().nullable().optional(),
  subscription: z.object({
    name: z.string(),
    expiresAt: z.coerce.date(),
    customerPortalUrl: z.string().url()
  }).nullable().optional()
});

export type Profile = z.infer<typeof ProfileSchema>;
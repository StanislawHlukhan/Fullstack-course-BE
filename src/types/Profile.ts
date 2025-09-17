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
  systemRole: z.nativeEnum(ESystemRole),
  activatedAt: z.date().nullable().optional(),
  deletedAt: z.date().nullable().optional()
});

export type Profile = z.infer<typeof ProfileSchema>;
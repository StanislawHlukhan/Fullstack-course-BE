import { z } from 'zod';

export const GetSoftDeletedPostsRespSchema = z.object({
  posts: z.array(z.object({
    id: z.string().uuid(),
    title: z.string(),
    description: z.string(),
    createdAt: z.date(),
    updatedAt: z.date(),
    createdBy: z.string().uuid(),
    deletedAt: z.coerce.date().nullable().optional()
  })),
  total: z.number()
});
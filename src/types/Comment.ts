import { z } from 'zod';

export const CommentSchema = z.object({
  id: z.string().uuid(),
  text: z.string(),
  postId: z.string().uuid(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  createdBy: z.string().uuid(),
  deletedAt: z.coerce.date().nullable().optional()
});

export type Comment = z.infer<typeof CommentSchema>;
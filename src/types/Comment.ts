import { z } from 'zod';

export const CommentSchema = z.object({
  id: z.string().uuid(),
  text: z.string(),
  postId: z.string().uuid(),
  createdAt: z.date(),
  updatedAt: z.date(),
  createdBy: z.string().uuid(),
  deletedAt: z.date().nullable().optional()
});

export type Comment = z.infer<typeof CommentSchema>;
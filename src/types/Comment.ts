import { z } from 'zod';

export const CommentSchema = z.object({
  id: z.string().uuid(),
  text: z.string(),
  postId: z.string().uuid(),
  createdAt: z.date(),
  updatedAt: z.date()
});

export type Comment = z.infer<typeof CommentSchema>;
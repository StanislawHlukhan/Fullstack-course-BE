import { z } from 'zod';
import { CommentSchema } from './Comment';

export const PostSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  description: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  comments: z.array(CommentSchema).optional()
});

export type Post = z.infer<typeof PostSchema>;
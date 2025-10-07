import { z } from 'zod';
import { CommentSchema } from './Comment';
import { TagSchema } from './Tag';

export const PostSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  description: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  commentCount: z.number().optional(),
  comments: z.array(CommentSchema).optional(),
  createdBy: z.string().uuid(),
  tags: z.array(TagSchema).optional(),
  deletedAt: z.coerce.date().nullable().optional()
});

export type Post = z.infer<typeof PostSchema>;
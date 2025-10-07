import { CommentSchema } from 'src/types/Comment';
import { TagSchema } from 'src/types/Tag';
import { z } from 'zod';

export const GetPostRespSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  description: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  commentCount: z.number().optional(),
  comments: z.array(CommentSchema).optional(),
  createdBy: z.string().uuid(),
  tags: z.array(TagSchema).optional(),
  deletedAt: z.coerce.date().nullable().optional()
});
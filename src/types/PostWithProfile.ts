import { PostSchema } from './Post';
import { ProfileSchema } from './Profile';
import { z } from 'zod';
import { TagSchema } from './Tag';

export const PostWithProfileSchema = PostSchema.extend({
  createdBy: ProfileSchema,
  tags: TagSchema.array().optional()
});

export type PostWithProfile = z.infer<typeof PostWithProfileSchema>;
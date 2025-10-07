import { PostSchema } from './Post';
import { ProfileSchema } from './Profile';
import { z } from 'zod';
import { TagSchema } from './Tag';

export const PostWithProfileSchema = PostSchema.extend({
  createdBy: ProfileSchema,
  tags: TagSchema.array().optional() // CODE REVIEW: В тебе вже є tags в схемі PostSchema
});

export type PostWithProfile = z.infer<typeof PostWithProfileSchema>;
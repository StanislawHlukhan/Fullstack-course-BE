import { PostSchema } from './Post';
import { ProfileSchema } from './Profile';
import { z } from 'zod';

export const PostWithProfileSchema = PostSchema.extend({
  createdBy: ProfileSchema
});

export type PostWithProfile = z.infer<typeof PostWithProfileSchema>;
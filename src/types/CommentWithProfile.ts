import { z } from 'zod';
import { CommentSchema } from './Comment';
import { ProfileSchema } from './Profile';

export const CommentWithProfileSchema = CommentSchema.extend({
  profile: ProfileSchema
});

export type CommentWithProfile = z.infer<typeof CommentWithProfileSchema>;
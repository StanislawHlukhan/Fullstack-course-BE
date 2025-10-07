import { GetUserRespSchema } from './GetUserRespSchema';
import { PostWithTagsAndCommentsSchema } from './PostWithTagsAndCommentsSchema';

export const UserWithPostsSchema = GetUserRespSchema.extend({
  posts: PostWithTagsAndCommentsSchema.array().optional()
});

import { PostSchema } from 'src/types/Post';
import { CommentSchema } from 'src/types/Comment';
import { TagSchema } from 'src/types/Tag';

export const PostWithTagsAndCommentsSchema = PostSchema.extend({
  tags: TagSchema.array().optional(),
  comments: CommentSchema.array().optional()
});

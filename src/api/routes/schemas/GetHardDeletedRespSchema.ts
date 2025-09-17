import { z } from 'zod';
import { GetUserRespSchema } from './GetUserRespSchema';
import { PostSchema } from 'src/types/Post';
import { CommentSchema } from 'src/types/Comment';
import { TagSchema } from 'src/types/Tag';

export const TagLinkSchema = z.object({
  postId: z.string().uuid(),
  tagId: z.string().uuid()
});

export const PostWithTagsAndCommentsSchema = PostSchema.extend({
  tags: TagSchema.array().optional(),
  comments: CommentSchema.array().optional()
});

export const UserWithPostsSchema = GetUserRespSchema.extend({
  posts: PostWithTagsAndCommentsSchema.array().optional()
});

export const GetHardDeletedRespSchema = z.object({
  users: UserWithPostsSchema.array(),
  total: z.number()
});


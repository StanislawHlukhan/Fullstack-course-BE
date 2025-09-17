import { Tag } from './Tag';

export interface ITagToPostRepo {
  addTagsToPost(postId: string, tagIds: string[]): Promise<void>;
  removeTagsFromPost(postId: string, tagIds: string[]): Promise<void>;
  getTagsByPostId(postId: string): Promise<Tag[]>;
  removeTagFromAllPosts(tagId: string): Promise<void>;
}
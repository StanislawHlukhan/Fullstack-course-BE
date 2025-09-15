import { Post } from './Post';
import { PostWithProfile } from './PostWithProfile';

export interface IPostRepo {
  getPosts: (options?: {
    limit?: number;
    page?: number;
    search?: string;
    sortBy?: string;
    sortOrder?: string;
    commentCount?: number;
    tagIds?: string[];
  }) => Promise<{ posts: PostWithProfile[]; total: number }>;
  createPost: (post: Partial<Post>) => Promise<Post>;
  getPostById: (id: string) => Promise<Post>;
  updatePostById: (id: string, post: Partial<Post>) => Promise<Post | null>;
  addTagsToPost: (postId: string, tagIds: string[]) => Promise<void>;
  removeTagsFromPost: (postId: string, tagIds: string[]) => Promise<void>;
}
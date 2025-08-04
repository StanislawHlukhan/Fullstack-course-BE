import { Post } from './Post';

export interface IPostRepo {
  getPosts: () => Promise<Post[]>;
  createPost: (post: Partial<Post>) => Promise<Post>;
  getPostById: (id: string) => Promise<Post>;
  updatePostById: (id: string, post: Partial<Post>) => Promise<Post | null>;
}
import { Comment } from './Comment';

export interface ICommentRepo {
  getCommentsByPostId: (postId: string) => Promise<Comment[]>;
  createComment: (comment: Partial<Comment>, postId: string) => Promise<Comment>;
  updateCommentByIdAndPostId: (id: string, postId: string, comment: Partial<Comment>) => Promise<Comment | null>;
}
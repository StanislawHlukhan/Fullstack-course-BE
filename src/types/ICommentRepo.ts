import { Comment } from './Comment';

export interface ICommentRepo {
  getCommentsByPostId: (postId: string) => Promise<Comment[]>;
  createComment: (comment: Partial<Comment>, postId: string, tx?: unknown) => Promise<Comment>;
  updateCommentByIdAndPostId: (id: string, postId: string, comment: Partial<Comment>) => Promise<Comment | null>;
  updateDeletedAt: (id: string, deletedAt: Date | null, tx?: unknown) => Promise<void>;
  hardDeleteComment: (id: string, tx?: unknown) => Promise<void>;
  hardDeleteCommentsByPostIds: (postIds: string[], tx?: unknown) => Promise<void>;
  getCommentsByUserId: (userId: string, tx?: unknown) => Promise<Comment[]>;
  getCommentsByPostIds: (postIds: string[], tx?: unknown) => Promise<Comment[]>;
}
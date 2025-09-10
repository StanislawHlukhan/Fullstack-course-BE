import { preHandlerAsyncHookHandler } from 'fastify';
import { HttpError } from '../errors/HttpError';

export const ownershipHook: preHandlerAsyncHookHandler = async function (request) {
  try {
    const { postId, commentId } = request.params as { postId?: string; commentId?: string };
    const currentUserId = request.profile?.id;

    if (!currentUserId) {
      throw new Error('User not authenticated');
    }

    if (postId) {
      const post = await this.repos.postRepo.getPostById(postId);
      if (post.createdBy !== currentUserId) {
        throw new Error('You are not the owner of this post');
      }
    }

    if (commentId) {
      const comments = await this.repos.commentRepo.getCommentsByPostId(postId!);
      const comment = comments.find(c => c.id === commentId);
      
      if (!comment) {
        throw new Error('Comment not found');
      }
      if (comment.createdBy !== currentUserId) {
        throw new Error('You are not the owner of this comment');
      }
    }

  } catch (err) {
    throw new HttpError(403, 'Forbidden', err);
  }
};

import { ICommentRepo } from 'src/types/ICommentRepo';
import { Comment } from 'src/types/Comment';
import { publishCommentEvent } from 'src/services/redis/comment-events.publisher';

export async function updateCommentByIdAndPostId(params: {
  commentRepo: ICommentRepo;
  id: string;
  postId: string;
  data: Partial<Comment>;
}) {
  const comment = await params.commentRepo.updateCommentByIdAndPostId(params.id, params.postId, params.data);
  if (!comment) {
    throw new Error('Comment not found');
  }
  await publishCommentEvent({ type: 'update', postId: params.postId, comment });
  return comment;
}
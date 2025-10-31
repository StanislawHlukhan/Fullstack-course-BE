import { ICommentRepo } from 'src/types/ICommentRepo';
import { Comment } from 'src/types/Comment';
import { publishCommentEvent } from 'src/services/redis/comment-events.publisher';

export async function createComment(params: {
  commentRepo: ICommentRepo;
  data: Partial<Comment>;
  postId: string;
}) {
  const comment = await params.commentRepo.createComment(params.data, params.postId);
  await publishCommentEvent({ type: 'create', postId: params.postId, comment });
  return comment;
}
import { ICommentRepo } from 'src/types/ICommentRepo';
import { Comment } from 'src/types/Comment';

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
  return comment;
}
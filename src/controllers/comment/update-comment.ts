import { ICommentRepo } from 'src/types/ICommentRepo';
import { Comment } from 'src/types/Comment';

export async function updateComment(params: {
  commentRepo: ICommentRepo;
  id: string;
  data: Partial<Comment>;
}) {
  const comment = await params.commentRepo.updateCommentById(params.id, params.data);
  if (!comment) {
    throw new Error('Comment not found');
  }
  return comment;
}
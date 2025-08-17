import { ICommentRepo } from 'src/types/ICommentRepo';

export async function getCommentsByPostId(params: {
  commentRepo: ICommentRepo;
  postId: string;
}) {
  const comments = await params.commentRepo.getCommentsByPostId(params.postId);
  if (!comments) {
    throw new Error('Comments not found');
  }
  return comments;
}
import { ICommentRepo } from 'src/types/ICommentRepo';
import { IPostRepo } from 'src/types/IPostRepo';
import { ITransactionManager } from 'src/types/ITransaction';

export async function softDeletePost(params: {
  postRepo: IPostRepo;
  commentRepo: ICommentRepo;
  transactionManager: ITransactionManager;
  id: string;
}) {
  return await params.transactionManager.execute(async (ctx) => {
    await params.postRepo.updateDeletedAt(params.id, new Date(), ctx.sharedTx);
    await params.commentRepo.updateDeletedAt(params.id, new Date(), ctx.sharedTx);
    return { success: true };
  });
}
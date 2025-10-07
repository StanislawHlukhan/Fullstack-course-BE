import { ICommentRepo } from 'src/types/ICommentRepo';
import { IIdentityService } from 'src/types/IIdentityService';
import { IPostRepo } from 'src/types/IPostRepo';
import { IProfileRepo } from 'src/types/IProfileRepo';
import { ITransactionManager } from 'src/types/ITransaction';

export async function softDeleteUser(params: {
  profileRepo: IProfileRepo,
  postRepo: IPostRepo,
  commentRepo: ICommentRepo,
  transactionManager: ITransactionManager,
  identityService: IIdentityService,
  id: string
}) {
  const profile = await params.profileRepo.getProfileById(params.id);
  if (profile?.deletedAt) {
    throw new Error('Profile already deleted');
  }
  
  await params.transactionManager.execute(async (ctx) => {
    await params.profileRepo.updateDeletedAt(params.id, new Date(), ctx.sharedTx);
    await params.postRepo.updateDeletedAt(params.id, new Date(), ctx.sharedTx);
    await params.commentRepo.updateDeletedAt(params.id, new Date(), ctx.sharedTx);
  });
  
  await params.identityService.adminDisableUser(profile!.subId);
}
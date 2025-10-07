import { ICommentRepo } from 'src/types/ICommentRepo';
import { IIdentityService } from 'src/types/IIdentityService';
import { IPostRepo } from 'src/types/IPostRepo';
import { IProfileRepo } from 'src/types/IProfileRepo';
import { ITransactionManager } from 'src/types/ITransaction';

export async function softRestoreUser(params: {
  profileRepo: IProfileRepo,
  postRepo: IPostRepo,
  commentRepo: ICommentRepo,
  transactionManager: ITransactionManager,
  identityService: IIdentityService,
  id: string
}) {
  const result = await params.transactionManager.execute(async (ctx) => {
    const profile = await params.profileRepo.getProfileById(params.id, ctx.sharedTx);

    if (!profile?.deletedAt) {
      throw new Error('Profile is not deleted');
    }

    await params.postRepo.updateDeletedAt(params.id, null, ctx.sharedTx);
    await params.commentRepo.updateDeletedAt(params.id, null, ctx.sharedTx);
    await params.profileRepo.updateDeletedAt(params.id, null, ctx.sharedTx);
    
    return profile;
  });
  
  await params.identityService.adminEnableUser(result.subId);
}
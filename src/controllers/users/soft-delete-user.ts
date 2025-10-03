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
  return await params.transactionManager.execute(async (ctx) => {
    // CODE REVIEW: гет винести з транзакції.
    const profile = await params.profileRepo.getProfileById(params.id, ctx.sharedTx);
    if (profile?.deletedAt) {
      throw new Error('Profile already deleted');
    }
    await params.profileRepo.updateDeletedAt(params.id, new Date(), ctx.sharedTx);
    await params.postRepo.updateDeletedAt(params.id, new Date(), ctx.sharedTx);
    await params.commentRepo.updateDeletedAt(params.id, new Date(), ctx.sharedTx);
    // CODE REVIEW: Сторонні сервіси не можна використовувати в транзакції, 
    // Так як вони можуть заблокувати транзакцію на довгий час, і відповідно заблокується база. 
    // Тому всі методи сторонніх сервісів виконуються після транзакції
    await params.identityService.toggleUserAccount(profile!.subId, false);
  });
}